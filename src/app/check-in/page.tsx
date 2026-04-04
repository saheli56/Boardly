"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, ArrowRight, Hash, Calendar, ScanLine } from "lucide-react";
import { MOCK_FLIGHTS } from "@/lib/mock-data";
import { formatTime, formatDate } from "@/lib/utils";
import Link from "next/link";
import type { Flight } from "@/types";

const fadeUp = {
  hidden: { opacity: 0, y: 10 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.05, duration: 0.4,  },
  }),
};

export default function CheckInPage() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Flight[] | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await new Promise((r) => setTimeout(r, 800));
    const matched = MOCK_FLIGHTS.filter(
      (f) =>
        f.flightNumber.toLowerCase().replace(/\s/g, "").includes(query.toLowerCase().replace(/\s/g, "")) ||
        f.departure.code.toLowerCase().includes(query.toLowerCase()) ||
        f.arrival.code.toLowerCase().includes(query.toLowerCase())
    );
    setResults(matched.length > 0 ? matched : MOCK_FLIGHTS.slice(0, 2));
    setLoading(false);
  };

  return (
    <div className="page-wrapper flex items-center justify-center min-h-[calc(100vh-64px)] pb-20">
      <div className="w-full max-w-[460px] px-4 sm:px-6">
        <motion.div custom={0} variants={fadeUp} initial="hidden" animate="visible" className="text-center mb-8">
          <div className="inline-flex h-12 w-12 items-center justify-center rounded-lg border border-border bg-card shadow-sm mb-4">
            <ScanLine size={20} className="text-foreground" />
          </div>
          <h1 className="text-2xl font-semibold tracking-tight mb-2">Check-In Retrieval</h1>
          <p className="text-sm text-muted-foreground font-medium">
            Locate your itinerary securely.
          </p>
        </motion.div>

        <motion.div custom={1} variants={fadeUp} initial="hidden" animate="visible">
          <Card padding="md" className="mb-6">
            <form onSubmit={handleSearch} className="space-y-4">
              <Input
                label="Identifier / PNR / Route"
                placeholder="e.g. BD1042, JFK"
                icon={<Search size={16} />}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                required
              />
              <div className="grid grid-cols-2 gap-3">
                <Input
                  label="Booking Ref"
                  placeholder="6 characters"
                  icon={<Hash size={16} />}
                />
                <Input
                  label="Departure Date"
                  type="date"
                  icon={<Calendar size={16} />}
                />
              </div>
              <Button type="submit" className="w-full" loading={loading}>
                Execute Search
              </Button>
            </form>
          </Card>
        </motion.div>

        {results && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-3">
            <div className="text-xs font-semibold text-muted-foreground uppercase tracking-widest pl-1">
              Found {results.length} record{results.length !== 1 && "s"}
            </div>
            {results.map((flight) => (
              <Link key={flight.id} href={`/check-in/${flight.id}`}>
                <Card padding="md" className="group cursor-pointer hover:border-primary transition-colors flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-2 mb-1.5">
                      <span className="text-xs font-bold px-1.5 py-0.5 rounded bg-secondary text-secondary-foreground">{flight.flightNumber}</span>
                      <span className="text-[10px] text-muted-foreground font-mono">{formatDate(flight.date)}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm font-semibold tracking-tight">
                      <span>{flight.departure.code}</span>
                      <span className="text-muted-foreground font-normal">→</span>
                      <span>{flight.arrival.code}</span>
                    </div>
                  </div>
                  <ArrowRight size={16} className="text-muted-foreground group-hover:text-primary transition-colors" />
                </Card>
              </Link>
            ))}
          </motion.div>
        )}
      </div>
    </div>
  );
}
