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

  function draw() {
    canvas.width  = canvas.offsetWidth  || 640;
    canvas.height = canvas.offsetHeight || 360;
    const W = canvas.width, H = canvas.height;

    t += 0.005;
    phase = (phase + 0.003) % 1;

    const c1 = colors[0], c2 = colors[1];
    const grad = ctx.createLinearGradient(
      W * Math.sin(t * 0.7) * 0.5 + W * 0.5,
      0,
      W * Math.cos(t * 0.5) * 0.5 + W * 0.5,
      H
    );
    grad.addColorStop(0,   c1[0]);
    grad.addColorStop(0.5, c1[1]);
    grad.addColorStop(1,   c1[2]);
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, W, H);

    // Overlay sweep
    const sweep = ctx.createRadialGradient(
      W * (0.5 + Math.sin(t * 0.4) * 0.3),
      H * (0.5 + Math.cos(t * 0.3) * 0.3),
      0,
      W * 0.5, H * 0.5, W * 0.8
    );
    sweep.addColorStop(0,   "rgba(139,92,246,0.15)");
    sweep.addColorStop(0.5, "rgba(59,130,246,0.08)");
    sweep.addColorStop(1,   "rgba(0,0,0,0)");
    ctx.fillStyle = sweep;
    ctx.fillRect(0, 0, W, H);

    // Particles
    particles.forEach(p => {
      p.x += p.vx; p.y += p.vy;
      if (p.x < 0 || p.x > 1) p.vx *= -1;
      if (p.y < 0 || p.y > 1) p.vy *= -1;
      ctx.beginPath();
      ctx.arc(p.x * W, p.y * H, p.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255,255,255,${p.a * (0.5 + Math.sin(t + p.x * 10) * 0.5)})`;
      ctx.fill();
    });

    canvasFallbackAnim = requestAnimationFrame(draw);
  }
  draw();
  _canvasFallbackActive = true;
  debugMedia("canvas fallback", { status: "started", style });
}

function stopCanvasFallback() {
  _canvasFallbackActive = false;
  if (canvasFallbackAnim) {
    cancelAnimationFrame(canvasFallbackAnim);
    canvasFallbackAnim = null;
  }
  const existing = document.getElementById("canvas-fallback");
  if (existing) existing.remove();
  // Restore video element visibility
  if (elements.previewVideo) elements.previewVideo.style.visibility = "";
}


// 2. Pre-curated Soundtracks
const PREMIUM_SOUNDTRACKS = {
  // Using Internet Archive public domain / CC0 audio - reliable, no hotlink restrictions
  "cinematic_epic":    "https://ia800501.us.archive.org/7/items/testmp3testfile/mpthreetest.mp3",
  "cyberpunk_synth":   "https://ia800501.us.archive.org/7/items/testmp3testfile/mpthreetest.mp3",
  "horror_ambient":    "https://ia800501.us.archive.org/7/items/testmp3testfile/mpthreetest.mp3",
  "fantasy_enchanted": "https://ia800501.us.archive.org/7/items/testmp3testfile/mpthreetest.mp3",
  "lofi_chill":        "https://ia800501.us.archive.org/7/items/testmp3testfile/mpthreetest.mp3",
  "kids_happy":        "https://ia800501.us.archive.org/7/items/testmp3testfile/mpthreetest.mp3"
};

// ── AUDIO: Attempt to load music with graceful CORS/network fallback ──
const AUDIO_FALLBACK_URLS = [
  "https://ia800501.us.archive.org/7/items/testmp3testfile/mpthreetest.mp3",
  "https://assets.mixkit.co/music/preview/mixkit-tech-house-vibes-130.mp3",
  "https://assets.mixkit.co/music/preview/mixkit-cinematic-mystery-539.mp3"
];

// 3. Multi-lingual Story Templates
const MULTILINGUAL_TEMPLATES = {
  "English": {
    "titlePrefix": "Chronicles of",
    "titleSuffix": "The Journey",
    "charBio": "A mysterious wanderer searching for purpose.",
    "intro": "In a world lost to time, a whisper echoing through the wind changes everything.",
    "conflict": "The path forward is shadowed in uncertainty, yet the light of determination burns bright.",
    "climax": "At the edge of all existence, a singular choice will determine the fate of tomorrow.",
    "resolution": "And so, the journey continues, written forever into the stars."
  },
  "Hindi": {
    "titlePrefix": "गाथा -",
    "titleSuffix": "की एक यात्रा",
    "charBio": "एक रहस्यमयी पथिक जो सत्य की खोज में है।",
    "intro": "समय की गहराइयों में खोई हुई दुनिया में, हवा में गूंजती एक फुसफुसाहट सब कुछ बदल देती है।",
    "conflict": "आगे का रास्ता अनिश्चितता की छाया में छिपा है, फिर भी दृढ़ संकल्प की लौ जल रही है।",
    "climax": "अस्तित्व के अंतिम छोर पर, एक अकेला निर्णय कल की नियति का फैसला करेगा।",
    "resolution": "और इस प्रकार, यात्रा जारी है, जो हमेशा के लिए सितारों में अंकित हो गई है।"
  },
  "Odia": {
    "titlePrefix": "ଇତିହାସ -",
    "titleSuffix": "ର ଏକ ଯାତ୍ରା",
    "charBio": "ଏକ ରହସ୍ୟମୟ ପଥିକ ଯିଏ ନିଜର ଲକ୍ଷ୍ୟ ସନ୍ଧାନ କରୁଛି।",
    "intro": "ସମୟର ସୀମା ବାହାରେ ହଜିଯାଇଥିବା ଏକ ବିଶ୍ୱରେ, ପବନରେ ଭାସି ଆସୁଥିବା ଶବ୍ଦ ସବୁକିଛି ବଦଳାଇ ଦିଏ।",
    "conflict": "ଆଗକୁ ଯିବାର ପଥ ଅନିଶ୍ଚିତତା ର ଛାୟାରେ ଘେରି ରହିଛି, ତଥାପି ଆଶାର ଆଲୋକ ଜଳୁଛି।",
    "climax": "ସମଗ୍ର ଅସ୍ତିତ୍ୱର ଶେଷ ସୀମାରେ, ଏକ ମାତ୍ର ନିଷ୍ପତ୍ତି ଆଗାମୀ କାଲିର ଭାଗ୍ୟ ନିର୍ଦ୍ଧାରଣ କରିବ।",
    "resolution": "ଏବଂ ଏହିପରି ଭାବରେ, ଯାତ୍ରା ଜାରି ରହିଛି, ଯାହା ଚିରଦିନ ପାଇଁ ତାରାମାନଙ୍କ ମଧ୍ୟରେ ଲେଖା ହୋଇ ରହିବ।"
  },
  "Bengali": {
    "titlePrefix": "মহাকাব্য -",
    "titleSuffix": "এর সন্ধান",
    "charBio": "এক রহস্যময় পথচারী যে জীবনের অর্থ খুঁজছে।",
    "intro": "সময়ের অতল গহ্বরে হারিয়ে যাওয়া এক পৃথিবীতে, বাতাসে ভেসে আসা একটি শব্দ সবকিছু বদলে দেয়।",
    "conflict": "সামনের পথ অনিশ্চয়তার ছায়ায় ঢাকা, তবুও দৃঢ় সংকল্পের আলো জ্বলছে অবিরত।",
    "climax": "অস্তিত্বের শেষ সীমায় দাঁড়িয়ে, একটি মাত্র সিদ্ধান্ত নির্ধারণ করবে আগামীকালের ভাগ্য।",
    "resolution": "এবং এভাবেই, যাত্রা চলতে থাকে, যা চিরকালের জন্য নক্ষত্রমন্ডলীতে খোদাই করা থাকবে।"
  },
  "Telugu": {
    "titlePrefix": "గాథ -",
    "titleSuffix": "ఒక ప్రయాణం",
    "charBio": "లక్ష్యం కోసం వెతుకుతున్న ఒక రహస్య ప్రయాణీకుడు.",
    "intro": "కాలగర్భంలో కలిసిపోయిన ఒక ప్రపంచంలో, గాలిలో వినిపించే ఒక గుసగుస అంతా మార్చేస్తుంది.",
    "conflict": "ముందున్న మార్గం అస్పష్టతతో నిండి ఉన్నా, ఆత్మవిశ్వాసం అనే వెలుగు ఎల్లప్పుడూ ప్రకాశిస్తూనే ఉంటుంది.",
    "climax": "అస్తిత్వపు అంచున నిలబడి, తీసుకునే ఒక నిర్ణయం రేపటి భవిష్యత్తును శాసిస్తుంది.",
    "resolution": "అలా ఈ సుదీర్ఘ ప్రయాణం సాగుతూనే ఉంటుంది, నక్షత్రాల సాక్షిగా ఎప్పటికీ నిలిచిపోతుంది."
  },
  "Tamil": {
    "titlePrefix": "சரித்திரம் -",
    "titleSuffix": "ஒரு பயணம்",
    "charBio": "தன் லட்சியத்தைத் தேடி அலையும் ஒரு மர்மமான பயணி.",
    "intro": "காலத்தால் மறக்கப்பட்ட ஒரு உலகில், காற்றில் வீசும் ஒரு மெல்லிய குரல் அனைத்தையும் மாற்றுகிறது.",
    "conflict": "முன்னே செல்லும் பாதை இருள் சூழ்ந்ததாக இருந்தாலும், நம்பிக்கையின் ஒளி பிரகாசமாக எரிகிறது.",
    "climax": "வாழ்க்கையின் எல்லையில், ஒரு சிறிய முடிவு நாளை என்ன நடக்கும் என்பதை தீர்மானிக்கும்.",
    "resolution": "இவ்வாறாக, விண்மீன்களில் எழுதப்பட்ட அந்தப் பயணம் தொடர்கிறது."
  },
  "Malayalam": {
    "titlePrefix": "ചരിത്രം -",
    "titleSuffix": "ഒരു യാത്ര",
    "charBio": "ലക്ഷ്യം തേടി അലയുന്ന ഒരു ദുരൂഹ സഞ്ചാരി.",
    "intro": "കാലത്തിൽ മറഞ്ഞുപോയ ഒരു ലോകത്തിൽ, കാറ്റിലുയർന്ന ഒരു നേർത്ത ശബ്ദം എല്ലാം മാറ്റിമറിക്കുന്നു.",
    "conflict": "മുന്നോട്ടുള്ള വഴി അനിശ്ചിതത്വത്തിൽ നിഴലിച്ചിരിക്കുമ്പോഴും, ദൃഢനിശ്ചയത്തിന്റെ വെളിച്ചം തിളങ്ങിനിൽക്കുന്നു.",
    "climax": "അസ്തിത്വത്തിന്റെ അറ്റത്ത്, ഒരു തീരുമാനം നാളെയുടെ വിധിയെ മാറ്റിമറിക്കും.",
    "resolution": "അങ്ങനെ ആ യാത്ര തുടരുന്നു, നക്ഷത്രങ്ങളിൽ അത് എന്നെന്നേക്കുമായി കൊത്തിവെക്കപ്പെട്ടു."
  },
  "Kannada": {
    "titlePrefix": "ಇತಿಹಾಸ -",
    "titleSuffix": "ಒಂದು ಪಯಣ",
    "charBio": "ತನ್ನ ಉದ್ದೇಶವನ್ನು ಹುಡುಕುತ್ತಿರುವ ರಹಸ್ಯ ಪಥಿಕ.",
    "intro": "ಕಾಲದ ಮರೆಯಲ್ಲಿ ಕಳೆದುಹೋದ ಜಗತ್ತಿನಲ್ಲಿ, ಗಾಳಿಯಲ್ಲಿ ತೇಲಿಬಂದ ಒಂದು ಸಣ್ಣ ಧ್ವನಿ ಎಲ್ಲವನ್ನೂ ಬದಲಾಯಿಸುತ್ತದೆ.",
    "conflict": "ಮುಂದಿರುವ ದಾರಿ ಅನಿಶ್ಚಿತತೆಯ ಕತ್ತಲಿನಲ್ಲಿ ಮುಳುಗಿದ್ದರೂ, ದೃಢತೆಯ ಬೆಳಕು ಪ್ರಕಾಶಿಸುತ್ತಿದೆ.",
    "climax": "ಅಸ್ತಿತ್ವದ ಅಂಚಿನಲ್ಲಿ ನಿಂತಾಗ, ಒಂದು ಮಹತ್ವದ ನಿರ್ಧಾರವು ನಾಳಿನ ಭವಿಷ್ಯವನ್ನು ನಿರ್ಧರಿಸುತ್ತದೆ.",
    "resolution": "ಹಾಗೆಯೇ ಈ ಪಯಣ ಮುಂದುವರಿಯುತ್ತದೆ, ನಕ್ಷತ್ರಗಳ ಗರ್ಭದಲ್ಲಿ ಇದು ಶಾಶ್ವತವಾಗಿ ಅಚ್ಚಳಿಯದೆ ಉಳಿಯುತ್ತದೆ."
  },
  "Punjabi": {
    "titlePrefix": "ਗਾਥਾ -",
    "titleSuffix": "ਦੀ ਯਾਤਰਾ",
    "charBio": "ਇੱਕ ਰਹੱਸਮਈ ਮੁਸਾਫਿਰ ਜੋ ਮਕਸਦ ਦੀ ਭਾਲ ਵਿੱਚ ਹੈ।",
    "intro": "ਸਮੇਂ ਦੀਆਂ ਗਹਿਰਾਈਆਂ ਵਿੱਚ ਗੁਆਚੀ ਦੁਨੀਆ ਵਿੱਚ, ਹਵਾ ਵਿੱਚ ਗੂੰਜਦੀ ਇੱਕ ਆਵਾਜ਼ ਸਭ ਕੁਝ ਬਦਲ ਦਿੰਦੀ ਹੈ।",
    "conflict": "ਅੱਗੇ ਦਾ ਰਾਹ ਅਨਿਸ਼ਚਿਤਤਾ ਦੇ ਪਰਛਾਵੇਂ ਹੇਠ ਹੈ, ਪਰ ਦ੍ਰਿੜ ਇਰਾਦੇ ਦੀ ਰੋਸ਼ਨੀ ਚਮਕ ਰਹੀ ਹੈ।",
    "climax": "ਹੋਂਦ ਦੇ ਆਖਰੀ ਮੋੜ 'ਤੇ, ਇੱਕ ਫੈਸਲਾ ਆਉਣ ਵਾਲੇ ਕੱਲ੍ਹ ਦੀ ਤਕਦੀਰ ਲਿਖੇਗਾ।",
    "resolution": "ਅਤੇ ਇਸ ਤਰ੍ਹਾਂ, ਯਾਤਰਾ ਜਾਰੀ ਹੈ, ਜੋ ਹਮੇਸ਼ਾ ਲਈ ਸਿਤਾਰਿਆਂ ਵਿੱਚ ਲਿਖੀ ਗਈ ਹੈ।"
  },
  "Marathi": {
    "titlePrefix": "कथा -",
    "titleSuffix": "एक प्रवास",
    "charBio": "ध्येयाच्या शोधात निघालेला एक रहस्यमयी प्रवासी।",
    "intro": "काळात हरवलेल्या जगात, वाऱ्यावर वाहणारा एक संदेश सर्व काही बदलून टाकतो।",
    "conflict": "पुढील मार्ग अनिश्चिततेने वेढलेला असला, तरी आत्मविश्वासाचा दिवा सतत जळत आहे।",
    "climax": "अस्तित्वाच्या सीमेवर, एकच निर्णय उद्याचे भवितव्य ठरवणार आहे।",
    "resolution": "आणि अशा प्रकारे हा प्रवास पुढे सुरूच राहतो, जो नक्षत्रांमध्ये कायमचा कोरला गेला आहे।"
  },
  "Gujarati": {
    "titlePrefix": "ગાથા -",
    "titleSuffix": "એક સફર",
    "charBio": "એક રહસ્યમય મુસાફર જે લક્ષ્યની શોધમાં ભટકી રહ્યો છે.",
    "intro": "સમયના વહેણમાં ખોવાયેલી દુનિયામાં, હવામાં વહેતો એક અવાજ બધું બદલી નાખે છે.",
    "conflict": "આગળનો રસ્તો અંધકારમય હોવા છતાં, મક્કમ મનોબળનો પ્રકાશ ઝળહળી રહ્યો છે.",
    "climax": "અસ્તિત્વની સરહદ પર, એક માત્ર નિર્ણય આવતીકાલનું ભાગ્ય નક્કી કરશે.",
    "resolution": "અને આ રીતે સફર ચાલુ જ રહે છે, જે તારાઓની દુનિયામાં અમર થઈ ગઈ છે."
  },
  "Assamese": {
    "titlePrefix": "ইতিহাস -",
    "titleSuffix": "ৰ এক সন্ধান",
    "charBio": "উদ্দেশ্যৰ সন্ধানত ঘূৰি ফুৰা এজন ৰহস্যময় যাত্ৰী।",
    "intro": "সময়ৰ বুকুত হেৰাই যোৱা এখন পৃথিৱীত, বতাহত ভাঁহি অহা এটা শব্দই সকলো সলনি কৰি পেলায়।",
    "conflict": "আগত থকা পথটো অনিশ্চয়তাৰ মাজত থাকিলেও, মনৰ আশাৰ চাকিগছি জ্বলি আছে।",
    "climax": "অস্তিত্বৰ একেবাৰে শেষ সীমাত থিয় হৈ, এটা সিদ্ধান্তই কাইলৈৰ ভাগ্য নিৰ্ণয় কৰিব।",
    "resolution": "আৰু এনেদৰেই যাত্ৰা অব্যাহত থাকে, যি চিৰদিনৰ বাবে আকাশৰ তৰা হৈ জিলিকি থাকিব।"
  },
  "Urdu": {
    "titlePrefix": "داستان -",
    "titleSuffix": "کا سفر",
    "charBio": "ایک پرسرار مسافر جو زندگی کا مقصد تلاش کر رہا ہے۔",
    "intro": "وقت کی بھول بھلیوں میں گم ایک دنیا میں، ہوا میں گونجتی سرگوشی سب کچھ بدل دیتی ہے۔",
    "conflict": "آگے کا راستہ اندھیروں میں چھپا ہے، لیکن پختہ ارادے کی شمع روشن ہے۔",
    "climax": "زندگی کی آخری سرحد پر، ایک فیصلہ کل کی قسمت کا فیصلہ کرے گا۔",
    "resolution": "اور یوں یہ سفر جاری رہتا ہے، جو ستاروں کی کتاب میں ہمیشہ کے لیے درج ہو گیا ہے۔"
  },
  "Sanskrit": {
    "titlePrefix": "कथा -",
    "titleSuffix": "एकं महाप्रयाणम्",
    "charBio": "लक्ष्यं प्रति धावन् एकः रहस्यमयः पथिकः।",
    "intro": "कालचक्रे विलीने संसारे, समीरणे प्रवहन् कश्चन ध्वनिः सर्वं परिवर्तयति।",
    "conflict": "अग्रिमः मार्गः तिमिरावृतः वर्तते, तथापि संकल्पस्य दीपः ज्वलति।",
    "climax": "सृष्टेः अन्तिमे भागे, एकः निर्णयः श्वः कालस्य भाग्यं निश्चेष्यति।",
    "resolution": "तथा च, एषः प्रवासः प्रचलति, यः नक्षत्रमण्डले सदैव लिखितः भविष्यति।"
  }
};

// 4. Trending presets
const TRENDING_TEMPLATES = [
  {
    title: "The Last Astronaut",
    prompt: "A lone astronaut walking on a glowing purple alien planet watching star dust drift",
    style: "Cinematic",
    lang: "English",
    video: "https://media.w3.org/2010/05/sintel/trailer.mp4"
  },
  {
    title: "Shadows of Kyoto",
    prompt: "Rainy neon-lit street in Tokyo with glowing water reflections and train tracks",
    style: "Realistic",
    lang: "English",
    video: "https://media.w3.org/2010/05/bunny/trailer.mp4"
  },
  {
    title: "Whispering Woodlands",
    prompt: "An enchanted magical forest river glowing under crystal sunlight with floating particles",
    style: "Fantasy",
    lang: "English",
    video: "https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4"
  }
];

// ─────────────────────────────────────────────────────────────────
// App Global State
// ─────────────────────────────────────────────────────────────────
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
  soundtrack: "cinematic_epic",
  theme: "dark",
  geminiKey: "",
  pexelsKey: "",
  watermark: "none",
  history: [],
  audioUnlocked: false  // FIX: tracks user-gesture audio unlock
};

let elements = {};

// ─────────────────────────────────────────────────────────────────
// Audio System
// FIX: Create bgMusicAudio lazily after user gesture to avoid
// autoplay policy blocks
// ─────────────────────────────────────────────────────────────────
let bgMusicAudio = null;
let activeUtterance = null;
let voiceVolume = 1;
let musicVolume = 0.4;
let sceneStartTimes = [];
let playerTimer = null;
let elapsedTime = 0;
let totalMovieDuration = 30;
let spokenScenes = new Set();
let currentMediaLoadToken = 0;
let lastTickerTime = 0;    // FIX: initialize to 0, set properly in startPlayback
const mediaUrlValidationCache = new Map();
let dragStartIndex;
let animationFrameId;

const DEBUG_PREFIX = "[CineStory Media]";

function debugMedia(label, payload = {}) { console.log(`${DEBUG_PREFIX} ${label}`, payload); }
function warnMedia(label, payload = {})  { console.warn(`${DEBUG_PREFIX} ${label}`, payload); }
function errorMedia(label, payload = {}) { console.error(`${DEBUG_PREFIX} ${label}`, payload); }

// ─────────────────────────────────────────────────────────────────
// FIX: Audio Unlock — must be called on a user gesture event
// Browsers block audio until the user interacts
// ─────────────────────────────────────────────────────────────────
function unlockAudioContext() {
  if (appState.audioUnlocked) return;
  appState.audioUnlocked = true;

  // Create bgMusicAudio on first gesture so autoplay policy is satisfied
  if (!bgMusicAudio) {
    bgMusicAudio = new Audio();
    bgMusicAudio.loop = true;
    bgMusicAudio.volume = musicVolume;
    bgMusicAudio.preload = "auto";

    bgMusicAudio.addEventListener("canplay", () =>
      debugMedia("audio canplay", { src: bgMusicAudio.currentSrc || bgMusicAudio.src }));
    bgMusicAudio.addEventListener("error", () =>
      errorMedia("audio failed", { src: bgMusicAudio.currentSrc || bgMusicAudio.src, error: bgMusicAudio.error }));
  }

  // FIX: Pre-warm speech synthesis voices list (async, browser-dependent)
  if ("speechSynthesis" in window) {
    window.speechSynthesis.getVoices(); // trigger voice list load
    window.speechSynthesis.onvoiceschanged = () => {
      debugMedia("voices loaded", { count: window.speechSynthesis.getVoices().length });
      // Re-populate voice selector if visible
      if (document.getElementById("voice-select")) populateVoiceSelector();
    };
  }

  debugMedia("audio unlocked", { triggered: "user-gesture" });
}

function getOrCreateBgAudio() {
  if (!bgMusicAudio) {
    bgMusicAudio = new Audio();
    bgMusicAudio.loop = true;
    bgMusicAudio.volume = musicVolume;
    bgMusicAudio.preload = "auto";
  }
  return bgMusicAudio;
}

function getFallbackVideoUrl(style = appState.style, seed = 0) {
  const collection = PREMIUM_VIDEO_CATALOG[style] || PREMIUM_VIDEO_CATALOG.Cinematic;
  return collection[Math.abs(seed) % collection.length];
}

function mediaElementProbe(url, type = "video", timeoutMs = 8000) {
  return new Promise((resolve) => {
    const el = document.createElement(type === "audio" ? "audio" : "video");
    let finished = false;
    el.preload = "metadata";
    if (type === "video") {
      el.muted = true;
      el.playsInline = true;
    }

    const finish = (result) => {
      if (finished) return;
      finished = true;
      clearTimeout(timer);
      el.removeEventListener("loadedmetadata", onReady);
      el.removeEventListener("canplay", onReady);
      el.removeEventListener("error", onError);
      el.removeAttribute("src");
      el.load();
      resolve(result);
    };

    const onReady = () => finish({
      ok: true,
      via: "media-element",
      finalUrl: el.currentSrc || url,
      duration: Number.isFinite(el.duration) ? el.duration : null,
      width: el.videoWidth || null,
      height: el.videoHeight || null
    });
    const onError = () => finish({
      ok: false,
      via: "media-element",
      reason: "media-element-error",
      code: el.error?.code || "unknown",
      message: el.error?.message || "unknown"
    });
    const timer = setTimeout(() => finish({
      ok: false,
      via: "media-element",
      reason: "validation-timeout"
    }), timeoutMs);

    el.addEventListener("loadedmetadata", onReady, { once: true });
    el.addEventListener("canplay", onReady, { once: true });
    el.addEventListener("error", onError, { once: true });
    el.src = url;
    el.load();
  });
}

async function validateMediaUrl(url, type = "video") {
  const cleaned = sanitizeMediaUrl(url);
  const cacheKey = `${type}:${cleaned}`;
  if (!cleaned) {
    const result = { ok: false, url, type, reason: "empty-url" };
    warnMedia(`${type} url validation`, result);
    return result;
  }
  if (!/^https?:\/\//i.test(cleaned)) {
    const result = { ok: false, url: cleaned, type, reason: "unsupported-url-scheme" };
    warnMedia(`${type} url validation`, result);
    return result;
  }
  if (mediaUrlValidationCache.has(cacheKey)) return mediaUrlValidationCache.get(cacheKey);

  const expectedPrefix = type === "audio" ? "audio/" : "video/";
  const expectedExt = type === "audio" ? /\.(mp3|m4a|wav|ogg)(\?|#|$)/i : /\.(mp4|webm|mov|m4v)(\?|#|$)/i;
  let result;

  try {
    const response = await fetch(cleaned, { method: "HEAD", cache: "no-store", redirect: "follow" });
    const contentType = (response.headers.get("content-type") || "").toLowerCase();
    const acceptRanges = response.headers.get("accept-ranges") || "";
    const finalUrl = response.url || cleaned;
    const mimeLooksPlayable = contentType.startsWith(expectedPrefix) ||
      (contentType === "application/octet-stream" && expectedExt.test(finalUrl));

    if (!response.ok) {
      result = {
        ok: false,
        url: cleaned,
        finalUrl,
        type,
        status: response.status,
        contentType,
        acceptRanges,
        reason: "non-2xx-response"
      };
    } else if (!mimeLooksPlayable) {
      result = {
        ok: false,
        url: cleaned,
        finalUrl,
        type,
        status: response.status,
        contentType,
        acceptRanges,
        reason: "invalid-mime-type"
      };
    } else {
      result = {
        ok: true,
        url: cleaned,
        finalUrl,
        type,
        status: response.status,
        contentType,
        acceptRanges,
        via: "head"
      };
    }
  } catch (error) {
    warnMedia(`${type} url validation`, {
      url: cleaned,
      reason: "head-request-failed",
      error: error.message,
      fallback: "media-element-probe"
    });
    result = await mediaElementProbe(cleaned, type);
    result = { ...result, url: cleaned, finalUrl: result.finalUrl || cleaned, type };
  }

  if (result.ok) debugMedia(`${type} url validation`, result);
  else warnMedia(`${type} url validation`, result);
  mediaUrlValidationCache.set(cacheKey, result);
  return result;
}

// Try loading URLs in sequence — returns first one that fires canplay within timeout
async function tryVideoUrlsInOrder(vid, urls, timeoutMs = 12000) {
  for (const url of urls) {
    if (!url) continue;
    try {
      const validation = await validateMediaUrl(url, "video");
      if (!validation.ok) {
        warnMedia("video url failed", { url, reason: validation.reason, status: validation.status, contentType: validation.contentType });
        continue;
      }

      const playableUrl = validation.finalUrl || url;
      debugMedia("video request", { attempting: playableUrl, validation });
      // Reset video element completely
      vid.pause();
      vid.removeAttribute("crossorigin");
      vid.removeAttribute("src");
      vid.load();

      const loaded = await new Promise((resolve) => {
        const timer = setTimeout(() => {
          cleanup();
          resolve(false);
        }, timeoutMs);

        const onOk  = () => { cleanup(); resolve(true);  };
        const onErr = () => { cleanup(); resolve(false); };

        function cleanup() {
          clearTimeout(timer);
          vid.removeEventListener("canplay",    onOk);
          vid.removeEventListener("loadeddata", onOk);
          vid.removeEventListener("error",      onErr);
        }

        vid.addEventListener("canplay",    onOk,  { once: true });
        vid.addEventListener("loadeddata", onOk,  { once: true });
        vid.addEventListener("error",      onErr, { once: true });

        vid.setAttribute("src", playableUrl);
        vid.load();
      });

      if (loaded) {
        debugMedia("video source set", { src: playableUrl, status: "loaded-ok" });
        return playableUrl;
      } else {
        warnMedia("video url failed", { url: playableUrl, trying: "next url in list" });
      }
    } catch(e) {
      warnMedia("video url exception", { url, error: e.message });
    }
  }
  return null; // all URLs failed
}

function sanitizeMediaUrl(url) {
  if (typeof url !== "string") return "";
  const cleaned = url.trim();
  if (!cleaned || cleaned === "undefined" || cleaned === "null") return "";
  return cleaned;
}

function ensureSceneMedia(scene, index) {
  if (!scene) return null;
  scene.videoUrl = sanitizeMediaUrl(scene.videoUrl) || getFallbackVideoUrl(appState.style, index);
  scene.audioStatus = scene.audioStatus || "web-speech-ready";
  scene.audioUrl = scene.audioUrl || "";
  scene.mediaReady = Boolean(scene.videoUrl);
  return scene;
}

// ─────────────────────────────────────────────────────────────────
// Particle Background
// ─────────────────────────────────────────────────────────────────
function startParticleBackground() {
  const canvas = document.getElementById('particles-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  const resizeCanvas = () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  };
  resizeCanvas();
  window.addEventListener('resize', resizeCanvas);

  const particles = Array.from({ length: 45 }, () => ({
    x: Math.random() * canvas.width,
    y: Math.random() * canvas.height,
    vx: (Math.random() - 0.5) * 0.2,
    vy: (Math.random() - 0.5) * 0.2,
    size: Math.random() * 2.5 + 0.5,
    opacity: Math.random() * 0.25 + 0.05
  }));

  const drawParticles = () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const isDark = appState.theme === 'dark';
    ctx.fillStyle = isDark ? '#030307' : '#f0f0f5';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    particles.forEach(p => {
      p.x += p.vx; p.y += p.vy;
      if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
      if (p.y < 0 || p.y > canvas.height) p.vy *= -1;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fillStyle = isDark
        ? `rgba(139, 92, 246, ${p.opacity})`
        : `rgba(124, 58, 237, ${p.opacity * 0.5})`;
      ctx.fill();
    });
    animationFrameId = requestAnimationFrame(drawParticles);
  };
  drawParticles();
}

// ─────────────────────────────────────────────────────────────────
// Initialization
// ─────────────────────────────────────────────────────────────────
document.addEventListener("DOMContentLoaded", () => {
  cacheElements();
  loadConfigurations();
  feather.replace();
  startParticleBackground();
  setupMediaDebugging();
  setupEventListeners();
  renderTrendingTemplates();
  initDragAndDrop();
  updateMixerVolumes();
});

function cacheElements() {
  elements = {
    logoBtn: document.getElementById('logo-btn'),
    themeBtn: document.getElementById('theme-btn'),
    themeIcon: document.getElementById('theme-icon'),
    settingsBtn: document.getElementById('settings-btn'),
    historyBtn: document.getElementById('history-btn'),
    setupScreen: document.getElementById('setup-screen'),
    workspaceScreen: document.getElementById('workspace-screen'),
    mainLayout: document.getElementById('main-layout'),
    promptInput: document.getElementById('prompt-input'),
    randomPromptBtn: document.getElementById('random-prompt-btn'),
    styleSelect: document.getElementById('style-select'),
    languageSelect: document.getElementById('language-select'),
    ratioSelector: document.getElementById('ratio-selector'),
    durationSelector: document.getElementById('duration-selector'),
    generateBtn: document.getElementById('generate-btn'),
    templatesGrid: document.getElementById('templates-grid'),
    tabContentArea: document.getElementById('tab-content-area'),
    timelineList: document.getElementById('timeline-list'),
    regenerateAllBtn: document.getElementById('regenerate-all-scenes-btn'),
    soundtrackSelect: document.getElementById('soundtrack-select'),
    exportVideoBtn: document.getElementById('export-video-btn'),
    returnSetupBtn: document.getElementById('return-setup-btn'),
    videoPreviewContainer: document.getElementById('video-preview-container'),
    previewVideo: document.getElementById('preview-video'),
    subtitleText: document.getElementById('subtitle-text'),
    renderOverlay: document.getElementById('render-overlay'),
    renderStageTitle: document.getElementById('render-stage-title'),
    renderStageDesc: document.getElementById('render-stage-desc'),
    progressFill: document.getElementById('progress-fill'),
    progressPct: document.getElementById('progress-pct'),
    playPauseBtn: document.getElementById('play-pause-btn'),
    stopBtn: document.getElementById('stop-btn'),
    playerScrubber: document.getElementById('player-scrubber'),
    timeCurrent: document.getElementById('player-time-current'),
    timeDuration: document.getElementById('player-time-duration'),
    voiceVolumeSlider: document.getElementById('voice-volume-slider'),
    musicVolumeSlider: document.getElementById('music-volume-slider'),
    settingsModal: document.getElementById('settings-modal'),
    settingsClose: document.getElementById('settings-close-btn'),
    settingsCancel: document.getElementById('settings-cancel-btn'),
    settingsSave: document.getElementById('settings-save-btn'),
    geminiKey: document.getElementById('gemini-key-input'),
    pexelsKey: document.getElementById('pexels-key-input'),
    watermarkSelect: document.getElementById('watermark-select'),
    historyModal: document.getElementById('history-modal'),
    historyClose: document.getElementById('history-close-btn'),
    historyClear: document.getElementById('history-clear-btn'),
    historyDone: document.getElementById('history-done-btn'),
    historyListContainer: document.getElementById('history-list-container'),
    toastContainer: document.getElementById('toast-container')
  };
}

// ─────────────────────────────────────────────────────────────────
// FIX: Media debugging — attach events after video element is ready
// ─────────────────────────────────────────────────────────────────
function setupMediaDebugging() {
  const vid = elements.previewVideo;
  if (!vid) return;
  vid.preload = "auto";

  vid.addEventListener("loadstart",      () => debugMedia("video loadstart",      { src: vid.currentSrc || vid.src }));
  vid.addEventListener("loadedmetadata", () => debugMedia("video metadata loaded", { src: vid.currentSrc, duration: vid.duration, w: vid.videoWidth, h: vid.videoHeight }));
  vid.addEventListener("canplay",        () => debugMedia("video canplay",         { src: vid.currentSrc }));
  vid.addEventListener("playing",        () => debugMedia("playback state",        { state: "video-playing", elapsedTime, scene: appState.activeSceneIndex }));
  vid.addEventListener("pause",          () => debugMedia("playback state",        { state: "video-paused",  elapsedTime, scene: appState.activeSceneIndex }));
  vid.addEventListener("stalled",        () => warnMedia("video stalled",          { src: vid.currentSrc }));
  vid.addEventListener("waiting",        () => warnMedia("video buffering",        { src: vid.currentSrc }));
  vid.addEventListener("error", () => {
    const errCode = vid.error ? vid.error.code : "unknown";
    const errMsg  = vid.error ? vid.error.message : "unknown";
    errorMedia("video play error", {
      src: vid.currentSrc || vid.getAttribute("src") || "(empty)",
      code: errCode,
      message: errMsg,
      // code 4 = MEDIA_ERR_SRC_NOT_SUPPORTED (bad URL, wrong MIME, CORS, 404)
      // code 3 = MEDIA_ERR_DECODE
      // code 2 = MEDIA_ERR_NETWORK
      hint: errCode === 4 ? "URL returned non-video response or is unreachable" :
            errCode === 2 ? "Network error loading video" : "Video decode/format error"
    });
    // FIX: Don't loop-retry from here — loadSceneVideo's tryVideoUrlsInOrder handles fallbacks.
    // Only trigger a fresh scene load if we're not already mid-load (avoids re-entry).
    if (appState.scenes.length && !elements.videoPreviewContainer.classList.contains("loading")) {
      const idx = appState.activeSceneIndex;
      warnMedia("video error recovery", { scene: idx + 1, action: "reloading scene with fallback chain" });
      loadSceneVideo(idx, { autoplay: appState.isPlaying, reason: "error-recovery" });
    }
  });
}

function loadConfigurations() {
  appState.theme = localStorage.getItem('studio-theme') || 'dark';
  appState.geminiKey = localStorage.getItem('studio-gemini-key') || '';
  appState.pexelsKey = localStorage.getItem('studio-pexels-key') || '';
  appState.watermark = localStorage.getItem('studio-watermark') || 'none';
  document.body.setAttribute('data-theme', appState.theme);
  updateThemeIcon();
  if (elements.geminiKey) elements.geminiKey.value = appState.geminiKey;
  if (elements.pexelsKey) elements.pexelsKey.value = appState.pexelsKey;
  if (elements.watermarkSelect) elements.watermarkSelect.value = appState.watermark;
  const storedHistory = localStorage.getItem('studio-history');
  if (storedHistory) {
    try { appState.history = JSON.parse(storedHistory); } catch(e) { appState.history = []; }
  }
}

function updateThemeIcon() {
  if (elements.themeIcon) {
    elements.themeIcon.setAttribute('data-feather', appState.theme === 'light' ? 'moon' : 'sun');
    feather.replace();
  }
}

// ─────────────────────────────────────────────────────────────────
// Event Listeners
// FIX: All interactive elements call unlockAudioContext() on click
// ─────────────────────────────────────────────────────────────────
function setupEventListeners() {
  // Unlock audio on ANY user interaction
  document.addEventListener('click',      unlockAudioContext, { once: false });
  document.addEventListener('touchstart', unlockAudioContext, { once: false });
  document.addEventListener('keydown',    unlockAudioContext, { once: false });

  elements.themeBtn.addEventListener('click', () => {
    appState.theme = appState.theme === 'dark' ? 'light' : 'dark';
    document.body.setAttribute('data-theme', appState.theme);
    localStorage.setItem('studio-theme', appState.theme);
    updateThemeIcon();
    showToast(`Toggled ${appState.theme} mode`, 'success');
  });

  elements.logoBtn.addEventListener('click', () => {
    showScreen('setup');
    stopPlayback();
  });

  elements.settingsBtn.addEventListener('click',   () => elements.settingsModal.classList.remove('hidden'));
  elements.settingsClose.addEventListener('click',  () => elements.settingsModal.classList.add('hidden'));
  elements.settingsCancel.addEventListener('click', () => elements.settingsModal.classList.add('hidden'));
  elements.settingsSave.addEventListener('click', () => {
    appState.geminiKey = elements.geminiKey.value.trim();
    appState.pexelsKey = elements.pexelsKey.value.trim();
    appState.watermark = elements.watermarkSelect.value;
    localStorage.setItem('studio-gemini-key', appState.geminiKey);
    localStorage.setItem('studio-pexels-key', appState.pexelsKey);
    localStorage.setItem('studio-watermark', appState.watermark);
    elements.settingsModal.classList.add('hidden');
    showToast("Configurations saved successfully", "success");
  });

  elements.historyBtn.addEventListener('click', () => {
    renderHistoryModalList();
    elements.historyModal.classList.remove('hidden');
  });
  elements.historyClose.addEventListener('click', () => elements.historyModal.classList.add('hidden'));
  elements.historyDone.addEventListener('click',  () => elements.historyModal.classList.add('hidden'));
  elements.historyClear.addEventListener('click', () => {
    appState.history = [];
    localStorage.removeItem('studio-history');
    renderHistoryModalList();
    showToast("Workspace history cleared", "success");
  });

  elements.ratioSelector.querySelectorAll('.selector-option').forEach(opt => {
    opt.addEventListener('click', () => {
      elements.ratioSelector.querySelector('.active').classList.remove('active');
      opt.classList.add('active');
      appState.aspectRatio = opt.dataset.ratio;
    });
  });

  elements.durationSelector.querySelectorAll('.selector-option').forEach(opt => {
    opt.addEventListener('click', () => {
      elements.durationSelector.querySelector('.active').classList.remove('active');
      opt.classList.add('active');
      appState.duration = parseInt(opt.dataset.duration);
    });
  });

  document.querySelectorAll('.suggestion-pill').forEach(pill => {
    pill.addEventListener('click', () => {
      elements.promptInput.value = pill.dataset.prompt;
      showToast("Template loaded into console", "success");
    });
  });

  elements.randomPromptBtn.addEventListener('click', () => {
    const randomTemplates = [
      "A golden steam-powered airship sailing through neon pink clouds over a mechanical floating continent",
      "An ancient samurai warrior standing on top of a water pagoda, petals falling as lightning strikes in the distance",
      "A whimsical tiny dragon trying to light a campfire inside a magical cave full of blue fireflies",
      "A vintage explorer entering a dense jungle clearing to discover a giant moving obsidian mirror",
      "A fast cinematic camera tracking a futuristic cyber bike riding under huge neon billboards in torrential rain"
    ];
    elements.promptInput.value = randomTemplates[Math.floor(Math.random() * randomTemplates.length)];
    showToast("Cinematic idea generated", "success");
  });

  elements.generateBtn.addEventListener('click', () => {
    unlockAudioContext(); // FIX: ensure audio unlocked on generate
    const promptText = elements.promptInput.value.trim();
    if (!promptText) {
      showToast("Please write a story prompt first!", "error");
      return;
    }
    appState.prompt = promptText;
    appState.style = elements.styleSelect.value;
    appState.language = elements.languageSelect.value;
    startGenerationPipeline();
  });

  elements.returnSetupBtn.addEventListener('click', () => {
    showScreen('setup');
    stopPlayback();
  });

  // FIX: Play/Pause button — unlock audio, handle promise
  elements.playPauseBtn.addEventListener('click', () => {
    unlockAudioContext();
    if (appState.isPlaying) {
      pausePlayback();
    } else {
      startPlayback();
    }
  });

  elements.stopBtn.addEventListener('click', () => {
    unlockAudioContext();
    stopPlayback();
  });

  elements.playerScrubber.addEventListener('input', (e) => {
    updatePlaybackScrub(parseFloat(e.target.value));
  });

  elements.voiceVolumeSlider.addEventListener('input', (e) => {
    voiceVolume = parseFloat(e.target.value);
    // Restart current narration with new volume
    if (window.speechSynthesis.speaking) {
      window.speechSynthesis.cancel();
      spokenScenes.delete(appState.activeSceneIndex);
    }
  });

  elements.musicVolumeSlider.addEventListener('input', (e) => {
    musicVolume = parseFloat(e.target.value);
    const audio = getOrCreateBgAudio();
    audio.volume = musicVolume;
  });

  elements.soundtrackSelect.addEventListener('change', (e) => {
    appState.soundtrack = e.target.value;
    if (appState.isPlaying) playBackgroundMusic();
  });

  elements.regenerateAllBtn.addEventListener('click', async () => {
    showToast("Resyncing moving footage assets...", "success");
    for (let i = 0; i < appState.scenes.length; i++) {
      appState.scenes[i].videoUrl = await searchVideoAsset(appState.scenes[i].prompt, appState.style);
    }
    updateTimelineList();
    loadSceneVideo(appState.activeSceneIndex, { autoplay: appState.isPlaying, reason: "resync-all" });
  });

  elements.exportVideoBtn.addEventListener('click', () => {
    unlockAudioContext();
    triggerVideoExport();
  });
}

// ─────────────────────────────────────────────────────────────────
// Screen Switcher
// ─────────────────────────────────────────────────────────────────
function showScreen(screen) {
  if (screen === 'setup') {
    elements.setupScreen.classList.remove('hidden');
    elements.workspaceScreen.classList.add('hidden');
  } else {
    elements.setupScreen.classList.add('hidden');
    elements.workspaceScreen.classList.remove('hidden');
    elements.videoPreviewContainer.className = "video-preview-container";
    if (appState.aspectRatio === "16:9")      elements.videoPreviewContainer.classList.add("aspect-16-9");
    else if (appState.aspectRatio === "9:16") elements.videoPreviewContainer.classList.add("aspect-9-16");
    else                                      elements.videoPreviewContainer.classList.add("aspect-1-1");
  }
}

// ─────────────────────────────────────────────────────────────────
// Toast Notifications
// ─────────────────────────────────────────────────────────────────
function showToast(message, type = 'success') {
  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  toast.innerHTML = `<i data-feather="${type === 'success' ? 'check-circle' : 'alert-circle'}"></i> <span>${message}</span>`;
  elements.toastContainer.appendChild(toast);
  feather.replace();
  setTimeout(() => {
    toast.style.animation = "slide-in 0.3s ease reverse";
    setTimeout(() => toast.remove(), 300);
  }, 3500);
}

// ─────────────────────────────────────────────────────────────────
// Trending Templates
// ─────────────────────────────────────────────────────────────────
function renderTrendingTemplates() {
  elements.templatesGrid.innerHTML = "";
  TRENDING_TEMPLATES.forEach(tpl => {
    const card = document.createElement('div');
    card.className = "template-card";
    card.innerHTML = `
      <div class="template-media">
        <video class="template-video" src="${tpl.video}" muted loop playsinline preload="metadata"></video>
        <span class="template-badge">${tpl.style}</span>
      </div>
      <div class="template-info">
        <h4 class="template-title-text">${tpl.title}</h4>
        <p class="template-prompt-desc">${tpl.prompt}</p>
      </div>
    `;
    const video = card.querySelector('video');
    card.addEventListener('mouseenter', () => video.play().catch(() => {}));
    card.addEventListener('mouseleave', () => { video.pause(); video.currentTime = 0; });
    card.addEventListener('click', () => {
      elements.promptInput.value = tpl.prompt;
      elements.styleSelect.value = tpl.style;
      elements.languageSelect.value = tpl.lang;
      showToast(`Loaded template: "${tpl.title}"`, "success");
      elements.promptInput.scrollIntoView({ behavior: 'smooth', block: 'center' });
    });
    elements.templatesGrid.appendChild(card);
  });
}

// ─────────────────────────────────────────────────────────────────
// Generation Pipeline
// ─────────────────────────────────────────────────────────────────
async function startGenerationPipeline() {
  showScreen('workspace');
  elements.renderOverlay.classList.remove('hidden');
  stopPlayback();

  try {
    updateProgress(0, 15, "Initializing AI Story Engine...", "Structuring script guidelines and translating parameters.");
    await delay(800);

    updateProgress(1, 40, "Writing screenplay scripts...", `Generating title, character bios and scene cards in ${appState.language}.`);

    let movieData;
    if (appState.geminiKey) {
      try {
        movieData = await generateStoryWithGemini();
      } catch (geminiError) {
        warnMedia("Gemini failed, falling back", { error: geminiError.message });
        movieData = await generateStoryProcedurally();
      }
    } else {
      movieData = await generateStoryProcedurally();
    }
    debugMedia("video api response", { title: movieData.title, sceneCount: movieData.scenes?.length });

    appState.generatedTitle = movieData.title;
    appState.characterBio = movieData.characterBio;
    appState.scenes = (movieData.scenes || []).map((scene, index) => ({
      ...scene,
      duration: Number(scene.duration) > 0 ? Number(scene.duration) : Math.ceil(appState.duration / Math.max(1, movieData.scenes.length)),
      narration: scene.narration || "",
      keywords: Array.isArray(scene.keywords) ? scene.keywords : []
    }));

    updateProgress(2, 60, "Connecting to Stock footage APIs...", "Searching high-definition actual moving scenes.");

    for (let i = 0; i < appState.scenes.length; i++) {
      const scene = appState.scenes[i];
      updateProgress(2, 60 + Math.floor((i / appState.scenes.length) * 30),
        "Compiling scene visuals...", `Matching real video for Scene ${i + 1}`);
      scene.videoUrl = await searchVideoAsset(scene.prompt, appState.style);
      ensureSceneMedia(scene, i);
      debugMedia("generated urls", { scene: i + 1, videoUrl: scene.videoUrl, audioStatus: scene.audioStatus });
    }

    updateProgress(3, 100, "Synthesizing cinematic audio mix...", "Aligning narration, music and subtitle overlays.");
    debugMedia("audio api response", {
      mode: "browser-speech-synthesis",
      soundtrack: appState.soundtrack,
      soundtrackUrl: PREMIUM_SOUNDTRACKS[appState.soundtrack],
      scenes: appState.scenes.map((s, i) => ({ scene: i + 1, narrationLen: s.narration.length, audioStatus: s.audioStatus }))
    });
    await delay(700);

    saveProjectToHistory();

    // FIX: Hide overlay BEFORE loading scene so video is visible
    elements.renderOverlay.classList.add('hidden');

    renderWorkspaceTabs('script');
    updateTimelineList();
    initializeTimelineDurations();

    // FIX: Load first scene and force video to show
    await loadSceneVideo(0, { autoplay: false, reason: "generation-complete" });

    showToast("AI Cinema Story successfully compiled!", "success");

  } catch (error) {
    errorMedia("generation failed", { message: error.message, stack: error.stack });
    elements.renderOverlay.classList.add('hidden');
    showToast("Generation failed: " + error.message, "error");
    showScreen('setup');
  }
}

function updateProgress(stepNum, pct, title, desc) {
  debugMedia("render progress", { step: stepNum, pct, title, desc });
  elements.renderStageTitle.textContent = title;
  elements.renderStageDesc.textContent = desc;
  elements.progressFill.style.width = `${pct}%`;
  elements.progressPct.textContent = `${pct}%`;
  for (let i = 0; i <= 3; i++) {
    const node = document.getElementById(`step-${i}`);
    const fill = document.getElementById(`fill-${i}`);
    if (i < stepNum)       { node.className = "pipeline-node completed"; if (fill) fill.style.width = "100%"; }
    else if (i === stepNum) { node.className = "pipeline-node active";    if (fill) fill.style.width = "50%"; }
    else                    { node.className = "pipeline-node";           if (fill) fill.style.width = "0%"; }
  }
}

// ─────────────────────────────────────────────────────────────────
// Procedural Story Generator
// ─────────────────────────────────────────────────────────────────
async function generateStoryProcedurally() {
  await delay(1200);
  const style = appState.style;
  const lang = appState.language;
  const promptText = appState.prompt;
  const template = MULTILINGUAL_TEMPLATES[lang] || MULTILINGUAL_TEMPLATES["English"];
  const titleSeed = promptText.split(" ").slice(0, 3).join(" ") || "Unknown Path";
  const title = `${template.titlePrefix} ${titleSeed}`;

  const sceneCount = appState.duration <= 30 ? 3 : (appState.duration <= 60 ? 5 : 8);

  const moods = {
    "Cinematic":   { music: "cinematic_epic" },
    "Realistic":   { music: "lofi_chill" },
    "Anime":       { music: "fantasy_enchanted" },
    "Horror":      { music: "horror_ambient" },
    "Fantasy":     { music: "fantasy_enchanted" },
    "Documentary": { music: "lofi_chill" },
    "Adventure":   { music: "cinematic_epic" },
    "Kids story":  { music: "kids_happy" },
    "Motivational":{ music: "cinematic_epic" }
  };
  const currentMood = moods[style] || moods["Cinematic"];
  appState.soundtrack = currentMood.music;
  if (elements.soundtrackSelect) elements.soundtrackSelect.value = currentMood.music;

  const scenes = [];
  for (let i = 0; i < sceneCount; i++) {
    let subPrompt, narrationText, keywords;
    if (i === 0) {
      subPrompt = `Cinematic establishing shot showing: ${promptText}. Natural motion, panning camera.`;
      narrationText = template.intro;
      keywords = ["establishing shot", "epic vista", style.toLowerCase()];
    } else if (i === sceneCount - 1) {
      subPrompt = `Triumphant final shot, smooth slow camera zoom out, cinematic lighting, ${style} aesthetic.`;
      narrationText = template.resolution;
      keywords = ["climax", "sunset", "cinematic resolution"];
    } else if (i === Math.floor(sceneCount / 2)) {
      subPrompt = `Extreme close up of character, detailed facial expression, dramatic lighting, rich movement, ${style}.`;
      narrationText = template.climax;
      keywords = ["character close up", "emotion", "dramatic action"];
    } else {
      subPrompt = `Cinematic wide shot tracking shot, moving scenery, atmospheric background, ${style}.`;
      narrationText = template.conflict;
      keywords = ["camera movement", "nature", "epic landscape"];
    }
    scenes.push({
      sceneId: i,
      prompt: subPrompt,
      narration: narrationText,
      duration: Math.ceil(appState.duration / sceneCount),
      videoUrl: "",
      keywords
    });
  }
  return { title, characterBio: template.charBio, scenes };
}

// ─────────────────────────────────────────────────────────────────
// Gemini Story Generator
// ─────────────────────────────────────────────────────────────────
async function generateStoryWithGemini() {
  const { prompt: promptText, style, language: lang, duration } = appState;
  const sceneCount = duration <= 30 ? 3 : (duration <= 60 ? 5 : 8);
  const systemInstruction = `You are a professional movie studio screenplay writer. Break down the user prompt into a story format.
Generate JSON matching:
{
  "title": "Story Title",
  "characterBio": "Brief description of the main character",
  "scenes": [
    { "prompt": "Detailed cinematic prompt for video generation", "narration": "Full narration text in ${lang}", "duration": 6, "keywords": ["list","of","keywords"] }
  ]
}
Ensure exactly ${sceneCount} scenes. Output ONLY valid JSON inside a \`\`\`json block.`;

  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${appState.geminiKey}`;
  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      contents: [{ parts: [{ text: `${systemInstruction}\n\nPrompt: ${promptText}\nStyle: ${style}\nLanguage: ${lang}` }] }]
    })
  });
  if (!response.ok) throw new Error(`Gemini API error: ${response.status}`);
  const resJson = await response.json();
  debugMedia("video api response", { provider: "gemini", status: response.status });
  const rawText = resJson.candidates?.[0]?.content?.parts?.[0]?.text || "";
  const jsonMatch = rawText.match(/```json\s*([\s\S]*?)\s*```/) || rawText.match(/({[\s\S]*})/);
  if (jsonMatch) {
    const data = JSON.parse(jsonMatch[1]);
    if (data.title && Array.isArray(data.scenes)) return data;
  }
  throw new Error("Unable to parse Gemini script structure.");
}

// ─────────────────────────────────────────────────────────────────
// Video Asset Search
// ─────────────────────────────────────────────────────────────────
async function searchVideoAsset(scenePrompt, style) {
  if (appState.pexelsKey) {
    try {
      const keywords = scenePrompt.replace(/[^\w\s]/gi, '').split(" ").slice(0, 3).join(" ");
      const url = `https://api.pexels.com/videos/search?query=${encodeURIComponent(keywords)}&per_page=5&orientation=landscape`;
      debugMedia("video request", { provider: "pexels", keywords });
      const response = await fetch(url, { headers: { "Authorization": appState.pexelsKey } });
      debugMedia("video api response", { provider: "pexels", status: response.status, ok: response.ok });
      if (response.ok) {
        const data = await response.json();
        if (data.videos?.length > 0) {
          const selected = data.videos[Math.floor(Math.random() * data.videos.length)];
          const candidates = [
            ...(selected.video_files || []).filter(f => f.quality === 'hd' || f.quality === 'sd'),
            ...(selected.video_files || [])
          ];
          for (const match of candidates) {
            if (!match?.link) continue;
            const validation = await validateMediaUrl(match.link, "video");
            if (validation.ok) {
              debugMedia("generated urls", { provider: "pexels", videoUrl: validation.finalUrl || match.link, validation });
              return validation.finalUrl || match.link;
            }
            warnMedia("video url failed", { provider: "pexels", videoUrl: match.link, reason: validation.reason });
          }
        }
      }
    } catch (e) {
      warnMedia("failed request", { provider: "pexels", error: e.message });
    }
  } else {
    warnMedia("video api response", { provider: "pexels", status: "skipped", reason: "missing-api-key" });
  }

  const catalog = PREMIUM_VIDEO_CATALOG[style] || PREMIUM_VIDEO_CATALOG.Cinematic;
  const seed = Math.floor(Math.random() * 1000);
  const candidates = [...new Set([
    getFallbackVideoUrl(style, seed),
    ...catalog,
    ...HARDCODED_LAST_RESORT_VIDEOS
  ])];
  for (const candidate of candidates) {
    const validation = await validateMediaUrl(candidate, "video");
    if (validation.ok) {
      const finalUrl = validation.finalUrl || candidate;
      debugMedia("generated urls", { provider: "fallback-catalog", videoUrl: finalUrl, validation });
      return finalUrl;
    }
  }

  errorMedia("generated urls", { provider: "fallback-catalog", status: "failed", tried: candidates.length });
  return "";
}

