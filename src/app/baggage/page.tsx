"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Search, Luggage, CheckCircle2, Package, Plane, ArrowRight, ArrowDown } from "lucide-react";
import { formatTime } from "@/lib/utils";

const fadeUp = {
  hidden: { opacity: 0, y: 10 },
  visible: (i: number) => ({ opacity: 1, y: 0, transition: { delay: i * 0.05, duration: 0.4 } }),
};

// Mock Tracking Data
const MOCK_BAGS = [
  {
    id: "BDL-849201",
    weight: "23kg",
    type: "Checked Bag",
    flight: "BD-1042",
    status: "in-transit",
    timeline: [
      { status: "Drop-off", location: "Terminal 4, Desk 12", time: new Date(Date.now() - 1000 * 60 * 120).toISOString(), completed: true },
      { status: "Security Screened", location: "Automated Facility B", time: new Date(Date.now() - 1000 * 60 * 90).toISOString(), completed: true },
      { status: "Loaded onto Aircraft", location: "Gate 12B, Hold 2", time: new Date(Date.now() - 1000 * 60 * 30).toISOString(), completed: true },
      { status: "In Transit", location: "Flight BD-1042", time: new Date().toISOString(), completed: false },
      { status: "Available at Carousel", location: "Carousel 4", time: null, completed: false },
    ]
  }
];

export default function BaggageTrackingPage() {
  const [query, setQuery] = useState("");
  const [result, setResult] = useState<typeof MOCK_BAGS[0] | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await new Promise(r => setTimeout(r, 600)); // simulate network dip
    setResult(MOCK_BAGS[0]);
    setLoading(false);
  };

  return (
    <div className="page-wrapper bg-background min-h-dvh">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-10">
        
        <motion.div custom={0} variants={fadeUp} initial="hidden" animate="visible" className="mb-8">
          <div className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-border bg-card shadow-sm mb-4">
            <Luggage size={18} className="text-foreground" />
          </div>
          <h1 className="text-2xl font-semibold tracking-tight">Luggage Tracking</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Real-time telemetry for registered baggage items.
          </p>
        </motion.div>

        <motion.div custom={1} variants={fadeUp} initial="hidden" animate="visible">
          <Card padding="md" className="mb-8 border-border bg-card shadow-sm">
            <form onSubmit={handleSearch} className="flex flex-col sm:flex-row items-end gap-3">
              <div className="flex-1 w-full">
                <Input 
                  label="Tracking Code" 
                  placeholder="e.g. BDL-849201" 
                  icon={<Search size={14} />}
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  required
                />
              </div>
              <Button type="submit" loading={loading} className="w-full sm:w-auto">
                Locate Item
              </Button>
            </form>
          </Card>
        </motion.div>

        {result && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
            <Card padding="lg" className="border-border bg-card shadow-sm relative overflow-hidden">
              {/* Decorative top border */}
              <div className="absolute top-0 left-0 right-0 h-1 bg-primary" />
              
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <h2 className="text-xl font-mono tracking-tight font-bold">{result.id}</h2>
                    <Badge variant="default" className="text-[10px] uppercase tracking-widest">{result.status}</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {result.type} • {result.weight} • Flight {result.flight}
                  </p>
                </div>
                <div className="text-sm font-mono px-3 py-1.5 rounded-md border border-border bg-secondary/50 text-secondary-foreground text-center">
                  RFID ACTIVE
                </div>
              </div>

              <div className="relative">
                {/* Timeline vertical line */}
                <div className="absolute left-[15px] top-[15px] bottom-[15px] w-px bg-border z-0" />

                <div className="space-y-6 relative z-10">
                  {result.timeline.map((event, i) => {
                    const isLast = i === result.timeline.length - 1;
                    const isActive = !event.completed && (i === 0 || result.timeline[i - 1]?.completed === true);

                    return (
                      <div key={i} className="flex gap-4">
                        <div className="mt-1">
                          {event.completed ? (
                            <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center shadow-sm">
                              <CheckCircle2 size={14} className="text-primary-foreground" />
                            </div>
                          ) : isActive ? (
                            <div className="w-8 h-8 rounded-full bg-background border-2 border-primary flex items-center justify-center relative shadow-sm">
                              <div className="w-2.5 h-2.5 rounded-full bg-primary animate-pulse" />
                            </div>
                          ) : (
                            <div className="w-8 h-8 rounded-full bg-background border-2 border-border flex items-center justify-center shadow-sm">
                              <div className="w-2.5 h-2.5 rounded-full bg-border" />
                            </div>
                          )}
                        </div>
                        
                        <div className={`flex-1 pt-1.5 ${!event.completed && !isActive ? "opacity-50" : ""}`}>
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mb-1">
                            <span className={`text-sm font-semibold tracking-tight ${isActive ? "text-primary" : ""}`}>
                              {event.status}
                            </span>
                            {event.time && (
                              <span className="text-xs font-mono text-muted-foreground">
                                {formatTime(event.time)}
                              </span>
                            )}
                          </div>
                          <span className="text-xs text-muted-foreground">
                            {event.location}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </Card>
          </motion.div>
        )}
      </div>
    </div>
  );
}
