// File: lib/firebase.js

import admin from "firebase-admin";

try {
  admin.initializeApp({
    credential: admin.credential.cert({
      type: "service_account",
      project_id: "kidznmotion-43590",
      private_key_id: "ffbe2b97dea888c18fbc7c21c6ee81883b60d6d3",
      private_key:
        "-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQCy2oL/fsiReaZ3\nh9ZjLIbF/0j5WKYnAnDxVKiJPJwWB3xQv8hh1YpQgsjhsRncpwGL+UwDbxl/V/pU\nIudP8dQqbBciBxPEkun556rzwvvM7qW3nxAKk3hT2hMtDdN5yHzASKS6h3Y0E/9q\nRAUkIGMyd/lf1PU0OJqYbnnr+18z2TE91fJ0Y/L1uXdwgyloTYk1eI1JxlhbjvZI\nYMlDtKZzHoAIe3U3waDG7VEaOFCfG1mVb3uURFfC9lhgvOM+TV35sQ7rSsKqiH7R\nSgvVNqV9o0yevymmxByuyHhJUshpI77pYSonMfsl4Ko4B9fNvvTTMMs49yYDtA+q\nu7PPhC67AgMBAAECggEASygWfy20M6l2gekjdlZKJh6h+CG/5Ema01abYdwFzR4F\nJ9uHZVE6B54Fsw1cTEQjmsG+Jv1DLid2qm9mW0pIOTFlwSdPL736s0ieJkPL0vB/\n07r0HzWcDURo5XhXYugUQCrmifmNetHidTGzJVy0wor20EXpajHVCPP3qOnfNiY8\nukhWZ/oX15Bb3e+vxSKbV/mSgwWG+1jhjrm2g1LrUigzgie8tQECyBtWuLggA9an\nHo2sF5yuEy14qSAKNwKL7yp2UKWjrFEdZsWz7hk1a3NAEDszeppwEG1b2eOmk+yI\nk0gQNBhdPdzhZgG4xZ+tlGxdFO8PhK1GNy3ZxEXXkQKBgQDmsrxV2wQaHmwtIjzB\ngw6+lou9xuimWU/oYT0fjPf4BnVE5vG4F3A0R2IBblqiJndCdDrfCaZF+zNjWb0v\nCTJadQBOfykIS6YLYaalP87VzhpYIX84xpQDYI8vzIcGoZZFpywRafSxBW6NdrGS\ng6Iop/gxD2R7Cvanvhonn2SEqwKBgQDGeCU6yVOUDkU44f9tIqKvBpBjSOD6Cbiq\nrK435q4xTZgwuvw0AKedq+zyKjvQCduB3bmb4ivm8AVeDem69KfeMacObmQbHJ8y\n6SfmeequYKi37EyBvgpvg/fBQWMIDfninkVn+YDIZK9EPWuINgGbCQb6ErQ+mFXv\no04+jbBeMQKBgQDZTsHTScQ6ai/R7+81BSPNaXfmYshhcb2wknAGGT63FjY+miBV\nHVbnF9p8qJudJAiww1V1JNzIDNCiJDTtaodQ5+dLCcL3+nJFRE26WTmW8lakb6Es\nNPnVmI4oI0uJdopbwBXlrV39pbU2cfjgnzgPffFvHSW0NWaUKaDvc9g2kwKBgGfF\nBeI4xaRR2cumDoEnbNwKmI/w2QCi+JT0eJrt2AIbSgmgmqEt/nWoINl1T5S0srqy\nDYv9s2qp8IR+zchchzDb0TbwbRLn4i0iTyRodlX6X/zaZh4oGRi5bV70Ky1Y8WCV\n1EBK6hTc3+7UFlc/tZM0Ixu5j9hymewT/KMkPiThAoGAYV9g2xth9xvAQv25nlkO\nvXuuU8jmEq25epPPE7hz5eR2jVOjGyCP1Uqyu8itQlcDCrr1AtM1Rl7lQIZe6NEU\nte5A+oKVLQJ31dbYs7bUeWiQOdZFUJjCJHZ+6wKdmwR3MmJWrue/1PGOf4WE5R/H\nGcpz292ccACkJR8lpi5yqHY=\n-----END PRIVATE KEY-----\n",
      client_email:
        "firebase-adminsdk-824iv@kidznmotion-43590.iam.gserviceaccount.com",
      client_id: "115919668964716391608",
      auth_uri: "https://accounts.google.com/o/oauth2/auth",
      token_uri: "https://oauth2.googleapis.com/token",
      auth_provider_x509_cert_url: "https://www.googleapis.com/oauth2/v1/certs",
      client_x509_cert_url:
        "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-824iv%40kidznmotion-43590.iam.gserviceaccount.com",
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
