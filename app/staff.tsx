import { StyleSheet, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';

import { ThemedText } from '@/components/themed-text';
import { AppScaffold } from '@/components/ui/app-scaffold';
import { adminMetrics } from '@/constants/checkin-data';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

export default function StaffScreen() {
  const colorScheme = useColorScheme() ?? 'light';
  const palette = Colors[colorScheme];

  return (
    <AppScaffold subtitle="Airport Ops" title="Control Dashboard">
      <Animated.View
        entering={FadeInDown.delay(40).duration(420)}
        style={[styles.banner, { backgroundColor: palette.surface, borderColor: palette.border }]}>
        <ThemedText style={styles.bannerTitle}>Terminal 2 Operational Snapshot</ThemedText>
        <ThemedText style={{ color: palette.icon, lineHeight: 21 }}>
          Monitor passenger flow, queue pressure, and baggage automation from one live cockpit.
        </ThemedText>
      </Animated.View>

      <View style={styles.grid}>
        <Metric
          label="Check-in completion"
          value={`${adminMetrics.checkInCompletionRate}%`}
          hint="Today"
          accent={palette.success}
          delay={110}
        />
        <Metric
          label="Avg kiosk wait"
          value={`${adminMetrics.avgKioskWaitMinutes} min`}
          hint="Current"
          accent={palette.info}
          delay={170}
        />
        <Metric
          label="Automation rate"
          value={`${adminMetrics.baggageAutomationRate}%`}
          hint="Baggage"
          accent={palette.warning}
          delay={230}
        />
        <Metric
          label="Active passengers"
          value={`${adminMetrics.activePassengers}`}
          hint="Right now"
          accent={palette.danger}
          delay={290}
        />
      </View>
    </AppScaffold>
  );
}

function Metric({
  label,
  value,
  hint,
  accent,
  delay,
}: {
  label: string;
  value: string;
  hint: string;
  accent: string;
  delay: number;
}) {
  return (
    <Animated.View entering={FadeInDown.delay(delay).duration(420)} style={[styles.metricCard, { borderColor: accent }]}>
      <View style={[styles.metricDot, { backgroundColor: accent }]} />
      <ThemedText style={styles.metricLabel}>{label}</ThemedText>
      <ThemedText style={styles.metricValue}>{value}</ThemedText>
      <ThemedText style={styles.metricHint}>{hint}</ThemedText>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  banner: {
    borderRadius: 22,
    borderWidth: 1,
    padding: 16,
    gap: 8,
  },
  bannerTitle: {
    fontSize: 21,
    lineHeight: 27,
    fontWeight: '800',
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  metricCard: {
    width: '48%',
    minHeight: 128,
    borderWidth: 1,
    borderRadius: 18,
    padding: 14,
    justifyContent: 'space-between',
    backgroundColor: 'rgba(255,255,255,0.02)',
  },
  metricDot: {
    width: 9,
    height: 9,
    borderRadius: 5,
  },
  metricLabel: {
    fontSize: 13,
    opacity: 0.85,
  },
  metricValue: {
    fontSize: 26,
    lineHeight: 30,
    fontWeight: '800',
  },
  metricHint: {
    fontSize: 12,
    opacity: 0.8,
  },
});
