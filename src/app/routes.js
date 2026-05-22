export function setComposeRoute() {
  history.pushState(null, "", window.location.pathname);
}

export function setCapsuleRoute(encodedCapsule) {
  history.pushState(null, "", `${window.location.pathname}#${encodedCapsule}`);
}
