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
    signInWithCustomToken,
    type User,
    type Auth,
    type AuthProvider,
  } from "firebase/auth";
  import { app } from "./firebase"; // Предполагается, что firebase.ts экспортирует инициализированный app
  
  // Инициализация Firebase Authentication
  export const auth: Auth = getAuth(app);
  
  /**
   * Handles the creation of a new user with email and password.
   * @param email - The user's email.
   * @param password - The user's password.
   * @returns The created user object or null on failure.
   */
  export async function signUpWithEmail(email: string, password: string): Promise<User | null> {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      console.log("Success: User registered:", userCredential.user);
      await sendVerificationEmail();
      return userCredential.user;
    } catch (error: any) {
      console.error("Error: Registration failed:", error.message, `(Code: ${error.code})`);
      return null;
    }
  }
  
  /**
   * Handles user sign-in with email and password.
   * @param email - The user's email.
   * @param password - The user's password.
   * @returns The signed-in user object or null on failure.
   */
  export async function signInWithEmail(email: string, password: string): Promise<User | null> {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      console.log("Success: User signed in:", userCredential.user);
      if (!userCredential.user.emailVerified) {
        console.warn("Warning: User email not verified.");
      }
      return userCredential.user;
    } catch (error: any) {
      console.error("Error: Sign-in failed:", error.message, `(Code: ${error.code})`);
      return null;
    }
  }
  
  /**
   * Signs out the current user.
   * @returns Promise resolving when sign-out is complete.
   */
  export async function doSignOut(): Promise<void> {
    try {
      await signOut(auth);
      console.log("Success: User signed out.");
    } catch (error: any) {
      console.error("Error: Sign-out failed:", error.message, `(Code: ${error.code})`);
    }
  }
  
  /**
   * Handles social media sign-in.
   * @param provider - The authentication provider (e.g., GoogleAuthProvider).
   * @returns The signed-in user object or null on failure.
   */
  async function socialSignIn(provider: AuthProvider): Promise<User | null> {
    try {
      const result = await signInWithPopup(auth, provider);
      console.log("Success: Social sign-in successful:", result.user);
      return result.user;
    } catch (error: any) {
      console.error("Error: Social sign-in failed:", error.message, `(Code: ${error.code})`);
      return null;
    }
  }
  
  /**
   * Initiates Google Sign-In flow.
   * @returns The signed-in user object or null on failure.
   */
  export function signInWithGoogle(): Promise<User | null> {
    const provider = new GoogleAuthProvider();
    return socialSignIn(provider);
  }
  
  /**
   * Sends a password reset email to the given email address.
   * @param email - The user's email.
   * @returns True on success, false on failure.
   */
  export async function resetPassword(email: string): Promise<boolean> {
    try {
      await sendPasswordResetEmail(auth, email);
      console.log("Success: Password reset email sent to", email);
      return true;
    } catch (error: any) {
      console.error("Error: Password reset failed:", error.message, `(Code: ${error.code})`);
      return false;
    }
  }
  
  /**
   * Sends an email verification link to the current user.
   * @returns True on success, false on failure.
   */
  export async function sendVerificationEmail(): Promise<boolean> {
    const user = auth.currentUser;
    if (user) {
      try {
        await sendEmailVerification(user);
        console.log("Success: Verification email sent.");
        return true;
      } catch (error: any) {
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
   * @param callback - The function to call when the auth state changes.
   * @returns A function to unsubscribe the listener.
   */
  export function onAuthStateChange(callback: (user: User | null) => void): import("firebase/auth").Unsubscribe {
    return onAuthStateChanged(auth, callback);
  }
  
  /**
   * Handles sign-in with a custom token (e.g., from Telegram bot).
   * @param token - The custom token.
   * @returns The signed-in user or null on failure.
   */
  export async function signInWithCustomTokenFunc(token: string): Promise<User | null> {
    try {
      const userCredential = await signInWithCustomToken(auth, token);
      console.log("Success: Signed in with custom token:", userCredential.user);
      return userCredential.user;
    } catch (error: any) {
      console.error("Error: Custom sign-in failed:", error.message, `(Code: ${error.code})`);
      return null;
    }
  }