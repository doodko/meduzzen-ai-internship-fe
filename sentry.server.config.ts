import * as Sentry from "@sentry/nextjs";
import { config } from "@/config/config";

Sentry.init({
  dsn: config.SENTRY_DSN,
  tracesSampleRate: 1,
  debug: false,
  environment: config.ENVIRONMENT,
});
