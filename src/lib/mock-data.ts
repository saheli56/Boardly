import type { Flight, Passenger, Seat, BoardingPass, AdminStats, BaggageItem } from "@/types";

/* ─── Sample passenger ─── */
export const MOCK_PASSENGER: Passenger = {
  id: "pax-001",
  firstName: "Alex",
  lastName: "Morgan",
  email: "alex.morgan@email.com",
  phone: "+1 555 012 3456",
  dateOfBirth: "1992-06-15",
  passportNumber: "US9283746",
  nationality: "US",
  frequentFlyerTier: "gold",
  frequentFlyerId: "BDL-GLD-92837",
};

/* ─── Sample flights ─── */
export const MOCK_FLIGHTS: Flight[] = [
  {
    id: "fl-001",
    flightNumber: "BD 1042",
    airline: "Boardly Airways",
    departure: {
      code: "JFK",
      city: "New York",
      airport: "John F. Kennedy International",
      time: "2026-04-05T08:30:00",
      terminal: "T4",
      gate: "B22",
    },
    arrival: {
      code: "LAX",
      city: "Los Angeles",
      airport: "Los Angeles International",
      time: "2026-04-05T11:45:00",
      terminal: "T5",
      gate: "A14",
    },
    date: "2026-04-05",
    duration: "5h 15m",
    aircraft: "Boeing 737-800",
    status: "scheduled",
  },
  {
    id: "fl-002",
    flightNumber: "BD 2087",
    airline: "Boardly Airways",
    departure: {
      code: "SFO",
      city: "San Francisco",
      airport: "San Francisco International",
      time: "2026-04-05T14:20:00",
      terminal: "T2",
      gate: "D08",
    },
    arrival: {
      code: "ORD",
      city: "Chicago",
      airport: "O'Hare International",
      time: "2026-04-05T20:35:00",
      terminal: "T1",
      gate: "C31",
    },
    date: "2026-04-05",
    duration: "4h 15m",
    aircraft: "Airbus A320neo",
    status: "boarding",
    statusMessage: "Now boarding at Gate D08",
  },
  {
    id: "fl-003",
    flightNumber: "BD 3219",
    airline: "Boardly Airways",
    departure: {
      code: "MIA",
      city: "Miami",
      airport: "Miami International",
      time: "2026-04-05T06:00:00",
      terminal: "T3",
      gate: "E15",
    },
    arrival: {
      code: "ATL",
      city: "Atlanta",
      airport: "Hartsfield-Jackson International",
      time: "2026-04-05T08:10:00",
      terminal: "T1",
      gate: "A07",
    },
    date: "2026-04-05",
    duration: "2h 10m",
    aircraft: "Boeing 737 MAX 8",
    status: "in-flight",
    progress: 65,
  },
  {
    id: "fl-004",
    flightNumber: "BD 4501",
    airline: "Boardly Airways",
    departure: {
      code: "SEA",
      city: "Seattle",
      airport: "Seattle-Tacoma International",
      time: "2026-04-05T10:00:00",
      terminal: "T1",
      gate: "B12",
    },
    arrival: {
      code: "DEN",
      city: "Denver",
      airport: "Denver International",
      time: "2026-04-05T13:30:00",
      terminal: "T2",
      gate: "D19",
    },
    date: "2026-04-05",
    duration: "3h 30m",
    aircraft: "Airbus A321",
    status: "delayed",
    statusMessage: "Delayed by 45 min — weather",
  },
  {
    id: "fl-005",
    flightNumber: "BD 5776",
    airline: "Boardly Airways",
    departure: {
      code: "BOS",
      city: "Boston",
      airport: "Logan International",
      time: "2026-04-04T16:00:00",
      terminal: "T1",
      gate: "C04",
    },
    arrival: {
      code: "DCA",
      city: "Washington",
      airport: "Ronald Reagan National",
      time: "2026-04-04T17:40:00",
      terminal: "T2",
      gate: "B11",
    },
    date: "2026-04-04",
    duration: "1h 40m",
    aircraft: "Embraer E175",
    status: "landed",
    progress: 100,
  },
];

