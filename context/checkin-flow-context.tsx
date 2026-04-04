import { createContext, ReactNode, useCallback, useContext, useMemo, useState } from 'react';

type NextRoute = '/' | '/profile' | '/explore' | '/baggage' | '/updates';

export type BoardingTicket = {
  id: string;
  flightCode: string;
  route: string;
  seat: string;
  checkedBags: number;
  quickCheckIn: boolean;
  specialAssistance: boolean;
  boardingZone: string;
  qrPayload: string;
  issuedAt: string;
};

type CheckInFlowContextValue = {
  started: boolean;
  quickCheckIn: boolean;
  specialAssistance: boolean;
  selectedSeat: string;
  checkedBags: number;
  bagDropSlot: string;
  reviewApproved: boolean;
  ticket: BoardingTicket | null;
  profileComplete: boolean;
  seatComplete: boolean;
  baggageComplete: boolean;
  reviewComplete: boolean;
  ticketComplete: boolean;
  completedCount: number;
  progressPercent: number;
  nextRoute: NextRoute;
  startFlow: () => void;
  resetFlow: () => void;
  setQuickCheckIn: (value: boolean) => void;
  setSpecialAssistance: (value: boolean) => void;
  setSelectedSeat: (seat: string) => void;
  setCheckedBags: (count: number) => void;
  setBagDropSlot: (slot: string) => void;
  completeProfile: () => void;
  completeSeat: () => void;
  completeBaggage: () => boolean;
  approveReview: () => void;
  generateTicket: (flightCode: string, route: string) => BoardingTicket | null;
};

const CheckInFlowContext = createContext<CheckInFlowContextValue | null>(null);

function inferBoardingZone(seat: string) {
  const row = Number.parseInt(seat, 10);
  if (Number.isNaN(row)) return 'B';
  if (row <= 2) return 'A';
  if (row <= 4) return 'B';
  return 'C';
}

function resolveNextRoute(state: {
  started: boolean;
  profileComplete: boolean;
  seatComplete: boolean;
  baggageComplete: boolean;
}): NextRoute {
  if (!state.started) return '/';
  if (!state.profileComplete) return '/profile';
  if (!state.seatComplete) return '/explore';
  if (!state.baggageComplete) return '/baggage';
  return '/updates';
}

