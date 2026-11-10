// Shabang — mobile menu, hero carousel, menu tabs, horizontal-scroll arrows, lightbox.
(function () {
  'use strict';

  // ---- mobile menu (contract: data-menu-toggle / data-mobile-menu) ----
  var toggle = document.querySelector('[data-menu-toggle]');
  var menu = document.querySelector('[data-mobile-menu]');
  if (toggle && menu) {
    var setOpen = function (open) {
      menu.hidden = !open;
      toggle.setAttribute('aria-expanded', String(open));
      toggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    };
    toggle.addEventListener('click', function () { setOpen(menu.hidden); });
    menu.querySelectorAll('a').forEach(function (a) {
      a.addEventListener('click', function () { setOpen(false); });
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && !menu.hidden) setOpen(false);
    });
  }

  // ---- menu tabs ----
  var tabBtns = Array.prototype.slice.call(document.querySelectorAll('.tab-btn'));
  var panels = Array.prototype.slice.call(document.querySelectorAll('.tab-panel'));
  function activateTab(id) {
    tabBtns.forEach(function (b) {
      var on = b.getAttribute('data-tab') === id;
      b.classList.toggle('active', on);
      b.setAttribute('aria-selected', String(on));
    });
    panels.forEach(function (p) { p.classList.toggle('active', p.id === id); });
  }
  tabBtns.forEach(function (b) {
    b.addEventListener('click', function () { activateTab(b.getAttribute('data-tab')); });
  });
  // Nav links ("Breakfast" / "Steaks" / "Hi-Tea") also open their tab.
  document.querySelectorAll('[data-tab-link]').forEach(function (a) {
    a.addEventListener('click', function () { activateTab(a.getAttribute('data-tab-link')); });
  });

  // ---- hero carousel ----
  var track = document.getElementById('carousel-track');
  var cards = track ? track.querySelectorAll('.carousel-card') : [];
  var dots = Array.prototype.slice.call(document.querySelectorAll('[data-carousel-dot]'));
  var current = 0, timer = null;
  function showSlide(i) {
    if (!cards.length) return;
    current = (i + cards.length) % cards.length;
    track.style.transform = 'translateX(-' + (current * 100) + '%)';
    dots.forEach(function (d, idx) { d.classList.toggle('active', idx === current); });
  }
  function startAuto() {
    stopAuto();
    timer = setInterval(function () { showSlide(current + 1); }, 5000);
  }
  function stopAuto() { if (timer) { clearInterval(timer); timer = null; } }
  if (track && cards.length) {
    track.style.transition = 'transform .55s ease';
    document.querySelectorAll('[data-carousel-dir]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        showSlide(current + Number(btn.getAttribute('data-carousel-dir')));
        startAuto();
      });
    });
    dots.forEach(function (d) {
      d.addEventListener('click', function () {
        showSlide(Number(d.getAttribute('data-carousel-dot')));
        startAuto();
      });
    });
    var carousel = document.getElementById('hero-carousel');
    if (carousel) {
      carousel.addEventListener('mouseenter', stopAuto);
      carousel.addEventListener('mouseleave', startAuto);
      carousel.addEventListener('focusin', stopAuto);
      carousel.addEventListener('focusout', startAuto);
    }
    startAuto();
  }

  // ---- horizontal-scroll arrows ----
  document.querySelectorAll('[data-scroll-target]').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var el = document.getElementById(btn.getAttribute('data-scroll-target'));
      if (!el) return;
      var dir = Number(btn.getAttribute('data-scroll-dir') || 1);
      el.scrollBy({ left: dir * 360, behavior: 'smooth' });
    });
  });

  // ---- lightbox ----
  var lightbox = document.getElementById('lightbox');
  var lightboxImg = document.getElementById('lightbox-img');
  var closeBtn = lightbox ? lightbox.querySelector('.lightbox-close') : null;
  function openLightbox(src, alt) {
    if (!lightbox) return;
    lightboxImg.src = src;
    lightboxImg.alt = alt || '';
    lightbox.hidden = false;
    document.body.style.overflow = 'hidden';
    if (closeBtn) closeBtn.focus();
  }
  function closeLightbox() {
    if (!lightbox) return;
    lightbox.hidden = true;
    document.body.style.overflow = '';
  }
  document.querySelectorAll('.g-item').forEach(function (item) {
    item.addEventListener('click', function () {
      var img = item.querySelector('img');
      openLightbox(item.getAttribute('data-full'), img ? img.alt : '');
    });
  });
  if (closeBtn) closeBtn.addEventListener('click', closeLightbox);
  if (lightbox) lightbox.addEventListener('click', function (e) {
    if (e.target === lightbox) closeLightbox();
  });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && lightbox && !lightbox.hidden) closeLightbox();
  });
})();
