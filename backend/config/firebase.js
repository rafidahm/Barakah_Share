const admin = require('firebase-admin');

/**
 * Initialize Firebase Admin SDK
 * Uses service account credentials from environment variables
 * TODO: Download serviceAccountKey.json from Firebase Console
 *       → Project Settings → Service Accounts → Generate new private key
 */
const initFirebase = () => {
  if (admin.apps.length > 0) return; // Already initialized

  admin.initializeApp({
    credential: admin.credential.cert({
      projectId:   process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey:  process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
    }),
  });

  console.log('🔥 Firebase Admin SDK initialized');
};

module.exports = { admin, initFirebase };
