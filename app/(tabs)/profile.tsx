import { Pressable, StyleSheet, Switch, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';

import { ThemedText } from '@/components/themed-text';
import { AppScaffold } from '@/components/ui/app-scaffold';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { passengerProfile } from '@/constants/checkin-data';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

export default function ProfileScreen() {
  const colorScheme = useColorScheme() ?? 'light';
  const palette = Colors[colorScheme];

  return (
    <AppScaffold subtitle="Account" title="Passenger Profile">
      <Animated.View
        entering={FadeInDown.delay(40).duration(430)}
        style={StyleSheet.flatten([styles.profileCard, { backgroundColor: palette.surface, borderColor: palette.border }])}>
        <View style={StyleSheet.flatten([styles.avatar, { backgroundColor: palette.surfaceAlt, borderColor: palette.border }])}>
          <ThemedText style={styles.avatarText}>AC</ThemedText>
        </View>
        <View style={styles.profileText}>
          <ThemedText style={styles.name}>{passengerProfile.name}</ThemedText>
          <ThemedText style={{ color: palette.icon }}>{passengerProfile.loyaltyTier}</ThemedText>
        </View>
      </Animated.View>

      <Animated.View
        entering={FadeInDown.delay(120).duration(430)}
        style={StyleSheet.flatten([styles.statsCard, { backgroundColor: palette.surface, borderColor: palette.border }])}>
        <Info label="Passport" value={`**** ${passengerProfile.passportLast4}`} />
        <Info label="Preferred seat" value={passengerProfile.preferredSeat} />
        <Info label="Trips this year" value={`${passengerProfile.totalTripsThisYear}`} />
      </Animated.View>

      <Animated.View
        entering={FadeInDown.delay(180).duration(430)}
        style={StyleSheet.flatten([styles.prefCard, { backgroundColor: palette.surface, borderColor: palette.border }])}>
        <View style={styles.prefTopRow}>
          <View style={{ flex: 1, gap: 2 }}>
            <ThemedText style={styles.prefTitle}>Quick Check-in</ThemedText>
            <ThemedText style={{ color: palette.icon, fontSize: 13 }}>Auto-fill travel details and preferences in one tap.</ThemedText>
          </View>
          <Switch
            value={passengerProfile.quickCheckInEnabled}
            onValueChange={() => {}}
            thumbColor="#FFFFFF"
            trackColor={{ false: palette.border, true: palette.info }}
          />
        </View>

        <View style={styles.prefActions}>
          <Pressable style={StyleSheet.flatten([styles.prefButton, { backgroundColor: palette.surfaceAlt, borderColor: palette.border }])}>
            <IconSymbol name="location.fill" size={16} color={palette.icon} />
            <ThemedText style={styles.prefButtonText}>Travel Docs</ThemedText>
          </Pressable>
          <Pressable style={StyleSheet.flatten([styles.prefButton, { backgroundColor: palette.surfaceAlt, borderColor: palette.border }])}>
            <IconSymbol name="checkmark.circle.fill" size={16} color={palette.icon} />
            <ThemedText style={styles.prefButtonText}>Saved Check-ins</ThemedText>
          </Pressable>
        </View>
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
});
