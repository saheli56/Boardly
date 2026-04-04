"use client";

import { motion } from "framer-motion";
import { Plane, Download, Share2 } from "lucide-react";
import { QRCodeSVG } from "qrcode.react";
import { MOCK_BOARDING_PASS } from "@/lib/mock-data";
import { formatTime, formatDate } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/components/providers/auth-provider";

export default function BoardingPassPage() {
  const { user, loading } = useAuth();
  const bp = MOCK_BOARDING_PASS;

  if (loading) return <div className="min-h-dvh flex items-center justify-center text-xs uppercase tracking-widest text-muted-foreground animate-pulse">Establishing Secure Link...</div>;

  const fullName = user?.displayName || "Anonymous Agent";
  const [firstName, ...rest] = fullName.split(" ");
  const lastName = rest.join(" ") || " ";

  return (
    <div className="page-wrapper flex items-center justify-center p-4 bg-background">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-[340px]"
      >
        <div className="bg-card text-card-foreground rounded-2xl overflow-hidden border border-border shadow-xl">
          {/* Header */}
          <div className="bg-primary text-primary-foreground p-5 flex justify-between items-center">
            <span className="text-xs font-bold tracking-widest uppercase">{bp.flight.airline}</span>
            <span className="text-[10px] font-mono bg-primary-foreground/20 px-1.5 py-0.5 rounded">{bp.flight.flightNumber}</span>
          </div>

          <div className="px-5 py-6 space-y-6 border-b border-border border-dashed">
            {/* Route */}
            <div className="flex justify-between items-end">
              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-widest mb-1">Departs</p>
                <p className="text-4xl font-bold tracking-tighter leading-none">{bp.flight.departure.code}</p>
                <p className="text-[10px] text-muted-foreground mt-1 max-w-[80px] truncate">{bp.flight.departure.city}</p>
              </div>
              <Plane size={24} className="text-muted-foreground mb-4 rotate-45" />
              <div className="text-right">
                <p className="text-xs text-muted-foreground uppercase tracking-widest mb-1">Arrives</p>
                <p className="text-4xl font-bold tracking-tighter leading-none">{bp.flight.arrival.code}</p>
                <p className="text-[10px] text-muted-foreground mt-1 max-w-[80px] truncate ml-auto">{bp.flight.arrival.city}</p>
              </div>
            </div>

            {/* passenger */}
            <div>
              <p className="text-[10px] text-muted-foreground uppercase tracking-widest mb-0.5">Passenger</p>
              <p className="text-sm font-semibold">{lastName.toUpperCase()}, {firstName.toUpperCase()}</p>
            </div>

            {/* Grid stats */}
            <div className="grid grid-cols-3 gap-2 p-3 bg-secondary rounded-lg">
              <div>
                <p className="text-[10px] text-muted-foreground uppercase tracking-widest mb-0.5">Gate</p>
                <p className="text-base font-bold">{bp.flight.departure.gate}</p>
              </div>
              <div>
                <p className="text-[10px] text-muted-foreground uppercase tracking-widest mb-0.5">Seat</p>
                <p className="text-base font-bold">{bp.seat.id}</p>
              </div>
              <div>
                <p className="text-[10px] text-muted-foreground uppercase tracking-widest mb-0.5">Boarding</p>
                <p className="text-base font-bold text-primary">{formatTime(bp.boardingTime)}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 text-xs font-medium">
              <div>
                <p className="text-muted-foreground uppercase tracking-widest text-[9px] mb-0.5">Date</p>
                <p>{formatDate(bp.flight.date)}</p>
              </div>
              <div>
                <p className="text-muted-foreground uppercase tracking-widest text-[9px] mb-0.5">Class</p>
                <p className="capitalize">{bp.seat.seatClass}</p>
              </div>
            </div>
          </div>

          <div className="px-5 py-6 flex flex-col items-center justify-center bg-card">
            <div className="p-2 bg-white rounded-lg mb-3">
              <QRCodeSVG value={bp.qrData} size={150} level="M" fgColor="#000000" bgColor="#ffffff" />
            </div>
            <p className="text-[10px] font-mono tracking-widest uppercase text-muted-foreground">{bp.pnr}</p>
          </div>
        </div>

        <div className="flex gap-2 mt-4 mt-6">
          <Button variant="outline" className="flex-1 text-xs">
            <Download size={14} className="mr-2" /> Save to Wallet
          </Button>
        </div>
      </motion.div>
    </div>
  );
}
