// CineStory AI Studio - repaired compact app.js

const VIDEO_CATALOG = {
  Cinematic: [
    "https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4"
  ],
  Realistic: [
    "https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4"
  ],
  Anime: [
    "https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4"
  ],
  Horror: [
    "https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4"
  ],
  Fantasy: [
    "https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4"
  ],
  Documentary: [
    "https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4"
  ],
  Adventure: [
    "https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4"
  ],
  "Kids story": [
    "https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4"
  ],
  Motivational: [
    "https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4"
  ]
};

const AUDIO_URLS = [
  "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
  "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3"
];

const DEBUG_PREFIX = "[CineStory Media]";

const logMedia = (label, payload = {}) => console.log(`${DEBUG_PREFIX} ${label}`, payload);
const warnMedia = (label, payload = {}) => console.warn(`${DEBUG_PREFIX} ${label}`, payload);
const errorMedia = (label, payload = {}) => console.error(`${DEBUG_PREFIX} ${label}`, payload);

let elements = {};
let appState = {
  prompt: "",
  style: "Cinematic",
  language: "English",
  duration: 30,
  aspectRatio: "16:9",
  generatedTitle: "",
  characterBio: "",
  scenes: [],
  activeSceneIndex: 0,
  isPlaying: false,
  audioUnlocked: false,
  soundtrack: "cinematic_epic"
};

let elapsedTime = 0;
let totalMovieDuration = 30;
let sceneStartTimes = [];
let playerTimer = null;
let lastTick = 0;
let bgAudio = null;
let spokenScenes = new Set();
let currentLoadToken = 0;
let mediaValidationCache = new Map();

document.addEventListener("DOMContentLoaded", () => {
  cacheElements();
  loadSettings();
  setupEvents();
  setupMediaEvents();
  startParticles();
  renderTemplates();
  updateAspectRatio();

  if (window.feather) feather.replace();
});

function cacheElements() {
  elements = {
    setupScreen: document.getElementById("setup-screen"),
    workspaceScreen: document.getElementById("workspace-screen"),
    promptInput: document.getElementById("prompt-input"),
    generateBtn: document.getElementById("generate-btn"),
    randomPromptBtn: document.getElementById("random-prompt-btn"),
    styleSelect: document.getElementById("style-select"),
    languageSelect: document.getElementById("language-select"),
    ratioSelector: document.getElementById("ratio-selector"),
    durationSelector: document.getElementById("duration-selector"),
    templatesGrid: document.getElementById("templates-grid"),
    previewContainer: document.getElementById("video-preview-container"),
    previewVideo: document.getElementById("preview-video"),
    placeholder: document.getElementById("video-placeholder"),
    renderOverlay: document.getElementById("render-overlay"),
    renderTitle: document.getElementById("render-stage-title"),
    renderDesc: document.getElementById("render-stage-desc"),
    progressFill: document.getElementById("progress-fill"),
    progressPct: document.getElementById("progress-pct"),
    playPauseBtn: document.getElementById("play-pause-btn"),
    stopBtn: document.getElementById("stop-btn"),
    scrubber: document.getElementById("player-scrubber"),
    timeCurrent: document.getElementById("player-time-current"),
    timeDuration: document.getElementById("player-time-duration"),
    subtitleText: document.getElementById("subtitle-text"),
    timelineList: document.getElementById("timeline-list"),
    tabContentArea: document.getElementById("tab-content-area"),
    voiceVolumeSlider: document.getElementById("voice-volume-slider"),
    musicVolumeSlider: document.getElementById("music-volume-slider"),
    soundtrackSelect: document.getElementById("soundtrack-select"),
    regenerateAllBtn: document.getElementById("regenerate-all-scenes-btn"),
    exportVideoBtn: document.getElementById("export-video-btn"),
    returnSetupBtn: document.getElementById("return-setup-btn"),
    toastContainer: document.getElementById("toast-container"),
    themeBtn: document.getElementById("theme-btn"),
    settingsBtn: document.getElementById("settings-btn"),
    settingsModal: document.getElementById("settings-modal"),
    settingsClose: document.getElementById("settings-close-btn"),
    settingsCancel: document.getElementById("settings-cancel-btn"),
    settingsSave: document.getElementById("settings-save-btn"),
    historyBtn: document.getElementById("history-btn"),
    historyModal: document.getElementById("history-modal"),
    historyClose: document.getElementById("history-close-btn"),
    historyDone: document.getElementById("history-done-btn"),
    historyClear: document.getElementById("history-clear-btn"),
    historyList: document.getElementById("history-list-container")
  };
}

