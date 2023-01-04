// File: lib/firebase.js

import admin from "firebase-admin";

try {
  admin.initializeApp({
    credential: admin.credential.cert({
      type: "service_account",
      project_id: "kidznmotionios",
      private_key_id: "7e9311f09fde555af83cc0b32cc91c50764dfba9",
      private_key:
        "-----BEGIN PRIVATE KEY-----\nMIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQDCu8qumUTXFysv\nILZ8/AGZuAde2rDM/cyqoh25YJGdiQJZJckB9Ifs+kvIodWapuusW1/TXAeoOrIo\n0s1MXgzJapXObAQ8MLVB7W2JcWo7fep1pO0ziwuWkNjiMUHT18mYKLaonZN5cdho\nC0RKg3h1WR12qKJAVcE+DNmR6mDpPcozEMjvQX+CzP5UneLCBY/dTQPgXceJPC5e\n2OhhePdEXZLTWYJ9vEhN5Icc7aqt4bjokV39Aii8/ssV59OrqcOLPTxOrlXblAV4\nJBbjeiiDTTpiZ451esKPIdsbzdEHV5MFiOzjuxfDr6UE6kvuGVPADAOsydJejyPH\nKUh39lFhAgMBAAECggEAQgwXjmiFpL5C81UREAsZL93vAgkCdkSOqkEZ+8n5GYli\ntoHOT0902rd6BK5/GFkNDgRf1/wazMA7tQTqhMBRbe8sqDqSpSeQErBIupkxAsSO\nRSCPIzBB2et+5Bj4zrUdtvH4IfBwGHy4fXF01CELNiHnkFtZzKBJTpZlJMxt2i12\nNb3A+Pnolz9acs9ktooIb6Or3KHNje09qGQI1RATIwunnLnCaB9RFQ1M+3FUZk9G\nRlGKaGxFG7pO0gi0t7qKeYYYyI4QekwkBIccN2OxQYlz5iKR9Lv1914Amxurs7O8\nSjojkd3rfHOBZuc23Jrom/Lc0o8ewN/Cjd5n+In6kQKBgQD94GZvyJckOYXhvA9J\nwptuKkxFHRgFVYoCYPywzw2FitrbE3BgQfHsYWfPGSkKFhZ6+UvontwVrHH2swXD\nSb/pbVu2uBdhejSLPzTgwQ28rCJ8Lod3D/21nf9MggKo88k3xFon9lx/kzewa7wR\nn+tM45miwT6BpJU8GArQcq5FqwKBgQDEXME2efglvewzML6bJAHMo25BLYhBcebV\nFqvgrM5lY3gvA+/2N4hInfW3UKzP3OZSvTKP7Si6kWi6oVtUU+rXE1MlIygOlsI4\necMdpMBB81RTa/UwgvMvFgksgld+Uqz95fCmG47/E/bOMipWdHztZg7c323REnGk\nc7ntXjdhIwKBgDTMvME22KhCBmQiNpPCk4zf4yjkmiBR3/gKr8Md7NP/QvEZI+AB\nFw1wXKSnuO9OFLLSskTY9TDUwobqSKKK7gzgH5jqxIITZmYnaRntTKwWqL1m9+l9\nO+jPyU7iIyd8PDcK8S0qgaZOueBJJ74KomdFVqiQxC02S4tJ/MXJdBEtAoGBAJK2\nUs4nF1brrj0ZIHC92HJTcZ9VK8bqGXQAum7l7lgml7dZE8M8/qBzFRHgPx4XiCct\noUeUBKhQ2JUI1joNcRs9HxRSTi2ISpjzsOrHG7aq3chukwWp8ZSuvC/7Ou/xSbty\nP/l8Ab1n5zFsneF2q5icdmJktaJOS4Z5yOMnT+1NAoGBAKQR8CCJFMIWWP0siJrz\ng80PmyFaYtR4gm14NT4+t3bU9xh/jdGm0Q4i3xhlTYOQgHVSGpeRzcjHMb5PIFE2\nMgVGuQbfIegu47csZCA4gOokWGQbo8T4hel663PTbfI6xIM8VTZo3dhEmMG6Bpov\n4EeO6G5ijZ6cGCSLlULKnPEp\n-----END PRIVATE KEY-----\n",
      client_email:
        "firebase-adminsdk-r0ewz@kidznmotionios.iam.gserviceaccount.com",
      client_id: "101508316331295813214",
      auth_uri: "https://accounts.google.com/o/oauth2/auth",
      token_uri: "https://oauth2.googleapis.com/token",
      auth_provider_x509_cert_url: "https://www.googleapis.com/oauth2/v1/certs",
      client_x509_cert_url:
        "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-r0ewz%40kidznmotionios.iam.gserviceaccount.com",
    }),
  });
  // console.log("Initialized.");
} catch (error) {
  /*
   * We skip the "already exists" message which is
   * not an actual error when we're hot-reloading.
   */
  if (!/already exists/u.test(error.message)) {
    console.error("Firebase admin initialization error", error.stack);
  }
}

export default admin;
