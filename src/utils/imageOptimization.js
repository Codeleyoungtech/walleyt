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
 * Get thumbnail version (compressed for cards)
 * Uses WebP + High Compression (No Resize)
 */
export function getThumbnail(imageUrl) {
  if (!imageUrl) return "";
  const urlWithoutProtocol = imageUrl.replace(/^https?:\/\//, "");
  // output=webp: Use modern WebP format (smaller size)
  // q=60: Aggressive compression for thumbnails
  // il: Interlaced (progressive loading)
  return `${IMAGE_CDN}?url=${urlWithoutProtocol}&output=webp&q=60&il`;
}

/**
 * Get preview version (for details page and bottom sheet)
 * Uses WebP + Medium Compression (No Resize)
 */
export function getPreviewImage(imageUrl) {
  if (!imageUrl) return "";
  const urlWithoutProtocol = imageUrl.replace(/^https?:\/\//, "");
  // output=webp: Use modern WebP format
  // q=75: Good quality for previews
  // il: Interlaced
  return `${IMAGE_CDN}?url=${urlWithoutProtocol}&output=webp&q=75&il`;
}

/**
 * Get original full-quality image URL (for downloads)
 */
export function getOriginalImage(imageUrl) {
  return imageUrl; // Return unchanged for full quality
}
