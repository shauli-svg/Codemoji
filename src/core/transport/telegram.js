import { textWithoutUrl } from "./shareText.js";

export function telegramUrl(payload) {
  const text = textWithoutUrl(payload);
  return `https://t.me/share/url?url=${encodeURIComponent(payload.url)}&text=${encodeURIComponent(text)}`;
}
