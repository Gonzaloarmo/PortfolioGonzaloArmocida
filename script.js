/* ======= Edit your info here ======= */
const CONFIG = {
  projects: [
    { id: 'terrace', name: 'Terrace', url: 'https://terracefest.vercel.app/', desc: 'The party is upstairs', icon: 'assets/icono_terrace.png', x: 528, y: 330 },
    { id: 'trama', name: 'Trama', url: 'https://tramastore.vercel.app/', desc: 'Caps, bucket hats and beanies', icon: 'assets/icono_trama.png', x: 761, y: 330 },
    { id: 'crealo', name: 'Crealo', url: 'https://crealo-ten.vercel.app/', desc: '[SHORT DESCRIPTION]', icon: 'assets/icono_crealo.png', x: 997, y: 330 },
  ],
  behance: '[LINK]',
  linkedin: '[LINK]',
  mail: '[EMAIL]',
  cv: '[CV LINK]',
  about: '[SHORT BIO]',
};
/* =================================== */

const IMG_W = 1672, IMG_H = 940, BG = 1.04;
const VID = { w: 1920, h: 1080, sx: 367, sy: 86, sw: 1182, sh: 515 };
const reduce = matchMedia('(prefers-reduced-motion: reduce)');
const fine = matchMedia('(hover: hover) and (pointer: fine)');
const $ = (s) => document.querySelector(s);
const intro = $('#intro'), cam = $('#cam'), video = $('#introVideo'), skip = $('#skip');
const hello = $('#hello'), t1 = $('#t1'), t2 = $('#t2'), hint = $('#hint');
const bootEl = $('#boot'), screenEl = $('#screen'), offEl = $('#off'), powerBtn = $('#powerOn');
const desk = $('#desk'), stage = $('#stage'), iconsEl = $('#icons'), mlayer = $('#mlayer');
const lyBg = $('#lyBg'), lyDock = $('#lyDock');
const winLayer = $('#windows'), slotsEl = $('#slots'), menuLayer = $('#menus'), notif = $('#notif'), live = $('#live'), fxTop = $('#fxTop');
const clamp = (v, a, b) => Math.min(Math.max(v, a), Math.max(a, b));
const isMobile = () => innerWidth < 700;
const rich = () => fine.matches && !isMobile();
const announce = (t) => { live.textContent = ''; setTimeout(() => (live.textContent = t), 30); };
const inPreview = /claude/i.test(location.hostname);
const store = {
  get: () => { try { return sessionStorage.getItem('gos-booted'); } catch (e) { return null; } },
  set: () => { try { sessionStorage.setItem('gos-booted', '1'); } catch (e) {} },
};
const timers = [];
const later = (fn, ms) => { const t = setTimeout(fn, ms); timers.push(t); return t; };
const clearTimers = () => { timers.forEach(clearTimeout); timers.length = 0; };
let dragging = false;

/* ---------- pixel art ---------- */
const PAL = { K: '#1b1640', O: '#2c1e5e', L: '#8f7fe0', H: '#b9adff', P: '#ff9f86', C: '#f6eee3', M: '#ffe3c2', N: '#f2c08f', Y: '#ffd27a' };
function pix(rows, cls) {
  const w = rows[0].length, h = rows.length;
  let r = '';
  rows.forEach((row, y) => {
    let x = 0;
    while (x < w) {
      const c = row[x];
      if (c === '.') { x++; continue; }
      let n = 1;
      while (row[x + n] === c) n++;
      r += `<rect x="${x}" y="${y}" width="${n}" height="1" fill="${PAL[c]}"/>`;
      x += n;
    }
  });
  return `<svg${cls ? ` class="${cls}"` : ''} viewBox="0 0 ${w} ${h}" shape-rendering="crispEdges" aria-hidden="true" focusable="false">${r}</svg>`;
}
const ART = {};
ART.g = (() => {
  const n = 11, g = [...Array(n)].map((_, y) => [...Array(n)].map((_, x) => (x === 0 || y === 0 || x === n - 1 || y === n - 1 ? 'K' : 'L')));
  [[0, 0], [n - 1, 0], [0, n - 1], [n - 1, n - 1]].forEach(([x, y]) => (g[y][x] = '.'));
  for (let i = 1; i < n - 1; i++) { g[1][i] = 'H'; g[i][1] = 'H'; }
  ['.KKKKK.', 'KK...KK', 'KK.....', 'KK.KKKK', 'KK...KK', 'KK...KK', '.KKKKK.'].forEach((row, y) =>
    [...row].forEach((c, x) => { if (c === 'K') g[y + 2][x + 2] = 'K'; }));
  return g.map((r) => r.join(''));
})();
ART.doc = ['KKKKKKKKKK....', 'KCCCCCCCCKK...', 'KCCCCCCCCKCK..', 'KCLLLLLLCKCCK.', 'KCCCCCCCCKKKKK', 'KCLLLLLLLLLLCK', 'KCCCCCCCCCCCCK',
  'KCLLLLLLLLLLCK', 'KCCCCCCCCCCCCK', 'KCLLLLLLLLLLCK', 'KCCCCCCCCCCCCK', 'KCLLLLLLLCCCCK', 'KCCCCCCCCCCCCK', 'KKKKKKKKKKKKKK'];
ART.pdf = (() => {
  const L = { P: ['XX.', 'X.X', 'XX.', 'X..', 'X..'], D: ['XX.', 'X.X', 'X.X', 'X.X', 'XX.'], F: ['XXX', 'X..', 'XX.', 'X..', 'X..'] };
  const m = (s) => s.replace(/X/g, 'K').replace(/\./g, 'P');
  const band = 'KPPPPPPPPPPPPK', rows = [...ART.doc.slice(0, 7), band];
  for (let y = 0; y < 5; y++) rows.push('KP' + m(L.P[y]) + 'P' + m(L.D[y]) + 'P' + m(L.F[y]) + 'K');
  rows.push(band, 'KKKKKKKKKKKKKK');
  return rows;
})();
ART.trash = ['....KKKKKK....', 'KKKKKHHHHKKKKK', 'KHHHHHHHHHHHHK', 'KKKKKKKKKKKKKK', ...Array(9).fill('.KLLHLLHLLHLK.'), '.KKKKKKKKKKKK.'];
ART.term = ['KKKKKKKKKKKKKK', 'KLLLLLLLLLPLHK', 'KKKKKKKKKKKKKK', 'KOOOOOOOOOOOOK', 'KOHOOOOOOOOOOK', 'KOOHOOOOOOOOOK',
  'KOHOOPPPOOOOOK', 'KOOOOOOOOOOOOK', 'KOOOOOOOOOOOOK', 'KKKKKKKKKKKKKK'];
ART.vol = ['...C.....', '..CC..C..', 'CCCC...C.', 'CCCC.C.C.', 'CCCC...C.', '..CC..C..', '...C.....'];
ART.mute = ['...C.....', '..CC.....', 'CCCC.C.C.', 'CCCC..C..', 'CCCC.C.C.', '..CC.....', '...C.....'];
ART.wifi = ['.CCCCCCC.', 'C.......C', '..CCCCC..', '.C.....C.', '...CCC...', '.........', '....C....'];
ART.arrow = ['K...........', 'KK..........', 'KCK.........', 'KCCK........', 'KCCCK.......', 'KCCCCK......', 'KCCCCCK.....', 'KCCCCCCK....',
  'KCCCCCCCK...', 'KCCCCCCCCK..', 'KCCCCCCCCCK.', 'KCCCCCCKKKKK', 'KCCCKCCK....', 'KCCK.KCCK...', 'KCK..KCCK...', 'KK....KCCK..', 'K.....KCCK..', '.......KK...'];
ART.hand = ['....KK........', '...KCCK.......', '...KCCK.......', '...KCCK.......', '...KCCKKK.....', '...KCCKCCKKK..', '.KKKCCKCCKCCK.', 'KCCKCCCCCCCCKK',
  'KCCKCCCCCCCCCK', 'KCCCCCCCCCCCCK', '.KCCCCCCCCCCCK', '.KCCCCCCCCCCK.', '..KCCCCCCCCCK.', '..KCCCCCCCCK..', '...KCCCCCCCK..', '...KKKKKKKKK..'];
function hourglass(f) {
  const rows = ['KKKKKKKKKK', 'KHHHHHHHHK', '.K......K.', '.K......K.', '..K....K..', '...K..K...', '...K..K...', '..K....K..', '.K......K.', '.K......K.', 'KHHHHHHHHK', 'KKKKKKKKKK'];
  const sand = [[2, 3, 4], [3, 4, 5, 9], [4, 5, 6, 8, 9], [7, 8, 9]][f];
  return rows.map((r, y) => {
    if (y < 2 || y > 9) return r;
    const a = r.indexOf('K'), b = r.lastIndexOf('K');
    return r.slice(0, a + 1) + (sand.includes(y) ? 'P' : 'C').repeat(b - a - 1) + r.slice(b);
  });
}
ART.catSleep = ['..O..O..............', '.OOOOOO.............', '.OOOOOO...OOOOOOO...', 'OHHOOHHO.OOOOOOOOOO.', 'OOOOOOOOOOOOOOOOOOOO',
  'OOOPOOOOOOOOOOOOOOOO', '.OOOOOOOOOOOOOOOOOOO', '..OOOOOOOOOOOOOLLOO.', '...LLLLLLLLLLLLLLL..'];
ART.catAwake = ['.O...O..............', '.OO.OO..............', '.OOOOOO...OOOOOOO...', 'OPOOOPOO.OOOOOOOOOO.', ...ART.catSleep.slice(4)];
ART.heart = ['.PP.PP.', 'PPPPPPP', 'PPPPPPP', '.PPPPP.', '..PPP..', '...P...'];
function disc(r, fill, extra) {
  const n = r * 2 + 1;
  return [...Array(n)].map((_, y) => [...Array(n)].map((_, x) => {
    const d = Math.hypot(x - r, y - r);
    if (d > r + 0.3) return '.';
    return extra ? extra(x, y, d) || fill : fill;
  }).join(''));
}
const CRATERS = [[8, 9], [9, 9], [8, 10], [15, 7], [16, 7], [14, 15], [15, 15], [15, 16], [10, 17], [17, 12]];
ART.moon = disc(12, 'M', (x, y, d) => (CRATERS.some(([a, b]) => a === x && b === y) ? 'N' : d > 11.2 && x > 12 ? 'N' : null));
document.querySelectorAll('[data-art]').forEach((el) => (el.innerHTML = pix(ART[el.dataset.art])));

