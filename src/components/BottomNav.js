import { router } from "../router.js";
import { state } from "../state.js";

export const BottomNav = {
  init() {
    const navItems = document.querySelectorAll(".nav-item");
    const navIsland = document.querySelector(".nav-island-custom");

    // Apply theme to nav on init
    this.updateTheme();

    navItems.forEach((btn) => {
      const route = btn.dataset.route;

      // Set initial active state
      if (router.currentRoute === route) {
        btn.style.color = "white";
        btn.style.background = "#6366f1";
        btn.style.boxShadow = "0 4px 15px rgba(99, 102, 241, 0.4)";
      }

      // Add click handler
      btn.onclick = () => {
        router.navigate(route);
      };
    });

    // Listen for theme changes
    state.subscribe(() => {
      this.updateTheme();
    });
  },

  updateTheme() {
    const navIsland = document.querySelector(".nav-island-custom");
    const theme = state.theme;

    if (theme === "light") {
      navIsland.style.background = "rgba(255, 255, 255, 0.9)";
      navIsland.style.border = "1px solid rgba(0, 0, 0, 0.1)";
      navIsland.style.boxShadow = "0 10px 40px rgba(0, 0, 0, 0.1)";
    } else {
      navIsland.style.background = "rgba(19, 19, 26, 0.85)";
      navIsland.style.border = "1px solid rgba(255, 255, 255, 0.1)";
      navIsland.style.boxShadow = "0 10px 40px rgba(0, 0, 0, 0.4)";
    }
  },
};
