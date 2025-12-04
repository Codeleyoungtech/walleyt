const express = require("express");
const router = express.Router();
const Wallpaper = require("../models/Wallpaper");

// @route   GET /api/wallpapers
// @desc    Get all wallpapers
// @access  Public
router.get("/", async (req, res) => {
  try {
    const wallpapers = await Wallpaper.find().sort({ createdAt: -1 });
    res.json(wallpapers);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   GET /api/wallpapers/:id
// @desc    Get single wallpaper
// @access  Public
router.get("/:id", async (req, res) => {
  try {
    const wallpaper = await Wallpaper.findOne({ id: req.params.id });
    if (!wallpaper) {
      return res.status(404).json({ message: "Wallpaper not found" });
    }
    res.json(wallpaper);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   POST /api/wallpapers
// @desc    Create new wallpaper
// @access  Public (should add auth in production)
router.post("/", async (req, res) => {
  try {
    const wallpaper = new Wallpaper(req.body);
    const newWallpaper = await wallpaper.save();
    res.status(201).json(newWallpaper);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// @route   PUT /api/wallpapers/:id
// @desc    Update wallpaper
// @access  Public (should add auth in production)
router.put("/:id", async (req, res) => {
  try {
    const wallpaper = await Wallpaper.findOneAndUpdate(
      { id: req.params.id },
      req.body,
      { new: true }
    );
    if (!wallpaper) {
      return res.status(404).json({ message: "Wallpaper not found" });
    }
    res.json(wallpaper);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// @route   DELETE /api/wallpapers/:id
// @desc    Delete wallpaper
// @access  Public (should add auth in production)
router.delete("/:id", async (req, res) => {
  try {
    const wallpaper = await Wallpaper.findOneAndDelete({ id: req.params.id });
    if (!wallpaper) {
      return res.status(404).json({ message: "Wallpaper not found" });
    }
    res.json({ message: "Wallpaper deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
