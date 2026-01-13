"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Moon, Bed, Activity, TrendingUp, Edit2, Save } from "lucide-react";
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts";

// Mock sleep data
const generateSleepData = () => {
  const data = [];
  const now = new Date();
  for (let i = 13; i >= 0; i--) {
    const date = new Date(now);
    date.setDate(date.getDate() - i);
    data.push({
      date: date.toLocaleDateString("en-US", { month: "short", day: "numeric" }),
      duration: Math.round((6 + Math.random() * 3) * 10) / 10,
      quality: Math.round(50 + Math.random() * 40),
      recovery: Math.round(60 + Math.random() * 30),
    });
  }
  return data;
};

const sleepData = generateSleepData();

export default function SleepRecoveryPage() {
  const [editing, setEditing] = useState(false);
  const [sleepDuration, setSleepDuration] = useState(7.5);
  const [sleepQuality, setSleepQuality] = useState(75);
  const [restEffectiveness, setRestEffectiveness] = useState(70);

  const avgDuration = sleepData.reduce((sum, d) => sum + d.duration, 0) / sleepData.length;
  const avgQuality = sleepData.reduce((sum, d) => sum + d.quality, 0) / sleepData.length;
  const avgRecovery = sleepData.reduce((sum, d) => sum + d.recovery, 0) / sleepData.length;

  const getQualityColor = (quality: number) => {
    if (quality >= 80) return "#10b981";
    if (quality >= 60) return "#3b82f6";
    if (quality >= 40) return "#f59e0b";
    return "#ef4444";
  };

  const getRecoveryLabel = (recovery: number) => {
    if (recovery >= 80) return "Excellent";
    if (recovery >= 60) return "Good";
    if (recovery >= 40) return "Fair";
    return "Poor";
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
            Sleep & Recovery
          </h1>
          <p className="text-muted-foreground">Track your sleep patterns and recovery quality</p>
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setEditing(!editing)}
          className="flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-xl font-medium min-h-[44px]"
        >
          {editing ? <Save className="w-5 h-5" /> : <Edit2 className="w-5 h-5" />}
          {editing ? "Save" : "Edit Today"}
        </motion.button>
      </motion.div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-card border border-border rounded-xl p-6 shadow-md"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-muted-foreground">Avg Sleep Duration</span>
            <Bed className="w-5 h-5 text-indigo-500" />
          </div>
          <div className="text-3xl font-bold">{avgDuration.toFixed(1)}h</div>
          <p className="text-xs text-muted-foreground mt-2">Last 14 days</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
          className="bg-card border border-border rounded-xl p-6 shadow-md"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-muted-foreground">Avg Sleep Quality</span>
            <Moon className="w-5 h-5 text-purple-500" />
          </div>
          <div className="text-3xl font-bold">{Math.round(avgQuality)}%</div>
          <p className="text-xs text-muted-foreground mt-2">Last 14 days</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="bg-card border border-border rounded-xl p-6 shadow-md"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-muted-foreground">Recovery Score</span>
            <Activity className="w-5 h-5 text-green-500" />
          </div>
          <div className="text-3xl font-bold">{Math.round(avgRecovery)}%</div>
          <p className="text-xs text-muted-foreground mt-2">{getRecoveryLabel(avgRecovery)}</p>
        </motion.div>
      </div>

      {/* Today's Entry */}
      {editing && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-card border border-border rounded-xl p-6 shadow-md"
        >
          <h3 className="text-lg font-semibold mb-4">Today&apos;s Sleep Entry</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Sleep Duration (hours)</label>
              <input
                type="number"
                min="0"
                max="12"
                step="0.5"
                value={sleepDuration}
                onChange={(e) => setSleepDuration(Number(e.target.value))}
                className="w-full p-3 bg-muted/50 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Sleep Quality (%)</label>
              <input
                type="range"
                min="0"
                max="100"
                value={sleepQuality}
                onChange={(e) => setSleepQuality(Number(e.target.value))}
                className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer accent-primary"
              />
              <div className="flex justify-between text-xs text-muted-foreground mt-1">
                <span>0%</span>
                <span className="font-semibold">{sleepQuality}%</span>
                <span>100%</span>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Rest Effectiveness (%)</label>
              <input
                type="range"
                min="0"
                max="100"
                value={restEffectiveness}
                onChange={(e) => setRestEffectiveness(Number(e.target.value))}
                className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer accent-primary"
              />
              <div className="flex justify-between text-xs text-muted-foreground mt-1">
                <span>0%</span>
                <span className="font-semibold">{restEffectiveness}%</span>
                <span>100%</span>
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-card border border-border rounded-xl p-6 shadow-md"
        >
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Bed className="w-5 h-5 text-indigo-500" />
            Sleep Duration (Last 14 Days)
          </h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={sleepData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="date" stroke="hsl(var(--muted-foreground))" />
              <YAxis stroke="hsl(var(--muted-foreground))" />
              <Tooltip
                contentStyle={{
                  backgroundColor: "hsl(var(--card))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "8px",
                }}
              />
              <Bar dataKey="duration" fill="#6366f1" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-card border border-border rounded-xl p-6 shadow-md"
        >
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-purple-500" />
            Sleep Quality Trend
          </h3>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={sleepData}>
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
                dataKey="quality"
                stroke="#a855f7"
                strokeWidth={2}
                dot={{ fill: "#a855f7", r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </motion.div>
      </div>

      {/* Recovery Insights */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="bg-gradient-to-br from-green-500/10 to-blue-500/10 border border-green-500/20 rounded-xl p-6"
      >
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <Activity className="w-5 h-5 text-green-500" />
          Recovery Insights
        </h3>
        <div className="space-y-3">
          <div className="flex items-start gap-3">
            <div className="w-2 h-2 rounded-full bg-green-500 mt-2 flex-shrink-0" />
            <div>
              <p className="text-sm font-medium mb-1">Sleep Duration</p>
              <p className="text-sm text-muted-foreground">
                {avgDuration >= 7 && avgDuration <= 9
                  ? "Your sleep duration is in the optimal range (7-9 hours). This supports good recovery and cognitive function."
                  : avgDuration < 7
                  ? "You&apos;re getting less than the recommended 7-9 hours. Consider going to bed 30 minutes earlier to improve recovery."
                  : "You&apos;re sleeping more than 9 hours regularly. While rest is important, excessive sleep might indicate underlying fatigue or health issues."}
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="w-2 h-2 rounded-full bg-blue-500 mt-2 flex-shrink-0" />
            <div>
              <p className="text-sm font-medium mb-1">Sleep Quality</p>
              <p className="text-sm text-muted-foreground">
                {avgQuality >= 70
                  ? "Your sleep quality is good. You&apos;re likely waking up feeling refreshed and ready for the day."
                  : avgQuality >= 50
                  ? "Your sleep quality is moderate. Consider improving your sleep environment: reduce screen time before bed, keep the room cool and dark."
                  : "Your sleep quality could be improved. Focus on creating a consistent bedtime routine and reducing stress before sleep."}
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="w-2 h-2 rounded-full bg-purple-500 mt-2 flex-shrink-0" />
            <div>
              <p className="text-sm font-medium mb-1">Recovery Pattern</p>
              <p className="text-sm text-muted-foreground">
                {avgRecovery >= 70
                  ? "Your recovery is strong. Your body is effectively restoring energy and processing the day&apos;s experiences."
                  : "Your recovery could be enhanced. Focus on consistent sleep schedules, stress management, and allowing time for rest during the day."}
              </p>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

