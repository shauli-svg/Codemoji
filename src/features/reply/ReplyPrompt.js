import { el } from "../../app/dom.js";
import { copy } from "../../product/copy.js";

export function ReplyPrompt({ onReply }) {
  return el("div", { class: "reply-prompt" }, [
    el("button", { class: "primary", type: "button", text: copy.sendBack, onclick: onReply })
  ]);
}
