/* ═══════════════════════════════════════════════
   HOME CREATION360 — JAVASCRIPT
   DLife-inspired Interior Design Website
═══════════════════════════════════════════════ */
'use strict';

/* ── 1. LOADER ── */
window.addEventListener('load', () => {
  const loader = document.getElementById('loader');
  setTimeout(() => {
    loader.classList.add('gone');
    // Trigger hero text reveals after loader hides
    document.querySelectorAll('.rev-h').forEach((el, i) => {
      setTimeout(() => el.classList.add('visible'), 200 + i * 120);
    });
  }, 2000);
});

/* ── 2. NAVBAR ── */
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 60);
}, { passive: true });

/* Hamburger */
const ham = document.getElementById('hamburger');
const nav = document.getElementById('navLinks');
ham.addEventListener('click', () => {
  ham.classList.toggle('open');
  nav.classList.toggle('open');
  document.body.style.overflow = nav.classList.contains('open') ? 'hidden' : '';
});
nav.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
  ham.classList.remove('open');
  nav.classList.remove('open');
  document.body.style.overflow = '';
}));

/* ── 3. SMOOTH SCROLL ── */
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const t = document.querySelector(a.getAttribute('href'));
    if (t) {
      e.preventDefault();
      const navH = navbar.offsetHeight;
      const topbarH = document.querySelector('.topbar')?.offsetHeight || 0;
      window.scrollTo({ top: t.getBoundingClientRect().top + window.scrollY - navH, behavior: 'smooth' });
    }
  });
});

/* ── 4. REVEAL ON SCROLL ── */
const revEls = document.querySelectorAll('.reveal');

// Stagger grid children
document.querySelectorAll('.pkg-grid, .svc-grid, .why-grid').forEach(grid => {
  grid.querySelectorAll('.reveal').forEach((el, i) => {
    el.style.transitionDelay = `${i * 90}ms`;
  });
});

const ro = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) { e.target.classList.add('visible'); ro.unobserve(e.target); }
  });
}, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });
revEls.forEach(el => ro.observe(el));

// Also observe hero reveal elements (class rev-h) with same observer — after loader
document.querySelectorAll('.rev-h').forEach(el => {
  el.style.opacity = '0';
  el.style.transform = 'translateY(32px)';
  el.style.transition = 'opacity .75s cubic-bezier(0.22,1,0.36,1), transform .75s cubic-bezier(0.22,1,0.36,1)';
  el.classList.add = (cls) => {
    if (cls === 'visible') {
      el.style.opacity = '1'; el.style.transform = 'translateY(0)';
    }
    HTMLElement.prototype.classList.add.call(el, cls);
  };
});

/* ── 5. HERO SLIDESHOW ── */
const slides = document.querySelectorAll('.h-slide');
const hdots  = document.querySelectorAll('.hdot');
let cur = 0, slideTimer;

function goSlide(n) {
  slides[cur].classList.remove('active');
  hdots[cur].classList.remove('active');
  cur = (n + slides.length) % slides.length;
  slides[cur].classList.add('active');
  hdots[cur].classList.add('active');
}
function nextSlide() { goSlide(cur + 1); }
function resetSlideTimer() {
  clearInterval(slideTimer);
  slideTimer = setInterval(nextSlide, 5000);
}
hdots.forEach(d => d.addEventListener('click', () => { goSlide(+d.dataset.i); resetSlideTimer(); }));
resetSlideTimer();

/* ── 6. SCROLL-TO-TOP ── */
const stb = document.getElementById('stb');
window.addEventListener('scroll', () => stb.classList.toggle('show', window.scrollY > 500), { passive: true });
stb.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

/* ── 7. GALLERY FILTER ── */
const gbs  = document.querySelectorAll('.gb');
const gis  = document.querySelectorAll('.gi');
gbs.forEach(b => b.addEventListener('click', () => {
  gbs.forEach(x => x.classList.remove('active'));
  b.classList.add('active');
  const f = b.dataset.f;
  gis.forEach(g => {
    const match = f === 'all' || g.dataset.f === f;
    g.style.opacity   = match ? '1'  : '0.18';
    g.style.transform = match ? 'scale(1)' : 'scale(0.96)';
    g.style.pointerEvents = match ? 'all' : 'none';
    g.style.transition = 'opacity .4s, transform .4s';
  });
}));

/* ── 8. TESTIMONIALS SLIDER ── */
const tslider = document.getElementById('tslider');
const tcards  = tslider.querySelectorAll('.tc');
const tdots   = document.getElementById('tdots');
let tCur = 0, tTimer;

