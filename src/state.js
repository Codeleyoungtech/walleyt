import { analytics } from "./utils/analytics.js";

export const state = {
  wallpapers: [],
  walle: new Set(),
  downloads: new Set(),
  theme: "dark",
  profile: {
    name: "Eleazar",
    bio: "Wallpaper Enthusiast",
  },
  subscribers: [],

  async init() {
    // Fetch wallpapers from API
    try {
      const response = await fetch("http://localhost:3000/api/wallpapers");
      if (!response.ok) {
        throw new Error("Failed to fetch wallpapers");
      }
      this.wallpapers = await response.json();
      console.log(`✅ Loaded ${this.wallpapers.length} wallpapers from API`);
    } catch (error) {
      console.error("❌ Failed to load wallpapers from API:", error);
      // Fallback to static JSON if API fails
      try {
        const response = await fetch("/wallpapers.json");
        this.wallpapers = await response.json();
        console.log("⚠️ Using fallback static JSON");
      } catch (fallbackError) {
        console.error("❌ Fallback also failed:", fallbackError);
        this.wallpapers = [];
      }
    }

    // Load persisted data from localStorage
    const savedWalle = localStorage.getItem("walle");
    const savedDownloads = localStorage.getItem("downloads");
    const savedTheme = localStorage.getItem("theme");
    const savedProfile = localStorage.getItem("profile");

    if (savedWalle) {
      this.walle = new Set(JSON.parse(savedWalle));
    }
    if (savedDownloads) {
      this.downloads = new Set(JSON.parse(savedDownloads));
    }
    if (savedTheme) {
      this.theme = savedTheme;
      document.documentElement.setAttribute("data-theme", savedTheme);
    }
    if (savedProfile) {
      this.profile = JSON.parse(savedProfile);
    }

    // Notify subscribers after initialization
    this.notify();
  },

  subscribe(callback) {
    this.subscribers.push(callback);
  },

  notify() {
    this.subscribers.forEach((callback) => callback());
  },

  toggleWalle(id) {
    const wallpaper = this.wallpapers.find((w) => w.id === id);

    if (this.walle.has(id)) {
      this.walle.delete(id);
    } else {
      this.walle.add(id);
      // Track like event
      if (wallpaper) {
        analytics
          .trackLike(id, wallpaper.category)
          .catch((e) => console.debug("Analytics:", e));
      }
    }
    localStorage.setItem("walle", JSON.stringify([...this.walle]));
    this.notify();
    return this.walle.has(id);
  },

  addDownload(id) {
    const wallpaper = this.wallpapers.find((w) => w.id === id);

    this.downloads.add(id);
    localStorage.setItem("downloads", JSON.stringify([...this.downloads]));

    // Track download event
    if (wallpaper) {
      analytics
        .trackDownload(id, wallpaper.category)
        .catch((e) => console.debug("Analytics:", e));
    }

    this.notify();
  },

  toggleTheme() {
    this.theme = this.theme === "dark" ? "light" : "dark";
    document.documentElement.setAttribute("data-theme", this.theme);
    localStorage.setItem("theme", this.theme);
    this.notify();
  },

  updateProfile(updates) {
    this.profile = { ...this.profile, ...updates };
    localStorage.setItem("profile", JSON.stringify(this.profile));
    this.notify();
  },

  // Search and filter methods
  searchQuery: "",
  currentCategory: "All",

  setSearchQuery(query) {
    this.searchQuery = query;
    this.notify();
  },

  setCategory(category) {
    this.currentCategory = category;
    this.notify();
  },

  getFilteredWallpapers() {
    let filtered = this.wallpapers;

    // Filter by category
    if (this.currentCategory && this.currentCategory !== "All") {
      if (this.currentCategory === "Eleazar's Picks") {
        filtered = filtered.filter(
          (w) => w.tags && w.tags.includes("featured")
        );
      } else {
        filtered = filtered.filter((w) => w.category === this.currentCategory);
      }
    }

    // Filter by search query
    if (this.searchQuery) {
      const query = this.searchQuery.toLowerCase();
      filtered = filtered.filter(
        (w) =>
          w.title.toLowerCase().includes(query) ||
          w.category.toLowerCase().includes(query) ||
          (w.tags && w.tags.some((t) => t.toLowerCase().includes(query)))
      );
    }

    return filtered;
  },

  getCategories() {
    const categories = ["All", "Eleazar's Picks"];
    const uniqueCategories = [
      ...new Set(this.wallpapers.map((w) => w.category)),
    ];
    return categories.concat(uniqueCategories);
  },
};
