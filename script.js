/* =================================================================
   LIZA UNIVERSE - COMPLETE MERGED ENGINE
   Features: Ultra Web-Audio Synth BGM, Interactive SFX, 
   Evasive Button, 3D VisionOS Tilt, Canvas Particles & i18n
   ================================================================= */

// -----------------------------------------------------------------
// 1. ULTRA PREMIUM PROCEDURAL AUDIO ENGINE 💀
// -----------------------------------------------------------------
class UltraAudioEngine {
    constructor() {
        this.ctx = null;
        this.masterGain = null;
        this.compressor = null;
        this.delayNode = null;
        this.feedbackGain = null;
        this.isPlaying = false;
        this.bgmTimer = null;
        this.arpTimer = null;
        this.chordIndex = 0;

        // Ultra-Dreamy Cinematic Chords (Cmaj9 -> Am9 -> Fmaj9 -> G6/9)
        this.chordScales = [
            [130.81, 196.00, 246.94, 293.66, 392.00], // Cmaj9
            [110.00, 164.81, 220.00, 261.63, 329.63], // Am9
            [87.31,  130.81, 174.61, 220.00, 261.63], // Fmaj9
            [98.00,  146.83, 196.00, 246.94, 293.66]  // G6/9
        ];

        // Celestial High-Pentatonic Scale for Random Sparkle Arpeggios
        this.sparkleFreqs = [523.25, 659.25, 783.99, 987.77, 1046.50, 1318.51, 1567.98];
    }

    // Initialize Web Audio API Master Chain
    init() {
        if (this.ctx) {
            if (this.ctx.state === 'suspended') this.ctx.resume();
            return;
        }

        const AudioContextClass = window.AudioContext || window.webkitAudioContext;
        this.ctx = new AudioContextClass();

        // Master Gain Node
        this.masterGain = this.ctx.createGain();
        this.masterGain.gain.setValueAtTime(0.35, this.ctx.currentTime);

        // Studio Master Compressor (Prevents distortion & gives radio-grade warmth)
        this.compressor = this.ctx.createDynamicsCompressor();
        this.compressor.threshold.setValueAtTime(-20, this.ctx.currentTime);
        this.compressor.knee.setValueAtTime(15, this.ctx.currentTime);
        this.compressor.ratio.setValueAtTime(6, this.ctx.currentTime);
        this.compressor.attack.setValueAtTime(0.005, this.ctx.currentTime);
        this.compressor.release.setValueAtTime(0.25, this.ctx.currentTime);

        // Spatial Echo / Delay Network (For deep 3D atmosphere)
        this.delayNode = this.ctx.createDelay();
        this.delayNode.delayTime.setValueAtTime(0.35, this.ctx.currentTime);

        this.feedbackGain = this.ctx.createGain();
        this.feedbackGain.gain.setValueAtTime(0.3, this.ctx.currentTime);

        // Routing: Audio -> Delay -> Feedback Loop -> Compressor -> Destination
        this.delayNode.connect(this.feedbackGain);
        this.feedbackGain.connect(this.delayNode);

        this.masterGain.connect(this.compressor);
        this.masterGain.connect(this.delayNode);
        this.delayNode.connect(this.compressor);

        this.compressor.connect(this.ctx.destination);
    }

    // Start Procedural BGM
    startBGM() {
        this.init();
        if (this.isPlaying) return;
        this.isPlaying = true;

        const playNextPadChord = () => {
            if (!this.isPlaying) return;
            const now = this.ctx.currentTime;
            const currentChord = this.chordScales[this.chordIndex];

            // Trigger multi-oscillator detuned warm synth pad
            currentChord.forEach(freq => {
                const osc1 = this.ctx.createOscillator();
                osc1.type = 'sine';
                osc1.frequency.setValueAtTime(freq, now);

                const osc2 = this.ctx.createOscillator();
                osc2.type = 'triangle';
                osc2.frequency.setValueAtTime(freq * 1.0035, now);

                const filter = this.ctx.createBiquadFilter();
                filter.type = 'lowpass';
                filter.frequency.setValueAtTime(250, now);
                filter.frequency.exponentialRampToValueAtTime(800, now + 3);
                filter.frequency.exponentialRampToValueAtTime(200, now + 6);

                const noteGain = this.ctx.createGain();
                noteGain.gain.setValueAtTime(0, now);
                noteGain.gain.linearRampToValueAtTime(0.06, now + 2.5);
                noteGain.gain.exponentialRampToValueAtTime(0.0001, now + 6.5);

                osc1.connect(filter);
                osc2.connect(filter);
                filter.connect(noteGain);
                noteGain.connect(this.masterGain);

                osc1.start(now);
                osc2.start(now);
                osc1.stop(now + 6.6);
                osc2.stop(now + 6.6);
            });

            this.chordIndex = (this.chordIndex + 1) % this.chordScales.length;
        };

        playNextPadChord();
        this.bgmTimer = setInterval(playNextPadChord, 5800);
        this.startSparkleArp();
    }

