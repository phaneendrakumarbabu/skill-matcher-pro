import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyBnrbaEvRcO1kC5KOQL-f0cId1jH5C-8dM",
  authDomain: "ai-resume-analyzer-13d49.firebaseapp.com",
  projectId: "ai-resume-analyzer-13d49",
  storageBucket: "ai-resume-analyzer-13d49.firebasestorage.app",
  messagingSenderId: "656198145803",
  appId: "1:656198145803:web:a73ab3bf556705e2f8f40e",
  measurementId: "G-90RGJP4RBJ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const googleProvider = new GoogleAuthProvider();

// Initialize analytics (only in browser)
let analytics;
if (typeof window !== 'undefined') {
  analytics = getAnalytics(app);
}

export { analytics };
export default app;
