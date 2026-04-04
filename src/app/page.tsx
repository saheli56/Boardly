"use client";

import { motion } from "framer-motion";
import { Plane, ArrowRight, Shield, Smartphone, Globe, Luggage, QrCode } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.5,  },
  }),
};

const FEATURES = [
  {
    icon: Smartphone,
    title: "Self-Service Kiosk & Mobile",
    description: "Complete your check-in securely from your own device or our designated airport terminals.",
  },
  {
    icon: QrCode,
    title: "Encrypted Boarding Pass",
    description: "Your digital boarding pass is generated with cryptographic signatures for fast, offline gate validation.",
  },
  {
    icon: Plane,
    title: "Dynamic Seat Allocation",
    description: "View real-time aircraft schematics and reserve seats instantly with our high-availability booking engine.",
  },
  {
    icon: Luggage,
    title: "Automated Baggage Flow",
    description: "Generate tracking barcodes instantly. Drop your luggage at the automated belt without manual interference.",
  },
  {
    icon: Globe,
    title: "Global Air Traffic Sync",
    description: "Live-synced with global departure control systems (DCS) for zero-latency gate and time updates.",
  },
  {
    icon: Shield,
    title: "Enterprise Grade Security",
    description: "Passenger data is secured with AES-256 encryption. We enforce strict compliance with global aviation data standards.",
  },
];

export default function LandingPage() {
  return (
    <div className="page-wrapper bg-background pt-14 flex flex-col items-center">
      
      {/* ─── Hero Section ─── */}
      <section className="relative w-full overflow-hidden min-h-[85vh] flex flex-col items-center justify-center border-b border-border">
        {/* Background Pattern */}
        <div className="absolute inset-0 z-0 bg-dot-pattern" />
        {/* Central Spotlight */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[600px] opacity-30 dark:opacity-[0.15] bg-[radial-gradient(circle,var(--primary)_0%,transparent_60%)] z-0 pointer-events-none" />

        <div className="relative z-10 w-full max-w-5xl mx-auto px-4 sm:px-6 text-center mt-12">
          <motion.div
            custom={0}
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-[11px] font-medium border border-border bg-card text-muted-foreground shadow-sm mb-8"
          >
            <span className="flex h-2 w-2 rounded-full bg-primary" />
            Boardly Aviation Systems v2.4
          </motion.div>

          <motion.h1
            custom={1}
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            className="text-5xl md:text-7xl lg:text-[80px] font-bold leading-[1.05] tracking-tight mb-6"
          >
            The Check-In <br className="hidden sm:block" />
            <span className="text-muted-foreground">Infrastructure.</span>
          </motion.h1>

          <motion.p
            custom={2}
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed font-light"
          >
            A high-performance, self-service platform designed to eliminate airport queues. 
            Digital boarding, intelligent seating, and real-time synchronization.
          </motion.p>

          <motion.div
            custom={3}
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Link
              href="/check-in"
              className="inline-flex h-11 items-center justify-center rounded-md bg-primary px-8 text-sm font-medium text-primary-foreground shadow hover:bg-primary/90 transition-colors w-full sm:w-auto"
            >
              Initialize Check-In
              <ArrowRight size={16} className="ml-2" />
            </Link>
            <Link
              href="/login"
              className="inline-flex h-11 items-center justify-center rounded-md border border-input bg-transparent px-8 text-sm font-medium shadow-sm hover:bg-accent hover:text-accent-foreground transition-colors w-full sm:w-auto"
            >
              Passenger Login
            </Link>
          </motion.div>
        </div>

        {/* Dashboard Mockup Outline */}
        <motion.div
          custom={4}
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          className="relative z-10 w-full max-w-4xl mx-auto mt-20 px-4 sm:px-6"
        >
          <div className="rounded-t-xl border border-border bg-card shadow-2xl p-2 sm:p-4 pb-0 h-[200px] overflow-hidden flex flex-col relative">
            <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent z-10" />
            <div className="flex gap-1.5 mb-4 px-2">
              <div className="w-2.5 h-2.5 rounded-full bg-border" />
              <div className="w-2.5 h-2.5 rounded-full bg-border" />
              <div className="w-2.5 h-2.5 rounded-full bg-border" />
            </div>
            {/* Abstract Wireframe */}
            <div className="flex-1 border border-border rounded-lg bg-background p-4 flex gap-4 opacity-50">
              <div className="w-1/4 space-y-4">
                <div className="h-4 bg-muted rounded w-2/3" />
                <div className="h-20 bg-muted rounded w-full" />
                <div className="h-20 bg-muted rounded w-full" />
              </div>
              <div className="w-3/4 space-y-4">
                <div className="h-8 bg-muted rounded w-1/3 mb-8" />
                <div className="h-[2px] bg-border w-full" />
                <div className="flex justify-between mt-4">
                  <div className="w-16 h-16 rounded-full bg-muted" />
                  <div className="w-16 h-16 rounded-full bg-muted" />
                  <div className="w-16 h-16 rounded-full bg-muted" />
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* ─── Features Minimal Grid ─── */}
      <section className="w-full py-24 border-b border-border bg-background">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="mb-16">
            <h2 className="text-2xl md:text-3xl font-semibold tracking-tight mb-4">
              Engineered for Scale
            </h2>
            <p className="text-muted-foreground text-sm max-w-xl">
              Boardly handles mission-critical passenger flow. Our architecture ensures resilient 
              operations whether you process a hundred passengers a day or a million.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-12">
            {FEATURES.map((feature, i) => {
              const Icon = feature.icon;
              return (
                <div key={feature.title} className="group">
                  <div className="w-10 h-10 rounded border border-border flex items-center justify-center mb-5 bg-card shrink-0">
                    <Icon size={18} className="text-foreground" />
                  </div>
                  <h3 className="text-sm font-semibold mb-2">{feature.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ─── Footer ─── */}
      <footer className="w-full py-8 text-center bg-background">
        <p className="text-xs text-muted-foreground">
          © 2026 Boardly Aviation Systems. All rights reserved.
        </p>
      </footer>
    </div>
  );
}
