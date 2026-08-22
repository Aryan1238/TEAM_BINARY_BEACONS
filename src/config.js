// API Configuration - works both locally and on deployed frontend
// For local dev: backend runs at http://127.0.0.1:8000
// For GitHub Pages: user must run backend locally
const getBackendUrl = () => {
    if (import.meta.env.VITE_BACKEND_URL) {
        return import.meta.env.VITE_BACKEND_URL;
    }
    return "http://127.0.0.1:8000";
};

export const BACKEND_URL = getBackendUrl();
export const ANALYZE_ENDPOINT = `${BACKEND_URL}/analyze`;
