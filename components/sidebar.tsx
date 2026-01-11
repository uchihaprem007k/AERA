"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
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
} from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/self-awareness", label: "Self-Awareness", icon: Brain },
  { href: "/mental-load", label: "Mental Load", icon: Loader2 },
  { href: "/energy", label: "Energy", icon: Battery },
  { href: "/planner", label: "Planner", icon: Calendar },
  { href: "/burnout", label: "Burnout", icon: Flame },
  { href: "/insights", label: "Insights", icon: Lightbulb },
  { href: "/life-situations", label: "Life Situations", icon: Heart },
  { href: "/profile", label: "Profile", icon: User },
  { href: "/ai-coach", label: "AI Coach", icon: MessageSquare },
  { href: "/settings", label: "Settings", icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed left-0 top-0 h-screen w-64 border-r border-border bg-gradient-to-b from-card to-card/95 p-6 flex flex-col shadow-lg">
      <div className="mb-8">
        <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-purple-500 bg-clip-text text-transparent">AERA</h1>
        <p className="text-sm text-muted-foreground">Your personal intelligence layer</p>
      </div>

      <nav className="flex-1 space-y-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;

          return (
            <Link key={item.href} href={item.href}>
              <motion.div
                whileHover={{ x: 4 }}
                whileTap={{ scale: 0.98 }}
                className={cn(
                  "flex items-center gap-3 px-4 py-3 rounded-xl transition-all",
                  isActive
                    ? "bg-gradient-to-r from-primary to-primary/80 text-primary-foreground shadow-md shadow-primary/20"
                    : "text-muted-foreground hover:bg-accent hover:text-foreground hover:translate-x-1"
                )}
              >
                <Icon className="w-5 h-5" />
                <span className="text-sm font-medium">{item.label}</span>
              </motion.div>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}

