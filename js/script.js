/* Explore SA Events - shared JavaScript
   Features: welcome message (A), slideshow (B), form validation (C), show/hide (D),
   date and time (E), cost calculator (F), arrays and loops (G), dark mode (H),
   gallery filter that changes content on click (I), confirmation messages (J). */

"use strict";

// ---------- Event data (array of objects, Option G) ----------
const events = [
  { name: "Soweto Heritage Walk",           city: "Johannesburg", date: "2026-11-14", category: "Heritage", price: 120 },
  { name: "Cape Town Food Market Festival", city: "Cape Town",    date: "2026-11-28", category: "Food",     price: 80 },
  { name: "Durban Beach Run",               city: "Durban",       date: "2026-12-06", category: "Sport",    price: 200 },
  { name: "Pretoria Art in the Park",       city: "Pretoria",     date: "2027-01-16", category: "Arts",     price: 60 },
  { name: "Karoo Stargazing Night",         city: "Graaff-Reinet",date: "2027-02-13", category: "Nature",   price: 250 },
  { name: "Jozi Music Fest",                city: "Johannesburg", date: "2027-03-06", category: "Music",    price: 450 }
];

const MEAL_PRICE = 75;
const PARKING_PRICE = 40;
const GROUP_SIZE = 5;
const GROUP_DISCOUNT = 0.10;

// ---------- Helpers ----------
function formatDate(iso) {
  return new Date(iso + "T00:00:00").toLocaleDateString("en-ZA", { day: "numeric", month: "long", year: "numeric" });
}
function formatRand(amount) {
  return "R" + amount.toFixed(2);
}
function el(id) {
  return document.getElementById(id);
}

// ---------- Option H: dark / light mode ----------
function applyTheme(theme) {
  document.documentElement.setAttribute("data-theme", theme);
  const btn = el("theme-toggle");
  if (btn) {
    btn.textContent = theme === "dark" ? "Light mode" : "Dark mode";
    btn.setAttribute("aria-pressed", theme === "dark");
  }
}
function initTheme() {
  let saved = "light";
  try { saved = localStorage.getItem("theme") || "light"; } catch (e) { /* storage blocked */ }
  applyTheme(saved);
  const btn = el("theme-toggle");
  if (!btn) return;
  btn.addEventListener("click", function () {
    const next = document.documentElement.getAttribute("data-theme") === "dark" ? "light" : "dark";
    applyTheme(next);
    try { localStorage.setItem("theme", next); } catch (e) { /* ignore */ }
  });
}

// ---------- Option E: current date and time ----------
function initClock() {
  const box = el("datetime");
  if (!box) return;
  function tick() {
    const now = new Date();
    box.textContent = now.toLocaleDateString("en-ZA", { weekday: "long", day: "numeric", month: "long", year: "numeric" }) +
      " | " + now.toLocaleTimeString("en-ZA", { hour: "2-digit", minute: "2-digit", second: "2-digit" });
  }
  tick();
  setInterval(tick, 1000);
}

// ---------- Option A: welcome message (home page) ----------
function initWelcome() {
  if (!document.body.classList.contains("home")) return;
  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Good morning" : hour < 18 ? "Good afternoon" : "Good evening";
  const banner = document.createElement("div");
  banner.id = "welcome-banner";
  banner.setAttribute("role", "status");
  banner.innerHTML = "<span><strong>" + greeting + "!</strong> Welcome to Explore SA Events. Find something to do this month.</span>";
  const close = document.createElement("button");
  close.type = "button";
  close.textContent = "Dismiss";
  close.addEventListener("click", function () { banner.remove(); });
  banner.appendChild(close);
  const main = el("content");
  main.insertBefore(banner, main.firstChild);
}

