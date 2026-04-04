import React, { createContext, useContext, useState, ReactNode } from 'react';

export type CheckInStatus = 'not-started' | 'seat-selection' | 'baggage' | 'completed';

interface CheckInFlowState {
  status: CheckInStatus;
  selectedFlightId: string | null;
  selectedSeat: string | null;
  bagsCount: number;
}

interface CheckInContextType extends CheckInFlowState {
  startCheckIn: (flightId: string) => void;
  confirmSeat: (seatId: string) => void;
  confirmBaggage: (count: number) => void;
  resetCheckIn: () => void;
}

const CheckInContext = createContext<CheckInContextType | undefined>(undefined);

export function CheckInProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<CheckInFlowState>({
    status: 'not-started',
    selectedFlightId: null,
    selectedSeat: null,
    bagsCount: 0,
  });

  const startCheckIn = (flightId: string) => {
    setState((prev) => ({ ...prev, status: 'seat-selection', selectedFlightId: flightId }));
  };

  const confirmSeat = (seatId: string) => {
    setState((prev) => ({ ...prev, status: 'baggage', selectedSeat: seatId }));
  };

  const confirmBaggage = (count: number) => {
    setState((prev) => ({ ...prev, status: 'completed', bagsCount: count }));
  };

  const resetCheckIn = () => {
    setState({
      status: 'not-started',
      selectedFlightId: null,
      selectedSeat: null,
      bagsCount: 0,
    });
  };

  return (
    <CheckInContext.Provider value={{ ...state, startCheckIn, confirmSeat, confirmBaggage, resetCheckIn }}>
      {children}
    </CheckInContext.Provider>
  );
}

export function useCheckInFlow() {
  const ctx = useContext(CheckInContext);
  if (!ctx) {
    throw new Error('useCheckInFlow must be used within a CheckInProvider');
  }
  return ctx;
}
