import { useFetcher } from '@/hooks/useFetcher';
import { createContext, use, useCallback, useEffect, type PropsWithChildren } from 'react';
import { useStorageState } from '../hooks/useStorageState';
import { useSnackbar } from './SnackbarContext';
export type Credentials = {
    email: string;
    password: string;
}
export type User = {
    id: number;
    name: string;
    email: string;
}
const AuthContext = createContext<{
    signIn: (credentials: Credentials) => Promise<void>;
    signOut: () => void;
    session?: string | null;
    updateUser: (user: Omit<User, 'id'>) => Promise<void>
    isLoading: boolean;
}>({
    signIn: (credentials: Credentials) => Promise.resolve(),
    updateUser: (user: Omit<User, 'id'>) => Promise.resolve(),
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
    const fetcher = useCallback(useFetcher, []);
    const  { showSnackbar } = useSnackbar()
    useEffect(() => {
        if (!isLoading && session) {
            showSnackbar("Recuperando informações de login", 1000)
            fetcher({
                uri: '/user',
                method: 'GET',
                headers: {
                    'Authorization': 'Bearer ' + session
                }
            })
                .then((data) => {
                    console.log(data)
                })
                .catch(console.error)
        }
    }, [isLoading])
    async function updateUser(user: Omit<User, 'id'>){
        try {
            await fetcher({
                uri: '/profile',
                method: 'PUT',
                data: user,
                headers:{
                    Authorization: `Bearer ${session}`
                }
            })
        } catch (e: any) {
            throw e;
        }
    }
    async function sigIn(credentials: Credentials) {
        try {
            const { body } = await fetcher({
                uri: '/login',
                method: 'POST',
                data: JSON.stringify(credentials)
            })
            setSession(body.accessToken)
            return body
        } catch (e: any) {
            throw e;
        }

    }

    return (
        <AuthContext
            value={{
                signIn: sigIn,
                signOut: () => {
                    setSession(null);
                },
                session,
                updateUser,
                isLoading,
            }}>
            {children}
        </AuthContext>
    );
}
