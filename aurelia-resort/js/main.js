/* =========================================================
   Aurelia Bay Resort & Spa - Interactions
   ========================================================= */
(function () {
  "use strict";

  const $ = (sel, ctx = document) => ctx.querySelector(sel);
  const $$ = (sel, ctx = document) => Array.from(ctx.querySelectorAll(sel));

  /* ---------- Footer year ---------- */
  const yearEl = $("#year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ---------- Navbar: solid on scroll, active link, back-to-top ---------- */
  const nav = $("#mainNav");
  const toTop = $("#toTop");
  const sections = $$("section[id]");
  const navLinks = $$("#navMenu .nav-link");

  function onScroll() {
    const y = window.scrollY;
    nav.classList.toggle("scrolled", y > 60);
    toTop.classList.toggle("show", y > 600);

    let current = "";
    sections.forEach((s) => {
      if (y >= s.offsetTop - 140) current = s.id;
    });
    navLinks.forEach((l) =>
      l.classList.toggle("active", l.getAttribute("href") === "#" + current)
    );
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  // Close the mobile menu after choosing a link
  const navMenu = $("#navMenu");
  $$("#navMenu a").forEach((a) =>
    a.addEventListener("click", () => {
      if (navMenu.classList.contains("show")) {
        bootstrap.Collapse.getOrCreateInstance(navMenu).hide();
      }
    })
  );

  /* ---------- Hero slideshow ---------- */
  const slides = $$(".hero-slide");
  let slideIdx = 0;
  if (slides.length > 1) {
    setInterval(() => {
      slides[slideIdx].classList.remove("active");
      slideIdx = (slideIdx + 1) % slides.length;
      slides[slideIdx].classList.add("active");
    }, 6000);
  }

  /* ---------- Scroll reveal ---------- */
  const revealEls = $$(".reveal, .reveal-left, .reveal-right");
  if ("IntersectionObserver" in window) {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("in");
            io.unobserve(e.target);
          }
        });
      },
      { threshold: 0.15, rootMargin: "0px 0px -40px 0px" }
    );
    revealEls.forEach((el) => io.observe(el));
  } else {
    revealEls.forEach((el) => el.classList.add("in"));
  }

  /* ---------- Animated counters ---------- */
  const counters = $$(".counter");
  function runCounter(el) {
    const target = +el.dataset.target;
    const suffix = el.dataset.suffix || "";
    const duration = 1800;
    const start = performance.now();
    (function tick(now) {
      const p = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      el.textContent = Math.round(target * eased) + suffix;
      if (p < 1) requestAnimationFrame(tick);
    })(start);
  }
  if ("IntersectionObserver" in window) {
    const cio = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            runCounter(e.target);
            cio.unobserve(e.target);
          }
        });
      },
      { threshold: 0.6 }
    );
    counters.forEach((c) => cio.observe(c));
  } else {
    counters.forEach(runCounter);
  }

  /* ---------- Date inputs: min dates and check-out linkage ---------- */
  const today = new Date().toISOString().split("T")[0];
  function nextDay(dateStr) {
    const d = new Date(dateStr);
    d.setDate(d.getDate() + 1);
    return d.toISOString().split("T")[0];
  }
  function linkDates(inId, outId) {
    const inEl = $(inId);
    const outEl = $(outId);
    if (!inEl || !outEl) return;
    inEl.min = today;
    outEl.min = nextDay(today);
    inEl.addEventListener("change", () => {
      if (!inEl.value) return;
      const min = nextDay(inEl.value);
      outEl.min = min;
      if (outEl.value && outEl.value < min) outEl.value = "";
    });
  }
  linkDates("#qbIn", "#qbOut");
  linkDates("#checkin", "#checkout");

  /* ---------- Quick booking bar -> prefill enquiry form ---------- */
  const quick = $("#quickBooking");
  quick.addEventListener("submit", (e) => {
    e.preventDefault();
    const inEl = $("#qbIn");
    const outEl = $("#qbOut");
    [inEl, outEl].forEach((el) => el.classList.toggle("is-invalid", !el.value));
    if (!inEl.value || !outEl.value) return;
    if (outEl.value <= inEl.value) {
      outEl.classList.add("is-invalid");
      return;
    }
    $("#checkin").value = inEl.value;
    $("#checkout").value = outEl.value;
    $("#guests").value = parseInt($("#qbGuests").value, 10) || 2;
    $("#contact").scrollIntoView({ behavior: "smooth" });
    setTimeout(() => $("#name").focus({ preventScroll: true }), 700);
  });

  /* ---------- Enquiry form: validation + simulated submit ---------- */
  const form = $("#enquiryForm");
  const success = $("#formSuccess");

  function validateForm() {
    let ok = true;
    $$("input[required], textarea[required]", form).forEach((el) => {
      const valid = el.checkValidity();
      el.classList.toggle("is-invalid", !valid);
      el.classList.toggle("is-valid", valid);
      if (!valid) ok = false;
    });

    const cin = $("#checkin").value;
    const cout = $("#checkout").value;
    if (cin && cout && cout <= cin) {
      $("#checkout").classList.add("is-invalid");
      $("#checkout").classList.remove("is-valid");
      ok = false;
    }
    return ok;
  }

  // Live feedback once a field has been touched
  $$("input, textarea", form).forEach((el) => {
    el.addEventListener("blur", () => {
      if (el.required) {
        const valid = el.checkValidity();
        el.classList.toggle("is-invalid", !valid);
        el.classList.toggle("is-valid", valid);
      }
    });
    el.addEventListener("input", () => {
      if (el.classList.contains("is-invalid") && el.checkValidity()) {
        el.classList.remove("is-invalid");
        el.classList.add("is-valid");
      }
    });
  });

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    if (!validateForm()) {
      const firstBad = $(".is-invalid", form);
      if (firstBad) firstBad.focus();
      return;
    }

    const btn = $("button[type='submit']", form);
    const label = $(".btn-label", btn);
    btn.disabled = true;
    label.textContent = "Sending...";

    // Demo only: no backend. Replace with fetch() to a real endpoint.
    const data = Object.fromEntries(new FormData(form).entries());
    console.info("Enquiry payload (demo):", data);

    setTimeout(() => {
      success.classList.add("show");
      btn.disabled = false;
      label.textContent = "Send Enquiry";
    }, 900);
  });

  $("#formReset").addEventListener("click", () => {
    form.reset();
    $$(".is-valid, .is-invalid", form).forEach((el) =>
      el.classList.remove("is-valid", "is-invalid")
    );
    success.classList.remove("show");
  });

  /* ---------- Newsletter ---------- */
  const news = $("#newsletterForm");
  const newsMsg = $("#newsletterMsg");
  news.addEventListener("submit", (e) => {
    e.preventDefault();
    const input = $("input", news);
    if (input.checkValidity() && input.value.trim()) {
      newsMsg.textContent = "Thanks for subscribing!";
      news.reset();
    } else {
      newsMsg.textContent = "Please enter a valid email.";
    }
    setTimeout(() => (newsMsg.textContent = ""), 4000);
  });

  /* ---------- Gallery lightbox ---------- */
  const items = $$(".g-item");
  const modalEl = $("#lightbox");
  const lbImg = $("#lbImg");
  const modal = new bootstrap.Modal(modalEl);
  let current = 0;

  function show(i) {
    current = (i + items.length) % items.length;
    lbImg.src = items[current].dataset.full;
    lbImg.alt = $("img", items[current]).alt;
  }
  items.forEach((item, i) =>
    item.addEventListener("click", (e) => {
      e.preventDefault();
      show(i);
      modal.show();
    })
  );
  $("#lbPrev").addEventListener("click", () => show(current - 1));
  $("#lbNext").addEventListener("click", () => show(current + 1));
  document.addEventListener("keydown", (e) => {
    if (!modalEl.classList.contains("show")) return;
    if (e.key === "ArrowLeft") show(current - 1);
    if (e.key === "ArrowRight") show(current + 1);
  });
})();
