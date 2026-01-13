"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useMoodStore } from "@/lib/mood-store";
import { useEnergyStore } from "@/lib/energy-store";
import { CheckSquare, Heart, Zap, Activity, Moon, Save, TrendingUp } from "lucide-react";

export default function DailyCheckInPage() {
  const [mood, setMood] = useState(50);
  const [energy, setEnergy] = useState(50);
  const [stress, setStress] = useState(50);
  const [sleep, setSleep] = useState(7);
  const [reflection, setReflection] = useState("");
  const [saved, setSaved] = useState(false);

  const updateMood = useMoodStore((state) => state.updateMood);
  const updateEnergy = useEnergyStore((state) => state.updateEnergy);
  const todayMood = useMoodStore((state) => state.getTodayMood());
  const todayEnergy = useEnergyStore((state) => state.getTodayEnergy());

  useEffect(() => {
    if (todayMood) setMood(todayMood.value);
    if (todayEnergy) setEnergy(todayEnergy.value);
  }, [todayMood, todayEnergy]);

  const handleSave = () => {
    const today = new Date().toISOString().split("T")[0];
    updateMood(today, mood, reflection || undefined);
    updateEnergy(today, energy);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const Slider = ({ 
    label, 
    value, 
    onChange, 
    icon: Icon, 
    color, 
    min = 0, 
    max = 100,
    unit = "%"
  }: {
    label: string;
    value: number;
    onChange: (value: number) => void;
    icon: any;
    color: string;
    min?: number;
    max?: number;
    unit?: string;
  }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-card border border-border rounded-xl p-6 shadow-md"
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <Icon className={`w-5 h-5 ${color}`} />
          <label className="text-sm font-semibold">{label}</label>
        </div>
        <span className="text-2xl font-bold">{value}{unit}</span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer accent-primary"
        style={{
          background: `linear-gradient(to right, hsl(var(--primary)) 0%, hsl(var(--primary)) ${((value - min) / (max - min)) * 100}%, hsl(var(--muted)) ${((value - min) / (max - min)) * 100}%, hsl(var(--muted)) 100%)`
        }}
      />
      <div className="flex justify-between text-xs text-muted-foreground mt-2">
        <span>{min}{unit}</span>
        <span>{max}{unit}</span>
      </div>
    </motion.div>
  );

  const getMoodLabel = (value: number) => {
    if (value >= 80) return "Excellent";
    if (value >= 60) return "Good";
    if (value >= 40) return "Okay";
    if (value >= 20) return "Low";
    return "Very Low";
  };

  const getEnergyLabel = (value: number) => {
    if (value >= 80) return "Very High";
    if (value >= 60) return "High";
    if (value >= 40) return "Moderate";
    if (value >= 20) return "Low";
    return "Very Low";
  };

  const getStressLabel = (value: number) => {
    if (value >= 80) return "Very High";
    if (value >= 60) return "High";
    if (value >= 40) return "Moderate";
    if (value >= 20) return "Low";
    return "Very Low";
  };

  return (
    <div className="space-y-8 pb-8">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
      >
        <div>
          <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-primary to-purple-500 bg-clip-text text-transparent">
            Daily Check-in
          </h1>
          <p className="text-muted-foreground">Take a moment to reflect on how you&apos;re feeling today</p>
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleSave}
          disabled={saved}
          className={`flex items-center gap-2 px-6 py-3 rounded-xl font-medium min-h-[44px] transition-all ${
            saved
              ? "bg-green-500 text-white"
              : "bg-primary text-primary-foreground hover:bg-primary/90"
          }`}
        >
          {saved ? (
            <>
              <CheckSquare className="w-5 h-5" />
              Saved!
            </>
          ) : (
            <>
              <Save className="w-5 h-5" />
              Save Check-in
            </>
          )}
        </motion.button>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Mood */}
        <Slider
          label={`Mood: ${getMoodLabel(mood)}`}
          value={mood}
          onChange={setMood}
          icon={Heart}
          color="text-pink-500"
        />

        {/* Energy */}
        <Slider
          label={`Energy: ${getEnergyLabel(energy)}`}
          value={energy}
          onChange={setEnergy}
          icon={Zap}
          color="text-yellow-500"
        />

        {/* Stress Level */}
        <Slider
          label={`Stress Level: ${getStressLabel(stress)}`}
          value={stress}
          onChange={setStress}
          icon={Activity}
          color="text-orange-500"
        />

        {/* Sleep Quality */}
        <Slider
          label="Sleep Quality (hours)"
          value={sleep}
          onChange={setSleep}
          icon={Moon}
          color="text-indigo-500"
          min={0}
          max={12}
          unit="h"
        />
      </div>

      {/* Reflection */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-card border border-border rounded-xl p-6 shadow-md"
      >
        <label className="block text-sm font-semibold mb-4 flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-primary" />
          Today&apos;s Reflection (Optional)
        </label>
        <textarea
          value={reflection}
          onChange={(e) => setReflection(e.target.value)}
          placeholder="How are you feeling today? What&apos;s on your mind? What are you grateful for?"
          className="w-full min-h-[120px] p-4 bg-muted/50 border border-border rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
        />
        <p className="text-xs text-muted-foreground mt-2">
          {reflection.length} characters
        </p>
      </motion.div>

      {/* Quick Insights */}
      {(mood < 40 || energy < 40 || stress > 70) && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-gradient-to-r from-orange-500/10 to-red-500/10 border border-orange-500/20 rounded-xl p-6"
        >
          <h3 className="font-semibold mb-2 flex items-center gap-2">
            <Activity className="w-5 h-5 text-orange-500" />
            Gentle Reminder
          </h3>
          <p className="text-sm text-muted-foreground leading-relaxed">
            {mood < 40 && "Your mood is lower today. Consider what might be contributing and what small steps could help."}
            {energy < 40 && "Your energy is low. Rest and recovery are important—be gentle with yourself."}
            {stress > 70 && "You&apos;re experiencing higher stress. Take time for deep breathing or a short break if possible."}
          </p>
        </motion.div>
      )}

      {/* Summary Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-gradient-to-br from-primary/10 to-purple-500/10 border border-primary/20 rounded-xl p-6"
      >
        <h3 className="font-semibold mb-4">Today&apos;s Summary</h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div>
            <p className="text-xs text-muted-foreground mb-1">Mood</p>
            <p className="text-2xl font-bold">{mood}%</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground mb-1">Energy</p>
            <p className="text-2xl font-bold">{energy}%</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground mb-1">Stress</p>
            <p className="text-2xl font-bold">{stress}%</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground mb-1">Sleep</p>
            <p className="text-2xl font-bold">{sleep}h</p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

