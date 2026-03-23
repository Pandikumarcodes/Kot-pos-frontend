// Service Worker for KOT POS

const CACHE_NAME = "kot-pos-v1";
const API_CACHE = "kot-pos-api-v1";

// Assets to pre-cache on install
const PRECACHE_URLS = ["/", "/offline.html"];

// ── Install — pre-cache shell ─────────────────────────────────
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(PRECACHE_URLS);
    }),
  );
  self.skipWaiting();
});

// ── Activate — clean up old caches ───────────────────────────
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(
          keys
            .filter((key) => key !== CACHE_NAME && key !== API_CACHE)
            .map((key) => caches.delete(key)),
        ),
      ),
  );
  self.clients.claim();
});

// ── Fetch — routing strategy ──────────────────────────────────
self.addEventListener("fetch", (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip non-GET requests and chrome-extension requests
  if (request.method !== "GET") return;
  if (url.protocol === "chrome-extension:") return;

  // ── API calls → Network First ──────────────────────────────
  if (url.pathname.startsWith("/api/")) {
    event.respondWith(networkFirst(request, API_CACHE, 60));
    return;
  }

  // ── Static assets → Cache First ───────────────────────────
  if (url.pathname.match(/\.(js|css|png|jpg|jpeg|svg|ico|woff|woff2|ttf)$/)) {
    event.respondWith(cacheFirst(request, CACHE_NAME));
    return;
  }

  // ── Navigation (HTML) → Network First + offline fallback ──
  if (request.mode === "navigate") {
    event.respondWith(
      fetch(request).catch(() => caches.match("/offline.html")),
    );
    return;
  }
});

// ── Cache First strategy ──────────────────────────────────────
async function cacheFirst(request, cacheName) {
  const cached = await caches.match(request);
  if (cached) return cached;

  const response = await fetch(request);
  if (response.ok) {
    const cache = await caches.open(cacheName);
    cache.put(request, response.clone());
  }
  return response;
}

// ── Network First strategy ────────────────────────────────────
// Falls back to cache if network fails
async function networkFirst(request, cacheName, maxAgeSeconds) {
  try {
    const response = await fetch(request);
    if (response.ok) {
      const cache = await caches.open(cacheName);
      cache.put(request, response.clone());
    }
    return response;
  } catch {
    const cached = await caches.match(request);
    if (cached) {
      // Check if cache is still fresh enough
      const dateHeader = cached.headers.get("date");
      if (dateHeader) {
        const age = (Date.now() - new Date(dateHeader).getTime()) / 1000;
        if (age < maxAgeSeconds) return cached;
      }
      return cached;
    }
    // Return empty 503 if nothing cached
    return new Response(JSON.stringify({ error: "You are offline" }), {
      status: 503,
      headers: { "Content-Type": "application/json" },
    });
  }
}
