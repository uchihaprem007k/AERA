"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { mockData } from "@/lib/mock-data";
import { CountUp } from "@/components/count-up";
import { EditModal } from "@/components/edit-modal";
import { Flame, AlertTriangle, Heart, TrendingUp, Shield, Plus, CheckCircle2 } from "lucide-react";

export default function BurnoutPage() {
  const [burnoutRisk, setBurnoutRisk] = useState(35);
  const [editingBurnout, setEditingBurnout] = useState(false);
  const [acknowledgedWarnings, setAcknowledgedWarnings] = useState<string[]>([]);
  const [recoveryActions, setRecoveryActions] = useState<Array<{ id: string; action: string; date: string }>>([]);
  const [actionInput, setActionInput] = useState("");
  
  const currentBurnout = mockData.burnout[mockData.burnout.length - 1];
  const currentRisk = burnoutRisk || currentBurnout.risk;

  // Calculate trend
  const recentBurnout = mockData.burnout.slice(-7);
  const avgBurnout = Math.round(recentBurnout.reduce((sum, d) => sum + d.risk, 0) / recentBurnout.length);
  const trend = currentRisk - avgBurnout;

  const getRiskLevel = (risk: number) => {
    if (risk < 30) return { label: "Low", color: "text-green-500", bgColor: "bg-green-500" };
    if (risk < 60) return { label: "Moderate", color: "text-yellow-500", bgColor: "bg-yellow-500" };
    if (risk < 80) return { label: "High", color: "text-orange-500", bgColor: "bg-orange-500" };
    return { label: "Critical", color: "text-red-500", bgColor: "bg-red-500" };
  };

  const riskLevel = getRiskLevel(currentRisk);

  // Warnings
  const warnings = [
    {
      title: "Emotional Exhaustion",
      description: "Feeling drained and unable to cope",
                  severity: currentRisk > 60 ? "high" : "moderate",
                },
                {
                  title: "Reduced Performance",
                  description: "Difficulty concentrating and completing tasks",
                  severity: currentRisk > 50 ? "high" : "moderate",
                },
                {
                  title: "Detachment",
                  description: "Feeling disconnected from work and relationships",
                  severity: currentRisk > 70 ? "high" : "low",
                },
  ].filter((w) => w.severity !== "low");

  // Recovery suggestions
  const suggestions = [
    {
      title: "Prioritize Rest",
      description: "Schedule regular breaks and ensure adequate sleep. Rest is not a reward—it's a requirement.",
      icon: Heart,
    },
    {
      title: "Set Boundaries",
      description: "Learn to say no to non-essential commitments. Your time and energy are finite resources.",
      icon: Shield,
    },
    {
      title: "Seek Support",
      description: "Talk to friends, family, or a professional. You don't have to handle everything alone.",
      icon: Heart,
    },
    {
      title: "Reduce Workload",
      description: "Identify tasks that can be delegated, delayed, or eliminated. Not everything is urgent.",
      icon: TrendingUp,
    },
  ];

  return (
    <div className="space-y-8">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-primary to-purple-500 bg-clip-text text-transparent">
            Burnout
          </h1>
          <p className="text-muted-foreground">Understanding and managing your burnout risk</p>
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setEditingBurnout(true)}
          className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-xl font-medium shadow-lg shadow-primary/20 hover:shadow-xl transition-all"
        >
          <Plus className="w-4 h-4" />
          Assess Risk
        </motion.button>
      </motion.div>

      {/* Risk Assessment */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-br from-card to-card/50 border border-border rounded-xl p-8 shadow-lg"
      >
        <div className="flex items-center gap-3 mb-6">
          <Flame className="w-8 h-8 text-primary" />
          <h2 className="text-2xl font-semibold">Burnout Risk Assessment</h2>
        </div>

        <div className="space-y-6">
          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="text-lg font-medium">Current Risk Level</span>
              <span className={`text-2xl font-bold ${riskLevel.color}`}>
                {riskLevel.label}
              </span>
            </div>
            <div className="w-full bg-muted rounded-full h-8 overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${currentRisk}%` }}
                transition={{ duration: 1, ease: "easeOut" }}
                className={`h-full ${riskLevel.bgColor}`}
              />
            </div>
            <div className="flex justify-between mt-2 text-sm text-muted-foreground">
              <span>0%</span>
              <span className="font-bold">{currentRisk}%</span>
              <span>100%</span>
            </div>
          </div>

          <div className="p-4 bg-muted/50 rounded-lg">
            <p className="text-sm text-muted-foreground">
              {currentRisk < 30
                ? "Your burnout risk is low. You're managing stress well and maintaining good balance."
                : currentRisk < 60
                ? "Your burnout risk is moderate. Pay attention to your stress levels and make time for recovery."
                : currentRisk < 80
                ? "Your burnout risk is high. It's important to take immediate steps to reduce stress and increase rest."
                : "Your burnout risk is critical. Please prioritize your wellbeing and consider seeking professional support."}
            </p>
          </div>
        </div>
      </motion.div>

      {/* Contributing Factors */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-card border border-border rounded-lg p-6"
      >
        <h3 className="text-lg font-semibold mb-4">Contributing Factors</h3>
        <div className="space-y-4">
          {currentBurnout.factors.map((factor, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 + i * 0.1 }}
              className="flex items-center justify-between"
            >
              <span className="font-medium">{factor.name}</span>
              <div className="flex items-center gap-3">
                <div className="w-32 bg-muted rounded-full h-2">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${factor.value}%` }}
                    transition={{ duration: 1, delay: 0.4 + i * 0.1 }}
                    className="bg-primary h-2 rounded-full"
                  />
                </div>
                <span className="text-sm font-bold w-12 text-right">{factor.value}%</span>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Warnings */}
      {warnings.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
            <AlertTriangle className="w-6 h-6 text-orange-500" />
            Warning Signs
          </h2>
          <div className="space-y-4">
            {warnings.map((warning, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 + i * 0.1 }}
              className={`bg-card border rounded-xl p-6 transition-all ${
                acknowledgedWarnings.includes(warning.title)
                  ? "border-green-500/50 bg-green-500/5"
                  : "border-orange-500/50"
              }`}
            >
              <div className="flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-orange-500 mt-0.5" />
                <div className="flex-1">
                  <h4 className="font-semibold mb-1">{warning.title}</h4>
                  <p className="text-sm text-muted-foreground">{warning.description}</p>
                  {acknowledgedWarnings.includes(warning.title) && (
                    <div className="flex items-center gap-2 mt-2 text-sm text-green-500">
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Acknowledged</span>
                    </div>
                  )}
                </div>
                {!acknowledgedWarnings.includes(warning.title) && (
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setAcknowledgedWarnings([...acknowledgedWarnings, warning.title])}
                    className="px-3 py-1 text-xs bg-primary text-primary-foreground rounded-lg font-medium"
                  >
                    Acknowledge
                  </motion.button>
                )}
              </div>
            </motion.div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Recovery Suggestions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <h2 className="text-2xl font-semibold mb-4">Recovery Suggestions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {suggestions.map((suggestion, i) => {
            const Icon = suggestion.icon;
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.5 + i * 0.1 }}
              whileHover={{ scale: 1.02, y: -2 }}
              className="bg-gradient-to-br from-card to-card/50 border border-border rounded-xl p-6 shadow-md hover:shadow-lg transition-shadow"
            >
                <Icon className="w-6 h-6 text-primary mb-3" />
                <h4 className="font-semibold mb-2">{suggestion.title}</h4>
                <p className="text-sm text-muted-foreground">{suggestion.description}</p>
              </motion.div>
            );
          })}
        </div>
      </motion.div>
      
      {/* Recovery Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <h2 className="text-2xl font-semibold mb-4">Recovery Actions</h2>
        <div className="space-y-4">
          <div className="flex gap-3">
            <input
              type="text"
              value={actionInput}
              onChange={(e) => setActionInput(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === "Enter" && actionInput.trim()) {
                  setRecoveryActions([
                    ...recoveryActions,
                    {
                      id: Date.now().toString(),
                      action: actionInput,
                      date: new Date().toISOString().split("T")[0],
                    },
                  ]);
                  setActionInput("");
                }
              }}
              placeholder="Add a recovery action..."
              className="flex-1 px-4 py-2 bg-background border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary"
            />
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                if (actionInput.trim()) {
                  setRecoveryActions([
                    ...recoveryActions,
                    {
                      id: Date.now().toString(),
                      action: actionInput,
                      date: new Date().toISOString().split("T")[0],
                    },
                  ]);
                  setActionInput("");
                }
              }}
              className="px-4 py-2 bg-primary text-primary-foreground rounded-xl font-medium"
            >
              Add
            </motion.button>
          </div>
          {recoveryActions.map((action) => (
            <motion.div
              key={action.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-gradient-to-br from-card to-card/50 border border-border rounded-xl p-4 flex items-center justify-between"
            >
              <div>
                <p className="font-medium">{action.action}</p>
                <p className="text-xs text-muted-foreground">{new Date(action.date).toLocaleDateString()}</p>
              </div>
              <CheckCircle2 className="w-5 h-5 text-green-500" />
            </motion.div>
          ))}
        </div>
      </motion.div>
      
      {/* Burnout Assessment Modal */}
      <EditModal
        isOpen={editingBurnout}
        onClose={() => setEditingBurnout(false)}
        title="Assess Your Burnout Risk"
      >
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium mb-4">
              How close to burnout do you feel?
            </label>
            <input
              type="range"
              min="0"
              max="100"
              value={burnoutRisk}
              onChange={(e) => setBurnoutRisk(parseInt(e.target.value))}
              className="w-full h-3 bg-muted rounded-lg appearance-none cursor-pointer accent-primary"
            />
            <div className="flex justify-between text-xs text-muted-foreground mt-2">
              <span>Low Risk</span>
              <span className="text-lg font-bold text-primary">{burnoutRisk}%</span>
              <span>Critical</span>
            </div>
          </div>
          
          <div className="p-4 bg-muted/50 rounded-lg">
            <p className="text-sm text-muted-foreground">
              {burnoutRisk < 30
                ? "Your burnout risk appears low. Continue maintaining balance."
                : burnoutRisk < 60
                ? "You're experiencing moderate burnout risk. Consider prioritizing rest and setting boundaries."
                : burnoutRisk < 80
                ? "Your burnout risk is high. It's important to reduce commitments and increase recovery time."
                : "Your burnout risk is critical. Please prioritize rest and consider seeking support."}
            </p>
          </div>
          
          <motion.button
            type="button"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setEditingBurnout(false)}
            className="w-full px-4 py-3 bg-primary text-primary-foreground rounded-xl font-medium"
          >
            Save Assessment
          </motion.button>
        </div>
      </EditModal>
    </div>
  );
}

