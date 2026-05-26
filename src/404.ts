import { setupLayout } from "./common";

document.addEventListener("DOMContentLoaded", () => {
  // Leverage the premium shared layout container
  setupLayout("pantry"); // default style layout matching structure
  
  // Custom interactive tweaks can be added here if needed
  const form = document.getElementById("search-404-form") as HTMLFormElement | null;
  if (form) {
    form.addEventListener("submit", (e) => {
      // Allow default submit query string forwarding to search.html which loads it nicely
    });
  }
});
