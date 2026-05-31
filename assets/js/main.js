/* ============================================================
   main.js — Rifaq Ajmal Portfolio (Light Theme)
   ============================================================ */

/* ── 1. PRELOADER ─────────────────────────────────────────── */
window.addEventListener('load', () => {
  const preloader = document.getElementById('preloader');
  if (preloader) {
    setTimeout(() => {
      preloader.classList.add('hidden');
      setTimeout(() => preloader.remove(), 600);
    }, 1200);
  }
});

/* ── 2. NAVBAR ────────────────────────────────────────────── */
const navbar = document.getElementById('navbar');
const hamburger = document.getElementById('hamburger');
const navMenu = document.getElementById('nav-menu');
const navLinks = document.querySelectorAll('.nav-link');

window.addEventListener('scroll', () => {
  if (window.scrollY > 50) navbar.classList.add('scrolled');
  else navbar.classList.remove('scrolled');
  highlightActiveNav();
  toggleBackToTop();
});

if (hamburger) {
  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navMenu.classList.toggle('open');
    document.body.classList.toggle('no-scroll');
  });
}

navLinks.forEach(link => {
  link.addEventListener('click', () => {
    hamburger.classList.remove('active');
    navMenu.classList.remove('open');
    document.body.classList.remove('no-scroll');
  });
});

function highlightActiveNav() {
  const sections = document.querySelectorAll('section[id]');
  const scrollPos = window.scrollY + 100;
  sections.forEach(section => {
    const top = section.offsetTop;
    const bottom = top + section.offsetHeight;
    const id = section.getAttribute('id');
    const link = document.querySelector(`.nav-link[href="#${id}"]`);
    if (link) {
      if (scrollPos >= top && scrollPos < bottom) {
        navLinks.forEach(l => l.classList.remove('active'));
        link.classList.add('active');
      }
    }
  });
}

/* ── 3. TYPING ANIMATION ──────────────────────────────────── */
const typingEl = document.getElementById('typing-text');
const typingWords = [
  'Full Stack Web Developer',
  'Flutter App Developer',
  'PHP & MySQL Expert',
  'Python Developer',
  'UI/UX Enthusiast'
];
let wordIndex = 0, charIndex = 0, isDeleting = false, typingDelay = 100;

function typeEffect() {
  if (!typingEl) return;
  const currentWord = typingWords[wordIndex];
  if (isDeleting) {
    typingEl.textContent = currentWord.substring(0, charIndex - 1);
    charIndex--; typingDelay = 50;
  } else {
    typingEl.textContent = currentWord.substring(0, charIndex + 1);
    charIndex++; typingDelay = 100;
  }
  if (!isDeleting && charIndex === currentWord.length) { typingDelay = 1800; isDeleting = true; }
  else if (isDeleting && charIndex === 0) { isDeleting = false; wordIndex = (wordIndex + 1) % typingWords.length; typingDelay = 400; }
  setTimeout(typeEffect, typingDelay);
}

document.addEventListener('DOMContentLoaded', () => setTimeout(typeEffect, 1500));

