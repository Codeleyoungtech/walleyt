import { state } from "../state.js";
import { WallpaperCard } from "../components/WallpaperCard.js";
import { PageHeader } from "../components/PageHeader.js";

export function CollectionDetails({ id }) {
  const container = document.createElement("div");
  container.className = "page collection-details-page";
  container.style.paddingBottom = "80px";

  // Header with back button
  const title = id.charAt(0).toUpperCase() + id.slice(1);
  container.appendChild(
    PageHeader(title, [
      {
        icon: "fa-arrow-left",
        onClick: () => router.navigate("collections"),
      },
    ])
  );

  // Filter Wallpapers
  console.log("Collection ID:", id);
  console.log("Total wallpapers:", state.wallpapers.length);

  const filteredWallpapers = state.wallpapers.filter((w) => {
    // Check if it matches the special collection
    if (id === "Eleazar's Picks") {
      return w.tags && w.tags.includes("featured");
    }

    // Check category (case-insensitive)
    if (w.category && w.category.toLowerCase() === id.toLowerCase()) {
      return true;
    }

    // Check tags
    if (
      w.tags &&
      w.tags.map((t) => t.toLowerCase()).includes(id.toLowerCase())
    ) {
      return true;
    }

    return false;
  });

  console.log("Filtered wallpapers:", filteredWallpapers.length);
  console.log(
    "Sample wallpaper categories:",
    state.wallpapers.slice(0, 3).map((w) => w.category)
  );

  // Grid
  const grid = document.createElement("div");
  grid.className = "wallpaper-grid";
  grid.style.display = "grid";
  grid.style.gridTemplateColumns = "repeat(2, 1fr)";
  grid.style.gap = "1rem";
  grid.style.padding = "1.5rem 1.25rem"; // Added top padding

  if (filteredWallpapers.length === 0) {
    grid.innerHTML = `
      <div style="grid-column: 1 / -1; text-align: center; padding: 3rem 1rem; color: var(--text-secondary);">
        <i class="fas fa-image" style="font-size: 2rem; margin-bottom: 1rem; opacity: 0.5;"></i>
        <p>No wallpapers found in this collection.</p>
      </div>
    `;
  } else {
    filteredWallpapers.forEach((wallpaper) => {
      grid.appendChild(WallpaperCard(wallpaper));
    });
  }

  container.appendChild(grid);
  return container;
}
