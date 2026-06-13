import { el } from "../../app/dom.js";
import { copy } from "../../product/copy.js";
import { shareLinks, shareNativeOrCopy, buildSharePayload } from "../../core/transport/shareService.js";
import { copyToClipboard } from "../../core/transport/clipboard.js";
import { TeaserChannel } from "../../product/viralTeaser/teaser.types.js";

/**
 * Share order is deliberate (WhatsApp-first per ADR 0006):
 *   1. WhatsApp link  - primary viral channel for Hebrew users.
 *   2. Native share   - lets iOS/Android pick anything else (incl. iMessage).
 *   3. Telegram       - secondary chat channel.
 *   4. Copy link      - manual fallback.
 *
 * The visible "preview line" mirrors the same teaser the recipient will see
 * so the sender is never surprised by what we ship to the chat.
 */
export function ShareSheet({ url, onReset }) {
  const status = el("p", { class: "sub", text: "" });
  const links = shareLinks(url);
  const preview = buildSharePayload(url, { channel: TeaserChannel.WHATSAPP });

  const root = el("main", { class: "screen share" }, [
    el("section", { class: "ritual-card" }, [
      el("p", { class: "eyebrow", text: copy.brand }),
      el("h1", { text: copy.secretReady }),
      el("div", { class: "mini-bubble", text: preview.teaserEmoji || "✦" }),
      el("p", { class: "ritual-step", text: "3 / שליחה בצ׳אט" }),
      el("p", { class: "sub", text: copy.privacyHint }),
      el("pre", { class: "share-preview", "aria-label": "תצוגה מקדימה של הטקסט שיישלח", text: preview.text }),
      el("div", { class: "button-stack" }, [
        el("a", {
          class: "primary primary-link",
          href: links.whatsapp,
          target: "_blank",
          rel: "noreferrer",
          "data-channel": "whatsapp",
          text: copy.shareWhatsapp
        }),
        el("button", { class: "secondary", type: "button", text: copy.shareNative, onclick: async () => {
          const result = await shareNativeOrCopy(url);
          status.textContent = result.channel === "clipboard" ? copy.copied : "";
        }}),
        el("a", { class: "secondary", href: links.telegram, target: "_blank", rel: "noreferrer", text: copy.shareTelegram }),
        el("button", { class: "ghost", type: "button", text: copy.copyLink, onclick: async () => {
          const fallback = buildSharePayload(url, { channel: TeaserChannel.CLIPBOARD });
          const result = await copyToClipboard(fallback.text);
          status.textContent = result.ok ? copy.copied : "לא הועתק אוטומטית";
        }}),
        el("button", { class: "ghost", type: "button", text: copy.reset, onclick: onReset })
      ]),
      status,
      el("details", { class: "manual-link" }, [
        el("summary", { text: "העתיקו קישור" }),
        el("textarea", { readonly: "true", text: url })
      ])
    ])
  ]);
  return root;
}

