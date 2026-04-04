"use client";

import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Users, Plane, TrendingUp, Activity, CheckCircle2, AlertTriangle, XCircle, Timer, BarChart3
} from "lucide-react";
import { MOCK_ADMIN_STATS, MOCK_FLIGHTS } from "@/lib/mock-data";
import type { FlightStatus } from "@/types";
import { formatTime } from "@/lib/utils";

const fadeUp = {
  hidden: { opacity: 0, y: 10 },
  visible: (i: number) => ({ opacity: 1, y: 0, transition: { delay: i * 0.05, duration: 0.4,  } }),
};

const STAT_CARDS = [
  { icon: Users, label: "Total Load", value: MOCK_ADMIN_STATS.totalCheckIns.toLocaleString(), change: "+12.3%" },
  { icon: Plane, label: "Active Routes", value: MOCK_ADMIN_STATS.activeFlights.toString(), change: "+3" },
  { icon: Timer, label: "Avg Process Time", value: MOCK_ADMIN_STATS.averageCheckInTime, change: "-18s" },
  { icon: TrendingUp, label: "CSAT Score", value: `${MOCK_ADMIN_STATS.passengersSatisfaction}%`, change: "+2.1%" },
];

function statusVariant(status: FlightStatus) {
  const map: Record<FlightStatus, string> = {
    scheduled: "outline", boarding: "default", departed: "secondary", "in-flight": "secondary",
    landed: "outline", delayed: "warning", cancelled: "destructive",
  };
  return map[status] as any;
}

export default function AdminPage() {
  const stats = MOCK_ADMIN_STATS;
  const maxCheckins = Math.max(...stats.checkInsPerHour);

  return (
    <div className="page-wrapper bg-background min-h-dvh">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10">
        
        <motion.div custom={0} variants={fadeUp} initial="hidden" animate="visible" className="mb-8 border-b border-border pb-6 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">System Operations Control</h1>
            <p className="text-sm text-muted-foreground mt-1">Live metrics and routing state</p>
          </div>
          <Badge variant="default" dot className="font-mono bg-primary text-primary-foreground border-none">
            SYS_ONLINE
          </Badge>
        </motion.div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {STAT_CARDS.map((stat, i) => {
            const Icon = stat.icon;
            return (
              <motion.div key={i} custom={i + 1} variants={fadeUp} initial="hidden" animate="visible">
                <Card padding="md" className="border-border shadow-sm flex flex-col justify-between h-full bg-card">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-[10px] font-semibold tracking-widest uppercase text-muted-foreground">{stat.label}</span>
                    <Icon size={14} className="text-muted-foreground" />
                  </div>
                  <div>
                    <p className="text-2xl font-mono tracking-tight">{stat.value}</p>
                    <p className={`text-xs mt-1 ${stat.change.startsWith("+") ? "text-[var(--success)]" : "text-foreground"}`}>
                      {stat.change} vs previous
                    </p>
                  </div>
                </Card>
              </motion.div>
            );
          })}
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          <motion.div custom={5} variants={fadeUp} initial="hidden" animate="visible" className="lg:col-span-2">
            <Card padding="lg" className="border-border shadow-sm h-full flex flex-col bg-card">
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-sm font-semibold tracking-tight uppercase text-muted-foreground">Load Throughput</h2>
                <BarChart3 size={16} className="text-muted-foreground" />
              </div>
              <div className="flex-1 flex items-end gap-1 min-h-[200px]">
                {stats.checkInsPerHour.map((count, i) => {
                  const height = (count / maxCheckins) * 100;
                  const isNow = i === new Date().getHours();
                  return (
                    <motion.div
                      key={i}
                      className="flex-1 relative group"
                      initial={{ height: 0 }}
                      animate={{ height: `${height}%` }}
                      transition={{ delay: i * 0.02, duration: 0.5,  }}
                      style={{
                        background: isNow ? "var(--primary)" : "var(--muted)",
                        minHeight: "2px"
                      }}
                    >
                      <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 rounded bg-foreground text-background text-[10px] font-mono opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap z-10">
                        {String(i).padStart(2,'0')}:00 - {count} op/s
                      </div>
                    </motion.div>
                  );
                })}
              </div>
              <div className="flex justify-between mt-4 text-[10px] font-mono text-muted-foreground border-t border-border pt-2">
                <span>00:00</span><span>06:00</span><span>12:00</span><span>18:00</span><span>23:00</span>
              </div>
            </Card>
          </motion.div>

          <motion.div custom={6} variants={fadeUp} initial="hidden" animate="visible">
            <Card padding="lg" className="border-border shadow-sm h-full bg-card">
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-sm font-semibold tracking-tight uppercase text-muted-foreground">Network State</h2>
                <Activity size={16} className="text-muted-foreground" />
              </div>
              <div className="space-y-4">
                {Object.entries(stats.flightStatusBreakdown).map(([status, count]) => {
                  const pct = (count / Object.values(stats.flightStatusBreakdown).reduce((a, b) => a + b, 0)) * 100;
                  return (
                    <div key={status}>
                      <div className="flex justify-between text-xs mb-1.5 font-medium">
                        <span className="capitalize">{status}</span>
                        <span className="font-mono">{count}</span>
                      </div>
                      <div className="h-1 w-full bg-muted overflow-hidden">
                        <motion.div 
                          className="h-full bg-primary" 
                          initial={{ width: 0 }} 
                          animate={{ width: `${pct}%` }} 
                          transition={{ delay: 0.2, duration: 0.6,  }} 
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </Card>
          </motion.div>
        </div>

        <motion.div custom={7} variants={fadeUp} initial="hidden" animate="visible" className="mt-8">
          <Card padding="none" className="border-border shadow-sm overflow-hidden bg-card">
            <div className="px-5 py-4 border-b border-border bg-secondary/50">
              <h2 className="text-sm font-semibold tracking-tight uppercase text-muted-foreground">Active Manifests</h2>
            </div>
            
            <div className="hidden sm:grid grid-cols-6 px-5 py-3 text-[10px] uppercase tracking-widest font-semibold text-muted-foreground border-b border-border">
              <span>Flight</span>
              <span>Time</span>
              <span className="col-span-2">Vector</span>
              <span>Gate</span>
              <span className="text-right">State</span>
            </div>

            <div className="divide-y divide-border">
              {MOCK_FLIGHTS.map((flight, i) => (
                <div key={flight.id} className="grid grid-cols-2 sm:grid-cols-6 items-center px-5 py-3 text-sm hover:bg-secondary/20 transition-colors">
                  <span className="font-mono text-xs">{flight.flightNumber}</span>
                  <span className="font-mono text-xs text-muted-foreground">{formatTime(flight.departure.time)}</span>
                  <span className="col-span-2 font-medium">
                    {flight.departure.code} <span className="text-muted-foreground mx-1">→</span> {flight.arrival.code}
                  </span>
                  <span className="font-mono text-xs text-muted-foreground hidden sm:block">{flight.departure.gate}</span>
                  <div className="text-right flex justify-end">
                    <Badge variant={statusVariant(flight.status)}>{flight.status}</Badge>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