function setupEvents() {
  document.addEventListener("click", unlockAudio, { passive: true });
  document.addEventListener("keydown", unlockAudio, { passive: true });
  document.addEventListener("touchstart", unlockAudio, { passive: true });

  elements.generateBtn?.addEventListener("click", generateStoryVideo);
  elements.randomPromptBtn?.addEventListener("click", () => {
    const prompts = [
      "A diver discovers a glowing temple below the ocean.",
      "A lonely astronaut finds a garden on a frozen moon.",
      "A detective follows blue footprints through a rainy city.",
      "A child opens a magical gate inside an ancient forest."
    ];
    elements.promptInput.value = prompts[Math.floor(Math.random() * prompts.length)];
  });

  document.querySelectorAll(".suggestion-pill").forEach((pill) => {
    pill.addEventListener("click", () => {
      elements.promptInput.value = pill.dataset.prompt || pill.textContent;
    });
  });

  elements.styleSelect?.addEventListener("change", (e) => {
    appState.style = e.target.value;
  });

  elements.languageSelect?.addEventListener("change", (e) => {
    appState.language = e.target.value;
  });

  elements.ratioSelector?.querySelectorAll(".selector-option").forEach((option) => {
    option.addEventListener("click", () => {
      elements.ratioSelector.querySelectorAll(".selector-option").forEach((x) => x.classList.remove("active"));
      option.classList.add("active");
      appState.aspectRatio = option.dataset.ratio;
      updateAspectRatio();
    });
  });

  elements.durationSelector?.querySelectorAll(".selector-option").forEach((option) => {
    option.addEventListener("click", () => {
      elements.durationSelector.querySelectorAll(".selector-option").forEach((x) => x.classList.remove("active"));
      option.classList.add("active");
      appState.duration = Number(option.dataset.duration || 30);
    });
  });

  elements.playPauseBtn?.addEventListener("click", () => {
    unlockAudio();
    appState.isPlaying ? pausePlayback() : startPlayback();
  });

  elements.stopBtn?.addEventListener("click", stopPlayback);

  elements.scrubber?.addEventListener("input", () => {
    scrubTo(Number(elements.scrubber.value || 0));
  });

  elements.voiceVolumeSlider?.addEventListener("input", () => {
    logMedia("audio volume", { voice: Number(elements.voiceVolumeSlider.value) });
  });

  elements.musicVolumeSlider?.addEventListener("input", () => {
    if (bgAudio) bgAudio.volume = Number(elements.musicVolumeSlider.value || 0.4);
  });

  elements.soundtrackSelect?.addEventListener("change", (e) => {
    appState.soundtrack = e.target.value;
    if (appState.isPlaying) playBackgroundMusic();
  });

  elements.regenerateAllBtn?.addEventListener("click", async () => {
    for (let i = 0; i < appState.scenes.length; i++) {
      appState.scenes[i].videoUrl = await getPlayableFallbackVideo(i);
    }
    updateTimeline();
    loadSceneVideo(appState.activeSceneIndex, { autoplay: appState.isPlaying, reason: "resync" });
  });

  elements.returnSetupBtn?.addEventListener("click", () => {
    stopPlayback();
    showScreen("setup");
  });

  elements.exportVideoBtn?.addEventListener("click", () => {
    showToast("Export is not available in this static version. Preview playback is fixed.", "error");
  });

  elements.themeBtn?.addEventListener("click", () => {
    const next = document.body.getAttribute("data-theme") === "light" ? "dark" : "light";
    document.body.setAttribute("data-theme", next);
    localStorage.setItem("studio-theme", next);
  });

  elements.settingsBtn?.addEventListener("click", () => elements.settingsModal?.classList.remove("hidden"));
  elements.settingsClose?.addEventListener("click", () => elements.settingsModal?.classList.add("hidden"));
  elements.settingsCancel?.addEventListener("click", () => elements.settingsModal?.classList.add("hidden"));
  elements.settingsSave?.addEventListener("click", () => {
    elements.settingsModal?.classList.add("hidden");
    showToast("Settings saved locally.", "success");
  });

  elements.historyBtn?.addEventListener("click", () => {
    renderHistory();
    elements.historyModal?.classList.remove("hidden");
  });
  elements.historyClose?.addEventListener("click", () => elements.historyModal?.classList.add("hidden"));
  elements.historyDone?.addEventListener("click", () => elements.historyModal?.classList.add("hidden"));
  elements.historyClear?.addEventListener("click", () => {
    localStorage.removeItem("cinestory-history");
    renderHistory();
  });
}

function setupMediaEvents() {
  const video = elements.previewVideo;
  if (!video) return;

  video.addEventListener("loadstart", () => logMedia("video loadstart", { src: video.currentSrc || video.src }));
  video.addEventListener("loadedmetadata", () => {
    logMedia("video metadata loaded", {
      src: video.currentSrc,
      duration: video.duration,
      width: video.videoWidth,
      height: video.videoHeight
    });
  });
  video.addEventListener("canplay", () => logMedia("video canplay", { src: video.currentSrc }));
  video.addEventListener("playing", () => logMedia("playback state", { state: "video-playing", elapsedTime }));
  video.addEventListener("waiting", () => logMedia("video buffering", { src: video.currentSrc }));
  video.addEventListener("error", () => {
    errorMedia("video play error", {
      src: video.currentSrc || video.src,
      code: video.error?.code,
      message: video.error?.message
    });
  });
}

