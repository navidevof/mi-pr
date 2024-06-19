// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { getAnalytics } from 'firebase/analytics';
import { getFirestore } from 'firebase/firestore';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';

const firebaseConfig = {
  apiKey: 'AIzaSyAnuS6qXWcbuF6KwOvtX2C1JkTqrejQlWY',
  authDomain: 'mi-pr-7aaa5.firebaseapp.com',
  projectId: 'mi-pr-7aaa5',
  storageBucket: 'mi-pr-7aaa5.appspot.com',
  messagingSenderId: '465966381214',
  appId: '1:465966381214:web:e6ececabb118918ae3e38f',
  measurementId: 'G-2JXL81NY0W',
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const analytics = getAnalytics(app);
const auth = getAuth(app);

const providers = {
  google: new GoogleAuthProvider(),
};

export { db, analytics, auth, providers };
