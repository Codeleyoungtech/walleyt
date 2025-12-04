import { state } from "../state.js";
import { WallpaperCard } from "../components/WallpaperCard.js";
import { PageHeader } from "../components/PageHeader.js";

export function Walle() {
  const container = document.createElement("div");
  container.className = "page walle-page";

  container.appendChild(PageHeader("Walle"));

  const content = document.createElement("div");
  content.id = "walle-content";

  const render = () => {
    content.innerHTML = "";

    if (state.walle.size === 0) {
      content.innerHTML = `
        <div class="empty-state" style="display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 4rem 2rem; text-align: center; min-height: 60vh;">
          <i class="fas fa-heart empty-icon" style="font-size: 4rem; color: var(--text-secondary); margin-bottom: 1rem; opacity: 0.5;"></i>
          <div class="empty-title" style="font-size: 1.25rem; font-weight: 600; margin-bottom: 0.5rem;">No Walle items yet</div>
          <div class="empty-text" style="color: var(--text-secondary);">Start adding wallpapers to your Walle</div>
        </div>
      `;
      return;
    }

    const grid = document.createElement("div");
    grid.className = "wallpaper-grid";
    grid.style.display = "grid";
    grid.style.gridTemplateColumns = "repeat(2, 1fr)";
    grid.style.gap = "1rem";
    grid.style.padding = "0 1.25rem";

    const walleWallpapers = state.wallpapers.filter((w) =>
      state.walle.has(w.id)
    );

    walleWallpapers.forEach((w) => {
      grid.appendChild(WallpaperCard(w));
    });

    content.appendChild(grid);
  };

  render();
  container.appendChild(content);

  return container;
}
