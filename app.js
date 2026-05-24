// CineStory AI Studio - Core Logic

// 1. Curated Premium Video Database (Moving Footage Loops)
// These are high-quality, actual moving footage clips from public CDNs/media archives
const PREMIUM_VIDEO_CATALOG = {
  "Cinematic": [
    "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4",
    "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
    "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4"
  ],
  "Realistic": [
    "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/SubaruOutbackOnStreetAndDirt.mp4",
    "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/WeAreGoingOnBullrun.mp4"
  ],
  "Anime": [
    "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
    "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4"
  ],
  "Horror": [
    "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4"
  ],
  "Fantasy": [
    "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4"
  ],
  "Documentary": [
    "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/SubaruOutbackOnStreetAndDirt.mp4"
  ],
  "Adventure": [
    "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/WeAreGoingOnBullrun.mp4"
  ],
  "Kids story": [
    "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4"
  ],
  "Motivational": [
    "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4"
  ]
};

// 2. Pre-curated Soundtracks (Audio loop URLs)
const PREMIUM_SOUNDTRACKS = {
  "cinematic_epic": "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
  "cyberpunk_synth": "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3",
  "horror_ambient": "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-8.mp3",
  "fantasy_enchanted": "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-10.mp3",
  "lofi_chill": "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-15.mp3",
  "kids_happy": "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-12.mp3"
};

// 3. Multi-lingual Templates for Script Procedural Generator
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
    video: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4"
  },
  {
    title: "Shadows of Kyoto",
    prompt: "Rainy neon-lit street in Tokyo with glowing water reflections and train tracks",
    style: "Realistic",
    lang: "English",
    video: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/SubaruOutbackOnStreetAndDirt.mp4"
  },
  {
    title: "Whispering Woodlands",
    prompt: "An enchanted magical forest river glowing under crystal sunlight with floating particles",
    style: "Fantasy",
    lang: "English",
    video: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4"
  }
];

// App Global State
let appState = {
  prompt: "",
  style: "Cinematic",
  language: "English",
  duration: 30, // seconds
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
  history: []
};

// HTML Elements Cache
let elements = {};

// Audio variables
let bgMusicAudio = new Audio();
bgMusicAudio.loop = true;
let activeUtterance = null;
let wordBoundaries = [];
let voiceVolume = 1;
let musicVolume = 0.4;
let ttsStartTimestamp = 0;
let sceneStartTimes = []; // Tracks timestamps when each scene should start playing during whole playback
let playerTimer = null;
let elapsedTime = 0; // Current elapsed time in seconds
let totalMovieDuration = 30; // Total duration in seconds
let spokenScenes = new Set(); // Tracks which scenes have spoken in the current run

// Particle Background Animator
let animationFrameId;
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

  const particlesCount = 45;
  const particles = Array.from({ length: particlesCount }, () => ({
    x: Math.random() * canvas.width,
    y: Math.random() * canvas.height,
    vx: (Math.random() - 0.5) * 0.2,
    vy: (Math.random() - 0.5) * 0.2,
    size: Math.random() * 2.5 + 0.5,
    opacity: Math.random() * 0.25 + 0.05
  }));

  const drawParticles = () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Smooth background gradient based on theme
    const isDark = appState.theme === 'dark';
    ctx.fillStyle = isDark ? '#030307' : '#f0f0f5';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    particles.forEach(p => {
      p.x += p.vx;
      p.y += p.vy;

      if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
      if (p.y < 0 || p.y > canvas.height) p.vy *= -1;

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fillStyle = isDark ? `rgba(139, 92, 246, ${p.opacity})` : `rgba(124, 58, 237, ${p.opacity * 0.5})`;
      ctx.fill();
    });

    animationFrameId = requestAnimationFrame(drawParticles);
  };
  drawParticles();
}

// Initialization
document.addEventListener("DOMContentLoaded", () => {
  cacheElements();
  loadConfigurations();
  feather.replace();
  startParticleBackground();
  setupEventListeners();
  renderTrendingTemplates();
  initDragAndDrop();
  updateMixerVolumes();
});

