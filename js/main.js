(function () {
  'use strict';

  var reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function initNavScroll() {
    var nav = document.getElementById('navbar');
    if (!nav) return;

    function onScroll() {
      nav.classList.toggle('nav--scrolled', window.scrollY > 50);
    }

    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  function initMobileNav() {
    var toggle = document.getElementById('hamburger');
    var menu = document.getElementById('navMenu');
    if (!toggle || !menu) return;

    toggle.addEventListener('click', function () {
      var open = menu.classList.toggle('is-open');
      toggle.classList.toggle('is-open');
      toggle.setAttribute('aria-expanded', open);
      document.body.style.overflow = open ? 'hidden' : '';
    });

    menu.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () {
        menu.classList.remove('is-open');
        toggle.classList.remove('is-open');
        toggle.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
      });
    });
  }

  function initActiveLink() {
    var sections = document.querySelectorAll('section[id]');
    var links = document.querySelectorAll('.nav__link');
    if (!sections.length || !links.length) return;

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        var id = entry.target.id;
        links.forEach(function (link) {
          link.classList.toggle('is-active', link.getAttribute('href') === '#' + id);
        });
      });
    }, { rootMargin: '-30% 0px -50% 0px' });

    sections.forEach(function (s) { observer.observe(s); });
  }

  function initReveal() {
    if (reducedMotion) {
      document.querySelectorAll('.reveal, .stagger').forEach(function (el) {
        el.classList.add('is-visible');
      });
      return;
    }

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -60px 0px' });

    document.querySelectorAll('.reveal, .stagger').forEach(function (el) {
      observer.observe(el);
    });
  }

  function initTilt() {
    if (reducedMotion) return;
    if (!window.matchMedia('(pointer: fine)').matches) return;

    document.querySelectorAll('.work__card').forEach(function (card) {
      card.addEventListener('mousemove', function (e) {
        var rect = card.getBoundingClientRect();
        var x = (e.clientX - rect.left) / rect.width - 0.5;
        var y = (e.clientY - rect.top) / rect.height - 0.5;
        card.style.transform =
          'perspective(600px) rotateX(' + (y * -8) + 'deg) rotateY(' + (x * 8) + 'deg) scale3d(1.02,1.02,1.02)';
      });

      card.addEventListener('mouseleave', function () {
        card.style.transform = '';
      });
    });
  }

  document.addEventListener('DOMContentLoaded', function () {
    initNavScroll();
    initMobileNav();
    initActiveLink();
    initReveal();
    initTilt();
  });
})();
