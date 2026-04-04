import { useMemo, useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';

import { ThemedText } from '@/components/themed-text';
import { AppScaffold } from '@/components/ui/app-scaffold';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { seatMap, unavailableSeats, upcomingFlights } from '@/constants/checkin-data';
import { Colors, Fonts } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

export default function BoardingPassScreen() {
  const colorScheme = useColorScheme() ?? 'light';
  const palette = Colors[colorScheme];
  const [selectedSeat, setSelectedSeat] = useState('3A');
  const flight = upcomingFlights[0];

  const bars = useMemo(
    () => Array.from({ length: 24 }, (_, i) => ({ id: `b-${i}`, h: i % 4 === 0 ? 40 : i % 3 === 0 ? 30 : 22 })),
    []
  );

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

        <View style={styles.seatGrid}>
          {seatMap.flat().map((seat) => {
            const locked = unavailableSeats.has(seat);
            const active = selectedSeat === seat;
            const premium = seat.endsWith('A') || seat.endsWith('F');

            return (
              <Pressable
                key={seat}
                disabled={locked}
                onPress={() => setSelectedSeat(seat)}
                style={[
                  styles.seat,
                  {
                    borderColor: active ? palette.info : premium ? palette.warning : palette.border,
                    backgroundColor: active
                      ? palette.info
                      : locked
                        ? palette.surfaceAlt
                        : premium
                          ? `${palette.warning}20`
                          : palette.background,
                    opacity: locked ? 0.45 : 1,
                  },
                ]}>
                <ThemedText style={{ color: active ? '#FFFFFF' : palette.text, fontWeight: '700' }}>{seat}</ThemedText>
              </Pressable>
            );
          })}
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
    fontSize: 34,
    lineHeight: 38,
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
    marginTop: 2,
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  seat: {
    width: '15.5%',
    minWidth: 47,
    aspectRatio: 1,
    borderWidth: 1,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
