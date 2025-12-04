// Meta Tag Utilities

import { getThumbnail } from "./imageOptimization.js";

export function updateMetaTags({ title, description, image, url }) {
  const metaTags = [
    { property: "og:title", content: title },
    { property: "og:description", content: description },
    { property: "og:image", content: image },
    { property: "og:url", content: url || window.location.href },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary_large_image" },
    { name: "twitter:title", content: title },
    { name: "twitter:description", content: description },
    { name: "twitter:image", content: image },
    { name: "twitter:url", content: url || window.location.href },
  ];

  metaTags.forEach(({ property, name, content }) => {
    const selector = property
      ? `meta[property="${property}"]`
      : `meta[name="${name}"]`;
    let tag = document.querySelector(selector);

    if (!tag) {
      tag = document.createElement("meta");
      if (property) tag.setAttribute("property", property);
      if (name) tag.setAttribute("name", name);
      document.head.appendChild(tag);
    }

    tag.setAttribute("content", content);
  });

  document.title = title;
}

export function updateWallpaperMeta(wallpaper) {
  const compressedImage = getThumbnail(wallpaper.filename);

  updateMetaTags({
    title: `${wallpaper.title} - Walleyt`,
    description: `${wallpaper.category} wallpaper in ${
      wallpaper.resolution || "HD"
    } quality.`,
    image: compressedImage,
    url: `${window.location.origin}?wallpaper=${wallpaper.id}`,
  });
}

export function resetMetaTags() {
  updateMetaTags({
    title: "Walleyt | Premium Wallpapers",
    description: "Premium 4K/8K Wallpapers for your device.",
    image: `${window.location.origin}/og-image.jpg`,
    url: window.location.origin,
  });
}

/**
 * Get shareable URL for a wallpaper
 * Returns backend URL that serves OG tags and redirects to app
 */
export function getShareableURL(wallpaperId) {
  // Use backend URL for social media previews
  // Example: https://api.walleyt.com/share/123
  const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:3000";
  // Remove trailing slash if present
  const cleanApiUrl = apiUrl.replace(/\/$/, "");
  return `${cleanApiUrl}/share/${wallpaperId}`;
}
