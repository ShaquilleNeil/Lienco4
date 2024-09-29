// src/auth.js
import { auth } from './firebase';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from 'firebase/auth';

// Sign Up Function
export const register = async (email, password) => {
  return await createUserWithEmailAndPassword(auth, email, password);
};

// Sign In Function
export const login = async (email, password) => {
  return await signInWithEmailAndPassword(auth, email, password);
};
