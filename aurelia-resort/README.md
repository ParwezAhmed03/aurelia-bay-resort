# Aurelia Bay Resort & Spa - Landing Page

A responsive, luxury resort landing page built with **HTML5, CSS3, Bootstrap 5 and vanilla JavaScript**.
Created for the Brand Elite Web Developer assignment.

## Run in VS Code

1. Unzip the folder and open it in VS Code (`File > Open Folder...`).
2. Install the **Live Server** extension (Ritwick Dey).
3. Right-click `index.html` and choose **Open with Live Server**.

No build step or `npm install` is needed. You can also just double-click `index.html`.
An internet connection is required for Bootstrap, icons, Google Fonts and Unsplash images (all loaded from CDNs).

## Project structure

```
aurelia-resort/
  index.html      Page markup (all sections)
  css/style.css   Custom styles, design tokens and responsive rules
  js/main.js      Interactions and form logic
  README.md
```

## Sections

- Sticky navbar (turns solid on scroll, active link highlighting, mobile menu)
- Hero with crossfading slideshow and quick booking bar
- About with animated counters
- Amenities (6 cards)
- Activities / curated experiences
- Call-to-action banner (limited-time offer)
- Gallery grid with lightbox (keyboard arrows supported)
- Guest testimonials carousel
- Enquiry form with validation and success state (working UI)
- Second call-to-action strip
- Footer with newsletter signup and back-to-top button

## Features

- Fully responsive: desktop, tablet, mobile
- Scroll-reveal animations and hover effects (respects `prefers-reduced-motion`)
- Form validation: required fields, email/phone format, check-out must be after check-in
- Quick booking bar pre-fills the enquiry form
- Design tokens via CSS variables (`--gold`, `--navy`, `--sand`) for easy re-theming

## Notes

- The form is a front-end demo; submitting logs the data to the console and shows a success message.
  To go live, post it to a backend or a service such as Formspree in `js/main.js`.
- Images are from Unsplash via hotlinks. For production, download and host them locally in an `images/` folder.
- Brand name, contact details and testimonials are fictional placeholders.
