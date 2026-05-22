const CACHE = "codemoji-x-shell-v2";
const ASSETS = [
  "./",
  "./index.html",
  "./src/app/main.js",
  "./src/styles/tokens.css",
  "./src/styles/base.css",
  "./src/styles/secretBubble.css",
  "./src/styles/onboarding.css",
  "./src/styles/motion.css"
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches
      .open(CACHE)
      .then((cache) => cache.addAll(ASSETS))
      .then(() => self.skipWaiting())
      .catch(() => undefined)
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (event) => {
  if (event.request.method !== "GET") return;
  event.respondWith(fetch(event.request).catch(() => caches.match(event.request)));
});
