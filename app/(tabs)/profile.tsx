import { useRouter } from 'expo-router';
import { Pressable, StyleSheet, Switch, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';

import { ThemedText } from '@/components/themed-text';
import { AppScaffold } from '@/components/ui/app-scaffold';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { passengerProfile } from '@/constants/checkin-data';
import { Colors } from '@/constants/theme';
import { useCheckInFlow } from '@/context/checkin-flow-context';
import { useColorScheme } from '@/hooks/use-color-scheme';

export default function ProfileScreen() {
  const colorScheme = useColorScheme() ?? 'light';
  const palette = Colors[colorScheme];
  const router = useRouter();
  const flow = useCheckInFlow();

  if (!flow.started) {
    return (
      <AppScaffold subtitle="Account" title="Passenger Profile">
        <View style={[styles.gateCard, { backgroundColor: palette.surface, borderColor: palette.border }]}>
          <ThemedText type="subtitle">Start check-in first</ThemedText>
          <ThemedText style={{ color: palette.icon }}>
            Begin from the Check-in tab so we can sync your profile choices into the trip flow.
          </ThemedText>
          <Pressable style={[styles.gateButton, { backgroundColor: palette.tint }]} onPress={() => router.push('/')}>
            <ThemedText style={styles.gateButtonText}>Go to Check-in</ThemedText>
          </Pressable>
        </View>
      </AppScaffold>
    );
  }

  return (
    <AppScaffold subtitle="Account" title="Passenger Profile">
      <Animated.View
        entering={FadeInDown.delay(40).duration(430)}
        style={[styles.profileCard, { backgroundColor: palette.surface, borderColor: palette.border }]}>
        <View style={[styles.avatar, { backgroundColor: palette.surfaceAlt, borderColor: palette.border }]}>
          <ThemedText style={styles.avatarText}>AC</ThemedText>
        </View>
        <View style={styles.profileText}>
          <ThemedText style={styles.name}>{passengerProfile.name}</ThemedText>
          <ThemedText style={{ color: palette.icon }}>{passengerProfile.loyaltyTier}</ThemedText>
        </View>
      </Animated.View>

      <Animated.View
        entering={FadeInDown.delay(120).duration(430)}
        style={[styles.statsCard, { backgroundColor: palette.surface, borderColor: palette.border }]}>
        <Info label="Passport" value={`**** ${passengerProfile.passportLast4}`} />
        <Info label="Preferred seat" value={flow.selectedSeat} />
        <Info label="Trips this year" value={`${passengerProfile.totalTripsThisYear}`} />
      </Animated.View>

      <Animated.View
        entering={FadeInDown.delay(180).duration(430)}
        style={[styles.prefCard, { backgroundColor: palette.surface, borderColor: palette.border }]}>
        <View style={styles.switchRow}>
          <View style={{ flex: 1, gap: 2 }}>
            <ThemedText style={styles.prefTitle}>Quick Check-in</ThemedText>
            <ThemedText style={{ color: palette.icon, fontSize: 13 }}>
              Auto-fill standard details and speed through verification.
            </ThemedText>
          </View>
          <Switch
            value={flow.quickCheckIn}
            onValueChange={flow.setQuickCheckIn}
            thumbColor="#FFFFFF"
            trackColor={{ false: palette.border, true: palette.info }}
          />
        </View>

        <View style={styles.switchRow}>
          <View style={{ flex: 1, gap: 2 }}>
            <ThemedText style={styles.prefTitle}>Special Assistance</ThemedText>
            <ThemedText style={{ color: palette.icon, fontSize: 13 }}>
              Ask airport staff to prepare wheelchair or priority support.
            </ThemedText>
          </View>
          <Switch
            value={flow.specialAssistance}
            onValueChange={flow.setSpecialAssistance}
            thumbColor="#FFFFFF"
            trackColor={{ false: palette.border, true: palette.warning }}
          />
        </View>

        <View style={styles.prefActions}>
          <Pressable style={[styles.prefButton, { backgroundColor: palette.surfaceAlt, borderColor: palette.border }]}>
            <IconSymbol name="location.fill" size={16} color={palette.icon} />
            <ThemedText style={styles.prefButtonText}>Travel Docs</ThemedText>
          </Pressable>
          <Pressable style={[styles.prefButton, { backgroundColor: palette.surfaceAlt, borderColor: palette.border }]}>
            <IconSymbol name="checkmark.circle.fill" size={16} color={palette.icon} />
            <ThemedText style={styles.prefButtonText}>Saved Check-ins</ThemedText>
          </Pressable>
        </View>

        <Pressable
          style={[styles.continueButton, { backgroundColor: palette.tint }]}
          onPress={() => {
            flow.completeProfile();
            router.push('/explore');
          }}>
          <ThemedText style={styles.continueText}>Save and continue to Pass</ThemedText>
          <IconSymbol name="chevron.right" size={16} color="#FFFFFF" />
        </Pressable>
      </Animated.View>
    </AppScaffold>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.infoRow}>
      <ThemedText style={styles.infoLabel}>{label}</ThemedText>
      <ThemedText style={styles.infoValue}>{value}</ThemedText>
    </View>
  );
}

const styles = StyleSheet.create({
  profileCard: {
    borderWidth: 1,
    borderRadius: 24,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  avatar: {
    width: 58,
    height: 58,
    borderRadius: 29,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    fontSize: 16,
    fontWeight: '800',
  },
  profileText: {
    gap: 2,
  },
  name: {
    fontSize: 20,
    fontWeight: '800',
    lineHeight: 24,
  },
  statsCard: {
    borderWidth: 1,
    borderRadius: 20,
    padding: 16,
    gap: 12,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
  },
  infoLabel: {
    opacity: 0.8,
  },
  infoValue: {
    fontWeight: '700',
  },
  prefCard: {
    borderWidth: 1,
    borderRadius: 20,
    padding: 16,
    gap: 14,
  },
  prefTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  switchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  prefTitle: {
    fontSize: 15,
    fontWeight: '800',
  },
  prefActions: {
    flexDirection: 'row',
    gap: 10,
  },
  prefButton: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 12,
    minHeight: 44,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  prefButtonText: {
    fontWeight: '700',
    fontSize: 12,
  },
  continueButton: {
    minHeight: 46,
    borderRadius: 12,
    marginTop: 4,
    paddingHorizontal: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  continueText: {
    color: '#FFFFFF',
    fontWeight: '800',
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
