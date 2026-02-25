import { initializeApp } from "firebase/app";
import { getAuth, Auth } from "firebase/auth";
import { getFirestore, Firestore } from "firebase/firestore";
import { getAnalytics, Analytics, isSupported } from "firebase/analytics";

// 🔒 Fail fast if env is missing
if (!import.meta.env.VITE_FIREBASE_API_KEY) {
  throw new Error("Missing VITE_FIREBASE_API_KEY");
}

// Firebase config
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "ai-trip-planner-1756d.firebaseapp.com",
  projectId: "ai-trip-planner-1756d",
  storageBucket: "ai-trip-planner-1756d.firebasestorage.app",
  messagingSenderId: "145729233864",
  appId: "1:145729233864:web:9908ba30c70e6da91d16fd",
  measurementId: "G-DV4MF26P93",
};

// Initialize app
const app = initializeApp(firebaseConfig);

// Services
export const auth: Auth = getAuth(app);
export const db: Firestore = getFirestore(app);

// Analytics (browser-only safe init)
export let analytics: Analytics | undefined;

if (typeof window !== "undefined") {
  isSupported().then((yes) => {
    if (yes) analytics = getAnalytics(app);
  });
}

export default app;