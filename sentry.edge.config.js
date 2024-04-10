import * as Sentry from "@sentry/nextjs";

Sentry.init({
    dsn: "https://78d2ee5671b54e3fb52f48b029bac479@o231142.ingest.sentry.io/6148127",
    tracesSampleRate: 1.0,
    debug: false,
});