import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import { getAnalytics } from 'firebase/analytics';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyB__b_HNbvaJ-fwTEo2KE-B86GrBXSQnZ4",
  authDomain: "fantasy-football-god.firebaseapp.com",
  projectId: "fantasy-football-god",
  storageBucket: "fantasy-football-god.firebasestorage.app",
  messagingSenderId: "360165412240",
  appId: "1:360165412240:web:c0a38995af5510eb15b715",
  measurementId: "G-SJQE3VJRZJ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

// Initialize Analytics (only in browser environment)
export const analytics = typeof window !== 'undefined' ? getAnalytics(app) : null;

// Connect to emulators in development
if (process.env.NODE_ENV === 'development') {
  // Uncomment these lines if you want to use Firebase emulators in development
  // connectAuthEmulator(auth, 'http://localhost:9099');
  // connectFirestoreEmulator(db, 'localhost', 8080);
  // connectStorageEmulator(storage, 'localhost', 9199);
}

export { app };
export default app; 