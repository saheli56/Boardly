import { useRouter } from 'expo-router';
import { Pressable, StyleSheet, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';

import { ThemedText } from '@/components/themed-text';
import { AppScaffold } from '@/components/ui/app-scaffold';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { flightUpdates, upcomingFlights } from '@/constants/checkin-data';
import { Colors } from '@/constants/theme';
import { useCheckInFlow } from '@/context/checkin-flow-context';
import { useColorScheme } from '@/hooks/use-color-scheme';

export default function UpdatesScreen() {
  const colorScheme = useColorScheme() ?? 'light';
  const palette = Colors[colorScheme];
  const router = useRouter();
  const flow = useCheckInFlow();
  const flight = upcomingFlights[0];

  const bars = flow.ticket
    ? Array.from(flow.ticket.qrPayload.slice(0, 42), (char, index) => ({
        id: `ticket-${index}`,
        h: 18 + (char.charCodeAt(0) % 34),
      }))
    : [];

  if (!flow.started) {
    return (
      <AppScaffold subtitle="Live Feed" title="Flight Updates">
        <View style={[styles.gateCard, { backgroundColor: palette.surface, borderColor: palette.border }]}>
          <ThemedText type="subtitle">No active check-in</ThemedText>
          <ThemedText style={{ color: palette.icon }}>
            Start from Check-in to unlock review and ticket issuance.
          </ThemedText>
          <Pressable style={[styles.gateButton, { backgroundColor: palette.tint }]} onPress={() => router.push('/')}>
            <ThemedText style={styles.gateButtonText}>Go to Check-in</ThemedText>
          </Pressable>
        </View>
      </AppScaffold>
    );
  }

  if (!flow.baggageComplete) {
    return (
      <AppScaffold subtitle="Live Feed" title="Flight Updates">
        <View style={[styles.gateCard, { backgroundColor: palette.surface, borderColor: palette.border }]}>
          <ThemedText type="subtitle">Finish previous steps</ThemedText>
          <ThemedText style={{ color: palette.icon }}>
            Profile, seat, and baggage details are required before final review and ticket generation.
          </ThemedText>
          <Pressable
            style={[styles.gateButton, { backgroundColor: palette.tint }]}
            onPress={() => router.push(flow.nextRoute)}>
            <ThemedText style={styles.gateButtonText}>Continue Flow</ThemedText>
          </Pressable>
        </View>
      </AppScaffold>
    );
  }

  return (
    <AppScaffold
      subtitle="Live Feed"
      title="Flight Updates"
      rightSlot={
        <View style={[styles.livePill, { backgroundColor: palette.surface, borderColor: palette.border }]}>
          <View style={[styles.liveDot, { backgroundColor: palette.success }]} />
          <ThemedText style={{ fontSize: 12, fontWeight: '700' }}>Live</ThemedText>
        </View>
      }>
      <Animated.View
        entering={FadeInDown.delay(30).duration(430)}
        style={[styles.reviewCard, { backgroundColor: palette.surface, borderColor: palette.border }]}>
        <View style={styles.rowBetween}>
          <ThemedText type="subtitle">Final Review</ThemedText>
          <ThemedText style={{ color: palette.icon, fontWeight: '700' }}>{flight.code}</ThemedText>
        </View>

        <View style={styles.summaryGrid}>
          <SummaryItem label="Route" value={flight.route} />
          <SummaryItem label="Seat" value={flow.selectedSeat} />
          <SummaryItem label="Checked bags" value={`${flow.checkedBags}`} />
          <SummaryItem label="Drop point" value={flow.checkedBags === 0 ? 'None' : flow.bagDropSlot} />
          <SummaryItem label="Quick check-in" value={flow.quickCheckIn ? 'Enabled' : 'Disabled'} />
          <SummaryItem label="Assistance" value={flow.specialAssistance ? 'Requested' : 'Not requested'} />
        </View>

        <Pressable
          style={[styles.approveButton, { backgroundColor: flow.reviewApproved ? palette.success : palette.surfaceAlt, borderColor: palette.border }]}
          onPress={flow.approveReview}>
          <IconSymbol
            name="checkmark.circle.fill"
            size={15}
            color={flow.reviewApproved ? '#FFFFFF' : palette.icon}
          />
          <ThemedText style={{ color: flow.reviewApproved ? '#FFFFFF' : palette.text, fontWeight: '800' }}>
            {flow.reviewApproved ? 'Details approved' : 'Approve details'}
          </ThemedText>
        </Pressable>

        <Pressable
          disabled={!flow.reviewApproved}
          style={[
            styles.generateButton,
            { backgroundColor: flow.reviewApproved ? palette.tint : palette.border },
          ]}
          onPress={() => flow.generateTicket(flight.code, flight.route)}>
          <IconSymbol name="ticket.fill" size={16} color="#FFFFFF" />
          <ThemedText style={styles.generateText}>
            {flow.ticket ? 'Regenerate Ticket' : 'Generate Boarding Ticket'}
          </ThemedText>
        </Pressable>
      </Animated.View>

      {flow.ticket ? (
        <Animated.View
          entering={FadeInDown.delay(80).duration(430)}
          style={[styles.ticketCard, { backgroundColor: palette.surface, borderColor: palette.border }]}>
          <View style={styles.rowBetween}>
            <ThemedText style={styles.ticketTitle}>Boarding Ticket Issued</ThemedText>
            <ThemedText style={{ color: palette.info, fontWeight: '800' }}>{flow.ticket.boardingZone}</ThemedText>
          </View>
          <ThemedText style={{ color: palette.icon }}>{flow.ticket.id}</ThemedText>
          <View style={styles.ticketBars}>
            {bars.map((bar) => (
              <View key={bar.id} style={[styles.ticketBar, { height: bar.h, backgroundColor: palette.text }]} />
            ))}
          </View>
        </Animated.View>
      ) : null}

      <ThemedText type="subtitle">Airport Feed</ThemedText>

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
            style={[styles.feedCard, { backgroundColor: palette.surface, borderColor: palette.border }]}>
            <View style={[styles.leftRail, { backgroundColor: accent }]} />
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
  reviewCard: {
    borderWidth: 1,
    borderRadius: 20,
    padding: 14,
    gap: 10,
  },
  summaryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    rowGap: 8,
  },
  summaryItem: {
    width: '50%',
    gap: 2,
  },
  summaryLabel: {
    fontSize: 11,
    letterSpacing: 0.4,
    textTransform: 'uppercase',
    opacity: 0.72,
  },
  summaryValue: {
    fontSize: 14,
    fontWeight: '700',
  },
  approveButton: {
    borderWidth: 1,
    minHeight: 44,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  generateButton: {
    minHeight: 46,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  generateText: {
    color: '#FFFFFF',
    fontWeight: '800',
  },
  ticketCard: {
    borderWidth: 1,
    borderRadius: 20,
    padding: 14,
    gap: 10,
  },
  ticketTitle: {
    fontSize: 17,
    fontWeight: '800',
  },
  ticketBars: {
    borderRadius: 10,
    minHeight: 72,
    paddingHorizontal: 8,
    paddingBottom: 8,
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'center',
    gap: 3,
    backgroundColor: 'rgba(127,127,127,0.12)',
    overflow: 'hidden',
  },
  ticketBar: {
    width: 4,
    borderRadius: 2,
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

function SummaryItem({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.summaryItem}>
      <ThemedText style={styles.summaryLabel}>{label}</ThemedText>
      <ThemedText style={styles.summaryValue}>{value}</ThemedText>
    </View>
  );
}
