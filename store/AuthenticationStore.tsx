import { createContext, use, type PropsWithChildren } from 'react';
import { useStorageState } from '../hooks/useStorageState';
export type Credentials = {
    login: string;
    password: string;
}
const AuthContext = createContext<{
    signIn: (credentials: Credentials) => Promise<void>;
    signOut: () => void;
    session?: string | null;
    isLoading: boolean;
}>({
    signIn: (credentials: Credentials) => Promise.resolve(),
    signOut: () => null,
    session: null,
    isLoading: false,
});

// This hook can be used to access the user info.
export function useSession() {
    const value = use(AuthContext);
    if (!value) {
        throw new Error('useSession must be wrapped in a <SessionProvider />');
    }

    return value;
}

export function SessionProvider({ children }: PropsWithChildren) {
    const [[isLoading, session], setSession] = useStorageState('session');
    async function sigIn(credentials: Credentials) {
        return fetch('https://dummyjson.com/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({

                username: credentials.login,
                password: credentials.password,
                expiresInMins: 30
            }),
            credentials: 'include'
        })
            .then(async res => res.status < 300 ? res.json() : Promise.reject({ status: res.status, body: await res.json() }))
            .then(data => setSession(data.accessToken));
    }
    return (
        <AuthContext
            value={{
                signIn: sigIn,
                signOut: () => {
                    setSession(null);
                },
                session,
                isLoading,
            }}>
            {children}
        </AuthContext>
    );
}