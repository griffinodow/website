/**
 * The mobile menu.
 */
const mobileMenu = document.getElementById("mobile-menu");

/**
 * If the mobile menu is open.
 */
let mobileMenuOpen = false;

/**
 * Initializes the mobile menu toggle button.
 */
const mobileMenuToggle = () => {
  mobileMenuOpen = !mobileMenuOpen;
  if (mobileMenuOpen) {
    mobileMenu.classList.remove("hidden");
  } else {
    mobileMenu.classList.add("hidden");
  }
};

/**
 * Toggles the visibility of the mobile menu.
 */
export const initMobileMenuToggle = () => {
  document
    .getElementById("menu-toggle")
    .addEventListener("click", () => mobileMenuToggle());
};