/* ─── Generate realistic seat map for a 737 ─── */
function generateSeatMap(): Seat[] {
  const seats: Seat[] = [];

  // Business class: rows 1–3, seats A B _ D E (2-2 config)
  for (let row = 1; row <= 3; row++) {
    for (const letter of ["A", "B", "D", "E"]) {
      seats.push({
        id: `${row}${letter}`,
        row,
        letter,
        seatClass: "business",
        status: Math.random() > 0.5 ? "occupied" : "available",
        isWindow: letter === "A" || letter === "E",
        isAisle: letter === "B" || letter === "D",
        isExit: false,
        price: 75,
      });
    }
  }

  // Premium economy: rows 4–7, seats A B C _ D E F (3-3 config)
  for (let row = 4; row <= 7; row++) {
    for (const letter of ["A", "B", "C", "D", "E", "F"]) {
      seats.push({
        id: `${row}${letter}`,
        row,
        letter,
        seatClass: "premium",
        status: Math.random() > 0.4 ? "occupied" : "available",
        isWindow: letter === "A" || letter === "F",
        isAisle: letter === "C" || letter === "D",
        isExit: false,
        price: 35 + (letter === "A" || letter === "F" ? 12 : 0),
      });
    }
  }

  // Economy: rows 8–30, seats A B C _ D E F (3-3 config)
  const exitRows = [12, 13];
  for (let row = 8; row <= 30; row++) {
    for (const letter of ["A", "B", "C", "D", "E", "F"]) {
      const isExit = exitRows.includes(row);
      const isWindow = letter === "A" || letter === "F";
      let price = 0;
      if (isWindow) price += 12;
      if (isExit) price += 18;
      if (row <= 12) price += 8;

      seats.push({
        id: `${row}${letter}`,
        row,
        letter,
        seatClass: "economy",
        status: Math.random() > 0.35 ? "occupied" : "available",
        isWindow,
        isAisle: letter === "C" || letter === "D",
        isExit,
        price,
      });
    }
  }

  return seats;
}

export const MOCK_SEATS: Seat[] = generateSeatMap();

/* ─── Sample boarding pass ─── */
export const MOCK_BOARDING_PASS: BoardingPass = {
  id: "bp-001",
  pnr: "BDL7K9",
  passenger: MOCK_PASSENGER,
  flight: MOCK_FLIGHTS[0],
  seat: {
    id: "14A",
    row: 14,
    letter: "A",
    seatClass: "economy",
    status: "selected",
    isWindow: true,
    isAisle: false,
    isExit: false,
    price: 12,
  },
  baggage: [
    {
      id: "bag-001",
      type: "cabin",
      weight: 7,
      trackingCode: "BDL482910",
      status: "tagged",
    },
    {
      id: "bag-002",
      type: "checked",
      weight: 23,
      trackingCode: "BDL482911",
      status: "tagged",
    },
  ],
  boardingGroup: "B",
  boardingTime: "2026-04-05T07:50:00",
  checkInTime: "2026-04-04T22:30:00",
  qrData: "BOARDLY-BP001-BD1042-JFK-LAX-14A-MORGAN",
};

/* ─── Admin statistics ─── */
export const MOCK_ADMIN_STATS: AdminStats = {
  totalCheckIns: 2847,
  activeFlights: 42,
  averageCheckInTime: "2m 14s",
  passengersSatisfaction: 94.7,
  checkInsPerHour: [45, 62, 89, 134, 187, 210, 245, 198, 156, 120, 95, 78, 112, 145, 189, 220, 201, 167, 134, 98, 72, 55, 40, 38],
  flightStatusBreakdown: {
    scheduled: 18,
    boarding: 5,
    departed: 4,
    "in-flight": 8,
    landed: 6,
    delayed: 3,
    cancelled: 1,
  },
};
