"use client";

import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  User as UserIcon, Mail, Phone, Globe, CreditCard, Plane, MapPin, Clock, Award,
  Settings, LogOut, Shield, ChevronRight, Edit3
} from "lucide-react";
import { MOCK_PASSENGER } from "@/lib/mock-data";
import { useState } from "react";
import { useAuth } from "@/components/providers/auth-provider";
import { logout } from "@/lib/firebase/services";
import { useRouter } from "next/navigation";

const fadeUp = {
  hidden: { opacity: 0, y: 10 },
  visible: (i: number) => ({ opacity: 1, y: 0, transition: { delay: i * 0.05, duration: 0.4,  } }),
};

const TRAVEL_STATS = [
  { icon: Plane, label: "Segments", value: "24", highlight: false },
  { icon: MapPin, label: "Distance", value: "48,293 mi", highlight: false },
  { icon: Clock, label: "Air Time", value: "96h 18m", highlight: false },
  { icon: Award, label: "Status", value: "Gold", highlight: true },
];

const MENU_ITEMS = [
  { icon: Settings, label: "Account Configuration", subtitle: "Preferences & Localization" },
  { icon: CreditCard, label: "Billing & Subscriptions", subtitle: "Managed payment methods" },
  { icon: Shield, label: "Travel Documents", subtitle: "Passports, IDs, Visas" },
  { icon: Globe, label: "Data Controls", subtitle: "Privacy & GDPR tools" },
];

export default function ProfilePage() {
  const router = useRouter();
  const { user, loading } = useAuth();
  const [editing, setEditing] = useState(false);

  if (loading) return <div className="min-h-dvh flex items-center justify-center text-xs uppercase tracking-widest text-muted-foreground animate-pulse">Establishing Secure Link...</div>;
  if (!user) {
    router.push("/login"); // Safety redirect
    return null;
  }

  const fullName = user.displayName || "Anonymous Agent";
  const [firstName, ...rest] = fullName.split(" ");
  const lastName = rest.join(" ") || " ";
  const initials = (firstName[0] || "?") + (lastName[0] || "");

  const handleLogout = async () => {
    await logout();
    router.push("/login");
  };

  return (
    <div className="page-wrapper bg-background min-h-dvh">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10">
        
        <motion.div custom={0} variants={fadeUp} initial="hidden" animate="visible" className="mb-8 border-b border-border pb-6 flex flex-col md:flex-row gap-6 md:items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-md bg-primary text-primary-foreground flex items-center justify-center text-xl font-bold font-mono shadow-sm">
              {initials}
            </div>
            <div>
              <h1 className="text-2xl font-semibold tracking-tight">{fullName}</h1>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-sm font-mono text-muted-foreground uppercase">{user.email?.split("@")[0]}</span>
                <Badge variant="outline" className="text-[10px] uppercase tracking-widest">Standard Tier</Badge>
              </div>
            </div>
          </div>
          <Button variant="outline" size="sm" onClick={() => setEditing(!editing)}>
            {editing ? "Discard" : "Configure Identity"}
          </Button>
        </motion.div>

        {editing && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} className="mb-8 overflow-hidden">
            <Card padding="lg" className="border-border bg-card shadow-sm">
              <h2 className="text-sm font-semibold tracking-tight uppercase text-muted-foreground mb-4">Identity Editor</h2>
              <div className="grid sm:grid-cols-2 gap-4 mb-6">
                <Input label="Given Name" defaultValue={firstName} icon={<UserIcon size={14} />} />
                <Input label="Surname" defaultValue={lastName} />
                <Input label="Email Address" type="email" defaultValue={user.email || ""} icon={<Mail size={14} />} disabled />
                <Input label="Phone Contact" type="tel" placeholder="None provided" icon={<Phone size={14} />} />
                <Input label="Travel Identity" placeholder="No document on file" icon={<CreditCard size={14} />} />
                <Input label="Nationality" placeholder="Unspecified" icon={<Globe size={14} />} />
              </div>
              <div className="flex justify-end gap-2 text-xs text-muted-foreground italic mb-2">
                Profiles are securely managed via Firebase encrypted storage.
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="secondary" size="sm" onClick={() => setEditing(false)}>Cancel</Button>
                <Button size="sm" onClick={() => setEditing(false)}>Commit Changes</Button>
              </div>
            </Card>
          </motion.div>
        )}

        <div className="grid md:grid-cols-3 gap-8">
          <motion.div custom={1} variants={fadeUp} initial="hidden" animate="visible" className="md:col-span-1 space-y-4">
            <h2 className="text-sm font-semibold tracking-tight uppercase text-muted-foreground">Telemetry</h2>
            {TRAVEL_STATS.map((stat, i) => {
              const Icon = stat.icon;
              return (
                <div key={i} className="flex flex-col p-4 rounded-md border border-border bg-card">
                  <div className="flex items-center gap-2 mb-2">
                    <Icon size={14} className={stat.highlight ? "text-primary" : "text-muted-foreground"} />
                    <span className="text-[10px] uppercase tracking-widest text-muted-foreground font-semibold">{stat.label}</span>
                  </div>
                  <span className="text-lg font-mono tracking-tight">{stat.value}</span>
                </div>
              );
            })}
          </motion.div>

          <motion.div custom={2} variants={fadeUp} initial="hidden" animate="visible" className="md:col-span-2 space-y-4">
            <h2 className="text-sm font-semibold tracking-tight uppercase text-muted-foreground">System Preferences</h2>
            <Card padding="none" className="overflow-hidden border-border bg-card shadow-sm">
              {MENU_ITEMS.map((item, i) => {
                const Icon = item.icon;
                return (
                  <button key={i} className="w-full flex justify-between items-center p-4 text-left border-b border-border last:border-none hover:bg-secondary/50 transition-colors group">
                    <div className="flex items-center gap-4">
                      <Icon size={16} className="text-muted-foreground group-hover:text-primary transition-colors" />
                      <div>
                        <p className="text-sm font-medium">{item.label}</p>
                        <p className="text-xs text-muted-foreground">{item.subtitle}</p>
                      </div>
                    </div>
                    <ChevronRight size={16} className="text-muted-foreground" />
                  </button>
                );
              })}
            </Card>

            <Button onClick={handleLogout} variant="outline" className="w-full mt-4 text-[var(--destructive)] border-destructive/20 hover:bg-destructive/10 hover:text-[var(--destructive)]">
              <LogOut size={14} className="mr-2" /> Terminate Session
            </Button>
          </motion.div>
        </div>

      </div>
    </div>
  );
}
