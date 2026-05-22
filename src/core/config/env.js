export function getBaseUrl() {
  return `${window.location.origin}${window.location.pathname}`;
}

export function getBuildId() {
  return document.querySelector('meta[name="build-id"]')?.content ?? "dev";
}
