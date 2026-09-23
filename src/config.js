// API Configuration - dynamic resolution for local development and cloud production
export const getBackendUrl = () => {
  // If explicitly provided via Vite environment variable, use it
  if (typeof import.meta !== 'undefined' && import.meta.env?.VITE_BACKEND_URL) {
    return import.meta.env.VITE_BACKEND_URL;
  }

  // Check current window hostname to determine if running locally or deployed
  if (typeof window !== 'undefined') {
    const hostname = window.location.hostname;
    const isLocal = hostname === 'localhost' || hostname === '127.0.0.1' || hostname === '0.0.0.0';
    if (!isLocal) {
      // Production cloud deployment (GitHub Pages, Vercel, Custom Domain)
      return "https://krushiraksha-backend.onrender.com";
    }
  }

  // Local development default
  return "http://127.0.0.1:8000";
};

export const getAnalyzeEndpoint = () => `${getBackendUrl()}/analyze`;

export const BACKEND_URL = getBackendUrl();
export const ANALYZE_ENDPOINT = getAnalyzeEndpoint();
