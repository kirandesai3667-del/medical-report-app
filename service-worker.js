const CACHE_NAME = "medical-app-cache-v1";

self.addEventListener("install", event => {
  console.log("Service Worker Installed");
});

self.addEventListener("fetch", event => {
  event.respondWith(fetch(event.request));
});
