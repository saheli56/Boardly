import { StyleSheet, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';

import { ThemedText } from '@/components/themed-text';
import { AppScaffold } from '@/components/ui/app-scaffold';
import { adminMetrics, passengerProfile, upcomingFlights } from '@/constants/checkin-data';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useCheckInFlow } from '@/context/checkin-flow-context';

export default function StaffScreen() {
  const colorScheme = useColorScheme() ?? 'light';
  const palette = Colors[colorScheme];
  const { status, selectedSeat, bagsCount } = useCheckInFlow();

  // Dynamic calculations based on the user's current flow state
  const liveCheckInRate = status === 'completed' ? adminMetrics.checkInCompletionRate + 1 : adminMetrics.checkInCompletionRate;
  const liveBaggageRate = bagsCount > 0 ? adminMetrics.baggageAutomationRate + 2 : adminMetrics.baggageAutomationRate;
  const livePassengers = status !== 'not-started' ? adminMetrics.activePassengers + 1 : adminMetrics.activePassengers;

  return (
    <AppScaffold subtitle="Airport Ops" title="Control Dashboard">
      <Animated.View
        entering={FadeInDown.delay(40).duration(420)}
        style={StyleSheet.flatten([styles.banner, { backgroundColor: palette.surface, borderColor: palette.border }])}>
        <ThemedText style={styles.bannerTitle}>Terminal 2 Operational Snapshot</ThemedText>
        <ThemedText style={{ color: palette.icon, lineHeight: 21 }}>
          Monitor passenger flow, queue pressure, and baggage automation from one live cockpit.
        </ThemedText>
      </Animated.View>

      <View style={styles.grid}>
        <Metric
          label="Check-in completion"
          value={`${liveCheckInRate}%`}
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
          value={`${liveBaggageRate}%`}
          hint="Baggage"
          accent={palette.warning}
          delay={230}
        />
        <Metric
          label="Active passengers"
          value={`${livePassengers}`}
          hint="Right now"
          accent={palette.danger}
          delay={290}
        />
      </View>

      {/* Live Passenger Activity Section */}
      <ThemedText type="subtitle" style={{ marginTop: 24 }}>Live Passenger Activity</ThemedText>
      
      {status !== 'not-started' ? (
        <Animated.View 
          entering={FadeInDown.delay(350).duration(420)}
          style={StyleSheet.flatten([styles.activityCard, { backgroundColor: palette.surface, borderColor: palette.border }])}>
          <View style={styles.rowBetween}>
            <ThemedText style={{ fontWeight: '800', fontSize: 16 }}>{passengerProfile.name}</ThemedText>
            <View style={StyleSheet.flatten([styles.statusPill, { borderColor: status === 'completed' ? palette.success : palette.info }])}>
              <ThemedText style={{ fontSize: 11, fontWeight: '700', color: status === 'completed' ? palette.success : palette.info }}>
                {status.toUpperCase()}
              </ThemedText>
            </View>
          </View>
          
          <View style={styles.detailsGrid}>
            <View style={styles.detailItem}>
              <ThemedText style={{ fontSize: 12, color: palette.icon }}>Flight</ThemedText>
              <ThemedText style={{ fontWeight: '700' }}>{upcomingFlights[0].code}</ThemedText>
            </View>
            <View style={styles.detailItem}>
              <ThemedText style={{ fontSize: 12, color: palette.icon }}>Seat</ThemedText>
              <ThemedText style={{ fontWeight: '700' }}>{selectedSeat || 'Pending'}</ThemedText>
            </View>
            <View style={styles.detailItem}>
              <ThemedText style={{ fontSize: 12, color: palette.icon }}>Bags Checked</ThemedText>
              <ThemedText style={{ fontWeight: '700' }}>{status === 'baggage' || status === 'completed' ? bagsCount : 'Pending'}</ThemedText>
            </View>
          </View>
        </Animated.View>
      ) : (
        <Animated.View 
          entering={FadeInDown.delay(350).duration(420)}
          style={StyleSheet.flatten([styles.activityCard, { backgroundColor: palette.surfaceAlt, borderColor: palette.border, alignItems: 'center' }])}>
          <ThemedText style={{ color: palette.icon }}>No active mobile check-ins at the moment.</ThemedText>
        </Animated.View>
      )}

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
    fontSize: 18,
    lineHeight: 24,
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
    fontSize: 22,
    lineHeight: 26,
    fontWeight: '800',
  },
  metricHint: {
    fontSize: 12,
    opacity: 0.8,
  },
  activityCard: {
    borderRadius: 20,
    borderWidth: 1,
    padding: 16,
    gap: 16,
    marginVertical: 10,
  },
  rowBetween: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  statusPill: {
    borderWidth: 1,
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 4,
  },
  detailsGrid: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 20,
  },
  detailItem: {
    gap: 4,
    minWidth: '28%',
  },
});
