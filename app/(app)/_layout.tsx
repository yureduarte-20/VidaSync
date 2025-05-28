import { Stack } from 'expo-router';
import 'react-native-reanimated';
export const unstable_settings = {
  initialRouteName: '(tabs)',
};
export default function RootLayout() {


  return <Stack  initialRouteName='sign-in'>
    <Stack.Screen name='(tabs)' options={{ headerShown: false }} />
    <Stack.Screen name="(medications)" options={{ headerShown: false }} />
    <Stack.Screen name="sign-in" options={{ headerShown: false }} />
  </Stack>;
}
