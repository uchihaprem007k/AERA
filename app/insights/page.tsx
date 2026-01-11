"use client";

import { motion } from "framer-motion";
import { mockData } from "@/lib/mock-data";
import { Lightbulb, TrendingUp, Brain, Activity, Heart, Zap } from "lucide-react";

export default function InsightsPage() {
  // Generate insights based on data
  const recentMood = mockData.mood.slice(-30);
  const moodVariance = Math.round(
    Math.sqrt(
      recentMood.reduce((sum, d) => {
        const mean = recentMood.reduce((a, b) => a + b.value, 0) / recentMood.length;
        return sum + Math.pow(d.value - mean, 2);
      }, 0) / recentMood.length
    )
  );

  const insights = [
    {
      title: "Mood Stability",
      description: `Your mood has a variance of ${moodVariance} points over the past month, indicating ${moodVariance < 15 ? "high" : moodVariance < 25 ? "moderate" : "variable"} stability.`,
      icon: Brain,
      category: "Self-Awareness",
      actionable: moodVariance > 25
        ? "Consider tracking what influences your mood swings to identify patterns."
        : "Your stable mood suggests good emotional regulation.",
    },
    {
      title: "Energy Patterns",
      description: "You tend to have higher energy levels in the morning hours. This is a natural circadian rhythm pattern.",
      icon: Zap,
      category: "Energy",
      actionable: "Schedule your most important or creative work during your peak energy hours for better results.",
    },
    {
      title: "Task Completion",
      description: `You've completed ${mockData.tasks.filter((t) => t.status === "completed").length} tasks. Your completion rate shows consistent progress.`,
      icon: Activity,
      category: "Productivity",
      actionable: "Break larger tasks into smaller steps to maintain momentum and reduce overwhelm.",
    },
    {
      title: "Burnout Awareness",
      description: `Your current burnout risk is ${mockData.burnout[mockData.burnout.length - 1].risk}%. ${mockData.burnout[mockData.burnout.length - 1].risk < 50 ? "You're managing stress well." : "Consider prioritizing rest and recovery."}`,
      icon: Heart,
      category: "Wellbeing",
      actionable: mockData.burnout[mockData.burnout.length - 1].risk > 50
        ? "Set clear boundaries and schedule regular breaks to prevent burnout."
        : "Continue maintaining balance between work and rest.",
    },
    {
      title: "Reflection Practice",
      description: `You've made ${mockData.reflections.length} reflection entries. Regular self-reflection helps build self-awareness.`,
      icon: Brain,
      category: "Self-Awareness",
      actionable: "Consider reflecting at the end of each day to track patterns and growth.",
    },
    {
      title: "Focus Sessions",
      description: `You've completed ${mockData.focusSessions.length} focus sessions with an average duration of ${Math.round(mockData.focusSessions.reduce((sum, s) => sum + s.duration, 0) / mockData.focusSessions.length)} minutes.`,
      icon: TrendingUp,
      category: "Productivity",
      actionable: "Maintain consistent focus sessions to build deep work habits.",
    },
  ];

  return (
    <div className="space-y-8">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-4xl font-bold mb-2">Insights</h1>
        <p className="text-muted-foreground">AI-powered insights about your mental health patterns</p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {insights.map((insight, i) => {
          const Icon = insight.icon;
          return (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              whileHover={{ scale: 1.02, y: -4 }}
              className="bg-card border border-border rounded-lg p-6 cursor-pointer"
            >
              <div className="flex items-start justify-between mb-4">
                <Icon className="w-6 h-6 text-primary" />
                <span className="text-xs bg-muted px-2 py-1 rounded">{insight.category}</span>
              </div>
              <h3 className="text-lg font-semibold mb-2">{insight.title}</h3>
              <p className="text-sm text-muted-foreground mb-4">{insight.description}</p>
              <div className="pt-4 border-t border-border">
                <div className="flex items-start gap-2">
                  <Lightbulb className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                  <p className="text-xs text-muted-foreground">{insight.actionable}</p>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Summary */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="bg-card border border-border rounded-lg p-6"
      >
        <h2 className="text-xl font-semibold mb-4">Overall Summary</h2>
        <p className="text-muted-foreground">
          Based on your data, you're showing good awareness of your mental health patterns. Continue tracking
          your mood, energy, and tasks to build deeper insights over time. Remember that understanding yourself
          is a journey, not a destination—be patient and kind with yourself as you learn.
        </p>
      </motion.div>
    </div>
  );
}

