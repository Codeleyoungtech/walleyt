import { router } from "../router.js";
import { state } from "../state.js";
import { Toast } from "./Toast.js";
import { getThumbnail, getOriginalImage } from "../utils/imageOptimization.js";
import { showWallpaperActions } from "./BottomSheet.js";
import { getShareableURL, updateWallpaperMeta } from "../utils/metaTags.js";

export function WallpaperCard(wallpaper) {
  const card = document.createElement("div");
  card.className = "wallpaper-card";

  card.style.cssText = `
    position: relative;
    overflow: hidden;
    border-radius: 12px;
    cursor: pointer;
    transition: transform 0.3s;
    break-inside: avoid;
    margin-bottom: 0.75rem;
  `;

  const isWalle = state.walle.has(wallpaper.id);
  const thumbnailUrl = getThumbnail(wallpaper.filename);

  card.innerHTML = `
    <div class="wallpaper-image" style="width: 100%; position: relative; overflow: hidden; border-radius: 12px;">
      <img src="${thumbnailUrl}" alt="${
    wallpaper.title
  }" style="width: 100%; display: block; object-fit: cover;" loading="lazy">
      
      <!-- Three-dot menu button (always visible) -->
      <button class="menu-btn" style="
        position: absolute;
        top: 0.5rem;
        right: 0.5rem;
        width: 32px;
        height: 32px;
        border-radius: 50%;
        background: rgba(0, 0, 0, 0.6);
        backdrop-filter: blur(10px);
        border: 1px solid rgba(255, 255, 255, 0.2);
        color: white;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        transition: all 0.2s;
        z-index: 10;
      ">
        <i class="fas fa-ellipsis-v"></i>
      </button>
      
      <!-- Walle indicator (if favorited) -->
      ${
        isWalle
          ? `
      <div style="
        position: absolute;
        bottom: 0.5rem;
        left: 0.5rem;
        padding: 0.25rem 0.625rem;
        background: rgba(239, 68, 68, 0.9);
        backdrop-filter: blur(10px);
        border-radius: 12px;
        color: white;
        font-size: 0.75rem;
        font-weight: 600;
        display: flex;
        align-items: center;
        gap: 0.375rem;
      ">
        <i class="fas fa-heart"></i>
        Walle
      </div>
      `
          : ""
      }
    </div>
  `;

  const imageContainer = card.querySelector(".wallpaper-image");
  const img = card.querySelector("img");
  const menuBtn = card.querySelector(".menu-btn");

  // Menu button hover effect
  menuBtn.onmouseenter = () => {
    menuBtn.style.transform = "scale(1.1)";
    menuBtn.style.background = "rgba(0, 0, 0, 0.8)";
  };
  menuBtn.onmouseleave = () => {
    menuBtn.style.transform = "scale(1)";
    menuBtn.style.background = "rgba(0, 0, 0, 0.6)";
  };

  // Menu button click - show bottom sheet
  menuBtn.onclick = (e) => {
    e.stopPropagation();

    showWallpaperActions(wallpaper, {
      download: async () => {
        Toast.show("Starting download...", "info");
        try {
          const originalUrl = getOriginalImage(wallpaper.filename);
          const response = await fetch(originalUrl);
          const blob = await response.blob();
          const url = window.URL.createObjectURL(blob);
          const a = document.createElement("a");
          a.href = url;
          a.download = `${wallpaper.title.replace(/\s+/g, "_")}.jpg`;
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
          window.URL.revokeObjectURL(url);

          state.addDownload(wallpaper.id);
          Toast.show("Download started! 📥", "success");
        } catch (error) {
          Toast.show("Download failed", "error");
        }
      },
      walle: () => {
        const newStatus = state.toggleWalle(wallpaper.id);
        Toast.show(
          newStatus ? "Added to Walle ❤️" : "Removed from Walle",
          "success"
  };

  // Navigate to details on image click
  imageContainer.onclick = (e) => {
    // Don't navigate if clicking menu button
    if (e.target.closest(".menu-btn")) return;
    router.navigate("details", { id: wallpaper.id });
  };

  return card;
}