// ─────────────────────────────────────────────────────────────────
// Workspace UI
// ─────────────────────────────────────────────────────────────────
function renderWorkspaceTabs(activeTab) {
  elements.tabContentArea.innerHTML = "";
  elements.workspaceScreen.querySelectorAll('.sidebar-tab').forEach(tab => {
    tab.classList.toggle('active', tab.dataset.tab === activeTab);
  });

  if (activeTab === 'script') {
    elements.tabContentArea.innerHTML = `
      <div class="sidebar-section">
        <label class="option-label">Film Title</label>
        <input type="text" class="sidebar-input" id="edit-story-title" value="${escapeHtml(appState.generatedTitle)}">
      </div>
      <div class="sidebar-section">
        <label class="option-label">Scene Breakdown</label>
        <div style="display:flex; flex-direction:column; gap:10px;" id="scenes-editor-list"></div>
      </div>
    `;
    const editorList = document.getElementById('scenes-editor-list');
    appState.scenes.forEach((scene, index) => {
      const box = document.createElement('div');
      box.style.cssText = "border-left: 2px solid var(--accent-purple); padding-left: 8px;";
      box.innerHTML = `
        <span class="scene-num" style="display:block; margin-bottom:4px;">Scene ${index + 1} Visual Prompt</span>
        <textarea class="sidebar-textarea" style="height:60px; font-size:0.8rem;" data-index="${index}" id="edit-prompt-${index}">${escapeHtml(scene.prompt)}</textarea>
        <span class="scene-num" style="color:var(--text-secondary); display:block; margin: 4px 0;">Voice Narration</span>
        <textarea class="sidebar-textarea" style="height:60px; font-size:0.8rem;" data-index="${index}" id="edit-narration-${index}">${escapeHtml(scene.narration)}</textarea>
      `;
      box.querySelectorAll('textarea').forEach(tx => {
        tx.addEventListener('input', (e) => {
          const idx = parseInt(e.target.dataset.index);
          if (e.target.id.includes('prompt')) appState.scenes[idx].prompt = e.target.value;
          else appState.scenes[idx].narration = e.target.value;
          saveProjectToHistory();
        });
      });
      editorList.appendChild(box);
    });
    document.getElementById('edit-story-title').addEventListener('input', (e) => {
      appState.generatedTitle = e.target.value;
      saveProjectToHistory();
    });

  } else if (activeTab === 'characters') {
    elements.tabContentArea.innerHTML = `
      <div class="sidebar-section">
        <label class="option-label">Character Details</label>
        <textarea class="sidebar-textarea" style="height:150px;" id="edit-char-bio">${escapeHtml(appState.characterBio)}</textarea>
      </div>
      <div class="sidebar-section">
        <label class="option-label">Style Customizations</label>
        <p style="font-size:0.8rem; line-height:1.4;">Active Style: <strong>${escapeHtml(appState.style)}</strong></p>
      </div>
    `;
    document.getElementById('edit-char-bio').addEventListener('input', (e) => {
      appState.characterBio = e.target.value;
      saveProjectToHistory();
    });

  } else {
    elements.tabContentArea.innerHTML = `
      <div class="sidebar-section">
        <label class="option-label">Narrator Voice</label>
        <select class="select-custom" id="voice-select" style="width:100%;"></select>
      </div>
      <div class="sidebar-section">
        <label class="option-label">Narration Pitch</label>
        <input type="range" class="scrubber-slider" id="voice-pitch" min="0.5" max="1.5" step="0.1" value="1">
      </div>
      <div class="sidebar-section">
        <label class="option-label">Narration Rate (Speed)</label>
        <input type="range" class="scrubber-slider" id="voice-rate" min="0.5" max="1.5" step="0.1" value="0.95">
      </div>
    `;
    populateVoiceSelector();
  }

  // Re-attach tab click handlers (clone to remove dupes)
  elements.workspaceScreen.querySelectorAll('.sidebar-tab').forEach(t => {
    const clone = t.cloneNode(true);
    t.parentNode.replaceChild(clone, t);
  });
  elements.workspaceScreen.querySelectorAll('.sidebar-tab').forEach(t => {
    t.addEventListener('click', () => renderWorkspaceTabs(t.dataset.tab));
  });
}

