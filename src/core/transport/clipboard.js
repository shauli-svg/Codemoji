export async function copyToClipboard(value) {
  try {
    await navigator.clipboard.writeText(value);
    return { ok: true, channel: "clipboard" };
  } catch {
    return { ok: false, channel: "clipboard" };
  }
}
