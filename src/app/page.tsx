"use client";

import { motion } from "framer-motion";
import { ArrowRight, Plane, Smartphone, QrCode } from "lucide-react";
import Link from "next/link";

const fadeUp = {
  hidden: { opacity: 0, y: 10 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.05, duration: 0.4 },
  }),
};

export default function LandingPage() {
  return (
    <div className="page-wrapper bg-background min-h-dvh flex flex-col pt-14">
      {/* ─── Minimal Hero ─── */}
      <section className="flex-1 flex flex-col justify-center items-center text-center px-4 sm:px-6 py-20 mt-10 max-w-3xl mx-auto w-full">
        <motion.div custom={0} variants={fadeUp} initial="hidden" animate="visible" className="mb-8">
          <div className="w-12 h-12 bg-primary text-primary-foreground flex items-center justify-center rounded-lg mx-auto mb-6">
            <Plane size={20} className="rotate-45" />
          </div>
          <h1 className="text-4xl sm:text-6xl tracking-tighter font-semibold mb-4 leading-tight">
            Aviation infrastructure, <br className="hidden sm:block" />
            <span className="text-muted-foreground">re-engineered for speed.</span>
          </h1>
          <p className="text-sm sm:text-base text-muted-foreground max-w-lg mx-auto leading-relaxed">
            Boardly runs your entire terminal flow. Seamless check-in, secure boarding passes, and dynamic seat allocations without the clutter.
          </p>
        </motion.div>

        <motion.div custom={1} variants={fadeUp} initial="hidden" animate="visible" className="flex flex-col sm:flex-row items-center justify-center gap-3 w-full sm:w-auto">
          <Link
            href="/check-in"
            className="flex h-10 w-full sm:w-auto items-center justify-center rounded-md bg-primary px-6 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
          >
            Launch Client
            <ArrowRight size={14} className="ml-2 opacity-70" />
          </Link>
          <Link
            href="/login"
            className="flex h-10 w-full sm:w-auto items-center justify-center rounded-md border border-input bg-transparent px-6 text-sm font-medium hover:bg-accent hover:text-accent-foreground transition-colors"
          >
            Authenticate
          </Link>
        </motion.div>

        <motion.div custom={2} variants={fadeUp} initial="hidden" animate="visible" className="mt-20 w-full border-t border-border pt-12 text-left">
          <p className="text-xs font-semibold tracking-widest uppercase text-muted-foreground mb-8">System Architecture</p>
          <div className="grid sm:grid-cols-3 gap-8">
            <div>
              <Smartphone size={16} className="mb-3 text-foreground" />
              <h3 className="text-sm font-medium mb-1">Terminal Kiosks</h3>
              <p className="text-xs text-muted-foreground">Deployable on any screen size. Pure responsiveness with zero latency.</p>
            </div>
            <div>
              <Plane size={16} className="mb-3 text-foreground" />
              <h3 className="text-sm font-medium mb-1">Live Manifests</h3>
              <p className="text-xs text-muted-foreground">Real-time aircraft seating charts and telemetry parsing.</p>
            </div>
            <div>
              <QrCode size={16} className="mb-3 text-foreground" />
              <h3 className="text-sm font-medium mb-1">Secure Signatures</h3>
              <p className="text-xs text-muted-foreground">Encrypted boarding QR strings preventing fraudulent boarding.</p>
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
