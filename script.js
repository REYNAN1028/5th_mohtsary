/* =========================================================
   5th Monthsary Surprise - script.js
   ========================================================= */

const ORDER = ['home', 'letter', 'memories', 'reasons', 'final'];

/* ---------- Page navigation ---------- */
function showPage(id) {
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  const target = document.getElementById(id);
  if (!target) return;
  target.classList.add('active');
  target.scrollTop = 0;
  updateDots(id);

  if (id === 'final') startHearts();
  else stopHearts();
}

/* ---------- Progress dots ---------- */
const dotsEl = document.getElementById('dots');
ORDER.forEach(() => dotsEl.appendChild(document.createElement('span')));

function updateDots(id) {
  const idx = ORDER.indexOf(id);
  [...dotsEl.children].forEach((d, i) => d.classList.toggle('on', i === idx));
}
updateDots('home');

/* ---------- Buttons ---------- */
document.getElementById('openBtn').addEventListener('click', () => {
  showPage('letter');
  playMusic();
});

document.querySelectorAll('.nav-next').forEach(btn => {
  btn.addEventListener('click', () => showPage(btn.dataset.go));
});

document.getElementById('replayBtn').addEventListener('click', () => {
  document.getElementById('envelope').classList.remove('open');
  showPage('home');
});

document.getElementById('foreverBtn').addEventListener('click', () => {
  burstHearts();
});

/* ---------- Envelope ---------- */
const envelope = document.getElementById('envelope');
function openEnvelope() { envelope.classList.add('open'); }
envelope.addEventListener('click', openEnvelope);
envelope.addEventListener('keydown', e => {
  if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openEnvelope(); }
});

/* ---------- Music ---------- */
const bgm = document.getElementById('bgm');
const musicBtn = document.getElementById('musicBtn');
let musicOn = false;

function playMusic() {
  bgm.volume = 0.5;
  bgm.play()
    .then(() => { musicOn = true; musicBtn.classList.add('on'); })
    .catch(() => { /* no song added yet, or autoplay blocked - that's fine */ });
}
musicBtn.addEventListener('click', () => {
  if (musicOn) {
    bgm.pause();
    musicOn = false;
    musicBtn.classList.remove('on');
  } else {
    playMusic();
  }
});

/* ---------- Floating hearts (final page) ---------- */
let heartTimer = null;

function spawnHeart() {
  const h = document.createElement('div');
  h.className = 'float-heart';
  h.textContent = ['💚', '🌷', '😘', '✨'][Math.floor(Math.random() * 4)];
  h.style.left = Math.random() * 100 + 'vw';
  h.style.fontSize = 14 + Math.random() * 22 + 'px';
  h.style.animationDuration = 5 + Math.random() * 5 + 's';
  document.body.appendChild(h);
  setTimeout(() => h.remove(), 10500);
}
function startHearts() {
  stopHearts();
  heartTimer = setInterval(spawnHeart, 600);
}
function stopHearts() {
  if (heartTimer) { clearInterval(heartTimer); heartTimer = null; }
}
function burstHearts() {
  for (let i = 0; i < 25; i++) setTimeout(spawnHeart, i * 60);
}

/* ---------- Starry background ---------- */
const canvas = document.getElementById('stars');
const ctx = canvas.getContext('2d');
let stars = [];

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  const count = Math.floor((canvas.width * canvas.height) / 9000);
  stars = Array.from({ length: count }, () => ({
    x: Math.random() * canvas.width,
    y: Math.random() * canvas.height,
    r: Math.random() * 1.4 + 0.2,
    a: Math.random(),
    s: Math.random() * 0.012 + 0.003,
  }));
}
function drawStars() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  for (const s of stars) {
    s.a += s.s;
    const alpha = 0.25 + Math.abs(Math.sin(s.a)) * 0.75;
    ctx.beginPath();
    ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(230, 255, 230, ${alpha})`;
    ctx.fill();
  }
  requestAnimationFrame(drawStars);
}
window.addEventListener('resize', resizeCanvas);
resizeCanvas();
drawStars();
