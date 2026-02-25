import { initializeApp } from "firebase/app";
import { getAuth, Auth } from "firebase/auth";
import { getFirestore, Firestore } from "firebase/firestore";
import { getAnalytics, Analytics } from "firebase/analytics";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY || '',
  authDomain: "ai-trip-planner-1756d.firebaseapp.com",
  projectId: "ai-trip-planner-1756d",
  storageBucket: "ai-trip-planner-1756d.firebasestorage.app",
  messagingSenderId: "145729233864",
  appId: "1:145729233864:web:9908ba30c70e6da91d16fd",
  measurementId: "G-DV4MF26P93"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
export const auth: Auth = getAuth(app);
export const db: Firestore = getFirestore(app);
export const analytics: Analytics = getAnalytics(app);

export default app;