/* ---------- cursors ---------- */
function cursorURI(rows, s) {
  const w = rows[0].length, h = rows.length;
  const inner = pix(rows).replace(/^<svg[^>]*>/, '').replace('</svg>', '').replace(/"/g, "'");
  return `url("data:image/svg+xml,${encodeURIComponent(`<svg xmlns='http://www.w3.org/2000/svg' width='${w * s}' height='${h * s}' viewBox='0 0 ${w} ${h}' shape-rendering='crispEdges'>${inner}</svg>`)}")`;
}
const CUR = {
  arrow: cursorURI(ART.arrow, 2) + ' 1 1, default',
  hand: cursorURI(ART.hand, 2) + ' 9 1, pointer',
  busy: [0, 1, 2, 3].map((f) => cursorURI(hourglass(f), 2) + ' 10 12, progress'),
};
if (fine.matches) {
  document.documentElement.style.setProperty('--cur', CUR.arrow);
  document.documentElement.style.setProperty('--cur-hand', CUR.hand);
}
let busyN = 0, busyT;
function busy(d) {
  busyN = Math.max(0, busyN + d);
  const on = busyN > 0;
  document.body.classList.toggle('busy', on);
  clearInterval(busyT);
  if (on) {
    let f = 0;
    const set = () => document.body.style.setProperty('--cur-busy', CUR.busy[f++ % 4]);
    set();
    busyT = setInterval(set, 220);
  }
}
const trail = [...Array(6)].map(() => { const d = document.createElement('i'); d.className = 'trail'; document.body.appendChild(d); return d; });
let trailI = 0, lastP = null;
const TRAIL_COLORS = ['#ff9f86', '#ffd27a', '#b9adff', '#8f7fe0', '#ffb3c7'];
addEventListener('pointermove', (e) => {
  if (e.pointerType !== 'mouse') return;
  parTarget(e);
  if (reduce.matches || !rich()) return;
  const now = performance.now();
  if (lastP) {
    const v = Math.hypot(e.clientX - lastP.x, e.clientY - lastP.y) / Math.max(1, now - lastP.t);
    if (v > 1.4 && now - lastP.s > 26) {
      const p = trail[trailI % trail.length];
      p.style.background = TRAIL_COLORS[trailI++ % TRAIL_COLORS.length];
      p.style.transform = `translate(${Math.round(lastP.x / 3) * 3 + 2}px, ${Math.round(lastP.y / 3) * 3 + 2}px)`;
      p.animate([{ opacity: 0.9 }, { opacity: 0 }], { duration: 320, easing: 'steps(4, end)', fill: 'forwards' });
      lastP.s = now;
    }
  }
  lastP = { x: e.clientX, y: e.clientY, t: now, s: lastP ? lastP.s : 0 };
}, { passive: true });

/* ---------- sound (Web Audio, off by default) ---------- */
const sfx = (() => {
  let ctx = null, master = null, hum = null, on = false;
  try { on = localStorage.getItem('gos-sound') !== '0'; } catch (e) {}
  const ensure = () => {
    if (!on) return null;
    if (!ctx) {
      const AC = window.AudioContext || window.webkitAudioContext;
      if (!AC) return null;
      ctx = new AC();
      master = ctx.createGain();
      master.gain.value = 0.9;
      master.connect(ctx.destination);
    }
    if (ctx.state === 'suspended') ctx.resume();
    return ctx;
  };
  const env = (node, t, peak, dur) => {
    const g = ctx.createGain();
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(peak, t + 0.004);
    g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    node.connect(g); g.connect(master);
  };
  const tone = (type, f0, f1, dur, vol, delay = 0) => {
    const c = ensure(); if (!c) return;
    const t = c.currentTime + delay, o = c.createOscillator();
    o.type = type;
    o.frequency.setValueAtTime(f0, t);
    if (f1) o.frequency.exponentialRampToValueAtTime(f1, t + dur);
    env(o, t, vol, dur);
    o.start(t); o.stop(t + dur + 0.05);
  };
  const noise = (sec, brown) => {
    const b = ctx.createBuffer(1, Math.ceil(ctx.sampleRate * sec), ctx.sampleRate), d = b.getChannelData(0);
    let last = 0;
    for (let i = 0; i < d.length; i++) {
      const w = Math.random() * 2 - 1;
      d[i] = brown ? (last = (last + 0.02 * w) / 1.02) * 3.5 : w;
    }
    return b;
  };
  const tick = (delay, f) => {
    const c = ensure(); if (!c) return;
    const t = c.currentTime + delay, s = c.createBufferSource(), bp = c.createBiquadFilter();
    s.buffer = noise(0.03);
    bp.type = 'bandpass'; bp.frequency.value = f; bp.Q.value = 1.4;
    s.connect(bp); env(bp, t, 0.22, 0.03);
    s.start(t);
  };
  const key = (vol = 0.08, heavy) => {
    const c = ensure(); if (!c) return;
    const t = c.currentTime, s = c.createBufferSource(), bp = c.createBiquadFilter();
    s.buffer = noise(0.025);
    bp.type = 'bandpass'; bp.frequency.value = (heavy ? 1100 : 1900) + Math.random() * 1400; bp.Q.value = 2.2;
    s.connect(bp); env(bp, t, vol * (0.75 + Math.random() * 0.5), 0.022);
    s.start(t);
    tone('sine', heavy ? 140 : 210 + Math.random() * 60, 0, 0.03, vol * 0.35);
  };
  const api = {
    get on() { return on; },
    key() { key(); },
    enter() { key(0.11, true); },
    tap() { tick(0, 3400); },
    set(v) {
      on = v;
      try { localStorage.setItem('gos-sound', v ? '1' : '0'); } catch (e) {}
      if (v) { ensure(); api.click(); if (phase === 'desk') api.startHum(); }
      else { api.stopHum(); if (ctx) ctx.suspend(); }
    },
    wake() { if (on) ensure(); if (on && ctx && ctx.state === 'suspended') ctx.resume(); if (on && phase === 'desk' && !hum) api.startHum(); },
    click() { tick(0, 2600); tick(0.055, 1700); },
    boop() { tone('sine', 180, 520, 0.18, 0.16); tone('sine', 520, 0, 0.25, 0.08, 0.16); },
    off() { tone('sine', 520, 70, 0.4, 0.14); },
    open() { tone('square', 440, 0, 0.05, 0.035); tone('square', 660, 0, 0.07, 0.035, 0.05); },
    close() { tone('square', 660, 0, 0.05, 0.035); tone('square', 440, 0, 0.07, 0.035, 0.05); },
    meow() { tone('triangle', 700, 1150, 0.12, 0.06); tone('triangle', 1150, 620, 0.2, 0.05, 0.11); },
    tada() { [523, 659, 784, 1046].forEach((f, i) => tone('square', f, 0, 0.09, 0.03, i * 0.08)); },
    startHum() {
      const c = ensure(); if (!c || hum || document.hidden) return;
      const s = c.createBufferSource(), lp = c.createBiquadFilter(), g = c.createGain(), o = c.createOscillator(), og = c.createGain();
      s.buffer = noise(2, true); s.loop = true;
      lp.type = 'lowpass'; lp.frequency.value = 240;
      g.gain.value = 0.022; og.gain.value = 0.006;
      o.frequency.value = 52;
      s.connect(lp); lp.connect(g); g.connect(master);
      o.connect(og); og.connect(master);
      s.start(); o.start();
      hum = { s, o };
    },
    stopHum() { if (!hum) return; try { hum.s.stop(); hum.o.stop(); } catch (e) {} hum = null; },
  };
  return api;
})();
addEventListener('pointerdown', () => sfx.wake(), true);
addEventListener('pointerdown', (e) => {
  const b = e.target.closest && e.target.closest('button, a, .mb-btn');
  if (b && !b.closest('.icon')) sfx.tap();
});
addEventListener('keydown', () => sfx.wake(), true);

/* ---------- intro ---------- */
let phase = 'off';
const caret = document.createElement('span');
caret.className = 'caret';
function startIntro() {
  clearTimers();
  closeMenus();
  offEl.hidden = true;
  document.body.style.background = '';
  if (reduce.matches) return showDesk();
  phase = 'intro';
  hideDesk();
  bootEl.hidden = true;
  intro.hidden = false;
  cam.classList.remove('zoom');
  cam.style.transform = '';
  skip.hidden = false;
  hello.classList.remove('out');
  hint.classList.remove('out');
  try { video.currentTime = 0; } catch (e) {}
  placeScreen();
  t1.textContent = t2.textContent = '';
  // Browsers only allow sound after a click/key. Wait for one so video, typing and music start together.
  const activated = navigator.userActivation ? navigator.userActivation.hasBeenActive : false;
  if (!activated) {
    phase = 'gate';
    skip.hidden = true;
    intro.classList.add('gated');
    gate.hidden = false;
    return;
  }
  playIntro();
}
const gate = $('#gate'), gateStart = $('#gateStart'), gateSkip = $('#gateSkip');
function playIntro() {
  phase = 'intro';
  gate.hidden = true;
  intro.classList.remove('gated');
  skip.hidden = false;
  const p = video.play();
  if (p && p.catch) p.catch(() => later(zoom, 4000));
  typeText();
}
function typeText() {
  t1.textContent = t2.textContent = '';
  const run = (el, str, i, speed, next) => {
    el.parentNode.appendChild(caret);
    el.textContent = str.slice(0, i);
    if (str[i - 1] && str[i - 1] !== ' ') sfx.key();
    if (i >= str.length) return next && next();
    later(() => run(el, str, i + 1, speed, next), speed);
  };
  // synced to the hands in intro.mp4: left hand types the name (~1.25s), both hands type the tagline (~4.35s)
  const t0 = performance.now();
  const at = (sec, fn) => {
    const vt = video.paused && video.currentTime === 0 ? (performance.now() - t0) / 1000 : video.currentTime;
    if (vt >= sec) fn(); else later(() => at(sec, fn), 30);
  };
  at(1.25, () => run(t1, 'Gonzalo\nArmocida', 1, 70, () => at(4.35, () => run(t2, 'I design animated websites that make brands stand out.', 1, 27))));
}
function placeScreen() {
  const W = innerWidth, H = innerHeight, s = Math.max(W / VID.w, H / VID.h);
  const ox = (W - VID.w * s) / 2, oy = (H - VID.h * s) / 2;
  Object.assign(screenEl.style, { left: ox + VID.sx * s + 'px', top: oy + VID.sy * s + 'px', width: VID.sw * s + 'px', height: VID.sh * s + 'px' });
}
function zoom() {
  if (phase !== 'intro') return;
  if (reduce.matches) return showDesk();
  phase = 'zoom';
  video.pause();
  hint.classList.add('out');
  later(() => {
    const W = innerWidth, H = innerHeight;
    const s = Math.max(W / VID.w, H / VID.h);
    const ox = (W - VID.w * s) / 2, oy = (H - VID.h * s) / 2;
    const sx = ox + VID.sx * s, sy = oy + VID.sy * s, sw = VID.sw * s, sh = VID.sh * s;
    const k = Math.max(W / sw, H / sh) * 1.03;
    cam.classList.add('zoom');
    void cam.offsetWidth;
    cam.style.transform = `translate(${W / 2 - k * (sx + sw / 2)}px, ${H / 2 - k * (sy + sh / 2)}px) scale(${k})`;
    later(boot, 1300);
  }, 220);
}
video.addEventListener('ended', () => later(zoom, 1600));
video.querySelector('source:last-of-type').addEventListener('error', () => { if (phase === 'intro') showDesk(); });
intro.addEventListener('click', (e) => {
  if (phase === 'gate') { if (!e.target.closest('#gateSkip')) playIntro(); return; }
  if (phase === 'intro') zoom();
});
gateSkip.addEventListener('click', (e) => { e.stopPropagation(); skipAll(); });
skip.addEventListener('click', skipAll);
function skipAll() { clearTimers(); bootEl.hidden = true; showDesk(); }

/* ---------- power on / off ---------- */
function boot() {
  if (reduce.matches) return showDesk();
  phase = 'boot';
  video.pause();
  sfx.boop();
  bootEl.classList.remove('out');
  bootEl.hidden = false;
  const crt = bootEl.querySelector('.crt');
  crt.style.animation = 'none'; void crt.offsetWidth; crt.style.animation = '';
  intro.hidden = true;
  later(enterDesk, 520);
}
function enterDesk() {
  if (phase !== 'boot') return;
  showDesk();
  bootEl.classList.add('out');
  later(() => { bootEl.hidden = true; bootEl.classList.remove('out'); }, 330);
}
function hideDesk() {
  desk.classList.remove('show');
  desk.setAttribute('aria-hidden', 'true');
  desk.inert = true;
  notif.hidden = true;
  sceneStop();
  sfx.stopHum();
  hidePreview();
  parReset();
}
function showDesk() {
  clearTimers();
  closeMenus();
  phase = 'desk';
  video.pause();
  skip.hidden = true;
  intro.hidden = true;
  offEl.hidden = true;
  document.body.style.background = '';
  cam.classList.remove('zoom');
  cam.style.transform = '';
  desk.inert = false;
  desk.removeAttribute('aria-hidden');
  layout();
  timeOfDay();
  desk.classList.add('show');
  store.set();
  sceneStart();
  sfx.startHum();
  later(() => notify(), 600);
  announce('Desktop ready. Press Tab to move through the icons.');
}
function restart() {
  clearTimers();
  closeAll();
  arrange(true);
  setSel([]);
  hideDesk();
  boot();
}
function shutdown() {
  clearTimers();
  closeMenus();
  phase = 'off';
  sfx.off();
  const finish = () => {
    closeAll();
    hideDesk();
    offEl.hidden = false;
    powerBtn.focus({ preventScroll: true });
    announce('Gonzalo OS is off. Press the button to power on.');
  };
  document.body.style.background = '#000';
  if (reduce.matches || !desk.animate) return finish();
  const a = desk.animate([
    { transform: 'none', filter: 'brightness(1)' },
    { transform: 'scale(1, .008)', filter: 'brightness(2.2)', offset: 0.5 },
    { transform: 'scale(.006, .008)', filter: 'brightness(3)', offset: 0.82 },
    { transform: 'scale(0, 0)', filter: 'brightness(3)', opacity: 0 },
  ], { duration: 680, easing: 'steps(10, end)', fill: 'forwards' });
  a.onfinish = () => { finish(); a.cancel(); };
}
function powerOn() {
  if (phase !== 'off') return;
  offEl.hidden = true;
  document.body.style.background = '';
  arrange(true);
  setSel([]);
  boot();
}
offEl.addEventListener('click', powerOn);

/* ---------- notification ---------- */
let notifTimer;
function notify(title = 'Welcome to Gonzalo OS', body = (isMobile() || matchMedia('(pointer: coarse)').matches) ? 'Tap a project to open it.' : 'Double-click a project to open it.') {
  clearTimeout(notifTimer);
  $('#notifTitle').textContent = title;
  $('#notifBody').textContent = body;
  $('#notifBody').hidden = !body;
  notif.classList.remove('out');
  notif.hidden = false;
  notif.style.animation = 'none'; void notif.offsetWidth; notif.style.animation = '';
  notifTimer = setTimeout(hideNotif, 4000);
}
function hideNotif() {
  clearTimeout(notifTimer);
  if (notif.hidden) return;
  if (reduce.matches) { notif.hidden = true; return; }
  notif.classList.add('out');
  setTimeout(() => { notif.hidden = true; notif.classList.remove('out'); }, 220);
}
notif.querySelector('.nx').addEventListener('click', hideNotif);

/* ---------- parallax ---------- */
const layers = [...stage.querySelectorAll('.layer[data-depth]')].filter((l) => +l.dataset.depth);
const par = { tx: 0, ty: 0, x: 0, y: 0, raf: 0 };
const parOn = () => rich() && !reduce.matches && phase === 'desk';
function parTarget(e) {
  if (!layers.length || !parOn() || dragging) return;
  par.tx = (e.clientX / innerWidth - 0.5) * 2;
  par.ty = (e.clientY / innerHeight - 0.5) * 2;
  if (!par.raf) par.raf = requestAnimationFrame(parStep);
}
function parStep() {
  par.raf = 0;
  par.x += (par.tx - par.x) * 0.07;
  par.y += (par.ty - par.y) * 0.07;
  const max = stage.offsetWidth * 0.01;
  layers.forEach((l) => {
    const d = +l.dataset.depth;
    l.style.transform = `translate3d(${(-par.x * d * max).toFixed(2)}px, ${(-par.y * d * max * 0.6).toFixed(2)}px, 0)`;
  });
  if (Math.abs(par.tx - par.x) + Math.abs(par.ty - par.y) > 0.002) par.raf = requestAnimationFrame(parStep);
}
function parReset() {
  cancelAnimationFrame(par.raf);
  par.raf = 0;
  par.tx = par.ty = par.x = par.y = 0;
  layers.forEach((l) => (l.style.transform = ''));
}

/* ---------- living scene (canvas, 12 fps stepped) ---------- */
const CW = 836, CH = 470;
const bgC = $('#bgFx').getContext('2d'), skyC = $('#skyFx').getContext('2d');
const WARM = ['#ff9f86', '#ffc27a', '#ffd27a', '#ffb38a'];
const CITY = [[296, 745], [318, 745], [296, 770], [340, 770], [318, 800], [340, 822], [440, 795], [455, 815], [515, 805], [545, 805], [530, 830],
  [615, 832], [650, 846], [1050, 836], [1075, 850], [1190, 830], [1235, 830], [1215, 848], [1425, 820], [1470, 836], [1535, 775], [1560, 800],
  [1545, 826], [1615, 806], [1650, 830]].map(([x, y]) => ({ x: x >> 1, y: y >> 1, on: Math.random() < 0.5, next: Math.random() * 6000, c: WARM[(Math.random() * WARM.length) | 0] }));
const STARS = [[94, 62], [205, 20], [168, 135], [585, 42], [813, 22], [782, 107], [992, 102], [1187, 90], [1330, 65], [960, 232], [408, 388], [530, 557], [1290, 355]]
  .map(([x, y]) => ({ x: x >> 1, y: y >> 1, ph: Math.random() * 7 }));
const EXTRA = [...Array(18)].map(() => {
  let x, y;
  do { x = 230 + Math.random() * 440; y = 8 + Math.random() * 86; } while (x > 140 && x < 215 && y > 35 && y < 105);
  return { x: x | 0, y: y | 0, ph: Math.random() * 7 };
});
let sceneRAF = 0, sceneLast = 0, shoot = null, plane = null, nextShoot = 0, nextPlane = 0;
function sceneStart() {
  if (sceneRAF || document.hidden) return;
  const now = performance.now();
  if (!nextShoot) nextShoot = now + 9000 + Math.random() * 6000;
  if (!nextPlane) nextPlane = now + 22000 + Math.random() * 15000;
  if (reduce.matches) { drawScene(now, true); return; }
  sceneRAF = requestAnimationFrame(sceneLoop);
}
function sceneStop() { cancelAnimationFrame(sceneRAF); sceneRAF = 0; }
function sceneLoop(t) {
  sceneRAF = requestAnimationFrame(sceneLoop);
  if (t - sceneLast < 83) return;
  sceneLast = t;
  drawScene(t);
}
function px(c, color, x, y, w = 1, h = 1) { c.fillStyle = color; c.fillRect(Math.round(x), Math.round(y), w, h); }
function drawScene(t, still) {
  const day = desk.classList.contains('daymode');
  bgC.clearRect(0, 0, CW, CH);
  CITY.forEach((w) => {
    if (!still && t >= w.next) { w.on = !w.on; w.next = t + 2000 + Math.random() * 4000; }
    if (w.on && !day) px(bgC, w.c, w.x, w.y, 2, 2);
  });
  skyC.clearRect(0, 0, CW, CH);
  if (day || still) return;
  STARS.forEach((s) => {
    const v = Math.sin(t / 650 + s.ph);
    if (v > 0.55) px(bgC, '#f6eee3', s.x, s.y);
    if (v > 0.85) [[-1, 0], [1, 0], [0, -1], [0, 1]].forEach(([a, b]) => px(bgC, '#b9adff', s.x + a, s.y + b));
  });
  EXTRA.forEach((s) => { const v = Math.sin(t / 900 + s.ph); if (v > -0.2) px(skyC, v > 0.7 ? '#f6eee3' : '#b9adff', s.x, s.y); });
  if (!shoot && t > nextShoot) {
    const dir = Math.random() < 0.5 ? -1 : 1;
    shoot = { x: 220 + Math.random() * 400, y: 10 + Math.random() * 45, dx: dir * 6, dy: 2.6, n: 0 };
  }
  if (shoot) {
    shoot.n++; shoot.x += shoot.dx; shoot.y += shoot.dy;
    for (let i = 6; i >= 0; i--) {
      skyC.globalAlpha = 1 - i / 8;
      px(skyC, i === 0 ? '#f6eee3' : i < 3 ? '#b9adff' : '#8f7fe0', shoot.x - (shoot.dx * i) / 2, shoot.y - (shoot.dy * i) / 2);
    }
    skyC.globalAlpha = 1;
    if (shoot.n > 12) { shoot = null; nextShoot = t + 20000 + Math.random() * 20000; }
  }
  if (!plane && t > nextPlane) plane = { x: CW + 4, y: 48 + Math.random() * 60, n: 0 };
  if (plane) {
    plane.x -= 1.4; plane.n++;
    px(skyC, '#2c1e5e', plane.x, plane.y, 4, 1);
    px(skyC, '#f6eee3', plane.x, plane.y);
    if (plane.n % 12 < 4) px(skyC, '#ff4f5e', plane.x + 3, plane.y - 1);
    if (plane.x < -6) { plane = null; nextPlane = t + 45000 + Math.random() * 60000; }
  }
}
const forcedHour = new URLSearchParams(location.search).get('hour');
function timeOfDay() {
  const h = forcedHour !== null && !isNaN(+forcedHour) ? +forcedHour : new Date().getHours();
  desk.dataset.tod = h >= 18 && h < 21 ? 'sunset' : h >= 21 || h < 5 ? 'night' : h < 8 ? 'dawn' : 'day';
}

/* ---------- moon & cat ---------- */
const moonBtn = $('#moon'), fullMoon = $('#fullMoon');
fullMoon.innerHTML = pix(disc(19, 'H'), 'halo1') + pix(disc(16, 'H'), 'halo2') + pix(ART.moon, 'disc');
function toggleMoon() {
  const on = fullMoon.hidden;
  fullMoon.hidden = !on;
  moonBtn.setAttribute('aria-pressed', on);
  sfx.click();
  announce(on ? 'Full moon' : 'Crescent moon');
}
moonBtn.addEventListener('dblclick', toggleMoon);
moonBtn.addEventListener('click', (e) => { if (e.detail === 0) toggleMoon(); });

const catEl = $('#cat'), catArt = catEl.querySelector('.cat-art');
catArt.innerHTML = pix(ART.catSleep);
catEl.querySelector('.heart').innerHTML = pix(ART.heart);
let catHovers = [], catBusy = false;
catEl.addEventListener('pointerenter', (e) => {
  if (e.pointerType !== 'mouse') return;
  const now = Date.now();
  catHovers = catHovers.filter((t) => now - t < 4000);
  catHovers.push(now);
  if (catHovers.length >= 3) { catHovers = []; wakeCat(); }
});
catEl.addEventListener('click', wakeCat);
function wakeCat() {
  if (catBusy) return;
  catBusy = true;
  sfx.meow();
  catEl.classList.add('awake');
  catArt.innerHTML = pix(ART.catAwake);
  announce('The cat wakes up, stretches and goes back to sleep.');
  setTimeout(() => catEl.classList.add('stretch'), 420);
  setTimeout(() => { catEl.classList.remove('stretch'); catEl.classList.add('love'); }, 1000);
  setTimeout(() => {
    catEl.classList.remove('awake', 'love');
    catArt.innerHTML = pix(ART.catSleep);
    catBusy = false;
  }, 2300);
}

/* ---------- icons ---------- */
const SYS = [
  { id: 'about', name: 'About me.txt', art: 'doc', open: () => openNotes() },
  { id: 'cv', name: 'CV.pdf', art: 'pdf', open: () => openCV() },
  { id: 'term', name: 'Terminal', art: 'term', open: () => openTerminal() },
  { id: 'trash', name: 'Trash', art: 'trash', open: () => openTrash() },
];
let mode = 'desk', unit = 1, sel = new Set();
const icons = [
  ...CONFIG.projects.map((p, k) => ({ kind: 'proj', k, p, name: p.name, html: `<img src="${p.icon}" alt="" width="156" height="156" draggable="false">`, open: () => openProject(p) })),
  ...SYS.map((s, k) => ({ kind: 'sys', k, name: s.name, html: `<span class="art">${pix(ART[s.art])}</span>`, open: s.open, sys: s })),
].map((it) => {
  const el = document.createElement('button');
  el.type = 'button';
  el.className = 'icon';
  el.setAttribute('aria-label', it.kind === 'proj' ? `${it.name}: open project` : `${it.name}: open`);
  el.innerHTML = `<span class="ico-in">${it.html}<span class="label pbox">${it.name}</span></span>`;
  iconsEl.appendChild(el);
  it.el = el;
  it.inner = el.firstElementChild;
  it.pos = { desk: null, mob: null };
  bindIcon(it);
  return it;
});
const iconEl = (id) => (icons.find((o) => (o.sys ? o.sys.id : o.p.id) === id) || {}).el;
const openIcon = (it) => { sfx.click(); hidePreview(); it.open(); };

// Cover the viewport, but crop from the sky: keep the drawn dock (y=912 of fondo.png) >= 12px above the bottom edge.
// The bg layers are 104% of the stage, offset -2%.
const DOCK_Y = 912 / IMG_H;
let stageTop = 0;
function positionStage() {
  const H = desk.clientHeight || innerHeight, SH = stage.offsetHeight;
  const centered = (H - SH) / 2;
  const dockMax = H - 12 - SH * (BG * DOCK_Y - (BG - 1) / 2);
  stageTop = clamp(Math.min(centered, dockMax), H - SH * (1 + (BG - 1) / 2), SH * (BG - 1) / 2);
  stage.style.top = stageTop + 'px';
  stage.style.transform = 'translateX(-50%)';
}
function layout() {
  positionStage();
  unit = stage.offsetWidth / IMG_W;
  stage.style.setProperty('--u', unit + 'px');
  lyBg.style.setProperty('--u', unit * BG + 'px');
  lyDock.style.setProperty('--u', unit * BG + 'px');
  mode = isMobile() ? 'mob' : 'desk';
  const target = mode === 'mob' ? mlayer : stage;
  if (iconsEl.parentNode !== target) target.appendChild(iconsEl);
  if (!parOn()) parReset();
  icons.forEach(placeIcon);
}
function defaultPos(it) {
  if (mode === 'desk') {
    if (it.kind === 'proj') return { x: it.p.x / IMG_W, y: it.p.y / IMG_H };
    const SW = stage.offsetWidth, SH = stage.offsetHeight, cl = (SW - innerWidth) / 2, ct = -stageTop;
    const iconH = 97 * unit + 40, pref = Math.max(176 * unit, 97 * unit + 62);
    const avail = innerHeight - 48 - 190 - iconH;
    let step = Math.min(pref, avail / 3), col = 0, row = it.k;
    if (step < iconH + 10) { step = Math.min(pref, Math.max(iconH + 10, avail)); col = it.k >> 1; row = it.k & 1; }
    let x = cl + innerWidth - 22 - 156 * unit - col * Math.max(170 * unit, 130), y = ct + 48 + row * step;
    if (x < 1153 * unit + 16) { x = (470 + it.k * 190) * unit; y = 575 * unit; }
    return { x: x / SW, y: y / SH };
  }
  // mobile: projects in a row at the top, system icons in a row above the dock / music button
  const W = innerWidth, H = innerHeight, s = 84, iconH = 96;
  if (it.kind === 'proj') {
    const colW = Math.min(W * 0.3, 120), cx = W / 2 + (it.k - 1) * colW, y0 = Math.max(56, H * 0.1);
    return { x: (cx - s / 2) / W, y: y0 / H };
  }
  const colW = Math.min((W - 16) / 4, 100), cx = W / 2 + (it.k - 1.5) * colW;
  const y = Math.max(56 + iconH + 40, H * 0.87 - 12 - 46 - 16 - iconH);
  return { x: (cx - s / 2) / W, y: y / H };
}
function placeIcon(it) {
  const pos = it.pos[mode] || defaultPos(it);
  it.el.style.left = pos.x * 100 + '%';
  it.el.style.top = pos.y * 100 + '%';
}
const easeIO = (t) => (t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2);
function frames(fn, n = 12) {
  const k = [];
  for (let i = 0; i <= n; i++) k.push({ offset: i / n, transform: fn(i / n), easing: 'steps(1, end)' });
  return k;
}
function arrange(instant) {
  const anim = !instant && !reduce.matches && phase === 'desk';
  const before = icons.map((it) => it.el.getBoundingClientRect());
  icons.forEach((it) => { it.pos = { desk: null, mob: null }; placeIcon(it); });
  if (!anim) return;
  icons.forEach((it, i) => {
    const a = before[i], b = it.el.getBoundingClientRect(), dx = a.left - b.left, dy = a.top - b.top;
    if (Math.abs(dx) + Math.abs(dy) < 2) return;
    const lift = Math.min(60, 20 + Math.hypot(dx, dy) * 0.15);
    it.el.animate(frames((t) => {
      const e = easeIO(t);
      return `translate(${(dx * (1 - e)).toFixed(1)}px, ${(dy * (1 - e) - Math.sin(Math.PI * t) * lift).toFixed(1)}px)`;
    }, 10), { duration: 480, delay: i * 90, fill: 'backwards' });
  });
}
function setSel(list) {
  sel = new Set(list.filter((o) => !o.el.hidden));
  icons.forEach((o) => o.el.classList.toggle('sel', sel.has(o)));
}
function tilter(apply) {
  let tgt = 0, cur = 0, raf = 0, lx = null, lt = 0;
  const loop = () => { tgt *= 0.82; cur += (tgt - cur) * 0.3; apply(cur); raf = requestAnimationFrame(loop); };
  return {
    move(x) {
      const now = performance.now();
      if (lx !== null) tgt = (x - lx) / Math.max(8, now - lt);
      lx = x; lt = now;
      if (!raf) raf = requestAnimationFrame(loop);
    },
    stop() { cancelAnimationFrame(raf); raf = 0; return cur; },
  };
}
function bindIcon(it) {
  const el = it.el;
  el.addEventListener('pointerdown', (e) => {
    if (e.button !== 0) return;
    e.preventDefault();
    e.stopPropagation();
    closeMenus();
    hidePreview();
    el.focus({ preventScroll: true });
    if (!sel.has(it)) setSel([it]);
    const L = iconsEl.getBoundingClientRect();
    const group = [...sel].map((o) => { const r = o.el.getBoundingClientRect(); return { o, prev: o.pos[mode], l: r.left - L.left, t: r.top - L.top, w: r.width, h: r.height }; });
    const trashIt = icons.find((o) => o.sys && o.sys.id === 'trash');
    const canTrash = !group.some((g) => g.o === trashIt);
    let overTrash = false;
    const x0 = e.clientX, y0 = e.clientY, step = mode === 'desk' ? Math.max(2, unit * 4) : 4;
    let moved = false, tilt = 0;
    const tl = tilter((v) => {
      tilt = clamp(v * 14, -20, 20);
      group.forEach((g) => (g.o.inner.style.transform = `translateY(-6px) rotate(${tilt.toFixed(2)}deg) scale(1.04)`));
    });
    try { el.setPointerCapture(e.pointerId); } catch (_) {}
    const move = (ev) => {
      const dx = ev.clientX - x0, dy = ev.clientY - y0;
      if (!moved && Math.hypot(dx, dy) < 6) return;
      if (!moved) { moved = true; dragging = true; el.classList.add('drag'); }
      if (!reduce.matches) tl.move(ev.clientX);
      const sx = Math.round(dx / step) * step, sy = Math.round(dy / step) * step;
      group.forEach((g) => {
        const l = clamp(g.l + sx, -L.left, innerWidth - L.left - g.w);
        const t = clamp(g.t + sy, -L.top + 38, innerHeight - L.top - g.h);
        g.o.pos[mode] = { x: l / L.width, y: t / L.height };
        placeIcon(g.o);
      });
      if (canTrash) {
        const tr = trashIt.el.getBoundingClientRect();
        overTrash = ev.clientX > tr.left && ev.clientX < tr.right && ev.clientY > tr.top && ev.clientY < tr.bottom;
        trashIt.el.classList.toggle('drop-hot', overTrash);
      }
    };
    const end = (ev) => {
      el.removeEventListener('pointermove', move);
      el.removeEventListener('pointerup', end);
      el.removeEventListener('pointercancel', end);
      el.classList.remove('drag');
      tl.stop();
      dragging = false;
      if (trashIt) trashIt.el.classList.remove('drop-hot');
      if (moved && overTrash) {
        group.forEach((g) => { g.o.inner.style.transform = ''; toTrash(g.o, g.prev); });
        setSel([]);
        notify("This isn't trash!", "But I'll let you keep it here.");
      } else if (moved) {
        group.forEach((g) => {
          g.o.inner.style.transform = '';
          if (reduce.matches) return;
          const r0 = tilt;
          g.o.inner.animate(frames((t) => {
            const d = Math.exp(-5 * t) * Math.cos(t * Math.PI * 3.2), s = 0.1 * Math.exp(-5 * t) * Math.sin(t * Math.PI * 3.2);
            return `translateY(${(-6 * d).toFixed(2)}px) rotate(${(r0 * d).toFixed(2)}deg) scale(${(1 + s).toFixed(3)}, ${(1 - s).toFixed(3)})`;
          }, 14), { duration: 440 });
        });
      } else if (ev.type === 'pointerup') {
        setSel([it]);
        if (ev.pointerType !== 'mouse') openIcon(it);
      }
    };
    el.addEventListener('pointermove', move);
    el.addEventListener('pointerup', end);
    el.addEventListener('pointercancel', end);
  });
  el.addEventListener('dblclick', () => openIcon(it));
  el.addEventListener('focus', () => { if (!sel.has(it)) setSel([it]); });
  el.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') { e.preventDefault(); openIcon(it); }
    else if (e.key === ' ') { e.preventDefault(); setSel([it]); }
  });
  if (it.kind === 'proj') {
    el.addEventListener('pointerenter', (e) => {
      if (e.pointerType !== 'mouse' || !rich() || dragging) return;
      clearTimeout(pvTimer);
      pvTimer = setTimeout(() => { if (!dragging) showPreview(it); }, 300);
    });
    el.addEventListener('pointerleave', hidePreview);
  }
}