/* ── 4. PARTICLES — light theme (subtle purple dots) ─────── */
function initParticles() {
  const canvas = document.getElementById('particles-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let particles = [];

  function resize() { canvas.width = window.innerWidth; canvas.height = window.innerHeight; }
  resize();
  window.addEventListener('resize', resize);

  class Particle {
    constructor() { this.reset(); }
    reset() {
      this.x = Math.random() * canvas.width;
      this.y = Math.random() * canvas.height;
      this.size = Math.random() * 2 + 0.5;
      this.speedX = (Math.random() - 0.5) * 0.3;
      this.speedY = (Math.random() - 0.5) * 0.3;
      this.opacity = Math.random() * 0.3 + 0.05;
      this.color = Math.random() > 0.5 ? '168, 85, 247' : '124, 58, 237';
    }
    update() {
      this.x += this.speedX; this.y += this.speedY;
      if (this.x < 0 || this.x > canvas.width || this.y < 0 || this.y > canvas.height) this.reset();
    }
    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${this.color}, ${this.opacity})`;
      ctx.fill();
    }
  }

  for (let i = 0; i < 60; i++) particles.push(new Particle());

  function connectParticles() {
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 100) {
          ctx.beginPath();
          ctx.strokeStyle = `rgba(168, 85, 247, ${0.06 * (1 - dist / 100)})`;
          ctx.lineWidth = 0.5;
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.stroke();
        }
      }
    }
  }

  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach(p => { p.update(); p.draw(); });
    connectParticles();
    requestAnimationFrame(animate);
  }
  animate();
}

document.addEventListener('DOMContentLoaded', initParticles);

/* ── 5. SCROLL REVEAL ─────────────────────────────────────── */
function initScrollReveal() {
  const revealEls = document.querySelectorAll('[data-reveal]');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -60px 0px' });
  revealEls.forEach(el => observer.observe(el));
}
document.addEventListener('DOMContentLoaded', initScrollReveal);

/* ── 6. COUNT-UP STATS ────────────────────────────────────── */
function countUp(el, target, duration = 1800) {
  let start = 0;
  const increment = target / (duration / 16);
  const suffix = el.dataset.suffix || '';
  const timer = setInterval(() => {
    start += increment;
    if (start >= target) { el.textContent = target + suffix; clearInterval(timer); }
    else el.textContent = Math.floor(start) + suffix;
  }, 16);
}

function initCountUp() {
  const statNumbers = document.querySelectorAll('.stat-number[data-count]');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !entry.target.classList.contains('counted')) {
        entry.target.classList.add('counted');
        countUp(entry.target, parseInt(entry.target.dataset.count));
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });
  statNumbers.forEach(el => observer.observe(el));
}
document.addEventListener('DOMContentLoaded', initCountUp);

/* ── 7. PROJECT IMAGE SLIDERS ─────────────────────────────── */
function initSliders() {
  const sliders = document.querySelectorAll('.project-slider');
  sliders.forEach(slider => {
    const slides = slider.querySelectorAll('.slide');
    const prevBtn = slider.closest('.project-card').querySelector('.slider-prev');
    const nextBtn = slider.closest('.project-card').querySelector('.slider-next');
    const dotsContainer = slider.closest('.project-card').querySelector('.slider-dots');
    if (!slides.length) return;

    let current = 0, autoPlay;

    if (dotsContainer) {
      slides.forEach((_, i) => {
        const dot = document.createElement('span');
        dot.classList.add('dot');
        if (i === 0) dot.classList.add('active');
        dot.addEventListener('click', () => goTo(i));
        dotsContainer.appendChild(dot);
      });
    }

    function goTo(index) {
      slides[current].classList.remove('active');
      updateDot(current, false);
      current = (index + slides.length) % slides.length;
      slides[current].classList.add('active');
      updateDot(current, true);
    }

    function updateDot(index, state) {
      if (dotsContainer) {
        const dots = dotsContainer.querySelectorAll('.dot');
        if (dots[index]) dots[index].classList.toggle('active', state);
      }
    }

    if (prevBtn) prevBtn.addEventListener('click', () => { goTo(current - 1); resetAuto(); });
    if (nextBtn) nextBtn.addEventListener('click', () => { goTo(current + 1); resetAuto(); });

    function startAuto() { autoPlay = setInterval(() => goTo(current + 1), 3500); }
    function resetAuto() { clearInterval(autoPlay); startAuto(); }

    slides[0].classList.add('active');
    startAuto();
  });
}
document.addEventListener('DOMContentLoaded', initSliders);

/* ── 8. BACK TO TOP ───────────────────────────────────────── */
const backToTopBtn = document.getElementById('back-to-top');

function toggleBackToTop() {
  if (!backToTopBtn) return;
  if (window.scrollY > 400) backToTopBtn.classList.add('visible');
  else backToTopBtn.classList.remove('visible');
}

if (backToTopBtn) {
  backToTopBtn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
}

/* ── 9. SMOOTH SCROLL ────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        e.preventDefault();
        const top = target.getBoundingClientRect().top + window.scrollY - 80;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    });
  });
});

/* ── 10. CONTACT FORM — EmailJS ───────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
  if (typeof emailjs !== 'undefined') emailjs.init('YkBoCUm6UUDPc5JIY');

  const contactForm = document.getElementById('contact-form');
  const submitBtn = document.getElementById('submit-btn');
  const formMsg = document.getElementById('form-message');

  if (contactForm) {
    contactForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const name = document.getElementById('name').value.trim();
      const email = document.getElementById('email').value.trim();
      const subject = document.getElementById('subject').value.trim();
      const message = document.getElementById('message').value.trim();

      if (!name || !email || !subject || !message) { showFormMsg('Please fill in all fields.', 'error'); return; }
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { showFormMsg('Please enter a valid email address.', 'error'); return; }

      submitBtn.disabled = true;
      submitBtn.innerHTML = '<span class="btn-text">Sending...</span><span class="spinner"></span>';

      try {
        await emailjs.send('service_tbt0kus', 'dbnt8e2', {
          from_name: name, from_email: email,
          subject: subject, message: message,
          to_email: 'rifaqajmalmohmand@gmail.com'
        });
        showFormMsg('✅ Message sent successfully! I\'ll get back to you soon.', 'success');
        contactForm.reset();
      } catch (err) {
        console.error('EmailJS error:', err);
        showFormMsg('❌ Something went wrong. Please try again or email me directly.', 'error');
      } finally {
        submitBtn.disabled = false;
        submitBtn.innerHTML = '<span class="btn-text">Send Message</span><i class="fas fa-paper-plane"></i>';
      }
    });
  }

  function showFormMsg(msg, type) {
    if (!formMsg) return;
    formMsg.textContent = msg; formMsg.className = `form-message ${type}`;
    formMsg.style.display = 'block';
    setTimeout(() => { formMsg.style.display = 'none'; }, 5000);
  }
});

/* ── 11. SKILLS TABS ──────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
  const skillTabs = document.querySelectorAll('.skill-tab');
  const skillPanels = document.querySelectorAll('.skill-panel');

  skillTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      skillTabs.forEach(t => t.classList.remove('active'));
      skillPanels.forEach(p => p.classList.remove('active'));
      tab.classList.add('active');
      const target = document.getElementById(tab.dataset.target);
      if (target) target.classList.add('active');
    });
  });
});

/* ── 12. ROTATING TEXT RING ──────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
  const rotatingText = document.getElementById('rotating-text');
  if (rotatingText) {
    let angle = 0;
    function rotate() { angle += 0.25; rotatingText.style.transform = `rotate(${angle}deg)`; requestAnimationFrame(rotate); }
    rotate();
  }
});

/* ── 13. HERO BADGES FLOAT ──────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.hero-badge').forEach((badge, i) => {
    badge.style.animationDelay = `${i * 0.5}s`;
  });
});

/* ── 14. CURSOR GLOW ─────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
  if (window.innerWidth < 768) return;
  const cursor = document.createElement('div');
  cursor.id = 'cursor-glow';
  document.body.appendChild(cursor);

  document.addEventListener('mousemove', (e) => {
    cursor.style.left = e.clientX + 'px';
    cursor.style.top = e.clientY + 'px';
  });

  document.querySelectorAll('a, button, .project-card, .skill-tab, .service-card').forEach(el => {
    el.addEventListener('mouseenter', () => cursor.classList.add('expand'));
    el.addEventListener('mouseleave', () => cursor.classList.remove('expand'));
  });
});
