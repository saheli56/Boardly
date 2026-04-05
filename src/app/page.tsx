"use client";

import { useEffect } from "react";
import { motion } from "framer-motion";
import { ArrowRight, Plane, Smartphone, QrCode } from "lucide-react";
import Link from "next/link";
import { seedDatabaseIfEmpty } from "@/lib/firebase/services";

const fadeUp = {
  hidden: { opacity: 0, y: 10 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.05, duration: 0.4 },
  }),
};

export default function LandingPage() {
  useEffect(() => {
    // Check and seed DB with mock data seamlessly in background
    seedDatabaseIfEmpty().catch(console.error);
  }, []);
  return (
    <div className="page-wrapper bg-background min-h-dvh flex flex-col">
      {/* ─── Minimal Hero ─── */}
      <section className="flex-1 flex flex-col justify-start items-center text-center px-4 sm:px-6 py-8 mt-4 max-w-3xl mx-auto w-full">
        <motion.div custom={0} variants={fadeUp} initial="hidden" animate="visible" className="mb-8">
          <div className="w-12 h-12 bg-primary text-primary-foreground flex items-center justify-center rounded-lg mx-auto mb-6">
            <Plane size={20} className="rotate-45" />
          </div>
          <h1 className="text-4xl sm:text-6xl tracking-tighter font-semibold mb-4 leading-tight">
            Fly easier with Boardly
          </h1>
          <p className="text-sm sm:text-base text-muted-foreground max-w-lg mx-auto leading-relaxed">
            Skip the airport hassle. Check in from anywhere, get your boarding pass instantly, and choose your seat on the go.
          </p>
        </motion.div>

        <motion.div custom={1} variants={fadeUp} initial="hidden" animate="visible" className="flex flex-col sm:flex-row items-center justify-center gap-3 w-full sm:w-auto">
          <Link
            href="/check-in"
            className="flex h-10 w-full sm:w-auto items-center justify-center rounded-md bg-primary px-6 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
          >
            Get Started
            <ArrowRight size={14} className="ml-2 opacity-70" />
          </Link>
          <Link
            href="/login"
            className="flex h-10 w-full sm:w-auto items-center justify-center rounded-md border border-input bg-transparent px-6 text-sm font-medium hover:bg-accent hover:text-accent-foreground transition-colors"
          >
            Sign In
          </Link>
        </motion.div>

        <motion.div custom={2} variants={fadeUp} initial="hidden" animate="visible" className="mt-20 w-full border-t border-border pt-12 text-left">
          <p className="text-xs font-semibold tracking-widest uppercase text-muted-foreground mb-8">Why Boardly?</p>
          <div className="grid sm:grid-cols-3 gap-8">
            <div>
              <Smartphone size={16} className="mb-3 text-foreground" />
              <h3 className="text-sm font-medium mb-1">Easy Check-in</h3>
              <p className="text-xs text-muted-foreground">Check in from anywhere, anytime. No more waiting in line at the airport.</p>
            </div>
            <div>
              <Plane size={16} className="mb-3 text-foreground" />
              <h3 className="text-sm font-medium mb-1">Real-time Updates</h3>
              <p className="text-xs text-muted-foreground">Get live flight updates and gate changes right on your phone.</p>
            </div>
            <div>
              <QrCode size={16} className="mb-3 text-foreground" />
              <h3 className="text-sm font-medium mb-1">Secure Boarding</h3>
              <p className="text-xs text-muted-foreground">Your boarding pass is safe and secure, with encrypted QR codes.</p>
            </div>
          </div>
        </motion.div>
      </section>

      {/* ─── Footer ─── */}
      <footer className="w-full py-6 text-center border-t border-border">
        <p className="text-[10px] uppercase tracking-widest font-mono text-muted-foreground">
          © {new Date().getFullYear()} Boardly Systems
        </p>
      </footer>
    </div>
  );
}
