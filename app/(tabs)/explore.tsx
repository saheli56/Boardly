import { useMemo, useState } from 'react';
import { ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';

import { seatMap, unavailableSeats, upcomingFlights } from '@/constants/checkin-data';
import { Colors, Fonts } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';

export default function BoardingPassScreen() {
  const colorScheme = useColorScheme() ?? 'light';
  const palette = Colors[colorScheme];
  const [selectedSeat, setSelectedSeat] = useState('3A');
  const activeFlight = upcomingFlights[0];

  const qrBars = useMemo(() => {
    return Array.from({ length: 22 }, (_, index) => ({
      key: `bar-${index}`,
      height: index % 4 === 0 ? 42 : index % 3 === 0 ? 32 : 24,
    }));
  }, []);

  return (
    <ScrollView
      style={[styles.screen, { backgroundColor: palette.background }]}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}>
      <ThemedView style={[styles.passCard, { backgroundColor: palette.surface, borderColor: palette.border }]}>
        <View style={styles.rowBetween}>
          <ThemedText style={[styles.brandText, { color: palette.icon }]}>BOARDLY AIR</ThemedText>
          <ThemedText style={[styles.zonePill, { color: palette.info, borderColor: palette.info }]}>Zone A</ThemedText>
        </View>

        <ThemedText type="title" style={[styles.routeText, { fontFamily: Fonts.rounded }]}>
          {'DAC -> SIN'}
        </ThemedText>

        <View style={styles.metaGrid}>
          <BoardingMeta label="Flight" value={activeFlight.code} />
          <BoardingMeta label="Gate" value={activeFlight.gate} />
          <BoardingMeta label="Seat" value={selectedSeat} />
          <BoardingMeta label="Boarding" value="18:10" />
        </View>

        <View style={[styles.qrContainer, { backgroundColor: palette.surfaceAlt, borderColor: palette.border }]}>
          {qrBars.map((bar) => (
            <View
              key={bar.key}
              style={[
                styles.qrBar,
                {
                  height: bar.height,
                  backgroundColor: palette.text,
                },
              ]}
            />
          ))}
        </View>
      </ThemedView>

      <ThemedView style={[styles.seatCard, { backgroundColor: palette.surface, borderColor: palette.border }]}>
        <ThemedText type="subtitle">Seat Selection</ThemedText>
        <ThemedText style={{ color: palette.icon }}>
          Tap to choose a seat before finalizing your digital boarding pass.
        </ThemedText>

        <View style={styles.seatGrid}>
          {seatMap.flat().map((seat) => {
            const isUnavailable = unavailableSeats.has(seat);
            const isSelected = selectedSeat === seat;

            return (
              <TouchableOpacity
                key={seat}
                disabled={isUnavailable}
                activeOpacity={0.85}
                onPress={() => setSelectedSeat(seat)}
                style={[
                  styles.seat,
                  {
                    backgroundColor: isSelected
                      ? palette.info
                      : isUnavailable
                        ? palette.surfaceAlt
                        : palette.background,
                    borderColor: isSelected ? palette.info : palette.border,
                    opacity: isUnavailable ? 0.5 : 1,
                  },
                ]}>
                <ThemedText style={{ color: isSelected ? '#FFFFFF' : palette.text, fontWeight: '700' }}>
                  {seat}
                </ThemedText>
              </TouchableOpacity>
            );
          })}
        </View>

        <View style={styles.legendRow}>
          <Legend color={palette.info} label="Selected" />
          <Legend color={palette.background} label="Available" borderColor={palette.border} />
          <Legend color={palette.surfaceAlt} label="Occupied" />
        </View>
      </ThemedView>
    </ScrollView>
  );
}

function BoardingMeta({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.metaItem}>
      <ThemedText style={styles.metaLabel}>{label}</ThemedText>
      <ThemedText style={styles.metaValue}>{value}</ThemedText>
    </View>
  );
}

function Legend({
  color,
  label,
  borderColor,
}: {
  color: string;
  label: string;
  borderColor?: string;
}) {
  return (
    <View style={styles.legendItem}>
      <View style={[styles.legendDot, { backgroundColor: color, borderColor: borderColor ?? color }]} />
      <ThemedText style={styles.legendLabel}>{label}</ThemedText>
    </View>
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
    gap: 14,
  },
  passCard: {
    borderRadius: 24,
    borderWidth: 1,
    padding: 18,
    gap: 14,
  },
  rowBetween: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  brandText: {
    fontSize: 12,
    letterSpacing: 1.1,
    fontWeight: '700',
  },
  zonePill: {
    borderWidth: 1,
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 4,
    fontSize: 12,
    fontWeight: '700',
  },
  routeText: {
    lineHeight: 36,
  },
  metaGrid: {
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
    opacity: 0.8,
    textTransform: 'uppercase',
  },
  metaValue: {
    fontSize: 18,
    fontWeight: '700',
  },
  qrContainer: {
    height: 72,
    borderRadius: 10,
    borderWidth: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'flex-end',
    gap: 3,
    paddingBottom: 8,
    paddingHorizontal: 8,
    overflow: 'hidden',
  },
  qrBar: {
    width: 4,
    borderRadius: 2,
  },
  seatCard: {
    borderRadius: 24,
    borderWidth: 1,
    padding: 18,
    gap: 12,
  },
  seatGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 6,
  },
  seat: {
    width: '15.5%',
    minWidth: 48,
    aspectRatio: 1,
    borderRadius: 12,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  legendRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 4,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  legendDot: {
    width: 11,
    height: 11,
    borderRadius: 6,
    borderWidth: 1,
  },
  legendLabel: {
    fontSize: 12,
  },
});
