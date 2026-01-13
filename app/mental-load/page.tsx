"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { mockData } from "@/lib/mock-data";
import { CountUp } from "@/components/count-up";
import { EditModal } from "@/components/edit-modal";
import { Loader2, Brain, AlertTriangle, TrendingUp, Plus, Check } from "lucide-react";

export default function MentalLoadPage() {
  const [cognitiveLoad, setCognitiveLoad] = useState(45);
  const [overthinkingScore, setOverthinkingScore] = useState(35);
  const [editingLoad, setEditingLoad] = useState(false);
  const [selectedPressures, setSelectedPressures] = useState<string[]>([]);
  const [loadNote, setLoadNote] = useState("");
  
  // Calculate cognitive load
  const recentTasks = mockData.tasks.filter((t) => t.status !== "completed");
  const activeTasks = recentTasks.length;
  const highPriorityTasks = recentTasks.filter((t) => t.priority === 3).length;
  
  // Use user input or calculated load
  const currentLoad = cognitiveLoad || Math.min(100, Math.round(
    (activeTasks * 5) + (highPriorityTasks * 10) + (selectedPressures.length * 5)
  ));

  // Pressure sources
  const pressureSources = [
    { name: "Work deadlines", intensity: 75, description: "Multiple projects with overlapping deadlines" },
    { name: "Personal expectations", intensity: 60, description: "High standards for yourself" },
    { name: "Social obligations", intensity: 45, description: "Balancing social commitments" },
    { name: "Financial concerns", intensity: 40, description: "Planning and budgeting" },
  ];

  const getLoadColor = (load: number) => {
    if (load < 40) return "text-green-500";
    if (load < 70) return "text-yellow-500";
    return "text-red-500";
  };

  const getLoadLabel = (load: number) => {
    if (load < 40) return "Low";
    if (load < 70) return "Moderate";
    return "High";
  };

  return (
    <div className="space-y-6 sm:space-y-8 pb-8">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-3xl sm:text-4xl font-bold mb-2 bg-gradient-to-r from-primary to-purple-500 bg-clip-text text-transparent">Mental Load</h1>
        <p className="text-muted-foreground text-sm sm:text-base">Understanding your cognitive burden and mental pressure</p>
      </motion.div>

      {/* Cognitive Load Meter */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-br from-card to-card/50 border border-border rounded-xl p-8 shadow-lg"
      >
        <div className="flex items-center gap-3 mb-6">
          <Loader2 className="w-8 h-8 text-primary" />
          <h2 className="text-2xl font-semibold">Cognitive Load</h2>
        </div>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-lg font-medium">Current Load</span>
            <span className={`text-2xl font-bold ${getLoadColor(currentLoad)}`}>
              {getLoadLabel(currentLoad)}
            </span>
          </div>
          
          <div className="w-full bg-muted rounded-full h-6 overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${currentLoad}%` }}
              transition={{ duration: 1, ease: "easeOut" }}
              className={`h-full ${
                currentLoad < 40
                  ? "bg-green-500"
                  : currentLoad < 70
                  ? "bg-yellow-500"
                  : "bg-red-500"
              }`}
            />
          </div>
          
          <div className="flex justify-between text-sm text-muted-foreground">
            <span>Low</span>
            <span>Moderate</span>
            <span>High</span>
          </div>
        </div>

        <div className="mt-6 p-4 bg-muted/50 rounded-lg">
          <p className="text-sm text-muted-foreground">
            {currentLoad < 40
              ? "Your mental load is manageable. You have good capacity for new tasks."
              : currentLoad < 70
              ? "Your mental load is moderate. Consider prioritizing and delegating where possible."
              : "Your mental load is high. It's important to reduce commitments and take breaks."}
            </p>
          </div>
      </motion.div>

      {/* Overthinking Indicators */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-gradient-to-br from-card to-card/50 border border-border rounded-xl p-6 shadow-lg"
      >
        <div className="flex items-center gap-3 mb-4">
          <Brain className="w-6 h-6 text-primary" />
          <h2 className="text-xl font-semibold">Overthinking Indicators</h2>
        </div>
        
        <div className="space-y-4">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">Repetitive Thoughts</span>
              <span className="text-sm text-muted-foreground">{overthinkingScore}%</span>
            </div>
            <div className="w-full bg-muted rounded-full h-2">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${overthinkingScore}%` }}
                transition={{ duration: 1, delay: 0.3 }}
                className="bg-primary h-2 rounded-full"
              />
            </div>
          </div>

          <div className="mt-4 p-4 bg-muted/50 rounded-lg">
            <p className="text-sm text-muted-foreground">
              {overthinkingScore < 40
                ? "You're managing your thoughts well. Keep practicing mindfulness when needed."
                : "You may be experiencing some repetitive thinking. Consider setting aside dedicated 'worry time' or practicing grounding techniques."}
            </p>
          </div>
        </div>
      </motion.div>

      {/* Pressure Sources */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-semibold">Pressure Sources</h2>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setEditingLoad(true)}
            className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-xl font-medium shadow-lg shadow-primary/20 hover:shadow-xl transition-all"
          >
            <Plus className="w-4 h-4" />
            Assess Mental Load
          </motion.button>
        </div>
        <div className="space-y-4">
          {pressureSources.map((source, i) => {
            const isSelected = selectedPressures.includes(source.name);
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 + i * 0.1 }}
                whileHover={{ scale: 1.02, y: -2 }}
                onClick={() => {
                  setSelectedPressures((prev) =>
                    isSelected
                      ? prev.filter((p) => p !== source.name)
                      : [...prev, source.name]
                  );
                }}
                className={`bg-gradient-to-br from-card to-card/50 border rounded-xl p-6 shadow-md hover:shadow-lg transition-all cursor-pointer ${
                  isSelected ? "border-primary bg-primary/5" : "border-border"
                }`}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-start gap-3 flex-1">
                    <div className={`mt-1 w-5 h-5 rounded border-2 flex items-center justify-center ${
                      isSelected ? "bg-primary border-primary" : "border-border"
                    }`}>
                      {isSelected && <Check className="w-3 h-3 text-primary-foreground" />}
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold mb-1">{source.name}</h4>
                      <p className="text-sm text-muted-foreground">{source.description}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {source.intensity > 60 && (
                      <AlertTriangle className="w-5 h-5 text-orange-500" />
                    )}
                    <span className="text-lg font-bold">{source.intensity}%</span>
                  </div>
                </div>
                <div className="w-full bg-muted rounded-full h-2">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${source.intensity}%` }}
                    transition={{ duration: 1, delay: 0.5 + i * 0.1 }}
                    className={`h-2 rounded-full ${
                      source.intensity > 60
                        ? "bg-red-500"
                        : source.intensity > 40
                        ? "bg-yellow-500"
                        : "bg-green-500"
                    }`}
                  />
                </div>
              </motion.div>
            );
          })}
        </div>
      </motion.div>
      
      {/* Mental Load Assessment Modal */}
      <EditModal
        isOpen={editingLoad}
        onClose={() => setEditingLoad(false)}
        title="Assess Your Mental Load Today"
      >
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium mb-4">
              How heavy does today feel?
            </label>
            <input
              type="range"
              min="0"
              max="100"
              value={cognitiveLoad}
              onChange={(e) => setCognitiveLoad(parseInt(e.target.value))}
              className="w-full h-3 bg-muted rounded-lg appearance-none cursor-pointer accent-primary"
            />
            <div className="flex justify-between text-xs text-muted-foreground mt-2">
              <span>Light</span>
              <span className="text-lg font-bold text-primary">{cognitiveLoad}%</span>
              <span>Very Heavy</span>
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-4">
              Overthinking / Repetitive Thoughts
            </label>
            <input
              type="range"
              min="0"
              max="100"
              value={overthinkingScore}
              onChange={(e) => setOverthinkingScore(parseInt(e.target.value))}
              className="w-full h-3 bg-muted rounded-lg appearance-none cursor-pointer accent-primary"
            />
            <div className="flex justify-between text-xs text-muted-foreground mt-2">
              <span>None</span>
              <span className="text-lg font-bold text-primary">{overthinkingScore}%</span>
              <span>Very High</span>
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-2">What&apos;s contributing? (Optional)</label>
            <textarea
              value={loadNote}
              onChange={(e) => setLoadNote(e.target.value)}
              placeholder="Note what's creating pressure or mental load..."
              className="w-full px-4 py-3 bg-background border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary resize-none"
              rows={3}
            />
          </div>
          
          <motion.button
            type="button"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setEditingLoad(false)}
            className="w-full px-4 py-3 bg-primary text-primary-foreground rounded-xl font-medium"
          >
            Save Assessment
          </motion.button>
        </div>
      </EditModal>

      {/* Active Tasks */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="bg-card border border-border rounded-lg p-6"
      >
        <div className="flex items-center gap-3 mb-4">
          <TrendingUp className="w-6 h-6 text-primary" />
          <h2 className="text-xl font-semibold">Contributing Factors</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.6 }}
            className="p-4 bg-muted/50 rounded-xl"
          >
            <CountUp value={activeTasks} className="text-2xl font-bold mb-1" />
            <div className="text-sm text-muted-foreground">Active Tasks</div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.7 }}
            className="p-4 bg-muted/50 rounded-xl"
          >
            <CountUp value={highPriorityTasks} className="text-2xl font-bold mb-1" />
            <div className="text-sm text-muted-foreground">High Priority</div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.8 }}
            className="p-4 bg-muted/50 rounded-xl"
          >
            <CountUp value={overthinkingScore} suffix="%" className="text-2xl font-bold mb-1" />
            <div className="text-sm text-muted-foreground">Overthinking</div>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}