/* hover preview */
const pv = $('#pv'), pvVid = pv.querySelector('video'), pvTitle = pv.querySelector('.pv-title');
let pvTimer, pvFor = null, pvLoaded = null, pvHideT;
function showPreview(it) {
  if (pvFor === it || phase !== 'desk') return;
  clearTimeout(pvHideT);
  pvFor = it;
  const id = it.p.id;
  pvTitle.textContent = it.name;
  if (pvLoaded !== id) {
    pvLoaded = id;
    pvVid.poster = `assets/preview_${id}_poster.jpg`;
    pvVid.innerHTML = `<source src="assets/preview_${id}.webm" type="video/webm"><source src="assets/preview_${id}.mp4" type="video/mp4">`;
    pvVid.load();
  }
  pv.classList.remove('out');
  pv.hidden = false;
  pv.style.animation = 'none'; void pv.offsetWidth; pv.style.animation = '';
  const r = it.inner.querySelector('img').getBoundingClientRect(), h = pv.offsetHeight;
  let top = r.top - h - 14;
  if (top < 40) top = it.el.getBoundingClientRect().bottom + 14;
  pv.style.left = clamp(r.left + r.width / 2 - 120, 8, innerWidth - 248) + 'px';
  pv.style.top = clamp(top, 40, innerHeight - h - 8) + 'px';
  const p = pvVid.play();
  if (p && p.catch) p.catch(() => {});
}
function hidePreview() {
  clearTimeout(pvTimer);
  if (!pvFor) return;
  pvFor = null;
  const done = () => { if (!pvFor) { pv.hidden = true; pvVid.pause(); } };
  if (reduce.matches) return done();
  pv.classList.add('out');
  pvHideT = setTimeout(done, 160);
}

