"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Activity, AlertCircle, CheckCircle2, Edit2, Save, TrendingUp, Heart } from "lucide-react";
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

// Mock stress data
const generateStressData = () => {
  const data = [];
  const now = new Date();
  for (let i = 29; i >= 0; i--) {
    const date = new Date(now);
    date.setDate(date.getDate() - i);
    data.push({
      date: date.toLocaleDateString("en-US", { month: "short", day: "numeric" }),
      stress: Math.round(30 + Math.random() * 50),
      pressure: Math.round(25 + Math.random() * 45),
    });
  }
  return data;
};

const stressData = generateStressData();

const initialPressureSources = [
  { id: "work", label: "Work deadlines", checked: false },
  { id: "financial", label: "Financial concerns", checked: false },
  { id: "relationships", label: "Relationship issues", checked: false },
  { id: "health", label: "Health concerns", checked: false },
  { id: "family", label: "Family responsibilities", checked: false },
  { id: "social", label: "Social expectations", checked: false },
  { id: "personal", label: "Personal goals", checked: false },
  { id: "other", label: "Other", checked: false },
];

const copingStrategies = [
  "Take 5 deep breaths",
  "Go for a short walk",
  "Listen to calming music",
  "Write down your thoughts",
  "Talk to someone you trust",
  "Practice mindfulness",
  "Do a quick stretch",
  "Take a break from screens",
];