    // Floating Crystal Sparkle Generator
    startSparkleArp() {
        this.arpTimer = setInterval(() => {
            if (!this.isPlaying || Math.random() > 0.65) return;

            const now = this.ctx.currentTime;
            const randomFreq = this.sparkleFreqs[Math.floor(Math.random() * this.sparkleFreqs.length)];

            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();

            osc.type = 'sine';
            osc.frequency.setValueAtTime(randomFreq, now);

            gain.gain.setValueAtTime(0, now);
            gain.gain.linearRampToValueAtTime(0.03, now + 0.05);
            gain.gain.exponentialRampToValueAtTime(0.0001, now + 1.2);

            osc.connect(gain);
            gain.connect(this.masterGain);

            osc.start(now);
            osc.stop(now + 1.2);
        }, 800);
    }

    // Stop BGM
    stopBGM() {
        this.isPlaying = false;
        if (this.bgmTimer) clearInterval(this.bgmTimer);
        if (this.arpTimer) clearInterval(this.arpTimer);
    }

    // UI Hover Sound
    playHoverSFX() {
        this.init();
        const now = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(880, now);
        osc.frequency.exponentialRampToValueAtTime(1200, now + 0.04);

        gain.gain.setValueAtTime(0.02, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.04);

        osc.connect(gain);
        gain.connect(this.masterGain);

        osc.start(now);
        osc.stop(now + 0.04);
    }

    // Button Click SFX
    playClickSFX() {
        this.init();
        const now = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(523.25, now);
        osc.frequency.exponentialRampToValueAtTime(1046.50, now + 0.08);

        gain.gain.setValueAtTime(0.08, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);

        osc.connect(gain);
        gain.connect(this.masterGain);

        osc.start(now);
        osc.stop(now + 0.08);
    }

    // Victory Chime
    playVictorySFX() {
        this.init();
        const now = this.ctx.currentTime;
        const victoryNotes = [523.25, 659.25, 783.99, 1046.50, 1318.51];

        victoryNotes.forEach((freq, idx) => {
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();

            osc.type = 'sine';
            osc.frequency.setValueAtTime(freq, now + (idx * 0.07));

            gain.gain.setValueAtTime(0.1, now + (idx * 0.07));
            gain.gain.exponentialRampToValueAtTime(0.0001, now + (idx * 0.07) + 1.8);

            osc.connect(gain);
            gain.connect(this.masterGain);

            osc.start(now + (idx * 0.07));
            osc.stop(now + (idx * 0.07) + 1.8);
        });
    }

    // Evasive Button Pop Sound
    playPopSFX() {
        this.init();
        const now = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(250, now);
        osc.frequency.exponentialRampToValueAtTime(900, now + 0.09);

        gain.gain.setValueAtTime(0.12, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.09);

        osc.connect(gain);
        gain.connect(this.masterGain);

        osc.start(now);
        osc.stop(now + 0.09);
    }
}

// Global Single Instance
const audioEngine = new UltraAudioEngine();

// -----------------------------------------------------------------
// 2. STATE MANAGEMENT & I18N DICTIONARY
// -----------------------------------------------------------------
const state = {
    currentLang: 'en',
    wrongAnswerCount: 0,
    evasiveCount: 0
};