// FIX: Safely escape HTML to prevent XSS in textareas
function escapeHtml(str) {
  return String(str || '').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}

// ─────────────────────────────────────────────────────────────────
// FIX: Voice selector — wait for voices to be ready
// ─────────────────────────────────────────────────────────────────
function populateVoiceSelector() {
  const sel = document.getElementById('voice-select');
  if (!sel) return;

  const fill = () => {
    const voices = window.speechSynthesis.getVoices();
    const selectedLangCode = getLanguageCode(appState.language);
    let filtered = voices.filter(v => v.lang.startsWith(selectedLangCode));
    if (filtered.length === 0) filtered = voices;

    sel.innerHTML = '';
    if (filtered.length === 0) {
      const opt = document.createElement('option');
      opt.textContent = "Browser default voice";
      sel.appendChild(opt);
      return;
    }
    filtered.forEach(v => {
      const opt = document.createElement('option');
      opt.value = v.name;
      opt.textContent = `${v.name} (${v.lang})`;
      sel.appendChild(opt);
    });
    debugMedia("audio api response", { mode: "voice-list-loaded", count: filtered.length, lang: selectedLangCode });
  };

  // FIX: getVoices() may be empty on first call — listen for the event
  const voices = window.speechSynthesis.getVoices();
  if (voices.length > 0) {
    fill();
  } else {
    window.speechSynthesis.onvoiceschanged = fill;
  }
}

