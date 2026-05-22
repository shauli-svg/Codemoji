import { textWithSingleUrl } from "./shareText.js";

export function whatsappUrl(payload) {
  const text = textWithSingleUrl(payload);
  return `https://wa.me/?text=${encodeURIComponent(text)}`;
}
