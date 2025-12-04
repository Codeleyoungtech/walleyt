// API Configuration
// Uses environment variable in production, localhost for development

export const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

export const config = {
  apiUrl: API_URL,
  endpoints: {
    wallpapers: `${API_URL}/api/wallpapers`,
    categories: `${API_URL}/api/categories`,
    analytics: `${API_URL}/api/analytics`,
    health: `${API_URL}/api/health`,
  },
};
