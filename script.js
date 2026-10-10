/* Four extras demonstrated here:
   1. Light/dark theme toggle
   2. Project category filtering
   3. Copy email to clipboard
   4. Contact form validation with accessible feedback
*/
"use strict";

const root = document.documentElement;
const themeToggle = document.getElementById("themeToggle");
const themeIcon = document.getElementById("themeIcon");
const menuToggle = document.getElementById("menuToggle");
const navLinks = document.getElementById("navLinks");
const toast = document.getElementById("toast");

function showToast(message) {
  toast.textContent = message;
  toast.classList.add("show");
  window.setTimeout(() => toast.classList.remove("show"), 2600);
}

// Extra 1: theme toggle. The preference is stored only in this browser.
function applyTheme(theme) {
  root.dataset.theme = theme;
  const dark = theme === "dark";
  themeIcon.textContent = dark ? "☀" : "☾";
  themeToggle.setAttribute("aria-label", dark ? "Switch to light mode" : "Switch to dark mode");
  document.querySelector('meta[name="theme-color"]').setAttribute("content", dark ? "#111522" : "#f5f7fb");
}
let savedTheme = null;
try {
  savedTheme = localStorage.getItem("portfolio-theme");
} catch (error) {
  // The site still works if browser storage is unavailable.
}
applyTheme(savedTheme === "dark" ? "dark" : "light");
themeToggle.addEventListener("click", () => {
  const nextTheme = root.dataset.theme === "dark" ? "light" : "dark";
  applyTheme(nextTheme);
  try {
    localStorage.setItem("portfolio-theme", nextTheme);
  } catch (error) {
    // Theme changes for the current page still work.
  }
});

// Mobile navigation.
menuToggle.addEventListener("click", () => {
  const isOpen = navLinks.classList.toggle("open");
  menuToggle.setAttribute("aria-expanded", String(isOpen));
  menuToggle.setAttribute("aria-label", isOpen ? "Close navigation menu" : "Open navigation menu");
});
navLinks.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => {
    navLinks.classList.remove("open");
    menuToggle.setAttribute("aria-expanded", "false");
    menuToggle.setAttribute("aria-label", "Open navigation menu");
  });
});

// Extra 2: project category filtering.
const filterButtons = document.querySelectorAll(".filter-button");
const projectCards = document.querySelectorAll(".project-card");
filterButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const selectedFilter = button.dataset.filter;
    filterButtons.forEach((item) => {
      const selected = item === button;
      item.classList.toggle("active", selected);
      item.setAttribute("aria-pressed", String(selected));
    });
    projectCards.forEach((card) => {
      card.hidden = selectedFilter !== "all" && card.dataset.category !== selectedFilter;
    });
  });
});

// Extra 3: copy the contact email.
const copyEmailButton = document.getElementById("copyEmail");
const emailText = document.getElementById("emailText");
const copyFeedback = document.getElementById("copyFeedback");
copyEmailButton.addEventListener("click", async () => {
  const email = emailText.textContent.trim();
  try {
    await navigator.clipboard.writeText(email);
    copyFeedback.textContent = "Email copied to clipboard.";
  } catch (error) {
    // Fallback for browsers where Clipboard API is unavailable.
    const temporaryInput = document.createElement("textarea");
    temporaryInput.value = email;
    temporaryInput.setAttribute("readonly", "");
    temporaryInput.style.position = "absolute";
    temporaryInput.style.left = "-9999px";
    document.body.appendChild(temporaryInput);
    temporaryInput.select();
    const copied = document.execCommand("copy");
    temporaryInput.remove();
    copyFeedback.textContent = copied ? "Email copied to clipboard." : "Please copy the email manually.";
  }
});

// Extra 4: client-side form validation. This demo does not transmit data.
const contactForm = document.getElementById("contactForm");
const formMessage = document.getElementById("formMessage");
contactForm.addEventListener("submit", (event) => {
  event.preventDefault();
  formMessage.className = "form-message";
  const name = document.getElementById("name").value.trim();
  const email = document.getElementById("email").value.trim();
  const message = document.getElementById("message").value.trim();
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (name.length < 2) {
    formMessage.textContent = "Please enter a name with at least 2 characters.";
    formMessage.classList.add("error");
    document.getElementById("name").focus();
    return;
  }
  if (!emailPattern.test(email)) {
    formMessage.textContent = "Please enter a valid email address.";
    formMessage.classList.add("error");
    document.getElementById("email").focus();
    return;
  }
  if (message.length < 10) {
    formMessage.textContent = "Your message should contain at least 10 characters.";
    formMessage.classList.add("error");
    document.getElementById("message").focus();
    return;
  }
  formMessage.textContent = "Looks good! This demo form does not send messages yet.";
  formMessage.classList.add("success");
  showToast("Form validation completed.");
});

document.getElementById("year").textContent = new Date().getFullYear();
