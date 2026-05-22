const BAD_TRANSPORT_CHARS = /[\uFEFF\uFFFD]/g;

export function cleanTransportText(value) {
  return String(value ?? "")
    .normalize("NFC")
    .replace(BAD_TRANSPORT_CHARS, "")
    .replace(/\r\n/g, "\n")
    .trim();
}

function escapeRegExp(value) {
  return String(value).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

export function textWithSingleUrl(payload) {
  const text = cleanTransportText(payload?.text);
  const url = cleanTransportText(payload?.url);
  if (!url) return text;
  if (!text) return url;
  return text.includes(url) ? text : `${text}\n${url}`;
}

export function textWithoutUrl(payload) {
  const text = cleanTransportText(payload?.text);
  const url = cleanTransportText(payload?.url);
  if (!url) return text;
  return text
    .replace(new RegExp(`\\n?${escapeRegExp(url)}\\s*`, "g"), "")
    .trim();
}
