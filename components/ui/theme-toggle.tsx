import { Pressable, StyleSheet, Appearance } from 'react-native';

import { IconSymbol } from '@/components/ui/icon-symbol';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

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
      hitSlop={8}>
      <IconSymbol
        name={colorScheme === 'dark' ? 'sun.max.fill' : 'moon.fill'}
        size={18}
        color={palette.icon}
      />
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