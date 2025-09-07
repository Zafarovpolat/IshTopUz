// IMPORTANT: This implementation is for a client-side environment.
// Never expose your private keys or sensitive credentials in client-side code.

import {
    getAuth,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    sendPasswordResetEmail,
    sendEmailVerification,
    GoogleAuthProvider,
    signInWithPopup,
    signOut,
    onAuthStateChanged,
    type User,
    type Auth,
    type AuthProvider
} from "firebase/auth";
import { app } from "./firebase"; // Your initialized Firebase app

// Initialize Firebase Authentication and get a reference to the service
export const auth: Auth = getAuth(app); // Экспортируем auth

/**
 * Handles the creation of a new user with email and password.
 * @param {string} email - The user's email.
 * @param {string} password - The user's password.
 * @returns {Promise<User | null>} The created user object or null on failure.
 */
export async function signUpWithEmail(email, password) {
    try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        console.log("Success: User registered:", userCredential.user);
        await sendVerificationEmail();
        return userCredential.user;
    } catch (error) {
        console.error("Error: Registration failed:", error.message, `(Code: ${error.code})`);
        return null;
    }
}

/**
 * Handles user sign-in with email and password.
 * @param {string} email - The user's email.
 * @param {string} password - The user's password.
 * @returns {Promise<User | null>} The signed-in user object or null on failure.
 */
export async function signInWithEmail(email, password) {
    try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        console.log("Success: User signed in:", userCredential.user);
        if (!userCredential.user.emailVerified) {
            console.warn("Warning: User email not verified.");
        }
        return userCredential.user;
    } catch (error) {
        console.error("Error: Sign-in failed:", error.message, `(Code: ${error.code})`);
        return null;
    }
}

/**
 * Signs out the current user.
 * @returns {Promise<void>}
 */
export async function doSignOut() {
    try {
        await signOut(auth);
        console.log("Success: User signed out.");
    } catch (error) {
        console.error("Error: Sign-out failed:", error.message, `(Code: ${error.code})`);
    }
}

/**
 * Handles social media sign-in.
 * @param {AuthProvider} provider - The authentication provider (e.g., GoogleAuthProvider).
 * @returns {Promise<User | null>} The signed-in user object or null on failure.
 */
async function socialSignIn(provider) {
    try {
        const result = await signInWithPopup(auth, provider);
        console.log("Success: Social sign-in successful:", result.user);
        return result.user;
    } catch (error) {
        console.error("Error: Social sign-in failed:", error.message, `(Code: ${error.code})`);
        // Handle specific errors like account-exists-with-different-credential
        return null;
    }
}

/**
 * Initiates Google Sign-In flow.
 * @returns {Promise<User | null>}
 */
export function signInWithGoogle() {
    const provider = new GoogleAuthProvider();
    return socialSignIn(provider);
}

/**
 * Sends a password reset email to the given email address.
 * @param {string} email - The user's email.
 * @returns {Promise<boolean>} True on success, false on failure.
 */
export async function resetPassword(email) {
    try {
        await sendPasswordResetEmail(auth, email);
        console.log("Success: Password reset email sent to", email);
        return true;
    } catch (error) {
        console.error("Error: Password reset failed:", error.message, `(Code: ${error.code})`);
        return false;
    }
}

/**
 * Sends an email verification link to the current user.
 * @returns {Promise<boolean>} True on success, false on failure.
 */
export async function sendVerificationEmail() {
    const user = auth.currentUser;
    if (user) {
        try {
            await sendEmailVerification(user);
            console.log("Success: Verification email sent.");
            return true;
        } catch (error) {
            console.error("Error: Could not send verification email:", error.message, `(Code: ${error.code})`);
            return false;
        }
    } else {
        console.warn("Warning: No user is signed in to send a verification email.");
        return false;
    }
}


/**
 * Listens for authentication state changes.
 * @param {function(User | null)} callback - The function to call when the auth state changes.
 * @returns {import("firebase/auth").Unsubscribe} A function to unsubscribe the listener.
 */
export function onAuthStateChange(callback) {
    return onAuthStateChanged(auth, callback);
}