/* marquee selection */
desk.addEventListener('pointerdown', (e) => {
  if (e.button !== 0 || e.target.closest('.icon, .win, .dock-btn, #menubar, .menu, #notif, #moon, #cat')) return;
  closeMenus();
  const base = e.shiftKey ? [...sel] : [];
  setSel(base);
  if (isMobile()) return;
  const D = desk.getBoundingClientRect(), x0 = e.clientX, y0 = e.clientY;
  const box = document.createElement('div');
  box.className = 'marquee';
  let shown = false;
  const move = (ev) => {
    const x = Math.min(x0, ev.clientX), y = Math.min(y0, ev.clientY), w = Math.abs(ev.clientX - x0), h = Math.abs(ev.clientY - y0);
    if (!shown) { if (w + h < 4) return; desk.appendChild(box); shown = true; }
    Object.assign(box.style, { left: x - D.left + 'px', top: y - D.top + 'px', width: w + 'px', height: h + 'px' });
    const hits = icons.filter((o) => { const r = o.el.getBoundingClientRect(); return r.left < x + w && r.right > x && r.top < y + h && r.bottom > y; });
    setSel([...base, ...hits]);
  };
  const end = () => {
    box.remove();
    removeEventListener('pointermove', move);
    removeEventListener('pointerup', end);
    removeEventListener('pointercancel', end);
  };
  addEventListener('pointermove', move);
  addEventListener('pointerup', end);
  addEventListener('pointercancel', end);
});

