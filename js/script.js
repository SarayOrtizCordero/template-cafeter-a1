// ─── MENU HERO SPLIT LAYOUT ───

function setHeroContent(tabId, item, animate) {
  const hero = document.getElementById('hero-' + tabId);
  if (!hero) return;
  const heroImg   = hero.querySelector('.menu-hero-img');
  const heroTag   = hero.querySelector('.menu-hero-tag');
  const heroName  = hero.querySelector('.menu-hero-name');
  const heroDesc  = hero.querySelector('.menu-hero-desc');
  const heroPrice = hero.querySelector('.menu-hero-price');
  const els = [heroImg, heroTag, heroName, heroDesc, heroPrice];

  const apply = () => {
    heroImg.style.backgroundImage = `url('${item.dataset.img}')`;
    heroTag.textContent   = item.dataset.tag   || '';
    heroName.textContent  = item.dataset.name  || '';
    heroDesc.textContent  = item.dataset.desc  || '';
    heroPrice.textContent = item.dataset.price || '';
  };

  if (animate) {
    els.forEach(el => { el.style.transition = 'opacity 0.2s ease'; el.style.opacity = '0'; });
    setTimeout(() => {
      apply();
      els.forEach(el => { el.style.opacity = ''; });
    }, 210);
  } else {
    apply();
  }
}

function initMenuHero(tabId) {
  const list = document.getElementById('list-' + tabId);
  if (!list || list.dataset.initialized) return;
  list.dataset.initialized = 'true';

  const items = list.querySelectorAll('.menu-list-item');
  if (!items.length) return;

  items[0].classList.add('is-active');
  setHeroContent(tabId, items[0], false);

  items.forEach(item => {
    const activate = () => {
      if (item.classList.contains('is-active')) return;
      items.forEach(i => i.classList.remove('is-active'));
      item.classList.add('is-active');
      setHeroContent(tabId, item, true);
    };
    item.addEventListener('mouseenter', activate);
    item.addEventListener('click', activate);
  });
}

function resetMenuHero(tabId) {
  const list = document.getElementById('list-' + tabId);
  if (!list) return;
  const items = list.querySelectorAll('.menu-list-item');
  items.forEach(i => i.classList.remove('is-active'));
  items[0].classList.add('is-active');
  setHeroContent(tabId, items[0], false);
}

// Init all heroes on load
['cafes', 'panaderia', 'desayunos', 'tortas'].forEach(id => initMenuHero(id));

// ─── TABS WITH SMOOTH TRANSITION ───
function switchTab(tabId, btn) {
  const current = document.querySelector('.tab-panel.active');
  if (current && current.id === 'tab-' + tabId) return;

  document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');

  if (current) {
    current.style.opacity = '0';
    current.style.transform = 'translateY(8px)';
    setTimeout(() => {
      current.classList.remove('active');
      current.style.opacity = '';
      current.style.transform = '';

      const next = document.getElementById('tab-' + tabId);
      next.classList.add('active');
      next.classList.add('tab-fade-in');
      initMenuHero(tabId);
      resetMenuHero(tabId);
      setTimeout(() => next.classList.remove('tab-fade-in'), 350);
    }, 200);
  } else {
    document.getElementById('tab-' + tabId).classList.add('active');
  }
}

// ─── SCROLL REVEAL ───
const reveals = document.querySelectorAll('.reveal');
const observer = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) e.target.classList.add('visible');
  });
}, { threshold: 0.12 });
reveals.forEach(r => observer.observe(r));

// ─── NAVBAR SCROLL ───
const nav = document.querySelector('nav');
let lastScrollY = window.scrollY;

window.addEventListener('scroll', () => {
  const currentY = window.scrollY;
  nav.classList.toggle('nav--scrolled', currentY > 60);
  lastScrollY = currentY;
});

