// CineStory AI Studio - Core Logic (Fixed Version)

// ─────────────────────────────────────────────────────────────────
// 1. Premium Video Catalog (Fallback CDN footage)
// ─────────────────────────────────────────────────────────────────
// Each style has a primary GCS URL + secondary CDN fallbacks
// The video loader tries them in order until one works
const PREMIUM_VIDEO_CATALOG = {
  "Cinematic": [
    "https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4",
    "https://media.w3.org/2010/05/sintel/trailer.mp4",
    "https://media.w3.org/2010/05/bunny/trailer.mp4"
  ],
  "Realistic": [
    "https://media.w3.org/2010/05/bunny/trailer.mp4",
    "https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4",
    "https://media.w3.org/2010/05/sintel/trailer.mp4"
  ],
  "Anime": [
    "https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4",
    "https://media.w3.org/2010/05/bunny/trailer.mp4"
  ],
  "Horror": [
    "https://media.w3.org/2010/05/sintel/trailer.mp4",
    "https://media.w3.org/2010/05/bunny/trailer.mp4"
  ],
  "Fantasy": [
    "https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4",
    "https://media.w3.org/2010/05/sintel/trailer.mp4"
  ],
  "Documentary": [
    "https://media.w3.org/2010/05/bunny/trailer.mp4",
    "https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4"
  ],
  "Adventure": [
    "https://media.w3.org/2010/05/sintel/trailer.mp4",
    "https://media.w3.org/2010/05/bunny/trailer.mp4"
  ],
  "Kids story": [
    "https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4",
    "https://media.w3.org/2010/05/bunny/trailer.mp4"
  ],
  "Motivational": [
    "https://media.w3.org/2010/05/sintel/trailer.mp4",
    "https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4"
  ]
};

// Absolute last-resort fallback URLs from different CDNs entirely
// Used only when ALL catalog URLs fail for a scene
const HARDCODED_LAST_RESORT_VIDEOS = [
  "https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4",
  "https://media.w3.org/2010/05/sintel/trailer.mp4",
  "https://media.w3.org/2010/05/bunny/trailer.mp4"
];

// ─────────────────────────────────────────────────────────────────
// Canvas Animated Fallback — shown when all video URLs fail
// Generates a style-matched animated gradient so the player is
// never black, even if all CDN sources are unreachable
// ─────────────────────────────────────────────────────────────────
const STYLE_GRADIENTS = {
  "Cinematic":    [["#0a0a1a", "#1a0533", "#0d1b2a"], ["#1a0533", "#2d1b69", "#0a0a1a"]],
  "Realistic":    [["#1a1a2e", "#16213e", "#0f3460"], ["#16213e", "#0f3460", "#1a1a2e"]],
  "Anime":        [["#ff6b9d", "#c44569", "#f8a5c2"], ["#c44569", "#f8a5c2", "#ff6b9d"]],
  "Horror":       [["#0d0000", "#1a0000", "#2d0000"], ["#1a0000", "#3d0000", "#0d0000"]],
  "Fantasy":      [["#0d1b2a", "#1b4332", "#2d6a4f"], ["#1b4332", "#40916c", "#0d1b2a"]],
  "Documentary":  [["#1a2f1a", "#2d4a1e", "#3d5a2a"], ["#2d4a1e", "#4a7c3f", "#1a2f1a"]],
  "Adventure":    [["#1a0a00", "#2d1500", "#4a2800"], ["#2d1500", "#6b3d00", "#1a0a00"]],
  "Kids story":   [["#1a0066", "#6600cc", "#9933ff"], ["#6600cc", "#cc33ff", "#1a0066"]],
  "Motivational": [["#0d0d1a", "#1a1a3d", "#0d2d4a"], ["#1a1a3d", "#2d2d6b", "#0d0d1a"]]
};

let canvasFallbackAnim = null;

function startCanvasFallback(containerEl, style) {
  stopCanvasFallback();

  const canvas = document.createElement("canvas");
  canvas.style.cssText = `
    position:absolute; inset:0; width:100%; height:100%;
    z-index:2; pointer-events:none;
  `;
  canvas.id = "canvas-fallback";
  containerEl.appendChild(canvas);

  const ctx = canvas.getContext("2d");
  const colors = STYLE_GRADIENTS[style] || STYLE_GRADIENTS["Cinematic"];
  let t = 0;
  let phase = 0;

  // Floating particles
  const particles = Array.from({ length: 20 }, () => ({
    x: Math.random(), y: Math.random(),
    vx: (Math.random() - 0.5) * 0.0008,
    vy: (Math.random() - 0.5) * 0.0008,
    r: Math.random() * 3 + 1,
    a: Math.random() * 0.4 + 0.1
  }));
