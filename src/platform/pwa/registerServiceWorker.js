export function registerServiceWorker() {
  if (!("serviceWorker" in navigator)) return;
  window.addEventListener("load", () => {
    // SW must live at the deployment root so its scope covers the whole app.
    // GitHub Pages does not let us set Service-Worker-Allowed headers, so
    // we cannot put the SW under /public/ and claim a wider scope.
    navigator.serviceWorker.register("./service-worker.js").catch(() => undefined);
  });
}
