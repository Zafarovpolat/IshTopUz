
import {
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
    type AuthProvider,
  } from "firebase/auth";
import { doc, getDoc, serverTimestamp, updateDoc } from "firebase/firestore"; 
import { auth, db } from "./firebase";
  
const checkUserProfile = async (user: User, additionalData = {}) => {
    if (!user) return;

    const userRef = doc(db, `users/${user.uid}`);
    const snapshot = await getDoc(userRef);

    if (snapshot.exists()) {
        await updateDoc(userRef, { lastLoginAt: serverTimestamp() });
        return snapshot.data()?.profileComplete || false;
    }
    
    return false;
};

export async function signUpWithEmail(email: string, password: string): Promise<{user: User; isNewUser: boolean} | null> {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      console.log("Success: User registered:", userCredential.user);
      // Profile document is now created in the onboarding server action
      return { user: userCredential.user, isNewUser: true };
    } catch (error: any) {
      console.error("Error: Registration failed:", error.message, `(Code: ${error.code})`);
      return null;
    }
}
  
export async function signInWithEmail(email: string, password: string): Promise<{user: User; isNewUser: boolean} | null> {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      console.log("Success: User signed in:", userCredential.user);
      
      const profileComplete = await checkUserProfile(userCredential.user);
      const isNewUser = !profileComplete;

      return { user: userCredential.user, isNewUser };
    } catch (error: any) {
      console.error("Error: Sign-in failed:", error.message, `(Code: ${error.code})`);
      return null;
    }
}
  
export async function doSignOut(): Promise<void> {
    try {
      // Очищаем серверную сессию
      await fetch('/api/auth/signout', { method: 'POST' });
      // Выходим из Firebase на клиенте
      await signOut(auth);
      console.log("Success: User signed out from client and server.");
    } catch (error: any) {
      console.error("Error: Sign-out failed:", error.message, `(Code: ${error.code})`);
    }
}
  
async function socialSignIn(provider: AuthProvider): Promise<{user: User; isNewUser: boolean} | null> {
    try {
      const result = await signInWithPopup(auth, provider);
      console.log("Success: Social sign-in successful:", result.user);
      
      const profileComplete = await checkUserProfile(result.user);
      const isNewUser = !profileComplete;

      return { user: result.user, isNewUser };
    } catch (error: any) {
      console.error("Error: Social sign-in failed:", error.message, `(Code: ${error.code})`);
      return null;
    }
}
  
export function signInWithGoogle(): Promise<{user: User; isNewUser: boolean} | null> {
    const provider = new GoogleAuthProvider();
    return socialSignIn(provider);
}
  
export async function resetPassword(email: string): Promise<boolean> {
    try {
      await sendPasswordResetEmail(auth, email);
      console.log("Success: Password reset email sent to", email);
      return true;
    } catch (error: any) {
      console.error("Error: Password reset failed:", error.message, `(Code: ${error.code})`);
      if (error.code === 'auth/user-not-found') {
        // This error is handled in the UI to give feedback.
      }
      return false;
    }
}
  
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
  
export function onAuthStateChange(callback: (user: User | null) => void): import("firebase/auth").Unsubscribe {
    return onAuthStateChanged(auth, callback);
}
  
export async function signInWithCustomTokenFunc(token: string): Promise<{user: User, isNewUser: boolean} | null> {
    try {
      const userCredential = await signInWithCustomToken(auth, token);
      console.log("Success: Signed in with custom token:", userCredential.user);
      
      const profileComplete = await checkUserProfile(userCredential.user);
      const isNewUser = !profileComplete;

      return { user: userCredential.user, isNewUser };
    } catch (error: any) {
      console.error("Error: Custom sign-in failed:", error.message, `(Code: ${error.code})`);
      return null;
    }
}

export { auth };
