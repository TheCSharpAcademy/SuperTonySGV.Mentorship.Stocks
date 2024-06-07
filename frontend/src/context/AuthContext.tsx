import React, { createContext, useState, ReactNode } from 'react';

interface AuthContextType {
    auth: { token: string | null };
    isAuthenticated: boolean;
    setAuth: (auth: { token: string | null }) => void;
}

const AuthContext = createContext<AuthContextType>({
    auth: { token: null },
    isAuthenticated: false,
    setAuth: () => {},
});

const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [auth, setAuthState] = useState<{ token: string | null }>({ token: null });

    const setAuth = (auth: { token: string | null }) => {
        setAuthState(auth);
    };

    const isAuthenticated = auth.token !== null;

    return (
        <AuthContext.Provider value={{ auth, isAuthenticated, setAuth }}>
            {children}
        </AuthContext.Provider>
    );
};

export { AuthContext, AuthProvider };
