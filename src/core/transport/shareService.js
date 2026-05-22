import { copyToClipboard } from "./clipboard.js";
import { nativeShare } from "./nativeShare.js";
import { telegramUrl } from "./telegram.js";
import { whatsappUrl } from "./whatsapp.js";
import { buildTeaserPayload } from "../../product/viralTeaser/teaserGenerator.js";
import { TeaserChannel } from "../../product/viralTeaser/teaser.types.js";

/**
 * Channel-aware share payload built around a viral curiosity teaser.
 * Pure mapping; no DOM. Accepts an optional seed for deterministic tests.
 *
 * Channel priority for the UI: WhatsApp → Native → Telegram → Clipboard.
 */
export function buildSharePayload(url, options = {}) {
  return buildTeaserPayload({
    url,
    channel: options.channel || TeaserChannel.GENERIC,
    seed: options.seed,
    mood: options.mood
  });
}

export async function shareNativeOrCopy(url, options = {}) {
  const payload = buildSharePayload(url, { ...options, channel: TeaserChannel.NATIVE });
  const native = await nativeShare(payload).catch(() => ({ ok: false, channel: "native-share" }));
  if (native.ok) return { ...native, teaserId: payload.teaserId };
  const fallback = buildSharePayload(url, { ...options, channel: TeaserChannel.CLIPBOARD });
  const copied = await copyToClipboard(fallback.text);
  return copied.ok ? { ...copied, teaserId: payload.teaserId } : { ok: false, channel: "manual", teaserId: payload.teaserId };
}

export function shareLinks(url, options = {}) {
  const whatsappPayload = buildSharePayload(url, { ...options, channel: TeaserChannel.WHATSAPP });
  const telegramPayload = buildSharePayload(url, { ...options, channel: TeaserChannel.TELEGRAM });
  return {
    whatsapp: whatsappUrl(whatsappPayload),
    telegram: telegramUrl(telegramPayload),
    teaserId: whatsappPayload.teaserId
  };
}
