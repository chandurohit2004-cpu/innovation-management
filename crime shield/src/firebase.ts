import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// TODO: Replace with your project's Firebase configuration
// You can find this in your Firebase Project Settings
const firebaseConfig = {
    apiKey: "YOUR_API_KEY",
    authDomain: "tivas-dashboard.firebaseapp.com",
    projectId: "tivas-dashboard",
    storageBucket: "tivas-dashboard.firebasestorage.app",
    messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
    appId: "YOUR_APP_ID"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const storage = getStorage(app);

export default app;
