import { PaperTheme } from '@/hooks/useThemeColor';
import { SessionProvider, useSession } from '@/store/AuthenticationStore';
import { MedicationProvider } from '@/store/MedicationStore';
import { SnackbarProvider } from '@/store/SnackbarContext';
import { Stack } from 'expo-router';
import React from 'react';
import { Provider as PaperProvider } from 'react-native-paper';
export default function Root() {

    return (
        <PaperProvider theme={PaperTheme}>
            <SnackbarProvider>
                <SessionProvider>
                    <MedicationProvider>
                        <RootNavigator />
                    </MedicationProvider>
                </SessionProvider>
            </SnackbarProvider>
        </PaperProvider>
    )
}

function RootNavigator() {
    const { session } = useSession();
    const isLoggedIn = Boolean(session).valueOf()
    return <Stack >
        <Stack.Protected guard={!isLoggedIn}>
            <Stack.Screen name="index" options={{
                headerShown: false
            }} />
        </Stack.Protected>
        <Stack.Protected guard={isLoggedIn}>
            <Stack.Screen name='(tabs)' options={{
                headerShown: false
            }} />
            <Stack.Screen name='(medications)' options={{
               headerShown: false
            }} />
        </Stack.Protected>
    </Stack>
}

