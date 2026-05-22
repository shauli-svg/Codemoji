import { el } from "../../app/dom.js";
import { onboardingCopy } from "./onboardingCopy.js";

/**
 * One-line hint with a "How does this work?" trigger.
 * Renders only when `visible` is true; otherwise returns null and the parent
 * can skip placing it. This keeps the UI calm for return visitors.
 *
 * @param {{ kind: "compose"|"receive"; visible: boolean; onOpenTour: () => void; onDismiss?: () => void }} props
 */
export function OnboardingHint({ kind, visible, onOpenTour, onDismiss }) {
  if (!visible) return null;
  const lookup = kind === "compose" ? onboardingCopy.composeHint : onboardingCopy.receiveHint;
  const root = el("section", {
    class: `onboarding-hint onboarding-hint-${kind}`,
    role: "note",
    "aria-live": "polite"
  });
  root.append(
    el("div", { class: "onboarding-hint-text" }, [
      el("strong", { class: "onboarding-hint-title", text: lookup.title }),
      el("span", { class: "onboarding-hint-body", text: lookup.body })
    ]),
    el("div", { class: "onboarding-hint-actions" }, [
      el("button", {
        class: "onboarding-help",
        type: "button",
        text: onboardingCopy.helpButton,
        "aria-label": onboardingCopy.helpButton,
        onclick: () => onOpenTour?.()
      }),
      el("button", {
        class: "onboarding-dismiss",
        type: "button",
        "aria-label": onboardingCopy.closeButton,
        text: "✕",
        onclick: () => onDismiss?.()
      })
    ])
  );
  return root;
}