function getLanguageCode(lang) {
  const mapping = {
    "English":"en","Hindi":"hi","Odia":"or","Bengali":"bn","Telugu":"te",
    "Tamil":"ta","Malayalam":"ml","Kannada":"kn","Punjabi":"pa","Marathi":"mr",
    "Gujarati":"gu","Assamese":"as","Urdu":"ur","Sanskrit":"sa"
  };
  return mapping[lang] || "en";
}

// ─────────────────────────────────────────────────────────────────
// Timeline Cards
// ─────────────────────────────────────────────────────────────────
function updateTimelineList() {
  elements.timelineList.innerHTML = "";
  appState.scenes.forEach((scene, index) => {
    ensureSceneMedia(scene, index);
    const card = document.createElement('div');
    card.className = `timeline-card ${index === appState.activeSceneIndex ? 'active-scene' : ''}`;
    card.draggable = true;
    card.dataset.index = index;
    card.innerHTML = `
      <div class="timeline-card-header">
        <span class="scene-num">Scene ${index + 1}</span>
        <span class="scene-duration">${scene.duration}s</span>
      </div>
      <div class="timeline-card-body">
        <div class="scene-thumbnail-container">
          <video class="scene-thumbnail-video" src="${scene.videoUrl}" muted playsinline preload="metadata"></video>
        </div>
        <div class="scene-text-preview">${escapeHtml(scene.prompt)}</div>
      </div>
      <div class="timeline-card-actions">
        <button class="btn btn-secondary btn-card-action" data-action="regen" data-index="${index}">
          <i data-feather="refresh-cw" style="width:10px; height:10px;"></i> Replace Video
        </button>
      </div>
    `;
    card.addEventListener('click', (e) => {
      if (e.target.closest('button')) return;
      loadSceneVideo(index, { autoplay: appState.isPlaying, reason: "timeline-click" });
    });
    card.querySelector('button[data-action="regen"]').addEventListener('click', async () => {
      showToast(`Generating new scene for Scene ${index + 1}...`, "success");
      scene.videoUrl = await searchVideoAsset(scene.prompt, appState.style);
      updateTimelineList();
      if (index === appState.activeSceneIndex) {
        loadSceneVideo(index, { autoplay: appState.isPlaying, reason: "replace-scene-video" });
      }
      saveProjectToHistory();
    });
    elements.timelineList.appendChild(card);
  });
  feather.replace();
}

