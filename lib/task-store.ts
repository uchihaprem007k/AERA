import { create } from "zustand";
import { format, addDays } from "date-fns";

export type TaskStatus = "pending" | "in-progress" | "completed";
export type TaskDifficulty = "low" | "medium" | "high";

export interface Task {
  id: string;
  title: string;
  description: string;
  category: string;
  status: TaskStatus;
  priority: number; // 1-3
  difficulty: TaskDifficulty;
  estimatedEnergy: number; // 0-100
  dueDate: string;
  note?: string;
  completedAt: string | null;
  createdAt: string;
}

interface TaskStore {
  tasks: Task[];
  addTask: (task: Omit<Task, "id" | "createdAt" | "completedAt">) => void;
  updateTask: (id: string, updates: Partial<Task>) => void;
  deleteTask: (id: string) => void;
  toggleTaskStatus: (id: string) => void;
  togglePriority: (id: string) => void;
  initializeTasks: (initialTasks: Task[]) => void;
}

export const useTaskStore = create<TaskStore>((set) => ({
  tasks: [],
  
  initializeTasks: (initialTasks) => set({ tasks: initialTasks }),
  
  addTask: (taskData) => {
    const newTask: Task = {
      ...taskData,
      id: `task-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      createdAt: format(new Date(), "yyyy-MM-dd"),
      completedAt: null,
    };
    set((state) => ({ tasks: [...state.tasks, newTask] }));
  },
  
  updateTask: (id, updates) => {
    set((state) => ({
      tasks: state.tasks.map((task) =>
        task.id === id ? { ...task, ...updates } : task
      ),
    }));
  },
  
  deleteTask: (id) => {
    set((state) => ({
      tasks: state.tasks.filter((task) => task.id !== id),
    }));
  },
  
  toggleTaskStatus: (id) => {
    set((state) => ({
      tasks: state.tasks.map((task) => {
        if (task.id !== id) return task;
        if (task.status === "completed") {
          return { ...task, status: "pending" as TaskStatus, completedAt: null };
        }
        if (task.status === "in-progress") {
          return { ...task, status: "completed" as TaskStatus, completedAt: format(new Date(), "yyyy-MM-dd") };
        }
        return { ...task, status: "in-progress" as TaskStatus };
      }),
    }));
  },
  
  togglePriority: (id) => {
    set((state) => ({
      tasks: state.tasks.map((task) => {
        if (task.id !== id) return task;
        const newPriority = task.priority === 3 ? 1 : task.priority + 1;
        return { ...task, priority: newPriority };
      }),
    }));
  },
}));

