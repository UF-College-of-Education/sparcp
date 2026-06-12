import React, { createContext, useContext, useEffect, useState } from "react";
import type { User } from '../types.ts';
import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth, getUserData } from "../lib/firebase.ts";
import type { DocumentData } from "firebase/firestore";

type AuthContextType = {
    isLoggedIn: boolean;
    user: User | null;
    permissions: string[];
    logout: () => void;
};

const AuthContext = createContext<AuthContextType | null>(null);

const TEST_USER: User = {
    displayName: 'Test User',
    email: 'testuser@localhost',
    emailVerified: true,
    uuid: 'test-user-local',
    lastLoginTime: new Date(),
};

/**
 * Add test mode to bypass login for testing
 * Add ?testMode=true to URL
 * @returns 
 */
function isTestMode() {
    return (
        window.location.hostname === 'localhost' &&
        new URLSearchParams(window.location.search).get('testMode') === 'true'
    );
}

export function AuthProvider({ children }: { children: React.ReactNode }) {

    const [user, setUser] = useState<User | null>(() => isTestMode() ? TEST_USER : null);
    const [permissions, setPermissions] = useState<string[]>([]);

    const fetchUserData = async (email: string) => {
        try {
            const data: DocumentData | false = await getUserData(email);
            return data;
        }
        catch (error) {
            console.log('Error fetching user data.', error);
            return;
        };
    }    

    useEffect(() => {
        if (isTestMode()) return;

        const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
            if (!firebaseUser) {
                setUser(null);
                setPermissions([]);
                return;
            }
            const { email, emailVerified, displayName, uid, metadata } = firebaseUser;

            const user = {
                displayName: displayName ?? '',
                email: email ?? '',
                emailVerified: emailVerified,
                uuid: uid,
                lastLoginTime: metadata.lastSignInTime ? new Date(metadata.lastSignInTime) : new Date(),
            }

            setUser(user);

            // Fetch and set user permissions
            const userData: DocumentData | false | undefined = await fetchUserData(user.email);

            if ( userData && userData.role && Array.isArray(userData.role) ) {
                setPermissions(userData.role )
            } else {
                setPermissions([]);
            }

        });
        return unsubscribe;
    }, []);

    const logout = () => {
        signOut(auth);
    };

    return (
        <AuthContext.Provider value={{ isLoggedIn: user !== null, user, permissions, logout }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error("useAuth must be used within AuthProvider");
    return ctx;
}
