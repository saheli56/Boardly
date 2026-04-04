"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Plane, AlertCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import { loginWithEmail, registerWithEmail } from "@/lib/firebase/services";
import { useAuth } from "@/components/providers/auth-provider";

export default function LoginPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  
  const [loading, setLoading] = useState(false);
  const [isRegistering, setIsRegistering] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  // Redirect if already logged in
  useEffect(() => {
    if (user && !authLoading) {
      router.push("/dashboard");
    }
  }, [user, authLoading, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    try {
      if (isRegistering) {
        await registerWithEmail(email, password);
      } else {
        await loginWithEmail(email, password);
      }
      router.push("/dashboard");
    } catch (err: any) {
      console.error(err);
      setError(err.message || "An unexpected error occurred");
      setLoading(false);
    }
  };

  if (authLoading) return <div className="min-h-dvh flex items-center justify-center text-xs uppercase tracking-widest text-muted-foreground animate-pulse">Establishing Secure Link...</div>;

  return (
    <div className="min-h-dvh flex items-center justify-center bg-background p-4 relative overflow-hidden">
      <div className="absolute inset-0 bg-dot-pattern opacity-50 pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="relative z-10 w-full max-w-[360px]"
      >
        <div className="flex justify-center mb-8">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded bg-primary text-primary-foreground flex items-center justify-center">
              <Plane size={16} className="rotate-45 transition-transform group-hover:rotate-[60deg]" />
            </div>
          </Link>
        </div>

        <Card padding="lg" className="shadow-none border-border">
          <div className="mb-6 text-center">
            <h1 className="text-xl font-semibold tracking-tight mb-1">
              {isRegistering ? "Create Account" : "Access Account"}
            </h1>
            <p className="text-xs text-muted-foreground">
              {isRegistering ? "Sign up to start checking in" : "Enter credentials to continue"}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-3">
              <Input
                label="Email"
                type="email"
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <Input
                label="Password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            {error && (
              <div className="flex items-start gap-2 p-3 rounded-md bg-destructive/10 text-destructive text-[10px] uppercase font-bold tracking-wider">
                <AlertCircle size={14} className="shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <Button
              type="submit"
              className="w-full"
              loading={loading}
            >
              {isRegistering ? "Register Agent" : "Authenticate"}
            </Button>
          </form>

          <div className="mt-6 pt-6 border-t border-border text-center">
            <button
              type="button"
              onClick={() => setIsRegistering(!isRegistering)}
              className="text-xs text-muted-foreground hover:text-foreground transition-colors underline underline-offset-4"
            >
              {isRegistering ? "Already have an account? Sign In" : "Don't have an account? Sign Up"}
            </button>
          </div>
        </Card>

        <p className="text-center text-[10px] text-muted-foreground mt-6 uppercase tracking-widest leading-relaxed">
          SECURE PROTOCOL V4.0.21<br />
          ENCRYPTED END-TO-END
        </p>
      </motion.div>
    </div>
  );
}

