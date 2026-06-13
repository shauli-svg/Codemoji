import { el } from "../../app/dom.js";

export function SecretBubble({ state = "locked", message = "" } = {}) {
  const isOpen = state === "open";
  const bubble = el("div", {
    class: "secret-bubble " + state,
    role: isOpen ? "status" : "img",
    "aria-label": isOpen ? "הסוד נפתח" : "סוד נעול",
    "aria-live": isOpen ? "polite" : "off",
    "data-state": state
  }, [
    el("div", { class: "bubble-glow" }),
    el("div", { class: "bubble-core" }, [
      isOpen
        ? el("p", { class: "secret-message", text: message })
        : el("span", { class: "secret-mark", "aria-hidden": "true", text: "✦" })
    ])
  ]);
  return bubble;
}
