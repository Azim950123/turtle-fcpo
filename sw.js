// Turtle FCPO 30 Hari — service worker
// Bila anda kemas kini app, tukar nombor versi di bawah (v1 -> v2) supaya telefon ambil versi baru.
const CACHE = "turtle-fcpo-v2";
const CORE = ["./", "./index.html", "./manifest.webmanifest",
  "./icons/icon-192.png", "./icons/icon-512.png", "./icons/icon-maskable-512.png",
  "./icons/apple-touch-icon.png", "./icons/favicon-32.png",
  "./notes/bars_rm.webp",
  "./notes/bars_wr.webp",
  "./notes/capital.webp",
  "./notes/discipline.webp",
  "./notes/equity.webp",
  "./notes/full.webp",
  "./notes/full_sop.webp",
  "./notes/ladder.webp",
  "./notes/n.webp",
  "./notes/notes.js",
  "./notes/payoff.webp",
  "./notes/plan.webp",
  "./notes/roll.webp",
  "./notes/ruin.webp",
  "./notes/sessions.webp",
  "./notes/tickval.webp",
  "./notes/z1.webp",
  "./notes/z2.webp",
  "./notes/z3.webp",
  "./notes/z4.webp"];

self.addEventListener("install", e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(CORE)).then(() => self.skipWaiting()));
});
self.addEventListener("activate", e => {
  e.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k))))
    .then(() => self.clients.claim()));
});
self.addEventListener("fetch", e => {
  const req = e.request;
  if (req.method !== "GET") return;
  const url = new URL(req.url);
  // Halaman: cuba internet dulu, jika offline guna salinan simpanan
  if (req.mode === "navigate") {
    e.respondWith(fetch(req).then(r => { const c = r.clone(); caches.open(CACHE).then(x => x.put("./index.html", c)); return r; })
      .catch(() => caches.match("./index.html")));
    return;
  }
  // Fon Google & fail app: guna simpanan, kemas kini di belakang
  if (url.origin === location.origin || url.host.endsWith("fonts.googleapis.com") || url.host.endsWith("fonts.gstatic.com")) {
    e.respondWith(caches.match(req).then(hit => {
      const net = fetch(req).then(r => { if (r && (r.ok || r.type === "opaque")) { const c = r.clone(); caches.open(CACHE).then(x => x.put(req, c)); } return r; }).catch(() => hit);
      return hit || net;
    }));
  }
});
