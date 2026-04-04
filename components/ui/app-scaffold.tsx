import { ReactNode } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';

import { Colors, Fonts } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { ThemedText } from '@/components/themed-text';

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
    <SafeAreaView style={[styles.safeArea, { backgroundColor: palette.background }]} edges={['top']}>
      <View style={styles.backgroundWrap} pointerEvents="none">
        <View style={[styles.orbA, { backgroundColor: palette.info }]} />
        <View style={[styles.orbB, { backgroundColor: palette.warning }]} />
      </View>

      <ScrollView
        style={styles.screen}
        contentContainerStyle={[
          styles.content,
          {
            paddingBottom: insets.bottom + 112,
          },
        ]}
        showsVerticalScrollIndicator={false}>
        <View style={styles.headerRow}>
          <View style={styles.headerTextWrap}>
            <ThemedText style={[styles.subtitle, { color: palette.icon }]}>{subtitle}</ThemedText>
            <ThemedText type="title" style={styles.title}>
              {title}
            </ThemedText>
          </View>
          {rightSlot}
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
  backgroundWrap: {
    ...StyleSheet.absoluteFillObject,
    overflow: 'hidden',
  },
  orbA: {
    position: 'absolute',
    width: 280,
    height: 280,
    borderRadius: 140,
    top: -130,
    right: -100,
    opacity: 0.1,
  },
  orbB: {
    position: 'absolute',
    width: 200,
    height: 200,
    borderRadius: 100,
    top: 180,
    left: -120,
    opacity: 0.08,
  },
});
