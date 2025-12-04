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
    background: var(--surface);
    border-radius: 28px 28px 0 0;
    padding: 0;
    transform: translateY(100%);
    transition: transform 0.4s cubic-bezier(0.4, 0, 0.2, 1);
    z-index: 10000;
    max-height: 85vh;
    overflow: hidden;
    box-shadow: 0 -20px 60px rgba(0, 0, 0, 0.3);
    border: 1px solid var(--border);
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
  const shareUrl = getShareableURL(wallpaper.id);

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

    <!-- Share via Social Platforms -->
    <div style="padding: 0 20px 24px;">
      <h3 style="
        font-size: 0.875rem;
        font-weight: 600;
        color: var(--text-secondary);
        margin-bottom: 12px;
        text-transform: uppercase;
        letter-spacing: 0.5px;
      ">Share via</h3>
      <div style="
        display: flex;
        gap: 16px;
        overflow-x: auto;
        padding-bottom: 8px;
        scrollbar-width: none;
        -ms-overflow-style: none;
      " class="social-scroll">
        <style>
          .social-scroll::-webkit-scrollbar {
            display: none;
          }
        </style>
        
        <!-- WhatsApp -->
        <div class="social-icon" data-platform="whatsapp" style="
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 8px;
          cursor: pointer;
          flex-shrink: 0;
        ">
          <div style="
            width: 56px;
            height: 56px;
            border-radius: 50%;
            background: linear-gradient(135deg, #25D366 0%, #128C7E 100%);
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
            font-size: 1.5rem;
            transition: transform 0.2s;
          ">
            <i class="fab fa-whatsapp"></i>
          </div>
          <span style="font-size: 0.75rem; color: var(--text-secondary);">WhatsApp</span>
        </div>

        <!-- Instagram -->
        <div class="social-icon" data-platform="instagram" style="
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 8px;
          cursor: pointer;
          flex-shrink: 0;
        ">
          <div style="
            width: 56px;
            height: 56px;
            border-radius: 50%;
            background: linear-gradient(45deg, #f09433 0%, #e6683c 25%, #dc2743 50%, #cc2366 75%, #bc1888 100%);
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
            font-size: 1.5rem;
            transition: transform 0.2s;
          ">
            <i class="fab fa-instagram"></i>
          </div>
          <span style="font-size: 0.75rem; color: var(--text-secondary);">Instagram</span>
        </div>

        <!-- Messenger -->
        <div class="social-icon" data-platform="messenger" style="
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 8px;
          cursor: pointer;
          flex-shrink: 0;
        ">
          <div style="
            width: 56px;
            height: 56px;
            border-radius: 50%;
            background: linear-gradient(135deg, #00B2FF 0%, #006AFF 100%);
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
            font-size: 1.5rem;
            transition: transform 0.2s;
          ">
            <i class="fab fa-facebook-messenger"></i>
          </div>
          <span style="font-size: 0.75rem; color: var(--text-secondary);">Messenger</span>
        </div>

        <!-- X (Twitter) -->
        <div class="social-icon" data-platform="x" style="
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 8px;
          cursor: pointer;
          flex-shrink: 0;
        ">
          <div style="
            width: 56px;
            height: 56px;
            border-radius: 50%;
            background: #000000;
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
            font-size: 1.5rem;
            transition: transform 0.2s;
          ">
            <i class="fab fa-x-twitter"></i>
          </div>
          <span style="font-size: 0.75rem; color: var(--text-secondary);">X</span>
        </div>

        <!-- Facebook -->
        <div class="social-icon" data-platform="facebook" style="
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 8px;
          cursor: pointer;
          flex-shrink: 0;
        ">
          <div style="
            width: 56px;
            height: 56px;
            border-radius: 50%;
            background: linear-gradient(135deg, #1877F2 0%, #0c5bc6 100%);
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
            font-size: 1.5rem;
            transition: transform 0.2s;
          ">
            <i class="fab fa-facebook-f"></i>
          </div>
          <span style="font-size: 0.75rem; color: var(--text-secondary);">Facebook</span>
        </div>

        <!-- Telegram -->
        <div class="social-icon" data-platform="telegram" style="
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 8px;
          cursor: pointer;
          flex-shrink: 0;
        ">
          <div style="
            width: 56px;
            height: 56px;
            border-radius: 50%;
            background: linear-gradient(135deg, #0088cc 0%, #006699 100%);
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
            font-size: 1.5rem;
            transition: transform 0.2s;
          ">
            <i class="fab fa-telegram-plane"></i>
          </div>
          <span style="font-size: 0.75rem; color: var(--text-secondary);">Telegram</span>
        </div>

        <!-- Copy Link -->
        <div class="social-icon" data-platform="copy" style="
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 8px;
          cursor: pointer;
          flex-shrink: 0;
        ">
          <div class="copy-icon-circle" style="
            width: 56px;
            height: 56px;
            border-radius: 50%;
            background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
            font-size: 1.5rem;
            transition: all 0.3s;
          ">
            <i class="fas fa-link copy-icon"></i>
          </div>
          <span style="font-size: 0.75rem; color: var(--text-secondary);">Copy Link</span>
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
          background: var(--surface-light);
          border: 1px solid var(--border);
          border-radius: 16px;
          display: flex;
          align-items: center;
          gap: 16px;
          cursor: pointer;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          color: var(--text);
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

        <button class="sheet-action" data-action="info" style="
          width: 100%;
          padding: 16px;
          background: var(--surface-light);
          border: 1px solid var(--border);
          border-radius: 16px;
          display: flex;
          align-items: center;
          gap: 16px;
          cursor: pointer;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          color: var(--text);
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

  content.querySelectorAll(".social-icon").forEach((icon) => {
    const circle = icon.querySelector("div");

    icon.onmouseenter = () => {
      circle.style.transform = "scale(1)";
    };
    icon.onmouseleave = () => {
      circle.style.transform = "scale(1)";
    };

    icon.onclick = () => {
      const platform = icon.dataset.platform;
      const shareUrl = getShareableURL(wallpaper.id);
      const text = `Check out this ${wallpaper.category} wallpaper: ${wallpaper.title}`;

      if (platform === "whatsapp") {
        window.open(
          `https://wa.me/?text=${encodeURIComponent(text + " " + shareUrl)}`,
          "_blank"
        );
      } else if (platform === "twitter" || platform === "x") {
        window.open(
          `https://twitter.com/intent/tweet?text=${encodeURIComponent(
            text
          )}&url=${encodeURIComponent(shareUrl)}`,
          "_blank"
        );
      } else if (platform === "facebook") {
        window.open(
          `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
            shareUrl
          )}`,
          "_blank"
        );
      } else if (platform === "messenger") {
        window.open(
          `fb-messenger://share/?link=${encodeURIComponent(shareUrl)}`,
          "_blank"
        );
      } else if (platform === "instagram") {
        navigator.clipboard.writeText(shareUrl);
        const iIcon = icon.querySelector("i");
        const originalClass = iIcon.className;
        iIcon.className = "fas fa-check";
        setTimeout(() => {
          iIcon.className = originalClass;
        }, 2000);
        alert("Link copied! Open Instagram to share.");
      } else if (platform === "telegram") {
        window.open(
          `https://t.me/share/url?url=${encodeURIComponent(
            shareUrl
          )}&text=${encodeURIComponent(text)}`,
          "_blank"
        );
      } else if (platform === "copy") {
        navigator.clipboard.writeText(shareUrl);
        const copyIcon = icon.querySelector(".copy-icon");
        const copyCircle = icon.querySelector(".copy-icon-circle");

        copyIcon.className = "fas fa-check copy-icon";
        copyCircle.style.background =
          "linear-gradient(135deg, #10b981 0%, #059669 100%)";

        setTimeout(() => {
          copyIcon.className = "fas fa-link copy-icon";
          copyCircle.style.background =
            "linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)";
        }, 2000);
      }
    };
  });

  content.querySelectorAll(".sheet-action").forEach((btn) => {
    btn.onmouseenter = () => {
      btn.style.transform = "translateY(-2px) scale(1.02)";
      if (btn.dataset.action === "download") {
        btn.style.boxShadow = "0 8px 24px rgba(99, 102, 241, 0.6)";
      } else {
        btn.style.background = "var(--surface-hover)";
      }
    };
    btn.onmouseleave = () => {
      btn.style.transform = "translateY(0) scale(1)";
      if (btn.dataset.action === "download") {
        btn.style.boxShadow = "0 4px 16px rgba(99, 102, 241, 0.4)";
      } else {
        btn.style.background = "var(--surface-light)";
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

  sheet.appendChild(content);

  document.body.appendChild(overlay);
  return { close };
}
