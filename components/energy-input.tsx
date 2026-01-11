"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Battery, Zap } from "lucide-react";

interface EnergyInputProps {
  value: number;
  onChange: (value: number) => void;
  onNoteChange?: (note: string) => void;
  note?: string;
  peakTime?: string;
  onPeakTimeChange?: (time: string) => void;
}

export function EnergyInput({
  value,
  onChange,
  onNoteChange,
  note = "",
  peakTime = "09:00",
  onPeakTimeChange,
}: EnergyInputProps) {
  const [localNote, setLocalNote] = useState(note);
  const [localPeakTime, setLocalPeakTime] = useState(peakTime);

  const getEnergyLevel = (energy: number) => {
    if (energy >= 70) return { label: "High", color: "text-green-500" };
    if (energy >= 40) return { label: "Moderate", color: "text-yellow-500" };
    return { label: "Low", color: "text-red-500" };
  };

  const energyLevel = getEnergyLevel(value);

  const handleNoteChange = (newNote: string) => {
    setLocalNote(newNote);
    onNoteChange?.(newNote);
  };

  const handlePeakTimeChange = (time: string) => {
    setLocalPeakTime(time);
    onPeakTimeChange?.(time);
  };

  return (
    <div className="space-y-6">
      {/* Energy Slider */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <label className="text-sm font-medium">What's your energy level?</label>
          <div className="flex items-center gap-2">
            <Battery className="w-6 h-6" />
            <span className={`text-2xl font-bold ${energyLevel.color}`}>{value}%</span>
            <span className={`text-sm ${energyLevel.color}`}>({energyLevel.label})</span>
          </div>
        </div>
        <input
          type="range"
          min="0"
          max="100"
          value={value}
          onChange={(e) => onChange(parseInt(e.target.value))}
          className="w-full h-3 bg-muted rounded-lg appearance-none cursor-pointer accent-primary"
          style={{
            background: `linear-gradient(to right, hsl(var(--primary)) 0%, hsl(var(--primary)) ${value}%, hsl(var(--muted)) ${value}%, hsl(var(--muted)) 100%)`,
          }}
        />
        <div className="flex justify-between text-xs text-muted-foreground mt-2">
          <span>Exhausted</span>
          <span>Moderate</span>
          <span>Energized</span>
        </div>
      </div>

      {/* Peak Time */}
      {onPeakTimeChange && (
        <div>
          <label className="text-sm font-medium mb-2 block flex items-center gap-2">
            <Zap className="w-4 h-4" />
            When did you feel most energized today?
          </label>
          <input
            type="time"
            value={localPeakTime}
            onChange={(e) => handlePeakTimeChange(e.target.value)}
            className="w-full px-4 py-2 bg-background border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
      )}

      {/* Note */}
      <div>
        <label className="text-sm font-medium mb-2 block">What affected your energy today? (Optional)</label>
        <textarea
          value={localNote}
          onChange={(e) => handleNoteChange(e.target.value)}
          placeholder="Sleep quality, stress, activities, etc."
          className="w-full px-4 py-3 bg-background border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary resize-none"
          rows={3}
        />
      </div>
    </div>
  );
}

