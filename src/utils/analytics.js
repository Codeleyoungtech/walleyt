// Lightweight analytics utility
// Session-based tracking, minimal database writes

import { config } from "../config.js";

const API_URL = config.endpoints.analytics;

class Analytics {
  constructor() {
    this.userId = null;
    this.sessionId = null;
    this.initialized = false;
  }

  // Initialize analytics (call once on app start)
  async init() {
    if (this.initialized) return;

    // Generate or retrieve user ID (browser fingerprint)
    this.userId = this.getUserId();

    // Generate session ID
    this.sessionId = this.generateSessionId();

    // Track session start
    await this.trackEvent("session_start");

    this.initialized = true;
  }

  // Get or create user ID using simple fingerprint
  getUserId() {
    let userId = localStorage.getItem("wt_uid");

    if (!userId) {
      // Create fingerprint from browser data
      const fingerprint = this.createFingerprint();
      userId = this.hashString(fingerprint);
      localStorage.setItem("wt_uid", userId);
    }

    return userId;
  }

  // Create simple browser fingerprint
  createFingerprint() {
    const data = [
      navigator.language,
      screen.width,
      screen.height,
      screen.colorDepth,
      new Date().getTimezoneOffset(),
      navigator.hardwareConcurrency || 0,
    ].join("|");

    return data;
  }

  // Simple string hash
  hashString(str) {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = (hash << 5) - hash + char;
      hash = hash & hash;
    }
    return "u_" + Math.abs(hash).toString(36);
  }

  // Generate session ID
  generateSessionId() {
    return "s_" + Date.now() + "_" + Math.random().toString(36).substr(2, 9);
  }

  // Track generic event
  async trackEvent(eventType, data = {}) {
    if (!this.initialized && eventType !== "session_start") {
      return; // Don't track until initialized
    }

    try {
      await fetch(`${API_URL}/event`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: this.userId,
          sessionId: this.sessionId,
          eventType,
          ...data,
        }),
      });
    } catch (error) {
      // Silently fail - don't break app if analytics fails
      console.debug("Analytics error:", error);
    }
  }

  // Track specific actions
  async trackDownload(wallpaperId, category) {
    await this.trackEvent("download", { wallpaperId, category });
  }

  async trackLike(wallpaperId, category) {
    await this.trackEvent("like", { wallpaperId, category });
  }

  async trackShare(wallpaperId) {
    await this.trackEvent("share", { wallpaperId });
  }
}

// Export singleton instance
export const analytics = new Analytics();
