export const router = {
  routes: {},
  currentRoute: null,
  appContainer: null,

  init(containerId, routes) {
    this.appContainer = document.getElementById(containerId);
    this.routes = routes;

    // Check for wallpaper URL parameter (from shared links)
    const urlParams = new URLSearchParams(window.location.search);
    const wallpaperId = urlParams.get("wallpaper");

    if (wallpaperId) {
      // Navigate to details page with the wallpaper ID
      this.navigate("details", { id: wallpaperId });
    } else {
      // Handle initial route - go to home
      this.navigate("home");
    }
  },

  navigate(route, params = {}) {
    if (this.routes[route]) {
      this.currentRoute = route;

      // Clear container
      this.appContainer.innerHTML = "";

      // Render new page
      const pageContent = this.routes[route](params);
      this.appContainer.appendChild(pageContent);

      // Add animation class
      pageContent.classList.add("page-transition");

      // Scroll to top
      window.scrollTo(0, 0);

      // Update bottom nav active state with inline styles
      document.querySelectorAll(".nav-item").forEach((item) => {
        const itemRoute = item.dataset.route;
        // Keep collections active when viewing collection details
        const isActive =
          itemRoute === route ||
          (route === "collection-details" && itemRoute === "collections");

        if (isActive) {
          item.style.color = "white";
          item.style.background = "#6366f1";
          item.style.boxShadow = "0 4px 15px rgba(99, 102, 241, 0.4)";
        } else {
          item.style.color = "#94a3b8";
          item.style.background = "transparent";
          item.style.boxShadow = "none";
        }
      });
    }
  },
};
