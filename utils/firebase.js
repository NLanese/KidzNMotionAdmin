// Firebase Admin: used to send push notifications to the mobile app.
//
// The service-account credentials come from the FIREBASE_SERVICE_ACCOUNT
// environment variable (the whole service-account JSON on one line).
// Set it in .env locally and in the Vercel project settings for production.
// Never paste the key into code.

import admin from "firebase-admin";

try {
  const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT || "null");
  if (!serviceAccount) {
    throw new Error("FIREBASE_SERVICE_ACCOUNT is not set; push notifications are disabled.");
  }
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
} catch (error) {
  // "already exists" is expected during hot-reload in development.
  if (!/already exists/u.test(error.message)) {
    console.error("Firebase admin initialization error:", error.message);
  }
}

export default admin;
