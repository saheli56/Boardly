/* ─── Core domain types for Boardly ─── */

export type SeatClass = "business" | "premium" | "economy";
export type SeatStatus = "available" | "occupied" | "selected" | "blocked";

export interface Seat {
  id: string;        // e.g. "12A"
  row: number;
  letter: string;
  seatClass: SeatClass;
  status: SeatStatus;
  isWindow: boolean;
  isAisle: boolean;
  isExit: boolean;
  price: number;      // addon price in USD
}

export interface Flight {
  id: string;
  flightNumber: string;
  airline: string;
  airlineLogo?: string;
  departure: {
    code: string;
    city: string;
    airport: string;
    time: string;   // ISO
    terminal: string;
    gate: string;
  };
  arrival: {
    code: string;
    city: string;
    airport: string;
    time: string;
    terminal: string;
    gate: string;
  };
  date: string;
  duration: string;
  aircraft: string;
  status: FlightStatus;
  statusMessage?: string;
  progress?: number;    // 0-100 for in-flight
}

export type FlightStatus =
  | "scheduled"
  | "boarding"
  | "departed"
  | "in-flight"
  | "landed"
  | "delayed"
  | "cancelled";

export interface Passenger {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  passportNumber: string;
  nationality: string;
  frequentFlyerTier?: "silver" | "gold" | "platinum";
  frequentFlyerId?: string;
  avatar?: string;
}

export interface BaggageItem {
  id: string;
  type: "cabin" | "checked";
  weight: number;     // kg
  trackingCode: string;
  status: "tagged" | "loaded" | "in-transit" | "arrived";
}

export interface BoardingPass {
  id: string;
  pnr: string;
  passenger: Passenger;
  flight: Flight;
  seat: Seat;
  baggage: BaggageItem[];
  boardingGroup: string;
  boardingTime: string;
  checkInTime: string;
  qrData: string;
}

export interface CheckInState {
  currentStep: number;
  flight: Flight | null;
  passenger: Partial<Passenger>;
  selectedSeat: Seat | null;
  baggage: BaggageItem[];
  completed: boolean;
}

export interface AdminStats {
  totalCheckIns: number;
  activeFlights: number;
  averageCheckInTime: string;
  passengersSatisfaction: number;
  checkInsPerHour: number[];
  flightStatusBreakdown: Record<FlightStatus, number>;
}
