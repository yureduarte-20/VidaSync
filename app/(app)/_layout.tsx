import { Stack } from 'expo-router';
import 'react-native-reanimated';
export const unstable_settings = {
  initialRouteName: '(tabs)',
};
export default function RootLayout() {
  

  return <Stack >
    <Stack.Screen name='(tabs)' options={{ headerShown: false }} />
    <Stack.Screen name="sign-in" options={{ headerShown: false }} />
  </Stack>;
}
