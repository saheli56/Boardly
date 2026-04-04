"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, ChevronDown, ChevronUp, Clock, MapPin, Plane } from "lucide-react";
import { MOCK_FLIGHTS } from "@/lib/mock-data";
import { formatTime, formatDate } from "@/lib/utils";
import type { Flight, FlightStatus } from "@/types";

const fadeUp = {
  hidden: { opacity: 0, y: 10 },
  visible: (i: number) => ({ opacity: 1, y: 0, transition: { delay: i * 0.05, duration: 0.4,  } }),
};

function statusVariant(status: FlightStatus) {
  const map: Record<FlightStatus, string> = {
    scheduled: "outline", boarding: "default", departed: "secondary", "in-flight": "secondary",
    landed: "outline", delayed: "warning", cancelled: "destructive",
  };
  return map[status] as any;
}

export default function FlightsPage() {
  const [query, setQuery] = useState("");
  const filtered = MOCK_FLIGHTS.filter(f => f.flightNumber.toLowerCase().includes(query.toLowerCase()) || f.departure.code.toLowerCase().includes(query.toLowerCase()) || f.arrival.code.toLowerCase().includes(query.toLowerCase()));

  return (
    <div className="page-wrapper bg-background min-h-dvh">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10">
        <div className="mb-8 border-b border-border pb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">Active Departures</h1>
            <p className="text-sm text-muted-foreground mt-1">Real-time aviation event streams.</p>
          </div>
          <div className="w-full md:w-72">
            <Input icon={<Search size={14} />} placeholder="Locate tail, PNR, or route..." value={query} onChange={e=>setQuery(e.target.value)} />
          </div>
        </div>

        <div className="space-y-2">
          {filtered.map((flight, i) => (
            <FlightRow key={flight.id} flight={flight} index={i} />
          ))}
        </div>
      </div>
    </div>
  );
}

function FlightRow({ flight, index }: { flight: Flight; index: number }) {
  const [expanded, setExpanded] = useState(false);
  return (
    <motion.div custom={index} variants={fadeUp} initial="hidden" animate="visible">
      <Card padding="none" className="border-border hover:border-border/80 transition-colors shadow-none rounded-none first:rounded-t-md last:rounded-b-md">
        <button onClick={() => setExpanded(!expanded)} className="w-full grid grid-cols-2 md:grid-cols-5 text-left p-4 items-center gap-4">
          <div className="col-span-1">
            <span className="text-sm font-semibold">{flight.flightNumber}</span>
            <div className="text-[10px] text-muted-foreground uppercase tracking-widest">{flight.aircraft}</div>
          </div>
          <div className="col-span-1 font-mono text-xs hidden md:block">{formatDate(flight.date)}</div>
          <div className="col-span-2 flex items-center gap-3">
            <span className="font-semibold text-sm">{flight.departure.code}</span>
            <span className="text-muted-foreground">→</span>
            <span className="font-semibold text-sm">{flight.arrival.code}</span>
          </div>
          <div className="col-span-1 flex justify-end items-center gap-2">
            <Badge variant={statusVariant(flight.status)}>{flight.status}</Badge>
            {expanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
          </div>
        </button>

        <AnimatePresence>
          {expanded && (
            <motion.div initial={{ height: 0 }} animate={{ height: "auto" }} exit={{ height: 0 }} className="overflow-hidden border-t border-border/50 bg-secondary/20">
              <div className="p-4 grid md:grid-cols-2 gap-6">
                <div>
                  <p className="text-[10px] uppercase tracking-widest font-semibold text-muted-foreground mb-3">Origin</p>
                  <p className="text-sm font-medium mb-1">{flight.departure.airport}</p>
                  <div className="text-xs text-muted-foreground font-mono space-y-1">
                    <p>Terminal {flight.departure.terminal} • Gate {flight.departure.gate}</p>
                    <p>ETD: {formatTime(flight.departure.time)}</p>
                  </div>
                </div>
                <div>
                  <p className="text-[10px] uppercase tracking-widest font-semibold text-muted-foreground mb-3">Destination</p>
                  <p className="text-sm font-medium mb-1">{flight.arrival.airport}</p>
                  <div className="text-xs text-muted-foreground font-mono space-y-1">
                    <p>Terminal {flight.arrival.terminal} • Gate {flight.arrival.gate}</p>
                    <p>ETA: {formatTime(flight.arrival.time)}</p>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </Card>
    </motion.div>
  );
}
