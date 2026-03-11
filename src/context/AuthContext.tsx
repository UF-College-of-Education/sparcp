import React, { createContext, useContext, useState } from "react";
import type { User } from '../types.ts';

// TEMPORARY: Replace with SSO when approved
const TEMP_CREDENTIALS = [
    { username: "etc_tester", password: "c-lear0426" },
];

const SESSION_KEY = "sparc_session";

type AuthContextType = {
    isLoggedIn: boolean;
    user: User | null;
    login: (username: string, password: string) => boolean;
    logout: () => void;
};

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    // When SSO ready replace with call to get Shib Auth Status
    const [user, setUser] = useState<User | null>(() => {
        const stored = sessionStorage.getItem(SESSION_KEY);
        if (!stored) return null;
        try {
            return JSON.parse(stored);
        } catch {
            sessionStorage.removeItem(SESSION_KEY);
            return null;
        }
    });

    const login = (username: string, password: string): boolean => {
        const valid = TEMP_CREDENTIALS.some(
            (c) => c.username === username && c.password === password
        );
        if (valid) {
            const sessionUser: User = { username };
            sessionStorage.setItem(SESSION_KEY, JSON.stringify(sessionUser));
            setUser(sessionUser);
        }
        return valid;
    };

    const logout = () => {
        sessionStorage.removeItem(SESSION_KEY);
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ isLoggedIn: user !== null, user, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error("useAuth must be used within AuthProvider");
    return ctx;
}
