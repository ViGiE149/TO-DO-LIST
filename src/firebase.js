import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
//import { collection, query, where } from 'firebase/firestore'; // Remove 'deleteDoc' from the import statement
import { doc,getFirestore, deleteDoc, query, where,collection ,getDocs} from 'firebase/firestore';



// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyAGlMisk1-FhAwadqkpVHz716IGEJlqxuQ",
    authDomain: "just-do-it-b69f3.firebaseapp.com",
    projectId: "just-do-it-b69f3",
    storageBucket: "just-do-it-b69f3.appspot.com",
    messagingSenderId: "854052536774",
    appId: "1:854052536774:web:e1dc9efcbd04c9ece632c7",
    measurementId: "G-BK1VHG6HZ0"
  };
  

  const app = initializeApp(firebaseConfig);
  const db = getFirestore(app);
  
  export default db;
