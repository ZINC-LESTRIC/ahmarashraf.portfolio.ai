/* ===== Mobile Hamburger Menu ===== */
const hamburger = document.getElementById('hamburger');
const navLinks = document.getElementById('navLinks');

hamburger.addEventListener('click', () => {
  hamburger.classList.toggle('active');
  navLinks.classList.toggle('open');
  document.body.style.overflow = navLinks.classList.contains('open') ? 'hidden' : '';
});

// Close menu when a nav link is clicked
navLinks.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    hamburger.classList.remove('active');
    navLinks.classList.remove('open');
    document.body.style.overflow = '';
  });
});

// Close menu on outside click
document.addEventListener('click', (e) => {
  if (
    navLinks.classList.contains('open') &&
    !navLinks.contains(e.target) &&
    !hamburger.contains(e.target)
  ) {
    hamburger.classList.remove('active');
    navLinks.classList.remove('open');
    document.body.style.overflow = '';
  }
});

/* ===== Intersection Observer — Scroll Animations ===== */
const revealElements = document.querySelectorAll('.reveal');

const observerOptions = {
  root: null,
  rootMargin: '0px 0px -50px 0px',
  threshold: 0.08
};

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      // Keep observing siblings so stagger still works if multiple enter together
      // but unobserve this one after reveal
      revealObserver.unobserve(entry.target);
    }
  });
}, observerOptions);

revealElements.forEach(el => revealObserver.observe(el));

/* ===== Navbar border on scroll ===== */
const navbar = document.getElementById('navbar');

window.addEventListener('scroll', () => {
  if (window.scrollY > 10) {
    navbar.style.borderBottomColor = 'rgba(34, 34, 34, 0.95)';
  } else {
    navbar.style.borderBottomColor = '';
  }
}, { passive: true });
