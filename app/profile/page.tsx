"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { mockData } from "@/lib/mock-data";
import { User, TrendingUp, TrendingDown, Calendar, Award, Brain, Heart, Target, Edit2, Save, X } from "lucide-react";
import { format, subDays } from "date-fns";
import { LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";

export default function ProfilePage() {
  const [timeframe, setTimeframe] = useState<"7d" | "14d" | "30d">("30d");
  const [editingGoal, setEditingGoal] = useState<string | null>(null);
  const [goals, setGoals] = useState([
    { id: "mood", label: "Mood", target: 75, current: 0, editable: true },
    { id: "energy", label: "Energy", target: 70, current: 0, editable: true },
    { id: "sleep", label: "Sleep Quality", target: 80, current: 0, editable: true },
  ]);

  // Get data based on timeframe
  const getDaysAgo = () => {
    return timeframe === "7d" ? 7 : timeframe === "14d" ? 14 : 30;
  };

  const daysAgo = getDaysAgo();
  const startDate = subDays(new Date(), daysAgo);
  
  const recentMood = mockData.mood.filter((d) => new Date(d.date) >= startDate);
  const recentEnergy = mockData.energy.filter((d) => new Date(d.date) >= startDate);
  const recentBurnout = mockData.burnout.filter((d) => new Date(d.date) >= startDate);

  // Calculate changes
  const moodStart = recentMood[0]?.value || 50;
  const moodEnd = recentMood[recentMood.length - 1]?.value || 50;
  const moodChange = moodEnd - moodStart;

  const energyStart = recentEnergy[0]?.value || 50;
  const energyEnd = recentEnergy[recentEnergy.length - 1]?.value || 50;
  const energyChange = energyEnd - energyStart;

  const burnoutStart = recentBurnout[0]?.risk || 50;
  const burnoutEnd = recentBurnout[recentBurnout.length - 1]?.risk || 50;
  const burnoutChange = burnoutStart - burnoutEnd; // Lower is better

  // Timeline data
  const timelineData = recentMood.map((d, i) => ({
    date: format(new Date(d.date), "MMM d"),
    mood: d.value,
    energy: recentEnergy[i]?.value || 50,
    burnout: recentBurnout[i]?.risk || 50,
  }));

  // What changed analysis
  const changes = [
    {
      title: "Mood Improvement",
      description: moodChange > 0
        ? `Your mood has improved by ${Math.abs(moodChange)} points over the past 30 days.`
        : moodChange < 0
        ? `Your mood has decreased by ${Math.abs(moodChange)} points. Consider what might be contributing.`
        : "Your mood has remained relatively stable.",
      positive: moodChange > 0,
      icon: Heart,
    },
    {
      title: "Energy Levels",
      description: energyChange > 0
        ? `Your energy has increased by ${Math.abs(energyChange)} points.`
        : energyChange < 0
        ? `Your energy has decreased by ${Math.abs(energyChange)} points. Rest and recovery may help.`
        : "Your energy levels have remained consistent.",
      positive: energyChange > 0,
      icon: TrendingUp,
    },
    {
      title: "Burnout Risk",
      description: burnoutChange > 0
        ? `Your burnout risk has decreased by ${Math.abs(burnoutChange)} points. Great progress!`
        : burnoutChange < 0
        ? `Your burnout risk has increased by ${Math.abs(burnoutChange)} points. Consider prioritizing rest.`
        : "Your burnout risk has remained stable.",
      positive: burnoutChange > 0,
      icon: Brain,
    },
  ];

  // Personal mind profile
  const mindProfile = {
    stability: Math.round(100 - Math.sqrt(recentMood.reduce((sum, d) => sum + Math.pow(d.value - (recentMood.reduce((a, b) => a + b.value, 0) / recentMood.length), 2), 0) / recentMood.length)),
    awareness: Math.round((mockData.reflections.length / 90) * 100),
    resilience: Math.round(100 - (burnoutEnd / 2)),
  };

  // Achievements
  const achievements = [
    { title: "Consistent Tracking", description: `${recentMood.length} days of mood tracking`, icon: Calendar },
    { title: "Self-Reflection", description: `${mockData.reflections.length} reflection entries`, icon: Brain },
    { title: "Task Completion", description: `${mockData.tasks.filter((t) => t.status === "completed").length} tasks completed`, icon: Award },
  ];

  // Update goals with current values
  const updatedGoals = goals.map(goal => {
    if (goal.id === "mood") {
      const current = recentMood.length > 0 
        ? Math.round(recentMood.reduce((sum, d) => sum + d.value, 0) / recentMood.length)
        : 0;
      return { ...goal, current };
    }
    if (goal.id === "energy") {
      const current = recentEnergy.length > 0
        ? Math.round(recentEnergy.reduce((sum, d) => sum + d.value, 0) / recentEnergy.length)
        : 0;
      return { ...goal, current };
    }
    return goal;
  });

  const handleGoalUpdate = (id: string, value: number) => {
    setGoals(prev => prev.map(g => g.id === id ? { ...g, target: value } : g));
    setEditingGoal(null);
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
            Profile & Progress
          </h1>
          <p className="text-muted-foreground">Your personal mental health overview and progress</p>
        </div>
        <div className="flex gap-2">
          {(["7d", "14d", "30d"] as const).map((tf) => (
            <motion.button
              key={tf}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setTimeframe(tf)}
              className={`px-4 py-2 rounded-lg text-sm font-medium min-h-[44px] transition-all ${
                timeframe === tf
                  ? "bg-primary text-primary-foreground shadow-md"
                  : "bg-muted text-muted-foreground hover:bg-accent"
              }`}
            >
              {tf === "7d" ? "7 Days" : tf === "14d" ? "14 Days" : "30 Days"}
            </motion.button>
          ))}
        </div>
      </motion.div>

      {/* User Overview */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-card border border-border rounded-lg p-6"
      >
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
            <User className="w-8 h-8 text-primary" />
          </div>
          <div>
            <h2 className="text-2xl font-semibold">Your Profile</h2>
            <p className="text-muted-foreground">Member since {format(subDays(new Date(), 365), "MMMM yyyy")}</p>
          </div>
        </div>
      </motion.div>

      {/* Goals */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-card border border-border rounded-xl p-6 shadow-md"
      >
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-semibold flex items-center gap-2">
            <Target className="w-6 h-6 text-primary" />
            Goals
          </h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {updatedGoals.map((goal) => {
            const progress = goal.target > 0 ? Math.min(100, Math.round((goal.current / goal.target) * 100)) : 0;
            const isEditing = editingGoal === goal.id;
            
            return (
              <div key={goal.id} className="bg-muted/50 border border-border rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">{goal.label}</span>
                  {goal.editable && !isEditing && (
                    <motion.button
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setEditingGoal(goal.id)}
                      className="p-1 hover:bg-accent rounded"
                    >
                      <Edit2 className="w-4 h-4 text-muted-foreground" />
                    </motion.button>
                  )}
                </div>
                {isEditing ? (
                  <div className="space-y-2">
                    <input
                      type="number"
                      min="0"
                      max="100"
                      value={goal.target}
                      onChange={(e) => setGoals(prev => prev.map(g => g.id === goal.id ? { ...g, target: Number(e.target.value) } : g))}
                      className="w-full p-2 bg-background border border-border rounded text-sm"
                      autoFocus
                    />
                    <div className="flex gap-2">
                      <motion.button
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handleGoalUpdate(goal.id, goal.target)}
                        className="flex-1 px-3 py-1 bg-primary text-primary-foreground rounded text-sm font-medium"
                      >
                        <Save className="w-4 h-4 inline mr-1" />
                        Save
                      </motion.button>
                      <motion.button
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setEditingGoal(null)}
                        className="px-3 py-1 bg-muted text-muted-foreground rounded text-sm"
                      >
                        <X className="w-4 h-4" />
                      </motion.button>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="flex items-baseline gap-2 mb-2">
                      <span className="text-2xl font-bold">{goal.current}%</span>
                      <span className="text-sm text-muted-foreground">/ {goal.target}%</span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${progress}%` }}
                        transition={{ duration: 0.5 }}
                        className={`h-2 rounded-full ${
                          progress >= 100 ? "bg-green-500" : progress >= 75 ? "bg-primary" : progress >= 50 ? "bg-yellow-500" : "bg-orange-500"
                        }`}
                      />
                    </div>
                    <p className="text-xs text-muted-foreground mt-2">
                      {progress >= 100 ? "Goal achieved! 🎉" : `${goal.target - goal.current}% to go`}
                    </p>
                  </>
                )}
              </div>
            );
          })}
        </div>
      </motion.div>

      {/* Progress Timeline */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <h2 className="text-2xl font-semibold mb-4">{daysAgo}-Day Mental Health Progress</h2>
        <div className="bg-card border border-border rounded-xl p-6 shadow-md">
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={timelineData}>
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
              <Legend />
              <Line type="monotone" dataKey="mood" stroke="#3b82f6" strokeWidth={2} dot={{ r: 3 }} />
              <Line type="monotone" dataKey="energy" stroke="#10b981" strokeWidth={2} dot={{ r: 3 }} />
              <Line type="monotone" dataKey="burnout" stroke="#f59e0b" strokeWidth={2} dot={{ r: 3 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </motion.div>

      {/* What Changed */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <h2 className="text-2xl font-semibold mb-4">What Changed</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {changes.map((change, i) => {
            const Icon = change.icon;
            const changeValue = change.title.includes("Mood") ? moodChange : change.title.includes("Energy") ? energyChange : burnoutChange;
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.4 + i * 0.1 }}
                className={`bg-card border rounded-xl p-6 shadow-md ${
                  change.positive ? "border-green-500/50 bg-green-500/5" : "border-border"
                }`}
              >
                <div className="flex items-center justify-between mb-3">
                  <Icon className={`w-6 h-6 ${change.positive ? "text-green-500" : "text-primary"}`} />
                  {changeValue !== 0 && (
                    <div className={`flex items-center gap-1 text-sm ${
                      change.positive ? "text-green-500" : "text-orange-500"
                    }`}>
                      {change.positive ? (
                        <TrendingUp className="w-4 h-4" />
                      ) : (
                        <TrendingDown className="w-4 h-4" />
                      )}
                      <span>{Math.abs(changeValue)}</span>
                    </div>
                  )}
                </div>
                <h4 className="font-semibold mb-2">{change.title}</h4>
                <p className="text-sm text-muted-foreground leading-relaxed">{change.description}</p>
              </motion.div>
            );
          })}
        </div>
      </motion.div>

      {/* Personal Mind Profile */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-card border border-border rounded-xl p-6 shadow-md"
      >
        <h2 className="text-2xl font-semibold mb-4">Personal Mind Profile</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="font-medium">Stability</span>
              <span className="text-lg font-bold">{mindProfile.stability}%</span>
            </div>
            <div className="w-full bg-muted rounded-full h-2">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${mindProfile.stability}%` }}
                transition={{ duration: 1, delay: 0.4 }}
                className="bg-primary h-2 rounded-full"
              />
            </div>
            <p className="text-xs text-muted-foreground mt-2">Mood consistency over time</p>
          </div>
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="font-medium">Awareness</span>
              <span className="text-lg font-bold">{mindProfile.awareness}%</span>
            </div>
            <div className="w-full bg-muted rounded-full h-2">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${mindProfile.awareness}%` }}
                transition={{ duration: 1, delay: 0.5 }}
                className="bg-primary h-2 rounded-full"
              />
            </div>
            <p className="text-xs text-muted-foreground mt-2">Self-reflection frequency</p>
          </div>
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="font-medium">Resilience</span>
              <span className="text-lg font-bold">{mindProfile.resilience}%</span>
            </div>
            <div className="w-full bg-muted rounded-full h-2">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${mindProfile.resilience}%` }}
                transition={{ duration: 1, delay: 0.6 }}
                className="bg-primary h-2 rounded-full"
              />
            </div>
            <p className="text-xs text-muted-foreground mt-2">Stress management capacity</p>
          </div>
        </div>
      </motion.div>

      {/* Achievements */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
          <Award className="w-6 h-6 text-primary" />
          Gentle Achievements
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {achievements.map((achievement, i) => {
            const Icon = achievement.icon;
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.6 + i * 0.1 }}
                whileHover={{ scale: 1.02 }}
                className="bg-gradient-to-br from-card to-card/50 border border-border rounded-xl p-6 shadow-md"
              >
                <Icon className="w-6 h-6 text-primary mb-3" />
                <h4 className="font-semibold mb-1">{achievement.title}</h4>
                <p className="text-sm text-muted-foreground">{achievement.description}</p>
              </motion.div>
            );
          })}
        </div>
      </motion.div>
    </div>
  );
}

