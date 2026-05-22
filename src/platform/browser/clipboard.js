export async function writeClipboard(text) {
  return navigator.clipboard.writeText(text);
}
