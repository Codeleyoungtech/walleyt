import { router } from "../router.js";
import { state } from "../state.js";
import { Toast } from "./Toast.js";
import { RadialMenu } from "./RadialMenu.js";

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

  card.innerHTML = `
    <div class="wallpaper-image" style="width: 100%; position: relative; overflow: hidden; border-radius: 12px;">
      <img src="${wallpaper.filename}" alt="${
    wallpaper.title
  }" style="width: 100%; display: block; object-fit: cover;" loading="lazy">
      
      <!-- Hover Overlay with all actions -->
      <div class="wallpaper-overlay" style="position: absolute; inset: 0; background: linear-gradient(to top, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0.4) 50%, transparent 70%); opacity: 0; transition: opacity 0.3s; display: flex; flex-direction: column; justify-content: space-between; padding: 0.75rem;">
        
        <!-- Top actions: Add to Collection -->
        <div style="display: flex; justify-content: flex-end;">
          <button class="add-collection-btn" style="
            width: 32px;
            height: 32px;
            border-radius: 50%;
            background: rgba(255,255,255,0.2);
            backdrop-filter: blur(10px);
            border: 1px solid rgba(255,255,255,0.3);
            color: white;
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            transition: all 0.2s;
            font-size: 0.875rem;
          ">
            <i class="fas fa-folder-plus"></i>
          </button>
        </div>
        
        <!-- Bottom info and actions -->
        <div>
          <div class="wallpaper-info" style="margin-bottom: 0.75rem;">
            <div style="font-size: 0.875rem; font-weight: 600; color: white; margin-bottom: 0.25rem;">${
              wallpaper.title
            }</div>
            <div style="font-size: 0.75rem; color: rgba(255,255,255,0.8);">${
              wallpaper.category
            }</div>
          </div>
          
          <!-- Action buttons row -->
          <div style="display: flex; gap: 0.5rem;">
            <button class="walle-btn" style="
              flex: 1;
              padding: 0.5rem;
              border-radius: 8px;
              background: ${
                isWalle ? "rgba(239, 68, 68, 0.3)" : "rgba(255,255,255,0.2)"
              };
              backdrop-filter: blur(10px);
              border: 1px solid ${
                isWalle ? "rgba(239, 68, 68, 0.5)" : "rgba(255,255,255,0.3)"
              };
              color: ${isWalle ? "#ef4444" : "white"};
              display: flex;
              align-items: center;
              justify-content: center;
              gap: 0.375rem;
              cursor: pointer;
              transition: all 0.2s;
              font-size: 0.8125rem;
              font-weight: 500;
            ">
              <i class="fas fa-heart"></i>
              <span>${isWalle ? "Walle" : "Walle"}</span>
            </button>
            
            <button class="download-btn" style="
              flex: 1;
              padding: 0.5rem;
              border-radius: 8px;
              background: rgba(255,255,255,0.2);
              backdrop-filter: blur(10px);
              border: 1px solid rgba(255,255,255,0.3);
              color: white;
              display: flex;
              align-items: center;
              justify-content: center;
              gap: 0.375rem;
              cursor: pointer;
              transition: all 0.2s;
              font-size: 0.8125rem;
              font-weight: 500;
            ">
              <i class="fas fa-download"></i>
              <span>Download</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  `;

  const imageContainer = card.querySelector(".wallpaper-image");
  const overlay = card.querySelector(".wallpaper-overlay");
  const img = card.querySelector("img");
  const walleBtn = card.querySelector(".walle-btn");
  const downloadBtn = card.querySelector(".download-btn");
  const addCollectionBtn = card.querySelector(".add-collection-btn");

  // Hover effects
  imageContainer.onmouseenter = () => {
    overlay.style.opacity = "1";
    img.style.transform = "scale(1.05)";
  };

  imageContainer.onmouseleave = () => {
    overlay.style.opacity = "0";
    img.style.transform = "scale(1)";
  };

  // Walle button
  walleBtn.onclick = (e) => {
    e.stopPropagation();
    const newStatus = state.toggleWalle(wallpaper.id);

    // Update button styles
    if (newStatus) {
      walleBtn.style.background = "rgba(239, 68, 68, 0.3)";
      walleBtn.style.borderColor = "rgba(239, 68, 68, 0.5)";
      walleBtn.style.color = "#ef4444";
    } else {
      walleBtn.style.background = "rgba(255,255,255,0.2)";
      walleBtn.style.borderColor = "rgba(255,255,255,0.3)";
      walleBtn.style.color = "white";
    }

    Toast.show(
      newStatus ? "Added to Walle ❤️" : "Removed from Walle",
      "success"
    );
  };

  // Download button
  downloadBtn.onclick = async (e) => {
    e.stopPropagation();
    Toast.show("Starting download...", "info");

    try {
      const response = await fetch(wallpaper.filename);
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
  };

  // Add to collection button
  addCollectionBtn.onclick = (e) => {
    e.stopPropagation();
    Toast.show("Add to Collection feature coming soon!", "info");
  };

  // Button hover effects
  [walleBtn, downloadBtn, addCollectionBtn].forEach((btn) => {
    btn.onmouseenter = () => {
      btn.style.transform = "scale(1.05)";
    };
    btn.onmouseleave = () => {
      btn.style.transform = "scale(1)";
    };
  });

  // Navigate to details on image click
  imageContainer.onclick = (e) => {
    // Don't navigate if clicking buttons
    if (e.target.closest("button")) return;
    router.navigate("details", { id: wallpaper.id });
  };

  // Long press for radial menu
  let pressTimer;
  let longPressTriggered = false;

  const startPress = (e) => {
    longPressTriggered = false;
    pressTimer = setTimeout(() => {
      longPressTriggered = true;
      e.preventDefault();
      const menu = RadialMenu(
        wallpaper,
        e.pageX || e.touches[0].pageX,
        e.pageY || e.touches[0].pageY
      );
      document.body.appendChild(menu);
    }, 500);
  };

  const cancelPress = () => {
    clearTimeout(pressTimer);
  };

  const handlePress = (e) => {
    if (longPressTriggered) {
      e.preventDefault();
    }
  };

  imageContainer.addEventListener("mousedown", startPress);
  imageContainer.addEventListener("mouseup", cancelPress);
  imageContainer.addEventListener("mouseleave", cancelPress);
  imageContainer.addEventListener("touchstart", startPress, { passive: false });
  imageContainer.addEventListener("touchend", handlePress);
  imageContainer.addEventListener("touchmove", cancelPress);

  return card;
}