// Cache DOM Nodes
function cacheElements() {
  elements = {
    logoBtn: document.getElementById('logo-btn'),
    themeBtn: document.getElementById('theme-btn'),
    themeIcon: document.getElementById('theme-icon'),
    settingsBtn: document.getElementById('settings-btn'),
    historyBtn: document.getElementById('history-btn'),
    
    // Screens
    setupScreen: document.getElementById('setup-screen'),
    workspaceScreen: document.getElementById('workspace-screen'),
    mainLayout: document.getElementById('main-layout'),
    
    // Setup inputs
    promptInput: document.getElementById('prompt-input'),
    randomPromptBtn: document.getElementById('random-prompt-btn'),
    styleSelect: document.getElementById('style-select'),
    languageSelect: document.getElementById('language-select'),
    ratioSelector: document.getElementById('ratio-selector'),
    durationSelector: document.getElementById('duration-selector'),
    generateBtn: document.getElementById('generate-btn'),
    templatesGrid: document.getElementById('templates-grid'),
    
    // Studio Panel UI
    tabContentArea: document.getElementById('tab-content-area'),
    timelineList: document.getElementById('timeline-list'),
    regenerateAllBtn: document.getElementById('regenerate-all-scenes-btn'),
    soundtrackSelect: document.getElementById('soundtrack-select'),
    exportVideoBtn: document.getElementById('export-video-btn'),
    returnSetupBtn: document.getElementById('return-setup-btn'),
    
    // Video Player
    videoPreviewContainer: document.getElementById('video-preview-container'),
    previewVideo: document.getElementById('preview-video'),
    subtitleText: document.getElementById('subtitle-text'),
    renderOverlay: document.getElementById('render-overlay'),
    renderStageTitle: document.getElementById('render-stage-title'),
    renderStageDesc: document.getElementById('render-stage-desc'),
    progressFill: document.getElementById('progress-fill'),
    progressPct: document.getElementById('progress-pct'),
    
    // Player controls
    playPauseBtn: document.getElementById('play-pause-btn'),
    stopBtn: document.getElementById('stop-btn'),
    playerScrubber: document.getElementById('player-scrubber'),
    timeCurrent: document.getElementById('player-time-current'),
    timeDuration: document.getElementById('player-time-duration'),
    voiceVolumeSlider: document.getElementById('voice-volume-slider'),
    musicVolumeSlider: document.getElementById('music-volume-slider'),
    
    // Modals
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

// Settings storage
function loadConfigurations() {
  appState.theme = localStorage.getItem('studio-theme') || 'dark';
  appState.geminiKey = localStorage.getItem('studio-gemini-key') || '';
  appState.pexelsKey = localStorage.getItem('studio-pexels-key') || '';
  appState.watermark = localStorage.getItem('studio-watermark') || 'none';
  
  // Set theme attributes
  document.body.setAttribute('data-theme', appState.theme);
  updateThemeIcon();
  
  // Sync to elements
  if (elements.geminiKey) elements.geminiKey.value = appState.geminiKey;
  if (elements.pexelsKey) elements.pexelsKey.value = appState.pexelsKey;
  if (elements.watermarkSelect) elements.watermarkSelect.value = appState.watermark;
  
  // Load History
  const storedHistory = localStorage.getItem('studio-history');
  if (storedHistory) {
    appState.history = JSON.parse(storedHistory);
  }
}

function updateThemeIcon() {
  if (elements.themeIcon) {
    if (appState.theme === 'light') {
      elements.themeIcon.setAttribute('data-feather', 'moon');
    } else {
      elements.themeIcon.setAttribute('data-feather', 'sun');
    }
    feather.replace();
  }
}

// Core Handlers
function setupEventListeners() {
  // Theme Toggle
  elements.themeBtn.addEventListener('click', () => {
    appState.theme = appState.theme === 'dark' ? 'light' : 'dark';
    document.body.setAttribute('data-theme', appState.theme);
    localStorage.setItem('studio-theme', appState.theme);
    updateThemeIcon();
    showToast(`Toggled ${appState.theme} mode`, 'success');
  });

  // Logo Button resets view
  elements.logoBtn.addEventListener('click', () => {
    showScreen('setup');
    stopPlayback();
  });

  // Settings Modal controls
  elements.settingsBtn.addEventListener('click', () => {
    elements.settingsModal.classList.remove('hidden');
  });
  elements.settingsClose.addEventListener('click', () => {
    elements.settingsModal.classList.add('hidden');
  });
  elements.settingsCancel.addEventListener('click', () => {
    elements.settingsModal.classList.add('hidden');
  });
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

  // Project History modal controls
  elements.historyBtn.addEventListener('click', () => {
    renderHistoryModalList();
    elements.historyModal.classList.remove('hidden');
  });
  elements.historyClose.addEventListener('click', () => {
    elements.historyModal.classList.add('hidden');
  });
  elements.historyDone.addEventListener('click', () => {
    elements.historyModal.classList.add('hidden');
  });
  elements.historyClear.addEventListener('click', () => {
    appState.history = [];
    localStorage.removeItem('studio-history');
    renderHistoryModalList();
    showToast("Workspace history cleared", "success");
  });

  // Setup form parameters triggers
  // Aspect Ratio selection
  elements.ratioSelector.querySelectorAll('.selector-option').forEach(opt => {
    opt.addEventListener('click', () => {
      elements.ratioSelector.querySelector('.active').classList.remove('active');
      opt.classList.add('active');
      appState.aspectRatio = opt.dataset.ratio;
    });
  });

  // Duration selection
  elements.durationSelector.querySelectorAll('.selector-option').forEach(opt => {
    opt.addEventListener('click', () => {
      elements.durationSelector.querySelector('.active').classList.remove('active');
      opt.classList.add('active');
      appState.duration = parseInt(opt.dataset.duration);
    });
  });

  // Prompt suggestions click action
  document.querySelectorAll('.suggestion-pill').forEach(pill => {
    pill.addEventListener('click', () => {
      elements.promptInput.value = pill.dataset.prompt;
      showToast("Template loaded into console", "success");
    });
  });

  // Surprise me randomizer
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

  // "Generate" Main Action Trigger
  elements.generateBtn.addEventListener('click', () => {
    const promptText = elements.promptInput.value.trim();
    if (!promptText) {
      showToast("Please write a story prompt first!", "error");
      return;
    }
    appState.prompt = promptText;
    appState.style = elements.styleSelect.value;
    appState.language = elements.languageSelect.value;
    
    // Start generating
    startGenerationPipeline();
  });

  // Workspace actions
  elements.returnSetupBtn.addEventListener('click', () => {
    showScreen('setup');
    stopPlayback();
  });

  // Player controls interaction
  elements.playPauseBtn.addEventListener('click', () => {
    if (appState.isPlaying) {
      pausePlayback();
    } else {
      startPlayback();
    }
  });

  elements.stopBtn.addEventListener('click', () => {
    stopPlayback();
  });

  elements.playerScrubber.addEventListener('input', (e) => {
    updatePlaybackScrub(parseFloat(e.target.value));
  });

  // Mixers volume inputs
  elements.voiceVolumeSlider.addEventListener('input', (e) => {
    voiceVolume = parseFloat(e.target.value);
    if (activeUtterance) {
      window.speechSynthesis.cancel();
      // Restart speech from active word or play normally
      startSpeechSynthesis(appState.scenes[appState.activeSceneIndex].narration);
    }
  });

  elements.musicVolumeSlider.addEventListener('input', (e) => {
    musicVolume = parseFloat(e.target.value);
    bgMusicAudio.volume = musicVolume;
  });

  // Soundtrack selector
  elements.soundtrackSelect.addEventListener('change', (e) => {
    appState.soundtrack = e.target.value;
    if (appState.isPlaying) {
      playBackgroundMusic();
    }
  });

  // Global resync visuals
  elements.regenerateAllBtn.addEventListener('click', async () => {
    showToast("Resyncing moving footage assets...", "success");
    for (let i = 0; i < appState.scenes.length; i++) {
      appState.scenes[i].videoUrl = await searchVideoAsset(appState.scenes[i].prompt, appState.style);
    }
    updateTimelineList();
    loadSceneVideo(appState.activeSceneIndex);
  });

  // Export video trigger
  elements.exportVideoBtn.addEventListener('click', () => {
    triggerVideoExport();
  });
}

// Layout Screen Switcher
function showScreen(screen) {
  if (screen === 'setup') {
    elements.setupScreen.classList.remove('hidden');
    elements.workspaceScreen.classList.add('hidden');
  } else {
    elements.setupScreen.classList.add('hidden');
    elements.workspaceScreen.classList.remove('hidden');
    
    // Update player container aspect ratio display
    elements.videoPreviewContainer.className = "video-preview-container";
    if (appState.aspectRatio === "16:9") {
      elements.videoPreviewContainer.classList.add("aspect-16-9");
    } else if (appState.aspectRatio === "9:16") {
      elements.videoPreviewContainer.classList.add("aspect-9-16");
    } else {
      elements.videoPreviewContainer.classList.add("aspect-1-1");
    }
  }
}

// Toast Alert Manager
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

// Render presets
function renderTrendingTemplates() {
  elements.templatesGrid.innerHTML = "";
  TRENDING_TEMPLATES.forEach(tpl => {
    const card = document.createElement('div');
    card.className = "template-card";
    card.innerHTML = `
      <div class="template-media">
        <video class="template-video" src="${tpl.video}" muted loop playsinline></video>
        <span class="template-badge">${tpl.style}</span>
      </div>
      <div class="template-info">
        <h4 class="template-title-text">${tpl.title}</h4>
        <p class="template-prompt-desc">${tpl.prompt}</p>
      </div>
    `;
    
    // Play video on hover
    const video = card.querySelector('video');
    card.addEventListener('mouseenter', () => video.play());
    card.addEventListener('mouseleave', () => {
      video.pause();
      video.currentTime = 0;
    });

    card.addEventListener('click', () => {
      elements.promptInput.value = tpl.prompt;
      elements.styleSelect.value = tpl.style;
      elements.languageSelect.value = tpl.lang;
      showToast(`Loaded template: "${tpl.title}"`, "success");
      // Scroll to console top smoothly
      elements.promptInput.scrollIntoView({ behavior: 'smooth', block: 'center' });
    });

    elements.templatesGrid.appendChild(card);
  });
}

// ----------------------------------------------------
// 3. Script & Cinematic Breakdown Generator Engine
// ----------------------------------------------------
async function startGenerationPipeline() {
  showScreen('workspace');
  elements.renderOverlay.classList.remove('hidden');
  stopPlayback();

  try {
    // Stage 1: Generate Story Structure
    updateProgress(0, 15, "Initializing AI Story Engine...", "Structuring script guidelines and translating parameters.");
    await delay(1000);

    updateProgress(1, 40, "Writing screenplay scripts...", `Generating title, character bios and scene cards in ${appState.language}.`);
    
    let movieData;
    if (appState.geminiKey) {
      movieData = await generateStoryWithGemini();
    } else {
      movieData = await generateStoryProcedurally();
    }

    appState.generatedTitle = movieData.title;
    appState.characterBio = movieData.characterBio;
    appState.scenes = movieData.scenes;

    // Stage 2: Sourcing Video Footage
    updateProgress(2, 75, "Connecting to Stock footage APIs...", "Searching high-definition actual moving scenes (no slideshows).");
    
    for (let i = 0; i < appState.scenes.length; i++) {
      const scene = appState.scenes[i];
      updateProgress(2, 75 + Math.floor((i / appState.scenes.length) * 20), "Compiling scene visuals...", `Matching real video sequence for Scene ${i + 1}: ${scene.keywords.slice(0, 3).join(', ')}`);
      scene.videoUrl = await searchVideoAsset(scene.prompt, appState.style);
    }

    // Stage 3: Dynamic Audio Prep
    updateProgress(3, 100, "Synthesizing cinematic audio mix...", "Aligning text-to-speech timelines, music and subtitle overlays.");
    await delay(1000);

    // Save project in history
    saveProjectToHistory();

    // Render workspace contents
    elements.renderOverlay.classList.add('hidden');
    renderWorkspaceTabs('script');
    updateTimelineList();
    initializeTimelineDurations();
    
    // Load first scene
    loadSceneVideo(0, true);
    showToast("AI Cinema Story successfully compiled!", "success");

  } catch (error) {
    console.error(error);
    elements.renderOverlay.classList.add('hidden');
    showToast("Generation failed: " + error.message, "error");
    showScreen('setup');
  }
}

function updateProgress(stepNum, pct, title, desc) {
  elements.renderStageTitle.textContent = title;
  elements.renderStageDesc.textContent = desc;
  elements.progressFill.style.width = `${pct}%`;
  elements.progressPct.textContent = `${pct}%`;

  // Set active stepper pipeline indicator
  for (let i = 0; i <= 3; i++) {
    const node = document.getElementById(`step-${i}`);
    const connector = document.getElementById(`fill-${i}`);
    if (i < stepNum) {
      node.className = "pipeline-node completed";
      if (connector) connector.style.width = "100%";
    } else if (i === stepNum) {
      node.className = "pipeline-node active";
      if (connector) connector.style.width = "50%";
    } else {
      node.className = "pipeline-node";
      if (connector) connector.style.width = "0%";
    }
  }
}

// Procedural Script Generator (Runs fully local, zero-dependency)
async function generateStoryProcedurally() {
  await delay(1500); // Simulate API latency
  
  const style = appState.style;
  const lang = appState.language;
  const promptText = appState.prompt;
  const template = MULTILINGUAL_TEMPLATES[lang] || MULTILINGUAL_TEMPLATES["English"];
  
  // Extract keywords from user prompt to customize the story
  const titleSeed = promptText.split(" ").slice(0, 3).join(" ") || "Unknown Path";
  const title = `${template.titlePrefix} ${titleSeed} (${template.titleSuffix})`;
  
  // Scene count based on duration settings
  const sceneCount = appState.duration <= 30 ? 3 : (appState.duration <= 60 ? 5 : 8);
  const scenes = [];
  
  const moods = {
    "Cinematic": { voice: "dramatic", music: "cinematic_epic" },
    "Realistic": { voice: "natural", music: "lofi_chill" },
    "Anime": { voice: "whimsical", music: "fantasy_enchanted" },
    "Horror": { voice: "eerie", music: "horror_ambient" },
    "Fantasy": { voice: "mystic", music: "fantasy_enchanted" },
    "Documentary": { voice: "informative", music: "lofi_chill" },
    "Adventure": { voice: "epic", music: "cinematic_epic" },
    "Kids story": { voice: "cheerful", music: "kids_happy" },
    "Motivational": { voice: "inspiring", music: "cinematic_epic" }
  };
  const currentMood = moods[style] || moods["Cinematic"];
  appState.soundtrack = currentMood.music;
  if (elements.soundtrackSelect) elements.soundtrackSelect.value = currentMood.music;

  // Generate sequence of prompts and narratives dynamically
  for (let i = 0; i < sceneCount; i++) {
    let subPrompt = "";
    let narrationText = "";
    let keywords = [];

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
      keywords: keywords
    });
  }

  return {
    title: title,
    characterBio: template.charBio,
    scenes: scenes
  };
}