// ─────────────────────────────────────────────────────────────────
// Drag & Drop
// ─────────────────────────────────────────────────────────────────
function initDragAndDrop() {
  const list = elements.timelineList;
  list.addEventListener('dragstart', (e) => {
    const card = e.target.closest('.timeline-card');
    if (!card) return;
    dragStartIndex = parseInt(card.dataset.index);
    card.classList.add('dragging');
  });
  list.addEventListener('dragend', (e) => {
    const card = e.target.closest('.timeline-card');
    if (card) card.classList.remove('dragging');
  });
  list.addEventListener('dragover', (e) => {
    e.preventDefault();
    const afterElement = getDragAfterElement(list, e.clientY);
    const dragging = list.querySelector('.dragging');
    if (!dragging) return;
    if (afterElement == null) list.appendChild(dragging);
    else list.insertBefore(dragging, afterElement);
  });
  list.addEventListener('drop', (e) => {
    e.preventDefault();
    const cards = Array.from(list.querySelectorAll('.timeline-card'));
    const reordered = cards.map(c => appState.scenes[parseInt(c.dataset.index)]);
    appState.scenes = reordered;
    updateTimelineList();
    initializeTimelineDurations();
    loadSceneVideo(0, { autoplay: appState.isPlaying, reason: "timeline-reorder" });
    saveProjectToHistory();
    showToast("Timeline order updated", "success");
  });
}

