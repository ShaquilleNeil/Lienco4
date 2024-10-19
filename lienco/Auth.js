// src/auth.js
import { doc, setDoc } from 'firebase/firestore';
import { auth, db } from './src/firebase';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
} from 'firebase/auth';

// Sign Up Function



// Sign In Function
export const login = async (email, password) => {
  return await signInWithEmailAndPassword(auth, email, password);
};

const addUserToFirestore = async (uid, email, role) => {
  console.log('Attempting to add user to Firestore:', { uid, email, role });
  try {
    const userDocRef = doc(db, 'Roles', uid); // Correctly refer to the collection and document
    await setDoc(userDocRef, { 
      Email: email, 
      Role: role 
    });
    console.log('User successfully added to Firestore');
  } catch (error) {
    console.error('Error adding user to Firestore:', error);
  }
};



const testFirestoreWrite = async () => {
  console.log('Testing Firestore write');
  try {
    const userDocRef = doc(db, 'Roles', 'testDoc'); // Correctly refer to the collection and document
    await setDoc(userDocRef, {
      Email: 'test@example.com',
      Role: 'user'
    });
    console.log('Test document written to Firestore');
  } catch (error) {
    console.error('Error writing test document to Firestore:', error);
  }
};

testFirestoreWrite();

export const register = async (email, password) => {
  console.log('Register function called'); // This should log when the function is entered
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    await addUserToFirestore(user.uid, email, 'user');
    console.log('User successfully registered and added to Firestore!');
  } catch (error) {
    console.error('Registration error:', error.message); // Log any errors
    throw new Error(error.message);
  }
};


