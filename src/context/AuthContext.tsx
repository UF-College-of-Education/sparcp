import React, { createContext, useContext, useState } from "react";

// TEMPORARY: Replace with SSO when approved
const TEMP_CREDENTIALS = [
    { username: "etc_tester", password: "c-lear0426" },
];

type AuthContextType = {
    isLoggedIn: boolean;
    login: (username: string, password: string) => boolean;
    logout: () => void;
};

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    const login = (username: string, password: string): boolean => {
        const valid = TEMP_CREDENTIALS.some(
            (c) => c.username === username && c.password === password
        );
        if (valid) setIsLoggedIn(true);
        return valid;
    };

    const logout = () => setIsLoggedIn(false);

    return (
        <AuthContext.Provider value={{ isLoggedIn, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error("useAuth must be used within AuthProvider");
    return ctx;
}
