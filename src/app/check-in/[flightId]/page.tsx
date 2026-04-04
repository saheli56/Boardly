"use client";

import { useState, useMemo, use, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  User,
  Luggage,
  QrCode,
  Plane,
  Plus,
  Minus,
  Info,
  Printer
} from "lucide-react";
import { MOCK_FLIGHTS } from "@/lib/mock-data";
import { CHECK_IN_STEPS, BAGGAGE_PRICES } from "@/lib/constants";
import { formatTime, formatDate } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { listenToSeats, occupySeat, registerCheckInPing } from "@/lib/firebase/services";
import type { Seat, BaggageItem } from "@/types";

const slideVariants = {
  enter: (direction: number) => ({ x: direction > 0 ? 40 : -40, opacity: 0 }),
  center: { x: 0, opacity: 1 },
  exit: (direction: number) => ({ x: direction > 0 ? -40 : 40, opacity: 0 }),
};

/* ═══════════════════════════════════════════════════
   MATURE SEAT MAP
   ═══════════════════════════════════════════════════ */
function SeatMap({ seats, selectedSeat, onSelect }: { seats: Seat[]; selectedSeat: Seat | null; onSelect: (seat: Seat) => void; }) {
  const seatsByRow = useMemo(() => {
    const map = new Map<number, Seat[]>();
    seats.forEach((s) => {
      const arr = map.get(s.row) || [];
      arr.push(s);
      map.set(s.row, arr);
    });
    return map;
  }, [seats]);
  const rows = Array.from(seatsByRow.keys()).sort((a, b) => a - b);
  const exitRows = [12, 13];

  return (
    <div className="flex flex-col items-center w-full max-w-sm mx-auto select-none">
      <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 mb-6 text-xs text-muted-foreground font-medium uppercase tracking-wider">
        <span className="flex items-center gap-2"><span className="w-3 h-3 rounded-sm border border-border bg-card" />Available</span>
        <span className="flex items-center gap-2"><span className="w-3 h-3 rounded-sm bg-primary border-primary" />Selected</span>
        <span className="flex items-center gap-2"><span className="w-3 h-3 border border-dashed border-border opacity-50" />Occupied</span>
      </div>

      <div className="relative w-full max-w-[300px] border border-border bg-card rounded-t-[100px] shadow-sm pb-10">
        <div className="flex flex-col items-center pt-8 pb-6 border-b border-border/50">
          <Plane size={24} className="text-muted-foreground rotate-180" />
          <span className="text-[10px] font-bold tracking-widest uppercase mt-4 text-muted-foreground">Cockpit</span>
        </div>

        <div className="grid gap-1 px-4 py-3 border-b border-border/50 text-[10px] font-bold text-muted-foreground" style={{ gridTemplateColumns: "16px 1fr 20px 1fr" }}>
          <div /> 
          <div className="grid grid-cols-3 gap-1 text-center"><span>A</span><span>B</span><span>C</span></div>
          <div /> 
          <div className="grid grid-cols-3 gap-1 text-center"><span>D</span><span>E</span><span>F</span></div>
        </div>

        <div className="px-4 py-4 space-y-1">
          {rows.map((rowNum) => {
            const rowSeats = seatsByRow.get(rowNum)!;
            const isBusiness = rowSeats[0]?.seatClass === "business";
            const isPremiumStart = rowNum === 4;
            const leftSeats = isBusiness ? rowSeats.filter((s) => ["A", "B"].includes(s.letter)) : rowSeats.filter((s) => ["A", "B", "C"].includes(s.letter));
            const rightSeats = isBusiness ? rowSeats.filter((s) => ["D", "E"].includes(s.letter)) : rowSeats.filter((s) => ["D", "E", "F"].includes(s.letter));

            return (
              <div key={rowNum}>
                {isPremiumStart && (
                  <div className="h-4 border-b border-dashed border-border/50 mb-3 relative">
                    <span className="absolute left-1/2 -translate-x-1/2 top-4 bg-card px-2 text-[8px] font-bold uppercase tracking-widest text-muted-foreground">Economy</span>
                  </div>
                )}
                {exitRows.includes(rowNum) && rowNum === exitRows[0] && (
                  <div className="flex items-center justify-between my-2 py-1 bg-destructive/10 px-2 rounded text-[8px] font-bold uppercase text-destructive tracking-widest">
                    <span>Exit</span><span>Exit</span>
                  </div>
                )}
                <div className="grid gap-1 items-center" style={{ gridTemplateColumns: "16px 1fr 20px 1fr", minHeight: isBusiness ? "32px" : "24px" }}>
                  <span className="text-[10px] font-mono font-medium text-muted-foreground text-center">{rowNum}</span>
                  <div className={`grid gap-1 ${isBusiness ? "grid-cols-2" : "grid-cols-3"}`}>
                    {leftSeats.map((s) => <SeatButton key={s.id} seat={s} isSelected={selectedSeat?.id === s.id} onSelect={onSelect} />)}
                  </div>
                  <div className="flex justify-center"><div className="w-px h-full bg-border/30 min-h-[20px]" /></div>
                  <div className={`grid gap-1 ${isBusiness ? "grid-cols-2" : "grid-cols-3"}`}>
                    {rightSeats.map((s) => <SeatButton key={s.id} seat={s} isSelected={selectedSeat?.id === s.id} onSelect={onSelect} />)}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function SeatButton({ seat, isSelected, onSelect }: { seat: Seat; isSelected: boolean; onSelect: (seat: Seat) => void; }) {
  const isOccupied = seat.status === "occupied";
  const isBusiness = seat.seatClass === "business";

  return (
    <button
      onClick={() => !isOccupied && onSelect(seat)}
      disabled={isOccupied}
      className={`
        ${isSelected ? "seat-selected shadow-sm" : isOccupied ? "seat-occupied" : "seat-available"}
        ${isBusiness ? "h-8" : "h-6"}
        w-full flex items-center justify-center text-[9px] font-mono rounded cursor-pointer disabled:cursor-not-allowed
      `}
    >
      {isOccupied ? "×" : ""}
    </button>
  );
}

/* ═══════════════════════════════════════════════
   MAIN CHECK-IN WIZARD
   ═══════════════════════════════════════════════ */
export default function CheckInFlightPage({ params }: { params: Promise<{ flightId: string }> }) {
  const { flightId } = use(params);
  const router = useRouter();
  const flight = MOCK_FLIGHTS.find((f) => f.id === flightId) || MOCK_FLIGHTS[0];

  const [step, setStep] = useState(1);
  const [direction, setDirection] = useState(1);
  const [dbSeats, setDbSeats] = useState<Seat[]>([]);
  
  useEffect(() => {
    // For demo purposes, we lock to flight-001 seat map
    const unsubscribe = listenToSeats("flight-001", (liveSeats) => {
      setDbSeats(liveSeats);
    });
    return () => unsubscribe();
  }, []);

  const defaultSeat = useMemo(() => dbSeats.find(s => s.id === "14A") || dbSeats[0], [dbSeats]);
  const [originalSeat, setOriginalSeat] = useState<Seat | null>(null);
  const [selectedSeat, setSelectedSeat] = useState<Seat | null>(null);

  useEffect(() => {
    if (dbSeats.length > 0 && !originalSeat) {
      const basicSeat = dbSeats.find(s => s.id === "14A") || dbSeats[0];
      setOriginalSeat(basicSeat);
      setSelectedSeat(basicSeat);
    }
  }, [dbSeats, originalSeat]);
  const [baggage, setBaggage] = useState<{ type: string; weight: number; price: number }[]>([]);
  const [printTag, setPrintTag] = useState(false);
  const [loading, setLoading] = useState(false);
  const [passengerData, setPassengerData] = useState({ firstName: "John", lastName: "Doe", email: "john@example.com", phone: "", passportNumber: "", nationality: "" });

  const goNext = () => { if (step < 4) { setDirection(1); setStep((s) => s + 1); } };
  const goBack = () => { if (step > 1) { setDirection(-1); setStep((s) => s - 1); } };

  const handleConfirm = async () => {
    setLoading(true);
    try {
      if (selectedSeat) {
        // Lock seat in Firebase
        await occupySeat("flight-001", selectedSeat.id);
      }
      // Ping admin dashboard stats via Firebase
      await registerCheckInPing();
      
      await new Promise((r) => setTimeout(r, 800)); // artificial feeling of heavy lifting
      router.push("/boarding-pass/bp-001");
    } catch (e) {
      console.error(e);
      setLoading(false);
    }
  };

  return (
    <div className="page-wrapper bg-background/50">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-6 sm:py-10">
        
        {/* Header */}
        <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-border pb-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Badge variant="secondary" className="font-mono">{flight.flightNumber}</Badge>
              <span className="text-xs text-muted-foreground font-medium">{formatDate(flight.date)}</span>
            </div>
            <div className="flex items-center gap-3 font-semibold text-lg tracking-tight">
              <span>{flight.departure.code}</span>
              <ArrowRight size={14} className="text-muted-foreground" />
              <span>{flight.arrival.code}</span>
            </div>
          </div>
          <div className="flex items-center gap-1.5 md:gap-3 text-xs font-semibold lowercase">
            {CHECK_IN_STEPS.map((s) => (
              <div key={s.id} className={`flex items-center gap-1.5 ${step === s.id ? "text-primary" : step > s.id ? "text-muted-foreground" : "text-muted-foreground/40"}`}>
                <span>{s.id}.</span><span>{s.label}</span>
                {s.id < 4 && <span className="mx-1.5 opacity-50">/</span>}
              </div>
            ))}
          </div>
        </div>

        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={step}
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.3,  }}
          >
            {/* Passenger */}
            {step === 1 && (
              <Card padding="lg">
                <h2 className="text-lg font-semibold tracking-tight mb-4">Passenger Manifest</h2>
                <div className="grid sm:grid-cols-2 gap-4">
                  <Input label="Given Name" value={passengerData.firstName} onChange={(e) => setPassengerData({...passengerData, firstName: e.target.value})} />
                  <Input label="Surname" value={passengerData.lastName} onChange={(e) => setPassengerData({...passengerData, lastName: e.target.value})} />
                  <Input label="Email" type="email" />
                  <Input label="Travel Document ID" placeholder="Passport No." />
                </div>
              </Card>
            )}

            {/* Seat */}
            {step === 2 && (
              <div className="space-y-4">
                <Card padding="lg">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-semibold tracking-tight">Seat Allocation</h2>
                    {selectedSeat && originalSeat && (
                      <div className="flex flex-col items-end">
                        <Badge>{selectedSeat.id}</Badge>
                        {selectedSeat.id !== originalSeat.id ? (
                          <span className="text-[10px] uppercase tracking-widest font-bold mt-1 text-[var(--warning)] flex items-center">
                            +${selectedSeat.price - originalSeat.price} Upgrade
                          </span>
                        ) : (
                          <span className="text-[10px] text-muted-foreground uppercase tracking-widest mt-1">
                            Current Assignment
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                  <div className="overflow-y-auto max-h-[60vh] pb-4">
                    {dbSeats.length > 0 ? (
                      <SeatMap seats={dbSeats} selectedSeat={selectedSeat} onSelect={setSelectedSeat} />
                    ) : (
                      <div className="h-64 flex items-center justify-center text-xs text-muted-foreground">Loading Manifest...</div>
                    )}
                  </div>
                </Card>
              </div>
            )}

            {/* Baggage */}
            {step === 3 && (
              <Card padding="lg">
                <h2 className="text-lg font-semibold tracking-tight mb-4">Luggage Processing</h2>
                <div className="space-y-3 mb-6">
                  {BAGGAGE_PRICES.map((opt) => (
                    <div key={opt.label} className="flex items-center justify-between p-4 rounded-md border border-border bg-secondary/50">
                      <div>
                        <p className="text-sm font-semibold">{opt.label}</p>
                        <p className="text-xs text-muted-foreground">{opt.type}</p>
                      </div>
                      <div className="flex items-center gap-4">
                        <span className="text-sm font-mono">{opt.price ? `+$${opt.price}` : "0.00"}</span>
                        <Button size="sm" variant="secondary" onClick={() => setBaggage([...baggage, opt])}>Add</Button>
                      </div>
                    </div>
                  ))}
                </div>
                {baggage.length > 0 && (
                  <div className="pt-4 border-t border-border">
                    <p className="text-xs font-semibold uppercase tracking-wider mb-2 text-muted-foreground">Attached Items</p>
                    {baggage.map((b, i) => (
                      <div key={i} className="flex justify-between items-center py-2 text-sm">
                        <span>{b.weight} kg</span>
                        <button onClick={() => setBaggage(baggage.filter((_, idx)=>idx!==i))} className="text-destructive text-xs hover:underline">Remove</button>
                      </div>
                    ))}
                    
                    <div className="mt-6 flex justify-end">
                      <Button variant="outline" size="sm" onClick={() => setPrintTag(true)} disabled={printTag}>
                        <Printer size={14} className="mr-2" /> Print Physical Bag Tag
                      </Button>
                    </div>

                    <AnimatePresence>
                      {printTag && (
                        <motion.div 
                          initial={{ height: 0, opacity: 0 }} 
                          animate={{ height: "auto", opacity: 1 }} 
                          className="overflow-hidden mt-6"
                        >
                          <div className="bg-white text-black p-4 border-dashed border-b-[3px] border-x-[3px] border-gray-300 font-mono text-[10px] w-48 shadow-lg mx-auto transform origin-top relative border-t-4 border-t-gray-500">
                            {/* Paper slot shadow effect built into top border */}
                            <div className="flex justify-between items-center border-b border-gray-200 pb-2 mb-2">
                              <span className="font-bold">BOARDLY</span>
                              <span>{flight.flightNumber}</span>
                            </div>
                            <div className="text-2xl font-bold tracking-tight mb-1">{flight.arrival.code}</div>
                            <div className="uppercase line-clamp-1">{flight.arrival.city || "Destination"}</div>
                            
                            <div className="mt-4 mb-3 flex items-center justify-center opacity-90 gap-[2px]">
                              {/* Fake Barcode */}
                              {[1,3,1,2,4,1,2,1,3,1,2].map((w, idx) => (
                                <div key={idx} className="h-10 bg-black" style={{ width: `${w * 2}px` }} />
                              ))}
                            </div>
                            
                            <div className="text-center font-bold tracking-widest text-xs">BDL-849201</div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                )}
              </Card>
            )}

            {/* Confirm */}
            {step === 4 && (
              <Card padding="lg">
                <h2 className="text-lg font-semibold tracking-tight mb-6">Final Review</h2>
                <div className="space-y-6">
                  <div>
                    <p className="text-xs text-muted-foreground uppercase tracking-widest font-semibold mb-2">Participant</p>
                    <p className="text-sm font-medium">{passengerData.firstName || "John"} {passengerData.lastName || "Doe"}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground uppercase tracking-widest font-semibold mb-2">Allocation</p>
                    <p className="text-sm font-medium">{selectedSeat ? `Seat ${selectedSeat.id} (${selectedSeat.seatClass})` : "Unassigned"}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground uppercase tracking-widest font-semibold mb-2">Manifest</p>
                    <p className="text-sm font-medium">{baggage.length} checked item(s)</p>
                  </div>
                  <div className="pt-4 border-t border-border flex justify-between items-center">
                    <span className="text-sm font-semibold">Total Surcharge</span>
                    <span className="text-lg font-mono">${(selectedSeat?.price || 0) + baggage.reduce((a,b)=>a+b.price, 0)}.00</span>
                  </div>
                </div>
              </Card>
            )}
          </motion.div>
        </AnimatePresence>

        <div className="flex items-center justify-between mt-6 border-t border-border pt-6">
          <Button variant="outline" onClick={goBack} disabled={step === 1}><ArrowLeft size={16} className="mr-2" /> Back</Button>
          {step < 4 ? <Button onClick={goNext}>Proceed <ArrowRight size={16} className="ml-2" /></Button> : <Button loading={loading} onClick={handleConfirm}>Confirm Registration</Button>}
        </div>
      </div>
    </div>
  );
}
