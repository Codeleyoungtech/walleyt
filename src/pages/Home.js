import { state } from "../state.js";
import { WallpaperCard } from "../components/WallpaperCard.js";
import { PageHeader } from "../components/PageHeader.js";
import { Toast } from "../components/Toast.js";

export function Home() {
  const container = document.createElement("div");
  container.className = "page home-page";

  // Header
  const header = PageHeader("Walleyt", [
    {
      icon: "fa-bell",
      onClick: () => Toast.show("Feature coming soon!", "info"),
    },
  ]);
  container.appendChild(header);

  // Search Bar
  const searchContainer = document.createElement("div");
  searchContainer.className = "search-bar";
  searchContainer.innerHTML = `
    <i class="fas fa-search search-icon"></i>
    <input type="text" class="search-input" placeholder="Search wallpapers..." value="${state.searchQuery}">
  `;

  const input = searchContainer.querySelector("input");
  input.addEventListener("input", (e) => {
    state.setSearchQuery(e.target.value);
  });

  container.appendChild(searchContainer);

  // Categories (Horizontal Scroll)
  const categoriesContainer = document.createElement("div");
  categoriesContainer.className = "categories";
  categoriesContainer.style.display = "flex";
  categoriesContainer.style.gap = "0.75rem";
  categoriesContainer.style.padding = "0 1.25rem";
  categoriesContainer.style.marginBottom = "1.5rem";
  categoriesContainer.style.overflowX = "auto";
  categoriesContainer.style.scrollbarWidth = "none";

  // Add "Eleazar's Picks" as a special filter
  const categories = [
    "All",
    "Eleazar's Picks",
    ...new Set(state.wallpapers.map((w) => w.category)),
  ];

  categories.forEach((cat) => {
    const pill = document.createElement("div");
    pill.className = `category-pill ${
      state.currentCategory === cat ? "active" : ""
    }`;
    pill.textContent = cat;
    pill.style.padding = "0.625rem 1.25rem";
    pill.style.background =
      state.currentCategory === cat ? "var(--primary)" : "var(--surface)";
    pill.style.border =
      state.currentCategory === cat
        ? "1px solid var(--primary)"
        : "1px solid var(--border)";
    pill.style.borderRadius = "50px";
    pill.style.color =
      state.currentCategory === cat ? "white" : "var(--text-secondary)";
    pill.style.fontSize = "0.875rem";
    pill.style.fontWeight = "600";
    pill.style.whiteSpace = "nowrap";
    pill.style.cursor = "pointer";
    pill.style.transition = "var(--transition)";

    if (cat === "Eleazar's Picks") {
      pill.style.background = "linear-gradient(135deg, #6366f1, #a855f7)";
      pill.style.border = "none";
      pill.style.color = "white";
    }

    pill.onclick = () => {
      state.setCategory(cat);
    };

    categoriesContainer.appendChild(pill);
  });

  container.appendChild(categoriesContainer);

  // Featured: Eleazar's Picks (3 random)
  const featuredWallpapers = state.wallpapers
    .filter((w) => w.tags && w.tags.includes("featured"))
    .sort(() => 0.5 - Math.random())
    .slice(0, 3);

  if (featuredWallpapers.length > 0) {
    const featuredSection = document.createElement("div");
    featuredSection.style.cssText = `
      padding: 0 1.25rem;
      margin-bottom: 1.5rem;
    `;

    const featuredTitle = document.createElement("h2");
    featuredTitle.textContent = "✨ Eleazar's Picks";
    featuredTitle.style.cssText = `
      font-size: 1.125rem;
      font-weight: 700;
      margin-bottom: 1rem;
      background: linear-gradient(135deg, #6366f1, #a855f7);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    `;
    featuredSection.appendChild(featuredTitle);

    const featuredGrid = document.createElement("div");
    featuredGrid.style.cssText = `
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 0.75rem;
      margin-bottom: 1.5rem;
    `;

    featuredWallpapers.forEach((w) => {
      featuredGrid.appendChild(WallpaperCard(w));
    });

    featuredSection.appendChild(featuredGrid);
    container.appendChild(featuredSection);
  }

  // Masonry Grid using CSS Columns
  const grid = document.createElement("div");
  grid.className = "wallpaper-grid";
  grid.style.cssText = `
    column-count: 2;
    column-gap: 0.75rem;
    padding: 0 1.25rem;
  `;

  // Media query for larger screens
  const style = document.createElement("style");
  style.textContent = `
    @media (min-width: 400px) {
      .wallpaper-grid {
        column-count: 2;
      }
    }
  `;
  container.appendChild(style);

  const renderGrid = () => {
    grid.innerHTML = "";
    const filtered = state.getFilteredWallpapers();

    if (filtered.length === 0) {
      grid.innerHTML =
        '<div style="grid-column: 1/-1; text-align: center; padding: 3rem; color: var(--text-secondary);">No results found</div>';
      return;
    }

    filtered.forEach((w) => {
      grid.appendChild(WallpaperCard(w));
    });
  };

  renderGrid();
  container.appendChild(grid);

  // Subscribe to state changes to re-render
  state.subscribe(() => {
    renderGrid();

    // Update pills
    const pills = categoriesContainer.querySelectorAll(".category-pill");
    pills.forEach((p) => {
      const cat = p.textContent;
      if (cat === state.currentCategory) {
        p.classList.add("active");
        p.style.background =
          cat === "Eleazar's Picks"
            ? "linear-gradient(135deg, #6366f1, #a855f7)"
            : "var(--primary)";
        p.style.border =
          cat === "Eleazar's Picks" ? "none" : "1px solid var(--primary)";
        p.style.color = "white";
      } else {
        p.classList.remove("active");
        p.style.background =
          cat === "Eleazar's Picks"
            ? "linear-gradient(135deg, #6366f1, #a855f7)"
            : "var(--surface)";
        p.style.border =
          cat === "Eleazar's Picks" ? "none" : "1px solid var(--border)";
        p.style.color =
          cat === "Eleazar's Picks" ? "white" : "var(--text-secondary)";
        if (cat === "Eleazar's Picks") p.style.opacity = "0.8";
      }
    });
  });

  return container;
}
