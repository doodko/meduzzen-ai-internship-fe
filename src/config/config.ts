export const config = {
  ENVIRONMENT: process.env.NEXT_PUBLIC_ENVIRONMENT || "development",
  WS_URL: process.env.NEXT_PUBLIC_WS_URL || "ws://localhost:5000/ws",
  API_URL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000",
  SENTRY_DSN: process.env.NEXT_PUBLIC_SENTRY_DSN,
};
