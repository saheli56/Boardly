import { Pressable, StyleSheet, Appearance } from 'react-native';
import Svg, { Circle, Path, Line } from 'react-native-svg';

import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

function SunIcon({ size = 18, color = '#000' }: { size?: number; color?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round">
      <Circle cx="12" cy="12" r="4" />
      <Line x1="12" y1="2" x2="12" y2="4" />
      <Line x1="12" y1="20" x2="12" y2="22" />
      <Line x1="4.93" y1="4.93" x2="6.34" y2="6.34" />
      <Line x1="17.66" y1="17.66" x2="19.07" y2="19.07" />
      <Line x1="2" y1="12" x2="4" y2="12" />
      <Line x1="20" y1="12" x2="22" y2="12" />
      <Line x1="4.93" y1="19.07" x2="6.34" y2="17.66" />
      <Line x1="17.66" y1="6.34" x2="19.07" y2="4.93" />
    </Svg>
  );
}

function MoonIcon({ size = 18, color = '#000' }: { size?: number; color?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round">
      <Path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
    </Svg>
  );
}

export function ThemeToggle() {
  const colorScheme = useColorScheme() ?? 'light';
  const palette = Colors[colorScheme];

  const toggleTheme = () => {
    const newScheme = colorScheme === 'dark' ? 'light' : 'dark';
    Appearance.setColorScheme(newScheme);
  };

  return (
    <Pressable
      onPress={toggleTheme}
      style={[styles.button, { backgroundColor: palette.surface, borderColor: palette.border }]}
      hitSlop={8}
      accessibilityLabel="Toggle theme">
      {colorScheme === 'dark' ? <SunIcon size={18} color={palette.icon} /> : <MoonIcon size={18} color={palette.icon} />}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    width: 42,
    height: 42,
    borderRadius: 14,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});