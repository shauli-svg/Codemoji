import { el, clear } from "../../app/dom.js";
import { onboardingCopy } from "./onboardingCopy.js";

/**
 * Modal-ish tour overlay. Pure DOM, no router coupling.
 * Esc closes; backdrop click closes; Enter advances or closes on the last step.
 * Closing always calls `onClose` so the parent can persist "seen" state.
 *
 * @param {{ onClose: () => void }} props
 */
export function OnboardingTour({ onClose }) {
  let step = 0;
  const total = onboardingCopy.tour.length;

  const heading = el("h2", { class: "tour-heading" });
  const body = el("p", { class: "tour-body" });
  const dots = el("div", { class: "tour-dots", "aria-hidden": "true" });
  const next = el("button", { class: "primary tour-next", type: "button", "aria-label": "המשך" });
  const skip = el("button", { class: "ghost tour-skip", type: "button", text: "דלג" });

  function render() {
    const item = onboardingCopy.tour[step];
    heading.textContent = item.heading;
    body.textContent = item.body;
    next.textContent = step === total - 1 ? "התחל" : "הבא";
    clear(dots);
    for (let i = 0; i < total; i += 1) {
      dots.append(el("span", { class: `tour-dot ${i === step ? "active" : ""}` }));
    }
  }

  function close() {
    document.removeEventListener("keydown", onKey);
    overlay.remove();
    onClose?.();
  }

  function advance() {
    if (step < total - 1) {
      step += 1;
      render();
    } else {
      close();
    }
  }

  function onKey(event) {
    if (event.key === "Escape") {
      event.preventDefault();
      close();
    } else if (event.key === "Enter") {
      event.preventDefault();
      advance();
    }
  }

  next.addEventListener("click", advance);
  skip.addEventListener("click", close);

  const card = el("div", { class: "tour-card", role: "dialog", "aria-modal": "true", "aria-label": "איך CodeMoji עובד" }, [
    heading,
    body,
    dots,
    el("div", { class: "tour-actions" }, [next, skip])
  ]);

  const overlay = el("div", { class: "tour-overlay", role: "presentation" }, [card]);
  overlay.addEventListener("click", (event) => {
    if (event.target === overlay) close();
  });

  // Defer keydown wiring to the next frame so the Enter/Space that
  // opened the tour (via the help button) does not immediately advance
  // it. Also move focus into the modal once mounted for a11y.
  setTimeout(() => {
    document.addEventListener("keydown", onKey);
    next.focus?.();
  }, 0);
  render();
  return overlay;
}
