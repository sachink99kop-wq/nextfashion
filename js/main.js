// Next Fashion Apparels — shared site scripts

// Mobile menu toggle
const menuBtn = document.getElementById('menu-btn');
const mobileMenu = document.getElementById('mobile-menu');
if (menuBtn && mobileMenu) {
  menuBtn.addEventListener('click', () => {
    const open = mobileMenu.classList.toggle('hidden') === false;
    menuBtn.setAttribute('aria-expanded', String(open));
  });
}

// Sewing-thread scroll progress bar (needle stitches across as you scroll)
const thread = document.createElement('div');
thread.id = 'thread-progress';
document.body.appendChild(thread);
window.addEventListener('scroll', () => {
  const max = document.documentElement.scrollHeight - window.innerHeight;
  thread.style.width = `${max > 0 ? (window.scrollY / max) * 100 : 0}%`;
}, { passive: true });

// Header: compact shadow state after scrolling
const header = document.querySelector('header');
if (header) {
  window.addEventListener('scroll', () => {
    header.classList.toggle('scrolled', window.scrollY > 60);
  }, { passive: true });
}

// Nav links: growing-underline effect (desktop links only, not the CTA pill)
document.querySelectorAll('header nav a').forEach((a) => {
  if (!a.className.includes('bg-accent')) a.classList.add('nav-link');
});

// Scroll-reveal animations — staggered per section like the reference sites
document.querySelectorAll('.reveal').forEach((el) => {
  const siblings = el.parentElement ? [...el.parentElement.children].filter((c) => c.classList.contains('reveal')) : [el];
  const idx = siblings.indexOf(el);
  el.style.setProperty('--reveal-delay', `${Math.min(idx, 5) * 0.1}s`);
});
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.15 });
document.querySelectorAll('.reveal').forEach((el) => revealObserver.observe(el));

// Animated counters (stats)
const counterObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (!entry.isIntersecting) return;
    const el = entry.target;
    const target = parseInt(el.dataset.target, 10);
    const duration = 1600;
    const start = performance.now();
    const format = (n) => n.toLocaleString('en-IN');
    const tick = (now) => {
      const progress = Math.min((now - start) / duration, 1);
      el.textContent = format(Math.round(target * (1 - Math.pow(1 - progress, 3))));
      if (progress < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
    counterObserver.unobserve(el);
  });
}, { threshold: 0.5 });
document.querySelectorAll('.counter').forEach((el) => counterObserver.observe(el));

// Hero background slider
const slides = document.querySelectorAll('#hero-slider .hero-slide');
if (slides.length > 1) {
  let current = 0;
  setInterval(() => {
    slides[current].classList.replace('opacity-40', 'opacity-0');
    current = (current + 1) % slides.length;
    slides[current].classList.replace('opacity-0', 'opacity-40');
  }, 5000);
}

// Back-to-top button
const toTop = document.getElementById('to-top');
if (toTop) {
  window.addEventListener('scroll', () => {
    const show = window.scrollY > 400;
    toTop.classList.toggle('opacity-0', !show);
    toTop.classList.toggle('pointer-events-none', !show);
  }, { passive: true });
  toTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
}

// Gallery lightbox
const lightbox = document.getElementById('lightbox');
const lightboxImg = document.getElementById('lightbox-img');
if (lightbox && lightboxImg) {
  document.querySelectorAll('.gallery-img').forEach((img) => {
    img.addEventListener('click', () => {
      lightboxImg.src = img.src;
      lightbox.classList.remove('hidden');
      lightbox.classList.add('flex');
    });
  });
  lightbox.addEventListener('click', () => {
    lightbox.classList.add('hidden');
    lightbox.classList.remove('flex');
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') lightbox.click();
  });
}

// Footer year
const yearEl = document.getElementById('year');
if (yearEl) yearEl.textContent = new Date().getFullYear();