function loadSettings() {
  document.body.setAttribute("data-theme", localStorage.getItem("studio-theme") || "dark");
}

function unlockAudio() {
  if (appState.audioUnlocked) return;
  appState.audioUnlocked = true;

  if (!bgAudio) {
    bgAudio = new Audio();
    bgAudio.loop = true;
    bgAudio.preload = "auto";
    bgAudio.volume = Number(elements.musicVolumeSlider?.value || 0.4);
  }

  if ("speechSynthesis" in window) {
    window.speechSynthesis.getVoices();
  }

  logMedia("audio unlocked", { triggered: "user gesture" });
}

async function validateMediaUrl(url, type = "video") {
  const cleaned = String(url || "").trim();
  const cacheKey = `${type}:${cleaned}`;

  if (!cleaned || cleaned === "undefined" || cleaned === "null") {
    return { ok: false, reason: "empty-url", url };
  }

  if (mediaValidationCache.has(cacheKey)) return mediaValidationCache.get(cacheKey);

  const expected = type === "audio" ? "audio/" : "video/";

  try {
    const res = await fetch(cleaned, { method: type === "audio" ? "GET" : "HEAD", redirect: "follow", cache: "no-store" });
    const contentType = (res.headers.get("content-type") || "").toLowerCase();

    const result = {
      ok: res.ok && contentType.startsWith(expected),
      url: cleaned,
      finalUrl: res.url || cleaned,
      status: res.status,
      contentType,
      reason: res.ok ? "checked" : "non-2xx-response"
    };

    if (result.ok) logMedia(`${type} url validation`, result);
    else warnMedia(`${type} url validation`, result);

    mediaValidationCache.set(cacheKey, result);
    return result;
  } catch (err) {
    const result = await mediaElementProbe(cleaned, type);
    mediaValidationCache.set(cacheKey, result);
    return result;
  }
}

function mediaElementProbe(url, type = "video") {
  return new Promise((resolve) => {
    const el = document.createElement(type === "audio" ? "audio" : "video");
    let done = false;

    el.preload = "metadata";
    if (type === "video") {
      el.muted = true;
      el.playsInline = true;
    }

    const finish = (result) => {
      if (done) return;
      done = true;
      clearTimeout(timer);
      el.remove();
      if (result.ok) logMedia(`${type} url validation`, result);
      else warnMedia(`${type} url validation`, result);
      resolve(result);
    };

    const timer = setTimeout(() => {
      finish({ ok: false, url, finalUrl: url, reason: "media-probe-timeout" });
    }, 8000);

    el.addEventListener("loadedmetadata", () => {
      finish({ ok: true, url, finalUrl: el.currentSrc || url, reason: "media-element-probe" });
    });

    el.addEventListener("error", () => {
      finish({
        ok: false,
        url,
        finalUrl: url,
        reason: "media-element-error",
        code: el.error?.code,
        message: el.error?.message
      });
    });

    el.src = url;
    el.load();
  });
}

async function getPlayableFallbackVideo(seed = 0) {
  const list = VIDEO_CATALOG[appState.style] || VIDEO_CATALOG.Cinematic;
  const candidates = [...new Set([
    list[Math.abs(seed) % list.length],
    ...list,
    ...VIDEO_CATALOG.Cinematic
  ])];

  for (const url of candidates) {
    const validation = await validateMediaUrl(url, "video");
    if (validation.ok) return validation.finalUrl || url;
  }

  return "";
}

