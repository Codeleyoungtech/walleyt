// Enhanced Bottom Sheet Modal Component
// Beautiful slide-up modal with improved design and share functionality

import { getShareableURL } from "../utils/metaTags.js";
import { getThumbnail } from "../utils/imageOptimization.js";

export function BottomSheet() {
  const overlay = document.createElement("div");
  overlay.className = "bottom-sheet-overlay";
  overlay.style.cssText = `
    position: fixed;
    inset: 0;
    background: rgba(0, 0, 0, 0.6);
    backdrop-filter: blur(4px);
    z-index: 9999;
    opacity: 0;
    transition: opacity 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  `;

  const sheet = document.createElement("div");
  sheet.className = "bottom-sheet";
  sheet.style.cssText = `
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    background: linear-gradient(180deg, rgba(22, 27, 34, 0.95) 0%, rgba(13, 17, 23, 0.98) 100%);
    backdrop-filter: blur(20px);
    -webkit-backdrop-filter: blur(20px);
    border-radius: 28px 28px 0 0;
    padding: 0;
    transform: translateY(100%);
    transition: transform 0.4s cubic-bezier(0.4, 0, 0.2, 1);
    z-index: 10000;
    max-height: 85vh;
    overflow: hidden;
    box-shadow: 0 -20px 60px rgba(0, 0, 0, 0.5), 0 0 1px rgba(255, 255, 255, 0.1) inset;
    border: 1px solid rgba(255, 255, 255, 0.05);
  `;

  // Drag handle
  const handleContainer = document.createElement("div");
  handleContainer.style.cssText = `
    padding: 16px 0 8px;
    display: flex;
    justify-content: center;
    cursor: grab;
  `;

  const handle = document.createElement("div");
  handle.style.cssText = `
    width: 48px;
    height: 5px;
    background: rgba(255, 255, 255, 0.3);
    border-radius: 3px;
    transition: all 0.2s;
  `;

  handleContainer.appendChild(handle);
  sheet.appendChild(handleContainer);

  // Add sheet to overlay!
  overlay.appendChild(sheet);

  // Drag functionality
  let startY = 0;
  let currentY = 0;

  const handleTouchStart = (e) => {
    startY = e.touches[0].clientY;
    handleContainer.style.cursor = "grabbing";
    handle.style.background = "rgba(255, 255, 255, 0.5)";
    handle.style.width = "64px";
  };

  const handleTouchMove = (e) => {
    currentY = e.touches[0].clientY;
    const diff = currentY - startY;
    if (diff > 0) {
      sheet.style.transform = `translateY(${diff}px)`;
    }
  };

  const handleTouchEnd = () => {
    const diff = currentY - startY;
    handleContainer.style.cursor = "grab";
    handle.style.background = "rgba(255, 255, 255, 0.3)";
    handle.style.width = "48px";

    if (diff > 100) {
      close();
    } else {
      sheet.style.transform = "translateY(0)";
    }
  };

  handleContainer.addEventListener("touchstart", handleTouchStart, {
    passive: true,
  });
  handleContainer.addEventListener("touchmove", handleTouchMove, {
    passive: true,
  });
  handleContainer.addEventListener("touchend", handleTouchEnd);

  // Close handlers
  const close = () => {
    overlay.style.opacity = "0";
    sheet.style.transform = "translateY(100%)";
    setTimeout(() => overlay.remove(), 400);
  };

  overlay.onclick = (e) => {
    if (e.target === overlay) close();
  };

  // Show animation
  requestAnimationFrame(() => {
    overlay.style.opacity = "1";
    sheet.style.transform = "translateY(0)";
  });

  return { overlay, sheet, close };
}

/**
 * Show enhanced bottom sheet with wallpaper actions
 */
