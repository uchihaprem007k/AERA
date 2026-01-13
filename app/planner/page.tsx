"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { mockData } from "@/lib/mock-data";
import { useTaskStore } from "@/lib/task-store";
import { AddTaskModal } from "@/components/add-task-modal";
import { CountUp } from "@/components/count-up";
import { Calendar, CheckCircle2, Circle, Clock, Sparkles, Plus, Trash2, AlertCircle, ArrowUp, ArrowDown } from "lucide-react";
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";

export default function PlannerPage() {
  const tasks = useTaskStore((state) => state.tasks);
  const initializeTasks = useTaskStore((state) => state.initializeTasks);
  const toggleTaskStatus = useTaskStore((state) => state.toggleTaskStatus);
  const deleteTask = useTaskStore((state) => state.deleteTask);
  const togglePriority = useTaskStore((state) => state.togglePriority);
  
  const [showAddModal, setShowAddModal] = useState(false);
  const [showAIReorder, setShowAIReorder] = useState(false);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  // Initialize tasks from mock data on mount
  useEffect(() => {
    if (tasks.length === 0) {
      const initialTasks = mockData.tasks.map((task) => ({
        ...task,
        difficulty: (task.priority === 3 ? "high" : task.priority === 2 ? "medium" : "low") as "low" | "medium" | "high",
        estimatedEnergy: Math.floor(Math.random() * 40) + 30,
        createdAt: task.dueDate || new Date().toISOString().split("T")[0],
      }));
      initializeTasks(initialTasks);
    }
  }, [tasks.length, initializeTasks]);

  const activeTasks = tasks.filter((t) => t.status !== "completed");
  const completedTasks = tasks.filter((t) => t.status === "completed");

  const handleDelete = (id: string) => {
    if (deleteConfirmId === id) {
      deleteTask(id);
      setDeleteConfirmId(null);
    } else {
      setDeleteConfirmId(id);
      setTimeout(() => setDeleteConfirmId(null), 3000);
    }
  };

  const handleAIReorder = () => {
    setShowAIReorder(true);
    setTimeout(() => {
      // Mock reordering - in real app this would use AI
      const sorted = [...activeTasks].sort((a, b) => {
        const aScore = a.priority * 10 + (a.status === "in-progress" ? 5 : 0) + a.estimatedEnergy / 10;
        const bScore = b.priority * 10 + (b.status === "in-progress" ? 5 : 0) + b.estimatedEnergy / 10;
        return bScore - aScore;
      });
      sorted.forEach((task, index) => {
        // Reorder by updating tasks
      });
      setShowAIReorder(false);
    }, 1500);
  };

  const getPriorityColor = (priority: number) => {
    if (priority === 3) return "text-red-500 bg-red-500/10";
    if (priority === 2) return "text-yellow-500 bg-yellow-500/10";
    return "text-green-500 bg-green-500/10";
  };

  const getStatusIcon = (status: string) => {
    if (status === "completed") return CheckCircle2;
    if (status === "in-progress") return Clock;
    return Circle;
  };

  // Chart data
  const taskStatusData = [
    { name: "Completed", value: completedTasks.length, color: "#10b981" },
    { name: "In Progress", value: tasks.filter((t) => t.status === "in-progress").length, color: "#3b82f6" },
    { name: "Pending", value: tasks.filter((t) => t.status === "pending").length, color: "#f59e0b" },
  ];

  const categoryData = activeTasks.reduce((acc, task) => {
    acc[task.category] = (acc[task.category] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const categoryChartData = Object.entries(categoryData).map(([name, value]) => ({
    name,
    value,
  }));

  const priorityData = [
    { name: "High", value: activeTasks.filter((t) => t.priority === 3).length },
    { name: "Medium", value: activeTasks.filter((t) => t.priority === 2).length },
    { name: "Low", value: activeTasks.filter((t) => t.priority === 1).length },
  ];

  const completionRate = tasks.length > 0 ? Math.round((completedTasks.length / tasks.length) * 100) : 0;

  return (
    <div className="space-y-6 sm:space-y-8 pb-8">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
      >
        <div>
          <h1 className="text-3xl sm:text-4xl font-bold mb-2 bg-gradient-to-r from-primary to-purple-500 bg-clip-text text-transparent">
            Planner
          </h1>
          <p className="text-muted-foreground text-sm sm:text-base">Organize your tasks and priorities</p>
        </div>
        <div className="flex gap-3 w-full sm:w-auto">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleAIReorder}
            disabled={showAIReorder}
            className="flex items-center gap-2 px-4 py-2 border border-border rounded-lg font-medium hover:bg-muted transition-colors disabled:opacity-50 min-h-[44px] flex-1 sm:flex-initial"
          >
            <Sparkles className="w-4 h-4" />
            <span className="sm:inline">{showAIReorder ? "Reordering..." : "AI Reorder"}</span>
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg font-medium shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30 transition-all min-h-[44px] flex-1 sm:flex-initial"
          >
            <Plus className="w-4 h-4" />
            <span className="sm:inline">Add Task</span>
          </motion.button>
        </div>
      </motion.div>

      {/* Task Stats with Count-Up */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-br from-card to-card/50 border border-border rounded-xl p-6 shadow-lg"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-muted-foreground">Total Tasks</span>
            <Calendar className="w-5 h-5 text-primary" />
          </div>
          <CountUp value={tasks.length} className="text-3xl font-bold" />
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-gradient-to-br from-card to-card/50 border border-border rounded-xl p-6 shadow-lg"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-muted-foreground">In Progress</span>
            <Clock className="w-5 h-5 text-blue-500" />
          </div>
          <CountUp value={tasks.filter((t) => t.status === "in-progress").length} className="text-3xl font-bold" />
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-gradient-to-br from-card to-card/50 border border-border rounded-xl p-6 shadow-lg"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-muted-foreground">High Priority</span>
            <AlertCircle className="w-5 h-5 text-red-500" />
          </div>
          <CountUp value={tasks.filter((t) => t.priority === 3).length} className="text-3xl font-bold" />
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-gradient-to-br from-card to-card/50 border border-border rounded-xl p-6 shadow-lg"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-muted-foreground">Completion</span>
            <CheckCircle2 className="w-5 h-5 text-green-500" />
          </div>
          <CountUp value={completionRate} suffix="%" className="text-3xl font-bold" />
        </motion.div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4 }}
          className="bg-gradient-to-br from-card to-card/50 border border-border rounded-xl p-6 shadow-lg"
        >
          <h3 className="text-lg font-semibold mb-4">Task Status</h3>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie
                data={taskStatusData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
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

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5 }}
          className="bg-gradient-to-br from-card to-card/50 border border-border rounded-xl p-6 shadow-lg"
        >
          <h3 className="text-lg font-semibold mb-4">By Category</h3>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={categoryChartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="value" fill="#3b82f6" animationBegin={0} animationDuration={800} />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.6 }}
          className="bg-gradient-to-br from-card to-card/50 border border-border rounded-xl p-6 shadow-lg"
        >
          <h3 className="text-lg font-semibold mb-4">By Priority</h3>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={priorityData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="value" fill="#f59e0b" animationBegin={0} animationDuration={800} />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>
      </div>

      {/* Tasks List */}
      <div className="space-y-4">
        <h2 className="text-2xl font-semibold">Your Tasks</h2>
        <AnimatePresence>
          {activeTasks.map((task, index) => {
            const StatusIcon = getStatusIcon(task.status);
            const isCompleted = task.status === "completed";
            const isDeleteConfirm = deleteConfirmId === task.id;

            return (
              <motion.div
                key={task.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: -20, height: 0 }}
                transition={{ delay: index * 0.03 }}
                layout
                className="bg-gradient-to-br from-card to-card/50 border border-border rounded-xl p-6 shadow-md hover:shadow-lg transition-shadow"
              >
                <div className="flex items-start gap-4">
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => toggleTaskStatus(task.id)}
                    className={`mt-1 transition-colors ${
                      isCompleted ? "text-green-500" : "text-muted-foreground hover:text-primary"
                    }`}
                  >
                    <StatusIcon className="w-6 h-6" />
                  </motion.button>
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h3 className={`font-semibold text-lg ${isCompleted ? "line-through text-muted-foreground" : ""}`}>
                          {task.title}
                        </h3>
                        <p className="text-sm text-muted-foreground mt-1">{task.description}</p>
                        {task.note && (
                          <p className="text-xs text-muted-foreground mt-1 italic">Note: {task.note}</p>
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => togglePriority(task.id)}
                          className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${getPriorityColor(task.priority)}`}
                        >
                          {task.priority === 3 ? "High" : task.priority === 2 ? "Medium" : "Low"}
                        </motion.button>
                        <span className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded">
                          {task.category}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        <span>Due: {new Date(task.dueDate).toLocaleDateString()}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <span>Energy: {task.estimatedEnergy}%</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <span>Difficulty: {task.difficulty}</span>
                      </div>
                    </div>
                    {/* Energy bar */}
                    <div className="mt-3 w-full bg-muted rounded-full h-2">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${task.estimatedEnergy}%` }}
                        transition={{ duration: 0.5, delay: index * 0.05 }}
                        className="bg-primary h-2 rounded-full"
                      />
                    </div>
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => handleDelete(task.id)}
                    className={`p-2 rounded-lg transition-colors ${
                      isDeleteConfirm
                        ? "bg-red-500 text-white"
                        : "text-muted-foreground hover:bg-red-500/10 hover:text-red-500"
                    }`}
                  >
                    <Trash2 className="w-5 h-5" />
                  </motion.button>
                </div>
                {isDeleteConfirm && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="mt-3 p-3 bg-red-500/10 border border-red-500/20 rounded-lg"
                  >
                    <p className="text-sm text-red-500">Click again to confirm deletion</p>
                  </motion.div>
                )}
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      {activeTasks.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-12"
        >
          <CheckCircle2 className="w-16 h-16 text-green-500 mx-auto mb-4" />
          <h3 className="text-xl font-semibold mb-2">All tasks completed!</h3>
          <p className="text-muted-foreground">Great job staying on top of your priorities.</p>
        </motion.div>
      )}

      <AddTaskModal isOpen={showAddModal} onClose={() => setShowAddModal(false)} />
    </div>
  );
}