async function generateStoryVideo() {
  const prompt = elements.promptInput?.value.trim();

  if (!prompt) {
    showToast("Please enter a story idea first.", "error");
    return;
  }

  unlockAudio();
  stopPlayback();

  appState.prompt = prompt;
  appState.style = elements.styleSelect?.value || "Cinematic";
  appState.language = elements.languageSelect?.value || "English";
  appState.duration = getSelectedDuration();

  showScreen("workspace");
  showRenderOverlay(true);
  updateProgress(1, 20, "Writing screenplay...", "Creating scene timeline and narration.");

  try {
    await delay(600);

    const sceneCount = appState.duration <= 30 ? 3 : appState.duration <= 60 ? 5 : 8;
    const sceneDuration = Math.ceil(appState.duration / sceneCount);

    appState.generatedTitle = makeTitle(prompt);
    appState.characterBio = "A cinematic protagonist shaped by mystery, courage, and discovery.";
    appState.scenes = [];

    updateProgress(2, 45, "Finding playable footage...", "Validating video URLs before loading preview.");

    for (let i = 0; i < sceneCount; i++) {
      const videoUrl = await getPlayableFallbackVideo(i);
      appState.scenes.push({
        sceneId: i,
        prompt: makeScenePrompt(prompt, i, sceneCount),
        narration: makeNarration(i, sceneCount, appState.language),
        duration: sceneDuration,
        videoUrl,
        audioStatus: "browser-speech-ready",
        mediaReady: Boolean(videoUrl)
      });

      logMedia("generated urls", { scene: i + 1, videoUrl });
      updateProgress(2, 45 + Math.floor((i / sceneCount) * 35), "Preparing media...", `Scene ${i + 1} ready.`);
    }

    updateProgress(3, 90, "Syncing voice and timeline...", "Preparing subtitles and browser narration.");
    initializeTimeline();
    renderWorkspaceTabs("script");
    updateTimeline();
    saveHistory();

    await loadSceneVideo(0, { autoplay: false, reason: "generation-complete" });

    updateProgress(4, 100, "Ready", "Preview loaded.");
    await delay(300);
    showRenderOverlay(false);
    showToast("AI story video preview is ready.", "success");
  } catch (err) {
    errorMedia("generation failed", { message: err.message });
    showRenderOverlay(false);
    showToast("Generation failed: " + err.message, "error");
  }
}

function makeTitle(prompt) {
  return "Chronicles of " + prompt.split(/\s+/).slice(0, 4).join(" ");
}

function makeScenePrompt(prompt, index, total) {
  if (index === 0) return `Cinematic establishing shot showing: ${prompt}`;
  if (index === total - 1) return `Final cinematic shot resolving the story: ${prompt}`;
  if (index === Math.floor(total / 2)) return `Emotional close up of the main character, dramatic lighting, ${appState.style}`;
  return `Wide cinematic tracking shot, atmospheric movement, ${appState.style}`;
}

function makeNarration(index, total, lang) {
  const lines = {
    English: [
      "In a world touched by mystery, a quiet moment begins to change everything.",
      "The path ahead is uncertain, but courage rises with every step.",
      "At the edge of fear and hope, one choice reveals the truth.",
      "And so the journey continues, written into memory like light across the sky."
    ],
    Hindi: [
      "एक रहस्यमय दुनिया में, एक शांत क्षण सब कुछ बदलना शुरू कर देता है।",
      "आगे का रास्ता अनिश्चित है, लेकिन साहस हर कदम के साथ बढ़ता है।",
      "भय और आशा के किनारे पर, एक निर्णय सत्य को प्रकट करता है।",
      "और इस तरह यात्रा जारी रहती है, जैसे आकाश में रोशनी।"
    ],
    Odia: [
      "ଏକ ରହସ୍ୟମୟ ଜଗତରେ, ଏକ ନିରବ ମୁହୂର୍ତ୍ତ ସବୁକିଛି ବଦଳାଇବାକୁ ଆରମ୍ଭ କରେ।",
      "ଆଗକୁ ପଥ ଅନିଶ୍ଚିତ, କିନ୍ତୁ ପ୍ରତ୍ୟେକ ପଦକ୍ଷେପରେ ସାହସ ବଢ଼େ।",
      "ଭୟ ଓ ଆଶାର ସୀମାରେ, ଏକ ନିଷ୍ପତ୍ତି ସତ୍ୟକୁ ପ୍ରକାଶ କରେ।",
      "ଏବଂ ଏହିପରି ଯାତ୍ରା ଜାରି ରହେ, ଆକାଶର ଆଲୋକ ପରି।"
    ]
  };

  const selected = lines[lang] || lines.English;
  if (index === 0) return selected[0];
  if (index === total - 1) return selected[3];
  if (index === Math.floor(total / 2)) return selected[2];
  return selected[1];
}

async function loadSceneVideo(index, options = {}) {
  if (!appState.scenes[index]) return;

  const token = ++currentLoadToken;
  const scene = appState.scenes[index];
  const video = elements.previewVideo;
  const autoplay = options.autoplay ?? appState.isPlaying;

  appState.activeSceneIndex = index;
  elements.previewContainer?.classList.add("loading");
  elements.previewContainer?.classList.remove("error-state");

  logMedia("load scene", {
    reason: options.reason || "scene-change",
    scene: index + 1,
    videoUrl: scene.videoUrl,
    autoplay
  });

  const candidates = [...new Set([
    scene.videoUrl,
    ...(VIDEO_CATALOG[appState.style] || VIDEO_CATALOG.Cinematic),
    ...VIDEO_CATALOG.Cinematic
  ])].filter(Boolean);

  let loadedUrl = "";

  for (const url of candidates) {
    const valid = await validateMediaUrl(url, "video");
    if (!valid.ok) continue;

    const finalUrl = valid.finalUrl || url;
    const loaded = await loadVideoElement(video, finalUrl);
    if (loaded) {
      loadedUrl = finalUrl;
      break;
    }
  }

  if (token !== currentLoadToken) return;

  elements.previewContainer?.classList.remove("loading");

  if (!loadedUrl) {
    elements.previewContainer?.classList.add("error-state");
    if (elements.placeholder) elements.placeholder.classList.remove("hidden-placeholder");
    showToast("No playable video URL found.", "error");
    return;
  }

  scene.videoUrl = loadedUrl;
  scene.mediaReady = true;

  if (elements.placeholder) elements.placeholder.classList.add("hidden-placeholder");

  try {
    if (Number.isFinite(video.duration) && video.duration > 0.1) video.currentTime = 0.01;
  } catch (_) {}

  if (autoplay) safeVideoPlay();

  updateTimelineActive();
  updateTimerUI();
}

