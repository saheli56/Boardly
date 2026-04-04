type ClassValue = string | number | bigint | boolean | undefined | null | string[];

/**
 * Conditionally join class names — a lightweight clsx replacement.
 * Accepts strings, undefined, null, false, and arrays.
 */
export function cn(...inputs: ClassValue[]): string {
  return inputs
    .flat(Infinity)
    .filter((x) => typeof x === "string" && x.length > 0)
    .join(" ");
}

/**
 * Format a time string like "14:30" → "2:30 PM"
 */
export function formatTime(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
}

/**
 * Format a date string like "Apr 05, 2026"
 */
export function formatDate(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleDateString("en-US", {
    month: "short",
    day: "2-digit",
    year: "numeric",
  });
}

/**
 * Generate a random PNR-style code
 */
export function generatePNR(): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  return Array.from({ length: 6 }, () =>
    chars.charAt(Math.floor(Math.random() * chars.length))
  ).join("");
}

/**
 * Generate a random baggage tracking code
 */
export function generateTrackingCode(): string {
  const prefix = "BDL";
  const num = Math.floor(100000 + Math.random() * 900000);
  return `${prefix}${num}`;
}

/**
 * Delay helper for animations / simulated loading
 */
export function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
