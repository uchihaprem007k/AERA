"use client";

import { motion } from "framer-motion";
import { mockData } from "@/lib/mock-data";
import { User, TrendingUp, Calendar, Award, Brain, Heart } from "lucide-react";
import { format, subDays } from "date-fns";
import { LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

export default function ProfilePage() {
  // 30-day progress data
  const thirtyDaysAgo = subDays(new Date(), 30);
  const recentMood = mockData.mood.filter((d) => new Date(d.date) >= thirtyDaysAgo);
  const recentEnergy = mockData.energy.filter((d) => new Date(d.date) >= thirtyDaysAgo);
  const recentBurnout = mockData.burnout.filter((d) => new Date(d.date) >= thirtyDaysAgo);

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

  return (
    <div className="space-y-8">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-4xl font-bold mb-2">Profile</h1>
        <p className="text-muted-foreground">Your personal mental health overview and progress</p>
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

      {/* 30-Day Progress */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <h2 className="text-2xl font-semibold mb-4">30-Day Mental Health Progress</h2>
        <div className="bg-card border border-border rounded-lg p-6">
          <ResponsiveContainer width="100%" height={400}>
            <AreaChart data={timelineData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis domain={[0, 100]} />
              <Tooltip />
              <Area type="monotone" dataKey="mood" stackId="1" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.6} />
              <Area type="monotone" dataKey="energy" stackId="1" stroke="#10b981" fill="#10b981" fillOpacity={0.6} />
              <Area type="monotone" dataKey="burnout" stackId="1" stroke="#f59e0b" fill="#f59e0b" fillOpacity={0.6} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </motion.div>

      {/* What Changed */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <h2 className="text-2xl font-semibold mb-4">What Changed</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {changes.map((change, i) => {
            const Icon = change.icon;
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3 + i * 0.1 }}
                className={`bg-card border rounded-lg p-6 ${
                  change.positive ? "border-green-500/50" : "border-border"
                }`}
              >
                <Icon className={`w-6 h-6 mb-3 ${change.positive ? "text-green-500" : "text-primary"}`} />
                <h4 className="font-semibold mb-2">{change.title}</h4>
                <p className="text-sm text-muted-foreground">{change.description}</p>
              </motion.div>
            );
          })}
        </div>
      </motion.div>

      {/* Personal Mind Profile */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-card border border-border rounded-lg p-6"
      >
        <h2 className="text-2xl font-semibold mb-4">Personal Mind Profile</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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
        transition={{ delay: 0.4 }}
      >
        <h2 className="text-2xl font-semibold mb-4">Gentle Achievements</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {achievements.map((achievement, i) => {
            const Icon = achievement.icon;
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.5 + i * 0.1 }}
                whileHover={{ scale: 1.02 }}
                className="bg-card border border-border rounded-lg p-6"
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