function loadVideoElement(video, url) {
  return new Promise((resolve) => {
    let done = false;

    const finish = (ok) => {
      if (done) return;
      done = true;
      clearTimeout(timer);
      video.removeEventListener("loadedmetadata", onReady);
      video.removeEventListener("loadeddata", onReady);
      video.removeEventListener("canplay", onReady);
      video.removeEventListener("error", onError);
      resolve(ok);
    };

    const onReady = () => finish(true);
    const onError = () => finish(false);
    const timer = setTimeout(() => finish(false), 12000);

    video.pause();
    video.removeAttribute("crossorigin");
    video.src = url;
    video.load();

    video.addEventListener("loadedmetadata", onReady, { once: true });
    video.addEventListener("loadeddata", onReady, { once: true });
    video.addEventListener("canplay", onReady, { once: true });
    video.addEventListener("error", onError, { once: true });
  });
}

function startPlayback() {
  if (!appState.scenes.length) {
    showToast("Generate a story first.", "error");
    return;
  }

  unlockAudio();

  appState.isPlaying = true;
  lastTick = Date.now();

  elements.playPauseBtn.innerHTML = `<i data-feather="pause"></i>`;
  if (window.feather) feather.replace();

  playBackgroundMusic();
  safeVideoPlay();

  spokenScenes.delete(appState.activeSceneIndex);
  speakScene(appState.activeSceneIndex);

  cancelAnimationFrame(playerTimer);
  playerTimer = requestAnimationFrame(tick);

  logMedia("playback state", { state: "start", elapsedTime, scene: appState.activeSceneIndex });
}

function pausePlayback() {
  appState.isPlaying = false;

  elements.playPauseBtn.innerHTML = `<i data-feather="play"></i>`;
  if (window.feather) feather.replace();

  elements.previewVideo?.pause();
  bgAudio?.pause();

  if ("speechSynthesis" in window) speechSynthesis.cancel();
  spokenScenes.delete(appState.activeSceneIndex);

  cancelAnimationFrame(playerTimer);
  logMedia("playback state", { state: "pause", elapsedTime, scene: appState.activeSceneIndex });
}

function stopPlayback() {
  appState.isPlaying = false;
  elapsedTime = 0;
  lastTick = 0;
  spokenScenes.clear();

  cancelAnimationFrame(playerTimer);

  elements.previewVideo?.pause();
  try {
    if (elements.previewVideo?.readyState > 0) elements.previewVideo.currentTime = 0.01;
  } catch (_) {}

  if (bgAudio) {
    bgAudio.pause();
    bgAudio.currentTime = 0;
  }

  if ("speechSynthesis" in window) speechSynthesis.cancel();
  if (elements.subtitleText) elements.subtitleText.textContent = "";

  elements.playPauseBtn.innerHTML = `<i data-feather="play"></i>`;
  if (window.feather) feather.replace();

  if (appState.scenes.length) loadSceneVideo(0, { autoplay: false, reason: "stop-reset" });

  updateTimerUI();
  logMedia("playback state", { state: "stop" });
}

function tick() {
  if (!appState.isPlaying) return;

  const now = Date.now();
  const delta = Math.min((now - lastTick) / 1000, 0.5);
  lastTick = now;

  elapsedTime += delta;

  if (elapsedTime >= totalMovieDuration) {
    stopPlayback();
    return;
  }

  const activeIndex = getSceneIndexFromTime(elapsedTime);

  if (activeIndex !== appState.activeSceneIndex) {
    if ("speechSynthesis" in window) speechSynthesis.cancel();
    spokenScenes.delete(activeIndex);
    loadSceneVideo(activeIndex, { autoplay: true, reason: "timeline-advance" });
  }

  if (!spokenScenes.has(activeIndex)) speakScene(activeIndex);

  updateSubtitle();
  updateTimerUI();

  playerTimer = requestAnimationFrame(tick);
}

