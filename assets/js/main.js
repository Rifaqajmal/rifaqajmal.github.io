/* ============================================================
   main.js — Rifaq Ajmal portfolio
   Header, mobile menu, active link, screenshot sliders,
   project filter and the contact form (EmailJS).
   ============================================================ */
(function () {
  'use strict';

  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };

  /* ── Header state ── */
  var header = $('#site-header');
  function onScroll() { header.classList.toggle('scrolled', window.scrollY > 16); }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ── Mobile menu ── */
  var btn = $('#menu-btn');
  var nav = $('#site-nav');
  function setMenu(open) {
    nav.classList.toggle('open', open);
    btn.setAttribute('aria-expanded', String(open));
    btn.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    document.body.classList.toggle('menu-open', open);
  }
  btn.addEventListener('click', function () { setMenu(!nav.classList.contains('open')); });
  $$('#site-nav a').forEach(function (a) { a.addEventListener('click', function () { setMenu(false); }); });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') setMenu(false); });
  window.addEventListener('resize', function () { if (window.innerWidth > 860) setMenu(false); });

  /* ── Active nav link while scrolling ── */
  var links = $$('#site-nav a[href^="#"]:not(.btn)');
  var map = {};
  links.forEach(function (a) { map[a.getAttribute('href').slice(1)] = a; });
  var order = ['about', 'work', 'experience', 'cta', 'skills', 'education', 'contact'];
  function activeLink() {
    var y = window.scrollY + header.offsetHeight + 80;
    var current = null;
    order.forEach(function (id) {
      var el = document.getElementById(id);
      if (el && el.offsetTop <= y) current = id;
    });
    if (current === 'education') current = 'skills';
    if (current === 'cta') current = 'experience';
    links.forEach(function (a) { a.classList.toggle('active', map[current] === a); });
  }
  window.addEventListener('scroll', activeLink, { passive: true });
  activeLink();

  /* ── Screenshot sliders (user controlled, no autoplay) ── */
  $$('[data-slider]').forEach(function (s) {
    var slides = $$('.slide', s);
    var dotsEl = $('.s-dots', s);
    var i = 0, startX = null;
    if (slides.length < 2) { s.setAttribute('data-single', ''); return; }
    slides.forEach(function () { dotsEl.appendChild(document.createElement('i')); });
    var dots = $$('i', dotsEl);
    function go(n) {
      slides[i].classList.remove('active'); dots[i].classList.remove('on');
      i = (n + slides.length) % slides.length;
      slides[i].classList.add('active'); dots[i].classList.add('on');
    }
    dots[0].classList.add('on');
    $('.s-prev', s).addEventListener('click', function () { go(i - 1); });
    $('.s-next', s).addEventListener('click', function () { go(i + 1); });
    s.addEventListener('touchstart', function (e) { startX = e.touches[0].clientX; }, { passive: true });
    s.addEventListener('touchend', function (e) {
      if (startX === null) return;
      var dx = e.changedTouches[0].clientX - startX;
      if (Math.abs(dx) > 40) go(i + (dx < 0 ? 1 : -1));
      startX = null;
    }, { passive: true });
  });

  /* ── Project filter ── */
  var tabs = $$('.tab');
  var cards = $$('.card[data-cat]');
  tabs.forEach(function (t) {
    t.addEventListener('click', function () {
      var f = t.getAttribute('data-filter');
      tabs.forEach(function (x) { x.classList.remove('active'); x.setAttribute('aria-pressed', 'false'); });
      t.classList.add('active'); t.setAttribute('aria-pressed', 'true');
      cards.forEach(function (c) { c.classList.toggle('is-hidden', !(f === 'all' || c.getAttribute('data-cat') === f)); });
    });
  });

  /* ── Contact form (EmailJS) ── */
  if (typeof emailjs !== 'undefined') emailjs.init('YkBoCUm6UUDPc5JIY');
  var form = $('#contact-form');
  var submit = $('#submit-btn');
  var msg = $('#form-message');
  var timer;
  function show(text, type) {
    msg.textContent = text; msg.className = 'form-message ' + type;
    clearTimeout(timer); timer = setTimeout(function () { msg.className = 'form-message'; }, 7000);
  }
  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var name = $('#name').value.trim(), email = $('#email').value.trim();
      var subject = $('#subject').value.trim(), message = $('#message').value.trim();
      if (!name || !email || !subject || !message) { show('Please fill in every field.', 'error'); return; }
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { show('Please enter a valid email address.', 'error'); return; }
      if (typeof emailjs === 'undefined') { show('The form could not load. Please email me directly instead.', 'error'); return; }
      submit.disabled = true; submit.textContent = 'Sending...';
      emailjs.send('service_kpvj5l6', 'template_3oy4pem', {
        name: name, email: email, title: subject, time: new Date().toLocaleString(),
        from_name: name, from_email: email, subject: subject, message: message,
        to_email: 'rifaqajmalmohmand@gmail.com'
      }).then(function () {
        show('Message sent. I will reply as soon as I can.', 'success'); form.reset();
      }).catch(function (err) {
        if (window.console) console.error('EmailJS error:', err);
        show('The message could not be sent. Please try again or email me directly.', 'error');
      }).then(function () { submit.disabled = false; submit.textContent = 'Send message'; });
    });
  }
})();
