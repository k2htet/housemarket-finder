import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyA4YPfHxGIua0KdPfQHtU83GXLqEwA-GGI",
    authDomain: "house-market-app-cea5f.firebaseapp.com",
    projectId: "house-market-app-cea5f",
    storageBucket: "house-market-app-cea5f.appspot.com",
    messagingSenderId: "496765668810",
    appId: "1:496765668810:web:be08cf2603bcde17d71333",
};

// Initialize Firebase
initializeApp(firebaseConfig);

export const db = getFirestore();
