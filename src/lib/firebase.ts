import { initializeApp } from "firebase/app";
import { initializeUI } from '@firebase-oss/ui-core';
import { 
    getFirestore, 
    collection, 
    query, 
    where, 
    limit,
    getDocs, 
    doc,
    getDoc
} from "firebase/firestore";

import type { SessionData, RawSessionSnapshot } from "../types";
import type { ActionCodeSettings, AuthError } from "firebase/auth";
import { getAuth, sendSignInLinkToEmail, isSignInWithEmailLink, signInWithEmailLink } from "firebase/auth";

const firebaseConfig = {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
    storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
    appId: import.meta.env.VITE_FIREBASE_APP_ID,
    measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID
};


// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Cloud Firestore and get a reference to the service
const db = getFirestore(app);

export const ui = initializeUI({ app });

export const auth = getAuth();

/**
 * Checks if user is on allow list and sends link
 * @param email 
 * @param actionCodeSettings 
 * @returns 
 */
export async function attemptLogin(email: string, actionCodeSettings: ActionCodeSettings) {
    
    // Check email against permitted users
    const userData = await getUserData(email);
    const validUser = userData && userData.active === true;

    if (validUser == false) {
        return "invalid";
    }

    window.localStorage.setItem('emailForSignIn', email);

    try {
        await sendSignInLinkToEmail(auth, email, actionCodeSettings);
    }
    catch (error) {
        return error;
    }
    return 'sent';
}

/**
 * Fetch user data from allowUsers collection
 * @param email 
 * @returns {userData} | false
 */
export async function getUserData(email: string) {
    const docRef = doc(db, "allowedUsers", email );
    const snapshot = await getDoc(docRef);

    if ( snapshot.exists() && snapshot.data()) {
        const userData = snapshot.data();
        return userData;
    } else { 
        return false;
    }
}

/**
 * Checks if user has clicked link from sign in email 
 * and validates the info provide
 * @returns string | null
 */
export async function CompleteSignIn() {
    if (! isSignInWithEmailLink(auth, window.location.href)) return null;

    // Attempt to retrieve email of user signing in
    let emailForSignIn = localStorage.getItem('emailForSignIn');
    if (!emailForSignIn) {
        emailForSignIn = window.prompt('Please confirm your email address');
    }

    if (!emailForSignIn) {
        return "invalidEmail";
    }

    // Send info to Google for verification
    try {
        await signInWithEmailLink(auth, emailForSignIn, location.href);
        window.localStorage.removeItem('emailForSignIn');
        return "success";
    } catch (error) {
        const { code } = error as AuthError;
        return code;
    }
}

/**
 * FETCH USER SESSIONS
 * 
 * TODO Update to actual identifier for a particular user when available
 * 
 * @param fbUserId string - ID of user in Firebase
 * @returns array of session data objects
 */
export async function fetchUserSessions ( fbUserId: string ) {
    const q = query(collection(db, "sessions"), where("user", "==", fbUserId ), limit(10));

    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data() as RawSessionSnapshot
    }));
}

export function cleanSessionData ( rawSessionData: SessionData ) {

    const createdAt = new Date(rawSessionData.createdAt).toLocaleString();

    return {
        sessionId: rawSessionData.id,
        createdAt: createdAt
    };
}