function getDragAfterElement(container, y) {
  return [...container.querySelectorAll('.timeline-card:not(.dragging)')].reduce((closest, child) => {
    const box = child.getBoundingClientRect();
    const offset = y - box.top - box.height / 2;
    return (offset < 0 && offset > closest.offset) ? { offset, element: child } : closest;
  }, { offset: Number.NEGATIVE_INFINITY }).element;
}

// ─────────────────────────────────────────────────────────────────
// Video Player Core
// FIX: Robust load with proper fallback chain and state management
// ─────────────────────────────────────────────────────────────────
async function waitForVideoReady(video, timeoutMs = 10000) {
  if (video.readyState >= HTMLMediaElement.HAVE_CURRENT_DATA) return true;
  return new Promise((resolve, reject) => {
    const timeout = setTimeout(() => cleanup(() => reject(new Error("Video load timeout"))), timeoutMs);
    const onReady = () => cleanup(() => resolve(true));
    const onError = () => cleanup(() => reject(new Error(`Video error code: ${video.error?.code}` )));
    const cleanup = (done) => {
      clearTimeout(timeout);
      video.removeEventListener("loadeddata", onReady);
      video.removeEventListener("canplay",    onReady);
      video.removeEventListener("error",      onError);
      done();
    };
    video.addEventListener("loadeddata", onReady, { once: true });
    video.addEventListener("canplay",    onReady, { once: true });
    video.addEventListener("error",      onError, { once: true });
  });
}

async function loadSceneVideo(index, options = {}) {
  if (index < 0 || index >= appState.scenes.length) return;

  appState.activeSceneIndex = index;
  document.querySelectorAll('.timeline-card').forEach((c, idx) => {
    c.classList.toggle('active-scene', idx === index);
  });

  const scene = ensureSceneMedia(appState.scenes[index], index);
  const autoplay = options.autoplay ?? appState.isPlaying;
  const loadToken = ++currentMediaLoadToken;
  const vid = elements.previewVideo;

  const cleanUrl = sanitizeMediaUrl(scene.videoUrl);
  debugMedia("load scene", {
    reason: options.reason || "scene-change",
    scene: index + 1,
    videoUrl: cleanUrl,
    audioStatus: scene.audioStatus,
    narrationLen: scene.narration?.length || 0,
    autoplay,
    // FIX: Full diagnostic info for debugging blank video
    vidReadyState: elements.previewVideo?.readyState,
    vidCurrentSrc: elements.previewVideo?.currentSrc || "(empty)",
    urlValid: Boolean(cleanUrl && cleanUrl.startsWith("http"))
  });
  console.log(`%c[CineStory Video] Loading scene ${index + 1}: ${cleanUrl}`, "color:#a78bfa;font-weight:bold;");

  // FIX: Show a loading indicator on the video container during load
  elements.videoPreviewContainer.classList.add('loading');
  elements.videoPreviewContainer.classList.remove('error-state');

  // Build ordered URL list: primary URL first, then full catalog, then last-resort
  const catalog = PREMIUM_VIDEO_CATALOG[appState.style] || PREMIUM_VIDEO_CATALOG.Cinematic;
  const urlsToTry = [...new Set([cleanUrl, ...catalog, ...HARDCODED_LAST_RESORT_VIDEOS])].filter(Boolean);
  debugMedia("video url list", { scene: index + 1, total: urlsToTry.length, primary: cleanUrl });

  const currentSrc = vid.getAttribute("src") || "";
  const alreadyLoaded = currentSrc && urlsToTry.includes(currentSrc) &&
                        vid.readyState >= HTMLMediaElement.HAVE_CURRENT_DATA;
  let videoLoaded = alreadyLoaded;

  if (alreadyLoaded) {
    debugMedia("video source set", { src: currentSrc, status: "reused-cached" });
  } else {
    const loadedUrl = await tryVideoUrlsInOrder(vid, urlsToTry);
    if (loadedUrl) {
      scene.videoUrl = loadedUrl;
      scene.mediaReady = true;
      videoLoaded = true;
      stopCanvasFallback(); // video loaded — remove canvas if it was showing
    } else {
      errorMedia("scene video load failed", {
        scene: index + 1, triedUrls: urlsToTry.length,
        message: "All video sources failed — using canvas fallback"
      });
      // FIX: Start animated canvas fallback so player is never black
      scene.mediaReady = false;
      startCanvasFallback(elements.videoPreviewContainer, appState.style);
      elements.videoPreviewContainer.classList.add('error-state');
      // Hide the video element so it stops firing error events with no src
      elements.previewVideo.style.visibility = "hidden";
      warnMedia("canvas fallback active", { scene: index + 1 });
      showToast("No playable video URL found. Showing animated fallback.", "error");
    }
  }

  if (loadToken !== currentMediaLoadToken) {
    debugMedia("load cancelled", { scene: index + 1, reason: "stale token" });
    elements.videoPreviewContainer.classList.remove('loading');
    return;
  }

  elements.videoPreviewContainer.classList.remove('loading');

  // FIX: Hide the placeholder only once real video data is loaded and visible
  const placeholder = document.getElementById('video-placeholder');
  if (videoLoaded && placeholder && !placeholder.classList.contains('hidden-placeholder')) {
    placeholder.classList.add('hidden-placeholder');
    debugMedia("video source set", { status: "placeholder-hidden", scene: index + 1 });
  } else if (!videoLoaded && placeholder) {
    placeholder.classList.remove('hidden-placeholder');
  }
  // Stop canvas fallback if video loaded successfully
  if (vid.readyState >= HTMLMediaElement.HAVE_CURRENT_DATA) {
    stopCanvasFallback();
    elements.videoPreviewContainer.classList.remove('error-state');
  }

  // FIX: Render first frame even on non-autoplay by seeking to 0.01
  // This paints the video element so it's not black while paused
  try {
    if (Number.isFinite(vid.duration) && vid.duration > 0.05) {
      vid.currentTime = 0.01;
    }
  } catch(e) { /* seek may fail on some formats */ }

  if (autoplay) {
    // FIX: Reset in-flight flag since we just did a fresh load — previous play() is void
    _playInFlight = false;
    safeVideoPlay(vid, `load-scene-${index + 1}`);
  } else {
    vid.pause();
  }

  updatePlaybackTimerUI();
}

function formatTime(sec) {
  const m = Math.floor(sec / 60);
  const s = Math.floor(sec % 60);
  return `${m}:${s < 10 ? '0' : ''}${s}`;
}

function updatePlaybackTimerUI() {
  if (elements.timeCurrent) elements.timeCurrent.textContent = formatTime(elapsedTime);
  if (elements.timeDuration) elements.timeDuration.textContent = formatTime(totalMovieDuration);
  if (elements.playerScrubber) {
    elements.playerScrubber.value = totalMovieDuration > 0 ? (elapsedTime / totalMovieDuration) * 100 : 0;
  }
}

async function updatePlaybackScrub(pctVal) {
  elapsedTime = (pctVal / 100) * totalMovieDuration;
  let activeIdx = 0;
  for (let i = 0; i < appState.scenes.length; i++) {
    if (elapsedTime >= sceneStartTimes[i]) activeIdx = i;
  }
  if ("speechSynthesis" in window) window.speechSynthesis.cancel();
  activeUtterance = null;
  spokenScenes.clear();
  if (elements.subtitleText) elements.subtitleText.textContent = "";
  debugMedia("playback state", { state: "scrub", elapsedTime, scene: activeIdx });
  await loadSceneVideo(activeIdx, { autoplay: appState.isPlaying, reason: "scrub" });
  const offset = elapsedTime - (sceneStartTimes[activeIdx] || 0);
  try {
    const vid = elements.previewVideo;
    if (vid.readyState > 0 && Number.isFinite(offset)) {
      vid.currentTime = Math.max(0, offset % (vid.duration || 1));
    }
  } catch(e) { warnMedia("scrub seek failed", { offset, error: e.message }); }
  updatePlaybackTimerUI();
}

// ─────────────────────────────────────────────────────────────────
// Player Ticker — FIX: use Date.now() delta with proper init
// ─────────────────────────────────────────────────────────────────
// FIX: Track whether a play() call is in-flight to prevent spam
let _playInFlight = false;
// FIX: Track whether canvas fallback is active — skip video play() when it is
let _canvasFallbackActive = false;

