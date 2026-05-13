import React, { createContext, useContext, useEffect, useState } from "react";
import type { User } from '../types.ts';
import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth } from "../lib/firebase.ts";

type AuthContextType = {
    isLoggedIn: boolean;
    user: User | null;
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

    useEffect(() => {
        if (isTestMode()) return;

        const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
            if (!firebaseUser) {
                setUser(null);
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
        });
        return unsubscribe;
    }, []);

    const logout = () => {
        signOut(auth);
    };

    return (
        <AuthContext.Provider value={{ isLoggedIn: user !== null, user, logout }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error("useAuth must be used within AuthProvider");
    return ctx;
}
