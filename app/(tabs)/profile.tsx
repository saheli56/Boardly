import { ScrollView, StyleSheet, Switch, View } from 'react-native';

import { passengerProfile } from '@/constants/checkin-data';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';

export default function ProfileScreen() {
  const colorScheme = useColorScheme() ?? 'light';
  const palette = Colors[colorScheme];

  return (
    <ScrollView
      style={[styles.screen, { backgroundColor: palette.background }]}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}>
      <ThemedView style={[styles.profileCard, { backgroundColor: palette.surface, borderColor: palette.border }]}>
        <View style={[styles.avatar, { backgroundColor: palette.surfaceAlt, borderColor: palette.border }]}>
          <ThemedText style={styles.avatarText}>AC</ThemedText>
        </View>
        <View style={styles.profileMeta}>
          <ThemedText type="title">{passengerProfile.name}</ThemedText>
          <ThemedText style={{ color: palette.icon }}>{passengerProfile.loyaltyTier}</ThemedText>
        </View>
      </ThemedView>

      <ThemedView style={[styles.infoCard, { backgroundColor: palette.surface, borderColor: palette.border }]}>
        <Info label="Passport" value={`****${passengerProfile.passportLast4}`} />
        <Info label="Preferred seat" value={passengerProfile.preferredSeat} />
        <Info label="Trips this year" value={`${passengerProfile.totalTripsThisYear}`} />
      </ThemedView>

      <ThemedView style={[styles.toggleCard, { backgroundColor: palette.surface, borderColor: palette.border }]}>
        <View style={styles.toggleRow}>
          <View style={{ flex: 1, gap: 2 }}>
            <ThemedText style={styles.toggleTitle}>Quick Check-in</ThemedText>
            <ThemedText style={{ color: palette.icon, fontSize: 13 }}>
              Pre-fill traveler details and seat preferences automatically.
            </ThemedText>
          </View>
          <Switch
            value={passengerProfile.quickCheckInEnabled}
            onValueChange={() => {}}
            thumbColor="#FFFFFF"
            trackColor={{ false: palette.border, true: palette.info }}
          />
        </View>
      </ThemedView>
    </ScrollView>
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
  screen: {
    flex: 1,
  },
  content: {
    paddingHorizontal: 20,
    paddingTop: 24,
    paddingBottom: 120,
    gap: 12,
  },
  profileCard: {
    borderWidth: 1,
    borderRadius: 22,
    padding: 18,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    fontSize: 18,
    fontWeight: '800',
  },
  profileMeta: {
    gap: 2,
  },
  infoCard: {
    borderWidth: 1,
    borderRadius: 18,
    padding: 16,
    gap: 12,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  infoLabel: {
    opacity: 0.8,
  },
  infoValue: {
    fontWeight: '700',
  },
  toggleCard: {
    borderWidth: 1,
    borderRadius: 18,
    padding: 16,
  },
  toggleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  toggleTitle: {
    fontSize: 16,
    fontWeight: '700',
  },
});
