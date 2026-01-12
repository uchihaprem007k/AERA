"use client";

import { motion } from "framer-motion";
import { useAppStore } from "@/lib/store";
import { Settings as SettingsIcon, Moon, Sun, Monitor, Bell, Shield, Palette } from "lucide-react";

export default function SettingsPage() {
  const theme = useAppStore((state) => state.theme);
  const setTheme = useAppStore((state) => state.setTheme);

  return (
    <div className="space-y-8">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-4xl font-bold mb-2">Settings</h1>
        <p className="text-muted-foreground">Customize your AERA experience</p>
      </motion.div>

      {/* Theme Settings */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-card border border-border rounded-lg p-6"
      >
        <div className="flex items-center gap-3 mb-6">
          <Palette className="w-6 h-6 text-primary" />
          <h2 className="text-xl font-semibold">Appearance</h2>
        </div>

        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium mb-2 block">Theme</label>
            <div className="grid grid-cols-3 gap-4">
              {[
                { value: "light" as const, label: "Light", icon: Sun },
                { value: "dark" as const, label: "Dark", icon: Moon },
                { value: "system" as const, label: "System", icon: Monitor },
              ].map((option) => {
                const Icon = option.icon;
                const isSelected = theme === option.value;
                return (
                  <motion.button
                    key={option.value}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setTheme(option.value)}
                    className={`p-4 border-2 rounded-lg transition-all ${
                      isSelected
                        ? "border-primary bg-primary/10"
                        : "border-border hover:border-primary/50"
                    }`}
                  >
                    <Icon className="w-6 h-6 mx-auto mb-2" />
                    <div className="text-sm font-medium">{option.label}</div>
                  </motion.button>
                );
              })}
            </div>
          </div>
        </div>
      </motion.div>

      {/* Notifications */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-card border border-border rounded-lg p-6"
      >
        <div className="flex items-center gap-3 mb-6">
          <Bell className="w-6 h-6 text-primary" />
          <h2 className="text-xl font-semibold">Notifications</h2>
        </div>

        <div className="space-y-4">
          {[
            { label: "Daily mood check-in reminders", default: true },
            { label: "Weekly insights summary", default: true },
            { label: "Burnout risk alerts", default: false },
            { label: "Task reminders", default: true },
          ].map((setting, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 + i * 0.05 }}
              className="flex items-center justify-between p-4 bg-muted/50 rounded-lg"
            >
              <span className="text-sm font-medium">{setting.label}</span>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className={`w-12 h-6 rounded-full transition-colors ${
                  setting.default ? "bg-primary" : "bg-muted"
                }`}
              >
                <motion.div
                  className="w-5 h-5 bg-white rounded-full shadow-md"
                  animate={{ x: setting.default ? 24 : 2 }}
                  transition={{ type: "spring", stiffness: 500, damping: 30 }}
                />
              </motion.button>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Privacy & Security */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-card border border-border rounded-lg p-6"
      >
        <div className="flex items-center gap-3 mb-6">
          <Shield className="w-6 h-6 text-primary" />
          <h2 className="text-xl font-semibold">Privacy & Security</h2>
        </div>

        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Your data is stored locally and encrypted. We never share your personal information with third parties.
          </p>
          <div className="flex gap-4">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium"
            >
              Export Data
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-4 py-2 border border-border rounded-lg text-sm font-medium"
            >
              Delete Account
            </motion.button>
          </div>
        </div>
      </motion.div>

      {/* About */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-card border border-border rounded-lg p-6"
      >
        <div className="flex items-center gap-3 mb-4">
          <SettingsIcon className="w-6 h-6 text-primary" />
          <h2 className="text-xl font-semibold">About AERA</h2>
        </div>
        <div className="space-y-2 text-sm text-muted-foreground">
          <p>Version 1.0.0</p>
          <p>AERA is your personal intelligence layer for mental health and self-understanding.</p>
          <p>Built with care for normal humans navigating life&apos;s complexities.</p>
        </div>
      </motion.div>
    </div>
  );
}

