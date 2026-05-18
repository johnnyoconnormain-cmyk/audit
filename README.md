# Auto Masters — Website

A modern, fast, fully responsive website for **Auto Masters**, Ellensburg's
trusted diesel & auto repair shop (serving the area for 30+ years).

This is a complete redesign of the old Weebly site
(`amieburg.weebly.com`) — it fixes the typos ("Serives", "piece of mind",
"over XXX years"), modernizes the look, and makes it work great on phones.

## Highlights

- **Single-page, zero build step** — plain HTML/CSS/JS, host it anywhere
  (GitHub Pages, Netlify, any static host). No dependencies to install.
- **Fully responsive** — mobile-first, with a slide-in nav drawer and a
  floating tap-to-call button on phones.
- **Modern UX** — sticky header, scrollspy nav, animated stat counters,
  scroll-reveal, testimonial slider (swipe support), accordion car-care tips.
- **Accessible** — semantic HTML, skip link, ARIA states, keyboard friendly,
  honors `prefers-reduced-motion`.
- **SEO ready** — meta/Open Graph tags + `LocalBusiness`/`AutoRepair`
  JSON-LD structured data for Google.
- **Working contact form** with client-side validation (front-end only —
  see "Going live" below to wire up real delivery).

## File structure

```
index.html          Page markup + structured data
css/styles.css       Design system & responsive layout
js/main.js           Nav, slider, accordion, counters, form validation
assets/favicon.svg   Brand mark
```

## View it locally

Just open `index.html` in a browser, or serve the folder:

```bash
python3 -m http.server 8000
# then open http://localhost:8000
```

## Going live — replace the placeholders

A few items are sensible defaults that the shop owner should confirm and
swap for real content (marked with `TODO` comments in `index.html`):

- **Shop hours** — currently Mon–Fri 8:00–5:30, Sat 9:00–1:00 (update in
  the top bar, contact section, and the JSON-LD block).
- **Our Crew** — replace placeholder roles/bios (and add real photos) for
  the actual team.
- **Testimonials** — swap the sample quotes for verified Google/Facebook
  reviews.
- **Email address** — `service@automasters-ellensburg.com` is a
  placeholder; set the real one.
- **Facebook link** — points to `facebook.com`; set the real page URL.
- **Contact form** — submission is currently handled client-side only.
  To receive messages, point the form at a backend or a service like
  Formspree/Netlify Forms (one-line change to the `<form>` tag).
- **Photos** — the design uses CSS/SVG so it stays self-contained and
  loads instantly. Real shop/team photography can be dropped into the
  hero, crew, and about sections for an extra level of polish.