export function CheckInFlowProvider({ children }: { children: ReactNode }) {
  const [started, setStarted] = useState(false);
  const [quickCheckIn, setQuickCheckIn] = useState(true);
  const [specialAssistance, setSpecialAssistance] = useState(false);
  const [selectedSeat, setSelectedSeat] = useState('3A');
  const [checkedBags, setCheckedBags] = useState(1);
  const [bagDropSlot, setBagDropSlot] = useState('Self Drop Belt 7');
  const [profileComplete, setProfileComplete] = useState(false);
  const [seatComplete, setSeatComplete] = useState(false);
  const [baggageComplete, setBaggageComplete] = useState(false);
  const [reviewApproved, setReviewApproved] = useState(false);
  const [ticket, setTicket] = useState<BoardingTicket | null>(null);

  const reviewComplete = reviewApproved;
  const ticketComplete = ticket !== null;

  const completedCount =
    Number(profileComplete) +
    Number(seatComplete) +
    Number(baggageComplete) +
    Number(reviewComplete) +
    Number(ticketComplete);

  const progressPercent = Math.round((completedCount / 5) * 100);

  const nextRoute = resolveNextRoute({
    started,
    profileComplete,
    seatComplete,
    baggageComplete,
  });

  const startFlow = useCallback(() => {
    setStarted(true);
    setTicket(null);
  }, []);

  const resetFlow = useCallback(() => {
    setStarted(false);
    setQuickCheckIn(true);
    setSpecialAssistance(false);
    setSelectedSeat('3A');
    setCheckedBags(1);
    setBagDropSlot('Self Drop Belt 7');
    setProfileComplete(false);
    setSeatComplete(false);
    setBaggageComplete(false);
    setReviewApproved(false);
    setTicket(null);
  }, []);

  const completeProfile = useCallback(() => {
    setProfileComplete(true);
    setReviewApproved(false);
    setTicket(null);
  }, []);

  const completeSeat = useCallback(() => {
    setSeatComplete(true);
    setReviewApproved(false);
    setTicket(null);
  }, []);

  const completeBaggage = useCallback(() => {
    const canComplete = checkedBags === 0 || bagDropSlot.length > 0;
    if (!canComplete) return false;
    setBaggageComplete(true);
    setReviewApproved(false);
    setTicket(null);
    return true;
  }, [bagDropSlot, checkedBags]);

  const approveReview = useCallback(() => {
    setReviewApproved(true);
    setTicket(null);
  }, []);

  const generateTicket = useCallback(
    (flightCode: string, route: string) => {
      if (!started || !profileComplete || !seatComplete || !baggageComplete || !reviewApproved) {
        return null;
      }

      const issuedAt = new Date().toISOString();
      const issuedClock = issuedAt.slice(11, 16).replace(':', '');
      const compactFlightCode = flightCode.replace(/\s+/g, '');
      const id = `${compactFlightCode}-${selectedSeat}-${issuedClock}`;
      const boardingZone = inferBoardingZone(selectedSeat);
      const qrPayload = [
        `TICKET:${id}`,
        `FLIGHT:${flightCode}`,
        `ROUTE:${route}`,
        `SEAT:${selectedSeat}`,
        `BAGS:${checkedBags}`,
        `QUICK:${quickCheckIn ? 'Y' : 'N'}`,
        `ASSIST:${specialAssistance ? 'Y' : 'N'}`,
        `DROP:${checkedBags === 0 ? 'NONE' : bagDropSlot}`,
      ].join('|');

      const newTicket: BoardingTicket = {
        id,
        flightCode,
        route,
        seat: selectedSeat,
        checkedBags,
        quickCheckIn,
        specialAssistance,
        boardingZone,
        qrPayload,
        issuedAt,
      };

      setTicket(newTicket);
      return newTicket;
    },
    [
      bagDropSlot,
      baggageComplete,
      checkedBags,
      profileComplete,
      quickCheckIn,
      reviewApproved,
      seatComplete,
      selectedSeat,
      specialAssistance,
      started,
    ]
  );

  const value = useMemo<CheckInFlowContextValue>(
    () => ({
      started,
      quickCheckIn,
      specialAssistance,
      selectedSeat,
      checkedBags,
      bagDropSlot,
      reviewApproved,
      ticket,
      profileComplete,
      seatComplete,
      baggageComplete,
      reviewComplete,
      ticketComplete,
      completedCount,
      progressPercent,
      nextRoute,
      startFlow,
      resetFlow,
      setQuickCheckIn,
      setSpecialAssistance,
      setSelectedSeat,
      setCheckedBags,
      setBagDropSlot,
      completeProfile,
      completeSeat,
      completeBaggage,
      approveReview,
      generateTicket,
    }),
    [
      bagDropSlot,
      baggageComplete,
      checkedBags,
      completeBaggage,
      completeProfile,
      completeSeat,
      completedCount,
      generateTicket,
      nextRoute,
      profileComplete,
      progressPercent,
      quickCheckIn,
      resetFlow,
      reviewApproved,
      reviewComplete,
      seatComplete,
      selectedSeat,
      specialAssistance,
      startFlow,
      started,
      ticket,
      ticketComplete,
    ]
  );

  return <CheckInFlowContext.Provider value={value}>{children}</CheckInFlowContext.Provider>;
}

export function useCheckInFlow() {
  const context = useContext(CheckInFlowContext);
  if (!context) {
    throw new Error('useCheckInFlow must be used inside CheckInFlowProvider');
  }
  return context;
}