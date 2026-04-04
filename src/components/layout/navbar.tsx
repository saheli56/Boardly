"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Plane, Menu, X, Bell, LogOut } from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";
import { NAV_LINKS } from "@/lib/constants";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { logout } from "@/lib/firebase/services";
import { useRouter } from "next/navigation";

export function Navbar() {
  const router = useRouter();
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // Close mobile menu on path change
  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const isPublicPage = pathname === "/" || pathname === "/login";

  return (
    <>
      <header
        className={cn(
          "fixed top-0 left-0 right-0 z-50 h-14 flex items-center transition-all duration-200",
          scrolled || mobileOpen ? "bg-background/80 backdrop-blur-md border-b border-border" : "bg-transparent border-transparent"
        )}
      >
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between">
          <Link href={isPublicPage ? "/" : "/dashboard"} className="flex items-center gap-2 group">
            <div className="flex items-center justify-center w-7 h-7 rounded bg-primary text-primary-foreground">
              <Plane size={14} className="rotate-45" />
            </div>
            <span className="text-sm font-bold tracking-tight">
              Boardly.
            </span>
          </Link>

          {!isPublicPage && (
            <nav className="hidden md:flex items-center gap-6">
              {NAV_LINKS.map((link) => {
                const isActive = pathname === link.href || pathname.startsWith(link.href + "/");
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={cn(
                      "text-sm tracking-tight transition-colors hover:text-foreground",
                      isActive ? "text-foreground font-medium" : "text-muted-foreground"
                    )}
                  >
                    {link.label}
                  </Link>
                );
              })}
            </nav>
          )}

          <div className="flex items-center gap-2 sm:gap-4">
            {!isPublicPage && (
              <button
                className="w-8 h-8 flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
                aria-label="Notifications"
              >
                <Bell size={16} />
              </button>
            )}
            <ThemeToggle />
            {!isPublicPage && (
              <button
                onClick={async () => {
                  await logout();
                  router.push("/login");
                }}
                className="w-8 h-8 flex items-center justify-center text-muted-foreground hover:text-destructive transition-colors"
                aria-label="Logout"
              >
                <LogOut size={16} />
              </button>
            )}
            {!isPublicPage && (
              <button
                className="md:hidden w-8 h-8 flex items-center justify-center text-muted-foreground"
                onClick={() => setMobileOpen(!mobileOpen)}
              >
                {mobileOpen ? <X size={16} /> : <Menu size={16} />}
              </button>
            )}
            {isPublicPage && (
              <Link
                href="/login"
                className="hidden sm:inline-flex h-8 items-center justify-center rounded-md bg-primary px-4 text-xs font-medium text-primary-foreground shadow hover:bg-primary/90 transition-colors"
              >
                Get Started
              </Link>
            )}
          </div>
        </div>
      </header>

      <AnimatePresence>
        {mobileOpen && !isPublicPage && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="fixed top-14 left-0 right-0 z-40 md:hidden p-4 bg-background border-b border-border shadow-md"
          >
            <nav className="flex flex-col space-y-3 pb-2">
              {NAV_LINKS.map((link) => {
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={cn(
                      "text-sm font-medium",
                      isActive ? "text-foreground" : "text-muted-foreground"
                    )}
                  >
                    {link.label}
                  </Link>
                );
              })}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
