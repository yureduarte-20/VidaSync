import { HapticTab } from '@/components/HapticTab';
import { IconSymbol } from '@/components/ui/IconSymbol';
import TabBarBackground from '@/components/ui/TabBarBackground';
import { useSession, } from '@/store/AuthenticationStore';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { useFonts } from 'expo-font';
import { Redirect, Tabs } from 'expo-router';
import React from 'react';
import { Platform, SafeAreaView } from 'react-native';
import { ActivityIndicator, useTheme } from 'react-native-paper';

export default function TabLayout() {
  const theme = useTheme()
  const { session, isLoading } = useSession();

  const [loaded] = useFonts({
    SpaceMono: require('../../assets/fonts/SpaceMono-Regular.ttf'),
  });

  if (!loaded) {
    return null;
  }
  if (isLoading) {
    return <SafeAreaView style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <ActivityIndicator size={'large'} />
    </SafeAreaView>;
  }
  if (!session) {
    return <Redirect href="/sign-in" />;
  }
  
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: theme.colors.primary,
        headerShown: false,
        tabBarButton: HapticTab,
        tabBarBackground: TabBarBackground,
        tabBarStyle: Platform.select({
          ios: {
            // Use a transparent background on iOS to show the blur effect
            position: 'absolute',
          },
          default: {},
        }),
      }}>
      <Tabs.Screen
        name="programados"
        options={{
          title: 'Programados',
          tabBarIcon: ({ color }) => <MaterialCommunityIcons name="clock" size={28} color={color} />,
        }}
      />
      <Tabs.Screen
        name="medication"
        options={{
          title: 'Medicamentos',
          tabBarIcon: ({ color }) => <MaterialCommunityIcons name="pill" size={28} color={color} /> ,
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: 'Configurações',
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="paperplane.fill" color={color} />,
        }}
      />
    </Tabs>
  );
}
