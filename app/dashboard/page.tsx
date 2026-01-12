"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { mockData, generateMoodData, generateEnergyData, generateBurnoutData } from "@/lib/mock-data";
import { useTaskStore } from "@/lib/task-store";
import { useMoodStore } from "@/lib/mood-store";
import { useEnergyStore } from "@/lib/energy-store";
import { CountUp } from "@/components/count-up";
import { EditModal } from "@/components/edit-modal";
import { MoodInput } from "@/components/mood-input";
import { EnergyInput } from "@/components/energy-input";
import { TrendingUp, TrendingDown, Minus, Activity, Flame, CheckCircle2, RefreshCw, ChevronDown, ChevronUp, Lightbulb, Edit2, Plus } from "lucide-react";
import { LineChart, Line, AreaChart, Area, PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";

export default function DashboardPage() {
  const [moodData, setMoodData] = useState(mockData.mood);
  const [energyData, setEnergyData] = useState(mockData.energy);
  const [burnoutData, setBurnoutData] = useState(mockData.burnout);
  const [expandedInsight, setExpandedInsight] = useState<string | null>(null);
  const [editingMetric, setEditingMetric] = useState<string | null>(null);
  
  const tasks = useTaskStore((state) => state.tasks);
  const moods = useMoodStore((state) => state.moods);
  const updateMood = useMoodStore((state) => state.updateMood);
  const initializeMoods = useMoodStore((state) => state.initializeMoods);
  const energies = useEnergyStore((state) => state.energies);
  const updateEnergy = useEnergyStore((state) => state.updateEnergy);
  const initializeEnergies = useEnergyStore((state) => state.initializeEnergies);
  
  useEffect(() => {
    initializeMoods();
    initializeEnergies();
  }, [initializeMoods, initializeEnergies]);
  
  const todayMood = useMoodStore((state) => state.getTodayMood());
  const todayEnergy = useEnergyStore((state) => state.getTodayEnergy());

  const handleRefresh = () => {
    setMoodData(generateMoodData());
    setEnergyData(generateEnergyData());
    setBurnoutData(generateBurnoutData());
  };
  
  const handleMoodUpdate = (value: number, note?: string, emotions?: string[]) => {
    const today = new Date().toISOString().split("T")[0];
    updateMood(today, value, note, emotions);
    // Update local mood data for charts
    setMoodData((prev) => {
      const updated = [...prev];
      const todayIndex = updated.findIndex((m) => m.date === today);
      if (todayIndex >= 0) {
        updated[todayIndex] = { ...updated[todayIndex], value, note: note || null };
      } else {
        updated.push({ date: today, value, note: note || null });
      }
      return updated;
    });
    setEditingMetric(null);
  };
  
  const handleEnergyUpdate = (value: number, note?: string, peakTime?: string) => {
    const today = new Date().toISOString().split("T")[0];
    updateEnergy(today, value, note, peakTime);
    // Update local energy data for charts
    setEnergyData((prev) => {
      const updated = [...prev];
      const todayIndex = updated.findIndex((e) => e.date === today);
      if (todayIndex >= 0) {
        updated[todayIndex] = { ...updated[todayIndex], value };
      } else {
        updated.push({ date: today, hour: new Date().getHours(), value });
      }
      return updated;
    });
    setEditingMetric(null);
  };

  // Calculate current metrics - use store data if available, fallback to mock
  const allMoodData = moods.length > 0 ? moods.map(m => ({ date: m.date, value: m.value, note: m.note })) : moodData;
  const recentMood = allMoodData.slice(-7);
  const avgMood = recentMood.length > 0 ? Math.round(recentMood.reduce((sum, d) => sum + d.value, 0) / recentMood.length) : (todayMood?.value || 65);
  const moodTrend = recentMood.length > 1 ? recentMood[recentMood.length - 1].value - recentMood[0].value : 0;

  const allEnergyData = energies.length > 0 ? energies.map(e => ({ date: e.date, hour: new Date(e.date).getHours(), value: e.value })) : energyData;
  const recentEnergy = allEnergyData.slice(-7);
  const avgEnergy = recentEnergy.length > 0 ? Math.round(recentEnergy.reduce((sum, d) => sum + d.value, 0) / recentEnergy.length) : (todayEnergy?.value || 60);

  const currentBurnout = burnoutData[burnoutData.length - 1];
  const burnoutRisk = currentBurnout.risk;

  const completedTasks = tasks.filter((t) => t.status === "completed").length;
  const totalTasks = tasks.length || mockData.tasks.length;
  const taskProgress = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  // Prepare chart data
  const moodChartData = moodData.slice(-30).map((d) => ({
    date: new Date(d.date).toLocaleDateString("en-US", { month: "short", day: "numeric" }),
    mood: d.value,
  }));

  const energyChartData = energyData.slice(-30).map((d) => ({
    date: new Date(d.date).toLocaleDateString("en-US", { month: "short", day: "numeric" }),
    energy: d.value,
  }));

  // Mood distribution (pie chart)
  const moodDistribution = [
    { name: "High (70+)", value: moodData.filter((d) => d.value >= 70).length, color: "#10b981" },
    { name: "Medium (50-69)", value: moodData.filter((d) => d.value >= 50 && d.value < 70).length, color: "#3b82f6" },
    { name: "Low (<50)", value: moodData.filter((d) => d.value < 50).length, color: "#f59e0b" },
  ];

  // Energy by day of week (bar chart)
  const energyByDay = energyData.slice(-30).reduce((acc, d) => {
    const day = new Date(d.date).toLocaleDateString("en-US", { weekday: "short" });
    if (!acc[day]) {
      acc[day] = { day, total: 0, count: 0 };
    }
    acc[day].total += d.value;
    acc[day].count += 1;
    return acc;
  }, {} as Record<string, { day: string; total: number; count: number }>);

  const energyByDayData = Object.values(energyByDay).map((d) => ({
    day: d.day,
    energy: Math.round(d.total / d.count),
  }));

  // Burnout trend (line chart)
  const burnoutTrendData = burnoutData.slice(-30).map((d) => ({
    date: new Date(d.date).toLocaleDateString("en-US", { month: "short", day: "numeric" }),
    risk: d.risk,
  }));

  // Task completion (pie + bar combo data)
  const taskStatusData = [
    { name: "Completed", value: completedTasks, color: "#10b981" },
    { name: "In Progress", value: tasks.filter((t) => t.status === "in-progress").length, color: "#3b82f6" },
    { name: "Pending", value: tasks.filter((t) => t.status === "pending").length, color: "#f59e0b" },
  ];

  const StatCard = ({ title, value, trend, icon: Icon, color, delay = 0, metric, onClick }: any) => (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ delay }}
      whileHover={{ scale: 1.02, y: -2 }}
      onClick={onClick}
      className={`bg-gradient-to-br from-card to-card/50 border border-border rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow ${onClick ? "cursor-pointer" : ""}`}
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-medium text-muted-foreground">{title}</h3>
        <div className="flex items-center gap-2">
          <Icon className={`w-5 h-5 ${color}`} />
          {onClick && (
            <Edit2 className="w-4 h-4 text-muted-foreground hover:text-primary transition-colors" />
          )}
        </div>
      </div>
      <div className="flex items-baseline gap-2">
        <CountUp value={typeof value === "number" ? value : parseInt(value)} suffix={typeof value === "string" && value.includes("%") ? "%" : ""} className="text-3xl font-bold" />
        {trend !== undefined && (
          <div className="flex items-center gap-1 text-sm">
            {trend > 0 ? (
              <TrendingUp className="w-4 h-4 text-green-500" />
            ) : trend < 0 ? (
              <TrendingDown className="w-4 h-4 text-red-500" />
            ) : (
              <Minus className="w-4 h-4 text-gray-500" />
            )}
            <span className={trend > 0 ? "text-green-500" : trend < 0 ? "text-red-500" : "text-gray-500"}>
              {Math.abs(trend)}
            </span>
          </div>
        )}
      </div>
      {onClick && (
        <motion.div
          initial={{ opacity: 0 }}
          whileHover={{ opacity: 1 }}
          className="mt-3 text-xs text-muted-foreground"
        >
          Click to update today
        </motion.div>
      )}
    </motion.div>
  );

  const InsightCard = ({ id, title, description, details, icon: Icon }: any) => {
    const isExpanded = expandedInsight === id;
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        whileHover={{ scale: 1.02 }}
        onClick={() => setExpandedInsight(isExpanded ? null : id)}
        className="bg-gradient-to-br from-card to-card/50 border border-border rounded-xl p-6 cursor-pointer shadow-md hover:shadow-lg transition-all"
      >
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-3 flex-1">
            <Icon className="w-6 h-6 text-primary mt-1 flex-shrink-0" />
            <div className="flex-1">
              <h4 className="font-semibold mb-2">{title}</h4>
              <p className="text-sm text-muted-foreground">{description}</p>
              <AnimatePresence>
                {isExpanded && details && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="mt-4 pt-4 border-t border-border"
                  >
                    <p className="text-sm text-muted-foreground">{details}</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
          {details && (
            <motion.div
              animate={{ rotate: isExpanded ? 180 : 0 }}
              className="ml-2 flex-shrink-0"
            >
              <ChevronDown className="w-5 h-5 text-muted-foreground" />
            </motion.div>
          )}
        </div>
      </motion.div>
    );
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
            Dashboard
          </h1>
          <p className="text-muted-foreground">Your mental health overview</p>
        </div>
        <motion.button
          whileHover={{ scale: 1.05, rotate: 180 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleRefresh}
          className="flex items-center gap-2 px-4 py-2 border border-border rounded-lg font-medium hover:bg-muted transition-colors"
        >
          <RefreshCw className="w-4 h-4" />
          Refresh Data
        </motion.button>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Mood Score"
          value={avgMood}
          trend={moodTrend}
          icon={Activity}
          color="text-blue-500"
          delay={0}
          metric="mood"
          onClick={() => setEditingMetric("mood")}
        />
        <StatCard
          title="Energy Level"
          value={avgEnergy}
          icon={Activity}
          color="text-green-500"
          delay={0.1}
          metric="energy"
          onClick={() => setEditingMetric("energy")}
        />
        <StatCard
          title="Burnout Risk"
          value={`${burnoutRisk}%`}
          icon={Flame}
          color="text-orange-500"
          delay={0.2}
        />
        <StatCard
          title="Task Progress"
          value={`${taskProgress}%`}
          icon={CheckCircle2}
          color="text-purple-500"
          delay={0.3}
        />
      </div>
      
      {/* Update Today Button */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex justify-center"
      >
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setEditingMetric("update-today")}
          className="flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-xl font-medium shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30 transition-all"
        >
          <Plus className="w-5 h-5" />
          Update Today&apos;s Data
        </motion.button>
      </motion.div>
      
      {/* Edit Modals */}
      <EditModal
        isOpen={editingMetric === "mood"}
        onClose={() => setEditingMetric(null)}
        title="Update Your Mood"
      >
        <MoodInput
          value={todayMood?.value || avgMood}
          onChange={(value) => {
            const today = new Date().toISOString().split("T")[0];
            handleMoodUpdate(value, todayMood?.note, todayMood?.emotions);
          }}
          onNoteChange={(note) => {
            const today = new Date().toISOString().split("T")[0];
            handleMoodUpdate(todayMood?.value || avgMood, note, todayMood?.emotions);
          }}
          note={todayMood?.note}
        />
      </EditModal>
      
      <EditModal
        isOpen={editingMetric === "energy"}
        onClose={() => setEditingMetric(null)}
        title="Update Your Energy"
      >
        <EnergyInput
          value={todayEnergy?.value || avgEnergy}
          onChange={(value) => {
            const today = new Date().toISOString().split("T")[0];
            handleEnergyUpdate(value, todayEnergy?.note, todayEnergy?.peakTime);
          }}
          onNoteChange={(note) => {
            const today = new Date().toISOString().split("T")[0];
            handleEnergyUpdate(todayEnergy?.value || avgEnergy, note, todayEnergy?.peakTime);
          }}
          onPeakTimeChange={(peakTime) => {
            const today = new Date().toISOString().split("T")[0];
            handleEnergyUpdate(todayEnergy?.value || avgEnergy, todayEnergy?.note, peakTime);
          }}
          note={todayEnergy?.note}
          peakTime={todayEnergy?.peakTime}
        />
      </EditModal>
      
      <EditModal
        isOpen={editingMetric === "update-today"}
        onClose={() => setEditingMetric(null)}
        title="Update Today&apos;s Data"
      >
        <div className="space-y-6">
          <div>
            <h3 className="font-semibold mb-3">Mood</h3>
            <MoodInput
              value={todayMood?.value || avgMood}
              onChange={(value) => {
                const today = new Date().toISOString().split("T")[0];
                handleMoodUpdate(value, todayMood?.note, todayMood?.emotions);
              }}
              onNoteChange={(note) => {
                const today = new Date().toISOString().split("T")[0];
                handleMoodUpdate(todayMood?.value || avgMood, note, todayMood?.emotions);
              }}
              note={todayMood?.note}
            />
          </div>
          <div className="border-t border-border pt-6">
            <h3 className="font-semibold mb-3">Energy</h3>
            <EnergyInput
              value={todayEnergy?.value || avgEnergy}
              onChange={(value) => {
                const today = new Date().toISOString().split("T")[0];
                handleEnergyUpdate(value, todayEnergy?.note, todayEnergy?.peakTime);
              }}
              onNoteChange={(note) => {
                const today = new Date().toISOString().split("T")[0];
                handleEnergyUpdate(todayEnergy?.value || avgEnergy, note, todayEnergy?.peakTime);
              }}
              onPeakTimeChange={(peakTime) => {
                const today = new Date().toISOString().split("T")[0];
                handleEnergyUpdate(todayEnergy?.value || avgEnergy, todayEnergy?.note, peakTime);
              }}
              note={todayEnergy?.note}
              peakTime={todayEnergy?.peakTime}
            />
          </div>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setEditingMetric(null)}
            className="w-full px-4 py-3 bg-primary text-primary-foreground rounded-xl font-medium"
          >
            Done
          </motion.button>
        </div>
      </EditModal>

      {/* Mixed Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Mood Trend - Area Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-gradient-to-br from-card to-card/50 border border-border rounded-xl p-6 shadow-lg"
        >
          <h3 className="text-lg font-semibold mb-4">Mood Trend (30 days)</h3>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={moodChartData}>
              <defs>
                <linearGradient id="moodGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis domain={[0, 100]} />
              <Tooltip />
              <Area type="monotone" dataKey="mood" stroke="#3b82f6" fill="url(#moodGradient)" />
            </AreaChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Mood Distribution - Pie Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-gradient-to-br from-card to-card/50 border border-border rounded-xl p-6 shadow-lg"
        >
          <h3 className="text-lg font-semibold mb-4">Mood Distribution</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={moodDistribution}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
                animationBegin={0}
                animationDuration={800}
              >
                {moodDistribution.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Energy by Day - Bar Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-gradient-to-br from-card to-card/50 border border-border rounded-xl p-6 shadow-lg"
        >
          <h3 className="text-lg font-semibold mb-4">Energy by Day of Week</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={energyByDayData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="day" />
              <YAxis domain={[0, 100]} />
              <Tooltip />
              <Bar dataKey="energy" fill="#10b981" animationBegin={0} animationDuration={800} radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Burnout Risk Trend - Line Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="bg-gradient-to-br from-card to-card/50 border border-border rounded-xl p-6 shadow-lg"
        >
          <h3 className="text-lg font-semibold mb-4">Burnout Risk Trend</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={burnoutTrendData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis domain={[0, 100]} />
              <Tooltip />
              <Line type="monotone" dataKey="risk" stroke="#f59e0b" strokeWidth={2} dot={{ r: 4 }} animationBegin={0} animationDuration={800} />
            </LineChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Task Completion - Pie Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="bg-gradient-to-br from-card to-card/50 border border-border rounded-xl p-6 shadow-lg"
        >
          <h3 className="text-lg font-semibold mb-4">Task Status</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={taskStatusData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
                animationBegin={0}
                animationDuration={800}
              >
                {taskStatusData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Energy Trend - Area Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9 }}
          className="bg-gradient-to-br from-card to-card/50 border border-border rounded-xl p-6 shadow-lg"
        >
          <h3 className="text-lg font-semibold mb-4">Energy Trend (30 days)</h3>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={energyChartData}>
              <defs>
                <linearGradient id="energyGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis domain={[0, 100]} />
              <Tooltip />
              <Area type="monotone" dataKey="energy" stroke="#10b981" fill="url(#energyGradient)" />
            </AreaChart>
          </ResponsiveContainer>
        </motion.div>
      </div>

      {/* Insights */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1 }}
      >
        <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
          <Lightbulb className="w-6 h-6 text-primary" />
          Insights
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <InsightCard
            id="mood-stability"
            title="Mood Stability"
            description="Your mood has been relatively stable over the past week, with minor fluctuations."
            details="Stable mood patterns indicate good emotional regulation. This consistency can help you plan activities and manage stress more effectively."
            icon={Activity}
          />
          <InsightCard
            id="energy-patterns"
            title="Energy Patterns"
            description="You tend to have higher energy in the mornings. Consider scheduling important tasks then."
            details="Understanding your energy patterns helps optimize productivity. Peak energy times are ideal for complex, creative, or high-stakes work."
            icon={Activity}
          />
          <InsightCard
            id="task-completion"
            title="Task Completion"
            description={`You&apos;ve completed ${completedTasks} tasks. Keep up the momentum!`}
            details="Consistent task completion builds momentum and reduces mental load. Celebrate small wins to maintain motivation."
            icon={CheckCircle2}
          />
        </div>
      </motion.div>
    </div>
  );
}
