const mongoose = require("mongoose");

// Lean analytics event - minimal data, auto-expires
const analyticsEventSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
    index: true,
  },
  sessionId: {
    type: String,
    required: true,
    index: true,
  },
  eventType: {
    type: String,
    required: true,
    enum: ["session_start", "download", "like", "share"],
  },
  wallpaperId: String,
  category: String,
  timestamp: {
    type: Date,
    default: Date.now,
    index: true,
    // Auto-delete after 30 days
    expires: 2592000,
  },
});

// Compound index for efficient queries
analyticsEventSchema.index({ userId: 1, timestamp: -1 });
analyticsEventSchema.index({ eventType: 1, timestamp: -1 });

module.exports = mongoose.model("AnalyticsEvent", analyticsEventSchema);