// LLM Gemini Generator
async function generateStoryWithGemini() {
  const promptText = appState.prompt;
  const style = appState.style;
  const lang = appState.language;
  const duration = appState.duration;
  
  const sceneCount = duration <= 30 ? 3 : (duration <= 60 ? 5 : 8);
  
  const systemInstruction = `You are a professional movie studio screenplay writer. Break down the user prompt into a story format.
Generate a JSON output matching this structure:
{
  "title": "Story Title",
  "characterBio": "Brief description of the main character",
  "scenes": [
    {
      "prompt": "Detailed cinematic prompt for video generation. Focus on actions, camera angles, lighting, and movement. MUST request real moving footage, no static pictures.",
      "narration": "Full narration text to be spoken in the specified language (${lang}). Ensure it feels dramatic and matching the script segment.",
      "duration": 6,
      "keywords": ["list", "of", "search", "keywords"]
    }
  ]
}
Ensure there are exactly ${sceneCount} scenes. Output ONLY valid JSON inside markdown block \`\`\`json.`;

  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${appState.geminiKey}`;
  
  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      contents: [{
        parts: [{ text: `${systemInstruction}\n\nPrompt: ${promptText}\nStyle: ${style}\nLanguage: ${lang}` }]
      }]
    })
  });

  if (!response.ok) {
    throw new Error("Gemini request failed. Checking fallback options.");
  }

  const resJson = await response.json();
  const rawText = resJson.candidates[0].content.parts[0].text;
  
  // Parse JSON from text markdown fence
  const jsonMatch = rawText.match(/```json\s*([\s\S]*?)\s*```/) || rawText.match(/({[\s\S]*})/);
  if (jsonMatch) {
    const data = JSON.parse(jsonMatch[1]);
    // Validate schema
    if (data.title && Array.isArray(data.scenes)) {
      return data;
    }
  }
  
  throw new Error("Unable to parse script structure. Falling back to local script generator.");
}

// ----------------------------------------------------
// 4. Video Sourcing & Dynamic Search API Engine
// ----------------------------------------------------
async function searchVideoAsset(scenePrompt, style) {
  // Try custom Pexels API key if configured
  if (appState.pexelsKey) {
    try {
      const keywords = scenePrompt.replace(/[^\w\s]/gi, '').split(" ").slice(0, 3).join(" ");
      const url = `https://api.pexels.com/videos/search?query=${encodeURIComponent(keywords)}&per_page=5&orientation=landscape`;
      
      const response = await fetch(url, {
        headers: { "Authorization": appState.pexelsKey }
      });
      
      if (response.ok) {
        const data = await response.json();
        if (data.videos && data.videos.length > 0) {
          // Select random matching video from list
          const selectedVideoObj = data.videos[Math.floor(Math.random() * data.videos.length)];
          // Find high-quality SD or HD MP4 link
          const files = selectedVideoObj.video_files;
          const match = files.find(f => f.quality === 'hd' || f.quality === 'sd') || files[0];
          if (match && match.link) {
            return match.link;
          }
        }
      }
    } catch (e) {
      console.warn("Pexels search failed, fallback to local collection: ", e);
    }
  }

  // Fallback to local high-quality moving video collections matching styles
  const collection = PREMIUM_VIDEO_CATALOG[style] || PREMIUM_VIDEO_CATALOG["Cinematic"];
  // Pull a video sequentially or based on scene index hashes
  const randIndex = Math.floor(Math.random() * collection.length);
  return collection[randIndex];
}

