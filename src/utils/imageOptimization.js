// Image optimization utilities
// Automatically compress images using CDN proxy

const IMAGE_CDN = "https://images.weserv.nl/";

/**
 * Get compressed version of an image URL
 * @param {string} imageUrl - Original image URL
 * @param {number} quality - Quality (1-100), default 70
 * @returns {string} Compressed image URL
 */
export function getCompressedImage(imageUrl, quality = 70) {
  if (!imageUrl) return "";

  // Extract URL without protocol
  const urlWithoutProtocol = imageUrl.replace(/^https?:\/\//, "");

  // Build compressed URL
  return `${IMAGE_CDN}?url=${urlWithoutProtocol}&q=${quality}`;
}

/**
 * Get thumbnail version (compressed for cards/previews)
 */
export function getThumbnail(imageUrl) {
  return getCompressedImage(imageUrl, 70); // 70% quality for fast loading
}

/**
 * Get original full-quality image URL (for downloads)
 */
export function getOriginalImage(imageUrl) {
  return imageUrl; // Return unchanged for full quality
}