const translations = {
    en: {
        loading: "Preparing Magical Experience...",
        badgeWelcome: "Welcome",
        chooseLanguageTitle: "Choose Language",
        chooseLanguageSub: "Select your preferred language to begin",
        friendQuestionTitle: "Who is your Best Friend?",
        friendQuestionSub: "Type the correct name below to unlock",
        submitBtn: "Submit Answer",
        seePicQuestionTitle: "Can You See Our Picture?",
        seePicQuestionSub: "Make your choice to continue",
        yesBtn: "YES",
        noBtn: "NO",
        continueBtn: "Continue Journey ✨",
        finalLine1: "One Picture...",
        finalLine2: "Thousands Of Memories.",
        finalFor: "For Liza 🌸",
        finalAuthor: "— Rudra",
        replayBtn: "Replay Experience 🔄",
        hints: [
            "Hint: Starts with R 😏",
            "Seriously? 😂",
            "R _ _ _ _",
            "Correct answer is Rudra 🤣"
        ],
        taunts: [
            "Catch me if you can! 😜",
            "Too slow! 🚀",
            "Nope! Try YES instead! 😉",
            "You can't click NO! 😂",
            "Nice try! 🌸"
        ]
    },
    ru: {
        loading: "Подготовка волшебства...",
        badgeWelcome: "Добро пожаловать",
        chooseLanguageTitle: "Выберите язык",
        chooseLanguageSub: "Выберите предпочитаемый язык, чтобы начать",
        friendQuestionTitle: "Кто твой лучший друг?",
        friendQuestionSub: "Введите правильное имя ниже, чтобы открыть",
        submitBtn: "Отправить ответ",
        seePicQuestionTitle: "Ты видишь нашу фотографию?",
        seePicQuestionSub: "Сделайте свой выбор, чтобы продолжить",
        yesBtn: "ДА",
        noBtn: "НЕТ",
        continueBtn: "Продолжить путешествие ✨",
        finalLine1: "Одна фотография...",
        finalLine2: "Тысячи воспоминаний.",
        finalFor: "Для Лизы 🌸",
        finalAuthor: "— Рудра",
        replayBtn: "Воспроизвести снова 🔄",
        hints: [
            "Подсказка: Начинается на R 😏",
            "Серьёзно? 😂",
            "R _ _ _ _",
            "Правильный ответ — Rudra 🤣"
        ],
        taunts: [
            "Поймай меня, если сможешь! 😜",
            "Слишком медленно! 🚀",
            "Нет! Попробуй нажать ДА! 😉",
            "Ты не сможешь нажать НЕТ! 😂",
            "Хорошая попытка! 🌸"
        ]
    }
};

// -----------------------------------------------------------------
// 3. DOM CONTENT LOADED INITIALIZATION
// -----------------------------------------------------------------
document.addEventListener('DOMContentLoaded', () => {
    initPreloader();
    bindButtonSounds();

    try {
        initParticleCanvas();
        initSparkleCursor();
        initButterflies();
        initPetals();
        initEvasiveNoButton();
        init3DTiltCards();
    } catch (err) {
        console.warn("Non-critical UI module failed to initialize:", err);
    }
});

// Bind UI Audio SFX on all buttons
function bindButtonSounds() {
    document.querySelectorAll('button, .lang-card').forEach(btn => {
        btn.addEventListener('mouseenter', () => audioEngine.playHoverSFX());
        btn.addEventListener('click', () => audioEngine.playClickSFX());
    });
}

// -----------------------------------------------------------------
// 4. PRELOADER & SCENE SWITCHING
// -----------------------------------------------------------------
function initPreloader() {
    // Automatic transition to 2nd Page (Language Selection) after 2.2s
    setTimeout(() => {
        switchScene('sceneLoader', 'sceneLang');
    }, 2200);
}

function switchScene(fromId, toId) {
    const fromScene = document.getElementById(fromId);
    const toScene = document.getElementById(toId);

    if (fromScene) {
        fromScene.classList.remove('active');
    }

    setTimeout(() => {
        if (toScene) {
            toScene.classList.add('active');
            bindButtonSounds(); // Re-bind sound listeners for newly visible elements
        }
    }, 400);
}

