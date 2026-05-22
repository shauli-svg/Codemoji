import { el } from "../../app/dom.js";
import { encodeCapsule } from "../../core/capsule/capsuleCodec.js";
import { encryptWithPattern } from "../../core/crypto/cryptoEngine.js";
import { copy } from "../../product/copy.js";
import { limits } from "../../product/limits.js";
import { FeatureFlags } from "../../core/config/featureFlags.js";
import { onboardingStore } from "../../core/storage/onboardingStore.js";
import { OnboardingHint } from "../onboarding/OnboardingHint.js";
import { OnboardingTour } from "../onboarding/OnboardingTour.js";
import { PatternGrid } from "../reveal/PatternGrid.js";
import { SecretBubble } from "../reveal/SecretBubble.js";
import { ShareSheet } from "../share/ShareSheet.js";

export function ComposeScreen({ onReady, onReset }) {
  let pattern = [];
  const input = el("textarea", {
    class: "secret-input",
    maxlength: String(limits.maxMessageLength),
    placeholder: copy.composePlaceholder,
    "aria-label": copy.composeTitle
  });
  const status = el("p", { class: "sub", text: copy.chooseSign });
  const action = el("button", { class: "primary disabled", type: "button", text: copy.lockSecret });

  const patternGrid = PatternGrid({
    onChange(next) {
      pattern = next;
      const ready = pattern.length >= limits.minPatternPoints && input.value.trim().length > 0;
      action.classList.toggle("disabled", !ready);
      action.disabled = !ready;
    }
  });

  async function createCapsule() {
    if (action.disabled) return;
    try {
      action.disabled = true;
      status.textContent = "סוגר את הסוד…";
      const capsule = await encryptWithPattern({ plainText: input.value, pattern, skin: "bubble" });
      const encoded = encodeCapsule(capsule);
      const url = `${window.location.origin}${window.location.pathname}#${encoded}`;
      onReady(url);
    } catch (error) {
      status.textContent = error?.code === "MESSAGE_TOO_LONG" ? "הסוד ארוך מדי" : "צריך סוד וסימן ברור";
      action.disabled = false;
    }
  }

  action.disabled = true;
  action.addEventListener("click", createCapsule);
  input.addEventListener("input", () => {
    const ready = pattern.length >= limits.minPatternPoints && input.value.trim().length > 0;
    action.classList.toggle("disabled", !ready);
    action.disabled = !ready;
  });

  const showHint = FeatureFlags.onboardingHint && !onboardingStore.get().composeIntroSeen;
  const hint = OnboardingHint({
    kind: "compose",
    visible: showHint,
    onOpenTour() {
      if (!FeatureFlags.onboardingTour) return;
      onboardingStore.markComposeIntroSeen();
      document.body.append(OnboardingTour({
        onClose() {
          onboardingStore.markTourSeen();
          hint?.remove();
        }
      }));
    },
    onDismiss() {
      onboardingStore.markComposeIntroSeen();
      hint?.remove();
    }
  });

  onboardingStore.markFirstRun();

  return el("main", { class: "screen compose" }, [
    el("section", { class: "ritual-card" }, [
      el("p", { class: "eyebrow", text: copy.brand }),
      el("h1", { text: copy.composeTitle }),
      el("p", { class: "lead", text: copy.composeIntroLead }),
      hint,
      SecretBubble({ state: "locked" }),
      input,
      status,
      patternGrid,
      action,
      el("button", { class: "ghost", type: "button", text: "איפוס", onclick: onReset })
    ])
  ]);
}

export function ShareReadyScreen(props) {
  return ShareSheet(props);
}
