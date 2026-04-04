import { StyleSheet, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';

import { ThemedText } from '@/components/themed-text';
import { AppScaffold } from '@/components/ui/app-scaffold';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { flightUpdates } from '@/constants/checkin-data';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

export default function UpdatesScreen() {
  const colorScheme = useColorScheme() ?? 'light';
  const palette = Colors[colorScheme];

  return (
    <AppScaffold
      subtitle="Live Feed"
      title="Flight Updates"
      rightSlot={
        <View style={StyleSheet.flatten([styles.livePill, { backgroundColor: palette.surface, borderColor: palette.border }])}>
          <View style={StyleSheet.flatten([styles.liveDot, { backgroundColor: palette.success }])} />
          <ThemedText style={{ fontSize: 12, fontWeight: '700' }}>Live</ThemedText>
        </View>
      }>
      {flightUpdates.map((update, i) => {
        const accent =
          update.priority === 'critical'
            ? palette.danger
            : update.priority === 'warning'
              ? palette.warning
              : palette.info;

        return (
          <Animated.View
            key={update.id}
            entering={FadeInDown.delay(60 + i * 90).duration(420)}
            style={StyleSheet.flatten([styles.feedCard, { backgroundColor: palette.surface, borderColor: palette.border }])}>
            <View style={StyleSheet.flatten([styles.leftRail, { backgroundColor: accent }])} />
            <View style={styles.feedBody}>
              <View style={styles.rowBetween}>
                <ThemedText style={styles.feedTitle}>{update.title}</ThemedText>
                <ThemedText style={{ color: palette.icon, fontWeight: '700' }}>{update.time}</ThemedText>
              </View>
              <ThemedText style={{ color: palette.icon, lineHeight: 21 }}>{update.detail}</ThemedText>
              <View style={styles.footerRow}>
                <IconSymbol name="clock.fill" size={13} color={palette.icon} />
                <ThemedText style={{ color: palette.icon, fontSize: 12 }}>Synced from airport control system</ThemedText>
              </View>
            </View>
          </Animated.View>
        );
      })}
    </AppScaffold>
  );
}

const styles = StyleSheet.create({
  livePill: {
    minHeight: 40,
    borderRadius: 14,
    borderWidth: 1,
    paddingHorizontal: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
  },
  liveDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  feedCard: {
    borderWidth: 1,
    borderRadius: 20,
    overflow: 'hidden',
    flexDirection: 'row',
  },
  leftRail: {
    width: 6,
  },
  feedBody: {
    flex: 1,
    padding: 14,
    gap: 8,
  },
  rowBetween: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 8,
  },
  feedTitle: {
    fontSize: 17,
    fontWeight: '800',
  },
  footerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 2,
  },
});
