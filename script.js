/* ════════════════════════════════════════
   GLACERIE D'ARLON — script.js
   Scroll animations · Parallax · Nav
════════════════════════════════════════ */

'use strict';

// ── 1. NAV : scroll shadow + toggle mobile ──
const navbar = document.getElementById('navbar');
const navMobile = document.getElementById('navMobile');
let navOpen = false;

window.addEventListener('scroll', () => {
  if (window.scrollY > 20) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }
}, { passive: true });

function toggleNav() {
  navOpen = !navOpen;
  navMobile.classList.toggle('open', navOpen);
}

// Ferme le menu mobile si on clique en dehors
document.addEventListener('click', (e) => {
  if (navOpen && !navbar.contains(e.target)) {
    navOpen = false;
    navMobile.classList.remove('open');
  }
});

// ── 2. SCROLL REVEAL (IntersectionObserver) ──
const revealEls = document.querySelectorAll('.reveal');

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target); // fire une seule fois
    }
  });
}, {
  threshold: 0.12,
  rootMargin: '0px 0px -40px 0px'
});

revealEls.forEach((el) => revealObserver.observe(el));

// ── 3. PARALLAX LÉGER SUR LE HERO ──
const heroBg   = document.getElementById('heroBg');
const heroIce  = document.getElementById('heroIce');
const hero     = document.getElementById('hero');

let heroH = hero ? hero.offsetHeight : window.innerHeight;

window.addEventListener('resize', () => {
  heroH = hero ? hero.offsetHeight : window.innerHeight;
}, { passive: true });

window.addEventListener('scroll', () => {
  const scrollY = window.scrollY;
  if (scrollY > heroH) return; // on arrête au-delà du hero

  // Fond : défile plus lentement (effet profondeur)
  if (heroBg) {
    heroBg.style.transform = `translateY(${scrollY * 0.35}px)`;
  }
  // Illustration glace : défile légèrement différemment
  if (heroIce) {
    heroIce.style.transform = `translateY(calc(-50% + ${scrollY * -0.12}px))`;
  }
}, { passive: true });

// ── 4. SCALE DOUX SUR LES CARTES GALERIE au hover ──
// (géré en CSS, mais on ajoute un listener pour un effet de profondeur 3D subtil)
const galItems = document.querySelectorAll('.galerie-item');

galItems.forEach((item) => {
  item.addEventListener('mousemove', (e) => {
    const rect = item.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width  - 0.5) * 10;
    const y = ((e.clientY - rect.top)  / rect.height - 0.5) * 10;
    item.style.transform = `perspective(600px) rotateY(${x}deg) rotateX(${-y}deg) scale(1.03)`;
  });

  item.addEventListener('mouseleave', () => {
    item.style.transform = '';
    item.style.transition = 'transform 0.45s ease';
    setTimeout(() => { item.style.transition = ''; }, 450);
  });
});

// ── 5. SMOOTH SCROLL pour les ancres ──
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener('click', (e) => {
    const target = document.querySelector(anchor.getAttribute('href'));
    if (!target) return;
    e.preventDefault();
    const offset = parseInt(getComputedStyle(document.documentElement)
      .getPropertyValue('--nav-h')) || 68;
    const top = target.getBoundingClientRect().top + window.scrollY - offset;
    window.scrollTo({ top, behavior: 'smooth' });
  });
});

// ── 6. STAGGER des cartes parfums au reveal ──
// Les cards ont déjà --delay via inline style, mais on s'assure
// que l'observer les déclenche dans l'ordre
const parfumCards = document.querySelectorAll('.parfum-card');
const cardObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      cardObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.08, rootMargin: '0px 0px -30px 0px' });

parfumCards.forEach((card) => cardObserver.observe(card));
