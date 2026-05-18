# Auto Masters — Website

A plain, fast website for **Auto Masters**, a diesel & auto repair shop
in Ellensburg, WA (in business since 1994). It replaces the old Weebly
site and fixes its typos ("Serives", "piece of mind", "over XXX years").

The goal was a site that reads like the shop wrote it — phone number and
hours up front, no inflated stats, no stock-photo testimonials, no
animation gimmicks.

## Stack

Plain HTML / CSS / JS. No build step, no dependencies — drop it on any
static host (GitHub Pages, Netlify, etc.).

```
index.html          Page + local-business structured data
css/styles.css       Styles + responsive layout
js/main.js           Mobile nav, accordion, form validation
assets/favicon.svg   Brand mark
```

## Run locally

```bash
python3 -m http.server 8000   # then open http://localhost:8000
```

## Before launch — owner needs to confirm/replace

These are reasonable defaults, not facts. They're marked with `TODO`
comments in `index.html`:

- **Hours** — currently Mon–Fri 8:00–5:30, Sat 9:00–1:00 (appears in the
  top bar, About, Contact, and the structured-data block).
- **Crew** — placeholder roles; add real names and photos, or delete the
  section.
- **Reviews** — links point at generic Facebook/Google searches; point
  them at the shop's actual pages.
- **Facebook link** — currently `facebook.com`; set the real page.
- **Contact form** — validates in the browser but does not send anything
  yet. Point the `<form>` at Formspree, Netlify Forms, or a backend to
  actually receive messages.
