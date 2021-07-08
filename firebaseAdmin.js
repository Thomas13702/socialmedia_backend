const admin = require("firebase-admin");
const serviceAccount = require("./socialmedia-auth-a034e-firebase-adminsdk-oucz7-cadeb08547.json");

export const verifyIdToken = (token) => {
  if (!admin.apps.length) {
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
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