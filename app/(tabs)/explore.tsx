import { useRouter } from 'expo-router';
import { useMemo, useState, useEffect } from 'react';
import { Pressable, StyleSheet, View, Alert } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';

import { ThemedText } from '@/components/themed-text';
import { AppScaffold } from '@/components/ui/app-scaffold';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { seatMap, unavailableSeats, upcomingFlights } from '@/constants/checkin-data';
import { Colors, Fonts } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useCheckInFlow } from '@/context/checkin-flow-context';
import QRCode from 'react-native-qrcode-svg';

export default function BoardingPassScreen() {
  const colorScheme = useColorScheme() ?? 'light';
  const palette = Colors[colorScheme];
  const checkin = useCheckInFlow();
  const { status, selectedSeat: contextSeat, confirmSeat, selectedFlightId, bagsCount } = checkin;
  const [selectedSeat, setSelectedSeat] = useState(contextSeat || '3A');
  const [ticketPayload, setTicketPayload] = useState<string | null>(null);
  const [qrSize, setQrSize] = useState(160);
  useEffect(() => {
    if (contextSeat && contextSeat !== selectedSeat) setSelectedSeat(contextSeat);
  }, [contextSeat, selectedSeat]);
  const router = useRouter();

  const flight = upcomingFlights[0];

  const bars = useMemo(
    () => Array.from({ length: 24 }, (_, i) => ({ id: `b-${i}`, h: i % 4 === 0 ? 40 : i % 3 === 0 ? 30 : 22 })),
    []
  );

  const handleConfirmSeat = () => {
    confirmSeat(selectedSeat);
    router.push('/baggage');
  };

  if (status === 'not-started') {
    return (
      <AppScaffold subtitle="Boarding" title="Digital Pass">
        <View style={{ alignItems: 'center', marginTop: 40, gap: 12 }}>
          <IconSymbol name="ticket.fill" size={48} color={palette.border} />
          <ThemedText style={{ color: palette.icon, textAlign: 'center' }}>
            Check-in has not started yet.{'\n'}Please begin check-in from the Home tab.
          </ThemedText>
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
          <Meta label="Seat" value={contextSeat || '-'} palette={palette} />
          <Meta label="Board" value="18:10" palette={palette} />
        </View>

        <View onLayout={(e) => {
            const { width, height } = e.nativeEvent.layout;
            const max = Math.min(width - 32, height - 32, 220);
            const size = Math.max(96, Math.min(180, Math.floor(max)));
            setQrSize(size);
          }}
          style={[styles.qrArea, { backgroundColor: palette.surfaceAlt, borderColor: palette.border }]}>
          {ticketPayload ? (
            <View style={styles.qrWrap}>
              <QRCode value={ticketPayload} size={qrSize} color="#000000" backgroundColor="#FFFFFF" />
              <ThemedText style={[styles.qrCaption, { color: palette.icon }]}>Show this at the gate</ThemedText>
            </View>
          ) : status === 'completed' ? (
            <ThemedText style={{ color: palette.icon }}>Ticket pending generation. Use &quot;Generate Pass&quot; below.</ThemedText>
          ) : (
            bars.map((bar) => (
              <View key={bar.id} style={[styles.bar, { height: bar.h, backgroundColor: palette.text }]} />
            ))
          )}
        </View>
      </Animated.View>

      <Animated.View
        entering={FadeInDown.delay(120).duration(430)}
        style={[styles.seatCard, { backgroundColor: palette.surface, borderColor: palette.border }]}>
        <View style={styles.rowBetween}>
          <ThemedText type="subtitle">Seat Selection</ThemedText>
          <View style={styles.rowActions}>
            <IconSymbol name="ticket.fill" size={18} color={palette.icon} />
            <Pressable
              style={[styles.smallButton, { borderColor: palette.border, backgroundColor: palette.surfaceAlt }]}
              onPress={() => {
                if (status !== 'completed') {
                  Alert.alert('Complete flow', 'Please finish the check-in steps (profile, seat, baggage, review) before generating a boarding pass.');
                  return;
                }
                // generate a simple ticket payload locally
                const id = `${flight.code.replace(/\s+/g, '')}-${selectedSeat}-${Date.now()}`;
                const payload = `TICKET:${id}|FLIGHT:${flight.code}|SEAT:${selectedSeat}|BAGS:${bagsCount}|FLIGHTID:${selectedFlightId || ''}`;
                setTicketPayload(payload);
              }}>
              <ThemedText style={{ fontWeight: '700' }}>Generate Pass</ThemedText>
            </Pressable>
          </View>
        </View>
        <ThemedText style={{ color: palette.icon }}>
          Premium seats are highlighted. Select any available seat to update your pass.
        </ThemedText>

        <View style={styles.selectedRow}>
          <ThemedText type="subtitle">Selected seat</ThemedText>
          <View style={styles.selectedBadgeWrap}>
            <ThemedText style={[styles.selectedBadge, { color: palette.icon }]}>{selectedSeat}</ThemedText>
            {status !== 'completed' && (
              <Pressable
                style={[styles.confirmButton, { backgroundColor: palette.tint }]}
                onPress={handleConfirmSeat}>
                <ThemedText style={{ color: '#FFFFFF', fontWeight: '700' }}>Confirm</ThemedText>
              </Pressable>
            )}
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
                  const locked = unavailableSeats.has(seat) || status === 'completed';
                  const active = selectedSeat === seat;
                  const premium = seat.endsWith('A') || seat.endsWith('F');

                  return (
                    <Pressable
                      key={seat}
                      disabled={locked}
                      onPress={() => setSelectedSeat(seat)}
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
    height: 200,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 12,
    paddingHorizontal: 12,
    overflow: 'hidden',
  },
  qrWrap: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
  },
  qrCaption: {
    marginTop: 8,
    fontSize: 12,
    fontWeight: '700',
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
  rowActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  smallButton: {
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
});
