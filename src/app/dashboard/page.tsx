"use client";

import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Plane,
  ScanLine,
  QrCode,
  Luggage,
  BarChart3,
  MapPin,
  Clock,
  ArrowRight,
  ChevronRight
} from "lucide-react";
import Link from "next/link";
import { MOCK_FLIGHTS, MOCK_BOARDING_PASS, MOCK_PASSENGER } from "@/lib/mock-data";
import { formatTime } from "@/lib/utils";
import type { Flight, FlightStatus } from "@/types";

const fadeUp = {
  hidden: { opacity: 0, y: 10 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.05, duration: 0.4,  },
  }),
};

function statusBadge(status: FlightStatus) {
  const map: Record<FlightStatus, { variant: "success" | "warning" | "destructive" | "info" | "accent" | "default" | "outline" | "secondary"; label: string }> = {
    scheduled: { variant: "outline", label: "Scheduled" },
    boarding: { variant: "default", label: "Boarding" },
    departed: { variant: "secondary", label: "Departed" },
    "in-flight": { variant: "secondary", label: "In Flight" },
    landed: { variant: "outline", label: "Landed" },
    delayed: { variant: "warning", label: "Delayed" },
    cancelled: { variant: "destructive", label: "Cancelled" },
  };
  const s = map[status];
  return <Badge variant={s.variant as any} dot={status === "boarding" || status === "in-flight"}>{s.label}</Badge>;
}

function FlightCard({ flight, index }: { flight: Flight; index: number }) {
  return (
    <motion.div custom={index + 2} variants={fadeUp} initial="hidden" animate="visible">
      <Link href={`/check-in/${flight.id}`}>
        <Card className="group hover:border-primary transition-colors cursor-pointer" padding="md">
          <div className="flex items-start justify-between mb-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-sm font-semibold">{flight.flightNumber}</span>
                <span className="text-xs text-muted-foreground">• {flight.aircraft}</span>
              </div>
            </div>
            {statusBadge(flight.status)}
          </div>

          <div className="flex items-center gap-4 mb-4">
            <div className="flex-1">
              <p className="text-2xl font-bold tracking-tight">{flight.departure.code}</p>
              <p className="text-xs text-muted-foreground">{formatTime(flight.departure.time)}</p>
            </div>
            <div className="flex-[2] flex flex-col items-center gap-2">
              <span className="text-[10px] uppercase tracking-widest text-muted-foreground font-medium">
                {flight.duration}
              </span>
              <div className="w-full h-[1px] bg-border relative">
                <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-background px-2">
                  <Plane size={12} className="text-muted-foreground" />
                </div>
              </div>
            </div>
            <div className="flex-1 text-right">
              <p className="text-2xl font-bold tracking-tight">{flight.arrival.code}</p>
              <p className="text-xs text-muted-foreground">{formatTime(flight.arrival.time)}</p>
            </div>
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-border">
            <div className="flex items-center gap-4 text-xs text-muted-foreground font-medium">
              <span className="flex items-center gap-1.5">
                <MapPin size={12} /> Gate {flight.departure.gate}
              </span>
              <span className="flex items-center gap-1.5">
                <Clock size={12} /> T{flight.departure.terminal}
              </span>
            </div>
            <ChevronRight size={14} className="text-muted-foreground group-hover:text-primary transition-colors" />
          </div>
        </Card>
      </Link>
    </motion.div>
  );
}

const QUICK_ACTIONS = [
  { icon: ScanLine, label: "Check In", href: "/check-in" },
  { icon: QrCode, label: "Boarding Pass", href: "/boarding-pass/bp-001" },
  { icon: Luggage, label: "Track Bags", href: "/baggage" },
  { icon: BarChart3, label: "Admin", href: "/admin" },
];

