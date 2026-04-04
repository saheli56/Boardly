import { ScrollView, StyleSheet, View } from 'react-native';

import { IconSymbol } from '@/components/ui/icon-symbol';
import { baggageTags } from '@/constants/checkin-data';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';

export default function BaggageScreen() {
  const colorScheme = useColorScheme() ?? 'light';
  const palette = Colors[colorScheme];

  return (
    <ScrollView
      style={[styles.screen, { backgroundColor: palette.background }]}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}>
      <ThemedView style={[styles.headerCard, { backgroundColor: palette.surface, borderColor: palette.border }]}>
        <View style={styles.headerRow}>
          <IconSymbol name="suitcase.fill" size={22} color={palette.info} />
          <ThemedText type="title">Smart Baggage</ThemedText>
        </View>
        <ThemedText style={{ color: palette.icon }}>
          Real-time tag journey from counter scan to aircraft loading.
        </ThemedText>
      </ThemedView>

      {baggageTags.map((tag) => (
        <ThemedView
          key={tag.id}
          style={[styles.tagCard, { backgroundColor: palette.surface, borderColor: palette.border }]}>
          <View style={styles.headerRow}>
            <ThemedText style={styles.tagNumber}>{tag.tagNumber}</ThemedText>
            <StatusBadge status={tag.status} />
          </View>
          <View style={styles.metaRow}>
            <Meta label="Location" value={tag.belt} />
            <Meta label="Updated" value={tag.updatedAt} />
          </View>
          <View style={[styles.progressTrack, { backgroundColor: palette.surfaceAlt }]}>
            <View style={[styles.progressFill, { backgroundColor: palette.info, width: progressFromStatus(tag.status) }]} />
          </View>
        </ThemedView>
      ))}
    </ScrollView>
  );
}

function Meta({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.metaItem}>
      <ThemedText style={styles.metaLabel}>{label}</ThemedText>
      <ThemedText style={styles.metaValue}>{value}</ThemedText>
    </View>
  );
}

function progressFromStatus(status: 'tagged' | 'security' | 'loaded' | 'arrived') {
  if (status === 'tagged') return '25%';
  if (status === 'security') return '52%';
  if (status === 'loaded') return '84%';
  return '100%';
}

function StatusBadge({ status }: { status: 'tagged' | 'security' | 'loaded' | 'arrived' }) {
  const label = {
    tagged: 'Tagged',
    security: 'Security',
    loaded: 'Loaded',
    arrived: 'Arrived',
  }[status];

  return <ThemedText style={styles.badge}>{label}</ThemedText>;
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
  headerCard: {
    borderWidth: 1,
    borderRadius: 22,
    padding: 18,
    gap: 8,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
  },
  tagCard: {
    borderWidth: 1,
    borderRadius: 18,
    padding: 16,
    gap: 10,
  },
  tagNumber: {
    fontSize: 20,
    fontWeight: '700',
  },
  badge: {
    backgroundColor: '#E8F5FF',
    color: '#0A5B83',
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 4,
    overflow: 'hidden',
    fontSize: 12,
    fontWeight: '700',
  },
  metaRow: {
    flexDirection: 'row',
    gap: 12,
  },
  metaItem: {
    flex: 1,
  },
  metaLabel: {
    fontSize: 12,
    opacity: 0.8,
    textTransform: 'uppercase',
  },
  metaValue: {
    fontSize: 16,
    fontWeight: '700',
  },
  progressTrack: {
    height: 8,
    borderRadius: 999,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 999,
  },
});
