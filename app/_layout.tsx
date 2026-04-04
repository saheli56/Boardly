import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useFonts } from 'expo-font';
import { Inter_400Regular } from '@expo-google-fonts/inter';
import 'react-native-reanimated';

import { useColorScheme } from '@/hooks/use-color-scheme';
import { CheckInFlowProvider } from '@/context/checkin-flow-context';

export const unstable_settings = {
  anchor: '(tabs)',
};

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [fontsLoaded] = useFonts({
    Inter: Inter_400Regular,
  });

  if (!fontsLoaded) {
    return null; // or a loading screen
  }

  return (
    <CheckInFlowProvider>
      <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
        <Stack>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="staff" options={{ presentation: 'card', title: 'Operations Dashboard' }} />
          <Stack.Screen name="modal" options={{ presentation: 'modal', title: 'Modal' }} />
        </Stack>
        <StatusBar style="auto" />
      </ThemeProvider>
    </CheckInFlowProvider>
  );
}
