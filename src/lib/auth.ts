
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
    RecaptchaVerifier,
    signInWithPhoneNumber,
    signOut,
    onAuthStateChanged,
    signInWithCustomToken
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


// --- Phone Authentication / 2FA ---
declare global {
    interface Window {
        recaptchaVerifier?: RecaptchaVerifier;
        confirmationResult?: any;
    }
}
/**
 * Sets up RecaptchaVerifier for phone authentication.
 * @param {string} containerId - The ID of the HTML element where the reCAPTCHA should be rendered.
 * @returns {RecaptchaVerifier | null}
 */
export function setupRecaptcha(containerId) {
    // Ensure this is only called on the client-side
    if (typeof window !== "undefined") {
        if (window.recaptchaVerifier) {
            window.recaptchaVerifier.clear();
        }
        window.recaptchaVerifier = new RecaptchaVerifier(auth, containerId, {
            'size': 'invisible',
            'callback': (response) => {
                // reCAPTCHA solved, allow signInWithPhoneNumber.
                console.log("reCAPTCHA solved.");
            }
        });
        return window.recaptchaVerifier;
    }
    return null;
}

/**
 * Sends an SMS verification code to the given phone number.
 * @param {string} phoneNumber - The user's phone number in E.164 format.
 * @returns {Promise<string | null>} The verification ID or null on failure.
 */
export async function sendSmsVerification(phoneNumber) {
    const appVerifier = window.recaptchaVerifier;
    if (!appVerifier) {
        console.error("Error: RecaptchaVerifier not initialized.");
        return null;
    }
    try {
        const confirmationResult = await signInWithPhoneNumber(auth, phoneNumber, appVerifier);
        // SMS sent. Save confirmationResult to resolve with verification code.
        window.confirmationResult = confirmationResult;
        console.log("Success: SMS verification code sent to", phoneNumber);
        return confirmationResult.verificationId;
    } catch (error) {
        console.error("Error: SMS sending failed:", error.message, `(Code: ${error.code})`);
        // Handle errors like invalid phone number.
        // Reset reCAPTCHA if needed
        appVerifier.render().then((widgetId) => {
            // @ts-ignore
            grecaptcha.reset(widgetId);
        });
        return null;
    }
}

/**
 * Verifies the SMS code and signs in the user.
 * Can be used to link the phone number to an existing account as a second factor.
 * @param {string} code - The 6-digit code from the SMS.
 * @returns {Promise<User | null>} The user object or null on failure.
 */
export async function verifySmsCode(code) {
    if (!window.confirmationResult) {
        console.error("Error: confirmationResult is not available. Please send SMS first.");
        return null;
    }
    try {
        const result = await window.confirmationResult.confirm(code);
        const user = result.user;
        console.log("Success: Phone number verified. User:", user);
        // The user is now signed in with their phone number.
        // You can now link this credential to their primary account if implementing 2FA.
        return user;
    } catch (error) {
        console.error("Error: Invalid verification code:", error.message, `(Code: ${error.code})`);
        return null;
    }
}

export async function signInWithTelegramToken(customToken) {
   try {
       const userCredential = await signInWithCustomToken(auth, customToken);
       console.log("Success: User signed in with Telegram:", userCredential.user);
       return userCredential.user;
   } catch (error) {
       console.error("Error: Telegram sign-in failed:", error.message, `(Code: ${error.code})`);
       return null;
   }
}

export async function signInWithTelegram(telegramUser) {
   try {
       // Отправляем данные на бекенд для создания custom token
       const response = await fetch('/api/auth/telegram', {
           method: 'POST',
           headers: {
               'Content-Type': 'application/json',
           },
           body: JSON.stringify(telegramUser),
       });

       const result = await response.json();

       if (result.success && result.customToken) {
           // Используем custom token для входа в Firebase
           return await signInWithTelegramToken(result.customToken);
       } else {
           console.error("Error: Failed to get custom token from backend");
           return null;
       }
   } catch (error) {
       console.error("Error: Telegram authentication failed:", error.message);
       return null;
   }

/**
 * Listens for authentication state changes.
 * @param {function(User | null)} callback - The function to call when the auth state changes.
 * @returns {import("firebase/auth").Unsubscribe} A function to unsubscribe the listener.
 */
export function onAuthStateChange(callback) {
    return onAuthStateChanged(auth, callback);
}

    