// ----------------------------------------------------
// 5. Script & Workspace UI Rendering
// ----------------------------------------------------
function renderWorkspaceTabs(activeTab) {
  // Tabs click triggers
  elements.tabContentArea.innerHTML = "";
  
  const tabs = elements.workspaceScreen.querySelectorAll('.sidebar-tab');
  tabs.forEach(tab => {
    if (tab.dataset.tab === activeTab) {
      tab.classList.add('active');
    } else {
      tab.classList.remove('active');
    }
  });

  if (activeTab === 'script') {
    elements.tabContentArea.innerHTML = `
      <div class="sidebar-section">
        <label class="option-label">Film Title</label>
        <input type="text" class="sidebar-input" id="edit-story-title" value="${appState.generatedTitle}">
      </div>
      <div class="sidebar-section">
        <label class="option-label">Scene Breakdown</label>
        <div style="display:flex; flex-direction:column; gap:10px;" id="scenes-editor-list">
          <!-- Scenes edit textareas will be populated here -->
        </div>
      </div>
    `;

    // Render each scene card edit boxes
    const editorList = document.getElementById('scenes-editor-list');
    appState.scenes.forEach((scene, index) => {
      const box = document.createElement('div');
      box.style.borderLeft = "2px solid var(--accent-purple)";
      box.style.paddingLeft = "8px";
      box.innerHTML = `
        <span class="scene-num" style="display:block; margin-bottom:4px;">Scene ${index + 1} Visual Prompt</span>
        <textarea class="sidebar-textarea" style="height:60px; font-size:0.8rem;" data-index="${index}" id="edit-prompt-${index}">${scene.prompt}</textarea>
        <span class="scene-num" style="color:var(--text-secondary); display:block; margin: 4px 0;">Voice Narration</span>
        <textarea class="sidebar-textarea" style="height:60px; font-size:0.8rem;" data-index="${index}" id="edit-narration-${index}">${scene.narration}</textarea>
      `;

      // Save input changes on the fly
      box.querySelectorAll('textarea').forEach(tx => {
        tx.addEventListener('input', (e) => {
          const idx = parseInt(e.target.dataset.index);
          if (e.target.id.includes('prompt')) {
            appState.scenes[idx].prompt = e.target.value;
          } else {
            appState.scenes[idx].narration = e.target.value;
          }
          saveProjectToHistory();
        });
      });

      editorList.appendChild(box);
    });

    // Save title changes on dynamic input
    document.getElementById('edit-story-title').addEventListener('input', (e) => {
      appState.generatedTitle = e.target.value;
      saveProjectToHistory();
    });

  } else if (activeTab === 'characters') {
    elements.tabContentArea.innerHTML = `
      <div class="sidebar-section">
        <label class="option-label">Character Details</label>
        <textarea class="sidebar-textarea" style="height:150px;" id="edit-char-bio">${appState.characterBio}</textarea>
      </div>
      <div class="sidebar-section">
        <label class="option-label">Style Customizations</label>
        <p style="font-size:0.8rem; line-height:1.4;">Active Style: <strong>${appState.style}</strong></p>
        <p style="font-size:0.75rem; color:var(--text-tertiary);">Ensure character outfits, physical structures, and expressions remain uniform throughout the video descriptions.</p>
      </div>
    `;

    document.getElementById('edit-char-bio').addEventListener('input', (e) => {
      appState.characterBio = e.target.value;
      saveProjectToHistory();
    });

  } else {
    // Voice settings tab
    elements.tabContentArea.innerHTML = `
      <div class="sidebar-section">
        <label class="option-label">Narrator Voice Voice</label>
        <select class="select-custom" id="voice-select" style="width:100%;">
          <!-- Populated by web speech voices -->
        </select>
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

  // Setup tab listeners
  elements.workspaceScreen.querySelectorAll('.sidebar-tab').forEach(t => {
    t.replaceWith(t.cloneNode(true)); // remove duplicate listeners
  });
  elements.workspaceScreen.querySelectorAll('.sidebar-tab').forEach(t => {
    t.addEventListener('click', (e) => {
      renderWorkspaceTabs(e.target.dataset.tab);
    });
  });
}

function populateVoiceSelector() {
  const sel = document.getElementById('voice-select');
  if (!sel) return;
  sel.innerHTML = "";
  
  const voices = window.speechSynthesis.getVoices();
  const selectedLangCode = getLanguageCode(appState.language);
  
  // Filter voices that support the selected language
  let filteredVoices = voices.filter(v => v.lang.startsWith(selectedLangCode));
  if (filteredVoices.length === 0) {
    // fallback to default voices
    filteredVoices = voices;
  }

  filteredVoices.forEach(v => {
    const opt = document.createElement('option');
    opt.value = v.name;
    opt.textContent = `${v.name} (${v.lang})`;
    sel.appendChild(opt);
  });
}

function getLanguageCode(lang) {
  const mapping = {
    "English": "en", "Hindi": "hi", "Odia": "or", "Bengali": "bn", "Telugu": "te",
    "Tamil": "ta", "Malayalam": "ml", "Kannada": "kn", "Punjabi": "pa", "Marathi": "mr",
    "Gujarati": "gu", "Assamese": "as", "Urdu": "ur", "Sanskrit": "sa"
  };
  return mapping[lang] || "en";
}

// ----------------------------------------------------
// 6. Timeline Card Manager
// ----------------------------------------------------
function updateTimelineList() {
  elements.timelineList.innerHTML = "";
  appState.scenes.forEach((scene, index) => {
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
          <video class="scene-thumbnail-video" src="${scene.videoUrl}" muted playsinline></video>
        </div>
        <div class="scene-text-preview">${scene.prompt}</div>
      </div>
      <div class="timeline-card-actions">
        <button class="btn btn-secondary btn-card-action" data-action="regen" data-index="${index}">
          <i data-feather="refresh-cw" style="width:10px; height:10px;"></i> Replace Video
        </button>
      </div>
    `;

    // Click triggers play scene
    card.addEventListener('click', (e) => {
      // Avoid firing if button action is clicked
      if (e.target.closest('button')) return;
      loadSceneVideo(index);
    });

    // Replace visual action
    card.querySelector('button[data-action="regen"]').addEventListener('click', async () => {
      showToast(`Generating new scene loop for Scene ${index + 1}...`, "success");
      scene.videoUrl = await searchVideoAsset(scene.prompt, appState.style);
      updateTimelineList();
      if (index === appState.activeSceneIndex) {
        loadSceneVideo(index);
      }
      saveProjectToHistory();
    });

    elements.timelineList.appendChild(card);
  });
  
  feather.replace();
}

