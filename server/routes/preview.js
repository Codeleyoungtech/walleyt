// WhatsApp/Social Media Preview Endpoint
// Serves HTML with Open Graph meta tags for rich link previews

const Wallpaper = require("../models/Wallpaper");

module.exports = async (req, res) => {
  try {
    // Support both /share/:id and /?wallpaper=id
    const wallpaperId = req.params.id || req.query.wallpaper;

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
    // Use findOne with custom 'id' field, not findById (which expects ObjectId)
    const wallpaper = await Wallpaper.findOne({ id: wallpaperId });

    if (!wallpaper) {
      return res.status(404).send("Wallpaper not found");
    }

    // Use compressed image for social preview
    const compressedImage = `https://images.weserv.nl/?url=${wallpaper.filename.replace(
      /^https?:\/\//,
      ""
    )}&q=80`;

    // Frontend URL for redirect
    // If running locally, assume default Vite port. In production, use env var.
    const frontendUrl = process.env.FRONTEND_URL || "http://localhost:5173";

    // Construct the deep link to the details page
    // The router uses hash mode or history mode. Based on previous edits, it seems to handle both.
    // We'll target the details route directly.
    // If using hash routing: /#details?id=123 (or however router handles it)
    // Based on router.js, it checks URL params in init().
    // Let's stick to the query param approach that router.js supports: /?wallpaper=ID
    const targetUrl = `${frontendUrl}/?wallpaper=${wallpaperId}`;

    // Serve HTML with proper Open Graph tags
    const html = `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${wallpaper.title} - Walleyt</title>
    
    <!-- Open Graph / Facebook / WhatsApp -->
    <meta property="og:type" content="website">
    <meta property="og:url" content="${targetUrl}">
    <meta property="og:title" content="${wallpaper.title} - Walleyt">
    <meta property="og:description" content="${
      wallpaper.category
    } wallpaper in ${wallpaper.resolution || "HD"} quality.">
    <meta property="og:image" content="${compressedImage}">
    <meta property="og:image:width" content="1200">
    <meta property="og:image:height" content="630">
    
    <!-- Twitter -->
    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:url" content="${targetUrl}">
    <meta name="twitter:title" content="${wallpaper.title} - Walleyt">
    <meta name="twitter:description" content="${wallpaper.category} wallpaper">
    <meta name="twitter:image" content="${compressedImage}">
    
    <!-- Auto-redirect to frontend app -->
    <meta http-equiv="refresh" content="0;url=${targetUrl}">
    
    <style>
      body {
        font-family: system-ui, -apple-system, sans-serif;
        background: #0f172a;
        color: white;
        height: 100vh;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        margin: 0;
      }
      .loader {
        width: 48px;
        height: 48px;
        border: 5px solid #FFF;
        border-bottom-color: #6366f1;
        border-radius: 50%;
        display: inline-block;
        box-sizing: border-box;
        animation: rotation 1s linear infinite;
        margin-bottom: 20px;
      }
      @keyframes rotation {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
      }
    </style>
  </head>
  <body>
    <span class="loader"></span>
    <p>Redirecting to Walleyt...</p>
    <script>
      window.location.href = '${targetUrl}';
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
