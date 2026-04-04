import { ReactNode } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';

import { Colors, Fonts } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { ThemedText } from '@/components/themed-text';
import { ThemeToggle } from '@/components/ui/theme-toggle';

type AppScaffoldProps = {
  title: string;
  subtitle: string;
  children: ReactNode;
  rightSlot?: ReactNode;
};

export function AppScaffold({ title, subtitle, children, rightSlot }: AppScaffoldProps) {
  const colorScheme = useColorScheme() ?? 'light';
  const palette = Colors[colorScheme];
  const insets = useSafeAreaInsets();

  return (
    <SafeAreaView style={StyleSheet.flatten([styles.safeArea, { backgroundColor: palette.background }])} edges={['top']}>
      <ScrollView
        style={styles.screen}
        contentContainerStyle={StyleSheet.flatten([
          styles.content,
          {
            paddingBottom: insets.bottom + 112,
          },
        ])}
        showsVerticalScrollIndicator={false}>
        <View style={styles.headerRow}>
          <View style={styles.headerTextWrap}>
            <ThemedText style={StyleSheet.flatten([styles.subtitle, { color: palette.icon }])}>{subtitle}</ThemedText>
            <ThemedText type="title" style={styles.title}>
              {title}
            </ThemedText>
          </View>
          <ThemeToggle />
        </View>
        {children}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  screen: {
    flex: 1,
  },
  content: {
    paddingHorizontal: 20,
    paddingTop: 12,
    gap: 14,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: 12,
  },
  headerTextWrap: {
    flex: 1,
    gap: 4,
  },
  subtitle: {
    fontSize: 12,
    letterSpacing: 1.1,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  title: {
    fontFamily: Fonts.rounded,
    lineHeight: 36,
  },
});
