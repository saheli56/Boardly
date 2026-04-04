export type Flight = {
  id: string;
  route: string;
  code: string;
  departureTime: string;
  gate: string;
  terminal: string;
  status: 'on-time' | 'boarding' | 'delayed';
};

export type FlightUpdate = {
  id: string;
  title: string;
  detail: string;
  time: string;
  priority: 'info' | 'warning' | 'critical';
};

export type BaggageTag = {
  id: string;
  tagNumber: string;
  status: 'tagged' | 'security' | 'loaded' | 'arrived';
  belt: string;
  updatedAt: string;
};

export const passengerProfile = {
  name: 'Ariana Cole',
  loyaltyTier: 'Sky Priority Gold',
  passportLast4: '4921',
  totalTripsThisYear: 18,
  preferredSeat: 'Window',
  quickCheckInEnabled: true,
};

export const upcomingFlights: Flight[] = [
  {
    id: 'flt-91',
    route: 'Dhaka -> Singapore',
    code: 'BD 091',
    departureTime: '18:45',
    gate: 'G12',
    terminal: 'T2',
    status: 'boarding',
  },
  {
    id: 'flt-188',
    route: 'Singapore -> Tokyo',
    code: 'BD 188',
    departureTime: '23:30',
    gate: 'C04',
    terminal: 'T1',
    status: 'on-time',
  },
];

export const flightUpdates: FlightUpdate[] = [
  {
    id: 'up-1',
    title: 'Boarding started',
    detail: 'Group A and B can now proceed to Gate G12.',
    time: '2m ago',
    priority: 'info',
  },
  {
    id: 'up-2',
    title: 'Gate changed',
    detail: 'Flight BD 188 moved from C02 to C04.',
    time: '14m ago',
    priority: 'warning',
  },
  {
    id: 'up-3',
    title: 'Security alert cleared',
    detail: 'Security checkpoint wait time is back to normal.',
    time: '34m ago',
    priority: 'critical',
  },
];

export const baggageTags: BaggageTag[] = [
  {
    id: 'bag-1',
    tagNumber: 'BG-948210',
    status: 'loaded',
    belt: 'Belt 7',
    updatedAt: '1m ago',
  },
  {
    id: 'bag-2',
    tagNumber: 'BG-948211',
    status: 'security',
    belt: 'Security Channel 3',
    updatedAt: '6m ago',
  },
];

export const adminMetrics = {
  checkInCompletionRate: 91,
  avgKioskWaitMinutes: 4,
  baggageAutomationRate: 87,
  activePassengers: 1298,
};

export const seatMap = [
  ['1A', '1B', '1C', '1D', '1E', '1F'],
  ['2A', '2B', '2C', '2D', '2E', '2F'],
  ['3A', '3B', '3C', '3D', '3E', '3F'],
  ['4A', '4B', '4C', '4D', '4E', '4F'],
  ['5A', '5B', '5C', '5D', '5E', '5F'],
];

export const unavailableSeats = new Set(['1A', '2D', '3C', '4F']);