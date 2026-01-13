"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { mockData } from "@/lib/mock-data";
import { useMoodStore } from "@/lib/mood-store";
import { CountUp } from "@/components/count-up";
import { MoodInput } from "@/components/mood-input";
import { EditModal } from "@/components/edit-modal";
import { Brain, TrendingUp, Calendar, BarChart3, Plus, Edit2 } from "lucide-react";
import { LineChart, Line, AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

export default function SelfAwarenessPage() {
  const [editingMood, setEditingMood] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  
  const moods = useMoodStore((state) => state.moods);
  const updateMood = useMoodStore((state) => state.updateMood);
  const initializeMoods = useMoodStore((state) => state.initializeMoods);
  const getMood = useMoodStore((state) => state.getMood);
  const getTodayMood = useMoodStore((state) => state.getTodayMood);
  
  useEffect(() => {
    initializeMoods();
  }, [initializeMoods]);
  
  const moodData = moods.length > 0 
    ? moods.map(m => ({ date: m.date, value: m.value, note: m.note }))
    : mockData.mood.slice(-90);
  const recentMood = moodData.slice(-7);
  const avgMood = recentMood.length > 0 
    ? Math.round(recentMood.reduce((sum, d) => sum + d.value, 0) / recentMood.length)
    : (getTodayMood()?.value || 65);
  const todayMood = getTodayMood();

  // Calculate stability index (lower variance = higher stability)
  const moodValues = recentMood.map((d) => d.value);
  const mean = moodValues.reduce((a, b) => a + b, 0) / moodValues.length;
  const variance = moodValues.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / moodValues.length;
  const stabilityIndex = Math.max(0, Math.min(100, Math.round(100 - Math.sqrt(variance))));

  // Emotional patterns
  const patterns = [
    { label: "Morning mood", value: 72, description: "You tend to feel better in mornings" },
    { label: "Weekend boost", value: 15, description: "Your mood improves on weekends" },
    { label: "Stress response", value: 68, description: "Moderate response to stressors" },
  ];

  // Timeline data
  const timelineData = moodData.slice(-30).map((d) => ({
    date: new Date(d.date).toLocaleDateString("en-US", { month: "short", day: "numeric" }),
    dateKey: d.date,
    mood: d.value,
    note: d.note,
  }));

  const handleMoodUpdate = (date: string, value: number, note?: string, emotions?: string[]) => {
    updateMood(date, value, note, emotions);
    setEditingMood(null);
    setSelectedDate(null);
  };

  return (
    <div className="space-y-6 sm:space-y-8 pb-8">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
      >
        <div>
          <h1 className="text-3xl sm:text-4xl font-bold mb-2 bg-gradient-to-r from-primary to-purple-500 bg-clip-text text-transparent">
            Self-Awareness
          </h1>
          <p className="text-muted-foreground text-sm sm:text-base">Understanding your emotional patterns and inner landscape</p>
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => {
            setSelectedDate(new Date().toISOString().split("T")[0]);
            setEditingMood("today");
          }}
          className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-xl font-medium shadow-lg shadow-primary/20 hover:shadow-xl transition-all min-h-[44px] w-full sm:w-auto"
        >
          <Plus className="w-4 h-4" />
          <span className="sm:inline">Log Today&apos;s Mood</span>
        </motion.button>
      </motion.div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          whileHover={{ scale: 1.02, y: -2 }}
          className="bg-gradient-to-br from-card to-card/50 border border-border rounded-xl p-6 shadow-lg"
        >
          <div className="flex items-center gap-3 mb-4">
            <Brain className="w-6 h-6 text-primary" />
            <h3 className="text-lg font-semibold">Current Mood</h3>
          </div>
          <CountUp value={avgMood} className="text-4xl font-bold mb-2" />
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
            <TrendingUp className="w-6 h-6 text-primary" />
            <h3 className="text-lg font-semibold">Stability Index</h3>
          </div>
          <CountUp value={stabilityIndex} className="text-4xl font-bold mb-2" />
          <p className="text-sm text-muted-foreground">Higher = more stable mood</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ delay: 0.2 }}
          whileHover={{ scale: 1.02, y: -2 }}
          className="bg-gradient-to-br from-card to-card/50 border border-border rounded-xl p-6 shadow-lg"
        >
          <div className="flex items-center gap-3 mb-4">
            <Calendar className="w-6 h-6 text-primary" />
            <h3 className="text-lg font-semibold">Days Tracked</h3>
          </div>
          <CountUp value={moodData.length} className="text-4xl font-bold mb-2" />
          <p className="text-sm text-muted-foreground">Last 90 days</p>
        </motion.div>
      </div>

      {/* Mood Timeline */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-gradient-to-br from-card to-card/50 border border-border rounded-xl p-6 shadow-lg"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Mood Timeline (30 days)</h3>
            <span className="text-xs text-muted-foreground">Click points to edit</span>
          </div>
          <ResponsiveContainer width="100%" height={250}>
            <AreaChart data={timelineData}>
              <defs>
                <linearGradient id="moodGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis domain={[0, 100]} />
              <Tooltip
                cursor={{ stroke: "#3b82f6", strokeWidth: 2 }}
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const data = payload[0].payload;
                    return (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        onClick={() => {
                          setSelectedDate(data.dateKey);
                          setEditingMood(data.dateKey);
                        }}
                        className="bg-card border border-border rounded-lg p-3 shadow-lg cursor-pointer hover:bg-muted transition-colors"
                      >
                        <p className="font-semibold">{data.date}</p>
                        <p className="text-primary">Mood: {data.mood}</p>
                        <p className="text-xs text-muted-foreground mt-1">Click to edit</p>
                      </motion.div>
                    );
                  }
                  return null;
                }}
              />
              <Area type="monotone" dataKey="mood" stroke="#3b82f6" fill="url(#moodGradient)" />
            </AreaChart>
          </ResponsiveContainer>
        </motion.div>

      {/* Emotional Patterns */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <h2 className="text-2xl font-semibold mb-4">Emotional Patterns</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {patterns.map((pattern, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.5 + i * 0.1 }}
              whileHover={{ scale: 1.02, y: -2 }}
              className="bg-gradient-to-br from-card to-card/50 border border-border rounded-xl p-6 shadow-md hover:shadow-lg transition-shadow"
            >
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-semibold">{pattern.label}</h4>
                <BarChart3 className="w-5 h-5 text-primary" />
              </div>
              <div className="w-full bg-muted rounded-full h-2 mb-2">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${pattern.value}%` }}
                  transition={{ duration: 1, delay: 0.6 + i * 0.1 }}
                  className="bg-primary h-2 rounded-full"
                />
              </div>
              <p className="text-sm text-muted-foreground">{pattern.description}</p>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Recent Reflections */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <h2 className="text-2xl font-semibold mb-4">Recent Reflections</h2>
        <div className="space-y-4">
          {mockData.reflections.slice(-5).map((reflection, i) => (
            <motion.div
              key={reflection.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6 + i * 0.1 }}
              whileHover={{ scale: 1.01, y: -2 }}
              className="bg-gradient-to-br from-card to-card/50 border border-border rounded-xl p-6 shadow-md hover:shadow-lg transition-shadow"
            >
              <div className="flex items-start justify-between mb-2">
                <h4 className="font-semibold">{reflection.prompt}</h4>
                <span className="text-sm text-muted-foreground">{reflection.date}</span>
              </div>
              <p className="text-muted-foreground">{reflection.response}</p>
            </motion.div>
          ))}
        </div>
      </motion.div>
      
      {/* Mood Edit Modal */}
      <EditModal
        isOpen={editingMood !== null}
        onClose={() => {
          setEditingMood(null);
          setSelectedDate(null);
        }}
        title={selectedDate === new Date().toISOString().split("T")[0] ? "Log Today&apos;s Mood" : `Edit Mood for ${selectedDate ? new Date(selectedDate).toLocaleDateString() : ""}`}
      >
        <MoodInput
          value={selectedDate ? (getMood(selectedDate)?.value || avgMood) : (todayMood?.value || avgMood)}
          onChange={(value) => {
            const date = selectedDate || new Date().toISOString().split("T")[0];
            const existing = getMood(date);
            handleMoodUpdate(date, value, existing?.note, existing?.emotions);
          }}
          onNoteChange={(note) => {
            const date = selectedDate || new Date().toISOString().split("T")[0];
            const existing = getMood(date);
            handleMoodUpdate(date, existing?.value || avgMood, note, existing?.emotions);
          }}
          note={selectedDate ? (getMood(selectedDate)?.note || "") : (todayMood?.note || "")}
          date={selectedDate || undefined}
        />
        <motion.button
          type="button"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            const date = selectedDate || new Date().toISOString().split("T")[0];
            const existing = getMood(date);
            handleMoodUpdate(
              date,
              existing?.value || avgMood,
              existing?.note,
              existing?.emotions
            );
            // Close modal after save
            setEditingMood(null);
            setSelectedDate(null);
          }}
          className="w-full mt-6 px-4 py-3 bg-primary text-primary-foreground rounded-xl font-medium"
        >
          Save
        </motion.button>
      </EditModal>
    </div>
  );
}

