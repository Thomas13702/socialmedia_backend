const admin = require("firebase-admin");
const serviceAccount = require("./socialmedia-auth.json");

export const verifyIdToken = (token) => {
  if (!admin.apps.length) {
    admin.initializeApp({
      credentials: admin.credential.cert(serviceAccount),
      databaseURL: process.env.databaseURL,
    });
  }

  return admin
    .auth()
    .verifyIdToken(token)
    .catch((error) => {
      throw error;
    });
};
