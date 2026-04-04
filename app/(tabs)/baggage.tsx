import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';

import { ThemedText } from '@/components/themed-text';
import { AppScaffold } from '@/components/ui/app-scaffold';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { baggageTags } from '@/constants/checkin-data';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useCheckInFlow } from '@/context/checkin-flow-context';

export default function BaggageScreen() {
  const colorScheme = useColorScheme() ?? 'light';
  const palette = Colors[colorScheme];
  const { status, confirmBaggage, bagsCount } = useCheckInFlow();
  const [localBags, setLocalBags] = useState(0);
  const router = useRouter();

  const handleConfirm = () => {
    confirmBaggage(localBags);
    router.push('/explore');
  };

  if (status === 'not-started' || status === 'seat-selection') {
    return (
      <AppScaffold subtitle="Tracking" title="Baggage Journey">
        <View style={{ alignItems: 'center', marginTop: 40, gap: 12 }}>
          <IconSymbol name="suitcase.fill" size={48} color={palette.border} />
          <ThemedText style={{ color: palette.icon, textAlign: 'center' }}>
            Nothing to track yet.{'\n'}Complete seat selection to manage baggage.
          </ThemedText>
        </View>
      </AppScaffold>
    );
  }

  return (
    <AppScaffold
      subtitle="Tracking"
      title="Baggage Journey"
      rightSlot={
        <View style={[styles.headerIcon, { backgroundColor: palette.surface, borderColor: palette.border }]}>
          <IconSymbol name="suitcase.fill" size={18} color={palette.info} />
        </View>
      }>

      {status === 'baggage' && (
        <Animated.View entering={FadeInDown.duration(420)} style={[styles.card, { backgroundColor: palette.surface, borderColor: palette.border }]}>
          <ThemedText type="subtitle">How many bags are you checking?</ThemedText>
          <View style={styles.counterRow}>
            <Pressable
              onPress={() => setLocalBags(Math.max(0, localBags - 1))}
              style={[styles.counterBtn, { backgroundColor: palette.surfaceAlt, borderColor: palette.border }]}>
              <ThemedText style={styles.counterText}>-</ThemedText>
            </Pressable>
            <ThemedText style={styles.counterValue}>{localBags}</ThemedText>
            <Pressable
              onPress={() => setLocalBags(localBags + 1)}
              style={[styles.counterBtn, { backgroundColor: palette.surfaceAlt, borderColor: palette.border }]}>
              <ThemedText style={styles.counterText}>+</ThemedText>
            </Pressable>
          </View>
          <Pressable style={[styles.confirmButton, { backgroundColor: palette.tint }]} onPress={handleConfirm}>
            <ThemedText style={{ color: '#FFFFFF', fontWeight: '700', textAlign: 'center' }}>Confirm & Finalize Pass</ThemedText>
          </Pressable>
        </Animated.View>
      )}

      {status === 'completed' && bagsCount === 0 && (
        <View style={{ alignItems: 'center', marginTop: 40, gap: 12 }}>
          <IconSymbol name="suitcase.fill" size={48} color={palette.border} />
          <ThemedText style={{ color: palette.icon, textAlign: 'center' }}>
            No bags checked in.
          </ThemedText>
        </View>
      )}

      {status === 'completed' && bagsCount > 0 && Array.from({ length: Math.max(bagsCount, 0) }).map((_, i) => {
        const bag = baggageTags[i] || {
          id: `bag-new-${i}`,
          tagNumber: `BG-94821${2 + i}`,
          status: 'tagged',
          belt: 'Pending drop-off',
          updatedAt: 'Just now',
        };

        return (
        <Animated.View
          key={bag.id}
          entering={FadeInDown.delay(60 + i * 90).duration(420)}
          style={[styles.card, { backgroundColor: palette.surface, borderColor: palette.border }]}>
          <View style={styles.rowBetween}>
            <ThemedText style={styles.tag}>{bag.tagNumber}</ThemedText>
            <ThemedText style={[styles.badge, { color: palette.info, borderColor: palette.info }]}>
              {bag.status.toUpperCase()}
            </ThemedText>
          </View>

          <View style={styles.rowBetween}>
            <Meta label="Current location" value={bag.belt} palette={palette} />
            <Meta label="Last updated" value={bag.updatedAt} palette={palette} />
          </View>

          <View style={[styles.track, { backgroundColor: palette.surfaceAlt }]}>
            <View style={[styles.fill, { backgroundColor: palette.info, width: getProgress(bag.status as any) }]} />
          </View>

          <View style={styles.timelineRow}>
            <Dot done palette={palette} />
            <ThemedText style={{ color: palette.icon }}>Tagged</ThemedText>
            <Dot done={bag.status !== 'tagged'} palette={palette} />
            <ThemedText style={{ color: palette.icon }}>Security</ThemedText>
            <Dot done={bag.status === 'loaded' || bag.status === 'arrived'} palette={palette} />
            <ThemedText style={{ color: palette.icon }}>Loaded</ThemedText>
          </View>
        </Animated.View>
      )})}
    </AppScaffold>
  );
}

function getProgress(status: 'tagged' | 'security' | 'loaded' | 'arrived') {
  if (status === 'tagged') return '24%';
  if (status === 'security') return '54%';
  if (status === 'loaded') return '84%';
  return '100%';
}

function Dot({ done, palette }: { done?: boolean; palette: (typeof Colors)['light'] }) {
  return (
    <View
      style={[
        styles.dot,
        {
          backgroundColor: done ? palette.success : palette.surfaceAlt,
          borderColor: done ? palette.success : palette.border,
        },
      ]}
    />
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
  headerIcon: {
    width: 42,
    height: 42,
    borderRadius: 14,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  card: {
    borderWidth: 1,
    borderRadius: 22,
    padding: 16,
    gap: 12,
  },
  rowBetween: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
  },
  tag: {
    fontSize: 22,
    fontWeight: '800',
  },
  badge: {
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 0.6,
    borderWidth: 1,
    borderRadius: 999,
    paddingHorizontal: 9,
    paddingVertical: 4,
    overflow: 'hidden',
  },
  metaItem: {
    flex: 1,
    gap: 2,
  },
  metaLabel: {
    fontSize: 11,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  metaValue: {
    fontSize: 15,
    fontWeight: '700',
  },
  track: {
    height: 9,
    borderRadius: 999,
    overflow: 'hidden',
  },
  fill: {
    height: '100%',
    borderRadius: 999,
  },
  timelineRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    flexWrap: 'wrap',
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    borderWidth: 1,
  },
  counterRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    marginVertical: 12,
  },
  counterBtn: {
    width: 48,
    height: 48,
    borderRadius: 24,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  counterText: {
    fontSize: 24,
    fontWeight: '800',
  },
  counterValue: {
    fontSize: 24,
    fontWeight: '800',
    minWidth: 32,
    textAlign: 'center',
  },
  confirmButton: {
    paddingVertical: 14,
    borderRadius: 14,
    marginTop: 8,
  },
});
