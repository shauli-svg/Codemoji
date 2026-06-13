import { el, clear } from "../../app/dom.js";
import { parseCapsule } from "../../core/capsule/capsuleCodec.js";
import { decryptWithPattern } from "../../core/crypto/cryptoEngine.js";
import { userCopyForError } from "../../core/errors/errorCopy.js";
import { copy } from "../../product/copy.js";
import { FeatureFlags } from "../../core/config/featureFlags.js";
import { onboardingStore } from "../../core/storage/onboardingStore.js";
import { OnboardingHint } from "../onboarding/OnboardingHint.js";
import { OnboardingTour } from "../onboarding/OnboardingTour.js";
import { PatternGrid } from "../reveal/PatternGrid.js";
import { SecretBubble } from "../reveal/SecretBubble.js";
import { ReplyPrompt } from "../reply/ReplyPrompt.js";

export function ReceiveScreen({ rawCapsule, onReply }) {
  const card = el("section", { class: "ritual-card" });
  const root = el("main", { class: "screen receive" }, [card]);
  let pattern = [];
  let capsule;

  try {
    capsule = parseCapsule(rawCapsule);
  } catch (error) {
    clear(card);
    card.append(
      el("p", { class: "eyebrow", text: copy.brand }),
      el("h1", { text: copy.malformed }),
      SecretBubble({ state: "error" }),
      el("button", { class: "primary", type: "button", text: copy.sendBack, onclick: onReply })
    );
    return root;
  }

  const status = el("p", { class: "sub", text: capsule.hint || copy.receivedHint });
  const action = el("button", { class: "primary disabled", type: "button", text: copy.openSecret });

  function resetAction() {
    action.disabled = true;
    action.classList.add("disabled");
    action.classList.remove("working");
  }

  function renderLocked(state = "locked") {
    clear(card);
    const patternGrid = PatternGrid({
      onChange(next) {
        pattern = next;
        const ready = pattern.length >= 4;
        action.classList.toggle("disabled", !ready);
        action.disabled = !ready;
      }
    });
    const showHint = FeatureFlags.onboardingHint && !onboardingStore.get().receiveIntroSeen;
    const hint = OnboardingHint({
      kind: "receive",
      visible: showHint,
      onOpenTour() {
        if (!FeatureFlags.onboardingTour) return;
        onboardingStore.markReceiveIntroSeen();
        document.body.append(OnboardingTour({
          onClose() {
            onboardingStore.markTourSeen();
            hint?.remove();
          }
        }));
      },
      onDismiss() {
        onboardingStore.markReceiveIntroSeen();
        hint?.remove();
      }
    });
    card.append(
      el("p", { class: "eyebrow", text: copy.brand }),
      el("p", { class: "ritual-step", text: "1 / קיבלת סוד" }),
      el("h1", { text: copy.receivedTitle }),
      hint,
      SecretBubble({ state }),
      status,
      patternGrid,
      action
    );
    onboardingStore.markFirstRun();
  }

  async function unlock() {
    if (action.disabled) return;
    try {
      action.disabled = true;
      status.textContent = "פותח…";
      action.classList.add("working");
      clear(card);
      card.append(el("h1", { text: copy.receivedTitle }), SecretBubble({ state: "unlocking" }), status);
      const message = await decryptWithPattern({ capsule, pattern });
      clear(card);
      card.append(
        el("p", { class: "eyebrow", text: copy.brand }),
        el("p", { class: "ritual-step", text: "2 / הסוד נפתח" }),
        el("h1", { text: copy.secretOpened }),
        SecretBubble({ state: "open", message }),
        ReplyPrompt({ onReply })
      );
    } catch (error) {
      status.textContent = userCopyForError(error?.code) + ". " + copy.tryAgain;
      pattern = [];
      resetAction();
      renderLocked("error");
    }
  }

  resetAction();
  action.addEventListener("click", unlock);
  renderLocked();
  return root;
}

