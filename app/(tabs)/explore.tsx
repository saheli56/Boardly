import { useRouter } from 'expo-router';
import { useMemo } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';

import { ThemedText } from '@/components/themed-text';
import { AppScaffold } from '@/components/ui/app-scaffold';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { seatMap, unavailableSeats, upcomingFlights } from '@/constants/checkin-data';
import { Colors, Fonts } from '@/constants/theme';
import { useCheckInFlow } from '@/context/checkin-flow-context';
import { useColorScheme } from '@/hooks/use-color-scheme';

export default function BoardingPassScreen() {
  const colorScheme = useColorScheme() ?? 'light';
  const palette = Colors[colorScheme];
  const router = useRouter();
  const flow = useCheckInFlow();
  const flight = upcomingFlights[0];

  const bars = useMemo(
    () => Array.from({ length: 24 }, (_, i) => ({ id: `b-${i}`, h: i % 4 === 0 ? 40 : i % 3 === 0 ? 30 : 22 })),
    []
  );

  if (!flow.started) {
    return (
      <AppScaffold subtitle="Boarding" title="Digital Pass">
        <View style={[styles.gateCard, { backgroundColor: palette.surface, borderColor: palette.border }]}>
          <ThemedText type="subtitle">Start from Check-in</ThemedText>
          <ThemedText style={{ color: palette.icon }}>
            This screen becomes active after you begin check-in from the home tab.
          </ThemedText>
          <Pressable style={[styles.gateButton, { backgroundColor: palette.tint }]} onPress={() => router.push('/')}>
            <ThemedText style={styles.gateButtonText}>Go to Check-in</ThemedText>
          </Pressable>
        </View>
      </AppScaffold>
    );
  }

  if (!flow.profileComplete) {
    return (
      <AppScaffold subtitle="Boarding" title="Digital Pass">
        <View style={[styles.gateCard, { backgroundColor: palette.surface, borderColor: palette.border }]}>
          <ThemedText type="subtitle">Profile step pending</ThemedText>
          <ThemedText style={{ color: palette.icon }}>
            Confirm your profile preferences first so seat and service selections can be attached to your booking.
          </ThemedText>
          <Pressable
            style={[styles.gateButton, { backgroundColor: palette.tint }]}
            onPress={() => router.push('/profile')}>
            <ThemedText style={styles.gateButtonText}>Complete Profile</ThemedText>
          </Pressable>
        </View>
      </AppScaffold>
    );
  }

  return (
    <AppScaffold subtitle="Boarding" title="Digital Pass">
      <Animated.View
        entering={FadeInDown.delay(40).duration(420)}
        style={[styles.passCard, { backgroundColor: palette.surface, borderColor: palette.border }]}>
        <View style={styles.rowBetween}>
          <ThemedText style={[styles.airline, { color: palette.icon }]}>BOARDLY AIR</ThemedText>
          <View style={[styles.zoneBadge, { borderColor: palette.info }]}> 
            <ThemedText style={{ color: palette.info, fontWeight: '700' }}>Zone A</ThemedText>
          </View>
        </View>

        <ThemedText style={[styles.route, { fontFamily: Fonts.rounded }]}>{'DAC -> SIN'}</ThemedText>

        <View style={styles.metaGrid}>
          <Meta label="Flight" value={flight.code} palette={palette} />
          <Meta label="Gate" value={flight.gate} palette={palette} />
          <Meta label="Seat" value={selectedSeat} palette={palette} />
          <Meta label="Board" value="18:10" palette={palette} />
        </View>

        <View style={[styles.qrArea, { backgroundColor: palette.surfaceAlt, borderColor: palette.border }]}>
          {bars.map((bar) => (
            <View key={bar.id} style={[styles.bar, { height: bar.h, backgroundColor: palette.text }]} />
          ))}
        </View>
      </Animated.View>

      <Animated.View
        entering={FadeInDown.delay(120).duration(430)}
        style={[styles.seatCard, { backgroundColor: palette.surface, borderColor: palette.border }]}>
        <View style={styles.rowBetween}>
          <ThemedText type="subtitle">Seat Selection</ThemedText>
          <IconSymbol name="ticket.fill" size={18} color={palette.icon} />
        </View>
        <ThemedText style={{ color: palette.icon }}>
          Premium seats are highlighted. Select any available seat to instantly update your pass.
        </ThemedText>

        <View style={styles.selectedRow}>
          <ThemedText type="subtitle">Selected seat</ThemedText>
          <View style={styles.selectedBadgeWrap}>
            <ThemedText style={[styles.selectedBadge, { color: palette.icon }]}>{flow.selectedSeat}</ThemedText>
            <Pressable
              style={[styles.confirmButton, { backgroundColor: palette.tint }]}
              onPress={() => {
                flow.completeSeat();
                router.push('/baggage');
              }}>
              <ThemedText style={{ color: '#FFFFFF', fontWeight: '700' }}>Confirm and Continue</ThemedText>
            </Pressable>
          </View>
        </View>

        <View style={styles.seatMap}>
          <View style={styles.colHeaders}>
            <View style={styles.colLabel} />
            {['A', 'B', 'C', 'D', 'E', 'F'].map((c) => (
              <ThemedText key={c} style={[styles.colHeaderText, { color: palette.icon }]}>
                {c}
              </ThemedText>
            ))}
          </View>

          {seatMap.map((row) => {
            const rowNumber = row[0].slice(0, -1);
            return (
              <View key={rowNumber} style={styles.seatRow}>
                <ThemedText style={[styles.rowNumber, { color: palette.icon }]}>{rowNumber}</ThemedText>
                {row.map((seat) => {
                  const locked = unavailableSeats.has(seat);
                  const active = flow.selectedSeat === seat;
                  const premium = seat.endsWith('A') || seat.endsWith('F');

                  return (
                    <Pressable
                      key={seat}
                      disabled={locked}
                      onPress={() => flow.setSelectedSeat(seat)}
                      style={[
                        styles.seatButton,
                        {
                          borderColor: active ? palette.info : premium ? palette.warning : palette.border,
                          backgroundColor: active
                            ? palette.info
                            : locked
                              ? palette.surfaceAlt
                              : premium
                                ? `${palette.warning}20`
                                : palette.background,
                        },
                      ]}>
                      <ThemedText style={{ color: active ? '#FFFFFF' : palette.text, fontWeight: active ? '800' : '700' }}>{seat.slice(-1)}</ThemedText>
                    </Pressable>
                  );
                })}
              </View>
            );
          })}

          <View style={styles.legendRow}>
            <View style={styles.legendItem}>
              <View style={[styles.legendSwatch, { backgroundColor: palette.tint }]} />
              <ThemedText style={{ color: palette.icon }}>Selected</ThemedText>
            </View>
            <View style={styles.legendItem}>
              <View style={[styles.legendSwatch, { backgroundColor: palette.surfaceAlt, borderColor: palette.border }]} />
              <ThemedText style={{ color: palette.icon }}>Unavailable</ThemedText>
            </View>
            <View style={styles.legendItem}>
              <View style={[styles.legendSwatch, { backgroundColor: palette.warning }]} />
              <ThemedText style={{ color: palette.icon }}>Premium</ThemedText>
            </View>
          </View>
        </View>
      </Animated.View>
    </AppScaffold>
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

const styles = StyleSheet.create({
  passCard: {
    borderRadius: 26,
    borderWidth: 1,
    padding: 18,
    gap: 12,
    overflow: 'hidden',
  },
  passGlow: {
    width: 0,
    height: 0,
    borderRadius: 0,
    position: 'absolute',
    right: 0,
    top: 0,
    opacity: 0,
  },
  rowBetween: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  airline: {
    fontSize: 12,
    letterSpacing: 1.1,
    fontWeight: '800',
  },
  zoneBadge: {
    borderWidth: 1,
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  route: {
    fontSize: 28,
    lineHeight: 32,
    fontWeight: '800',
  },
  metaGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    rowGap: 8,
  },
  metaItem: {
    width: '50%',
    gap: 1,
  },
  metaLabel: {
    fontSize: 11,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  metaValue: {
    fontSize: 18,
    fontWeight: '700',
  },
  qrArea: {
    borderWidth: 1,
    borderRadius: 10,
    height: 72,
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'center',
    gap: 3,
    paddingBottom: 8,
    paddingHorizontal: 8,
    overflow: 'hidden',
  },
  bar: {
    width: 4,
    borderRadius: 2,
  },
  seatCard: {
    borderRadius: 22,
    borderWidth: 1,
    padding: 16,
    gap: 10,
  },
  seatGrid: {
    marginTop: 6,
    gap: 8,
  },
  selectedRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
    marginTop: 2,
  },
  selectedBadgeWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  selectedBadge: {
    fontSize: 16,
    fontWeight: '800',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 10,
  },
  confirmButton: {
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  seatMap: {
    marginTop: 10,
  },
  colHeaders: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  colLabel: {
    width: 28,
  },
  colHeaderText: {
    width: 44,
    textAlign: 'center',
    fontWeight: '700',
  },
  seatRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 8,
  },
  rowNumber: {
    width: 28,
    textAlign: 'center',
    fontWeight: '700',
  },
  seatButton: {
    width: 44,
    height: 44,
    borderRadius: 10,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  legendRow: {
    flexDirection: 'row',
    gap: 16,
    marginTop: 12,
    alignItems: 'center',
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  legendSwatch: {
    width: 14,
    height: 14,
    borderRadius: 4,
    borderWidth: 1,
  },
  gateCard: {
    borderWidth: 1,
    borderRadius: 20,
    padding: 16,
    gap: 10,
  },
  gateButton: {
    minHeight: 44,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  gateButtonText: {
    color: '#FFFFFF',
    fontWeight: '800',
  },
});
