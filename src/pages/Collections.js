import { state } from "../state.js";
import { router } from "../router.js";
import { PageHeader } from "../components/PageHeader.js";
import { getThumbnail } from "../utils/imageOptimization.js";

export function Collections() {
  const container = document.createElement("div");
  container.className = "page collections-page";

  container.appendChild(PageHeader("Collections"));

  const grid = document.createElement("div");
  grid.style.padding = "1.5rem 1.25rem";
  grid.style.display = "grid";
  grid.style.gridTemplateColumns = "1fr";
  grid.style.gap = "1.5rem";

  // Special "Eleazar's Picks" Collection
  const specialCollection = createCollectionCard(
    "Eleazar's Picks",
    "Hand-picked favorites",
    "linear-gradient(135deg, #6366f1, #a855f7)",
    "fa-star"
  );
  grid.appendChild(specialCollection);

  // Standard Categories
  // Normalize categories to Title Case to merge duplicates (e.g. "nature" & "Nature")
  const toTitleCase = (str) => {
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
  };

  const uniqueCategories = new Set();
  state.wallpapers.forEach((w) => {
    if (w.category) {
      uniqueCategories.add(toTitleCase(w.category));
    }
  });

  const categories = [...uniqueCategories].sort();

  categories.forEach((cat) => {
    // Find a cover image for the category
    // Case-insensitive matching for cover image
    const coverWallpaper = state.wallpapers.find(
      (w) => w.category.toLowerCase() === cat.toLowerCase()
    );
    // Count wallpapers in this category (case-insensitive)
    const count = state.wallpapers.filter(
      (w) => w.category.toLowerCase() === cat.toLowerCase()
    ).length;

    const cover = coverWallpaper ? getThumbnail(coverWallpaper.filename) : null;
    const card = createCollectionCard(
      cat,
      `${count} Wallpapers`,
      null,
      null,
      cover
    );
    grid.appendChild(card);
  });

  container.appendChild(grid);
  return container;
}

function createCollectionCard(title, subtitle, background, icon, image) {
  const card = document.createElement("div");
  card.className = "collection-card";
  card.style.height = "160px";
  card.style.borderRadius = "20px";
  card.style.position = "relative";
  card.style.overflow = "hidden";
  card.style.cursor = "pointer";
  card.style.transition = "transform 0.3s ease";
  card.style.border = "1px solid var(--border)";

  if (image) {
    card.innerHTML = `
      <img src="${image}" style="width: 100%; height: 100%; object-fit: cover; transition: transform 0.5s ease;">
      <div style="position: absolute; inset: 0; background: linear-gradient(to top, rgba(0,0,0,0.8), transparent);"></div>
    `;
  } else {
    card.style.background = background || "var(--surface)";
  }

  const content = document.createElement("div");
  content.style.position = "absolute";
  content.style.bottom = "0";
  content.style.left = "0";
  content.style.padding = "1.5rem";
  content.style.width = "100%";

  content.innerHTML = `
    <div style="display: flex; align-items: center; gap: 0.75rem; color: white;">
      ${
        icon
          ? `<i class="fas ${icon}" style="font-size: 1.5rem; color: #fbbf24;"></i>`
          : ""
      }
      <div>
        <h3 style="font-size: 1.25rem; font-weight: 700; margin-bottom: 0.25rem;">${title}</h3>
        <p style="font-size: 0.875rem; opacity: 0.8;">${subtitle}</p>
      </div>
    </div>
  `;

  card.appendChild(content);

  card.onclick = () => {
    // Check if it's the special collection or a standard category
    if (title === "Eleazar's Picks") {
      router.navigate("collection-details", { id: "Eleazar's Picks" });
    } else {
      router.navigate("collection-details", { id: title });
    }
  };

  // Hover effect
  card.onmouseenter = () => {
    card.style.transform = "scale(1.02)";
    if (image) card.querySelector("img").style.transform = "scale(1.1)";
  };
  card.onmouseleave = () => {
    card.style.transform = "scale(1)";
    if (image) card.querySelector("img").style.transform = "scale(1)";
  };

  return card;
}
