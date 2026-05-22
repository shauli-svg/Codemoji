export function canNativeShare(payload) {
  return Boolean(navigator.share) && (!navigator.canShare || navigator.canShare(payload));
}

export async function nativeShare(payload) {
  if (!canNativeShare(payload)) return { ok: false, channel: "native-share" };
  await navigator.share(payload);
  return { ok: true, channel: "native-share" };
}