export function showWallpaperActions(wallpaper, callbacks = {}) {
  const { overlay, sheet, close } = BottomSheet();

  const content = document.createElement("div");
  content.style.cssText = `
    padding: 0 0 24px;
    overflow-y: auto;
    max-height: calc(85vh - 48px);
  `;

  const thumbnailUrl = getThumbnail(wallpaper.filename);

  content.innerHTML = `
    <!-- Hero Wallpaper Preview -->
    <div style="
      position: relative;
      height: 280px;
      margin: 0 0 24px;
      overflow: hidden;
    ">
      <img src="${thumbnailUrl}" alt="${wallpaper.title}" 
        style="
          width: 100%;
          height: 100%;
          object-fit: cover;
          object-position: center;
        ">
      <div style="
        position: absolute;
        inset: 0;
        background: linear-gradient(180deg, transparent 0%, rgba(0,0,0,0.8) 100%);
      "></div>
      <div style="
        position: absolute;
        bottom: 20px;
        left: 20px;
        right: 20px;
      ">
        <h2 style="
          font-size: 1.5rem;
          font-weight: 700;
          color: white;
          margin: 0 0 8px;
          text-shadow: 0 2px 8px rgba(0,0,0,0.5);
        ">${wallpaper.title}</h2>
        <div style="
          display: flex;
          gap: 12px;
          flex-wrap: wrap;
        ">
          <span style="
            padding: 4px 12px;
            background: rgba(99, 102, 241, 0.9);
            border-radius: 20px;
            font-size: 0.75rem;
            font-weight: 600;
            color: white;
          ">${wallpaper.category}</span>
          <span style="
            padding: 4px 12px;
            background: rgba(255, 255, 255, 0.15);
            backdrop-filter: blur(10px);
            border-radius: 20px;
            font-size: 0.75rem;
            font-weight: 600;
            color: white;
          ">${wallpaper.resolution || "HD"}</span>
        </div>
      </div>
    </div>

    <!-- Actions -->
    <div style="padding: 0 20px;">
      <div class="action-list" style="display: grid; gap: 12px;">
        <button class="sheet-action" data-action="download" style="
          width: 100%;
          padding: 16px;
          background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
          border: none;
          border-radius: 16px;
          display: flex;
          align-items: center;
          gap: 16px;
          cursor: pointer;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          color: white;
          box-shadow: 0 4px 16px rgba(99, 102, 241, 0.4);
        ">
          <div style="
            width: 48px;
            height: 48px;
            background: rgba(255, 255, 255, 0.2);
            color: white;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 1.25rem;
          ">
            <i class="fas fa-download"></i>
          </div>
          <div style="text-align: left; flex: 1;">
            <div style="font-weight: 700; font-size: 1rem; margin-bottom: 2px;">Download Wallpaper</div>
            <div style="font-size: 0.8125rem; opacity: 0.9;">Save full resolution to your device</div>
          </div>
          <i class="fas fa-chevron-right" style="opacity: 0.6;"></i>
        </button>

        <button class="sheet-action" data-action="walle" style="
          width: 100%;
          padding: 16px;
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 16px;
          display: flex;
          align-items: center;
          gap: 16px;
          cursor: pointer;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          color: white;
        ">
          <div style="
            width: 48px;
            height: 48px;
            background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
            color: white;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 1.25rem;
          ">
            <i class="fas fa-heart"></i>
          </div>
          <div style="text-align: left; flex: 1;">
            <div style="font-weight: 600; margin-bottom: 2px;">Add to Walle</div>
            <div style="font-size: 0.8125rem; opacity: 0.6;">Save to your favorites</div>
          </div>
        </button>

        <button class="sheet-action" data-action="share" style="
          width: 100%;
          padding: 16px;
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 16px;
          display: flex;
          align-items: center;
          gap: 16px;
          cursor: pointer;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          color: white;
        ">
          <div style="
            width: 48px;
            height: 48px;
            background: linear-gradient(135deg, #10b981 0%, #059669 100%);
            color: white;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 1.25rem;
          ">
            <i class="fas fa-share-alt"></i>
          </div>
          <div style="text-align: left; flex: 1;">
            <div style="font-weight: 600; margin-bottom: 2px;">Share Wallpaper</div>
            <div style="font-size: 0.8125rem; opacity: 0.6;">Send to friends with preview</div>
          </div>
        </button>

        <button class="sheet-action" data-action="info" style="
          width: 100%;
          padding: 16px;
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 16px;
          display: flex;
          align-items: center;
          gap: 16px;
          cursor: pointer;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          color: white;
        ">
          <div style="
            width: 48px;
            height: 48px;
            background: linear-gradient(135deg, #6366f1 0%, #4f46e5 100%);
            color: white;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 1.25rem;
          ">
            <i class="fas fa-info"></i>
          </div>
          <div style="text-align: left; flex: 1;">
            <div style="font-weight: 600; margin-bottom: 2px;">View Details</div>
            <div style="font-size: 0.8125rem; opacity: 0.6;">See stats and information</div>
          </div>
        </button>
      </div>
    </div>
  `;

  sheet.appendChild(content);

  // Action handlers with enhanced effects
  content.querySelectorAll(".sheet-action").forEach((btn) => {
    btn.onmouseenter = () => {
      btn.style.transform = "translateY(-2px) scale(1.02)";
      if (btn.dataset.action === "download") {
        btn.style.boxShadow = "0 8px 24px rgba(99, 102, 241, 0.6)";
      } else {
        btn.style.background = "rgba(255, 255, 255, 0.08)";
        btn.style.borderColor = "rgba(255, 255, 255, 0.15)";
      }
    };
    btn.onmouseleave = () => {
      btn.style.transform = "translateY(0) scale(1)";
      if (btn.dataset.action === "download") {
        btn.style.boxShadow = "0 4px 16px rgba(99, 102, 241, 0.4)";
      } else {
        btn.style.background = "rgba(255, 255, 255, 0.05)";
        btn.style.borderColor = "rgba(255, 255, 255, 0.1)";
      }
    };

    btn.onclick = () => {
      const action = btn.dataset.action;
      if (callbacks[action]) {
        callbacks[action]();
      }
      close();
    };
  });

  document.body.appendChild(overlay);
  return { close };
}
