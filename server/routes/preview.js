// WhatsApp/Social Media Preview Endpoint
// Serves HTML with Open Graph meta tags for rich link previews

const Wallpaper = require("../models/Wallpaper");

module.exports = async (req, res) => {
  try {
    const wallpaperId = req.query.wallpaper;

    if (!wallpaperId) {
      // No wallpaper ID - serve default preview
      return res.send(`<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Walleyt | Premium Wallpapers</title>
    <meta property="og:title" content="Walleyt | Premium Wallpapers">
    <meta property="og:description" content="Premium 4K/8K Wallpapers for your device.">
    <meta property="og:type" content="website">
    <meta http-equiv="refresh" content="0;url=/">
  </head>
  <body><p>Loading...</p></body>
</html>`);
    }

    // Fetch wallpaper from database
    const wallpaper = await Wallpaper.findById(wallpaperId);

    if (!wallpaper) {
      return res.status(404).send("Wallpaper not found");
    }

    // Use compressed image for social preview
    const compressedImage = `https://images.weserv.nl/?url=${wallpaper.filename.replace(
      /^https?:\/\//,
      ""
    )}&q=80`;
    const pageUrl = `${req.protocol}://${req.get(
      "host"
    )}?wallpaper=${wallpaperId}`;

    // Serve HTML with proper Open Graph tags
    const html = `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${wallpaper.title} - Walleyt</title>
    
    <!-- Open Graph / Facebook / WhatsApp -->
    <meta property="og:type" content="website">
    <meta property="og:url" content="${pageUrl}">
    <meta property="og:title" content="${wallpaper.title} - Walleyt">
    <meta property="og:description" content="${
      wallpaper.category
    } wallpaper in ${
      wallpaper.resolution || "HD"
    } quality. Download premium wallpapers for your device.">
    <meta property="og:image" content="${compressedImage}">
    <meta property="og:image:width" content="1200">
    <meta property="og:image:height" content="630">
    <meta property="og:image:type" content="image/jpeg">
    
    <!-- Twitter -->
    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:url" content="${pageUrl}">
    <meta name="twitter:title" content="${wallpaper.title} - Walleyt">
    <meta name="twitter:description" content="${
      wallpaper.category
    } wallpaper in ${wallpaper.resolution || "HD"} quality">
    <meta name="twitter:image" content="${compressedImage}">
    
    <!-- Auto-redirect to app -->
    <meta http-equiv="refresh" content="0;url=/?wallpaper=${wallpaperId}">
    
    <style>
      body {
        font-family: system-ui, -apple-system, sans-serif;
        display: flex;
        align-items: center;
        justify-content: center;
        min-height: 100vh;
        margin: 0;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        color: white;
      }
      .container {
        text-align: center;
        padding: 2rem;
      }
      .preview-image {
        max-width: 300px;
        border-radius: 16px;
        box-shadow: 0 20px 60px rgba(0,0,0,0.3);
        margin-bottom: 1.5rem;
      }
      .spinner {
        border: 3px solid rgba(255,255,255,0.2);
        border-top-color: white;
        border-radius: 50%;
        width: 40px;
        height: 40px;
        animation: spin 1s linear infinite;
        margin: 1rem auto;
      }
      @keyframes spin {
        to { transform: rotate(360deg); }
      }
      h1 { margin: 0 0 0.5rem; font-size: 1.5rem; }
      p { opacity: 0.9; margin: 0.5rem 0; }
    </style>
  </head>
  <body>
    <div class="container">
      <img src="${compressedImage}" alt="${
      wallpaper.title
    }" class="preview-image">
      <h1>${wallpaper.title}</h1>
      <p>${wallpaper.category} • ${wallpaper.resolution || "HD"}</p>
      <div class="spinner"></div>
      <p>Opening Walleyt...</p>
    </div>
    <script>
      // Redirect immediately
      setTimeout(() => {
        window.location.href = '/?wallpaper=${wallpaperId}';
      }, 100);
    </script>
  </body>
</html>`;

    res.set("Content-Type", "text/html");
    res.set("Cache-Control", "public, max-age=3600"); // Cache for 1 hour
    res.send(html);
  } catch (error) {
    console.error("Preview error:", error);
    res.status(500).send("Error generating preview");
  }
};