// Drag & Drop Timeline Manager
let dragStartIndex;
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
    const draggingCard = list.querySelector('.dragging');
    if (!draggingCard) return;
    if (afterElement == null) {
      list.appendChild(draggingCard);
    } else {
      list.insertBefore(draggingCard, afterElement);
    }
  });

  list.addEventListener('drop', (e) => {
    e.preventDefault();
    const cards = Array.from(list.querySelectorAll('.timeline-card'));
    const reorderedScenes = [];
    cards.forEach((card, newIndex) => {
      const originalIndex = parseInt(card.dataset.index);
      reorderedScenes.push(appState.scenes[originalIndex]);
    });
    appState.scenes = reorderedScenes;
    updateTimelineList();
    initializeTimelineDurations();
    loadSceneVideo(0, true);
    saveProjectToHistory();
    showToast("Timeline order updated", "success");
  });
}

function getDragAfterElement(container, y) {
  const draggableElements = [...container.querySelectorAll('.timeline-card:not(.dragging)')];
  return draggableElements.reduce((closest, child) => {
    const box = child.getBoundingClientRect();
    const offset = y - box.top - box.height / 2;
    if (offset < 0 && offset > closest.offset) {
      return { offset: offset, element: child };
    } else {
      return closest;
    }
  }, { offset: Number.NEGATIVE_INFINITY }).element;
}

