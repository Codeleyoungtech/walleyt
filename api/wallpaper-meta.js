export const config = {
  runtime: "edge",
};

export default async function handler(request) {
  const url = new URL(request.url);
  const wallpaperId = url.searchParams.get("wallpaper");

  // Detect if request is from a crawler (WhatsApp, Facebook, Twitter, etc.)
  const userAgent = request.headers.get("user-agent") || "";
  const isCrawler =
    /facebookexternalhit|WhatsApp|Twitterbot|LinkedInBot|Slackbot|TelegramBot/i.test(
      userAgent
    );

  // If no wallpaper ID or not a crawler, return null to continue to normal routing
  if (!wallpaperId || !isCrawler) {
    return null;
  }

  try {
    // Fetch wallpaper data from your backend API
    const apiUrl = process.env.VITE_API_URL || "http://localhost:3000";
    const response = await fetch(`${apiUrl}/api/wallpapers`);
    const wallpapers = await response.json();

    // Find the specific wallpaper
    const wallpaper = wallpapers.find((w) => w.id === wallpaperId);

    if (!wallpaper) {
      return null;
    }

    // Use compressed image for faster loading on social platforms
    const imageUrl = `https://images.weserv.nl/?url=${wallpaper.filename.replace(
      /^https?:\/\//,
      ""
    )}&q=80`;
    const pageUrl = `${url.origin}?wallpaper=${wallpaperId}`;

    // Return HTML with proper Open Graph meta tags for crawlers
    const html = `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${wallpaper.title} - Walleyt</title>
    
    <!-- Open Graph / Facebook -->
    <meta property="og:type" content="website">
    <meta property="og:url" content="${pageUrl}">
    <meta property="og:title" content="${wallpaper.title} - Walleyt">
    <meta property="og:description" content="${
      wallpaper.category
    } wallpaper in ${
      wallpaper.resolution || "HD"
    } quality. Download premium wallpapers for your device.">
    <meta property="og:image" content="${imageUrl}">
    <meta property="og:image:width" content="1200">
    <meta property="og:image:height" content="630">
    
    <!-- Twitter -->
    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:url" content="${pageUrl}">
    <meta name="twitter:title" content="${wallpaper.title} - Walleyt">
    <meta name="twitter:description" content="${
      wallpaper.category
    } wallpaper in ${wallpaper.resolution || "HD"} quality">
    <meta name="twitter:image" content="${imageUrl}">
    
    <!-- Auto-redirect users (not crawlers) -->
    <meta http-equiv="refresh" content="0;url=/?wallpaper=${wallpaperId}">
    
    <style>
      body {
        font-family: system-ui, -apple-system, sans-serif;
        display: flex;
        align-items: center;
        justify-content: center;
        height: 100vh;
        margin: 0;
        background: #0f172a;
        color: white;
      }
      .loading {
        text-align: center;
      }
      .spinner {
        border: 3px solid rgba(255,255,255,0.1);
        border-top-color: #6366f1;
        border-radius: 50%;
        width: 40px;
        height: 40px;
        animation: spin 1s linear infinite;
        margin: 0 auto 1rem;
      }
      @keyframes spin {
        to { transform: rotate(360deg); }
      }
    </style>
  </head>
  <body>
    <div class="loading">
      <div class="spinner"></div>
      <p>Loading ${wallpaper.title}...</p>
    </div>
    <script>
      // Redirect immediately for real users
      window.location.href = '/?wallpaper=${wallpaperId}';
    </script>
  </body>
</html>`;

    return new Response(html, {
      headers: {
        "content-type": "text/html; charset=utf-8",
        "cache-control": "public, max-age=3600, s-maxage=3600",
      },
    });
  } catch (error) {
    console.error("Error fetching wallpaper:", error);
    return null;
  }
}
