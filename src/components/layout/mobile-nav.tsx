"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, ScanLine, Plane, User } from "lucide-react";
import { motion } from "framer-motion";

const TABS = [
  { href: "/dashboard", label: "Home", icon: LayoutDashboard },
  { href: "/check-in", label: "Check In", icon: ScanLine },
  { href: "/flights", label: "Flights", icon: Plane },
  { href: "/profile", label: "Profile", icon: User },
];

export function MobileNav() {
  const pathname = usePathname();

  // Don't show on public pages
  const isPublicPage = pathname === "/" || pathname === "/login";
  if (isPublicPage) return null;

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-50 md:hidden flex items-center justify-around"
      style={{
        height: "var(--mobile-nav-height)",
        background: "var(--bg-secondary)",
        borderTop: "1px solid var(--border)",
        paddingBottom: "env(safe-area-inset-bottom, 8px)",
      }}
    >
      {TABS.map((tab) => {
        const isActive = pathname === tab.href || pathname.startsWith(tab.href + "/");
        const Icon = tab.icon;

        return (
          <Link
            key={tab.href}
            href={tab.href}
            className="relative flex flex-col items-center justify-center gap-0.5 flex-1 py-2 transition-colors"
            style={{
              color: isActive ? "var(--accent)" : "var(--text-tertiary)",
            }}
          >
            {isActive && (
              <motion.div
                layoutId="mobile-nav-indicator"
                className="absolute -top-px left-4 right-4 h-0.5 rounded-full"
                style={{ background: "var(--accent)" }}
                transition={{ type: "spring", stiffness: 400, damping: 30 }}
              />
            )}
            <Icon size={20} strokeWidth={isActive ? 2.5 : 1.5} />
            <span className="text-[10px] font-medium">{tab.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
