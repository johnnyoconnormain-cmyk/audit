/* =========================================================
   Auto Masters — site interactions
   Vanilla JS, no dependencies.
   ========================================================= */
(function () {
  "use strict";

  var doc = document;
  var on = function (el, ev, fn, opt) { el && el.addEventListener(ev, fn, opt || false); };
  var $  = function (s, c) { return (c || doc).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || doc).querySelectorAll(s)); };

  /* ---------- Footer year ---------- */
  var yr = $("#year");
  if (yr) yr.textContent = new Date().getFullYear();

  /* ---------- Sticky header shadow ---------- */
  var header = $("#site-header");
  var onScroll = function () {
    if (header) header.classList.toggle("is-stuck", window.scrollY > 8);
  };
  on(window, "scroll", onScroll, { passive: true });
  onScroll();

  /* ---------- Mobile nav ---------- */
  var nav = $("#primary-nav");
  var toggle = $(".nav__toggle");
  var closeBtn = $(".nav__close");

  function setNav(open) {
    if (!nav) return;
    nav.classList.toggle("is-open", open);
    doc.body.classList.toggle("nav-open", open);
    if (toggle) toggle.setAttribute("aria-expanded", String(open));
  }
  on(toggle, "click", function () { setNav(!nav.classList.contains("is-open")); });
  on(closeBtn, "click", function () { setNav(false); });
  on(doc, "keydown", function (e) { if (e.key === "Escape") setNav(false); });
  $$("#primary-nav a").forEach(function (a) {
    on(a, "click", function () { setNav(false); });
  });
  // Close drawer when tapping the dimmed backdrop
  on(doc.body, "click", function (e) {
    if (doc.body.classList.contains("nav-open") &&
        !nav.contains(e.target) && !toggle.contains(e.target)) {
      setNav(false);
    }
  });

  /* ---------- Scrollspy (active nav link) ---------- */
  var sections = $$("main section[id]");
  var navLinks = $$("#primary-nav a");
  if ("IntersectionObserver" in window && sections.length) {
    var spy = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (!en.isIntersecting) return;
        var id = en.target.id;
        navLinks.forEach(function (l) {
          l.classList.toggle("is-active", l.getAttribute("href") === "#" + id);
        });
      });
    }, { rootMargin: "-45% 0px -50% 0px" });
    sections.forEach(function (s) { spy.observe(s); });
  }

  /* ---------- Reveal on scroll ---------- */
  var revealTargets = $$(".card, .member, .stat, .accordion__item, .section__head, .why__copy, .about__text, .about__panel, .contact__form, .contact__info");
  revealTargets.forEach(function (el) { el.classList.add("reveal"); });
  if ("IntersectionObserver" in window) {
    var revObs = new IntersectionObserver(function (entries, obs) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add("is-in"); obs.unobserve(en.target); }
      });
    }, { threshold: 0.12 });
    revealTargets.forEach(function (el) { revObs.observe(el); });
  } else {
    revealTargets.forEach(function (el) { el.classList.add("is-in"); });
  }

  /* ---------- Stats counter ---------- */
  function animateCount(el) {
    var target = parseFloat(el.getAttribute("data-count")) || 0;
    var suffix = el.getAttribute("data-suffix") || "";
    var isDecimal = el.getAttribute("data-decimal") === "true";
    var dur = 1400, start = null;
    function step(ts) {
      if (!start) start = ts;
      var p = Math.min((ts - start) / dur, 1);
      var eased = 1 - Math.pow(1 - p, 3);
      var val = target * eased;
      if (isDecimal) {
        el.textContent = (val / 10).toFixed(1);
      } else {
        el.textContent = Math.round(val).toLocaleString("en-US") + suffix;
      }
      if (p < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }
  var nums = $$(".stat__num");
  if ("IntersectionObserver" in window && nums.length) {
    var numObs = new IntersectionObserver(function (entries, obs) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { animateCount(en.target); obs.unobserve(en.target); }
      });
    }, { threshold: 0.5 });
    nums.forEach(function (n) { numObs.observe(n); });
  } else {
    nums.forEach(animateCount);
  }

  /* ---------- Accordion ---------- */
  var accHeads = $$(".accordion__head");
  function setPanel(head, open) {
    var body = head.nextElementSibling;
    head.setAttribute("aria-expanded", String(open));
    if (body) body.style.maxHeight = open ? body.scrollHeight + "px" : "0px";
  }
  accHeads.forEach(function (head) {
    setPanel(head, head.getAttribute("aria-expanded") === "true");
    on(head, "click", function () {
      var isOpen = head.getAttribute("aria-expanded") === "true";
      accHeads.forEach(function (h) { if (h !== head) setPanel(h, false); });
      setPanel(head, !isOpen);
    });
  });
  on(window, "resize", function () {
    accHeads.forEach(function (h) {
      if (h.getAttribute("aria-expanded") === "true") {
        var b = h.nextElementSibling;
        if (b) b.style.maxHeight = b.scrollHeight + "px";
      }
    });
  });

  /* ---------- Testimonials slider ---------- */
  (function () {
    var slider = $("#testi-slider");
    if (!slider) return;
    var track = $(".slider__track", slider);
    var slides = $$(".quote", slider);
    var dotsWrap = $(".slider__dots", slider);
    var i = 0, timer;

    slides.forEach(function (_, idx) {
      var b = doc.createElement("button");
      b.setAttribute("role", "tab");
      b.setAttribute("aria-label", "Show testimonial " + (idx + 1));
      if (idx === 0) b.classList.add("is-active");
      on(b, "click", function () { go(idx); reset(); });
      dotsWrap.appendChild(b);
    });
    var dots = $$("button", dotsWrap);

    function go(n) {
      i = (n + slides.length) % slides.length;
      track.style.transform = "translateX(-" + (i * 100) + "%)";
      dots.forEach(function (d, k) { d.classList.toggle("is-active", k === i); });
    }
    function next() { go(i + 1); }
    function reset() { clearInterval(timer); timer = setInterval(next, 6000); }

    reset();
    on(slider, "mouseenter", function () { clearInterval(timer); });
    on(slider, "mouseleave", reset);

    // Touch / swipe
    var x0 = null;
    on(slider, "touchstart", function (e) { x0 = e.touches[0].clientX; }, { passive: true });
    on(slider, "touchend", function (e) {
      if (x0 === null) return;
      var dx = e.changedTouches[0].clientX - x0;
      if (Math.abs(dx) > 45) { dx < 0 ? next() : go(i - 1); reset(); }
      x0 = null;
    });
  })();

  /* ---------- Contact form validation ---------- */
  (function () {
    var form = $("#contact-form");
    if (!form) return;
    var status = $("#form-status");

    function setError(name, msg) {
      var field = form.querySelector('[name="' + name + '"]');
      var wrap = field ? field.closest(".field") : null;
      var slot = form.querySelector('.field__error[data-for="' + name + '"]');
      if (wrap) wrap.classList.toggle("invalid", !!msg);
      if (slot) slot.textContent = msg || "";
    }

    function validate() {
      var ok = true;
      var f = form.elements;
      ["name", "phone", "email", "message"].forEach(function (n) { setError(n, ""); });

      if (!f.name.value.trim()) { setError("name", "Please enter your name."); ok = false; }

      var phone = f.phone.value.replace(/[^\d]/g, "");
      if (phone.length < 7) { setError("phone", "Enter a valid phone number."); ok = false; }

      if (f.email.value.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(f.email.value.trim())) {
        setError("email", "Enter a valid email address."); ok = false;
      }

      if (f.message.value.trim().length < 8) {
        setError("message", "Tell us a little more so we can help."); ok = false;
      }
      return ok;
    }

    on(form, "submit", function (e) {
      e.preventDefault();
      status.textContent = "";
      status.classList.remove("ok");
      if (!validate()) {
        var firstBad = form.querySelector(".field.invalid input, .field.invalid textarea");
        if (firstBad) firstBad.focus();
        return;
      }
      var name = form.elements.name.value.trim().split(" ")[0];
      status.textContent = "Thanks, " + name + "! Your request was received — we'll call you back shortly.";
      status.classList.add("ok");
      form.reset();
    });

    // Clear an error as soon as the user fixes the field
    $$("#contact-form input, #contact-form textarea").forEach(function (el) {
      on(el, "input", function () {
        var wrap = el.closest(".field");
        if (wrap && wrap.classList.contains("invalid")) setError(el.name, "");
      });
    });
  })();

})();