export default function StressPressurePage() {
  const [editing, setEditing] = useState(false);
  const [stressLevel, setStressLevel] = useState(50);
  const [pressureSources, setPressureSources] = useState(initialPressureSources);
  const [notes, setNotes] = useState("");

  const avgStress = stressData.reduce((sum, d) => sum + d.stress, 0) / stressData.length;
  const avgPressure = stressData.reduce((sum, d) => sum + d.pressure, 0) / stressData.length;

  const getStressLabel = (level: number) => {
    if (level >= 80) return "Very High";
    if (level >= 60) return "High";
    if (level >= 40) return "Moderate";
    if (level >= 20) return "Low";
    return "Very Low";
  };

  const getStressColor = (level: number) => {
    if (level >= 80) return "text-red-500";
    if (level >= 60) return "text-orange-500";
    if (level >= 40) return "text-yellow-500";
    return "text-green-500";
  };

  const toggleSource = (id: string) => {
    setPressureSources((prev) =>
      prev.map((source) => (source.id === id ? { ...source, checked: !source.checked } : source))
    );
  };

  const selectedSources = pressureSources.filter((s) => s.checked);

  return (
    <div className="space-y-8 pb-8">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
      >
        <div>
          <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-primary to-purple-500 bg-clip-text text-transparent">
            Stress & Pressure
          </h1>
          <p className="text-muted-foreground">Monitor and manage your stress levels</p>
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setEditing(!editing)}
          className="flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-xl font-medium min-h-[44px]"
        >
          {editing ? <Save className="w-5 h-5" /> : <Edit2 className="w-5 h-5" />}
          {editing ? "Save" : "Log Entry"}
        </motion.button>
      </motion.div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-card border border-border rounded-xl p-6 shadow-md"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-muted-foreground">Average Stress Level</span>
            <Activity className="w-5 h-5 text-orange-500" />
          </div>
          <div className={`text-3xl font-bold ${getStressColor(avgStress)}`}>
            {Math.round(avgStress)}%
          </div>
          <p className="text-xs text-muted-foreground mt-2">{getStressLabel(avgStress)} - Last 30 days</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
          className="bg-card border border-border rounded-xl p-6 shadow-md"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-muted-foreground">Average Pressure</span>
            <AlertCircle className="w-5 h-5 text-red-500" />
          </div>
          <div className="text-3xl font-bold text-red-500">{Math.round(avgPressure)}%</div>
          <p className="text-xs text-muted-foreground mt-2">Last 30 days</p>
        </motion.div>
      </div>

      {/* Today's Entry */}
      {editing && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-card border border-border rounded-xl p-6 shadow-md space-y-6"
        >
          <h3 className="text-lg font-semibold">Today&apos;s Stress Entry</h3>

          {/* Stress Level */}
          <div>
            <label className="block text-sm font-medium mb-4">
              Current Stress Level: <span className={getStressColor(stressLevel)}>{stressLevel}%</span> ({getStressLabel(stressLevel)})
            </label>
            <input
              type="range"
              min="0"
              max="100"
              value={stressLevel}
              onChange={(e) => setStressLevel(Number(e.target.value))}
              className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer accent-primary"
            />
            <div className="flex justify-between text-xs text-muted-foreground mt-2">
              <span>Very Low</span>
              <span>Very High</span>
            </div>
          </div>

          {/* Pressure Sources */}
          <div>
            <label className="block text-sm font-medium mb-3">Pressure Sources (Select all that apply)</label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {pressureSources.map((source: typeof initialPressureSources[0]) => (
                <motion.button
                  key={source.id}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => toggleSource(source.id)}
                  className={`flex items-center gap-2 p-3 rounded-lg border-2 min-h-[44px] transition-all ${
                    source.checked
                      ? "border-primary bg-primary/10 text-primary"
                      : "border-border bg-muted/50 text-muted-foreground hover:border-primary/50"
                  }`}
                >
                  {source.checked && <CheckCircle2 className="w-4 h-4" />}
                  <span className="text-sm font-medium text-left">{source.label}</span>
                </motion.button>
              ))}
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="block text-sm font-medium mb-2">Notes (Optional)</label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="What&apos;s contributing to your stress? How are you feeling?"
              className="w-full min-h-[100px] p-4 bg-muted/50 border border-border rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
        </motion.div>
      )}

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-card border border-border rounded-xl p-6 shadow-md"
        >
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-orange-500" />
            Stress Trend (Last 30 Days)
          </h3>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={stressData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="date" stroke="hsl(var(--muted-foreground))" />
              <YAxis domain={[0, 100]} stroke="hsl(var(--muted-foreground))" />
              <Tooltip
                contentStyle={{
                  backgroundColor: "hsl(var(--card))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "8px",
                }}
              />
              <Line
                type="monotone"
                dataKey="stress"
                stroke="#f97316"
                strokeWidth={2}
                dot={{ fill: "#f97316", r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-card border border-border rounded-xl p-6 shadow-md"
        >
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Activity className="w-5 h-5 text-red-500" />
            Pressure vs Stress
          </h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={stressData.slice(-14)}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="date" stroke="hsl(var(--muted-foreground))" />
              <YAxis domain={[0, 100]} stroke="hsl(var(--muted-foreground))" />
              <Tooltip
                contentStyle={{
                  backgroundColor: "hsl(var(--card))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "8px",
                }}
              />
              <Bar dataKey="stress" fill="#f97316" radius={[8, 8, 0, 0]} />
              <Bar dataKey="pressure" fill="#ef4444" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>
      </div>

      {/* Coping Suggestions */}
      {stressLevel > 60 && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-gradient-to-r from-orange-500/10 to-red-500/10 border border-orange-500/20 rounded-xl p-6"
        >
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Heart className="w-5 h-5 text-orange-500" />
            Calm Coping Suggestions
          </h3>
          <p className="text-sm text-muted-foreground mb-4">
            Your stress level is elevated. Here are some gentle strategies to help you find calm:
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {copingStrategies.map((strategy, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="bg-card/50 border border-border rounded-lg p-3 text-sm"
              >
                {strategy}
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Insights */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-gradient-to-br from-blue-500/10 to-purple-500/10 border border-blue-500/20 rounded-xl p-6"
      >
        <h3 className="text-lg font-semibold mb-4">Stress Insights</h3>
        <div className="space-y-3">
          <div className="flex items-start gap-3">
            <div className="w-2 h-2 rounded-full bg-blue-500 mt-2 flex-shrink-0" />
            <div>
              <p className="text-sm font-medium mb-1">Understanding Your Stress</p>
              <p className="text-sm text-muted-foreground">
                {avgStress >= 70
                  ? "Your stress levels are consistently high. This is a signal that your system needs more support. Consider reducing commitments, increasing rest, and seeking support from others."
                  : avgStress >= 50
                  ? "You&apos;re experiencing moderate stress, which is common in daily life. Focus on regular stress management practices to prevent it from escalating."
                  : "Your stress levels are manageable. Continue practicing stress management to maintain this balance."}
              </p>
            </div>
          </div>
          {selectedSources.length > 0 && (
            <div className="flex items-start gap-3">
              <div className="w-2 h-2 rounded-full bg-purple-500 mt-2 flex-shrink-0" />
              <div>
                <p className="text-sm font-medium mb-1">Pressure Sources</p>
                <p className="text-sm text-muted-foreground">
                  You&apos;ve identified {selectedSources.length} pressure source{selectedSources.length > 1 ? "s" : ""}. 
                  Recognizing what&apos;s contributing to your stress is the first step toward managing it effectively.
                </p>
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}

