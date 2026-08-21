// Firebase Web SDK Initialization via Dynamic Environment Config

const env = (typeof window !== "undefined" && window.AGROCARE_ENV) ? window.AGROCARE_ENV : {};

const firebaseConfig = {
  apiKey: env.apiKey || "YOUR_FIREBASE_API_KEY",
  authDomain: env.authDomain || "agrocare-7a62d.firebaseapp.com",
  projectId: env.projectId || "agrocare-7a62d",
  storageBucket: env.storageBucket || "agrocare-7a62d.firebasestorage.app",
  messagingSenderId: env.messagingSenderId || "YOUR_MESSAGING_SENDER_ID",
  appId: env.appId || "YOUR_APP_ID"
};

// Initialize Firebase
if (typeof firebase !== "undefined" && !firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

const auth = (typeof firebase !== "undefined" && firebase.auth) ? firebase.auth() : null;
const db = (typeof firebase !== "undefined" && firebase.firestore) ? firebase.firestore() : null;

// Optional settings for Firestore
if (db && db.settings) {
  db.settings({ ignoreUndefinedProperties: true });
}
