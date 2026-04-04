import { ScrollView, StyleSheet, View } from 'react-native';

import { IconSymbol } from '@/components/ui/icon-symbol';
import { flightUpdates } from '@/constants/checkin-data';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';

export default function UpdatesScreen() {
  const colorScheme = useColorScheme() ?? 'light';
  const palette = Colors[colorScheme];

  return (
    <ScrollView
      style={[styles.screen, { backgroundColor: palette.background }]}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}>
      <ThemedView style={[styles.hero, { backgroundColor: palette.surface, borderColor: palette.border }]}>
        <View style={styles.heroTopRow}>
          <ThemedText type="title">Live Updates</ThemedText>
          <View style={[styles.dot, { backgroundColor: palette.success }]} />
        </View>
        <ThemedText style={{ color: palette.icon }}>
          Boarding time, gate shifts, and operational alerts synced in real time.
        </ThemedText>
      </ThemedView>

      {flightUpdates.map((item) => {
        const accent =
          item.priority === 'critical'
            ? palette.danger
            : item.priority === 'warning'
              ? palette.warning
              : palette.info;

        return (
          <ThemedView
            key={item.id}
            style={[
              styles.updateCard,
              {
                backgroundColor: palette.surface,
                borderColor: palette.border,
              },
            ]}>
            <View style={[styles.leftAccent, { backgroundColor: accent }]} />
            <View style={styles.updateContent}>
              <View style={styles.updateHeader}>
                <ThemedText style={styles.updateTitle}>{item.title}</ThemedText>
                <ThemedText style={{ color: palette.icon, fontWeight: '600' }}>{item.time}</ThemedText>
              </View>
              <ThemedText style={{ color: palette.icon }}>{item.detail}</ThemedText>
              <View style={styles.updateFooter}>
                <IconSymbol name="clock.fill" size={14} color={palette.icon} />
                <ThemedText style={{ color: palette.icon, fontSize: 12 }}>Auto-refreshed</ThemedText>
              </View>
            </View>
          </ThemedView>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  content: {
    paddingHorizontal: 20,
    paddingTop: 24,
    paddingBottom: 120,
    gap: 12,
  },
  hero: {
    borderWidth: 1,
    borderRadius: 22,
    padding: 18,
    gap: 8,
  },
  heroTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  updateCard: {
    borderWidth: 1,
    borderRadius: 16,
    overflow: 'hidden',
    flexDirection: 'row',
  },
  leftAccent: {
    width: 5,
  },
  updateContent: {
    flex: 1,
    padding: 14,
    gap: 8,
  },
  updateHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 8,
  },
  updateTitle: {
    fontSize: 16,
    fontWeight: '700',
  },
  updateFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    marginTop: 2,
  },
});
