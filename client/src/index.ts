import { initMobileMenuToggle } from "./modules/mobile_menu";
import { initContactForm } from "./modules/contact_form";
import "./main.scss";

window.addEventListener("load", () => {
  document.documentElement.style.setProperty(
    "--height",
    `${window.innerHeight}px`
  );
  initMobileMenuToggle();
  initContactForm();
});
