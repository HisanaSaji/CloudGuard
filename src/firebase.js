import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";


const firebaseConfig = {
    apiKey: "AIzaSyCj36zTHx4unVkDpcq0lVb9n9m7XMo4DQ8",
    authDomain: "cloudguard-c3650.firebaseapp.com",
    projectId: "cloudguard-c3650",
    storageBucket: "cloudguard-c3650.firebasestorage.app",
    messagingSenderId: "721367361157",
    appId: "1:721367361157:web:c123f77caf0097a6a2ebec"
};
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);