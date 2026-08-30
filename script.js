/* ============================================
   NAVBAR — scroll state
   ============================================ */
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 20);
}, { passive: true });

/* ============================================
   HAMBURGER MENU
   ============================================ */
const hamburger = document.getElementById('hamburger');
const navLinks  = document.getElementById('nav-links');

hamburger.addEventListener('click', () => {
  const open = navLinks.classList.toggle('open');
  hamburger.classList.toggle('open', open);
  hamburger.setAttribute('aria-expanded', open);
});

// Close menu when a link is tapped
navLinks.querySelectorAll('.nav-link').forEach(link => {
  link.addEventListener('click', () => {
    navLinks.classList.remove('open');
    hamburger.classList.remove('open');
    hamburger.setAttribute('aria-expanded', false);
  });
});

/* ============================================
   SCROLL REVEAL
   ============================================ */
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      // Stagger children inside the same parent
      const siblings = Array.from(
        entry.target.parentElement.querySelectorAll('.reveal:not(.visible)')
      );
      const idx = siblings.indexOf(entry.target);
      const delay = Math.min(idx * 60, 300);

      setTimeout(() => {
        entry.target.classList.add('visible');
      }, delay);

      revealObserver.unobserve(entry.target);
    }
  });
}, {
  threshold: 0.1,
  rootMargin: '0px 0px -40px 0px'
});

document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

/* ============================================
   HERO GRID CANVAS
   ============================================ */
(function () {
  const canvas = document.getElementById('grid-canvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let width, height, cols, rows;
  let cells = [];
  let animFrame;

  const CELL  = 48;
  const COLOR = '#4f8ef7';

  function resize() {
    width  = canvas.width  = canvas.offsetWidth;
    height = canvas.height = canvas.offsetHeight;
    cols = Math.ceil(width  / CELL) + 1;
    rows = Math.ceil(height / CELL) + 1;
    buildCells();
  }

  function buildCells() {
    cells = [];
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        cells.push({
          x: c * CELL,
          y: r * CELL,
          alpha: Math.random() * 0.12,
          speed: 0.001 + Math.random() * 0.003,
          phase: Math.random() * Math.PI * 2,
        });
      }
    }
  }

  function draw(t) {
    ctx.clearRect(0, 0, width, height);

    // Draw grid lines
    ctx.strokeStyle = 'rgba(255,255,255,0.03)';
    ctx.lineWidth = 1;

    for (let c = 0; c <= cols; c++) {
      ctx.beginPath();
      ctx.moveTo(c * CELL, 0);
      ctx.lineTo(c * CELL, height);
      ctx.stroke();
    }
    for (let r = 0; r <= rows; r++) {
      ctx.beginPath();
      ctx.moveTo(0, r * CELL);
      ctx.lineTo(width, r * CELL);
      ctx.stroke();
    }

    // Animated glowing dots at intersections
    cells.forEach(cell => {
      const a = (Math.sin(t * cell.speed + cell.phase) + 1) / 2;
      const alpha = a * 0.35;
      if (alpha < 0.02) return;
      ctx.beginPath();
      ctx.arc(cell.x, cell.y, 1.5, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(79,142,247,${alpha})`;
      ctx.fill();
    });

    animFrame = requestAnimationFrame(draw);
  }

  // Only run if user hasn't requested reduced motion
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (!prefersReduced) {
    resize();
    window.addEventListener('resize', resize, { passive: true });
    animFrame = requestAnimationFrame(draw);
  } else {
    canvas.style.display = 'none';
  }
})();

/* ============================================
   ACTIVE NAV LINK ON SCROLL
   ============================================ */
const sections  = document.querySelectorAll('section[id]');
const navAnchors = document.querySelectorAll('.nav-link');

const sectionObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      navAnchors.forEach(a => {
        a.style.color = a.getAttribute('href') === `#${entry.target.id}`
          ? 'var(--text)'
          : '';
      });
    }
  });
}, { rootMargin: '-40% 0px -55% 0px' });

sections.forEach(s => sectionObserver.observe(s));
