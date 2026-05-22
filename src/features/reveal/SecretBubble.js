import { el } from "../../app/dom.js";

export function SecretBubble({ state = "locked", message = "" } = {}) {
  const bubble = el("div", { class: `secret-bubble ${state}`, role: "img", "aria-label": "סוד" }, [
    el("div", { class: "bubble-glow" }),
    el("div", { class: "bubble-core" }, [
      state === "open"
        ? el("p", { class: "secret-message", text: message })
        : el("span", { class: "secret-mark", text: "✦" })
    ])
  ]);
  return bubble;
}
