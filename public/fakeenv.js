// Fake environment variables for local development
// These replace the .env file when running locally in browser

const env = {
  VITE_PUBLIC_API_URL: "http://localhost:1337/api"
};

// Export for use in the application
if (typeof window !== 'undefined') {
  window.__FAKE_ENV__ = env;
}