/* ---------- menus ---------- */
const MENUS = {
  g: [{ label: 'About Gonzalo OS', run: () => openAbout() }, { label: 'Replay intro', run: () => startIntro() }, '-', { label: 'Restart', run: () => restart() }, { label: 'Shut down', run: () => shutdown() }],
  file: [
    ...CONFIG.projects.map((p) => ({ label: `Open ${p.name}`, run: () => openProject(p) })),
    '-',
    { label: 'Open About me.txt', run: () => openNotes() },
    { label: 'Open CV.pdf', run: () => openCV() },
    { label: 'Open Terminal', run: () => openTerminal() },
    '-',
    { label: 'Close window', key: 'Esc', run: () => { const w = frontWin(); if (w) closeWin(w); } },
  ],
  view: [{ label: 'Arrange icons', run: () => arrange() }, { label: 'Replay intro', run: () => startIntro() }, '-', { get label() { return sfx.on ? 'System sounds: on' : 'System sounds: off'; }, run: () => { sfx.set(!sfx.on); announce(sfx.on ? 'System sounds on' : 'System sounds off'); } }],
  help: [{ label: 'How to use', run: () => openHelp() }, { label: 'About Gonzalo OS', run: () => openAbout() }],
};
const CTX = [{ label: 'Arrange icons', run: () => arrange() }, { label: 'Replay intro', run: () => startIntro() }, '-', { label: 'About Gonzalo OS', run: () => openAbout() }];
const mbBtns = [...document.querySelectorAll('.mb-btn[data-menu]')];
let openM = null;

function openMenu(items, at, trigger) {
  closeMenus();
  const m = document.createElement('div');
  m.className = 'menu pbox';
  m.setAttribute('role', 'menu');
  m.setAttribute('aria-label', trigger ? trigger.getAttribute('aria-label') || trigger.textContent.trim() : 'Desktop menu');
  items.forEach((i) => {
    if (i === '-') { const s = document.createElement('div'); s.className = 'msep'; s.setAttribute('role', 'separator'); m.appendChild(s); return; }
    const b = document.createElement('button');
    b.type = 'button';
    b.tabIndex = -1;
    b.setAttribute('role', 'menuitem');
    b.innerHTML = `<span>${i.label}</span>${i.key ? `<kbd>${i.key}</kbd>` : ''}`;
    b.addEventListener('click', () => { closeMenus(); i.run(); });
    m.appendChild(b);
  });
  menuLayer.appendChild(m);
  const r = m.getBoundingClientRect();
  m.style.left = Math.max(8, Math.min(at.x, innerWidth - r.width - 12)) + 'px';
  m.style.top = Math.max(34, Math.min(at.y, innerHeight - r.height - 12)) + 'px';
  m.addEventListener('keydown', menuKeys);
  openM = { el: m, trigger };
  if (trigger) { trigger.setAttribute('aria-expanded', 'true'); trigger.classList.add('on'); }
  m.querySelector('[role=menuitem]').focus();
}
function closeMenus(refocus) {
  if (!openM) return;
  const { el, trigger } = openM;
  openM = null;
  el.remove();
  if (trigger) {
    trigger.setAttribute('aria-expanded', 'false');
    trigger.classList.remove('on');
    if (refocus) trigger.focus();
  }
}
function openBar(btn) {
  const r = btn.getBoundingClientRect();
  openMenu(MENUS[btn.dataset.menu], { x: r.left, y: r.bottom + 6 }, btn);
}
function menuKeys(e) {
  const its = [...openM.el.querySelectorAll('[role=menuitem]')], i = its.indexOf(document.activeElement);
  const go = (n) => { e.preventDefault(); its[(n + its.length) % its.length].focus(); };
  if (e.key === 'ArrowDown') go(i + 1);
  else if (e.key === 'ArrowUp') go(i - 1);
  else if (e.key === 'Home') go(0);
  else if (e.key === 'End') go(its.length - 1);
  else if (e.key === 'Escape') { e.preventDefault(); e.stopPropagation(); closeMenus(true); }
  else if (e.key === 'Tab') closeMenus();
  else if ((e.key === 'ArrowRight' || e.key === 'ArrowLeft') && openM.trigger) {
    e.preventDefault();
    const vis = mbBtns.filter((b) => b.offsetParent), j = vis.indexOf(openM.trigger);
    openBar(vis[(j + (e.key === 'ArrowRight' ? 1 : -1) + vis.length) % vis.length]);
  }
}
mbBtns.forEach((b) => {
  b.addEventListener('click', () => { if (openM && openM.trigger === b) closeMenus(); else openBar(b); });
  b.addEventListener('keydown', (e) => { if (e.key === 'ArrowDown') { e.preventDefault(); openBar(b); } });
  b.addEventListener('pointerenter', () => { if (openM && openM.trigger && openM.trigger !== b) openBar(b); });
});
document.addEventListener('pointerdown', (e) => {
  if (openM && !e.target.closest('.menu') && !e.target.closest('.mb-btn')) closeMenus();
}, true);
desk.addEventListener('contextmenu', (e) => {
  if (e.target.closest('.win, #menubar, .menu')) return;
  e.preventDefault();
  if (isMobile()) return;
  openMenu(CTX, { x: e.clientX, y: e.clientY });
});

/* ---------- dock ---------- */
const dockMail = $('#dockMail');
$('#dockBehance').href = CONFIG.behance;
$('#dockLinkedin').href = CONFIG.linkedin;
dockMail.addEventListener('click', () => (wins.has('mail') ? dockToggle(wins.get('mail')) : openMail()));

/* ---------- windows ---------- */
const wins = new Map();
let zTop = 100, cascade = 0;
const snap = (v) => Math.round(v / 4) * 4;
const rectOf = (el) => { const r = el.getBoundingClientRect(); return { left: r.left, top: r.top, width: r.width, height: r.height }; };
const visible = (el) => { if (!el || !el.isConnected) return false; const r = el.getBoundingClientRect(); return r.width > 0 && r.bottom > 0 && r.top < innerHeight && r.right > 0 && r.left < innerWidth; };
const artRect = (el) => rectOf(el.querySelector('.ico-in img, .ico-in .art') || el);
const centerRect = (win) => { const r = rectOf(win); return { left: r.left + r.width * 0.3, top: r.top + r.height * 0.3, width: r.width * 0.4, height: r.height * 0.4 }; };

function ghost(q) {
  const g = document.createElement('i');
  g.className = 'ghost';
  Object.assign(g.style, { left: q.x + 'px', top: q.y + 'px', width: q.w + 'px', height: q.h + 'px' });
  fxTop.appendChild(g);
  const a = g.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 210, easing: 'steps(3, end)', fill: 'forwards' });
  a.onfinish = () => g.remove();
}
function morph(win, rect, out, done) {
  if (!win.animate) return done && done();
  if (reduce.matches || !rect) {
    const a = win.animate(out ? [{ opacity: 1 }, { opacity: 0 }] : [{ opacity: 0 }, { opacity: 1 }], { duration: 160, fill: 'forwards' });
    a.onfinish = () => { done && done(); a.cancel(); };
    return;
  }
  const r = rectOf(win), N = 6, dur = 300;
  const at = (f) => ({ x: rect.left + (r.left - rect.left) * f, y: rect.top + (r.top - rect.top) * f, w: rect.width + (r.width - rect.width) * f, h: rect.height + (r.height - rect.height) * f });
  const tf = (q) => `translate(${q.x - r.left}px, ${q.y - r.top}px) scale(${q.w / r.width}, ${q.h / r.height})`;
  const k0 = { transform: tf(at(0)), opacity: 0.5 }, k1 = { transform: 'none', opacity: 1 };
  win.style.transformOrigin = '0 0';
  const a = win.animate(out ? [k1, k0] : [k0, k1], { duration: dur, easing: `steps(${N}, end)`, fill: 'forwards' });
  for (let i = 0; i < N - 1; i++) setTimeout(() => ghost(at(out ? 1 - i / N : i / N)), ((i + 1) * dur) / N);
  a.onfinish = () => { done && done(); a.cancel(); win.style.transformOrigin = ''; };
}