export default function DashboardPage() {
  const bp = MOCK_BOARDING_PASS;
  const activeFlights = MOCK_FLIGHTS.filter((f) => f.status === "scheduled" || f.status === "boarding");

  return (
    <div className="page-wrapper bg-background/50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-10">
        
        <motion.div custom={0} variants={fadeUp} initial="hidden" animate="visible" className="mb-8">
          <h1 className="text-2xl font-semibold tracking-tight mb-1">
            Overview
          </h1>
          <p className="text-sm text-muted-foreground">
            {MOCK_PASSENGER.firstName} {MOCK_PASSENGER.lastName} • {activeFlights.length} upcoming segments
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            
            {/* Quick Actions */}
            <motion.div custom={1} variants={fadeUp} initial="hidden" animate="visible">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {QUICK_ACTIONS.map((action) => {
                  const Icon = action.icon;
                  return (
                    <Link key={action.label} href={action.href}>
                      <Card className="hover:bg-accent hover:text-accent-foreground transition-colors cursor-pointer border-dashed sm:border-solid h-full py-4 flex flex-col items-center justify-center gap-2">
                        <Icon size={16} />
                        <span className="text-[11px] font-medium uppercase tracking-wider">{action.label}</span>
                      </Card>
                    </Link>
                  );
                })}
              </div>
            </motion.div>

            {/* Flight List */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-sm font-semibold tracking-tight">Active Itinerary</h2>
                <Link href="/flights" className="text-xs text-muted-foreground hover:text-primary transition-colors flex items-center gap-1">
                  View full history <ArrowRight size={12} />
                </Link>
              </div>
              <div className="space-y-3">
                {MOCK_FLIGHTS.slice(0, 3).map((flight, i) => (
                  <FlightCard key={flight.id} flight={flight} index={i} />
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <h2 className="text-sm font-semibold tracking-tight">Ready for Boarding</h2>
            
            {/* Minimal Boarding Pass Card */}
            <motion.div custom={3} variants={fadeUp} initial="hidden" animate="visible">
              <Link href={`/boarding-pass/${bp.id}`}>
                <Card className="hover:border-primary transition-colors overflow-hidden border-border bg-card">
                  <div className="p-5 border-b border-border border-dashed">
                    <div className="flex justify-between items-center mb-6">
                      <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">BP Generated</span>
                      <span className="text-xs font-mono bg-secondary px-2 py-0.5 rounded">{bp.pnr}</span>
                    </div>

                    <div className="flex items-center justify-between mb-2">
                      <p className="text-3xl font-bold tracking-tight">{bp.flight.departure.code}</p>
                      <Plane size={16} className="text-muted-foreground rotate-45" />
                      <p className="text-3xl font-bold tracking-tight">{bp.flight.arrival.code}</p>
                    </div>

                    <div className="grid grid-cols-3 gap-2 mt-6">
                      <div>
                        <p className="text-[10px] text-muted-foreground uppercase tracking-widest mb-1">Gate</p>
                        <p className="text-sm font-semibold">{bp.flight.departure.gate}</p>
                      </div>
                      <div>
                        <p className="text-[10px] text-muted-foreground uppercase tracking-widest mb-1">Seat</p>
                        <p className="text-sm font-semibold">{bp.seat.id}</p>
                      </div>
                      <div>
                        <p className="text-[10px] text-muted-foreground uppercase tracking-widest mb-1">Brdg</p>
                        <p className="text-sm font-semibold">{formatTime(bp.boardingTime)}</p>
                      </div>
                    </div>
                  </div>
                  <div className="bg-primary hover:bg-primary/90 text-primary-foreground p-3 flex justify-center items-center gap-2 transition-colors">
                    <QrCode size={14} />
                    <span className="text-[11px] font-semibold uppercase tracking-widest">Show QR</span>
                  </div>
                </Card>
              </Link>
            </motion.div>

            {/* Travel Stats mini */}
            <motion.div custom={4} variants={fadeUp} initial="hidden" animate="visible">
              <Card padding="md" className="bg-secondary/50 border-none">
                <div className="grid grid-cols-2 gap-y-4 gap-x-2">
                  <div>
                    <p className="text-[10px] text-muted-foreground uppercase tracking-widest mb-1">Flights YTD</p>
                    <p className="text-sm font-semibold">24 segments</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-muted-foreground uppercase tracking-widest mb-1">Distance</p>
                    <p className="text-sm font-semibold">48,203 mi</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-muted-foreground uppercase tracking-widest mb-1">Status</p>
                    <p className="text-sm font-semibold flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-full bg-primary" />Gold Tier</p>
                  </div>
                </div>
              </Card>
            </motion.div>
          </div>
        </div>

      </div>
    </div>
  );
}
