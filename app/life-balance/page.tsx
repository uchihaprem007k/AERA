"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Scale, Briefcase, Heart, User, Calendar, TrendingUp, Edit2, Save } from "lucide-react";
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";

// Mock balance data
const generateBalanceData = () => {
  const data = [];
  const now = new Date();
  for (let i = 6; i >= 0; i--) {
    const date = new Date(now);
    date.setDate(date.getDate() - i);
    data.push({
      date: date.toLocaleDateString("en-US", { weekday: "short" }),
      work: Math.round(30 + Math.random() * 20),
      rest: Math.round(20 + Math.random() * 15),
      social: Math.round(15 + Math.random() * 15),
      personal: Math.round(20 + Math.random() * 15),
    });
  }
  return data;
};

const balanceData = generateBalanceData();

const COLORS = {
  work: "#3b82f6",
  rest: "#10b981",
  social: "#ec4899",
  personal: "#f59e0b",
};

export default function LifeBalancePage() {
  const [editing, setEditing] = useState(false);
  const [workRest, setWorkRest] = useState(60);
  const [socialEnergy, setSocialEnergy] = useState(50);
  const [personalTime, setPersonalTime] = useState(40);

  const avgWork = balanceData.reduce((sum, d) => sum + d.work, 0) / balanceData.length;
  const avgRest = balanceData.reduce((sum, d) => sum + d.rest, 0) / balanceData.length;
  const avgSocial = balanceData.reduce((sum, d) => sum + d.social, 0) / balanceData.length;
  const avgPersonal = balanceData.reduce((sum, d) => sum + d.personal, 0) / balanceData.length;

  const total = avgWork + avgRest + avgSocial + avgPersonal;
  const balanceScore = 100 - Math.abs(avgWork - avgRest) - Math.abs(avgSocial - avgPersonal);

  const pieData = [
    { name: "Work", value: Math.round(avgWork), color: COLORS.work },
    { name: "Rest", value: Math.round(avgRest), color: COLORS.rest },
    { name: "Social", value: Math.round(avgSocial), color: COLORS.social },
    { name: "Personal", value: Math.round(avgPersonal), color: COLORS.personal },
  ];

  const getBalanceLabel = (score: number) => {
    if (score >= 80) return "Well Balanced";
    if (score >= 60) return "Mostly Balanced";
    if (score >= 40) return "Needs Attention";
    return "Imbalanced";
  };

  const getBalanceColor = (score: number) => {
    if (score >= 80) return "text-green-500";
    if (score >= 60) return "text-blue-500";
    if (score >= 40) return "text-yellow-500";
    return "text-orange-500";
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
            Life Balance
          </h1>
          <p className="text-muted-foreground">Track your work, rest, social, and personal time</p>
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setEditing(!editing)}
          className="flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-xl font-medium min-h-[44px]"
        >
          {editing ? <Save className="w-5 h-5" /> : <Edit2 className="w-5 h-5" />}
          {editing ? "Save" : "Update Balance"}
        </motion.button>
      </motion.div>

      {/* Balance Score */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-gradient-to-br from-primary/10 to-purple-500/10 border border-primary/20 rounded-xl p-6"
      >
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <Scale className="w-8 h-8 text-primary" />
            <div>
              <h3 className="text-lg font-semibold">Balance Score</h3>
              <p className="text-sm text-muted-foreground">Based on your weekly distribution</p>
            </div>
          </div>
          <div className="text-right">
            <div className={`text-4xl font-bold ${getBalanceColor(balanceScore)}`}>
              {Math.round(balanceScore)}%
            </div>
            <p className="text-sm text-muted-foreground">{getBalanceLabel(balanceScore)}</p>
          </div>
        </div>
        <div className="w-full bg-muted rounded-full h-3 overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${balanceScore}%` }}
            transition={{ duration: 1, delay: 0.3 }}
            className={`h-full ${
              balanceScore >= 80
                ? "bg-green-500"
                : balanceScore >= 60
                ? "bg-blue-500"
                : balanceScore >= 40
                ? "bg-yellow-500"
                : "bg-orange-500"
            }`}
          />
        </div>
      </motion.div>

      {/* Today's Entry */}
      {editing && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-card border border-border rounded-xl p-6 shadow-md space-y-6"
        >
          <h3 className="text-lg font-semibold">Today&apos;s Balance Entry</h3>

          <div>
            <label className="block text-sm font-medium mb-4">
              Work vs Rest Balance: <span className="text-primary">{workRest}%</span> work, {100 - workRest}% rest
            </label>
            <input
              type="range"
              min="0"
              max="100"
              value={workRest}
              onChange={(e) => setWorkRest(Number(e.target.value))}
              className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer accent-primary"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-4">
              Social Energy: <span className="text-pink-500">{socialEnergy}%</span>
            </label>
            <input
              type="range"
              min="0"
              max="100"
              value={socialEnergy}
              onChange={(e) => setSocialEnergy(Number(e.target.value))}
              className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer accent-pink-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-4">
              Personal Time: <span className="text-yellow-500">{personalTime}%</span>
            </label>
            <input
              type="range"
              min="0"
              max="100"
              value={personalTime}
              onChange={(e) => setPersonalTime(Number(e.target.value))}
              className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer accent-yellow-500"
            />
          </div>
        </motion.div>
      )}

      {/* Distribution Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-card border border-border rounded-xl p-6 shadow-md"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-muted-foreground">Work</span>
            <Briefcase className="w-5 h-5 text-blue-500" />
          </div>
          <div className="text-3xl font-bold">{Math.round(avgWork)}%</div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-card border border-border rounded-xl p-6 shadow-md"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-muted-foreground">Rest</span>
            <Calendar className="w-5 h-5 text-green-500" />
          </div>
          <div className="text-3xl font-bold">{Math.round(avgRest)}%</div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-card border border-border rounded-xl p-6 shadow-md"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-muted-foreground">Social</span>
            <Heart className="w-5 h-5 text-pink-500" />
          </div>
          <div className="text-3xl font-bold">{Math.round(avgSocial)}%</div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-card border border-border rounded-xl p-6 shadow-md"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-muted-foreground">Personal</span>
            <User className="w-5 h-5 text-yellow-500" />
          </div>
          <div className="text-3xl font-bold">{Math.round(avgPersonal)}%</div>
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
            <Scale className="w-5 h-5 text-primary" />
            Weekly Distribution
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
              >
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: "hsl(var(--card))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "8px",
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-card border border-border rounded-xl p-6 shadow-md"
        >
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-primary" />
            Weekly Overview
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={balanceData}>
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
              <Bar dataKey="work" fill={COLORS.work} radius={[8, 8, 0, 0]} />
              <Bar dataKey="rest" fill={COLORS.rest} radius={[8, 8, 0, 0]} />
              <Bar dataKey="social" fill={COLORS.social} radius={[8, 8, 0, 0]} />
              <Bar dataKey="personal" fill={COLORS.personal} radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>
      </div>

      {/* Balance Insights */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="bg-gradient-to-br from-blue-500/10 to-green-500/10 border border-blue-500/20 rounded-xl p-6"
      >
        <h3 className="text-lg font-semibold mb-4">Balance Insights</h3>
        <div className="space-y-3">
          <div className="flex items-start gap-3">
            <div className="w-2 h-2 rounded-full bg-blue-500 mt-2 flex-shrink-0" />
            <div>
              <p className="text-sm font-medium mb-1">Work-Rest Balance</p>
              <p className="text-sm text-muted-foreground">
                {Math.abs(avgWork - avgRest) < 10
                  ? "You&apos;re maintaining a good balance between work and rest. This supports sustainable energy and prevents burnout."
                  : avgWork > avgRest + 10
                  ? "You&apos;re spending significantly more time on work than rest. Consider scheduling more recovery time to maintain long-term wellbeing."
                  : "You have more rest time than work time. This can be healthy if intentional, but ensure you&apos;re meeting your responsibilities."}
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="w-2 h-2 rounded-full bg-pink-500 mt-2 flex-shrink-0" />
            <div>
              <p className="text-sm font-medium mb-1">Social Connection</p>
              <p className="text-sm text-muted-foreground">
                {avgSocial >= 20
                  ? "You&apos;re maintaining good social connections. Social time is important for emotional wellbeing and support."
                  : "Your social time is lower. Consider making time for meaningful connections, even if brief."}
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="w-2 h-2 rounded-full bg-yellow-500 mt-2 flex-shrink-0" />
            <div>
              <p className="text-sm font-medium mb-1">Personal Time</p>
              <p className="text-sm text-muted-foreground">
                {avgPersonal >= 20
                  ? "You&apos;re carving out time for yourself. Personal time is essential for self-care and maintaining your identity outside of roles."
                  : "Your personal time could be increased. Even small amounts of time for yourself can significantly improve wellbeing."}
              </p>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