function openWin(o) {
  if (wins.has(o.id)) {
    const w = wins.get(o.id);
    if (w._min) restore(w); else { focusWin(w); w.focus({ preventScroll: true }); }
    return null;
  }
  const win = document.createElement('section');
  win.className = 'win pbox';
  win.setAttribute('role', 'dialog');
  win.setAttribute('aria-label', o.title);
  win.tabIndex = -1;
  win.dataset.id = o.id;
  win.innerHTML = `
    <header class="bar">${o.icon}<span class="title">${o.title}</span>
      <button class="wbtn wmin" type="button" aria-label="Minimize window"><i></i></button>
      <button class="wbtn wmax" type="button" aria-label="Maximize window" aria-pressed="false"><i></i></button>
      <button class="wbtn wclose" type="button" aria-label="Close window">x</button>
    </header>${o.nav || ''}<div class="wbody">${o.body}</div><div class="grip" aria-hidden="true"></div>`;
  const W = innerWidth, H = innerHeight, w = Math.min(o.w, W - 48), h = Math.min(o.h, H - 120);
  Object.assign(win.style, {
    width: w + 'px', height: h + 'px',
    left: snap((W - w) / 2 + cascade * 28) + 'px',
    top: snap(Math.max(56, (H - h) / 2 - 30) + cascade * 28) + 'px',
  });
  cascade = (cascade + 1) % 5;
  win._title = o.title;
  win._from = o.from || null;
  win._opener = o.opener || o.from || (document.activeElement !== document.body ? document.activeElement : null);
  winLayer.appendChild(win);
  wins.set(o.id, win);

  if (o.dockBtn) { win._target = o.dockBtn; o.dockBtn.classList.add('run'); }
  else {
    const s = document.createElement('button');
    s.type = 'button';
    s.className = 'dock-btn slot pbox run';
    s.setAttribute('aria-label', `${o.title}: open window`);
    s.innerHTML = `${o.slotIcon}<span class="tip pbox" aria-hidden="true">${o.title}</span>`;
    s.addEventListener('click', () => dockToggle(win));
    slotsEl.appendChild(s);
    win._slot = win._target = s;
    renderSlots();
  }
  win.addEventListener('pointerdown', () => focusWin(win), true);
  win.querySelector('.wclose').addEventListener('click', () => closeWin(win));
  win.querySelector('.wmin').addEventListener('click', () => minimize(win));
  const maxBtn = win.querySelector('.wmax');
  const toggleMax = () => {
    const on = win.classList.toggle('max');
    maxBtn.setAttribute('aria-pressed', on);
    maxBtn.setAttribute('aria-label', on ? 'Restore size' : 'Maximize window');
  };
  maxBtn.addEventListener('click', toggleMax);
  const bar = win.querySelector('.bar');
  bar.addEventListener('dblclick', (e) => { if (!e.target.closest('button')) toggleMax(); });
  dragger(bar, win, (st, dx, dy) => {
    win.style.left = clamp(st.l + snap(dx), -st.w + 100, innerWidth - 100) + 'px';
    win.style.top = clamp(st.t + snap(dy), 34, innerHeight - 44) + 'px';
  }, true);
  dragger(win.querySelector('.grip'), win, (st, dx, dy) => {
    win.style.width = clamp(st.w + snap(dx), 320, innerWidth - st.l - 4) + 'px';
    win.style.height = clamp(st.h + snap(dy), 220, innerHeight - st.t - 4) + 'px';
  });
  focusWin(win);
  win.focus({ preventScroll: true });
  morph(win, visible(win._from) ? artRect(win._from) : centerRect(win), false);
  sfx.open();
  hideNotif();
  announce(`${o.title} window opened`);
  return win;
}
function renderSlots() {
  [...slotsEl.children].forEach((s, i) => (s.style.left = ((990 + i * 72) / IMG_W) * 100 + '%'));
}
function dragger(handle, win, apply, weighted) {
  handle.addEventListener('pointerdown', (e) => {
    if (e.button !== 0 || e.target.closest('button') || isMobile() || win.classList.contains('max')) return;
    e.preventDefault();
    const st = { x: e.clientX, y: e.clientY, l: win.offsetLeft, t: win.offsetTop, w: win.offsetWidth, h: win.offsetHeight };
    try { handle.setPointerCapture(e.pointerId); } catch (_) {}
    document.body.classList.add('dragging');
    dragging = true;
    const tiltOn = weighted && !reduce.matches;
    let rot = 0;
    if (tiltOn) win.style.transformOrigin = `${e.clientX - win.getBoundingClientRect().left}px 0px`;
    const tl = tilter((v) => { rot = clamp(v * 1.6, -2, 2); win.style.transform = `rotate(${rot.toFixed(2)}deg)`; });
    const move = (ev) => { apply(st, ev.clientX - st.x, ev.clientY - st.y); if (tiltOn) tl.move(ev.clientX); };
    const end = () => {
      document.body.classList.remove('dragging');
      dragging = false;
      tl.stop();
      handle.removeEventListener('pointermove', move);
      handle.removeEventListener('pointerup', end);
      handle.removeEventListener('pointercancel', end);
      if (!tiltOn) return;
      win.style.transform = '';
      const r0 = rot;
      const a = win.animate(frames((t) => `rotate(${(r0 * Math.exp(-4.5 * t) * Math.cos(t * Math.PI * 3)).toFixed(2)}deg)`, 12), { duration: 420 });
      a.onfinish = () => (win.style.transformOrigin = '');
    };
    handle.addEventListener('pointermove', move);
    handle.addEventListener('pointerup', end);
    handle.addEventListener('pointercancel', end);
  });
}
function focusWin(win) {
  if (win.classList.contains('front')) return;
  wins.forEach((w) => w.classList.remove('front'));
  win.classList.add('front');
  win.style.zIndex = ++zTop;
}
function frontWin() {
  let top = null;
  wins.forEach((w) => { if (!w._min && (!top || +w.style.zIndex > +top.style.zIndex)) top = w; });
  return top;
}
function focusNext(fallback) {
  const next = frontWin();
  if (next) { next.classList.remove('front'); focusWin(next); next.focus({ preventScroll: true }); }
  else (fallback && fallback.isConnected ? fallback : icons[0].el).focus({ preventScroll: true });
}
function minimize(win) {
  if (win._min) return;
  win._min = true;
  win.classList.remove('front');
  win._target.classList.add('min');
  win._target.setAttribute('aria-label', `${win._title}: restore minimized window`);
  sfx.close();
  morph(win, rectOf(win._target), true, () => { if (win._min) win.hidden = true; });
  const next = frontWin();
  if (next) focusWin(next);
  win._target.focus({ preventScroll: true });
  announce(`${win._title} minimized`);
}
function restore(win) {
  win._min = false;
  win.hidden = false;
  win._target.classList.remove('min');
  win._target.setAttribute('aria-label', win._slot ? `${win._title}: open window` : 'Mail');
  focusWin(win);
  sfx.open();
  morph(win, rectOf(win._target), false);
  win.focus({ preventScroll: true });
}
function dockToggle(win) {
  if (win._min) restore(win);
  else if (win.classList.contains('front')) minimize(win);
  else { focusWin(win); win.focus({ preventScroll: true }); }
}
function detach(win) {
  wins.delete(win.dataset.id);
  clearTimeout(win._timer);
  if (win._endLoad) win._endLoad();
  if (win._slot) { win._slot.remove(); renderSlots(); }
  else if (win._target) { win._target.classList.remove('run', 'min'); win._target.setAttribute('aria-label', 'Mail'); }
}
function closeWin(win) {
  if (!wins.has(win.dataset.id)) return;
  detach(win);
  sfx.close();
  if (win.hidden) win.remove();
  else {
    win.style.pointerEvents = 'none';
    morph(win, visible(win._from) ? artRect(win._from) : centerRect(win), true, () => win.remove());
  }
  focusNext(win._opener);
}
function closeAll() {
  [...wins.values()].forEach((w) => { detach(w); w.remove(); });
}

/* static noise for loading windows */
const STATIC_PAL = [[27, 22, 64], [44, 30, 94], [44, 30, 94], [143, 127, 224], [185, 173, 255], [246, 238, 227]];
const statics = new Set();
let staticRAF = 0, staticLast = 0;
function staticLoop(t) {
  staticRAF = statics.size ? requestAnimationFrame(staticLoop) : 0;
  if (t - staticLast < 70) return;
  staticLast = t;
  statics.forEach(drawNoise);
}
function drawNoise(s) {
  const d = s.img.data, w = 160, h = 100;
  s.off = (s.off + 3) % h;
  for (let y = 0; y < h; y++) {
    const band = (y + s.off) % 34 < 5 || (s.tune && (y + s.off * 2) % 17 < 4);
    for (let x = 0; x < w; x++) {
      const r = Math.random();
      const c = STATIC_PAL[band ? (r < 0.6 ? 4 : r < 0.85 ? 3 : 5) : r < 0.55 ? 0 : r < 0.85 ? 1 : r < 0.97 ? 3 : 4];
      const i = (y * w + x) * 4;
      d[i] = c[0]; d[i + 1] = c[1]; d[i + 2] = c[2]; d[i + 3] = 255;
    }
  }
  s.ctx.putImageData(s.img, 0, 0);
}
function startStatic(canvas) {
  const ctx = canvas.getContext('2d'), s = { ctx, img: ctx.createImageData(160, 100), off: 0, canvas };
  statics.add(s);
  drawNoise(s);
  if (!reduce.matches && !staticRAF) staticRAF = requestAnimationFrame(staticLoop);
  return s;
}
function stopStatic(s) { if (s) statics.delete(s); }
function tune(win, s, done) {
  const loading = win.querySelector('.loading'), body = win.querySelector('.wbody');
  if (reduce.matches) return done();
  if (s) s.tune = true;
  loading.classList.add('tune');
  body.animate([{ transform: 'none' }, { transform: 'translateX(-6px)' }, { transform: 'translateX(5px) skewX(3deg)' }, { transform: 'translateX(-2px)' }, { transform: 'none' }],
    { duration: 300, easing: 'steps(5, end)' });
  const a = loading.animate([{ opacity: 1 }, { opacity: 0.35 }, { opacity: 0.9 }, { opacity: 0.2 }, { opacity: 0 }], { duration: 300, easing: 'steps(5, end)', fill: 'forwards' });
  a.onfinish = () => { done(); a.cancel(); loading.classList.remove('tune'); if (s) s.tune = false; };
}

