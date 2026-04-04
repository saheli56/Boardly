import { Link } from 'expo-router';
import { Pressable, StyleSheet, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';

import { ThemedText } from '@/components/themed-text';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { AppScaffold } from '@/components/ui/app-scaffold';
import { upcomingFlights } from '@/constants/checkin-data';
import { Colors, Fonts } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

export default function CheckInScreen() {
  const colorScheme = useColorScheme() ?? 'light';
  const palette = Colors[colorScheme];

  return (
    <AppScaffold
      subtitle="Passenger"
      title="Smart Check-in"
      rightSlot={
        <View style={[styles.headerBadge, { backgroundColor: palette.surface, borderColor: palette.border }]}> 
          <IconSymbol name="person.fill.checkmark" size={16} color={palette.info} />
        </View>
      }>
      <Animated.View
        entering={FadeInDown.delay(40).duration(450)}
        style={[styles.heroCard, { backgroundColor: palette.surface, borderColor: palette.border }]}>
        <ThemedText style={[styles.heroLabel, { color: palette.icon }]}>SEAMLESS AIRPORT FLOW</ThemedText>
        <ThemedText style={[styles.heroTitle, { fontFamily: Fonts.rounded }]}>Check in, pick seats, drop bags, board.</ThemedText>
        <ThemedText style={[styles.heroBody, { color: palette.icon }]}>A complete mobile-first flow that reduces waiting and keeps every passenger informed in real time.</ThemedText>

        <View style={styles.heroActions}>
          <Pressable style={[styles.primaryAction, { backgroundColor: palette.tint }]}>
            <IconSymbol name="airplane.departure" size={18} color="#FFFFFF" />
            <ThemedText style={styles.primaryActionText}>Begin Check-in</ThemedText>
          </Pressable>
          <Link href="/staff" asChild>
            <Pressable style={[styles.secondaryAction, { backgroundColor: palette.surfaceAlt, borderColor: palette.border }]}>
              <IconSymbol name="chart.bar.fill" size={18} color={palette.icon} />
              <ThemedText style={styles.secondaryActionText}>Ops</ThemedText>
            </Pressable>
          </Link>
        </View>
      </Animated.View>

      <Animated.View
        entering={FadeInDown.delay(120).duration(450)}
        style={[styles.progressCard, { backgroundColor: palette.surface, borderColor: palette.border }]}>
        <View style={styles.rowBetween}>
          <ThemedText type="subtitle">Travel Progress</ThemedText>
          <ThemedText style={{ color: palette.info, fontWeight: '700' }}>55%</ThemedText>
        </View>
        <View style={[styles.track, { backgroundColor: palette.surfaceAlt }]}>
          <View style={[styles.fill, { width: '55%', backgroundColor: palette.info }]} />
        </View>
        <View style={styles.milestones}>
          <Milestone label="Identity" done palette={palette} />
          <Milestone label="Seat" done palette={palette} />
          <Milestone label="Baggage" palette={palette} />
          <Milestone label="Pass" palette={palette} />
        </View>
      </Animated.View>

      <View style={styles.rowBetween}>
        <ThemedText type="subtitle">Upcoming Flights</ThemedText>
        <ThemedText style={{ color: palette.icon, fontWeight: '600' }}>Today</ThemedText>
      </View>

      {upcomingFlights.map((flight, index) => (
        <Animated.View
          key={flight.id}
          entering={FadeInDown.delay(180 + index * 70).duration(420)}
          style={[styles.flightCard, { backgroundColor: palette.surface, borderColor: palette.border }]}>
          <View style={styles.rowBetween}>
            <ThemedText style={styles.route}>{flight.route}</ThemedText>
            <StatusPill status={flight.status} />
          </View>
          <View style={styles.grid}>
            <Cell label="Flight" value={flight.code} palette={palette} />
            <Cell label="Gate" value={flight.gate} palette={palette} />
            <Cell label="Terminal" value={flight.terminal} palette={palette} />
            <Cell label="Departure" value={flight.departureTime} palette={palette} />
          </View>
        </Animated.View>
      ))}
    </AppScaffold>
  );
}

function Milestone({
  label,
  done,
  palette,
}: {
  label: string;
  done?: boolean;
  palette: (typeof Colors)['light'];
}) {
  return (
    <View style={styles.milestoneItem}>
      <View
        style={[
          styles.milestoneDot,
          {
            backgroundColor: done ? palette.success : palette.surfaceAlt,
            borderColor: done ? palette.success : palette.border,
          },
        ]}
      />
      <ThemedText style={[styles.milestoneLabel, { color: palette.icon }]}>{label}</ThemedText>
    </View>
  );
}

function Cell({
  label,
  value,
  palette,
}: {
  label: string;
  value: string;
  palette: (typeof Colors)['light'];
}) {
  return (
    <View style={styles.gridCell}>
      <ThemedText style={[styles.gridLabel, { color: palette.icon }]}>{label}</ThemedText>
      <ThemedText style={styles.gridValue}>{value}</ThemedText>
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
  return <ThemedText style={[styles.pill, styles.pillOnTime]}>On Time</ThemedText>;
}

const styles = StyleSheet.create({
  headerBadge: {
    width: 40,
    height: 40,
    borderRadius: 14,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  heroCard: {
    borderRadius: 28,
    borderWidth: 1,
    padding: 20,
    overflow: 'hidden',
    gap: 12,
  },
  heroTint: {
    position: 'absolute',
    width: 0,
    height: 0,
    borderRadius: 0,
    top: 0,
    right: 0,
    opacity: 0,
  },
  heroLabel: {
    fontSize: 11,
    letterSpacing: 1.2,
    fontWeight: '700',
  },
  heroTitle: {
    fontSize: 26,
    lineHeight: 30,
    fontWeight: '800',
  },
  heroBody: {
    fontSize: 15,
    lineHeight: 22,
  },
  heroActions: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 2,
  },
  primaryAction: {
    flex: 1,
    borderRadius: 14,
    minHeight: 46,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    flexDirection: 'row',
  },
  primaryActionText: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  secondaryAction: {
    borderRadius: 14,
    minHeight: 46,
    minWidth: 78,
    paddingHorizontal: 14,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    flexDirection: 'row',
    borderWidth: 1,
  },
  secondaryActionText: {
    fontWeight: '700',
  },
  progressCard: {
    borderRadius: 20,
    borderWidth: 1,
    padding: 16,
    gap: 10,
  },
  rowBetween: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 10,
  },
  track: {
    height: 10,
    borderRadius: 999,
    overflow: 'hidden',
  },
  fill: {
    height: '100%',
    borderRadius: 999,
  },
  milestones: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  milestoneItem: {
    alignItems: 'center',
    gap: 6,
  },
  milestoneDot: {
    width: 14,
    height: 14,
    borderRadius: 7,
    borderWidth: 1,
  },
  milestoneLabel: {
    fontSize: 12,
    fontWeight: '600',
  },
  flightCard: {
    borderRadius: 18,
    borderWidth: 1,
    padding: 16,
    gap: 10,
  },
  route: {
    fontSize: 18,
    fontWeight: '800',
    lineHeight: 24,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    rowGap: 10,
  },
  gridCell: {
    width: '50%',
    gap: 2,
  },
  gridLabel: {
    fontSize: 12,
    textTransform: 'uppercase',
    letterSpacing: 0.4,
  },
  gridValue: {
    fontSize: 16,
    fontWeight: '700',
  },
  pill: {
    fontSize: 12,
    fontWeight: '700',
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 4,
    overflow: 'hidden',
  },
  pillBoarding: {
    color: '#074E65',
    backgroundColor: '#B8EFFF',
  },
  pillDelayed: {
    color: '#7A2200',
    backgroundColor: '#FFD8C3',
  },
  pillOnTime: {
    color: '#154826',
    backgroundColor: '#CFF7DC',
  },
});
