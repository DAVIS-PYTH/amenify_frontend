// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: 'AIzaSyBsEgx4VEhsFJuIbn-cK5z8oEmj5vNfvIU',
  authDomain: 'amenify-f8088.firebaseapp.com',
  projectId: 'amenify-f8088',
  storageBucket: 'amenify-f8088.appspot.com',
  messagingSenderId: '726984055237',
  appId: '1:726984055237:web:5541bdc556f1af4f6853ac',
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
