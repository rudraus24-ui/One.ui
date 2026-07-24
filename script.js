/* ================= 1. PAGE SWITCHING LOGIC ================= */
function switchPage(pageId, btnEl) {
    document.querySelectorAll('.page').forEach(page => {
        page.classList.remove('active');
    });
    document.getElementById(pageId).classList.add('active');

    if(btnEl) {
        document.querySelectorAll('.nav-btn').forEach(btn => btn.classList.remove('active'));
        btnEl.classList.add('active');
    }
}

/* ================= 2. NEON PARTICLE & FIREWORKS CANVAS ================= */
const canvas = document.getElementById('bgCanvas');
const ctx = canvas.getContext('2d');
let particles = [];

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}
window.addEventListener('resize', resizeCanvas);
resizeCanvas();

class Particle {
    constructor(x, y, color) {
        this.x = x || Math.random() * canvas.width;
        this.y = y || Math.random() * canvas.height;
        this.size = Math.random() * 3 + 1;
        this.speedX = (Math.random() - 0.5) * 2;
        this.speedY = (Math.random() - 0.5) * 2;
        const colors = ['#ff007f', '#00f3ff', '#b026ff', '#ffea00', '#00ff66'];
        this.color = color || colors[Math.floor(Math.random() * colors.length)];
        this.alpha = Math.random() * 0.8 + 0.2;
    }

    update() {
        this.x += this.speedX;
        this.y += this.speedY;

        if (this.x < 0 || this.x > canvas.width) this.speedX *= -1;
        if (this.y < 0 || this.y > canvas.height) this.speedY *= -1;
    }

    draw() {
        ctx.save();
        ctx.globalAlpha = this.alpha;
        ctx.shadowBlur = 10;
        ctx.shadowColor = this.color;
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
    }
}

function initParticles() {
    particles = [];
    for (let i = 0; i < 60; i++) {
        particles.push(new Particle());
    }
}
initParticles();

function animateParticles() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach(p => {
        p.update();
        p.draw();
    });
    requestAnimationFrame(animateParticles);
}
animateParticles();

/* Fireworks Trigger */
function triggerFireworks() {
    const colors = ['#ff007f', '#00f3ff', '#ffea00', '#00ff66', '#b026ff'];
    for(let i = 0; i < 120; i++) {
        setTimeout(() => {
            const p = new Particle(canvas.width / 2, canvas.height / 2, colors[Math.floor(Math.random() * colors.length)]);
            p.speedX = (Math.random() - 0.5) * 12;
            p.speedY = (Math.random() - 0.5) * 12;
            p.size = Math.random() * 5 + 2;
            particles.push(p);
        }, i * 5);
    }
}

/* ================= 3. COUNTDOWN TIMER ================= */
const targetDate = new Date().getTime() + (24 * 60 * 60 * 1000);

setInterval(() => {
    const now = new Date().getTime();
    const diff = targetDate - now;

    if(diff > 0) {
        document.getElementById('days').innerText = String(Math.floor(diff / (1000 * 60 * 60 * 24))).padStart(2, '0');
        document.getElementById('hours').innerText = String(Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))).padStart(2, '0');
        document.getElementById('minutes').innerText = String(Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))).padStart(2, '0');
        document.getElementById('seconds').innerText = String(Math.floor((diff % (1000 * 60)) / 1000)).padStart(2, '0');
    }
}, 1000);

/* ================= 4. CAKE & CANDLE INTERACTION ================= */
function blowCandle() {
    const flame = document.getElementById('candleFlame');
    const status = document.getElementById('cakeStatus');
    const cutBtn = document.getElementById('cutCakeBtn');

    flame.classList.add('off');
    status.innerHTML = "🎉 Wish blown! Happy Birthday! 🎉";
    status.style.color = "var(--neon-yellow)";
    status.style.textShadow = "0 0 15px var(--neon-yellow)";
    cutBtn.style.display = "inline-block";

    triggerFireworks();
}

/* ================= 5. DYNAMIC WISH POSTING ================= */
function addWish() {
    const name = document.getElementById('senderName').value.trim();
    const msg = document.getElementById('senderMsg').value.trim();

    if(name === '' || msg === '') {
        alert('Please fill both name and wish message!');
        return;
    }

    const wishGrid = document.getElementById('wishGrid');
    const newCard = document.createElement('div');
    newCard.className = 'wish-card';
    newCard.innerHTML = `
        <div class="wish-author"><i class="fa-solid fa-star"></i> ${name}</div>
        <div class="wish-text">${msg}</div>
    `;
    wishGrid.prepend(newCard);

    document.getElementById('senderName').value = '';
    document.getElementById('senderMsg').value = '';
}

/* ================= 6. GIFT UNBOXING MODAL ================= */
function openGift(title, message) {
    document.getElementById('modalTitle').innerText = title;
    document.getElementById('modalBody').innerText = message;
    document.getElementById('giftModal').classList.add('active');
    triggerFireworks();
}

function closeModal() {
    document.getElementById('giftModal').classList.remove('active');
}

/* ================= 7. WEB AUDIO SYNTH BGM GENERATOR ================= */
let audioCtx = null;
let isPlaying = false;
let bgmInterval = null;

document.getElementById('bgmToggle').addEventListener('click', () => {
    if(!isPlaying) {
        startBGM();
        document.getElementById('bgmState').innerText = "BGM: ON 🎵";
        document.getElementById('bgmToggle').classList.add('active');
    } else {
        stopBGM();
        document.getElementById('bgmState').innerText = "BGM: OFF";
        document.getElementById('bgmToggle').classList.remove('active');
    }
    isPlaying = !isPlaying;
});

function playNote(freq, duration) {
    if(!audioCtx) return;
    try {
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, audioCtx.currentTime);
        
        gain.gain.setValueAtTime(0.1, audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + duration);

        osc.connect(gain);
        gain.connect(audioCtx.destination);

        osc.start();
        osc.stop(audioCtx.currentTime + duration);
    } catch(e){}
}

function startBGM() {
    if(!audioCtx) {
        audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    }
    const notes = [
        261.63, 261.63, 293.66, 261.63, 349.23, 329.63,
        261.63, 261.63, 293.66, 261.63, 392.00, 349.23,
        261.63, 261.63, 523.25, 440.00, 349.23, 329.63, 293.66,
        466.16, 466.16, 440.00, 349.23, 392.00, 349.23
    ];
    let step = 0;

    bgmInterval = setInterval(() => {
        playNote(notes[step % notes.length], 0.4);
        step++;
    }, 450);
}

function stopBGM() {
    if(bgmInterval) clearInterval(bgmInterval);
}
