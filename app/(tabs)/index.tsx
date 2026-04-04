import { Link } from 'expo-router';
import { ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';

import { IconSymbol } from '@/components/ui/icon-symbol';
import { upcomingFlights } from '@/constants/checkin-data';
import { Colors, Fonts } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';

export default function CheckInScreen() {
  const colorScheme = useColorScheme() ?? 'light';
  const palette = Colors[colorScheme];

  return (
    <ScrollView
      style={[styles.screen, { backgroundColor: palette.background }]}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}>
      <ThemedView style={[styles.heroCard, { borderColor: palette.border, backgroundColor: palette.surface }]}>
        <View style={[styles.heroGlow, { backgroundColor: palette.info }]} />
        <ThemedText style={[styles.overline, { color: palette.icon }]}>SMART AIRPORT CHECK-IN</ThemedText>
        <ThemedText type="title" style={styles.heroTitle}>
          Skip the queue, start your trip in 90 seconds.
        </ThemedText>
        <ThemedText style={[styles.heroSubtitle, { color: palette.icon }]}>
          Mobile and kiosk check-in in one flow with seat control, baggage tagging, and real-time updates.
        </ThemedText>

        <View style={styles.heroActions}>
          <TouchableOpacity style={[styles.primaryButton, { backgroundColor: palette.tint }]} activeOpacity={0.85}>
            <IconSymbol name="airplane.departure" size={18} color="#FFFFFF" />
            <ThemedText style={styles.primaryButtonText}>Start Check-in</ThemedText>
          </TouchableOpacity>
          <Link href="/staff" asChild>
            <TouchableOpacity
              style={[
                styles.secondaryButton,
                {
                  borderColor: palette.border,
                  backgroundColor: palette.surfaceAlt,
                },
              ]}
              activeOpacity={0.85}>
              <IconSymbol name="chart.bar.fill" size={18} color={palette.icon} />
              <ThemedText style={{ fontWeight: '600' }}>Staff View</ThemedText>
            </TouchableOpacity>
          </Link>
        </View>
      </ThemedView>

      <ThemedView style={[styles.progressCard, { backgroundColor: palette.surface, borderColor: palette.border }]}>
        <View style={styles.rowBetween}>
          <ThemedText type="subtitle">Check-in Progress</ThemedText>
          <ThemedText style={{ color: palette.info, fontWeight: '700' }}>2 of 4 done</ThemedText>
        </View>
        <View style={[styles.progressTrack, { backgroundColor: palette.surfaceAlt }]}>
          <View style={[styles.progressFill, { backgroundColor: palette.info, width: '55%' }]} />
        </View>
        <View style={styles.stepsRow}>
          <Step label="Passenger" done palette={palette} />
          <Step label="Seat" done palette={palette} />
          <Step label="Baggage" palette={palette} />
          <Step label="Pass" palette={palette} />
        </View>
      </ThemedView>

      <ThemedText type="subtitle" style={styles.sectionTitle}>
        Upcoming flights
      </ThemedText>
      {upcomingFlights.map((flight) => (
        <ThemedView
          key={flight.id}
          style={[styles.flightCard, { backgroundColor: palette.surface, borderColor: palette.border }]}>
          <View style={styles.rowBetween}>
            <ThemedText style={styles.route}>{flight.route}</ThemedText>
            <StatusPill status={flight.status} />
          </View>
          <View style={styles.metaRow}>
            <Meta label="Flight" value={flight.code} palette={palette} />
            <Meta label="Gate" value={flight.gate} palette={palette} />
            <Meta label="Terminal" value={flight.terminal} palette={palette} />
            <Meta label="Departure" value={flight.departureTime} palette={palette} />
          </View>
        </ThemedView>
      ))}
    </ScrollView>
  );
}

function Step({
  label,
  done,
  palette,
}: {
  label: string;
  done?: boolean;
  palette: (typeof Colors)['light'];
}) {
  return (
    <View style={styles.stepItem}>
      <View
        style={[
          styles.stepDot,
          {
            backgroundColor: done ? palette.success : palette.surfaceAlt,
            borderColor: done ? palette.success : palette.border,
          },
        ]}
      />
      <ThemedText style={[styles.stepLabel, { color: palette.icon }]}>{label}</ThemedText>
    </View>
  );
}

function Meta({
  label,
  value,
  palette,
}: {
  label: string;
  value: string;
  palette: (typeof Colors)['light'];
}) {
  return (
    <View style={styles.metaItem}>
      <ThemedText style={[styles.metaLabel, { color: palette.icon }]}>{label}</ThemedText>
      <ThemedText style={styles.metaValue}>{value}</ThemedText>
    </View>
  );
}

function StatusPill({ status }: { status: 'on-time' | 'boarding' | 'delayed' }) {
  if (status === 'boarding') {
    return <ThemedText style={[styles.pill, styles.pillBoarding]}>Boarding</ThemedText>;
  }
  if (status === 'delayed') {
    return <ThemedText style={[styles.pill, styles.pillDelayed]}>Delayed</ThemedText>;
  }
  return <ThemedText style={[styles.pill, styles.pillOnTime]}>On time</ThemedText>;
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  content: {
    paddingHorizontal: 20,
    paddingTop: 24,
    paddingBottom: 120,
    gap: 14,
  },
  heroCard: {
    borderRadius: 26,
    padding: 22,
    borderWidth: 1,
    overflow: 'hidden',
    gap: 12,
  },
  heroGlow: {
    width: 260,
    height: 260,
    borderRadius: 130,
    opacity: 0.12,
    position: 'absolute',
    top: -120,
    right: -90,
  },
  overline: {
    fontSize: 11,
    letterSpacing: 1.2,
    fontWeight: '700',
  },
  heroTitle: {
    fontFamily: Fonts.rounded,
    lineHeight: 36,
  },
  heroSubtitle: {
    lineHeight: 22,
  },
  heroActions: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 4,
  },
  primaryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 14,
    paddingVertical: 11,
    borderRadius: 14,
  },
  primaryButtonText: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  secondaryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 14,
    paddingVertical: 11,
    borderRadius: 14,
    borderWidth: 1,
  },
  progressCard: {
    borderRadius: 22,
    borderWidth: 1,
    padding: 18,
    gap: 12,
  },
  rowBetween: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 12,
  },
  progressTrack: {
    height: 10,
    borderRadius: 999,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 999,
  },
  stepsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  stepItem: {
    alignItems: 'center',
    gap: 6,
  },
  stepDot: {
    width: 14,
    height: 14,
    borderRadius: 7,
    borderWidth: 1,
  },
  stepLabel: {
    fontSize: 12,
  },
  sectionTitle: {
    marginTop: 6,
  },
  flightCard: {
    borderRadius: 18,
    borderWidth: 1,
    padding: 16,
    gap: 12,
  },
  route: {
    fontSize: 18,
    fontWeight: '700',
  },
  metaRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    rowGap: 10,
  },
  metaItem: {
    width: '50%',
    gap: 2,
  },
  metaLabel: {
    fontSize: 12,
    letterSpacing: 0.4,
    textTransform: 'uppercase',
  },
  metaValue: {
    fontSize: 16,
    fontWeight: '700',
  },
  pill: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
    overflow: 'hidden',
    fontSize: 12,
    fontWeight: '700',
  },
  pillBoarding: {
    color: '#0F5D74',
    backgroundColor: '#BAE9F8',
  },
  pillDelayed: {
    color: '#7A2200',
    backgroundColor: '#FFD6BF',
  },
  pillOnTime: {
    color: '#124A2A',
    backgroundColor: '#CCF2DA',
  },
});