function tVisible() {
  if (window.innerWidth <= 640) return 1;
  if (window.innerWidth <= 900) return 2;
  return 3;
}
function tMax() { return Math.max(0, tcards.length - tVisible()); }
function tCardW() { return tcards[0].offsetWidth + 24; }

function tBuildDots() {
  tdots.innerHTML = '';
  for (let i = 0; i <= tMax(); i++) {
    const d = document.createElement('button');
    d.className = 'tdot' + (i === tCur ? ' active' : '');
    d.addEventListener('click', () => { tGo(i); tReset(); });
    tdots.appendChild(d);
  }
}
function tUpdateDots() {
  tdots.querySelectorAll('.tdot').forEach((d, i) => d.classList.toggle('active', i === tCur));
}
function tGo(n) {
  tCur = Math.max(0, Math.min(n, tMax()));
  tslider.style.transform = `translateX(-${tCur * tCardW()}px)`;
  tUpdateDots();
}
function tReset() {
  clearInterval(tTimer);
  tTimer = setInterval(() => tGo(tCur >= tMax() ? 0 : tCur + 1), 4500);
}
document.getElementById('tprev').addEventListener('click', () => { tGo(tCur - 1); tReset(); });
document.getElementById('tnext').addEventListener('click', () => { tGo(tCur + 1); tReset(); });

// Touch swipe
let tx = 0;
tslider.addEventListener('touchstart', e => tx = e.touches[0].clientX, { passive: true });
tslider.addEventListener('touchend', e => {
  const d = tx - e.changedTouches[0].clientX;
  if (Math.abs(d) > 50) { d > 0 ? tGo(tCur + 1) : tGo(tCur - 1); tReset(); }
});

tBuildDots(); tReset();
window.addEventListener('resize', () => { tGo(0); tBuildDots(); });

/* ── 9. CONTACT FORM ── */
const cform  = document.getElementById('cform');
const csucc  = document.getElementById('csucc');
cform.addEventListener('submit', e => {
  e.preventDefault();
  const n = document.getElementById('cn').value.trim();
  const p = document.getElementById('cp').value.trim();
  const em = document.getElementById('ce').value.trim();
  if (!n || !p || !em || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(em)) {
    cform.animate([
      {transform:'translateX(0)'},{transform:'translateX(-8px)'},
      {transform:'translateX(8px)'},{transform:'translateX(-6px)'},
      {transform:'translateX(6px)'},{transform:'translateX(0)'}
    ], { duration: 380 });
    return;
  }
  const btn = cform.querySelector('.sbtn');
  btn.textContent = 'Sending…';
  btn.disabled = true;
  setTimeout(() => {
    cform.reset();
    btn.innerHTML = 'Send Enquiry <i class="ri-send-plane-line"></i>';
    btn.disabled = false;
    csucc.classList.add('show');
    setTimeout(() => csucc.classList.remove('show'), 5000);
  }, 1400);
});

/* ── 10. HERO FORM — prevent real submit ── */
document.querySelector('.hero-form .btn-gold')?.addEventListener('click', e => {
  e.preventDefault();
  document.getElementById('contact').scrollIntoView({ behavior: 'smooth', block: 'start' });
});

/* ── 11. ACTIVE NAV SECTION HIGHLIGHT ── */
const secEls   = document.querySelectorAll('section[id]');
const navAs    = document.querySelectorAll('.nav-links a[href^="#"]');
const secObsv  = new IntersectionObserver(entries => {
  entries.forEach(en => {
    if (en.isIntersecting) {
      const id = en.target.id;
      navAs.forEach(a => a.classList.toggle('nav-active', a.getAttribute('href') === `#${id}`));
    }
  });
}, { rootMargin: '-50% 0px -50% 0px' });
secEls.forEach(s => secObsv.observe(s));

// Style for active nav link
const navActiveStyle = document.createElement('style');
navActiveStyle.textContent = `.nav-links a.nav-active{color:var(--gold-lt)!important}.nav-links a.nav-active::after{width:100%!important}`;
document.head.appendChild(navActiveStyle);

/* ── 12. PARALLAX on hero background ── */
const hslide0 = document.querySelector('.h-slide.active');
window.addEventListener('scroll', () => {
  if (window.scrollY < window.innerHeight) {
    const activeSlide = document.querySelector('.h-slide.active');
    if (activeSlide) activeSlide.style.transform = `scale(1.06) translateY(${window.scrollY * 0.15}px)`;
  }
}, { passive: true });

/* ── 13. STICKY NAV COLOR when inside dark section ── */
// Already always dark — nothing needed

/* END */