/* window contents */
const svgIcon = (name) => `<span class="bico">${pix(ART[name])}</span>`;
const svgSlot = (name) => `<span class="sart">${pix(ART[name])}</span>`;
function openProject(p) {
  const host = p.url.replace(/^https?:\/\//, '').replace(/\/$/, '');
  const win = openWin({
    id: p.id, title: p.name, w: 1000, h: 680,
    from: iconEl(p.id),
    icon: `<img src="${p.icon}" alt="">`,
    slotIcon: `<img src="${p.icon}" alt="">`,
    nav: `<div class="nav">
        <button class="nbtn reload" type="button" aria-label="Reload site">↻</button>
        <div class="url" title="${p.url}"><span>https://</span>${host}</div>
        <a class="open" href="${p.url}" target="_blank" rel="noopener" aria-label="Open ${p.name} in a new tab">Open ↗</a>
      </div>`,
    body: `<iframe title="${p.name} website" referrerpolicy="strict-origin-when-cross-origin"></iframe>
      <div class="loading" role="status"><canvas class="static" width="160" height="100" aria-hidden="true"></canvas><p class="pbox">Loading</p></div>
      <div class="fallback" hidden><div class="card pbox">
        <img src="${p.icon}" alt="" width="156" height="156">
        <h2>${p.name}</h2><p>${p.desc}</p>
        <a class="btn pbox" href="${p.url}" target="_blank" rel="noopener">Open site ↗</a>
      </div></div>`,
  });
  if (!win) return;
  const iframe = win.querySelector('iframe'), loading = win.querySelector('.loading'), fb = win.querySelector('.fallback'), canvas = loading.querySelector('canvas');
  let noise = null;
  const endLoad = () => { if (noise) { stopStatic(noise); noise = null; busy(-1); } };
  win._endLoad = endLoad;
  const finish = (fallback) => {
    clearTimeout(win._timer);
    tune(win, noise, () => {
      endLoad();
      loading.hidden = true;
      if (fallback) { fb.hidden = false; iframe.removeAttribute('src'); iframe.hidden = true; }
    });
  };
  const load = () => {
    clearTimeout(win._timer);
    loading.hidden = false;
    fb.hidden = true;
    if (!noise) { noise = startStatic(canvas); busy(1); }
    if (inPreview) { win._timer = setTimeout(() => finish(true), 1100); return; }
    iframe.hidden = false;
    win._timer = setTimeout(() => finish(true), 6000);
    iframe.onload = () => { if (iframe.getAttribute('src') && noise) finish(false); };
    iframe.onerror = () => finish(true);
    iframe.src = p.url;
  };
  win.querySelector('.reload').addEventListener('click', () => { iframe.removeAttribute('src'); load(); });
  load();
}
function openNotes() {
  openWin({ id: 'about', title: 'About me.txt', w: 540, h: 420, from: iconEl('about'), icon: svgIcon('doc'), slotIcon: svgSlot('doc'),
    body: `<div class="notes" tabindex="0"><p>${CONFIG.about}</p></div>` });
}
function openCV() {
  openWin({ id: 'cv', title: 'CV.pdf', w: 420, h: 340, from: iconEl('cv'), icon: svgIcon('pdf'), slotIcon: svgSlot('pdf'),
    body: `<div class="pane"><span class="big">${pix(ART.pdf)}</span><h2>CV.pdf</h2>
      <a class="btn pbox" href="${CONFIG.cv}" target="_blank" rel="noopener" download>Download CV</a></div>` });
}
const trashed = [];
function toTrash(it, prev) {
  if (trashed.includes(it)) return;
  it.restorePos = prev || null;
  trashed.push(it);
  const done = () => { it.el.hidden = true; renderTrash(); };
  if (reduce.matches) return done();
  const a = it.el.getBoundingClientRect(), b = iconEl('trash').getBoundingClientRect();
  const dx = b.left + b.width / 2 - (a.left + a.width / 2), dy = b.top + b.height / 3 - (a.top + a.height / 2);
  it.el.animate(frames((t) => `translate(${(dx * t).toFixed(1)}px, ${(dy * t - Math.sin(Math.PI * t) * 30).toFixed(1)}px) scale(${(1 - 0.85 * t).toFixed(2)})`, 8), { duration: 320 }).onfinish = done;
  sfx.click();
}
function fromTrash(it) {
  const i = trashed.indexOf(it);
  if (i < 0) return;
  trashed.splice(i, 1);
  it.pos[mode] = it.restorePos;
  it.el.hidden = false;
  placeIcon(it);
  renderTrash();
  sfx.click();
  if (!reduce.matches) it.inner.animate(frames((t) => {
    const d = Math.exp(-5 * t) * Math.cos(t * Math.PI * 3.2);
    return `translateY(${(-18 * d).toFixed(1)}px) scale(${(1 - 0.3 * (1 - t) * (1 - t)).toFixed(3)})`;
  }, 14), { duration: 520 });
  announce(it.name + ' restored to the desktop');
}
function trashBody() {
  if (!trashed.length) return `<div class="pane"><span class="big">${pix(ART.trash)}</span><p>The trash is empty. For now.</p></div>`;
  return `<div class="tlist">${trashed.map((it, i) => `<div class="titem"><span class="tthumb">${it.html}</span><span class="tname">${it.name}</span><button class="tback pbox" type="button" data-i="${i}" aria-label="Restore ${it.name} to the desktop" title="Restore"><svg viewBox="0 0 10 9" width="20" height="18" shape-rendering="crispEdges" aria-hidden="true"><path fill="currentColor" d="M3 0h1v1H3zM2 1h2v1H2zM1 2h8v1H1zM0 3h4v1H0zM8 3h2v4H8zM1 4h3v1H1zM2 5h2v1H2zM3 6h1v1H3zM7 6h2v1H7zM3 7h5v1H3z"/></svg></button></div>`).join('')}</div>`;
}
function renderTrash() {
  const w = wins.get('trash');
  iconEl('trash').classList.toggle('full', trashed.length > 0);
  if (!w) return;
  const body = w.querySelector('.wbody');
  body.innerHTML = trashBody();
  body.querySelectorAll('.tback').forEach((b) => b.addEventListener('click', () => fromTrash(trashed[+b.dataset.i])));
}
function openTrash() {
  const fresh = !wins.has('trash');
  openWin({ id: 'trash', title: 'Trash', w: 420, h: 320, from: iconEl('trash'), icon: svgIcon('trash'), slotIcon: svgSlot('trash'),
    body: trashBody() });
  if (fresh) renderTrash();
}
function openAbout() {
  openWin({ id: 'sys', title: 'About Gonzalo OS', w: 420, h: 340, icon: svgIcon('g'), slotIcon: svgSlot('g'),
    body: `<div class="pane"><span class="big">${pix(ART.g)}</span><h2>Gonzalo OS v1.0</h2>
      <p>UX/UI design portfolio</p><p>${new Date().getFullYear()}</p></div>` });
}
function openHelp() {
  openWin({ id: 'help', title: 'How to use', w: 420, h: 240, icon: svgIcon('g'), slotIcon: svgSlot('g'),
    body: `<div class="pane"><p>${(isMobile() || matchMedia('(pointer: coarse)').matches) ? 'Tap to open a project. Drag the icons around.' : 'Double-click to open a project. Drag the icons around.'}</p></div>` });
}
function openMail() {
  const win = openWin({ id: 'mail', title: 'Mail', w: 400, h: 250, dockBtn: dockMail, from: dockMail,
    icon: `<span class="at" aria-hidden="true">@</span>`,
    body: `<div class="mail"><p>Write to me at</p><output class="addr">${CONFIG.mail}</output>
      <button class="btn pbox copy" type="button">Copy email</button><p class="ok" aria-live="polite"></p></div>` });
  if (!win) return;
  const ok = win.querySelector('.ok');
  win.querySelector('.copy').addEventListener('click', async () => {
    let done = false;
    try { await navigator.clipboard.writeText(CONFIG.mail); done = true; } catch (e) {
      const ta = document.createElement('textarea');
      ta.value = CONFIG.mail; ta.setAttribute('readonly', ''); ta.style.position = 'fixed'; ta.style.opacity = '0';
      document.body.appendChild(ta); ta.select();
      try { done = document.execCommand('copy'); } catch (_) {}
      ta.remove();
    }
    ok.textContent = done ? 'Copied!' : 'Select the address and copy it';
  });
}

/* ---------- terminal ---------- */
const PROMPT = 'visitor@gonzalo-os:~$';
function openTerminal() {
  const win = openWin({ id: 'term', title: 'Terminal', w: 640, h: 420, from: iconEl('term'), icon: svgIcon('term'), slotIcon: svgSlot('term'),
    body: `<div class="term"><div class="tout" role="log" aria-live="off"></div>
      <form class="tline" autocomplete="off"><label class="prompt" for="termIn">${PROMPT}</label>
      <input id="termIn" class="tin" type="text" spellcheck="false" autocapitalize="off" aria-label="Terminal command"></form></div>` });
  if (!win) { const w = wins.get('term'); if (w) w.querySelector('.tin').focus(); return; }
  const term = win.querySelector('.term'), out = win.querySelector('.tout'), form = win.querySelector('form'), input = win.querySelector('.tin');
  const hist = [];
  let hi = 0, queue = Promise.resolve();
  input.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') sfx.enter();
    else if (e.key.length === 1 || e.key === 'Backspace') sfx.key();
  });
  const typeLine = (text, cls) => new Promise((res) => {
    const line = document.createElement('div');
    if (cls) line.className = cls;
    out.appendChild(line);
    const fin = () => { term.scrollTop = term.scrollHeight; announce(text); res(); };
    if (reduce.matches) { line.textContent = text; return fin(); }
    let i = 0;
    const step = () => {
      i += Math.max(1, Math.ceil(text.length / 60));
      line.textContent = text.slice(0, i);
      term.scrollTop = term.scrollHeight;
      if ((i & 3) === 1) sfx.key();
      if (i < text.length) setTimeout(step, 14); else fin();
    };
    step();
  });
  const print = (text, cls) => (queue = queue.then(() => typeLine(text, cls)));
  const then = (fn) => (queue = queue.then(fn));
  const echo = (cmd) => { const l = document.createElement('div'); l.className = 'echo'; l.textContent = `${PROMPT} ${cmd}`; out.appendChild(l); term.scrollTop = term.scrollHeight; };
  const findOpen = (n) => {
    const p = CONFIG.projects.find((q) => q.id === n || q.name.toLowerCase() === n);
    if (p) return [p.name, () => openProject(p)];
    const s = { about: ['About me.txt', openNotes], 'about.txt': ['About me.txt', openNotes], cv: ['CV.pdf', openCV], 'cv.pdf': ['CV.pdf', openCV], trash: ['Trash', openTrash], mail: ['Mail', openMail] }[n];
    return s || null;
  };
  const run = (raw) => {
    const cmd = raw.trim();
    echo(cmd);
    if (!cmd) return;
    hist.push(cmd); hi = hist.length;
    const parts = cmd.toLowerCase().split(/\s+/), c = parts[0], arg = parts.slice(1).join(' ');
    switch (c) {
      case 'help': case 'ayuda':
        ['Available commands:', '  projects      list my projects', '  open <name>   open a project (try: open terrace)', '  about         a little about me',
          '  contact       how to reach me', '  date          today’s date and time', '  clear         clear the screen', '  ...and one more, if you have sudo.'].forEach((l) => print(l));
        break;
      case 'projects': case 'proyectos':
        CONFIG.projects.forEach((p) => print(`  ${p.id.padEnd(10)}${p.desc}`));
        print('Type "open terrace" to launch one.');
        break;
      case 'open': case 'abrir': {
        const f = findOpen(arg);
        if (f) { print(`Opening ${f[0]}...`); then(() => f[1]()); }
        else print(`open: "${arg}" not found. Try: ${CONFIG.projects.map((p) => p.id).join(', ')}`, 'err');
        break;
      }
      case 'about': case 'sobre-mi': print(CONFIG.about); break;
      case 'contact': case 'contacto':
        print(`email     ${CONFIG.mail}`); print(`behance   ${CONFIG.behance}`); print(`linkedin  ${CONFIG.linkedin}`);
        break;
      case 'date': case 'fecha':
        print(new Date().toLocaleString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' }));
        break;
      case 'clear': case 'cls': then(() => { out.innerHTML = ''; }); break;
      case 'exit': then(() => closeWin(win)); break;
      case 'sudo':
        if (/^(hire|hire me|contratar)$/.test(arg)) {
          print('[sudo] password for visitor: ********');
          then(() => { sfx.tada(); confetti(win); });
          print(`Permission granted. Write to me: ${CONFIG.mail}`, 'ok');
        } else print('visitor is not in the sudoers file. Nice try.', 'err');
        break;
      default: print(`command not found: ${c}. Type "help".`, 'err');
    }
  };
  form.addEventListener('submit', (e) => { e.preventDefault(); const v = input.value; input.value = ''; run(v); });
  input.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowUp') { e.preventDefault(); hi = Math.max(0, hi - 1); input.value = hist[hi] || ''; }
    else if (e.key === 'ArrowDown') { e.preventDefault(); hi = Math.min(hist.length, hi + 1); input.value = hist[hi] || ''; }
  });
  term.addEventListener('click', () => { if (!getSelection().toString()) input.focus(); });
  print('Gonzalo OS terminal v1.0');
  print('Type "help" to see what I can do.');
  input.focus({ preventScroll: true });
}
function confetti(win) {
  if (reduce.matches) return;
  const c = document.createElement('canvas');
  c.className = 'confetti';
  c.width = Math.ceil(innerWidth / 3); c.height = Math.ceil(innerHeight / 3);
  fxTop.appendChild(c);
  const ctx = c.getContext('2d'), r = win.getBoundingClientRect(), ox = (r.left + r.width / 2) / 3, oy = (r.top + 60) / 3;
  const cols = ['#ff9f86', '#b9adff', '#8f7fe0', '#f6eee3', '#ffd27a'];
  const ps = [...Array(90)].map(() => ({ x: ox, y: oy, vx: (Math.random() - 0.5) * 7, vy: -Math.random() * 6 - 2, c: cols[(Math.random() * cols.length) | 0], s: Math.random() < 0.3 ? 2 : 1 }));
  const start = performance.now();
  let last = 0;
  const loop = (t) => {
    if (t - start > 1900) return c.remove();
    requestAnimationFrame(loop);
    if (t - last < 33) return;
    last = t;
    ctx.clearRect(0, 0, c.width, c.height);
    ps.forEach((p) => { p.vy += 0.32; p.vx *= 0.98; p.x += p.vx; p.y += p.vy; ctx.fillStyle = p.c; ctx.fillRect(Math.round(p.x), Math.round(p.y), p.s, p.s); });
  };
  requestAnimationFrame(loop);
}