// ---------- Option B: image slideshow ----------
function initSlideshow() {
  const show = el("slideshow");
  if (!show) return;
  const slides = show.querySelectorAll(".slide");
  const dotsBox = el("slide-dots");
  let current = 0;
  let timer;

  slides.forEach(function (s, i) {
    const dot = document.createElement("button");
    dot.type = "button";
    dot.className = "dot";
    dot.setAttribute("aria-label", "Go to slide " + (i + 1));
    dot.addEventListener("click", function () { go(i); restart(); });
    dotsBox.appendChild(dot);
  });
  const dots = dotsBox.querySelectorAll(".dot");

  function go(n) {
    current = (n + slides.length) % slides.length;
    for (let i = 0; i < slides.length; i++) {
      slides[i].classList.toggle("active", i === current);
      dots[i].classList.toggle("active", i === current);
    }
  }
  function restart() {
    clearInterval(timer);
    timer = setInterval(function () { go(current + 1); }, 5000);
  }
  el("prev-slide").addEventListener("click", function () { go(current - 1); restart(); });
  el("next-slide").addEventListener("click", function () { go(current + 1); restart(); });
  show.addEventListener("mouseenter", function () { clearInterval(timer); });
  show.addEventListener("mouseleave", restart);
  go(0);
  restart();
}

// ---------- Option G: arrays and loops build event cards ----------
function cardHTML(ev) {
  return '<article class="event-card"><span class="tag">' + ev.category + "</span>" +
    "<h3>" + ev.name + "</h3>" +
    "<p>" + ev.city + "</p>" +
    "<p>" + formatDate(ev.date) + "</p>" +
    "<p><strong>" + formatRand(ev.price) + "</strong> per ticket</p></article>";
}
function renderCards(containerId, list) {
  const box = el(containerId);
  if (!box) return;
  let html = "";
  for (let i = 0; i < list.length; i++) {
    html += cardHTML(list[i]);
  }
  box.innerHTML = html || "<p>No events found in this category.</p>";
}
function initUpcoming() {
  const today = new Date().toISOString().slice(0, 10);
  let upcoming = events.filter(function (e) { return e.date >= today; });
  if (upcoming.length === 0) upcoming = events;
  renderCards("upcoming-list", upcoming.slice(0, 3));
}
function initEventsPage() {
  const filter = el("category-filter");
  if (!filter) return;
  const categories = [];
  events.forEach(function (e) { if (categories.indexOf(e.category) === -1) categories.push(e.category); });
  categories.sort().forEach(function (c) {
    const opt = document.createElement("option");
    opt.value = c;
    opt.textContent = c;
    filter.appendChild(opt);
  });
  renderCards("event-cards", events);
  filter.addEventListener("change", function () {
    const chosen = filter.value;
    renderCards("event-cards", chosen === "all" ? events : events.filter(function (e) { return e.category === chosen; }));
  });
}

// ---------- Option F: cost calculator + Option J: confirmation ----------
function initCalculator() {
  const form = el("calc-form");
  if (!form) return;
  const select = el("calc-event");
  events.forEach(function (e, i) {
    const opt = document.createElement("option");
    opt.value = i;
    opt.textContent = e.name + " (" + formatRand(e.price) + ")";
    select.appendChild(opt);
  });
  const result = el("calc-result");
  const bookBtn = el("book-btn");
  let lastTotal = 0;

  form.addEventListener("submit", function (evt) {
    evt.preventDefault();
    const ev = events[Number(select.value)];
    const tickets = parseInt(el("calc-tickets").value, 10);
    if (isNaN(tickets) || tickets < 1 || tickets > 20) {
      result.innerHTML = '<p class="error">Please enter between 1 and 20 tickets.</p>';
      bookBtn.hidden = true;
      return;
    }
    const ticketCost = ev.price * tickets;
    const meals = el("calc-meal").checked ? MEAL_PRICE * tickets : 0;
    const parking = el("calc-parking").checked ? PARKING_PRICE : 0;
    const subtotal = ticketCost + meals + parking;
    const discount = tickets >= GROUP_SIZE ? subtotal * GROUP_DISCOUNT : 0;
    lastTotal = subtotal - discount;

    result.innerHTML =
      "<p>Tickets (" + tickets + " x " + formatRand(ev.price) + "): " + formatRand(ticketCost) + "</p>" +
      "<p>Meal vouchers: " + formatRand(meals) + "</p>" +
      "<p>Parking: " + formatRand(parking) + "</p>" +
      "<p>Group discount: -" + formatRand(discount) + "</p>" +
      '<p class="total">Total: ' + formatRand(lastTotal) + "</p>";
    bookBtn.hidden = false;
    bookBtn.dataset.event = ev.name;
  });

  bookBtn.addEventListener("click", function () {
    const ok = confirm("Confirm your booking request for " + bookBtn.dataset.event + "?\nTotal: " + formatRand(lastTotal));
    if (ok) {
      result.innerHTML += '<p class="success">Thank you! Your request has been noted. Please use the Contact Us page to complete your booking.</p>';
      bookBtn.hidden = true;
    }
  });
}