// Product category filter (products page)
const filterBtns = document.querySelectorAll('.filter-btn');
if (filterBtns.length) {
  filterBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      filterBtns.forEach((b) => b.classList.remove('bg-brand-800', 'text-white'));
      btn.classList.add('bg-brand-800', 'text-white');
      const cat = btn.dataset.filter;
      document.querySelectorAll('.product-card').forEach((card) => {
        card.classList.toggle('hidden', cat !== 'all' && card.dataset.category !== cat);
      });
    });
  });
}

// 360° circular product showroom (products page)
const ringStage = document.getElementById('circular-gallery');
if (ringStage) {
  const ring = ringStage.querySelector('.ring');
  const cards = [...ring.children];
  const step = 360 / cards.length;
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  let autoAngle = 0;
  let scrollAngle = 0;
  let dragAngle = 0;
  let hovering = false;
  let dragging = false;
  let lastPointerX = 0;

  // Radius adapts to viewport so the ring never overflows on phones
  const ringRadius = () => Math.min(560, Math.max(260, window.innerWidth * 0.36));
  let radius = ringRadius();

  const placeCards = () => {
    cards.forEach((card, i) => {
      card.style.transform = `rotateY(${i * step}deg) translateZ(${radius}px)`;
    });
  };
  placeCards();
  window.addEventListener('resize', () => {
    radius = ringRadius();
    placeCards();
  });

  // Page scroll contributes to the rotation, like the reference
  window.addEventListener('scroll', () => {
    const max = document.documentElement.scrollHeight - window.innerHeight;
    scrollAngle = max > 0 ? (window.scrollY / max) * 360 : 0;
  }, { passive: true });

  // Drag (mouse or touch) to spin the ring manually
  ringStage.addEventListener('pointerdown', (e) => {
    dragging = true;
    lastPointerX = e.clientX;
    ringStage.classList.add('dragging');
    ringStage.setPointerCapture(e.pointerId);
  });
  ringStage.addEventListener('pointermove', (e) => {
    if (!dragging) return;
    dragAngle += (e.clientX - lastPointerX) * 0.25;
    lastPointerX = e.clientX;
  });
  const stopDrag = () => {
    dragging = false;
    ringStage.classList.remove('dragging');
  };
  ringStage.addEventListener('pointerup', stopDrag);
  ringStage.addEventListener('pointercancel', stopDrag);
  ringStage.addEventListener('mouseenter', () => { hovering = true; });
  ringStage.addEventListener('mouseleave', () => { hovering = false; });

  const spin = () => {
    if (!hovering && !dragging && !reducedMotion) autoAngle += 0.06;
    const total = autoAngle + scrollAngle + dragAngle;
    ring.style.transform = `rotateY(${total}deg)`;
    // Cards fade the further they turn from the front of the ring,
    // and vanish completely while passing edge-on (~90deg) — an
    // edge-on 3D layer otherwise renders as a thin bright line.
    cards.forEach((card, i) => {
      const rel = ((i * step + total) % 360 + 360) % 360;
      const fromFront = rel > 180 ? 360 - rel : rel;
      const base = Math.max(0.25, 1 - fromFront / 200);
      const edgeFade = Math.min(1, Math.abs(fromFront - 90) / 15);
      const opacity = base * edgeFade;
      card.style.opacity = opacity.toFixed(3);
      card.style.visibility = opacity < 0.02 ? 'hidden' : 'visible';
    });
    requestAnimationFrame(spin);
  };
  requestAnimationFrame(spin);
}

// Contact form → opens the visitor's mail client with a pre-filled enquiry
const contactForm = document.getElementById('contact-form');
if (contactForm) {
  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const data = new FormData(contactForm);
    const subject = encodeURIComponent(`Website Enquiry — ${data.get('subject') || 'General'}`);
    const body = encodeURIComponent(
      `Name: ${data.get('name')}\nPhone: ${data.get('phone')}\nEmail: ${data.get('email')}\n\n${data.get('message')}`
    );
    window.location.href = `mailto:mogali@nextfashion.in?subject=${subject}&body=${body}`;
    const note = document.getElementById('form-note');
    if (note) note.classList.remove('hidden');
  });
}
