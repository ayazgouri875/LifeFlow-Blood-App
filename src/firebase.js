import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyA-ecfMFff_V95L7DTFMgnJs_ANtyJLCko",
    authDomain: "lifeflow-app-ad9be.firebaseapp.com",
    projectId: "lifeflow-app-ad9be",
    storageBucket: "lifeflow-app-ad9be.firebasestorage.app",
    messagingSenderId: "458857696410",
    appId: "1:458857696410:web:8c927935c2ced7d9cd6323",
    measurementId: "G-58D5PS33L0"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);