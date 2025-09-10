
// Import the functions you need from the SDKs you need
import { getStorage } from "@firebase/storage";
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
	apiKey: "AIzaSyB7bgN7NBONM4wYDrdBKCA6Rw3vGhk9n9w",
	authDomain: "smoff-a6455.firebaseapp.com",
	projectId: "smoff-a6455",
	storageBucket: "smoff-a6455.firebasestorage.app",
	messagingSenderId: "820345053542",
	appId: "1:820345053542:web:d5fccffad70acb1d3868a7",
	measurementId: "G-FMQX4T4MJX",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const storage = getStorage(app);
