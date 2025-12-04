const express = require("express");
const router = express.Router();
const AnalyticsEvent = require("../models/AnalyticsEvent");
const DailyStats = require("../models/DailyStats");
const Wallpaper = require("../models/Wallpaper");

// Helper to get today's date string
const getTodayDate = () => {
  return new Date().toISOString().split("T")[0];
};

// Helper to get or create today's stats
const getTodayStats = async () => {
  const today = getTodayDate();
  let stats = await DailyStats.findOne({ date: today });

  if (!stats) {
    stats = new DailyStats({ date: today });
    await stats.save();
  }

  return stats;
};

// @route   POST /api/analytics/event
// @desc    Track a single event (optimized)
// @access  Public
router.post("/event", async (req, res) => {
  try {
    const { userId, sessionId, eventType, wallpaperId, category } = req.body;

    // Create event (will auto-delete after 30 days)
    const event = new AnalyticsEvent({
      userId,
      sessionId,
      eventType,
      wallpaperId,
      category,
    });
    await event.save();

    // Update daily stats immediately
    const stats = await getTodayStats();

    switch (eventType) {
      case "session_start":
        stats.sessions += 1;
        // Check if user is new today
        const existingSession = await AnalyticsEvent.findOne({
          userId,
          timestamp: { $gte: new Date(new Date().setHours(0, 0, 0, 0)) },
        });
        if (!existingSession || existingSession._id.equals(event._id)) {
          stats.uniqueVisitors += 1;
        }
        break;

      case "download":
        stats.downloads += 1;
        if (wallpaperId) {
          // Update wallpaper download count in main collection
          await Wallpaper.findOneAndUpdate(
            { id: wallpaperId },
            { $inc: { downloads: 1 } }
          );
          // Update top wallpapers
          updateTopWallpapers(stats, wallpaperId, "downloads");
        }
        break;

      case "like":
        stats.likes += 1;
        if (wallpaperId) {
          await Wallpaper.findOneAndUpdate(
            { id: wallpaperId },
            { $inc: { likes: 1 } }
          );
          updateTopWallpapers(stats, wallpaperId, "likes");
        }
        break;
    }

    if (category) {
      updateTopCategories(stats, category);
    }

    await stats.save();

    res.status(201).json({ success: true });
  } catch (error) {
    console.error("Analytics error:", error);
    res.status(500).json({ message: error.message });
  }
});

// @route   GET /api/analytics/stats
// @desc    Get aggregated stats for dashboard
// @access  Public
router.get("/stats", async (req, res) => {
  try {
    const { days = 30 } = req.query;
    const daysAgo = new Date();
    daysAgo.setDate(daysAgo.getDate() - parseInt(days));
    const startDate = daysAgo.toISOString().split("T")[0];

    // Get daily stats for period
    const stats = await DailyStats.find({
      date: { $gte: startDate },
    }).sort({ date: 1 });

    // Aggregate totals
    const totals = stats.reduce(
      (acc, day) => ({
        uniqueVisitors: acc.uniqueVisitors + day.uniqueVisitors,
        sessions: acc.sessions + day.sessions,
        downloads: acc.downloads + day.downloads,
        likes: acc.likes + day.likes,
      }),
      { uniqueVisitors: 0, sessions: 0, downloads: 0, likes: 0 }
    );

    // Get today's stats
    const today = await getTodayStats();

    // Get top wallpapers across all days
    const topWallpapers = await getTopWallpapers(days);

    res.json({
      totals,
      today: {
        uniqueVisitors: today.uniqueVisitors,
        sessions: today.sessions,
        downloads: today.downloads,
        likes: today.likes,
      },
      timeline: stats.map((s) => ({
        date: s.date,
        visitors: s.uniqueVisitors,
        sessions: s.sessions,
      })),
      topWallpapers,
      topCategories: today.topCategories.slice(0, 5),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   GET /api/analytics/wallpaper/:id
// @desc    Get stats for specific wallpaper
// @access  Public
router.get("/wallpaper/:id", async (req, res) => {
  try {
    const { days = 30 } = req.query;

    const downloads = await AnalyticsEvent.countDocuments({
      wallpaperId: req.params.id,
      eventType: "download",
      timestamp: { $gte: new Date(Date.now() - days * 24 * 60 * 60 * 1000) },
    });

    const likes = await AnalyticsEvent.countDocuments({
      wallpaperId: req.params.id,
      eventType: "like",
      timestamp: { $gte: new Date(Date.now() - days * 24 * 60 * 60 * 1000) },
    });

    res.json({ downloads, likes });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Helper functions
function updateTopWallpapers(stats, wallpaperId, metric) {
  let wallpaper = stats.topWallpapers.find((w) => w.id === wallpaperId);
  if (wallpaper) {
    wallpaper[metric] = (wallpaper[metric] || 0) + 1;
  } else {
    stats.topWallpapers.push({
      id: wallpaperId,
      [metric]: 1,
    });
  }
  // Keep only top 20
  stats.topWallpapers.sort(
    (a, b) =>
      (b.downloads || 0) + (b.likes || 0) - (a.downloads || 0) - (a.likes || 0)
  );
  stats.topWallpapers = stats.topWallpapers.slice(0, 20);
}

function updateTopCategories(stats, category) {
  let cat = stats.topCategories.find((c) => c.name === category);
  if (cat) {
    cat.views += 1;
  } else {
    stats.topCategories.push({ name: category, views: 1 });
  }
  stats.topCategories.sort((a, b) => b.views - a.views);
  stats.topCategories = stats.topCategories.slice(0, 10);
}

async function getTopWallpapers(days) {
  const wallpapers = await Wallpaper.find()
    .sort({ downloads: -1, likes: -1 })
    .limit(10)
    .select("id title filename downloads likes");

  return wallpapers.map((w) => ({
    id: w.id,
    title: w.title,
    thumbnail: w.filename,
    downloads: w.downloads || 0,
    likes: w.likes || 0,
  }));
}

module.exports = router;
