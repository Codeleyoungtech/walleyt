const mongoose = require("mongoose");

// Pre-aggregated daily stats - the main source of truth
const dailyStatsSchema = new mongoose.Schema({
  date: {
    type: String, // YYYY-MM-DD
    required: true,
    unique: true,
    index: true,
  },
  uniqueVisitors: {
    type: Number,
    default: 0,
  },
  sessions: {
    type: Number,
    default: 0,
  },
  downloads: {
    type: Number,
    default: 0,
  },
  likes: {
    type: Number,
    default: 0,
  },
  topWallpapers: [
    {
      id: String,
      title: String,
      views: Number,
      downloads: Number,
      likes: Number,
    },
  ],
  topCategories: [
    {
      name: String,
      views: Number,
    },
  ],
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

// Method to increment stats
dailyStatsSchema.methods.incrementStat = function (statName, value = 1) {
  this[statName] = (this[statName] || 0) + value;
  this.updatedAt = new Date();
};

module.exports = mongoose.model("DailyStats", dailyStatsSchema);
