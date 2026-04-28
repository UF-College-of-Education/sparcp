import { initializeApp } from "firebase/app";
import { initializeUI, providerRedirectStrategy } from '@firebase-oss/ui-core';
import { 
    getFirestore, 
    collection, 
    query, 
    where, 
    limit,
    getDocs 
} from "firebase/firestore";

import type { SessionData, RawSessionSnapshot } from "../types";
import { getAuth } from "firebase/auth";

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

const behaviors: [] = [
    // providerRedirectStrategy();
];

export const ui = initializeUI({ app, behaviors});

export const auth = getAuth();


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