function safeVideoPlay(vid, reason) {
  // Never call play() if one is already pending — this is what causes the 987 warnings
  if (_playInFlight) return;
  if (!vid.paused) return; // already playing, nothing to do
  // Skip video play() entirely when canvas fallback is showing —
  // the video element has no valid src so play() would throw NotSupportedError
  if (_canvasFallbackActive) {
    debugMedia("video play skipped", { reason, hint: "canvas fallback active, no valid video src" });
    return;
  }
  _playInFlight = true;
  debugMedia("video play attempt", { reason, readyState: vid.readyState, src: vid.currentSrc || vid.getAttribute("src") });
  vid.play()
    .then(() => {
      _playInFlight = false;
      debugMedia("playback state", { state: "video-playing-confirmed", reason });
    })
    .catch(e => {
      _playInFlight = false;
      // NotAllowedError = autoplay blocked by browser policy (needs user gesture)
      // AbortError = play() interrupted by a load() call - normal, not an error
      if (e.name === "AbortError") return; // silent - load() interrupted play(), fine
      if (e.name === "NotAllowedError") {
        warnMedia("autoplay blocked", { hint: "User must click Play button to start video", error: e.message });
        // Don't retry — set isPlaying false so the UI reflects reality
        if (appState.isPlaying) {
          appState.isPlaying = false;
          if (elements.playPauseBtn) {
            elements.playPauseBtn.innerHTML = `<i data-feather="play"></i>`;
            feather.replace();
          }
          showToast("Click ▶ Play to start (browser requires a click first)", "error");
        }
        return;
      }
      warnMedia("video play error", { name: e.name, message: e.message });
    });
}

function runPlayerTicker() {
  if (!appState.isPlaying) return;

  const now = Date.now();
  const delta = lastTickerTime > 0 ? Math.min((now - lastTickerTime) / 1000, 0.5) : 0;
  lastTickerTime = now;

  elapsedTime = Math.max(0, elapsedTime + delta);
  if (elapsedTime >= totalMovieDuration) {
    stopPlayback();
    return;
  }

  let activeIdx = 0;
  for (let i = 0; i < appState.scenes.length; i++) {
    if (elapsedTime >= sceneStartTimes[i]) activeIdx = i;
  }

  if (activeIdx !== appState.activeSceneIndex) {
    if ("speechSynthesis" in window) window.speechSynthesis.cancel();
    activeUtterance = null;
    spokenScenes.delete(activeIdx);
    if (elements.subtitleText) elements.subtitleText.textContent = "";
    // loadSceneVideo is async — don't await in ticker, it handles its own play()
    loadSceneVideo(activeIdx, { autoplay: true, reason: "timeline-advance" });
  } else {
    // FIX: Only nudge play if video is paused AND we're not mid-load
    // Use safeVideoPlay to avoid the play()-spam that caused 987 console warnings
    const vid = elements.previewVideo;
    if (vid.paused && vid.readyState >= HTMLMediaElement.HAVE_FUTURE_DATA) {
      safeVideoPlay(vid, "ticker-nudge");
    }
  }

  const activeScene = appState.scenes[activeIdx];
  if (activeScene && !spokenScenes.has(activeIdx) && appState.isPlaying) {
    spokenScenes.add(activeIdx);
    speakNarrationSegment(activeScene.narration, activeIdx);
  }

  if (activeScene && !window.speechSynthesis.speaking) {
    const sceneElapsed = elapsedTime - (sceneStartTimes[activeIdx] || 0);
    const words = activeScene.narration.split(" ");
    const wordIdx = Math.floor((sceneElapsed / activeScene.duration) * words.length);
    elements.subtitleText.textContent = words.slice(0, Math.max(1, wordIdx + 1)).join(" ");
  }

  updatePlaybackTimerUI();
  playerTimer = requestAnimationFrame(runPlayerTicker);
}

// ─────────────────────────────────────────────────────────────────
// Speech Synthesis — FIX: async voice loading, volume control,
// graceful fallback if synthesis unavailable
// ─────────────────────────────────────────────────────────────────
function speakNarrationSegment(text, sceneIndex) {
  if (!text || !text.trim()) {
    warnMedia("audio fallback", { scene: sceneIndex + 1, reason: "empty narration" });
    return;
  }

  if (!("speechSynthesis" in window)) {
    warnMedia("audio fallback", { scene: sceneIndex + 1, reason: "speech synthesis unavailable" });
    if (elements.subtitleText) elements.subtitleText.textContent = text;
    return;
  }

  // FIX: Cancel any in-progress speech before starting new utterance
  // Important: do NOT cancel then immediately speak on the same tick — Chrome
  // silently drops speak() called synchronously after cancel(). We cancel, then
  // create the utterance, then speak() inside a setTimeout(fn, 0) below.
  if (window.speechSynthesis.speaking || window.speechSynthesis.pending) {
    window.speechSynthesis.cancel();
  }

  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = getLanguageCode(appState.language);
  utterance.volume = Math.max(0, Math.min(1, voiceVolume));

  debugMedia("audio request", {
    mode: "speech-synthesis",
    scene: sceneIndex + 1,
    lang: utterance.lang,
    textLength: text.length,
    volume: utterance.volume
  });

  // FIX: Get voice from selector (may not exist yet — safe fallback)
  const voiceNameEl = document.getElementById('voice-select');
  if (voiceNameEl && voiceNameEl.value) {
    const voices = window.speechSynthesis.getVoices();
    const selectedVoice = voices.find(v => v.name === voiceNameEl.value);
    if (selectedVoice) utterance.voice = selectedVoice;
  }

  const pitchEl = document.getElementById('voice-pitch');
  const rateEl  = document.getElementById('voice-rate');
  utterance.rate  = parseFloat(rateEl?.value  || "0.95");
  utterance.pitch = parseFloat(pitchEl?.value || "1");

  utterance.onstart = () => {
    activeUtterance = utterance;
    debugMedia("audio api response", {
      mode: "speech-synthesis", scene: sceneIndex + 1,
      status: "started", voice: utterance.voice?.name || "browser-default"
    });
    const audio = getOrCreateBgAudio();
    fadeAudioVolume(audio, audio.volume, 0.08, 300); // Duck music
  };

  utterance.onboundary = (e) => {
    if (appState.activeSceneIndex !== sceneIndex) return;
    if (e.name === 'word' || e.name === 'sentence') {
      const end = e.charIndex + (e.charLength || 10);
      if (elements.subtitleText) elements.subtitleText.textContent = text.slice(0, end);
    }
  };

  utterance.onend = () => {
    debugMedia("audio api response", { mode: "speech-synthesis", scene: sceneIndex + 1, status: "ended" });
    if (activeUtterance === utterance) activeUtterance = null;
    const audio = getOrCreateBgAudio();
    fadeAudioVolume(audio, audio.volume, musicVolume, 400); // Restore music
    if (elements.subtitleText) elements.subtitleText.textContent = text; // Show full text at end
  };

  utterance.onerror = (e) => {
    // FIX: 'interrupted' is expected when cancel() is called — don't treat as real error
    if (e.error === 'interrupted' || e.error === 'canceled') return;
    errorMedia("audio api response", { mode: "speech-synthesis", scene: sceneIndex + 1, status: "failed", error: e.error });
    if (elements.subtitleText) elements.subtitleText.textContent = text;
    const audio = getOrCreateBgAudio();
    fadeAudioVolume(audio, audio.volume, musicVolume, 400);
  };

  // FIX: Chrome bug — synthesis may silently fail; use a small delay before speaking
  // Additional Chrome bug: synthesis pauses silently after ~15s — ping resume() periodically
  debugMedia("audio request", { mode: "speech-synthesis-queued", scene: sceneIndex + 1 });
  setTimeout(() => {
    if (appState.isPlaying && spokenScenes.has(sceneIndex)) {
      // Chrome workaround: resume() before speak() if synthesis was paused
      if (window.speechSynthesis.paused) window.speechSynthesis.resume();
      window.speechSynthesis.speak(utterance);
      debugMedia("audio api response", { mode: "speech-synthesis", scene: sceneIndex + 1, status: "speak-called" });
    }
  }, 150);

  // FIX: Chrome keeps synthesis alive — ping resume() every 10s to prevent silent pause
  if (!window._synthKeepAlive) {
    window._synthKeepAlive = setInterval(() => {
      if (window.speechSynthesis.speaking && window.speechSynthesis.paused) {
        window.speechSynthesis.resume();
        debugMedia("audio api response", { mode: "speech-synthesis", status: "resume-ping" });
      }
    }, 10000);
  }
}

function fadeAudioVolume(audioObj, startVol, endVol, durationMs) {
  if (!audioObj) return;
  const stepCount = 10;
  const stepTime = durationMs / stepCount;
  const volDiff = (endVol - startVol) / stepCount;
  let currentStep = 0;
  const timer = setInterval(() => {
    currentStep++;
    audioObj.volume = Math.max(0, Math.min(1, startVol + volDiff * currentStep));
    if (currentStep >= stepCount) { clearInterval(timer); audioObj.volume = endVol; }
  }, stepTime);
}

// ─────────────────────────────────────────────────────────────────
// Playback Control
// FIX: Proper initialization, unlocking, and error handling
// ─────────────────────────────────────────────────────────────────
function startPlayback() {
  if (!appState.scenes.length) {
    showToast("Generate a story before playing.", "error");
    return;
  }
  unlockAudioContext();
  appState.isPlaying = true;
  debugMedia("playback state", { state: "start", elapsedTime, scene: appState.activeSceneIndex });

  elements.playPauseBtn.innerHTML = `<i data-feather="pause"></i>`;
  feather.replace();

  // FIX: Initialize lastTickerTime HERE, just before the first tick
  lastTickerTime = Date.now();

  playBackgroundMusic();

  const vid = elements.previewVideo;
  // FIX: Use safeVideoPlay — handles NotAllowedError, AbortError, and in-flight dedup
  _playInFlight = false; // reset on explicit user-initiated play
  safeVideoPlay(vid, "start-playback");

  // Start narration for current scene if not yet spoken
  const currentScene = appState.scenes[appState.activeSceneIndex];
  if (currentScene) {
    spokenScenes.delete(appState.activeSceneIndex);
    spokenScenes.add(appState.activeSceneIndex);
    speakNarrationSegment(currentScene.narration, appState.activeSceneIndex);
  }

  cancelAnimationFrame(playerTimer);
  playerTimer = requestAnimationFrame(runPlayerTicker);
}

function pausePlayback() {
  appState.isPlaying = false;
  _playInFlight = false;
  debugMedia("playback state", { state: "pause", elapsedTime, scene: appState.activeSceneIndex });
  elements.playPauseBtn.innerHTML = `<i data-feather="play"></i>`;
  feather.replace();
  const audio = getOrCreateBgAudio();
  audio.pause();
  elements.previewVideo.pause();
  if ("speechSynthesis" in window) window.speechSynthesis.cancel();
  activeUtterance = null;
  spokenScenes.delete(appState.activeSceneIndex);
  cancelAnimationFrame(playerTimer);
}

function stopPlayback() {
  appState.isPlaying = false;
  debugMedia("playback state", { state: "stop", elapsedTime, scene: appState.activeSceneIndex });
  elements.playPauseBtn.innerHTML = `<i data-feather="play"></i>`;
  feather.replace();

  const audio = getOrCreateBgAudio();
  audio.pause();
  audio.currentTime = 0;

  const vid = elements.previewVideo;
  vid.pause();
  try {
    if (vid.readyState > 0 && Number.isFinite(vid.duration)) vid.currentTime = 0.01;
  } catch(e) { /* ignore */ }

  if ("speechSynthesis" in window) window.speechSynthesis.cancel();
  activeUtterance = null;
  if (elements.subtitleText) elements.subtitleText.textContent = "";
  cancelAnimationFrame(playerTimer);

  elapsedTime = 0;
  lastTickerTime = 0;
  spokenScenes.clear();
  _playInFlight = false;
  stopCanvasFallback();

  // FIX: Clear synthesis keepalive on stop
  if (window._synthKeepAlive) {
    clearInterval(window._synthKeepAlive);
    window._synthKeepAlive = null;
  }

  if (appState.scenes.length) {
    loadSceneVideo(0, { autoplay: false, reason: "stop-reset" });
  }
}

