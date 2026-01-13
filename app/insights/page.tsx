"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { mockData } from "@/lib/mock-data";
import { useMoodStore } from "@/lib/mood-store";
import { useEnergyStore } from "@/lib/energy-store";
import { useTaskStore } from "@/lib/task-store";
import { 
  Lightbulb, 
  TrendingUp, 
  TrendingDown, 
  Activity, 
  Brain, 
  Heart, 
  Zap, 
  Calendar,
  ChevronDown,
  ChevronUp,
  Sparkles,
  Target,
  BarChart3
} from "lucide-react";
import { LineChart, Line, AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";

export default function InsightsPage() {
  const [expandedInsight, setExpandedInsight] = useState<string | null>(null);
  const [timeframe, setTimeframe] = useState<"7d" | "30d" | "90d">("30d");
  
  const moods = useMoodStore((state) => state.moods);
  const energies = useEnergyStore((state) => state.energies);
  const tasks = useTaskStore((state) => state.tasks);
  const initializeMoods = useMoodStore((state) => state.initializeMoods);
  const initializeEnergies = useEnergyStore((state) => state.initializeEnergies);

  useEffect(() => {
    initializeMoods();
    initializeEnergies();
  }, [initializeMoods, initializeEnergies]);

  // Get data based on timeframe
  const getDataRange = () => {
    const days = timeframe === "7d" ? 7 : timeframe === "30d" ? 30 : 90;
    return days;
  };

  const days = getDataRange();
  const moodData = moods.length > 0 
    ? moods.slice(-days).map(m => ({ date: m.date, value: m.value }))
    : mockData.mood.slice(-days);
  const energyData = energies.length > 0
    ? energies.slice(-days).map(e => ({ date: e.date, value: e.value }))
    : mockData.energy.slice(-days);

  // Calculate insights
  const avgMood = moodData.length > 0 
    ? Math.round(moodData.reduce((sum, d) => sum + d.value, 0) / moodData.length)
    : 65;
  const avgEnergy = energyData.length > 0
    ? Math.round(energyData.reduce((sum, d) => sum + d.value, 0) / energyData.length)
    : 60;

  // Mood trend
  const moodTrend = moodData.length > 1 
    ? moodData[moodData.length - 1].value - moodData[0].value
    : 0;

  // Energy trend
  const energyTrend = energyData.length > 1
    ? energyData[energyData.length - 1].value - energyData[0].value
    : 0;

  // Mood stability
  const moodValues = moodData.map(d => d.value);
  const mean = moodValues.reduce((a, b) => a + b, 0) / moodValues.length;
  const variance = moodValues.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / moodValues.length;
  const stability = Math.max(0, Math.min(100, Math.round(100 - Math.sqrt(variance))));

  // Task completion
  const completedTasks = tasks.filter(t => t.status === "completed").length;
  const totalTasks = tasks.length || 1;
  const completionRate = Math.round((completedTasks / totalTasks) * 100);

  // Energy patterns by day of week
  const energyByDay = energyData.reduce((acc, d) => {
    const day = new Date(d.date).toLocaleDateString("en-US", { weekday: "short" });
    if (!acc[day]) {
      acc[day] = { day, total: 0, count: 0 };
    }
    acc[day].total += d.value;
    acc[day].count += 1;
    return acc;
  }, {} as Record<string, { day: string; total: number; count: number }>);

  const energyByDayData = Object.values(energyByDay).map(d => ({
    day: d.day,
    energy: Math.round(d.total / d.count),
  }));

  // Best and worst days
  const bestDay = energyByDayData.reduce((max, d) => d.energy > max.energy ? d : max, energyByDayData[0] || { day: "Mon", energy: 0 });
  const worstDay = energyByDayData.reduce((min, d) => d.energy < min.energy ? d : min, energyByDayData[0] || { day: "Mon", energy: 100 });

  // Generate AI-style insights
  const insights = [
    {
      id: "mood-trend",
      title: "Mood Trend Analysis",
      icon: TrendingUp,
      color: moodTrend > 0 ? "text-green-500" : moodTrend < 0 ? "text-orange-500" : "text-blue-500",
      description: moodTrend > 5 
        ? `Your mood has improved by ${Math.abs(moodTrend)} points over the past ${days} days. This positive trend suggests you're finding better balance and emotional well-being.`
        : moodTrend < -5
        ? `Your mood has decreased by ${Math.abs(moodTrend)} points. This might indicate increased stress or life changes. Consider what's been different recently.`
        : `Your mood has remained relatively stable, fluctuating by only ${Math.abs(moodTrend)} points. Stability can be a sign of good emotional regulation.`,
      details: moodTrend > 5
        ? "Improving mood patterns often correlate with better sleep, reduced stress, or positive life changes. Keep track of what's working for you."
        : moodTrend < -5
        ? "When mood declines, it's helpful to check in with sleep quality, stress levels, and social connections. Small adjustments can make a big difference."
        : "Stable mood indicates consistent emotional regulation. This foundation makes it easier to handle life's ups and downs with resilience.",
      suggestion: moodTrend > 5
        ? "Continue doing what's working. Consider journaling about the positive changes you've noticed."
        : moodTrend < -5
        ? "Take time to identify what might be contributing to lower mood. Small, consistent self-care practices can help."
        : "Your emotional stability is a strength. Use this foundation to explore new growth opportunities.",
    },
    {
      id: "energy-patterns",
      title: "Energy Patterns",
      icon: Zap,
      color: "text-yellow-500",
      description: `Your average energy level is ${avgEnergy}%. You tend to have ${bestDay.energy > worstDay.energy + 10 ? `higher energy on ${bestDay.day}` : `consistent energy throughout the week`}.`,
      details: `Energy patterns reveal when you're most capable of focused work. Your best day (${bestDay.day}) averages ${bestDay.energy}% energy, while your lowest (${worstDay.day}) averages ${worstDay.energy}%.`,
      suggestion: bestDay.energy > worstDay.energy + 10
        ? `Schedule important tasks on ${bestDay.day}s when your energy is naturally higher. Protect this time for high-impact work.`
        : "Your consistent energy pattern means you can plan flexibly. Focus on maintaining this balance through regular rest.",
    },
    {
      id: "mood-stability",
      title: "Mood Stability",
      icon: Activity,
      color: stability > 70 ? "text-green-500" : stability > 50 ? "text-blue-500" : "text-orange-500",
      description: `Your mood stability index is ${stability}%. ${stability > 70 ? "This indicates strong emotional regulation and consistent well-being." : stability > 50 ? "You have moderate mood stability with some natural variation." : "Your mood shows more variation, which is normal during periods of change or stress."}`,
      details: "Mood stability measures how much your mood fluctuates. Higher stability doesn't mean you never feel down—it means your emotional responses are predictable and manageable.",
      suggestion: stability > 70
        ? "Your emotional stability is a strength. Use this foundation to take on new challenges with confidence."
        : stability > 50
        ? "Moderate stability is healthy. Some variation is normal and shows you're responding authentically to life."
        : "If mood swings feel overwhelming, consider tracking what triggers them. Understanding patterns helps manage them better.",
    },
    {
      id: "task-momentum",
      title: "Task Completion Momentum",
      icon: Target,
      color: completionRate > 70 ? "text-green-500" : completionRate > 50 ? "text-blue-500" : "text-orange-500",
      description: `You've completed ${completedTasks} out of ${totalTasks} tasks (${completionRate}%). ${completionRate > 70 ? "You're maintaining strong momentum and follow-through." : completionRate > 50 ? "You're making steady progress on your commitments." : "Consider breaking tasks into smaller steps to build momentum."}`,
      details: "Task completion builds psychological momentum. Each completed task reinforces your sense of capability and reduces mental load.",
      suggestion: completionRate > 70
        ? "Your strong completion rate shows good planning and execution. Keep this momentum going by maintaining realistic expectations."
        : completionRate > 50
        ? "You're making progress. Consider reviewing which tasks are most important and focusing energy there."
        : "Try breaking large tasks into smaller, achievable steps. Celebrate each completion to build momentum.",
    },
    {
      id: "energy-trend",
      title: "Energy Trend",
      icon: TrendingUp,
      color: energyTrend > 0 ? "text-green-500" : energyTrend < 0 ? "text-orange-500" : "text-blue-500",
      description: energyTrend > 5
        ? `Your energy has increased by ${Math.abs(energyTrend)} points. This suggests better rest, reduced stress, or improved physical health.`
        : energyTrend < -5
        ? `Your energy has decreased by ${Math.abs(energyTrend)} points. This might indicate burnout risk, poor sleep, or increased demands.`
        : `Your energy has remained stable, which indicates consistent rest and recovery patterns.`,
      details: "Energy trends reflect your body's capacity to handle daily demands. Sustained low energy often signals the need for more rest or stress reduction.",
      suggestion: energyTrend > 5
        ? "Your improving energy is a positive sign. Maintain this by protecting your sleep and managing stress."
        : energyTrend < -5
        ? "Declining energy suggests you may need more rest. Consider reducing commitments and prioritizing recovery."
        : "Stable energy is valuable. Use it wisely by matching high-energy tasks to your peak times.",
    },
    {
      id: "overall-wellbeing",
      title: "Overall Wellbeing",
      icon: Heart,
      color: avgMood > 70 && avgEnergy > 65 ? "text-green-500" : avgMood > 50 && avgEnergy > 50 ? "text-blue-500" : "text-orange-500",
      description: `Your overall wellbeing combines mood (${avgMood}%) and energy (${avgEnergy}%). ${avgMood > 70 && avgEnergy > 65 ? "You're in a strong position with both high mood and energy." : avgMood > 50 && avgEnergy > 50 ? "You're maintaining balanced wellbeing with room for improvement." : "Your wellbeing could benefit from focused attention on rest and self-care."}`,
      details: "Wellbeing is the combination of emotional state (mood) and physical capacity (energy). Both need attention for sustainable health.",
      suggestion: avgMood > 70 && avgEnergy > 65
        ? "You're in a great place. Use this strength to build sustainable habits and take on meaningful challenges."
        : avgMood > 50 && avgEnergy > 50
        ? "Focus on small, consistent improvements. Even 10% better in both areas would make a significant difference."
        : "Prioritize rest and recovery. Small, consistent self-care practices can improve both mood and energy over time.",
    },
  ];

  const InsightCard = ({ insight }: { insight: typeof insights[0] }) => {
    const isExpanded = expandedInsight === insight.id;
    const Icon = insight.icon;
    
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        whileHover={{ scale: 1.02 }}
        onClick={() => setExpandedInsight(isExpanded ? null : insight.id)}
        className="bg-gradient-to-br from-card to-card/50 border border-border rounded-xl p-6 cursor-pointer shadow-md hover:shadow-lg transition-all"
      >
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-start gap-3 flex-1">
            <Icon className={`w-6 h-6 ${insight.color} mt-1 flex-shrink-0`} />
            <div className="flex-1">
              <h4 className="font-semibold mb-2 text-lg">{insight.title}</h4>
              <p className="text-sm text-muted-foreground leading-relaxed">{insight.description}</p>
              <AnimatePresence>
                {isExpanded && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="mt-4 pt-4 border-t border-border space-y-3"
                  >
                    <p className="text-sm text-muted-foreground leading-relaxed">{insight.details}</p>
                    <div className="bg-primary/10 border-l-4 border-primary p-3 rounded-r-lg">
                      <p className="text-sm font-medium text-primary mb-1">Suggestion:</p>
                      <p className="text-sm text-muted-foreground">{insight.suggestion}</p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
          <motion.div
            animate={{ rotate: isExpanded ? 180 : 0 }}
            className="ml-2 flex-shrink-0"
          >
            <ChevronDown className="w-5 h-5 text-muted-foreground" />
          </motion.div>
        </div>
      </motion.div>
    );
  };

  // Chart data
  const moodChartData = moodData.map(d => ({
    date: new Date(d.date).toLocaleDateString("en-US", { month: "short", day: "numeric" }),
    mood: d.value,
  }));

  const energyChartData = energyData.map(d => ({
    date: new Date(d.date).toLocaleDateString("en-US", { month: "short", day: "numeric" }),
    energy: d.value,
  }));

  return (
    <div className="space-y-8 pb-8">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
      >
        <div>
          <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-primary to-purple-500 bg-clip-text text-transparent">
            Insights
          </h1>
          <p className="text-muted-foreground">AI-powered analysis of your mental health patterns</p>
        </div>
        <div className="flex gap-2">
          {(["7d", "30d", "90d"] as const).map((tf) => (
            <motion.button
              key={tf}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setTimeframe(tf)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                timeframe === tf
                  ? "bg-primary text-primary-foreground shadow-md"
                  : "bg-muted text-muted-foreground hover:bg-accent"
              }`}
            >
              {tf === "7d" ? "7 Days" : tf === "30d" ? "30 Days" : "90 Days"}
            </motion.button>
          ))}
        </div>
      </motion.div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-gradient-to-br from-card to-card/50 border border-border rounded-xl p-6 shadow-md"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-muted-foreground">Avg Mood</span>
            <Heart className="w-5 h-5 text-pink-500" />
          </div>
          <div className="text-3xl font-bold">{avgMood}%</div>
          <div className="flex items-center gap-1 mt-2 text-sm">
            {moodTrend > 0 ? (
              <TrendingUp className="w-4 h-4 text-green-500" />
            ) : moodTrend < 0 ? (
              <TrendingDown className="w-4 h-4 text-orange-500" />
            ) : null}
            <span className={moodTrend > 0 ? "text-green-500" : moodTrend < 0 ? "text-orange-500" : "text-muted-foreground"}>
              {moodTrend > 0 ? "+" : ""}{moodTrend} pts
            </span>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
          className="bg-gradient-to-br from-card to-card/50 border border-border rounded-xl p-6 shadow-md"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-muted-foreground">Avg Energy</span>
            <Zap className="w-5 h-5 text-yellow-500" />
          </div>
          <div className="text-3xl font-bold">{avgEnergy}%</div>
          <div className="flex items-center gap-1 mt-2 text-sm">
            {energyTrend > 0 ? (
              <TrendingUp className="w-4 h-4 text-green-500" />
            ) : energyTrend < 0 ? (
              <TrendingDown className="w-4 h-4 text-orange-500" />
            ) : null}
            <span className={energyTrend > 0 ? "text-green-500" : energyTrend < 0 ? "text-orange-500" : "text-muted-foreground"}>
              {energyTrend > 0 ? "+" : ""}{energyTrend} pts
            </span>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="bg-gradient-to-br from-card to-card/50 border border-border rounded-xl p-6 shadow-md"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-muted-foreground">Stability</span>
            <Activity className="w-5 h-5 text-blue-500" />
          </div>
          <div className="text-3xl font-bold">{stability}%</div>
          <p className="text-xs text-muted-foreground mt-2">Mood consistency</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
          className="bg-gradient-to-br from-card to-card/50 border border-border rounded-xl p-6 shadow-md"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-muted-foreground">Tasks</span>
            <Target className="w-5 h-5 text-green-500" />
          </div>
          <div className="text-3xl font-bold">{completionRate}%</div>
          <p className="text-xs text-muted-foreground mt-2">{completedTasks}/{totalTasks} completed</p>
        </motion.div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-card border border-border rounded-xl p-6 shadow-md"
        >
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Heart className="w-5 h-5 text-pink-500" />
            Mood Trend
          </h3>
          <ResponsiveContainer width="100%" height={250}>
            <AreaChart data={moodChartData}>
              <defs>
                <linearGradient id="moodGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#ec4899" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#ec4899" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="date" stroke="hsl(var(--muted-foreground))" />
              <YAxis domain={[0, 100]} stroke="hsl(var(--muted-foreground))" />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: "hsl(var(--card))", 
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "8px"
                }}
              />
              <Area 
                type="monotone" 
                dataKey="mood" 
                stroke="#ec4899" 
                fill="url(#moodGradient)" 
                strokeWidth={2}
              />
            </AreaChart>
          </ResponsiveContainer>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-card border border-border rounded-xl p-6 shadow-md"
        >
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Zap className="w-5 h-5 text-yellow-500" />
            Energy by Day of Week
          </h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={energyByDayData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="day" stroke="hsl(var(--muted-foreground))" />
              <YAxis domain={[0, 100]} stroke="hsl(var(--muted-foreground))" />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: "hsl(var(--card))", 
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "8px"
                }}
              />
              <Bar dataKey="energy" fill="#eab308" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>
      </div>

      {/* Insights Grid */}
      <div>
        <h2 className="text-2xl font-semibold mb-6 flex items-center gap-2">
          <Sparkles className="w-6 h-6 text-primary" />
          Personalized Insights
        </h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {insights.map((insight, index) => (
            <motion.div
              key={insight.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 + index * 0.1 }}
            >
              <InsightCard insight={insight} />
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}