// -----------------------------------------------------------------
// 5. LANGUAGE SELECTION
// -----------------------------------------------------------------
function selectLanguage(lang) {
    state.currentLang = lang;
    updateLanguageTexts();
    audioEngine.startBGM(); // 🔥 Starts Atmospheric Ambient Synth BGM
    switchScene('sceneLang', 'sceneFriend');
}

function updateLanguageTexts() {
    const langData = translations[state.currentLang];
    document.querySelectorAll('[data-i18n]').forEach(element => {
        const key = element.getAttribute('data-i18n');
        if (langData && langData[key]) {
            element.textContent = langData[key];
        }
    });
}

// -----------------------------------------------------------------
// 6. BEST FRIEND QUESTION LOGIC
// -----------------------------------------------------------------
function checkBestFriend() {
    const input = document.getElementById('friendInput');
    const hintBox = document.getElementById('friendHint');
    if (!input || !hintBox) return;

    const answer = input.value.trim();

    // Check correct answer ("Rudra")
    if (answer.toLowerCase() === 'rudra') {
        audioEngine.playVictorySFX(); // 🔥 Victory Fanfare SFX!
        hintBox.style.color = '#0284C7';
        hintBox.textContent = '✨ Correct!';
        setTimeout(() => {
            switchScene('sceneFriend', 'scenePictureQuestion');
        }, 800);
    } else {
        // Shake card effect
        const inputCard = document.getElementById('friendCard');
        if (inputCard) {
            inputCard.style.animation = 'none';
            void inputCard.offsetWidth; // Trigger reflow
            inputCard.style.animation = 'shakeCard 0.4s ease-in-out';
        }

        // Set progressive hint logic
        const hints = translations[state.currentLang].hints;
        const index = Math.min(state.wrongAnswerCount, hints.length - 1);
        hintBox.textContent = hints[index];

        state.wrongAnswerCount++;
        input.value = '';
        input.focus();
    }
}

// Keypress ENTER support for answer submission
document.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        const friendScene = document.getElementById('sceneFriend');
        if (friendScene && friendScene.classList.contains('active')) {
            checkBestFriend();
        }
    }
});

// Add keyframe shake style programmatically
if (!document.getElementById('shakeCardStyle')) {
    const styleSheet = document.createElement("style");
    styleSheet.id = 'shakeCardStyle';
    styleSheet.innerText = `
    @keyframes shakeCard {
        0%, 100% { transform: translateX(0); }
        20%, 60% { transform: translateX(-10px); }
        40%, 80% { transform: translateX(10px); }
    }`;
    document.head.appendChild(styleSheet);
}

// -----------------------------------------------------------------
// 7. EVASIVE "NO" BUTTON LOGIC (RUNAWAY, TELEPORT, ROTATE)
// -----------------------------------------------------------------
function initEvasiveNoButton() {
    const noBtn = document.getElementById('noBtn');
    const container = document.getElementById('evasiveContainer');
    const tauntBox = document.getElementById('noTauntText');

    if (!noBtn || !container) return;

    const moveNoButton = (e) => {
        if (e) e.preventDefault();
        
        audioEngine.playPopSFX(); // 🔥 Funny Pop Sound on Runaway!

        const containerRect = container.getBoundingClientRect();
        const btnWidth = noBtn.offsetWidth || 100;
        const btnHeight = noBtn.offsetHeight || 40;

        const maxX = (containerRect.width / 2) - (btnWidth / 2);
        const maxY = (containerRect.height / 2) - (btnHeight / 2);

        const randomX = (Math.random() * maxX * 2) - maxX;
        const randomY = (Math.random() * maxY * 2) - maxY;

        const scale = Math.max(0.4, 1 - (state.evasiveCount * 0.12));
        const rotate = (Math.random() * 360) - 180;

        noBtn.style.transform = `translate(${randomX}px, ${randomY}px) scale(${scale}) rotate(${rotate}deg)`;

        if (tauntBox) {
            const taunts = translations[state.currentLang].taunts;
            const tauntIndex = state.evasiveCount % taunts.length;
            tauntBox.textContent = taunts[tauntIndex];
        }

        state.evasiveCount++;
    };

    noBtn.addEventListener('mouseenter', moveNoButton);
    noBtn.addEventListener('touchstart', moveNoButton, { passive: false });
    noBtn.addEventListener('click', moveNoButton);
}

