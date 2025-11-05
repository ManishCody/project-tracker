"use client"

import { createContext, useContext, ReactNode, useState, useCallback, useEffect } from 'react';
import { Task } from '@/types/task';

interface TaskContextType {
  tasks: Task[];
  loading: boolean;
  addTask: (task: Partial<Task>) => Promise<Task | null>;
  updateTask: (id: string, updates: Partial<Task>) => Promise<Task | null>;
  deleteTask: (id: string) => Promise<void>;
  fetchTasks: () => Promise<void>;
}

const TaskContext = createContext<TaskContextType | undefined>(undefined);

export const TaskProvider = ({ children }: { children: ReactNode }) => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch all tasks
  const fetchTasks = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/tasks");
      const data = await res.json();

      if (data.success) {
        const normalizedTasks = data.data.map((task: any) => ({
          ...task,
          id: task.id || task._id,
          _id: task._id || task.id
        }));
        setTasks(normalizedTasks);
      } else {
        throw new Error(data.message || "Failed to load tasks");
      }
    } catch (error) {
      console.error("Fetch error:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  // Add a new task
  const addTask = useCallback(async (task: Partial<Task>) => {
    try {
      const res = await fetch("/api/tasks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(task),
      });

      const data = await res.json();

      if (data.success) {
        const newTask = {
          ...data.data,
          id: data.data.id || data.data._id,
          _id: data.data._id || data.data.id
        };

        setTasks(prev => [...prev, newTask]);
        return newTask;
      } else {
        throw new Error(data.message || "Failed to create task");
      }
    } catch (error) {
      console.error("Error creating task:", error);
      throw error;
    }
  }, []);

  // Update an existing task
  const updateTask = useCallback(async (id: string, updates: Partial<Task>) => {
    if (!id) {
      throw new Error("Cannot update task: No ID provided");
    }

    try {
      const res = await fetch(`/api/tasks/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updates),
      });

      const data = await res.json();

      if (data.success) {
        const updatedTask = {
          ...data.data,
          id: data.data.id || data.data._id,
          _id: data.data._id || data.data.id
        };

        setTasks(prev => 
          prev.map(t => (t.id === id || t._id === id) ? updatedTask : t)
        );
        return updatedTask;
      } else {
        throw new Error(data.message || "Update failed");
      }
    } catch (error) {
      console.error("Update error:", error);
      throw error;
    }
  }, []);

  // Delete a task
  const deleteTask = useCallback(async (id: string) => {
    if (!id) {
      throw new Error("Cannot delete task: No ID provided");
    }

    try {
      const res = await fetch(`/api/tasks/${id}`, { method: "DELETE" });
      const data = await res.json();

      if (data.success) {
        setTasks(prev => prev.filter(t => t.id !== id && t._id !== id));
      } else {
        throw new Error(data.message || "Failed to delete task");
      }
    } catch (error) {
      console.error("Delete error:", error);
      throw error;
    }
  }, []);

  // Initial fetch
  useEffect(() => {
    fetchTasks().catch(console.error);
  }, [fetchTasks]);

  return (
    <TaskContext.Provider 
      value={{
        tasks,
        loading,
        addTask,
        updateTask,
        deleteTask,
        fetchTasks
      }}
    >
      {children}
    </TaskContext.Provider>
  );
};

export const useTasks = () => {
  const context = useContext(TaskContext);
  if (context === undefined) {
    throw new Error('useTasks must be used within a TaskProvider');
  }
  return context;
};
