const express = require("express");
const router = express.Router();
const Wallpaper = require("../models/Wallpaper");

// @route   GET /api/categories
// @desc    Get unique categories
// @access  Public
router.get("/", async (req, res) => {
  try {
    const categories = await Wallpaper.distinct("category");
    res.json(categories);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