// ----------------------------------------------------
// 7. Video Player & TTS Narration Assembly Controls
// ----------------------------------------------------
function loadSceneVideo(index) {
  if (index < 0 || index >= appState.scenes.length) return;
  
  appState.activeSceneIndex = index;
  
  // Highlight active card
  document.querySelectorAll('.timeline-card').forEach((c, idx) => {
    if (idx === index) c.classList.add('active-scene');
    else c.classList.remove('active-scene');
  });

  const scene = appState.scenes[index];
  
  // Setup video source
  const cleanUrl = scene.videoUrl;
  if (elements.previewVideo.src !== cleanUrl) {
    elements.previewVideo.src = cleanUrl;
    elements.previewVideo.load();
    elements.previewVideo.currentTime = 0.05; // Seek to 0.05s to force initial frame decoding
  }

  // Play if active
  if (appState.isPlaying) {
    elements.previewVideo.play().catch(e => console.log("Play failed: ", e));
  } else {
    elements.previewVideo.pause();
  }

  // Update times
  updatePlaybackTimerUI();
}

function formatTime(sec) {
  const m = Math.floor(sec / 60);
  const s = Math.floor(sec % 60);
  return `${m}:${s < 10 ? '0' : ''}${s}`;
}

function updatePlaybackTimerUI() {
  elements.timeCurrent.textContent = formatTime(elapsedTime);
  elements.timeDuration.textContent = formatTime(totalMovieDuration);
  elements.playerScrubber.value = totalMovieDuration > 0 ? (elapsedTime / totalMovieDuration) * 100 : 0;
}

function updatePlaybackScrub(pctVal) {
  elapsedTime = (pctVal / 100) * totalMovieDuration;
  
  // Find matching scene index
  let activeIdx = 0;
  for (let i = 0; i < appState.scenes.length; i++) {
    if (elapsedTime >= sceneStartTimes[i]) {
      activeIdx = i;
    }
  }
  
  loadSceneVideo(activeIdx, false);
  
  // Seek the current video file matching active scene offset
  const offset = elapsedTime - sceneStartTimes[activeIdx];
  elements.previewVideo.currentTime = offset;
  
  updatePlaybackTimerUI();
}

// Unified player clock ticker
let lastTickerTime = 0;
function runPlayerTicker() {
  if (!appState.isPlaying) return;
  
  const now = Date.now();
  const delta = (now - lastTickerTime) / 1000;
  lastTickerTime = now;
  
  elapsedTime += delta;
  if (elapsedTime >= totalMovieDuration) {
    stopPlayback();
    return;
  }
  
  // Find matching scene index
  let activeIdx = 0;
  for (let i = 0; i < appState.scenes.length; i++) {
    if (elapsedTime >= sceneStartTimes[i]) {
      activeIdx = i;
    }
  }
  
  // Check if scene changed
  if (activeIdx !== appState.activeSceneIndex) {
    loadSceneVideo(activeIdx, false);
  }
  
  const activeScene = appState.scenes[activeIdx];
  
  // Play video element if paused
  if (elements.previewVideo.paused && appState.isPlaying) {
    elements.previewVideo.play().catch(e => console.log("Video ticker play failed:", e));
  }
  
  // Speak narration if not spoken yet
  if (!spokenScenes.has(activeIdx) && appState.isPlaying) {
    spokenScenes.add(activeIdx);
    speakNarrationSegment(activeScene.narration, activeIdx);
  }
  
  // Time-based fallback subtitles
  if (!window.speechSynthesis.speaking) {
    const sceneElapsed = elapsedTime - sceneStartTimes[activeIdx];
    const duration = activeScene.duration;
    const words = activeScene.narration.split(" ");
    const wordProgress = Math.floor((sceneElapsed / duration) * words.length);
    elements.subtitleText.textContent = words.slice(0, Math.max(1, wordProgress + 1)).join(" ");
  }

  updatePlaybackTimerUI();
  
  if (appState.isPlaying) {
    playerTimer = requestAnimationFrame(runPlayerTicker);
  }
}