// -----------------------------------------------------------------
// 8. CINEMATIC REVEAL & FINAL SCENE
// -----------------------------------------------------------------
function acceptPictureView() {
    switchScene('scenePictureQuestion', 'scenePhoto');
    audioEngine.playVictorySFX();

    setTimeout(() => {
        const photoScene = document.getElementById('scenePhoto');
        const photoFrame = document.getElementById('photoFrame');

        if (photoScene) photoScene.classList.add('curtains-open');
        if (photoFrame) photoFrame.classList.add('revealed');
    }, 600);
}

function goToFinalScene() {
    switchScene('scenePhoto', 'sceneFinal');
}

function restartJourney() {
    state.wrongAnswerCount = 0;
    state.evasiveCount = 0;

    const noBtn = document.getElementById('noBtn');
    if (noBtn) noBtn.style.transform = 'none';

    const friendInput = document.getElementById('friendInput');
    if (friendInput) friendInput.value = '';

    const friendHint = document.getElementById('friendHint');
    if (friendHint) friendHint.textContent = '';

    const tauntBox = document.getElementById('noTauntText');
    if (tauntBox) tauntBox.textContent = '';

    const photoScene = document.getElementById('scenePhoto');
    const photoFrame = document.getElementById('photoFrame');
    if (photoScene) photoScene.classList.remove('curtains-open');
    if (photoFrame) photoFrame.classList.remove('revealed');

    switchScene('sceneFinal', 'sceneLang');
}

