import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
    apiKey: "AIzaSyD0H54k98_137qONG7eCBSrTE5JGtmE01A",
    authDomain: "gittyapp-b780d.firebaseapp.com",
    projectId: "gittyapp-b780d",
    storageBucket: "gittyapp-b780d.firebasestorage.app",
    messagingSenderId: "383200900508",
    appId: "1:383200900508:web:82e432f09cbdd40b9e4459"
  };
  
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db };