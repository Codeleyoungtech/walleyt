import { state } from "../state.js";
import { router } from "../router.js";
import { Toast } from "../components/Toast.js";
import { RadialMenu } from "../components/RadialMenu.js";
import { getThumbnail, getOriginalImage } from "../utils/imageOptimization.js";
import { updateWallpaperMeta, getShareableURL } from "../utils/metaTags.js";

export function Details({ id }) {
  const container = document.createElement("div");
  container.className = "page detail-page";

  const wallpaper = state.wallpapers.find((w) => w.id === id);
  if (!wallpaper) {
    router.navigate("home");
    return container;
  }

  // Update meta tags for this wallpaper
  updateWallpaperMeta(wallpaper);

  const isWalle = state.walle.has(id);
  const thumbnailUrl = getThumbnail(wallpaper.filename);

  // Header Image
  const header = document.createElement("div");
  header.className = "detail-header";
  header.style.position = "relative";
  header.style.height = "60vh";
  header.style.background = "var(--surface-light)";

  header.innerHTML = `
    <button class="back-btn" style="position: absolute; top: 1.25rem; left: 1.25rem; width: 40px; height: 40px; border-radius: 50%; background: rgba(0, 0, 0, 0.7); backdrop-filter: blur(10px); border: 1px solid rgba(255, 255, 255, 0.1); color: white; display: flex; align-items: center; justify-content: center; cursor: pointer; z-index: 10;">
      <i class="fas fa-arrow-left"></i>
    </button>
    <button class="share-btn" style="position: absolute; top: 1.25rem; right: 1.25rem; width: 40px; height: 40px; border-radius: 50%; background: rgba(0, 0, 0, 0.7); backdrop-filter: blur(10px); border: 1px solid rgba(255, 255, 255, 0.1); color: white; display: flex; align-items: center; justify-content: center; cursor: pointer; z-index: 10;">
      <i class="fas fa-share-alt"></i>
    </button>
    <img src="${thumbnailUrl}" alt="${wallpaper.title}" class="detail-image" style="width: 100%; height: 100%; object-fit: cover;">
  `;

  // Back button - navigate to home
  header.querySelector(".back-btn").onclick = () => router.navigate("home");

  // Share button - with proper URL and meta tags
  header.querySelector(".share-btn").onclick = () => {
    // Update meta tags for this wallpaper
    updateWallpaperMeta(wallpaper);

    const shareUrl = getShareableURL(wallpaper.id);
    const shareData = {
      title: `${wallpaper.title} - Walleyt`,
      text: `Check out this ${wallpaper.category} wallpaper in ${
        wallpaper.resolution || "HD"
      } quality!`,
      url: shareUrl,
    };

    if (navigator.share) {
      navigator.share(shareData).catch(console.error);
    } else {
      navigator.clipboard.writeText(shareUrl);
      Toast.show("Link copied! Share it to see preview 🔗", "success");
    }
  };

  // Long press logic for Radial Menu
  const detailImage = header.querySelector(".detail-image");
  detailImage.style.pointerEvents = "none";

  let pressTimer;
  let startX, startY;

  const startPress = (e) => {
    const touch = e.touches[0];
    startX = touch.clientX;
    startY = touch.clientY;

    pressTimer = setTimeout(() => {
      e.preventDefault();
      RadialMenu.show({
        x: startX,
        y: startY,
        options: [
          { id: "share", icon: "fa-paper-plane" },
          { id: "walle", icon: "fa-heart" },
          { id: "save", icon: "fa-download" },
        ],
        onSelect: (actionId) => {
          if (actionId === "walle") {
            const newStatus = state.toggleWalle(id);
            const walleBtn = content.querySelector("#walle-btn");
            walleBtn.innerHTML = `<i class="fas fa-heart ${
              newStatus ? "" : "far"
            }"></i>`;
            Toast.show(
              newStatus ? "Added to Walle" : "Removed from Walle",
              "success"
            );
          } else if (actionId === "share") {
            if (navigator.share) {
              navigator
                .share({
                  title: "Walleyt",
                  text: `Check out this wallpaper: ${wallpaper.title}`,
                  url: window.location.href,
                })
                .catch(console.error);
            } else {
              Toast.show("Link copied to clipboard", "info");
              navigator.clipboard.writeText(window.location.href);
            }
          } else if (actionId === "save") {
            downloadWallpaper(wallpaper);
          }
        },
      });

      if (navigator.vibrate) navigator.vibrate(50);
    }, 500);
  };

  const cancelPress = () => clearTimeout(pressTimer);

  header.addEventListener("touchstart", startPress);
  header.addEventListener("touchend", cancelPress);
  header.addEventListener("touchmove", (e) => {
    const touch = e.touches[0];
    if (
      Math.abs(touch.clientX - startX) > 10 ||
      Math.abs(touch.clientY - startY) > 10
    ) {
      cancelPress();
    }
  });

  header.addEventListener("contextmenu", (e) => {
    e.preventDefault();
    e.stopPropagation();
    return false;
  });

  container.appendChild(header);

  // Content
  const content = document.createElement("div");
  content.className = "detail-content";
  content.style.padding = "1.5rem 1.25rem";

  content.innerHTML = `
    <h1 class="detail-title" style="font-size: 1.75rem; font-weight: 700; margin-bottom: 1rem;">${
      wallpaper.title
    }</h1>
    
    <div class="detail-tags" style="display: flex; flex-wrap: wrap; gap: 0.5rem; margin-bottom: 1.5rem;">
      ${(wallpaper.tags || [])
        .map(
          (tag) =>
            `<span class="tag" style="padding: 0.5rem 1rem; background: var(--surface); border: 1px solid var(--border); border-radius: 50px; font-size: 0.8125rem; color: var(-text-secondary);">#${tag}</span>`
        )
        .join("")}
    </div>

    <div class="action-buttons" style="display: flex; gap: 1rem; margin-bottom: 2rem;">
      <button class="btn btn-primary" id="set-wallpaper-btn" style="flex: 2;">
        <i class="fas fa-image"></i>
        Save to Device
      </button>
      <button class="btn btn-secondary icon-btn" id="walle-btn" style="flex: 0 0 50px;">
        <i class="fas fa-heart ${isWalle ? "" : "far"}"></i>
      </button>
      <button class="btn btn-secondary icon-btn" id="download-btn" style="flex: 0 0 50px;">
        <i class="fas fa-download"></i>
      </button>
    </div>

    <div class="detail-stats" style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 1rem; margin-bottom: 1.5rem;">
      <div class="stat-box" style="text-align: center; padding: 1rem; background: var(--surface); border-radius: 12px; border: 1px solid var(--border);">
        <div class="stat-value" style="font-size: 1.5rem; font-weight: 700; color: var(--primary); margin-bottom: 0.25rem;">${formatNumber(
          wallpaper.likes || 0
        )}</div>
        <div class="stat-label" style="font-size: 0.75rem; color: var(--text-secondary); text-transform: uppercase; letter-spacing: 0.5px;">Likes</div>
      </div>
      <div class="stat-box" style="text-align: center; padding: 1rem; background: var(--surface); border-radius: 12px; border: 1px solid var(--border);">
        <div class="stat-value" style="font-size: 1.5rem; font-weight: 700; color: var(--primary); margin-bottom: 0.25rem;">${formatNumber(
          wallpaper.downloads || 0
        )}</div>
        <div class="stat-label" style="font-size: 0.75rem; color: var(--text-secondary); text-transform: uppercase; letter-spacing: 0.5px;">Downloads</div>
      </div>
      <div class="stat-box" style="text-align: center; padding: 1rem; background: var(--surface); border-radius: 12px; border: 1px solid var(--border);">
        <div class="stat-value" style="font-size: 1.5rem; font-weight: 700; color: var(--primary); margin-bottom: 0.25rem;">${
          wallpaper.resolution || "HD"
        }</div>
        <div class="stat-label" style="font-size: 0.75rem; color: var(--text-secondary); text-transform: uppercase; letter-spacing: 0.5px;">Quality</div>
      </div>
    </div>
  `;

  // Event Listeners
  const walleBtn = content.querySelector("#walle-btn");
  walleBtn.onclick = () => {
    const newStatus = state.toggleWalle(id);
    walleBtn.innerHTML = `<i class="fas fa-heart ${
      newStatus ? "" : "far"
    }"></i>`;
    Toast.show(newStatus ? "Added to Walle" : "Removed from Walle", "success");
  };

  const downloadBtn = content.querySelector("#download-btn");
  downloadBtn.onclick = () => {
    downloadWallpaper(wallpaper);
  };

  const setBtn = content.querySelector("#set-wallpaper-btn");
  setBtn.onclick = () => {
    downloadWallpaper(wallpaper);
    Toast.show(
      "Image saved to device. Please set as wallpaper from your Gallery.",
      "success"
    );
  };

  container.appendChild(content);
  return container;
}

async function downloadWallpaper(wallpaper) {
  Toast.show("Starting download...", "info");
  try {
    // Use original full-res image for download
    const originalUrl = getOriginalImage(wallpaper.filename);
    const response = await fetch(originalUrl);
    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.style.display = "none";
    a.href = url;
    a.download = `walleyt-${wallpaper.title
      .toLowerCase()
      .replace(/\s+/g, "-")}.jpg`;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    state.addDownload(wallpaper.id);
    Toast.show("Download complete!", "success");
  } catch (err) {
    console.error(err);
    Toast.show("Download failed", "error");
  }
}

function formatNumber(num) {
  if (num >= 1000000) return (num / 1000000).toFixed(1) + "M";
  if (num >= 1000) return (num / 1000).toFixed(1) + "K";
  return num.toString();
}
