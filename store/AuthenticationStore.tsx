import { useFetcher } from '@/hooks/useFetcher';
import { useRoute } from '@react-navigation/native';
import { useRouter } from 'expo-router';
import { createContext, use, useCallback, useEffect, type PropsWithChildren } from 'react';
import { useStorageState } from '../hooks/useStorageState';
import { useSnackbar } from './SnackbarContext';
export type Credentials = {
    email: string;
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
    const fetcher = useCallback(useFetcher, []);
    const router = useRouter()
    const route = useRoute()
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
                    route.name == '__root' && router.replace('/(app)/(tabs)/medication')
                })
                .catch(console.error)
        }
    }, [isLoading])
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
                isLoading,
            }}>
            {children}
        </AuthContext>
    );
}
