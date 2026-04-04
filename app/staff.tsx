import { ScrollView, StyleSheet, View } from 'react-native';

import { adminMetrics } from '@/constants/checkin-data';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';

export default function StaffScreen() {
  const colorScheme = useColorScheme() ?? 'light';
  const palette = Colors[colorScheme];

  return (
    <ScrollView
      style={[styles.screen, { backgroundColor: palette.background }]}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}>
      <ThemedView style={[styles.heroCard, { backgroundColor: palette.surface, borderColor: palette.border }]}>
        <ThemedText type="title">Operations Dashboard</ThemedText>
        <ThemedText style={{ color: palette.icon }}>
          Live overview for airport staff to monitor flow, bottlenecks, and system automation.
        </ThemedText>
      </ThemedView>

      <View style={styles.grid}>
        <MetricCard
          label="Check-in completion"
          value={`${adminMetrics.checkInCompletionRate}%`}
          helper="Today"
          color={palette.success}
        />
        <MetricCard
          label="Avg kiosk wait"
          value={`${adminMetrics.avgKioskWaitMinutes} min`}
          helper="Current"
          color={palette.info}
        />
        <MetricCard
          label="Baggage automation"
          value={`${adminMetrics.baggageAutomationRate}%`}
          helper="Terminal 2"
          color={palette.warning}
        />
        <MetricCard
          label="Active passengers"
          value={`${adminMetrics.activePassengers}`}
          helper="Now"
          color={palette.danger}
        />
      </View>
    </ScrollView>
  );
}

function MetricCard({
  label,
  value,
  helper,
  color,
}: {
  label: string;
  value: string;
  helper: string;
  color: string;
}) {
  return (
    <ThemedView style={[styles.metricCard, { borderColor: color }]}> 
      <ThemedText style={styles.metricLabel}>{label}</ThemedText>
      <ThemedText style={styles.metricValue}>{value}</ThemedText>
      <ThemedText style={styles.metricHelper}>{helper}</ThemedText>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  content: {
    paddingHorizontal: 20,
    paddingTop: 24,
    paddingBottom: 60,
    gap: 14,
  },
  heroCard: {
    borderWidth: 1,
    borderRadius: 22,
    padding: 18,
    gap: 8,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  metricCard: {
    width: '48%',
    minHeight: 120,
    borderWidth: 1,
    borderRadius: 16,
    padding: 14,
    justifyContent: 'space-between',
  },
  metricLabel: {
    fontSize: 13,
    opacity: 0.8,
  },
  metricValue: {
    fontSize: 24,
    fontWeight: '800',
    lineHeight: 28,
  },
  metricHelper: {
    fontSize: 12,
    opacity: 0.8,
  },
});