// -----------------------------------------------------------------
// 9. AMBIENT CANVAS PARTICLES
// -----------------------------------------------------------------
function initParticleCanvas() {
    const canvas = document.getElementById('particleCanvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    let width = canvas.width = window.innerWidth;
    let height = canvas.height = window.innerHeight;

    window.addEventListener('resize', () => {
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;
    });

    const particles = [];
    const particleCount = 45;

    for (let i = 0; i < particleCount; i++) {
        particles.push({
            x: Math.random() * width,
            y: Math.random() * height,
            radius: Math.random() * 2.5 + 0.5,
            color: Math.random() > 0.5 ? 'rgba(56, 189, 248, ' : 'rgba(244, 114, 182, ',
            alpha: Math.random() * 0.6 + 0.2,
            speedX: (Math.random() - 0.5) * 0.6,
            speedY: (Math.random() - 0.5) * 0.6
        });
    }

    function animateParticles() {
        ctx.clearRect(0, 0, width, height);

        particles.forEach(p => {
            p.x += p.speedX;
            p.y += p.speedY;

            if (p.x < 0) p.x = width;
            if (p.x > width) p.x = 0;
            if (p.y < 0) p.y = height;
            if (p.y > height) p.y = 0;

            ctx.beginPath();
            ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
            ctx.fillStyle = p.color + p.alpha + ')';
            ctx.shadowBlur = 10;
            ctx.shadowColor = '#38BDF8';
            ctx.fill();
        });

        requestAnimationFrame(animateParticles);
    }

    animateParticles();
}

// -----------------------------------------------------------------
// 10. SPARKLE CURSOR / TOUCH TRAIL CANVAS
// -----------------------------------------------------------------
function initSparkleCursor() {
    const canvas = document.getElementById('sparkleCanvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    let width = canvas.width = window.innerWidth;
    let height = canvas.height = window.innerHeight;

    window.addEventListener('resize', () => {
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;
    });

    const sparkles = [];

    function createSparkle(x, y) {
        for (let i = 0; i < 3; i++) {
            sparkles.push({
                x: x,
                y: y,
                size: Math.random() * 4 + 2,
                color: Math.random() > 0.5 ? '#38BDF8' : '#F472B6',
                vx: (Math.random() - 0.5) * 2,
                vy: (Math.random() - 0.5) * 2,
                life: 1
            });
        }
    }

    function handlePointer(e) {
        const x = e.touches ? e.touches[0].clientX : e.clientX;
        const y = e.touches ? e.touches[0].clientY : e.clientY;
        createSparkle(x, y);
    }

    window.addEventListener('mousemove', handlePointer);
    window.addEventListener('touchmove', handlePointer, { passive: true });

    function animateSparkles() {
        ctx.clearRect(0, 0, width, height);

        for (let i = sparkles.length - 1; i >= 0; i--) {
            const s = sparkles[i];
            s.x += s.vx;
            s.y += s.vy;
            s.life -= 0.03;

            if (s.life <= 0) {
                sparkles.splice(i, 1);
            } else {
                ctx.beginPath();
                ctx.arc(s.x, s.y, s.size * s.life, 0, Math.PI * 2);
                ctx.fillStyle = s.color;
                ctx.globalAlpha = s.life;
                ctx.fill();
            }
        }

        ctx.globalAlpha = 1;
        requestAnimationFrame(animateSparkles);
    }

    animateSparkles();
}

// -----------------------------------------------------------------
// 11. REALISTIC BUTTERFLIES (SVG) & FLOATING PETALS
// -----------------------------------------------------------------
function initButterflies() {
    const container = document.getElementById('butterflyContainer');
    if (!container) return;

    const butterflySVG = `
    <svg viewBox="0 0 50 50">
        <path class="butterfly-wing" fill="url(#wingGrad)" d="M25 25 C10 0, 0 10, 5 25 C0 35, 10 45, 25 30 Z"/>
        <path class="butterfly-wing" fill="url(#wingGrad)" d="M25 25 C40 0, 50 10, 45 25 C50 35, 40 45, 25 30 Z"/>
        <defs>
            <linearGradient id="wingGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stop-color="#F472B6" />
                <stop offset="100%" stop-color="#38BDF8" />
            </linearGradient>
        </defs>
    </svg>`;

    for (let i = 0; i < 3; i++) {
        const div = document.createElement('div');
        div.className = 'butterfly';
        div.innerHTML = butterflySVG;

        let posX = Math.random() * window.innerWidth;
        let posY = Math.random() * window.innerHeight;

        div.style.left = `${posX}px`;
        div.style.top = `${posY}px`;

        container.appendChild(div);

        setInterval(() => {
            posX += (Math.random() - 0.5) * 120;
            posY += (Math.random() - 0.5) * 120;

            posX = Math.max(20, Math.min(window.innerWidth - 50, posX));
            posY = Math.max(20, Math.min(window.innerHeight - 50, posY));

            div.style.transition = 'all 3s ease-in-out';
            div.style.left = `${posX}px`;
            div.style.top = `${posY}px`;
        }, 3200);
    }
}

function initPetals() {
    const container = document.getElementById('petalContainer');
    if (!container) return;

    const petalCount = 12;

    for (let i = 0; i < petalCount; i++) {
        const petal = document.createElement('div');
        petal.className = 'petal';

        const size = Math.random() * 12 + 8;
        petal.style.width = `${size}px`;
        petal.style.height = `${size * 1.4}px`;

        petal.style.left = `${Math.random() * 100}vw`;
        petal.style.animation = `fallPetal ${Math.random() * 8 + 6}s linear infinite`;
        petal.style.animationDelay = `${Math.random() * 5}s`;

        container.appendChild(petal);
    }

    if (!document.getElementById('fallPetalStyle')) {
        const petalStyle = document.createElement('style');
        petalStyle.id = 'fallPetalStyle';
        petalStyle.innerText = `
        @keyframes fallPetal {
            0% { transform: translateY(-10vh) rotate(0deg); opacity: 0; }
            10% { opacity: 0.8; }
            90% { opacity: 0.8; }
            100% { transform: translateY(105vh) rotate(720deg); opacity: 0; }
        }`;
        document.head.appendChild(petalStyle);
    }
}

// -----------------------------------------------------------------
// 12. 3D VISIONOS TILT EFFECT ON CARDS
// -----------------------------------------------------------------
function init3DTiltCards() {
    const cards = document.querySelectorAll('.3d-card');

    cards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            const centerX = rect.width / 2;
            const centerY = rect.height / 2;

            const rotateX = ((y - centerY) / centerY) * -12;
            const rotateY = ((x - centerX) / centerX) * 12;

            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
        });

        card.addEventListener('mouseleave', () => {
            card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
        });
    });
}
