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
    item.addEventListener('mouseenter', () => {
      if (item.classList.contains('is-active')) return;
      items.forEach(i => i.classList.remove('is-active'));
      item.classList.add('is-active');
      setHeroContent(tabId, item, true);
    });
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
  if (currentY > lastScrollY && currentY > 120) {
    nav.classList.add('nav--hidden');
  } else {
    nav.classList.remove('nav--hidden');
  }
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
