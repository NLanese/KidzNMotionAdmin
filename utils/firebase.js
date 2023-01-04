// File: lib/firebase.js

import admin from "firebase-admin";

try {
  admin.initializeApp({
    credential: admin.credential.cert({
      type: "service_account",
      project_id: "kidznmotion-7f5cf",
      private_key_id: "4217ad818a7db980a382f04bb5c6bf1ffe9b2c0f",
      private_key:
        "-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQDULazBUK1XLq+m\n+3QvnoOLB9xM/3EIGtccizX7rBRX4h3wOOGIKF9mkcVKnDEuTwhOb7E0N0BIxKPF\n2rMjg6qEcMqZ3RRcVDeA9/+Gy+EXJbijcOYExWrQ7pFRN/Q2oFjtAkM9sM5XEqeQ\n0PLuwy1z9e5jdXPDgkjbZjGznbAXcaZM/mLttdKtqjEU3EdXQ4r0MIVecJY0D2I+\nnkssCYWLu6CLf3ar57Jp4Lp+ADgDDlZEOAd4g5H9gubc20WMYsK6AkdnWtlSsZoS\nl1M4LFbZyko37IcwD2kf8XEqdTgQrehEuvqb4HJxfOrCv3Lc996IBP91zMA6paXQ\nj3/eLmm7AgMBAAECggEAKvjJKSnGwYZyCraYlGBdMdY4tttxL/wHnv9OwpbaU+Y2\nvAU5IBNVJvfU5kR17XQSMZiLYhDikxpINPUTHNk4urQBRGIzEnP3/cW8WbeG8eIw\n3+EopMS62m/GvJVBf6K//9had+8MCzR6/WhkGxkqZnbjff82n90OFmk/HaqNFGIQ\nrcVJ5llbVi/k+nbkbeiqOPAgaBqTxDgrEUhaBhZYSENrOvZTrNZX16ms8qyNtX3j\nTC6be/BEag7dfv5AH9VSX1UPd9RRVEgPCA6fS/krTl0m/iVQN0/NA3fVfyvyRSXw\nQ1gqa8zMVtt5ksujujHN25jEYwJiZze3xiO61VzrKQKBgQDpqlQXC3TVEUxhYbdr\nQMqlkF0myk8GAGl+GJdzevszrwjPLA59wruHIaio3rhL7V8uQV8dr8MJkP/+9Uwr\nruDsfOPx8KVjYXlpbAzeqdnhnfjj2oYcLV+eoO4qzuVGGp4kg+KhICZ50vSPQPO2\nnYb6g3v18+pz+dcOm/baQtIgdwKBgQDodZJ7pWXHDk+rqgr6bjVPl+UCumqqILWM\nBCti0lHCn4F4s61oBYs0IoWNpuPGeUC9nwSpx0qB3CQFZcKxNf0UHnZxJKBWjOEt\n2gZ3NMMl6gME5obVO5V1JQ9UfsDFox9NYcAmBohhgpbGqXJFWE+yP7JU3fdBUy94\nhauWaB513QKBgFXJeBgB18IGGNHD63BQGFZSuzBrpDmi2xg1dR0rsKBYCdbt6OAZ\nJ3pETES7iFQv8PrteztN9UBE4Qe9DVsYWHHapGGGJWJoPggLaGozV8/yjJcy+nvL\n2MhHc0l6LkjfquHjHchkIlwlrC4P/ao1CYJd1ZwGEjTELEWr0yRs1fKfAoGAUFJX\nxBuZeFdslf9SfcfY6eCtQ+0P8CsPMAs8xo+vqpUc0o0bLOdFe0U2aoSxDaJWCW9J\n2DRBfW+IjsjjpgHmqa4A9QVX1bAmGobMVyJHD/G1C1twWXuWH/0nN+X4TBIaPc25\n7CmztCXAXXKtRmLGXuv9fa+YwNyyeW2OpZDifY0CgYEA3MPi7memeJMYM5eZpZa7\n6NpXoHSUH852MJX1BvPmaUNVsz/+zKiuFqbIM9gZCMCHDQjiR2ilXqUHSUAuQY/Z\nZuBZxTlWbPBLY3A9rKHptuYzF+D0kZyQI0zltAKLeKOVQ8w2CZMlV99UhvEkdAmf\noablGfsoxKkliCyjUwlJ9pM=\n-----END PRIVATE KEY-----\n",
      client_email:
        "firebase-adminsdk-duffz@kidznmotion-7f5cf.iam.gserviceaccount.com",
      client_id: "105738133117841515457",
      auth_uri: "https://accounts.google.com/o/oauth2/auth",
      token_uri: "https://oauth2.googleapis.com/token",
      auth_provider_x509_cert_url: "https://www.googleapis.com/oauth2/v1/certs",
      client_x509_cert_url:
        "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-duffz%40kidznmotion-7f5cf.iam.gserviceaccount.com",
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