function scrubTo(percent) {
  elapsedTime = (percent / 100) * totalMovieDuration;
  const index = getSceneIndexFromTime(elapsedTime);

  if ("speechSynthesis" in window) speechSynthesis.cancel();
  spokenScenes.clear();

  loadSceneVideo(index, { autoplay: appState.isPlaying, reason: "scrub" });
  updateSubtitle();
  updateTimerUI();

  logMedia("playback state", { state: "scrub", elapsedTime, scene: index });
}

function getSceneIndexFromTime(time) {
  let index = 0;
  for (let i = 0; i < sceneStartTimes.length; i++) {
    if (time >= sceneStartTimes[i]) index = i;
  }
  return index;
}

function safeVideoPlay() {
  const video = elements.previewVideo;
  if (!video || !video.src) return;

  video.play()
    .then(() => logMedia("playback state", { state: "video-playing-confirmed" }))
    .catch((err) => warnMedia("video play error", { name: err.name, message: err.message }));
}

async function playBackgroundMusic() {
  unlockAudio();

  if (!bgAudio) return;

  const url = AUDIO_URLS[0];

  bgAudio.src = url;
  bgAudio.volume = Number(elements.musicVolumeSlider?.value || 0.4);
  bgAudio.load();

  try {
    await bgAudio.play();
    logMedia("audio api response", {
      mode: "background-music",
      status: "playing",
      url: bgAudio.src
    });
  } catch (err) {
    warnMedia("audio play blocked", {
      error: err.message,
      fallback: "music disabled, narration continues"
    });
  }
}

  async function playBackgroundMusic() {
  unlockAudio();

  if (!bgAudio) return;

  const url = AUDIO_URLS[0];

  bgAudio.src = url;
  bgAudio.volume = Number(elements.musicVolumeSlider?.value || 0.4);
  bgAudio.load();

  try {
    await bgAudio.play();
    logMedia("audio api response", {
      mode: "background-music",
      status: "playing",
      url: bgAudio.src
    });
  } catch (err) {
    warnMedia("audio play blocked", {
      error: err.message,
      fallback: "music disabled, narration continues"
    });
  }
}
function speakScene(index) {

function speakScene(index) {
  const scene = appState.scenes[index];
  if (!scene || !scene.narration) return;
  if (!("speechSynthesis" in window)) {
    if (elements.subtitleText) elements.subtitleText.textContent = scene.narration;
    warnMedia("audio fallback", { reason: "speech synthesis unavailable" });
    return;
  }

  spokenScenes.add(index);
  speechSynthesis.cancel();

  const utterance = new SpeechSynthesisUtterance(scene.narration);
  utterance.lang = getLangCode(appState.language);
  utterance.volume = Number(elements.voiceVolumeSlider?.value || 1);
  utterance.rate = 0.95;
  utterance.pitch = 1;

  utterance.onstart = () => logMedia("audio api response", { mode: "speech-synthesis", scene: index + 1, status: "started" });
  utterance.onend = () => logMedia("audio api response", { mode: "speech-synthesis", scene: index + 1, status: "ended" });
  utterance.onerror = (e) => warnMedia("audio api response", { mode: "speech-synthesis", scene: index + 1, status: "failed", error: e.error });

  setTimeout(() => {
    if (appState.isPlaying) speechSynthesis.speak(utterance);
  }, 120);
}

function getLangCode(lang) {
  const map = {
    English: "en-US",
    Hindi: "hi-IN",
    Odia: "or-IN",
    Bengali: "bn-IN",
    Telugu: "te-IN",
    Tamil: "ta-IN",
    Malayalam: "ml-IN",
    Kannada: "kn-IN",
    Punjabi: "pa-IN",
    Marathi: "mr-IN",
    Gujarati: "gu-IN",
    Assamese: "as-IN",
    Urdu: "ur-IN",
    Sanskrit: "sa-IN"
  };
  return map[lang] || "en-US";
}

function updateSubtitle() {
  const scene = appState.scenes[appState.activeSceneIndex];
  if (!scene || !elements.subtitleText) return;

  const sceneStart = sceneStartTimes[appState.activeSceneIndex] || 0;
  const sceneElapsed = Math.max(0, elapsedTime - sceneStart);
  const progress = Math.min(1, sceneElapsed / scene.duration);
  const words = scene.narration.split(/\s+/);
  const count = Math.max(1, Math.ceil(words.length * progress));

  elements.subtitleText.textContent = words.slice(0, count).join(" ");
}

function initializeTimeline() {
  sceneStartTimes = [];
  let acc = 0;
  appState.scenes.forEach((scene) => {
    sceneStartTimes.push(acc);
    acc += scene.duration;
  });
  totalMovieDuration = acc || appState.duration;
  elapsedTime = 0;

  logMedia("timeline durations", { sceneStartTimes, totalMovieDuration });
}

function updateTimerUI() {
  if (elements.timeCurrent) elements.timeCurrent.textContent = formatTime(elapsedTime);
  if (elements.timeDuration) elements.timeDuration.textContent = formatTime(totalMovieDuration);
  if (elements.scrubber) {
    elements.scrubber.value = totalMovieDuration > 0 ? (elapsedTime / totalMovieDuration) * 100 : 0;
  }
}

function formatTime(seconds) {
  const min = Math.floor(seconds / 60);
  const sec = Math.floor(seconds % 60);
  return `${min}:${sec < 10 ? "0" : ""}${sec}`;
}

function updateTimeline() {
  if (!elements.timelineList) return;

  elements.timelineList.innerHTML = "";

  appState.scenes.forEach((scene, index) => {
    const card = document.createElement("div");
    card.className = `timeline-card ${index === appState.activeSceneIndex ? "active-scene" : ""}`;
    card.innerHTML = `
      <div class="timeline-card-header">
        <span class="scene-num">Scene ${index + 1}</span>
        <span class="scene-duration">${scene.duration}s</span>
      </div>
      <div class="timeline-card-body">
        <div class="scene-thumbnail-container">
          <video class="scene-thumbnail-video" src="${escapeHtml(scene.videoUrl)}" muted playsinline preload="metadata"></video>
        </div>
        <div class="scene-text-preview">${escapeHtml(scene.prompt)}</div>
      </div>
    `;

    card.addEventListener("click", () => {
      loadSceneVideo(index, { autoplay: appState.isPlaying, reason: "timeline-click" });
    });

    elements.timelineList.appendChild(card);
  });

  updateTimelineActive();
}

function updateTimelineActive() {
  document.querySelectorAll(".timeline-card").forEach((card, index) => {
    card.classList.toggle("active-scene", index === appState.activeSceneIndex);
  });
}

function renderWorkspaceTabs(activeTab = "script") {
  if (!elements.tabContentArea) return;

  document.querySelectorAll(".sidebar-tab").forEach((tab) => {
    tab.classList.toggle("active", tab.dataset.tab === activeTab);
    tab.onclick = () => renderWorkspaceTabs(tab.dataset.tab);
  });

  if (activeTab === "voice") {
    elements.tabContentArea.innerHTML = `
      <div class="sidebar-section">
        <label class="option-label">Narrator Voice</label>
        <select class="select-custom" id="voice-select" style="width:100%;">
          <option>Browser default voice</option>
        </select>
      </div>
      <div class="sidebar-section">
        <label class="option-label">Narration Pitch</label>
        <input type="range" class="scrubber-slider" min="0.5" max="1.5" step="0.1" value="1">
      </div>
      <div class="sidebar-section">
        <label class="option-label">Narration Rate</label>
        <input type="range" class="scrubber-slider" min="0.5" max="1.5" step="0.1" value="0.95">
      </div>
    `;
    return;
  }

  if (activeTab === "characters") {
    elements.tabContentArea.innerHTML = `
      <div class="sidebar-section">
        <label class="option-label">Character Details</label>
        <textarea class="sidebar-textarea" style="height:150px;">${escapeHtml(appState.characterBio)}</textarea>
      </div>
    `;
    return;
  }

  elements.tabContentArea.innerHTML = `
    <div class="sidebar-section">
      <label class="option-label">Film Title</label>
      <input type="text" class="sidebar-input" value="${escapeHtml(appState.generatedTitle)}">
    </div>
    <div class="sidebar-section">
      <label class="option-label">Scene Breakdown</label>
      <div id="scenes-editor-list" style="display:flex; flex-direction:column; gap:10px;"></div>
    </div>
  `;

  const list = document.getElementById("scenes-editor-list");
  appState.scenes.forEach((scene, index) => {
    const box = document.createElement("div");
    box.style.cssText = "border-left: 2px solid var(--accent-purple); padding-left: 8px;";
    box.innerHTML = `
      <span class="scene-num">Scene ${index + 1} Visual Prompt</span>
      <textarea class="sidebar-textarea" style="height:60px; font-size:0.8rem;">${escapeHtml(scene.prompt)}</textarea>
      <span class="scene-num" style="color:var(--text-secondary); display:block; margin:4px 0;">Voice Narration</span>
      <textarea class="sidebar-textarea" style="height:60px; font-size:0.8rem;">${escapeHtml(scene.narration)}</textarea>
    `;
    list.appendChild(box);
  });
}

function renderTemplates() {
  if (!elements.templatesGrid) return;

  const templates = [
    ["The Last Astronaut", "A lone astronaut walking on a glowing purple alien planet", "Cinematic"],
    ["Shadows of Kyoto", "Rainy neon-lit street with glowing water reflections", "Realistic"],
    ["Whispering Woodlands", "An enchanted magical forest river glowing under crystal sunlight", "Fantasy"]
  ];

  elements.templatesGrid.innerHTML = "";

  templates.forEach(([title, prompt, style], index) => {
    const video = VIDEO_CATALOG[style][0];
    const card = document.createElement("div");
    card.className = "template-card glass-panel";
    card.innerHTML = `
      <video class="template-video" src="${video}" muted loop playsinline preload="metadata"></video>
      <div class="template-info">
        <h4>${title}</h4>
        <p>${style}</p>
      </div>
    `;
    card.addEventListener("click", () => {
      elements.promptInput.value = prompt;
      elements.styleSelect.value = style;
      appState.style = style;
    });
    elements.templatesGrid.appendChild(card);
  });
}

function showScreen(screen) {
  if (screen === "workspace") {
    elements.setupScreen?.classList.add("hidden");
    elements.workspaceScreen?.classList.remove("hidden");
  } else {
    elements.workspaceScreen?.classList.add("hidden");
    elements.setupScreen?.classList.remove("hidden");
  }
}

function showRenderOverlay(show) {
  elements.renderOverlay?.classList.toggle("hidden", !show);
}

function updateProgress(step, pct, title, desc) {
  logMedia("render progress", { step, pct, title, desc });

  if (elements.renderTitle) elements.renderTitle.textContent = title;
  if (elements.renderDesc) elements.renderDesc.textContent = desc;
  if (elements.progressFill) elements.progressFill.style.width = `${pct}%`;
  if (elements.progressPct) elements.progressPct.textContent = `${pct}%`;

  for (let i = 0; i <= 3; i++) {
    const node = document.getElementById(`step-${i}`);
    const fill = document.getElementById(`fill-${i}`);
    if (!node) continue;

    if (i < step) {
      node.className = "pipeline-node completed";
      if (fill) fill.style.width = "100%";
    } else if (i === step) {
      node.className = "pipeline-node active";
      if (fill) fill.style.width = "50%";
    } else {
      node.className = "pipeline-node";
      if (fill) fill.style.width = "0%";
    }
  }
}

function updateAspectRatio() {
  if (!elements.previewContainer) return;

  elements.previewContainer.classList.remove("aspect-16-9", "aspect-9-16", "aspect-1-1");

  if (appState.aspectRatio === "9:16") elements.previewContainer.classList.add("aspect-9-16");
  else if (appState.aspectRatio === "1:1") elements.previewContainer.classList.add("aspect-1-1");
  else elements.previewContainer.classList.add("aspect-16-9");
}

function getSelectedDuration() {
  const active = elements.durationSelector?.querySelector(".selector-option.active");
  return Number(active?.dataset.duration || 30);
}

function showToast(message, type = "success") {
  if (!elements.toastContainer) {
    alert(message);
    return;
  }

  const toast = document.createElement("div");
  toast.className = `toast toast-${type}`;
  toast.textContent = message;
  elements.toastContainer.appendChild(toast);

  setTimeout(() => toast.remove(), 3500);
}

function saveHistory() {
  const history = JSON.parse(localStorage.getItem("cinestory-history") || "[]");
  history.unshift({
    title: appState.generatedTitle,
    prompt: appState.prompt,
    createdAt: new Date().toISOString()
  });
  localStorage.setItem("cinestory-history", JSON.stringify(history.slice(0, 10)));
}

function renderHistory() {
  if (!elements.historyList) return;

  const history = JSON.parse(localStorage.getItem("cinestory-history") || "[]");

  if (!history.length) {
    elements.historyList.innerHTML = `<p style="font-size:0.85rem;">No saved stories yet.</p>`;
    return;
  }

  elements.historyList.innerHTML = history.map((item) => `
    <div class="history-item">
      <strong>${escapeHtml(item.title)}</strong>
      <p>${escapeHtml(item.prompt)}</p>
    </div>
  `).join("");
}

function startParticles() {
  const canvas = document.getElementById("particles-canvas");
  if (!canvas) return;

  const ctx = canvas.getContext("2d");
  const particles = Array.from({ length: 50 }, () => ({
    x: Math.random(),
    y: Math.random(),
    r: Math.random() * 2 + 0.5,
    vx: (Math.random() - 0.5) * 0.0005,
    vy: (Math.random() - 0.5) * 0.0005
  }));

  function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }

  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    particles.forEach((p) => {
      p.x += p.vx;
      p.y += p.vy;

      if (p.x < 0 || p.x > 1) p.vx *= -1;
      if (p.y < 0 || p.y > 1) p.vy *= -1;

      ctx.beginPath();
      ctx.arc(p.x * canvas.width, p.y * canvas.height, p.r, 0, Math.PI * 2);
      ctx.fillStyle = "rgba(139, 92, 246, 0.35)";
      ctx.fill();
    });

    requestAnimationFrame(draw);
  }

  resize();
  window.addEventListener("resize", resize);
  draw();
}

function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function escapeHtml(value) {
  return String(value || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}