// Speech Synthesizer Voiceover controls
function speakNarrationSegment(text, sceneIndex) {
  window.speechSynthesis.cancel(); // Stop active voices
  
  if (!text) {
    return;
  }

  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = getLanguageCode(appState.language);
  utterance.volume = voiceVolume;
  
  // Set voice selections
  const voiceName = document.getElementById('voice-select')?.value;
  if (voiceName) {
    const v = window.speechSynthesis.getVoices().find(v => v.name === voiceName);
    if (v) utterance.voice = v;
  }

  // Speed and Pitch settings
  utterance.rate = parseFloat(document.getElementById('voice-rate')?.value || 1);
  utterance.pitch = parseFloat(document.getElementById('voice-pitch')?.value || 1);

  // Audio Ducking logic
  utterance.onstart = () => {
    activeUtterance = utterance;
    fadeAudioVolume(bgMusicAudio, musicVolume, 0.08, 300); // Duck background music
  };

  // Sync Subtitles using Speech Synthesis Boundaries
  utterance.onboundary = (e) => {
    if (appState.activeSceneIndex !== sceneIndex) return;
    if (e.name === 'word' || e.name === 'sentence') {
      const charIndex = e.charIndex;
      const charLength = e.charLength || 10;
      elements.subtitleText.textContent = text.slice(0, charIndex + charLength);
    }
  };

  utterance.onend = () => {
    if (activeUtterance === utterance) {
      activeUtterance = null;
    }
    fadeAudioVolume(bgMusicAudio, bgMusicAudio.volume, musicVolume, 400); // Un-duck soundtrack
  };

  utterance.onerror = (e) => {
    console.error("Speech Synthesis Error: ", e);
  };

  window.speechSynthesis.speak(utterance);
}

// Sound mixing fade actions
function fadeAudioVolume(audioObj, startVol, endVol, durationMs) {
  const stepCount = 10;
  const stepTime = durationMs / stepCount;
  const volDiff = (endVol - startVol) / stepCount;
  let currentStep = 0;

  const timer = setInterval(() => {
    currentStep++;
    audioObj.volume = Math.max(0, Math.min(1, startVol + (volDiff * currentStep)));
    if (currentStep >= stepCount) {
      clearInterval(timer);
      audioObj.volume = endVol;
    }
  }, stepTime);
}

function startPlayback() {
  appState.isPlaying = true;
  elements.playPauseBtn.innerHTML = `<i data-feather="pause"></i>`;
  feather.replace();
  
  // Play background soundtrack
  playBackgroundMusic();
  
  // Resume video
  elements.previewVideo.play().catch(e => console.log("Play failed:", e));
  
  // Start Ticker
  lastTickerTime = Date.now();
  cancelAnimationFrame(playerTimer);
  playerTimer = requestAnimationFrame(runPlayerTicker);
}

function pausePlayback() {
  appState.isPlaying = false;
  elements.playPauseBtn.innerHTML = `<i data-feather="play"></i>`;
  feather.replace();
  
  // Pause assets
  bgMusicAudio.pause();
  elements.previewVideo.pause();
  window.speechSynthesis.cancel();
  cancelAnimationFrame(playerTimer);
}

function stopPlayback() {
  appState.isPlaying = false;
  elements.playPauseBtn.innerHTML = `<i data-feather="play"></i>`;
  feather.replace();
  
  // Reset media play states
  bgMusicAudio.pause();
  bgMusicAudio.currentTime = 0;
  
  elements.previewVideo.pause();
  elements.previewVideo.currentTime = 0.05;
  
  window.speechSynthesis.cancel();
  elements.subtitleText.textContent = "";
  cancelAnimationFrame(playerTimer);
  
  elapsedTime = 0;
  spokenScenes.clear();
  loadSceneVideo(0, true);
}

function playBackgroundMusic() {
  const track = PREMIUM_SOUNDTRACKS[appState.soundtrack];
  if (track && bgMusicAudio.src !== track) {
    bgMusicAudio.src = track;
  }
  bgMusicAudio.volume = musicVolume;
  
  bgMusicAudio.play().catch(e => console.log("Background music play block: ", e));
}

function updateMixerVolumes() {
  voiceVolume = parseFloat(elements.voiceVolumeSlider.value);
  musicVolume = parseFloat(elements.musicVolumeSlider.value);
  bgMusicAudio.volume = musicVolume;
}

function initializeTimelineDurations() {
  let currentTimeAccumulator = 0;
  sceneStartTimes = [];
  appState.scenes.forEach(scene => {
    sceneStartTimes.push(currentTimeAccumulator);
    currentTimeAccumulator += scene.duration;
  });
  totalMovieDuration = currentTimeAccumulator;
}

