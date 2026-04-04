export const APP_NAME = "Boardly";
export const APP_DESCRIPTION =
  "Premium self-service airport check-in experience";

export const NAV_LINKS = [
  { href: "/dashboard", label: "Dashboard", icon: "LayoutDashboard" },
  { href: "/check-in", label: "Check In", icon: "ScanLine" },
  { href: "/flights", label: "Flights", icon: "Plane" },
  { href: "/admin", label: "Admin", icon: "Activity" },
  { href: "/profile", label: "Profile", icon: "User" },
] as const;

export const SEAT_LETTERS_ECONOMY = ["A", "B", "C", "D", "E", "F"] as const;
export const SEAT_LETTERS_BUSINESS = ["A", "B", "D", "E"] as const;

export const SEAT_PRICES: Record<string, number> = {
  business: 75,
  premium: 35,
  economy: 0,
  window: 12,
  exit: 18,
  front: 8,
};

export const BAGGAGE_PRICES = [
  { weight: 7, label: "Cabin (7 kg)", price: 0, type: "cabin" as const },
  { weight: 15, label: "15 kg", price: 25, type: "checked" as const },
  { weight: 23, label: "23 kg", price: 40, type: "checked" as const },
  { weight: 32, label: "32 kg", price: 60, type: "checked" as const },
];

export const CHECK_IN_STEPS = [
  { id: 1, label: "Passenger", description: "Your details" },
  { id: 2, label: "Seats", description: "Choose your seat" },
  { id: 3, label: "Baggage", description: "Add luggage" },
  { id: 4, label: "Confirm", description: "Review & check in" },
] as const;
