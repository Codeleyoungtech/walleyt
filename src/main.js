import "./styles/main.css";
import "./styles/components.css";
import "./styles/animations.css";

import { state } from "./state.js";
import { router } from "./router.js";
import { BottomNav } from "./components/BottomNav.js";
import { analytics } from "./utils/analytics.js";

// Pages
import { Home } from "./pages/Home.js";
import { Collections } from "./pages/Collections.js";
import { CollectionDetails } from "./pages/CollectionDetails.js";
import { Walle } from "./pages/Walle.js";
import { Details } from "./pages/Details.js";
import { Profile } from "./pages/Profile.js";

// App initialization
async function initApp() {
  const app = document.getElementById("app");

  // Show loading state
  app.innerHTML = `
    <div style="display: flex; justify-content: center; align-items: center; height: 100vh; color: var(--text-primary);">
      <div style="text-align: center;">
        <i class="fas fa-spinner fa-spin" style="font-size: 3rem; margin-bottom: 1rem;"></i>
        <p>Loading wallpapers...</p>
      </div>
    </div>
  `;

  try {
    // Initialize state (fetch from API)
    await state.init();

    // Initialize analytics
    await analytics.init();

    // Initialize router with routes (router.init handles navigation including URL params)
    router.init("app", {
      home: Home,
      collections: Collections,
      "collection-details": CollectionDetails,
      walle: Walle,
      profile: Profile,
      details: Details,
    });

    // Initialize bottom navigation
    BottomNav.init();
  } catch (error) {
    console.error("Failed to init app:", error);
    app.innerHTML =
      '<div style="text-align: center; padding: 2rem;">Failed to load application.</div>';
  }
}

// Start app when DOM is ready
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initApp);
} else {
  initApp();
}
