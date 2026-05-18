/* Auto Masters — site behavior. Vanilla JS, no dependencies. */
(function () {
  "use strict";

  var doc = document;
  var on = function (el, ev, fn, opt) { el && el.addEventListener(ev, fn, opt || false); };
  var $  = function (s, c) { return (c || doc).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || doc).querySelectorAll(s)); };

  /* footer year */
  var yr = $("#year");
  if (yr) yr.textContent = new Date().getFullYear();

  /* subtle header border once scrolled */
  var header = $("#site-header");
  var onScroll = function () { if (header) header.classList.toggle("is-stuck", window.scrollY > 4); };
  on(window, "scroll", onScroll, { passive: true });
  onScroll();

  /* mobile nav drawer */
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
  $$("#primary-nav a").forEach(function (a) { on(a, "click", function () { setNav(false); }); });
  on(doc.body, "click", function (e) {
    if (doc.body.classList.contains("nav-open") &&
        !nav.contains(e.target) && !toggle.contains(e.target)) {
      setNav(false);
    }
  });

  /* highlight the section you're in */
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

  /* car-care accordion */
  var heads = $$(".accordion__head");
  function setPanel(head, open) {
    var body = head.nextElementSibling;
    head.setAttribute("aria-expanded", String(open));
    if (body) body.style.maxHeight = open ? body.scrollHeight + "px" : "0px";
  }
  heads.forEach(function (head) {
    setPanel(head, head.getAttribute("aria-expanded") === "true");
    on(head, "click", function () {
      var isOpen = head.getAttribute("aria-expanded") === "true";
      heads.forEach(function (h) { if (h !== head) setPanel(h, false); });
      setPanel(head, !isOpen);
    });
  });
  on(window, "resize", function () {
    heads.forEach(function (h) {
      if (h.getAttribute("aria-expanded") === "true") {
        var b = h.nextElementSibling;
        if (b) b.style.maxHeight = b.scrollHeight + "px";
      }
    });
  });

  /* contact form — front-end validation only */
  var form = $("#contact-form");
  if (form) {
    var status = $("#form-status");

    function setError(name, msg) {
      var field = form.querySelector('[name="' + name + '"]');
      var wrap = field ? field.closest(".field") : null;
      var slot = form.querySelector('.field__error[data-for="' + name + '"]');
      if (wrap) wrap.classList.toggle("invalid", !!msg);
      if (slot) slot.textContent = msg || "";
    }

    function validate() {
      var ok = true, f = form.elements;
      ["name", "phone", "message"].forEach(function (n) { setError(n, ""); });

      if (!f.name.value.trim()) { setError("name", "Let us know who you are."); ok = false; }

      var phone = f.phone.value.replace(/[^\d]/g, "");
      if (phone.length < 7) { setError("phone", "We need a number to call you back."); ok = false; }

      if (f.message.value.trim().length < 6) {
        setError("message", "Tell us a bit about the problem."); ok = false;
      }
      return ok;
    }

    on(form, "submit", function (e) {
      e.preventDefault();
      status.textContent = "";
      status.classList.remove("ok");
      if (!validate()) {
        var bad = form.querySelector(".field.invalid input, .field.invalid textarea");
        if (bad) bad.focus();
        return;
      }
      status.textContent = "Thanks — we got it and we'll call you back.";
      status.classList.add("ok");
      form.reset();
    });

    $$("#contact-form input, #contact-form textarea").forEach(function (el) {
      on(el, "input", function () {
        var wrap = el.closest(".field");
        if (wrap && wrap.classList.contains("invalid")) setError(el.name, "");
      });
    });
  }

})();
