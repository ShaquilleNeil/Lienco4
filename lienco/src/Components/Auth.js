// src/auth.js
import { auth } from './firebase';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
} from 'firebase/auth';
import { getAuth } from 'firebase/auth';

// Sign Up Function
export const register = async (email, password) => {
  return await createUserWithEmailAndPassword(auth, email, password);
};

// Sign In Function
export const login = async (email, password) => {
  return await signInWithEmailAndPassword(auth, email, password);
};

export const resetPassword = async (email) => {
  const auth = getAuth();
  return sendPasswordResetEmail(auth, email)
    .then(() => {
      // Email sent.
      console.log("Password reset email sent!");
    })
    .catch((error) => {
      // An error occurred.
      throw new Error(error.message);
    });
}

export default auth