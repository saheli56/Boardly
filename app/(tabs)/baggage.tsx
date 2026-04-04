import { useRouter } from 'expo-router';
import { Pressable, StyleSheet, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';

import { ThemedText } from '@/components/themed-text';
import { AppScaffold } from '@/components/ui/app-scaffold';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { baggageTags } from '@/constants/checkin-data';
import { Colors } from '@/constants/theme';
import { useCheckInFlow } from '@/context/checkin-flow-context';
import { useColorScheme } from '@/hooks/use-color-scheme';

export default function BaggageScreen() {
  const colorScheme = useColorScheme() ?? 'light';
  const palette = Colors[colorScheme];
  const router = useRouter();
  const flow = useCheckInFlow();

  const bagCountOptions = [0, 1, 2, 3];
  const dropSlots = ['Self Drop Belt 7', 'Priority Counter 3', 'North Gate Belt 2'];
  const canContinue = flow.checkedBags === 0 || flow.bagDropSlot.length > 0;

  if (!flow.started) {
    return (
      <AppScaffold subtitle="Tracking" title="Baggage Journey">
        <View style={[styles.gateCard, { backgroundColor: palette.surface, borderColor: palette.border }]}>
          <ThemedText type="subtitle">Begin from Check-in</ThemedText>
          <ThemedText style={{ color: palette.icon }}>
            Baggage options are unlocked when the guided check-in flow starts.
          </ThemedText>
          <Pressable style={[styles.gateButton, { backgroundColor: palette.tint }]} onPress={() => router.push('/')}>
            <ThemedText style={styles.gateButtonText}>Go to Check-in</ThemedText>
          </Pressable>
        </View>
      </AppScaffold>
    );
  }

  if (!flow.seatComplete) {
    return (
      <AppScaffold subtitle="Tracking" title="Baggage Journey">
        <View style={[styles.gateCard, { backgroundColor: palette.surface, borderColor: palette.border }]}>
          <ThemedText type="subtitle">Seat selection pending</ThemedText>
          <ThemedText style={{ color: palette.icon }}>
            Confirm your seat first. We assign baggage workflow and boarding zone based on your seat and service profile.
          </ThemedText>
          <Pressable
            style={[styles.gateButton, { backgroundColor: palette.tint }]}
            onPress={() => router.push('/explore')}>
            <ThemedText style={styles.gateButtonText}>Select Seat</ThemedText>
          </Pressable>
        </View>
      </AppScaffold>
    );
  }

  const displayedBags = Array.from({ length: flow.checkedBags }, (_, idx) => {
    const existing = baggageTags[idx];
    if (existing) {
      return existing;
    }
    return {
      id: `bag-dynamic-${idx + 1}`,
      tagNumber: `BG-94821${idx + 2}`,
      status: 'tagged' as const,
      belt: flow.bagDropSlot,
      updatedAt: 'just now',
    };
  });

  return (
    <AppScaffold
      subtitle="Tracking"
      title="Baggage Journey"
      rightSlot={
        <View style={[styles.headerIcon, { backgroundColor: palette.surface, borderColor: palette.border }]}>
          <IconSymbol name="suitcase.fill" size={18} color={palette.info} />
        </View>
      }>
      <Animated.View
        entering={FadeInDown.delay(30).duration(380)}
        style={[styles.plannerCard, { backgroundColor: palette.surface, borderColor: palette.border }]}>
        <ThemedText type="subtitle">Plan Checked Bags</ThemedText>
        <ThemedText style={{ color: palette.icon }}>
          Choose bag count and drop point. This data is used to generate your final ticket metadata.
        </ThemedText>

        <View style={styles.optionRow}>
          {bagCountOptions.map((count) => {
            const active = flow.checkedBags === count;
            return (
              <Pressable
                key={count}
                style={[
                  styles.countChip,
                  {
                    borderColor: active ? palette.info : palette.border,
                    backgroundColor: active ? `${palette.info}1A` : palette.surfaceAlt,
                  },
                ]}
                onPress={() => {
                  flow.setCheckedBags(count);
                  if (count === 0) {
                    flow.setBagDropSlot('');
                  }
                }}>
                <ThemedText style={{ fontWeight: '800' }}>{count}</ThemedText>
              </Pressable>
            );
          })}
        </View>

        {flow.checkedBags > 0 ? (
          <View style={styles.dropList}>
            {dropSlots.map((slot) => {
              const active = flow.bagDropSlot === slot;
              return (
                <Pressable
                  key={slot}
                  style={[
                    styles.dropSlot,
                    {
                      borderColor: active ? palette.tint : palette.border,
                      backgroundColor: active ? `${palette.tint}18` : palette.surfaceAlt,
                    },
                  ]}
                  onPress={() => flow.setBagDropSlot(slot)}>
                  <ThemedText style={{ fontWeight: '700' }}>{slot}</ThemedText>
                </Pressable>
              );
            })}
          </View>
        ) : (
          <ThemedText style={{ color: palette.icon }}>Cabin-only traveler. No drop slot needed.</ThemedText>
        )}

        <Pressable
          disabled={!canContinue}
          style={[
            styles.continueButton,
            {
              backgroundColor: canContinue ? palette.tint : palette.border,
            },
          ]}
          onPress={() => {
            if (!flow.completeBaggage()) return;
            router.push('/updates');
          }}>
          <ThemedText style={styles.continueText}>Continue to Review</ThemedText>
          <IconSymbol name="chevron.right" size={16} color="#FFFFFF" />
        </Pressable>
      </Animated.View>

      {displayedBags.length === 0 ? (
        <Animated.View
          entering={FadeInDown.delay(70).duration(420)}
          style={[styles.emptyCard, { backgroundColor: palette.surface, borderColor: palette.border }]}>
          <ThemedText type="subtitle">No checked baggage</ThemedText>
          <ThemedText style={{ color: palette.icon }}>
            Your ticket will be generated with cabin-only status.
          </ThemedText>
        </Animated.View>
      ) : null}

      {displayedBags.map((bag, i) => (
        <Animated.View
          key={bag.id}
          entering={FadeInDown.delay(120 + i * 90).duration(420)}
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
            <View style={[styles.fill, { backgroundColor: palette.info, width: getProgress(bag.status) }]} />
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
      ))}
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
  plannerCard: {
    borderWidth: 1,
    borderRadius: 22,
    padding: 16,
    gap: 10,
  },
  optionRow: {
    flexDirection: 'row',
    gap: 8,
  },
  countChip: {
    width: 48,
    height: 44,
    borderRadius: 10,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dropList: {
    gap: 8,
  },
  dropSlot: {
    borderWidth: 1,
    borderRadius: 12,
    minHeight: 42,
    justifyContent: 'center',
    paddingHorizontal: 12,
  },
  continueButton: {
    minHeight: 46,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    flexDirection: 'row',
    marginTop: 4,
  },
  continueText: {
    color: '#FFFFFF',
    fontWeight: '800',
  },
  emptyCard: {
    borderWidth: 1,
    borderRadius: 18,
    padding: 14,
    gap: 6,
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