/* ---------- easter eggs ---------- */
const KONAMI = ['arrowup', 'arrowup', 'arrowdown', 'arrowdown', 'arrowleft', 'arrowright', 'arrowleft', 'arrowright', 'b', 'a'];
let konamiI = 0;
function toggleDay() {
  const on = desk.classList.toggle('daymode');
  sfx.boop();
  notify(on ? 'Day mode unlocked' : 'Night mode restored', on ? 'Enter the code again to bring the night back.' : '');
}

/* ---------- global ---------- */
const MOD = ['Tab', 'Shift', 'Control', 'Alt', 'Meta', 'CapsLock'];
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    if (openM) { e.preventDefault(); closeMenus(true); return; }
    if (phase === 'off') return;
    if (phase !== 'desk') { e.preventDefault(); skipAll(); return; }
    const w = frontWin();
    if (w) { e.preventDefault(); closeWin(w); }
    return;
  }
  if (phase === 'gate') {
    if (MOD.includes(e.key) || e.target === gateSkip || e.target === gateStart) return;
    e.preventDefault();
    playIntro();
    return;
  }
  if (phase === 'intro') {
    if (MOD.includes(e.key) || e.target === skip) return;
    e.preventDefault();
    zoom();
    return;
  }
  if (phase !== 'desk') return;
  if (!(e.target.matches && e.target.matches('input, textarea'))) {
    const k = e.key.toLowerCase();
    konamiI = k === KONAMI[konamiI] ? konamiI + 1 : k === KONAMI[0] ? 1 : 0;
    if (konamiI === KONAMI.length) { konamiI = 0; toggleDay(); }
  }
  if (!openM && !isMobile() && (e.key === 'ContextMenu' || (e.shiftKey && e.key === 'F10')) && !e.target.closest('.win')) {
    e.preventDefault();
    const a = e.target.closest && e.target.closest('.icon');
    const r = a ? a.getBoundingClientRect() : { left: innerWidth / 2, bottom: innerHeight / 2 };
    openMenu(CTX, { x: r.left, y: r.bottom });
  }
});
document.addEventListener('visibilitychange', () => {
  if (document.hidden) { sceneStop(); pvVid.pause(); sfx.stopHum(); }
  else if (phase === 'desk') { sceneStart(); sfx.startHum(); }
});
let rz;
addEventListener('resize', () => {
  cancelAnimationFrame(rz);
  rz = requestAnimationFrame(() => {
    closeMenus();
    hidePreview();
    placeScreen();
    layout();
    wins.forEach((w) => {
      w.style.left = clamp(w.offsetLeft, -w.offsetWidth + 100, innerWidth - 100) + 'px';
      w.style.top = clamp(w.offsetTop, 34, innerHeight - 44) + 'px';
    });
  });
});

const clock = $('#clock'), dateEl = $('#date');
function tick() {
  const d = new Date();
  clock.textContent = d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false });
  clock.dateTime = d.toISOString();
  dateEl.textContent = d.toLocaleDateString('en-US', { weekday: 'short', day: 'numeric', month: 'short' }).replace(/[.,]/g, '');
  timeOfDay();
}
tick();
setInterval(tick, 10000);

hideDesk();
layout();

/* ---------- background music ---------- */
(() => {
  const bgm = $('#bgm'), btn = $('#music'), topBtn = $('#sound');
  const sliders = [$('#volBottom'), $('#volTop')];
  let on = true, vol = 10, started = false, fade;
  try {
    on = localStorage.getItem('gos-music') !== '0';
    const v = parseInt(localStorage.getItem('gos-vol'), 10);
    if (v >= 0 && v <= 100) vol = v;
  } catch (e) {}
  bgm.volume = 0;
  const target = () => (on ? (vol / 100) * 0.5 : 0);
  const ramp = (to, done) => {
    clearInterval(fade);
    fade = setInterval(() => {
      const d = to - bgm.volume;
      if (Math.abs(d) <= 0.02) { bgm.volume = to; clearInterval(fade); done && done(); }
      else bgm.volume = Math.min(1, Math.max(0, bgm.volume + Math.sign(d) * 0.02));
    }, 40);
  };
  const play = () => {
    if (!on || vol === 0) return;
    bgm.muted = false;
    bgm.play().then(() => {
      started = true;
      if (on && vol > 0) ramp(target()); else { bgm.volume = 0; bgm.pause(); }
    }).catch(() => {});
  };
  const save = () => { try { localStorage.setItem('gos-music', on ? '1' : '0'); localStorage.setItem('gos-vol', String(vol)); } catch (e) {} };
  const paint = () => {
    const audible = on && vol > 0;
    btn.setAttribute('aria-pressed', audible);
    btn.title = btn.ariaLabel = audible ? 'Mute music' : 'Play music';
    topBtn.innerHTML = pix(ART[audible ? 'vol' : 'mute']);
    topBtn.setAttribute('aria-pressed', audible);
    topBtn.title = topBtn.ariaLabel = btn.title;
    sliders.forEach((s) => { if (+s.value !== vol) s.value = vol; s.style.setProperty('--v', vol + '%'); });
  };
  const toggle = (e) => {
    e.stopPropagation();
    // Autoplay was blocked: the button shows "on" but nothing is playing yet. The first click starts the music instead of muting it.
    if (on && vol > 0 && !started && bgm.paused) { play(); return; }
    on = !(on && vol > 0);
    if (on && vol === 0) vol = 10;
    save(); paint();
    if (on) { if (bgm.paused) play(); else ramp(target()); }
    else { clearInterval(fade); bgm.volume = 0; bgm.pause(); }
    bgm.muted = !on;
    if (typeof announce === 'function') announce(on ? 'Music on' : 'Music off');
  };
  btn.addEventListener('click', toggle);
  topBtn.addEventListener('click', toggle);
  sliders.forEach((s) => {
    ['pointerdown', 'click'].forEach((t) => s.addEventListener(t, (e) => e.stopPropagation()));
    s.addEventListener('input', () => {
      vol = +s.value;
      on = vol > 0;
      clearInterval(fade);
      bgm.volume = target();
      if (on && bgm.paused) play();
      if (!on) bgm.pause();
      bgm.muted = !on;
      save(); paint();
    });
  });
  document.querySelectorAll('.vol-wrap').forEach((w) => {
    let idle, out;
    const hide = () => {
      clearTimeout(idle);
      if (!w.classList.contains('vol-on')) return;
      w.classList.add('closing');
      clearTimeout(out);
      out = setTimeout(() => w.classList.remove('vol-on', 'closing'), 220);
    };
    const show = () => {
      clearTimeout(out);
      w.classList.remove('closing');
      w.classList.add('vol-on');
      clearTimeout(idle);
      idle = setTimeout(hide, 5000);
    };
    w.addEventListener('pointerenter', (e) => { if (e.pointerType !== 'touch') show(); });
    w.addEventListener('pointerleave', () => { clearTimeout(idle); idle = setTimeout(hide, 1500); });
    w.addEventListener('focusin', show);
    w.addEventListener('focusout', (e) => { if (!w.contains(e.relatedTarget)) hide(); });
    w.querySelectorAll('input').forEach((s) => ['input', 'pointerdown', 'keydown'].forEach((t) => s.addEventListener(t, show)));
  });
  // Browsers block audio until a real user gesture. Retry on every gesture type until it actually plays.
  const GESTURES = ['pointerdown', 'pointerup', 'mousedown', 'click', 'touchend', 'keydown'];
  const kick = (e) => {
    if (started) return;
    if (e.target && e.target.closest && e.target.closest('.vol-wrap')) return;
    if (on && vol > 0 && bgm.paused) play();
  };
  GESTURES.forEach((t) => addEventListener(t, kick, true));
  bgm.addEventListener('playing', () => { started = true; GESTURES.forEach((t) => removeEventListener(t, kick, true)); });
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) bgm.pause(); else if (on && vol > 0 && started) bgm.play().catch(() => {});
  });
  paint();
  play();
})();

if (reduce.matches || store.get()) showDesk();
else startIntro();
