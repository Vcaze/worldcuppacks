// Type declarations for fake environment variables
declare global {
  interface Window {
    __FAKE_ENV__?: {
      VITE_PUBLIC_API_URL?: string;
    };
  }
}

export {};
