// Firebase Web SDK Initialization via CDN

const firebaseConfig = {
  apiKey: "AIzaSyD0kRkTjbJ3p7bKKt_o0jFbBhx6x7G7hHk",
  authDomain: "agrocare-7a62d.firebaseapp.com",
  projectId: "agrocare-7a62d",
  storageBucket: "agrocare-7a62d.firebasestorage.app",
  messagingSenderId: "845700293852",
  appId: "1:845700293852:web:b4b57d74e1871298f78019"
};

// Initialize Firebase
if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

const auth = firebase.auth();
const db = firebase.firestore();

// Optional settings for Firestore
db.settings({ ignoreUndefinedProperties: true });
