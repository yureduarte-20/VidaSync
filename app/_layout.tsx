import { PaperTheme } from '@/hooks/useThemeColor';
import { SessionProvider } from '@/store/AuthenticationStore';
import { Slot } from 'expo-router';
import React from 'react';
import { Provider as PaperProvider } from 'react-native-paper';
export default function Root() {
   
    return (
        <PaperProvider theme={PaperTheme}>
            <SessionProvider>
                <Slot />
            </SessionProvider>
        </PaperProvider>
    )
}