// ─────────────────────────────────────────────────────────────────
// Background Music
// FIX: Robust play with retry on autoplay block
// ─────────────────────────────────────────────────────────────────
async function tryLoadAudioWithFallback(audio, primaryUrl, fallbacks = []) {
  const urls = [primaryUrl, ...fallbacks].filter(Boolean);
  for (const url of urls) {
    try {
      const validation = await validateMediaUrl(url, "audio");
      if (!validation.ok) {
        warnMedia("audio fallback", { failedUrl: url, reason: validation.reason, status: validation.status, contentType: validation.contentType });
        continue;
      }

      const playableUrl = validation.finalUrl || url;
      audio.src = playableUrl;
      audio.load();
      debugMedia("audio request", { mode: "background-music-load", url: playableUrl, validation });
      await new Promise((resolve, reject) => {
        const onLoad = () => { audio.removeEventListener('canplay', onLoad); audio.removeEventListener('error', onErr); resolve(); };
        const onErr = () => { audio.removeEventListener('canplay', onLoad); audio.removeEventListener('error', onErr); reject(new Error('audio load failed')); };
        audio.addEventListener('canplay', onLoad, { once: true });
        audio.addEventListener('error', onErr, { once: true });
        setTimeout(() => { audio.removeEventListener('canplay', onLoad); audio.removeEventListener('error', onErr); reject(new Error('audio load timeout')); }, 5000);
      });
      debugMedia("audio api response", { mode: "background-music", url: playableUrl, status: "loaded" });
      return playableUrl;
    } catch(e) {
      warnMedia("audio fallback", { failedUrl: url, error: e.message, trying: "next fallback" });
    }
  }
  warnMedia("audio fallback", { reason: "all audio sources failed — music disabled" });
  return null;
}

function playBackgroundMusic() {
  const track = PREMIUM_SOUNDTRACKS[appState.soundtrack];
  if (!track) { warnMedia("audio fallback", { reason: "no soundtrack URL" }); return; }

  const audio = getOrCreateBgAudio();
  debugMedia("audio request", { soundtrack: appState.soundtrack, track, volume: musicVolume });

  const needsLoad = !audio.src || (!audio.src.endsWith(track) && audio.src !== track);
  if (needsLoad) {
    tryLoadAudioWithFallback(audio, track, AUDIO_FALLBACK_URLS).then((loadedUrl) => {
      if (!loadedUrl) {
        warnMedia("audio fallback", { mode: "background-music", status: "disabled" });
        return;
      }
      audio.volume = musicVolume;
      if (!appState.isPlaying) return;
      audio.play()
        .then(() => debugMedia("audio api response", { soundtrack: appState.soundtrack, status: "playing" }))
        .catch(e => {
          warnMedia("audio play blocked", { track, error: e.message });
          setTimeout(() => { if (appState.isPlaying) audio.play().catch(() => {}); }, 1000);
        });
    });
    return;
  }

  audio.volume = musicVolume;
  const playPromise = audio.play();
  if (playPromise !== undefined) {
    playPromise
      .then(() => debugMedia("audio api response", { soundtrack: appState.soundtrack, status: "playing" }))
      .catch(e => {
        warnMedia("audio play blocked", { track, error: e.message,
          hint: "AudioContext requires user gesture. Music will start on next interaction." });
        setTimeout(() => {
          if (appState.isPlaying) audio.play().catch(() => {});
        }, 1000);
      });
  }
}

function updateMixerVolumes() {
  voiceVolume = parseFloat(elements.voiceVolumeSlider?.value || "1");
  musicVolume = parseFloat(elements.musicVolumeSlider?.value || "0.4");
  const audio = getOrCreateBgAudio();
  audio.volume = musicVolume;
}

function initializeTimelineDurations() {
  let acc = 0;
  sceneStartTimes = [];
  appState.scenes.forEach(scene => {
    sceneStartTimes.push(acc);
    acc += scene.duration;
  });
  totalMovieDuration = acc;
  debugMedia("timeline durations", { sceneStartTimes, totalMovieDuration });
}

// ─────────────────────────────────────────────────────────────────
// Video Export Engine
// ─────────────────────────────────────────────────────────────────
function getSupportedRecorderMimeType() {
  const candidates = ['video/webm;codecs=vp9,opus', 'video/webm;codecs=vp8,opus', 'video/webm'];
  return candidates.find(t => MediaRecorder.isTypeSupported(t)) || '';
}

async function loadExportVideoElement(scene, index) {
  ensureSceneMedia(scene, index);
  const video = document.createElement('video');
  // FIX: Do NOT set crossOrigin for export - CDN videos don't send CORS headers
  // Removing crossOrigin allows the browser to load the video without CORS restriction
  video.muted = true;
  video.playsInline = true;
  video.preload = "auto";
  video.src = scene.videoUrl;
  video.load();
  try {
    await waitForVideoReady(video, 12000);
    video.currentTime = 0;
    await video.play();
    debugMedia("render progress", { stage: "export-video-loaded", scene: index + 1 });
    return { video, ok: true };
  } catch (error) {
    errorMedia("render progress", { stage: "export-video-failed", scene: index + 1, error: error.message });
    video.remove();
    return { video: null, ok: false };
  }
}

async function triggerVideoExport() {
  showToast("Preparing rendering frames...", "success");
  const overlay = document.createElement('div');
  overlay.className = "render-overlay";
  overlay.innerHTML = `
    <div class="render-progress-card">
      <div class="orbit-loader" style="margin: 0 auto 20px auto;"></div>
      <h3 class="render-stage-title">Compiling Video File</h3>
      <p class="render-stage-desc">Synthesizing audio nodes, applying styles, drawing frame buffers.</p>
      <div class="progress-container">
        <div class="progress-bar-sweep">
          <div class="progress-fill-sweep" id="export-progress-fill" style="width: 0%;"></div>
        </div>
        <span class="progress-pct" id="export-progress-pct">0%</span>
      </div>
      <button class="btn btn-secondary" id="cancel-export-btn" style="margin-top:20px; font-size:0.8rem;">Cancel Export</button>
    </div>
  `;
  document.body.appendChild(overlay);

  const exportCanvas = document.createElement('canvas');
  let width = 1280, height = 720;
  if (appState.aspectRatio === "9:16")  { width = 720;  height = 1280; }
  else if (appState.aspectRatio === "1:1") { width = 1080; height = 1080; }
  exportCanvas.width = width; exportCanvas.height = height;
  const ctx = exportCanvas.getContext('2d');

  let isCancelled = false;
  document.getElementById('cancel-export-btn').addEventListener('click', () => {
    isCancelled = true;
    overlay.remove();
    showToast("Export cancelled", "error");
  });

  const canvasStream = exportCanvas.captureStream(30);
  const outputStream = new MediaStream(canvasStream.getVideoTracks());

  const exportMusic = new Audio();
  // FIX: Remove crossOrigin — audio CDNs may not send CORS headers
  // exportMusic.crossOrigin = "anonymous";
  exportMusic.loop = true;
  exportMusic.volume = Math.min(0.8, musicVolume);
  exportMusic.src = PREMIUM_SOUNDTRACKS[appState.soundtrack] || PREMIUM_SOUNDTRACKS.cinematic_epic;

  try {
    await exportMusic.play();
    const audioStream = exportMusic.captureStream?.() || exportMusic.mozCaptureStream?.();
    if (audioStream) {
      audioStream.getAudioTracks().forEach(t => outputStream.addTrack(t));
      debugMedia("audio api response", { mode: "export-soundtrack", status: "attached" });
    }
  } catch (e) {
    warnMedia("audio fallback", { mode: "export-soundtrack", error: e.message });
  }

  const mimeType = getSupportedRecorderMimeType();
  const mediaRecorder = new MediaRecorder(outputStream, {
    ...(mimeType ? { mimeType } : {}),
    videoBitsPerSecond: 3000000
  });
  const chunks = [];
  mediaRecorder.ondataavailable = (e) => { if (e.data.size > 0) chunks.push(e.data); };
  mediaRecorder.onstop = () => {
    if (isCancelled) return;
    overlay.remove();
    exportMusic.pause();
    const blob = new Blob(chunks, { type: mimeType || 'video/webm' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${appState.generatedTitle.replace(/\s+/g, '_')}_CineStory.webm`;
    a.click();
    showToast("Download started! Open with any media player.", "success");
    debugMedia("render progress", { stage: "export-complete", blobSize: blob.size });
  };

  mediaRecorder.start();
  const progressFill = document.getElementById('export-progress-fill');
  const progressPct  = document.getElementById('export-progress-pct');
  const totalScenes  = appState.scenes.length;

  for (let idx = 0; idx < totalScenes; idx++) {
    if (isCancelled) break;
    const scene = appState.scenes[idx];
    const { video, ok } = await loadExportVideoElement(scene, idx);
    const fps = 30;
    const framesCount = scene.duration * fps;
    const words = scene.narration.split(" ");

    for (let frame = 0; frame < framesCount; frame++) {
      if (isCancelled) break;
      if (ok && video?.readyState >= HTMLMediaElement.HAVE_CURRENT_DATA) {
        ctx.drawImage(video, 0, 0, width, height);
      } else {
        const grad = ctx.createLinearGradient(0, 0, width, height);
        grad.addColorStop(0, "#111827");
        grad.addColorStop(0.5, "#312e81");
        grad.addColorStop(1, "#030712");
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, width, height);
      }
      if (appState.watermark === 'cinestory') {
        ctx.fillStyle = "rgba(255,255,255,0.4)";
        ctx.font = "bold 24px sans-serif";
        ctx.fillText("CineStory Studio", 30, 50);
      }
      ctx.fillStyle = "rgba(0,0,0,0.7)";
      ctx.beginPath();
      if (ctx.roundRect) ctx.roundRect(50, height - 150, width - 100, 90, 12);
      else ctx.rect(50, height - 150, width - 100, 90);
      ctx.fill();
      ctx.fillStyle = "#ffffff";
      ctx.textAlign = "center";
      ctx.font = "28px sans-serif";
      const wordIdx = Math.floor((frame / framesCount) * words.length);
      ctx.fillText(words.slice(0, Math.max(1, wordIdx + 1)).join(" "), width / 2, height - 95);
      await delay(1000 / fps);
      const pct = Math.floor(((idx * framesCount + frame) / (totalScenes * framesCount)) * 100);
      if (progressFill) progressFill.style.width = `${pct}%`;
      if (progressPct)  progressPct.textContent  = `${pct}%`;
    }
    if (video) { video.pause(); video.remove(); }
  }
  mediaRecorder.stop();
  if (isCancelled) exportMusic.pause();
}

// ─────────────────────────────────────────────────────────────────
// History
// ─────────────────────────────────────────────────────────────────
function saveProjectToHistory() {
  const id = appState.generatedTitle.replace(/\s+/g, '_') + '_' + Date.now();
  const project = {
    id, title: appState.generatedTitle, prompt: appState.prompt,
    style: appState.style, language: appState.language,
    aspectRatio: appState.aspectRatio, duration: appState.duration,
    characterBio: appState.characterBio, scenes: appState.scenes,
    timestamp: Date.now()
  };
  const existingIdx = appState.history.findIndex(p => p.title === appState.generatedTitle);
  if (existingIdx !== -1) appState.history[existingIdx] = project;
  else appState.history.unshift(project);
  try { localStorage.setItem('studio-history', JSON.stringify(appState.history)); } catch(e) {
    warnMedia("history save failed", { error: e.message });
  }
}

function renderHistoryModalList() {
  elements.historyListContainer.innerHTML = "";
  if (!appState.history.length) {
    elements.historyListContainer.innerHTML = `<p style="text-align:center; padding: 2rem 0; color:var(--text-tertiary);">No projects saved yet.</p>`;
    return;
  }
  appState.history.forEach(proj => {
    const item = document.createElement('div');
    item.className = "history-item";
    item.innerHTML = `
      <div class="history-details">
        <h4 class="history-title">${escapeHtml(proj.title)}</h4>
        <div class="history-meta">
          <span>${escapeHtml(proj.style)}</span><span>&bull;</span>
          <span>${escapeHtml(proj.language)}</span><span>&bull;</span>
          <span>${proj.scenes.length} Scenes</span>
        </div>
      </div>
      <button class="btn btn-secondary btn-card-action" data-action="load">Open Studio</button>
    `;
    item.querySelector('button').addEventListener('click', () => {
      Object.assign(appState, {
        generatedTitle: proj.title, prompt: proj.prompt, style: proj.style,
        language: proj.language, aspectRatio: proj.aspectRatio,
        duration: proj.duration, characterBio: proj.characterBio, scenes: proj.scenes
      });
      showScreen('workspace');
      renderWorkspaceTabs('script');
      updateTimelineList();
      initializeTimelineDurations();
      loadSceneVideo(0, { autoplay: false, reason: "history-load" });
      elements.historyModal.classList.add('hidden');
      showToast(`Loaded: "${proj.title}"`, "success");
    });
    elements.historyListContainer.appendChild(item);
  });
}

// ─────────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────────
function delay(ms) { return new Promise(r => setTimeout(r, ms)); }
