"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard,
  Brain,
  Loader2,
  Battery,
  Calendar,
  Flame,
  Lightbulb,
  Heart,
  User,
  MessageSquare,
  Settings,
  Menu,
  X,
  CheckSquare,
  Moon,
  Activity,
} from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/daily-checkin", label: "Daily Check-in", icon: CheckSquare },
  { href: "/self-awareness", label: "Self-Awareness", icon: Brain },
  { href: "/mental-load", label: "Mental Load", icon: Loader2 },
  { href: "/energy", label: "Energy", icon: Battery },
  { href: "/sleep-recovery", label: "Sleep & Recovery", icon: Moon },
  { href: "/stress-pressure", label: "Stress & Pressure", icon: Activity },
  { href: "/life-balance", label: "Life Balance", icon: Heart },
  { href: "/planner", label: "Planner", icon: Calendar },
  { href: "/burnout", label: "Burnout", icon: Flame },
  { href: "/insights", label: "Insights", icon: Lightbulb },
  { href: "/education", label: "Understanding", icon: Brain },
  { href: "/life-situations", label: "Life Situations", icon: Heart },
  { href: "/profile", label: "Profile", icon: User },
  { href: "/ai-coach", label: "AI Coach", icon: MessageSquare },
  { href: "/settings", label: "Settings", icon: Settings },
];

// Main navigation items (shown in bottom nav on mobile)
const mainNavItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/daily-checkin", label: "Check-in", icon: CheckSquare },
  { href: "/insights", label: "Insights", icon: Lightbulb },
  { href: "/profile", label: "Profile", icon: User },
];

export function Sidebar() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex fixed left-0 top-0 h-screen w-64 border-r border-border bg-gradient-to-b from-card to-card/95 p-6 flex-col shadow-lg z-40">
        <div className="mb-8">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-purple-500 bg-clip-text text-transparent">HeartLyte</h1>
          <p className="text-sm text-muted-foreground">Your personal intelligence layer</p>
        </div>

        <nav className="flex-1 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;

            return (
              <Link key={item.href} href={item.href}>
                <motion.div
                  whileHover={{ x: 4 }}
                  whileTap={{ scale: 0.98 }}
                  className={cn(
                    "flex items-center gap-3 px-4 py-3 rounded-xl transition-all min-h-[44px]",
                    isActive
                      ? "bg-gradient-to-r from-primary to-primary/80 text-primary-foreground shadow-md shadow-primary/20"
                      : "text-muted-foreground hover:bg-accent hover:text-foreground hover:translate-x-1"
                  )}
                >
                  <Icon className="w-5 h-5 flex-shrink-0" />
                  <span className="text-sm font-medium">{item.label}</span>
                </motion.div>
              </Link>
            );
          })}
        </nav>
      </aside>

      {/* Mobile Bottom Navigation */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-card border-t border-border shadow-lg z-50 safe-area-bottom">
        <div className="grid grid-cols-4 h-16">
          {mainNavItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;

            return (
              <Link key={item.href} href={item.href}>
                <motion.div
                  whileTap={{ scale: 0.95 }}
                  className={cn(
                    "flex flex-col items-center justify-center gap-1 h-full min-h-[44px]",
                    isActive
                      ? "text-primary"
                      : "text-muted-foreground"
                  )}
                >
                  <Icon className="w-5 h-5" />
                  <span className="text-xs font-medium">{item.label}</span>
                  {isActive && (
                    <motion.div
                      layoutId="mobileNavIndicator"
                      className="absolute bottom-0 left-0 right-0 h-1 bg-primary rounded-t-full"
                    />
                  )}
                </motion.div>
              </Link>
            );
          })}
        </div>
      </nav>

      {/* Mobile Menu Button */}
      <motion.button
        whileTap={{ scale: 0.95 }}
        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-card border border-border rounded-lg shadow-md"
        aria-label="Toggle menu"
      >
        {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
      </motion.button>

      {/* Mobile Drawer Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileMenuOpen(false)}
              className="lg:hidden fixed inset-0 bg-black/50 z-40"
            />
            <motion.aside
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="lg:hidden fixed left-0 top-0 h-screen w-72 bg-card border-r border-border shadow-xl z-50 overflow-y-auto"
            >
              <div className="p-6 border-b border-border">
                <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-purple-500 bg-clip-text text-transparent">HeartLyte</h1>
                <p className="text-sm text-muted-foreground mt-1">Your personal intelligence layer</p>
              </div>

              <nav className="p-4 space-y-1">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = pathname === item.href;

                  return (
                    <Link key={item.href} href={item.href} onClick={() => setMobileMenuOpen(false)}>
                      <motion.div
                        whileTap={{ scale: 0.98 }}
                        className={cn(
                          "flex items-center gap-3 px-4 py-3 rounded-xl transition-all min-h-[44px]",
                          isActive
                            ? "bg-gradient-to-r from-primary to-primary/80 text-primary-foreground shadow-md shadow-primary/20"
                            : "text-muted-foreground hover:bg-accent hover:text-foreground"
                        )}
                      >
                        <Icon className="w-5 h-5 flex-shrink-0" />
                        <span className="text-sm font-medium">{item.label}</span>
                      </motion.div>
                    </Link>
                  );
                })}
              </nav>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}

