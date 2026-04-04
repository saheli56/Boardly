"use client";

import { ThemeProvider } from "next-themes";
import { AuthProvider } from "./providers/auth-provider";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <ThemeProvider attribute="class" defaultTheme="dark" enableSystem disableTransitionOnChange={false}>
        {children}
      </ThemeProvider>
    </AuthProvider>
  );
}
