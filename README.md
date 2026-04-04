# Boardly - Airport Self Check-in Experience

Boardly is a React Native + Expo app designed for a fast, self-service airport journey.
The product focus is reducing queue friction and giving passengers clear control over check-in, boarding, seats, and baggage from a mobile-first interface.

## Core Features

- Self-service check-in flow with progress stages.
- Digital boarding pass with interactive seat selection.
- Baggage tagging and status tracking.
- Real-time flight and gate updates.
- Passenger profile with quick check-in preferences.
- Staff-facing operations dashboard for passenger flow metrics.

## Experience Principles

- High clarity and speed over decorative complexity.
- Strong visual hierarchy that feels premium but practical.
- Light and dark mode support with dedicated semantic color tokens.
- Modular screens and shared domain data for rapid hackathon iteration.

## Tech Stack

- Expo Router for file-based navigation.
- TypeScript with strict mode.
- React Native + Expo SDK 54.
- Shared themed primitives (`ThemedText`, `ThemedView`) with tokenized colors.

## App Structure

- `app/(tabs)/index.tsx`: Check-in home and trip progress.
- `app/(tabs)/explore.tsx`: Digital boarding pass and seat selection.
- `app/(tabs)/baggage.tsx`: Baggage tracking.
- `app/(tabs)/updates.tsx`: Real-time updates feed.
- `app/(tabs)/profile.tsx`: Passenger profile and preferences.
- `app/staff.tsx`: Staff operations dashboard.
- `constants/checkin-data.ts`: Mock domain entities and app data.
- `constants/theme.ts`: Theme tokens for surfaces, borders, and semantic status colors.

## Run Locally

```bash
npm install
npm run start
```

Optional platform commands:

```bash
npm run android
npm run ios
npm run web
```

## Lint

```bash
npm run lint
```

## Suggested Next Iterations

1. Wire seat selection and check-in actions to real backend APIs.
2. Add push notifications for gate and boarding events.
3. Integrate QR/barcode generation for standards-compliant boarding passes.
4. Add analytics instrumentation for conversion and wait-time insights.