// ─── ACTIVE SECTION INDICATOR ───
const navLinks = document.querySelectorAll('.nav-links a[href^="#"]');
const sectionObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      navLinks.forEach(link => {
        link.classList.toggle('is-active', link.getAttribute('href') === '#' + entry.target.id);
      });
    }
  });
}, { rootMargin: '-30% 0px -60% 0px', threshold: 0 });
document.querySelectorAll('section[id]').forEach(s => sectionObserver.observe(s));

// ─── HAMBURGER MENU ───
const hamburger = document.querySelector('.nav-hamburger');
const mobileNav = document.querySelector('.nav-mobile');

hamburger.addEventListener('click', () => {
  const isOpen = hamburger.classList.toggle('is-open');
  mobileNav.classList.toggle('is-open', isOpen);
  hamburger.setAttribute('aria-expanded', String(isOpen));
  mobileNav.setAttribute('aria-hidden', String(!isOpen));
  document.body.style.overflow = isOpen ? 'hidden' : '';
});

document.querySelectorAll('.nav-mobile a').forEach(link => {
  link.addEventListener('click', () => {
    hamburger.classList.remove('is-open');
    mobileNav.classList.remove('is-open');
    hamburger.setAttribute('aria-expanded', 'false');
    mobileNav.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  });
});

// ─── NEWSLETTER ───
document.querySelector('.nl-btn').addEventListener('click', () => {
  const input = document.querySelector('.nl-input');
  if (input.value && input.value.includes('@')) {
    input.value = '';
    input.placeholder = '¡Gracias por suscribirte! ☕';
    input.style.color = '#c8813a';
  }
});

// ─── #2 PARALLAX ───
(function () {
  const heroImg  = document.querySelector('.hero-img-container');
  const expBoxes = document.querySelectorAll('.exp-img-box');
  const vH = () => window.innerHeight;

  function updateParallax() {
    if (window.innerWidth <= 900) return;
    if (heroImg) {
      const rect = heroImg.closest('#hero').getBoundingClientRect();
      if (rect.bottom > 0 && rect.top < vH()) {
        const progress = -rect.top / vH();
        heroImg.style.backgroundPositionY = `calc(50% + ${progress * 45}px)`;
      }
    }
    expBoxes.forEach(box => {
      const rect = box.getBoundingClientRect();
      if (rect.bottom > 0 && rect.top < vH()) {
        const progress = (vH() - rect.top) / (vH() + rect.height);
        const offset   = (progress - 0.5) * 55;
        box.style.backgroundPositionY = `calc(50% + ${offset}px)`;
      }
    });
  }

  window.addEventListener('scroll', updateParallax, { passive: true });
  updateParallax();
})();

// ─── #9 ZOOM EN IMAGEN DEL MENÚ AL HOVER ───
(function () {
  ['cafes', 'panaderia', 'desayunos', 'tortas'].forEach(tabId => {
    const list    = document.getElementById('list-' + tabId);
    const hero    = document.getElementById('hero-' + tabId);
    if (!list || !hero) return;
    const heroImg = hero.querySelector('.menu-hero-img');
    if (!heroImg) return;

    list.querySelectorAll('.menu-list-item').forEach(item => {
      item.addEventListener('mouseenter', () => heroImg.classList.add('is-zoomed'));
    });
    list.addEventListener('mouseleave', () => heroImg.classList.remove('is-zoomed'));
  });
})();

