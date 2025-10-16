// lib/config.js

export function getApiUrl(path = "") {
  // In production, default to deployed backend if no base provided
  const baseFromEnv = process.env.NEXT_PUBLIC_API_BASE_URL;
  const isProd = process.env.NODE_ENV === "production";
  const prodFallback = process.env.NEXT_PUBLIC_API_URL || "https://travel-go-backend.onrender.com/api";
  const base = baseFromEnv || (isProd ? prodFallback : "/api");
  return `${base}${path}`;
}

export function getServerApiUrl(path = "") {
  // For server-side (SSR / API calls) -> call backend directly
  const baseFromEnv = process.env.NEXT_PUBLIC_API_URL || process.env.NEXT_PUBLIC_API_BASE_URL;
  const isProd = process.env.NODE_ENV === "production";
  const prodFallback = "https://travel-go-backend.onrender.com/api";
  const base = baseFromEnv || (isProd ? prodFallback : "http://localhost:4000/api");
  return `${base}${path}`;
}
