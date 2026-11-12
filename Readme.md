# Explore SA Events 🇿🇦

A dynamic, responsive, and accessible multi-page website built to promote local festivals, markets, sports, and heritage events across South Africa. 

This project was developed for the **WEB512 Formative Assessment 2**.

## ✨ Features

*   **Fully Responsive Design:** Adapts seamlessly to desktop, tablet, and mobile screens using CSS Grid and Flexbox.
*   **Dark Mode Toggle:** A persistent dark/light theme toggle that remembers the user's preference via `localStorage`.
*   **Interactive Slideshow:** Auto-playing image carousel on the home page with manual controls.
*   **Event Cost Calculator:** A dynamic calculator that computes ticket costs, applies group discounts, and generates a booking confirmation.
*   **Dynamic Event Loading:** Event cards are generated dynamically from a JavaScript array of objects.
*   **Gallery Filtering:** Instantly filter gallery images by category (Music, Food, Sport, etc.).
*   **Contact Form Validation:** Real-time JavaScript validation with accessible error messages.
*   **Current Date/Time:** Live clock in the header.

## 🛠️ Technologies Used

*   **HTML5:** Semantic markup (`<header>`, `<nav>`, `<main>`, `<section>`, `<article>`, `<figure>`, `<address>`).
*   **CSS3:** External stylesheet using CSS Variables (Custom Properties) for theming, Grid, Flexbox, and Media Queries.
*   **JavaScript (ES6):** External script handling all DOM manipulation and interactivity. No external libraries or frameworks used.

## 📁 File Structure

```text
explore-sa-events/
│
├── index.html          # Home page (Slideshow, upcoming events)
├── about.html          # About Us page (Video embed, team info)
├── events.html         # Events page (Table, Dynamic cards, Calculator)
├── gallery.html        # Gallery page (Filterable image grid)
├── contact.html        # Contact page (Validated form, Map)
│
├── css/
│   └── style.css       # All styling, responsive design, and theme variables
│
├── js/
│   └── script.js       # All interactive features and data handling
│
├── images/             # Local image assets used in the gallery and slideshow
│
└── project-report.md   # Assessment report and group contribution breakdown