// ─── #10 LIGHTBOX ───
(function () {
  const lightbox  = document.getElementById('lightbox');
  const lbImg     = document.getElementById('lightboxImg');
  const lbCaption = document.getElementById('lightboxCaption');
  const lbClose   = document.getElementById('lightboxClose');
  const lbPrev    = document.getElementById('lightboxPrev');
  const lbNext    = document.getElementById('lightboxNext');
  if (!lightbox) return;

  const images = [];
  let current  = 0;

  document.querySelectorAll('.exp-img-box[data-src]').forEach((box, i) => {
    images.push({ src: box.dataset.src, caption: box.dataset.caption || '' });
    box.addEventListener('click', () => openLightbox(i));
  });

  function openLightbox(index) {
    current = index;
    lbImg.style.transition = 'none';
    lbImg.style.opacity    = '0';
    lbImg.style.transform  = 'scale(0.95)';
    lbImg.src              = images[index].src;
    lbImg.alt              = images[index].caption;
    lbCaption.textContent  = images[index].caption;
    lightbox.classList.add('is-open');
    document.body.style.overflow = 'hidden';

    requestAnimationFrame(() => requestAnimationFrame(() => {
      lbImg.style.transition = 'opacity 0.38s ease, transform 0.38s ease';
      lbImg.style.opacity    = '1';
      lbImg.style.transform  = 'scale(1)';
    }));
  }

  function closeLightbox() {
    lightbox.classList.remove('is-open');
    document.body.style.overflow = '';
  }

  function navigate(dir) {
    current = (current + dir + images.length) % images.length;
    lbImg.style.transition = 'opacity 0.18s ease';
    lbImg.style.opacity    = '0';
    setTimeout(() => {
      lbImg.src             = images[current].src;
      lbImg.alt             = images[current].caption;
      lbCaption.textContent = images[current].caption;
      lbImg.style.opacity   = '1';
    }, 200);
  }

  lbClose.addEventListener('click', closeLightbox);
  lbPrev.addEventListener('click',  () => navigate(-1));
  lbNext.addEventListener('click',  () => navigate(1));
  lightbox.addEventListener('click', e => { if (e.target === lightbox) closeLightbox(); });
  document.addEventListener('keydown', e => {
    if (!lightbox.classList.contains('is-open')) return;
    if (e.key === 'Escape')      closeLightbox();
    if (e.key === 'ArrowLeft')   navigate(-1);
    if (e.key === 'ArrowRight')  navigate(1);
  });
})();

// ─── #12 INDICADOR ABIERTO / CERRADO ───
(function () {
  const schedule = [
    { open: 9*60,     close: 18*60, closeStr: '18:00' }, // Dom
    { open: 7*60+30,  close: 20*60, closeStr: '20:00' }, // Lun
    { open: 7*60+30,  close: 20*60, closeStr: '20:00' }, // Mar
    { open: 7*60+30,  close: 20*60, closeStr: '20:00' }, // Mié
    { open: 7*60+30,  close: 20*60, closeStr: '20:00' }, // Jue
    { open: 7*60+30,  close: 20*60, closeStr: '20:00' }, // Vie
    { open: 8*60,     close: 21*60, closeStr: '21:00' }, // Sáb
  ];

  const now   = new Date();
  const today = schedule[now.getDay()];
  const mins  = now.getHours() * 60 + now.getMinutes();
  const isOpen = mins >= today.open && mins < today.close;
  const minsLeft = today.close - mins;

  const badge = document.createElement('div');
  badge.className = 'open-status-badge ' + (isOpen ? 'is-open' : 'is-closed');

  let text = isOpen
    ? (minsLeft <= 60
        ? `<span class="status-dot"></span> Abierto · Cerramos en ${minsLeft} min`
        : `<span class="status-dot"></span> Abierto ahora · Cerramos a las ${today.closeStr}`)
    : `<span class="status-dot"></span> Cerrado ahora`;

  badge.innerHTML = text;

  const hoursTable = document.querySelector('.contact-info .hours-table');
  if (hoursTable) hoursTable.parentNode.insertBefore(badge, hoursTable);
})();

// ─── #16 RIPPLE EN BOTONES ───
document.querySelectorAll('.nl-btn, .btn-primary').forEach(btn => {
  btn.addEventListener('click', function (e) {
    const rect   = this.getBoundingClientRect();
    const ripple = document.createElement('span');
    ripple.className    = 'ripple';
    ripple.style.left   = (e.clientX - rect.left  - 5) + 'px';
    ripple.style.top    = (e.clientY - rect.top   - 5) + 'px';
    this.appendChild(ripple);
    setTimeout(() => ripple.remove(), 650);
  });
});