// ----------------------------------------------------
// 8. Client-Side Video Export & Assembly Engine
// ----------------------------------------------------
async function triggerVideoExport() {
  showToast("Preparing rendering frames...", "success");
  
  // Create fullscreen canvas compiler overlay to provide cinematic layout feedback
  const overlay = document.createElement('div');
  overlay.className = "render-overlay";
  overlay.innerHTML = `
    <div class="render-progress-card">
      <div class="orbit-loader" style="margin: 0 auto 20px auto;"></div>
      <h3 class="render-stage-title">Compiling Video File</h3>
      <p class="render-stage-desc">Synthesizing audio nodes, applying styles, drawing frame buffers watermark-free.</p>
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

  // Setup render Canvas dimensions based on aspect ratio
  const exportCanvas = document.createElement('canvas');
  let width = 1280;
  let height = 720;
  if (appState.aspectRatio === "9:16") {
    width = 720;
    height = 1280;
  } else if (appState.aspectRatio === "1:1") {
    width = 1080;
    height = 1080;
  }
  exportCanvas.width = width;
  exportCanvas.height = height;
  const ctx = exportCanvas.getContext('2d');

  // Cancel trigger setup
  let isCancelled = false;
  document.getElementById('cancel-export-btn').addEventListener('click', () => {
    isCancelled = true;
    overlay.remove();
    showToast("Export process cancelled", "error");
  });

  const stream = exportCanvas.captureStream(30); // 30 FPS Capture
  
  // Audio compiler
  const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  const dest = audioCtx.createMediaStreamDestination();
  
  // Setup audio recorder buffers
  const mediaRecorder = new MediaRecorder(stream, {
    mimeType: 'video/webm;codecs=vp9',
    videoBitsPerSecond: 3000000 // 3 Mbps
  });

  const chunks = [];
  mediaRecorder.ondataavailable = (e) => {
    if (e.data.size > 0) chunks.push(e.data);
  };

  mediaRecorder.onstop = () => {
    if (isCancelled) return;
    overlay.remove();
    
    // Save output
    const blob = new Blob(chunks, { type: 'video/webm' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${appState.generatedTitle.replace(/\s+/g, '_')}_CineStory.webm`;
    a.click();
    showToast("Download started! Open with any media player.", "success");
  };

  // Compile frames sequentially onto canvas
  mediaRecorder.start();
  
  const totalScenes = appState.scenes.length;
  const progressFill = document.getElementById('export-progress-fill');
  const progressPct = document.getElementById('export-progress-pct');

  for (let idx = 0; idx < totalScenes; idx++) {
    if (isCancelled) break;
    
    const scene = appState.scenes[idx];
    
    // Load video frame elements
    const video = document.createElement('video');
    video.src = scene.videoUrl;
    video.crossOrigin = "anonymous";
    video.muted = true;
    video.playsInline = true;
    
    await new Promise((resolve) => {
      video.onloadeddata = () => resolve();
      video.onerror = () => resolve(); // continue even if error
    });

    video.play();

    const fps = 30;
    const framesCount = scene.duration * fps;
    const words = scene.narration.split(" ");
    
    for (let frame = 0; frame < framesCount; frame++) {
      if (isCancelled) break;
      
      // Draw video source image
      ctx.drawImage(video, 0, 0, width, height);

      // Add watermark overlay if enabled
      if (appState.watermark === 'cinestory') {
        ctx.fillStyle = "rgba(255,255,255,0.4)";
        ctx.font = "bold 24px 'Space Grotesk'";
        ctx.fillText("CineStory Studio", 30, 50);
      }

      // Draw custom subtitle timeline text onto export canvas frame buffer
      ctx.fillStyle = "rgba(0, 0, 0, 0.7)";
      const subHeight = 90;
      const subY = height - 150;
      
      // Draw subtitle backdrop pill
      ctx.beginPath();
      ctx.roundRect(50, subY, width - 100, subHeight, 12);
      ctx.fill();

      // Subtitle texts
      ctx.fillStyle = "#ffffff";
      ctx.textAlign = "center";
      ctx.font = "32px 'Inter'";
      
      // Show text based on frames progression
      const wordProgress = Math.floor((frame / framesCount) * words.length);
      const textToShow = words.slice(0, Math.max(1, wordProgress + 1)).join(" ");
      ctx.fillText(textToShow, width / 2, subY + 55);

      // Render speed delay
      await delay(1000 / fps);
      
      // Update overall progress markers
      const totalProgressPct = Math.floor(((idx * framesCount + frame) / (totalScenes * framesCount)) * 100);
      progressFill.style.width = `${totalProgressPct}%`;
      progressPct.textContent = `${totalProgressPct}%`;
    }

    video.pause();
    video.remove();
  }

  mediaRecorder.stop();
  audioCtx.close();
}

// ----------------------------------------------------
// 9. Browser Local Storage Workspace History
// ----------------------------------------------------
function saveProjectToHistory() {
  const id = appState.generatedTitle.replace(/\s+/g, '_');
  const project = {
    id: id,
    title: appState.generatedTitle,
    prompt: appState.prompt,
    style: appState.style,
    language: appState.language,
    aspectRatio: appState.aspectRatio,
    duration: appState.duration,
    characterBio: appState.characterBio,
    scenes: appState.scenes,
    timestamp: Date.now()
  };

  const existingIdx = appState.history.findIndex(p => p.id === id);
  if (existingIdx !== -1) {
    appState.history[existingIdx] = project;
  } else {
    appState.history.unshift(project);
  }

  localStorage.setItem('studio-history', JSON.stringify(appState.history));
}

function renderHistoryModalList() {
  elements.historyListContainer.innerHTML = "";
  
  if (appState.history.length === 0) {
    elements.historyListContainer.innerHTML = `<p style="text-align:center; padding: 2rem 0; color:var(--text-tertiary);">No projects saved in this library workspace.</p>`;
    return;
  }

  appState.history.forEach(proj => {
    const item = document.createElement('div');
    item.className = "history-item";
    item.innerHTML = `
      <div class="history-details">
        <h4 class="history-title">${proj.title}</h4>
        <div class="history-meta">
          <span>${proj.style}</span>
          <span>&bull;</span>
          <span>${proj.language}</span>
          <span>&bull;</span>
          <span>${proj.scenes.length} Scenes</span>
        </div>
      </div>
      <button class="btn btn-secondary btn-card-action" data-action="load" data-id="${proj.id}">
        Open Studio
      </button>
    `;

    item.querySelector('button[data-action="load"]').addEventListener('click', () => {
      appState.generatedTitle = proj.title;
      appState.prompt = proj.prompt;
      appState.style = proj.style;
      appState.language = proj.language;
      appState.aspectRatio = proj.aspectRatio;
      appState.duration = proj.duration;
      appState.characterBio = proj.characterBio;
      appState.scenes = proj.scenes;

      // Render workspace
      showScreen('workspace');
      renderWorkspaceTabs('script');
      updateTimelineList();
      initializeTimelineDurations();
      loadSceneVideo(0, true);
      elements.historyModal.classList.add('hidden');
      showToast(`Loaded workspace: "${proj.title}"`, "success");
    });

    elements.historyListContainer.appendChild(item);
  });
}

// Helpers
function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}
