import { el } from "../../app/dom.js";
import { copy } from "../../product/copy.js";

export function ReplyPrompt({ onReply }) {
  return el("div", { class: "reply-prompt" }, [
    el("p", { class: "sub", text: "רוצה לשלוח אחד בחזרה?" }),
    el("button", { class: "primary", type: "button", text: copy.sendBack, onclick: onReply })
  ]);
}

