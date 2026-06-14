import { textWithSingleUrl } from "./shareText.js";

export function cleanWhatsappText(value) {
  return String(value ?? "")
    .normalize("NFC")
    .replace(/[\uFEFF\uFFFD]/gu, "")
    .replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/gu, "")
    .replace(/\r\n/g, "\n")
    .trim();
}

export function whatsappUrl(payload) {
  const text = cleanWhatsappText(textWithSingleUrl(payload));
  return `https://wa.me/?text=${encodeURIComponent(text)}`;
}
