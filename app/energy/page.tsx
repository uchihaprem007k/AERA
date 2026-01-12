"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { mockData } from "@/lib/mock-data";
import { useEnergyStore } from "@/lib/energy-store";
import { CountUp } from "@/components/count-up";
import { EnergyInput } from "@/components/energy-input";
import { EditModal } from "@/components/edit-modal";
import { Battery, TrendingUp, Clock, Zap, Plus, Edit2 } from "lucide-react";
import { LineChart, Line, AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

export default function EnergyPage() {
  const [editingEnergy, setEditingEnergy] = useState(false);
  
  const energies = useEnergyStore((state) => state.energies);
  const updateEnergy = useEnergyStore((state) => state.updateEnergy);
  const initializeEnergies = useEnergyStore((state) => state.initializeEnergies);
  const getTodayEnergy = useEnergyStore((state) => state.getTodayEnergy);
  
  useEffect(() => {
    initializeEnergies();
  }, [initializeEnergies]);
  
  const energyData = energies.length > 0
    ? energies.map(e => ({ date: e.date, hour: new Date(e.date).getHours(), value: e.value }))
    : mockData.energy;
  const recentEnergy = energyData.slice(-7);
  const avgEnergy = recentEnergy.length > 0
    ? Math.round(recentEnergy.reduce((sum, d) => sum + d.value, 0) / recentEnergy.length)
    : (getTodayEnergy()?.value || 60);
  const todayEnergy = getTodayEnergy();

  // Calculate peak hours
  const hourlyEnergy: { [key: number]: number[] } = {};
  energyData.forEach((entry) => {
    if (!hourlyEnergy[entry.hour]) {
      hourlyEnergy[entry.hour] = [];
    }
    hourlyEnergy[entry.hour].push(entry.value);
  });

  const peakHours = Object.entries(hourlyEnergy)
    .map(([hour, values]) => ({
      hour: parseInt(hour),
      avgEnergy: Math.round(values.reduce((a, b) => a + b, 0) / values.length),
    }))
    .sort((a, b) => b.avgEnergy - a.avgEnergy)
    .slice(0, 3);

  // Energy curve data (by hour of day)
  const energyCurve = Array.from({ length: 24 }, (_, hour) => {
    const hourData = hourlyEnergy[hour] || [];
    return {
      hour: `${hour}:00`,
      energy: hourData.length > 0
        ? Math.round(hourData.reduce((a, b) => a + b, 0) / hourData.length)
        : 50,
    };
  });

  // Fatigue indicators
  const fatigueLevel = avgEnergy < 40 ? "High" : avgEnergy < 60 ? "Moderate" : "Low";
  const fatigueFactors = [
    { name: "Sleep quality", impact: 75, description: "Your sleep patterns affect energy significantly" },
    { name: "Stress levels", impact: 60, description: "High stress drains mental energy" },
    { name: "Activity balance", impact: 45, description: "Balancing rest and activity is important" },
  ];

  const handleEnergyUpdate = (value: number, note?: string, peakTime?: string) => {
    const today = new Date().toISOString().split("T")[0];
    updateEnergy(today, value, note, peakTime);
    setEditingEnergy(false);
  };

  return (
    <div className="space-y-8">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-primary to-purple-500 bg-clip-text text-transparent">
            Energy
          </h1>
          <p className="text-muted-foreground">Understanding your energy patterns and peak performance times</p>
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setEditingEnergy(true)}
          className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-xl font-medium shadow-lg shadow-primary/20 hover:shadow-xl transition-all"
        >
          <Plus className="w-4 h-4" />
          Log Today&apos;s Energy
        </motion.button>
      </motion.div>
      
      {/* Energy Edit Modal */}
      <EditModal
        isOpen={editingEnergy}
        onClose={() => setEditingEnergy(false)}
        title="Update Your Energy"
      >
        <EnergyInput
          value={todayEnergy?.value || avgEnergy}
          onChange={(value) => {
            handleEnergyUpdate(value, todayEnergy?.note, todayEnergy?.peakTime);
          }}
          onNoteChange={(note) => {
            handleEnergyUpdate(todayEnergy?.value || avgEnergy, note, todayEnergy?.peakTime);
          }}
          onPeakTimeChange={(peakTime) => {
            handleEnergyUpdate(todayEnergy?.value || avgEnergy, todayEnergy?.note, peakTime);
          }}
          note={todayEnergy?.note}
          peakTime={todayEnergy?.peakTime}
        />
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => setEditingEnergy(false)}
          className="w-full mt-6 px-4 py-3 bg-primary text-primary-foreground rounded-xl font-medium"
        >
          Save
        </motion.button>
      </EditModal>

      {/* Current Energy */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          whileHover={{ scale: 1.02, y: -2 }}
          className="bg-gradient-to-br from-card to-card/50 border border-border rounded-xl p-6 shadow-lg"
        >
          <div className="flex items-center gap-3 mb-4">
            <Battery className="w-6 h-6 text-primary" />
            <h3 className="text-lg font-semibold">Current Energy</h3>
          </div>
          <CountUp value={avgEnergy} className="text-4xl font-bold mb-2" />
          <p className="text-sm text-muted-foreground">Average over past 7 days</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ delay: 0.1 }}
          whileHover={{ scale: 1.02, y: -2 }}
          className="bg-gradient-to-br from-card to-card/50 border border-border rounded-xl p-6 shadow-lg"
        >
          <div className="flex items-center gap-3 mb-4">
            <Clock className="w-6 h-6 text-primary" />
            <h3 className="text-lg font-semibold">Fatigue Level</h3>
          </div>
          <div className="text-4xl font-bold mb-2">{fatigueLevel}</div>
          <p className="text-sm text-muted-foreground">Based on recent patterns</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ delay: 0.2 }}
          whileHover={{ scale: 1.02, y: -2 }}
          className="bg-gradient-to-br from-card to-card/50 border border-border rounded-xl p-6 shadow-lg"
        >
          <div className="flex items-center gap-3 mb-4">
            <Zap className="w-6 h-6 text-primary" />
            <h3 className="text-lg font-semibold">Peak Hour</h3>
          </div>
          <div className="text-4xl font-bold mb-2">
            {peakHours[0]?.hour || 9}:00
          </div>
          <p className="text-sm text-muted-foreground">Your most energetic time</p>
        </motion.div>
      </div>

      {/* Energy Curve */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-gradient-to-br from-card to-card/50 border border-border rounded-xl p-6 shadow-lg"
      >
        <h3 className="text-lg font-semibold mb-4">Daily Energy Curve</h3>
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart data={energyCurve}>
            <defs>
              <linearGradient id="energyGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="hour" />
            <YAxis domain={[0, 100]} />
            <Tooltip />
            <Area type="monotone" dataKey="energy" stroke="#10b981" fill="url(#energyGradient)" />
          </AreaChart>
        </ResponsiveContainer>
      </motion.div>

      {/* Peak Hours */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-card border border-border rounded-lg p-6"
      >
        <h3 className="text-lg font-semibold mb-4">Peak Energy Hours</h3>
        <div className="space-y-4">
          {peakHours.map((peak, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 + i * 0.1 }}
              className="flex items-center gap-4"
            >
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                <span className="text-lg font-bold text-primary">{peak.hour}</span>
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between mb-1">
                  <span className="font-medium">Energy Level</span>
                  <span className="text-sm font-bold">{peak.avgEnergy}</span>
                </div>
                <div className="w-full bg-muted rounded-full h-2">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${peak.avgEnergy}%` }}
                    transition={{ duration: 1, delay: 0.6 + i * 0.1 }}
                    className="bg-primary h-2 rounded-full"
                  />
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Fatigue Indicators */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <h2 className="text-2xl font-semibold mb-4">Fatigue Factors</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {fatigueFactors.map((factor, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.6 + i * 0.1 }}
              whileHover={{ scale: 1.02, y: -2 }}
              className="bg-gradient-to-br from-card to-card/50 border border-border rounded-xl p-6 shadow-md hover:shadow-lg transition-shadow"
            >
              <h4 className="font-semibold mb-2">{factor.name}</h4>
              <div className="w-full bg-muted rounded-full h-2 mb-3">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${factor.impact}%` }}
                  transition={{ duration: 1, delay: 0.7 + i * 0.1 }}
                  className="bg-primary h-2 rounded-full"
                />
              </div>
              <p className="text-sm text-muted-foreground">{factor.description}</p>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}

