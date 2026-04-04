"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Plane, ArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Card } from "@/components/ui/card";

export default function LoginPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await new Promise((r) => setTimeout(r, 800));
    setLoading(false);
    router.push("/dashboard");
  };

  return (
    <div className="min-h-dvh flex items-center justify-center bg-background p-4 relative overflow-hidden">
      {/* Super subtle grid bg */}
      <div className="absolute inset-0 bg-dot-pattern opacity-50 pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4,  }}
        className="relative z-10 w-full max-w-[360px]"
      >
        <div className="flex justify-center mb-8">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded bg-primary text-primary-foreground flex items-center justify-center">
              <Plane size={16} className="rotate-45" />
            </div>
          </Link>
        </div>

        <Card padding="lg" className="shadow-none border-border">
          <div className="mb-6 text-center">
            <h1 className="text-xl font-semibold tracking-tight mb-1">Access Account</h1>
            <p className="text-xs text-muted-foreground">
              Enter your email to sign in
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              type="email"
              placeholder="name@example.com"
              required
            />
            <Button
              type="submit"
              className="w-full"
              loading={loading}
            >
              Continue with Email
            </Button>
          </form>

          <div className="my-6 flex items-center text-xs text-muted-foreground">
            <div className="flex-1 border-t border-border" />
            <span className="px-2 bg-card">OR</span>
            <div className="flex-1 border-t border-border" />
          </div>

          <div className="space-y-2">
            <Button variant="outline" className="w-full" type="button">
              Continue with PNR Code
            </Button>
          </div>
        </Card>

        <p className="text-center text-[10px] text-muted-foreground mt-6">
          By continuing, you agree to our Terms of Service & Privacy Policy.
        </p>
      </motion.div>
    </div>
  );
}
