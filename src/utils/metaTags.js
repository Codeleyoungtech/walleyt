// Meta Tag Utilities
// Update Open Graph and Twitter Card meta tags dynamically

import { getThumbnail } from "./imageOptimization.js";

/**
 * Update meta tags for social sharing
 */
export function updateMetaTags({ title, description, image, url }) {
  // Update or create meta tags
  const metaTags = [
    // Open Graph
    { property: "og:title", content: title },
    { property: "og:description", content: description },
    { property: "og:image", content: image },
    { property: "og:url", content: url || window.location.href },
    { property: "og:type", content: "website" },

    // Twitter Card
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

  // Update document title
  document.title = title;
}

/**
 * Update meta tags for a wallpaper (uses compressed image for fast social preview loading!)
 */
export function updateWallpaperMeta(wallpaper) {
  // Use compressed thumbnail for social preview - faster loading!
  const compressedImage = getThumbnail(wallpaper.filename);

  updateMetaTags({
    title: `${wallpaper.title} - Walleyt`,
    description: `${wallpaper.category} wallpaper in ${
      wallpaper.resolution || "HD"
    } quality. Download premium wallpapers for your device.`,
    image: compressedImage, // Using compressed version!
    url: `${window.location.origin}${window.location.pathname}?wallpaper=${wallpaper.id}`,
  });
}

/**
 * Reset to default app meta tags
 */
export function resetMetaTags() {
  updateMetaTags({
    title: "Walleyt | Premium Wallpapers",
    description: "Premium 4K/8K Wallpapers for your device.",
    image: `${window.location.origin}/og-image.jpg`, // You can add a default OG image later
    url: window.location.origin,
  });
}

/**
 * Get shareable URL for a wallpaper
 */
export function getShareableURL(wallpaperId) {
  return `${window.location.origin}${window.location.pathname}?wallpaper=${wallpaperId}`;
}
