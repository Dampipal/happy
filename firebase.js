
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
const firebaseConfig = {
  apiKey: "AIzaSyCQIEt4jD1qi4fuPOLVZ62pXd-TLVxqHeo",
  authDomain: "happy-f8090.firebaseapp.com",
  projectId: "happy-f8090",
  storageBucket: "happy-f8090.firebasestorage.app",
  messagingSenderId: "482625654970",
  appId: "1:482625654970:web:91d4717eaf04a2669f7283",
  measurementId: "G-9P6YWN7SVW"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);