// ---------- Option D: show / hide information ----------
function initToggles() {
  document.querySelectorAll(".toggle-btn").forEach(function (btn) {
    const target = el(btn.dataset.toggle);
    const original = btn.textContent;
    btn.addEventListener("click", function () {
      const open = target.hidden;
      target.hidden = !open;
      btn.setAttribute("aria-expanded", open);
      btn.textContent = open ? original.replace(/^(Read|Show)/, "Hide") : original;
    });
  });
}

// ---------- Option I: buttons change gallery content ----------
function initGallery() {
  const bar = el("gallery-filters");
  if (!bar) return;
  const items = document.querySelectorAll(".gallery-item");
  const count = el("gallery-count");
  function update(cat) {
    let shown = 0;
    items.forEach(function (item) {
      const match = cat === "all" || item.dataset.category === cat;
      item.hidden = !match;
      if (match) shown++;
    });
    count.textContent = "Showing " + shown + " of " + items.length + " pictures";
  }
  bar.addEventListener("click", function (evt) {
    const btn = evt.target.closest(".filter-btn");
    if (!btn) return;
    bar.querySelectorAll(".filter-btn").forEach(function (b) { b.classList.remove("active"); });
    btn.classList.add("active");
    update(btn.dataset.filter);
  });
  update("all");
}

// ---------- Option C: contact form validation ----------
function initContactForm() {
  const form = el("contact-form");
  if (!form) return;
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

  const rules = {
    name: function (v) { return v.length < 2 ? "Please enter your name (at least 2 characters)." : ""; },
    email: function (v) {
      if (v === "") return "Please enter your email address.";
      return emailPattern.test(v) ? "" : "Please enter a valid email address, like name@example.com.";
    },
    subject: function (v) { return v === "" ? "Please enter a subject." : ""; },
    message: function (v) {
      if (v === "") return "Please enter your message.";
      return v.length < 10 ? "Your message must be at least 10 characters long." : "";
    }
  };

  function check(field) {
    const input = el(field);
    const msg = rules[field](input.value.trim());
    el(field + "-error").textContent = msg;
    input.classList.toggle("invalid", msg !== "");
    input.setAttribute("aria-invalid", msg !== "");
    return msg === "";
  }

  Object.keys(rules).forEach(function (field) {
    el(field).addEventListener("blur", function () { check(field); });
  });

  form.addEventListener("submit", function (evt) {
    evt.preventDefault();
    let valid = true;
    let firstBad = null;
    Object.keys(rules).forEach(function (field) {
      if (!check(field)) {
        valid = false;
        if (!firstBad) firstBad = el(field);
      }
    });
    const success = el("form-success");
    if (!valid) {
      success.hidden = true;
      firstBad.focus();
      return;
    }
    const name = el("name").value.trim();
    success.textContent = "Thank you, " + name + ". Your message has been sent. We will reply within one working day.";
    success.hidden = false;
    form.reset();
    alert("Message sent successfully!");
  });
}

// ---------- Start everything once the page is ready ----------
document.addEventListener("DOMContentLoaded", function () {
  initTheme();
  initClock();
  initWelcome();
  initSlideshow();
  initUpcoming();
  initEventsPage();
  initCalculator();
  initToggles();
  initGallery();
  initContactForm();
});
