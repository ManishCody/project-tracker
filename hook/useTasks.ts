"use client"

import { useState, useEffect } from "react"
import { toast } from "sonner"
import { Task } from "@/types/task"

export function useTasks() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchTasks()
  }, [])

  const fetchTasks = async () => {
    try {
      setLoading(true)
      const res = await fetch("/api/tasks")
      const data = await res.json()

      if (data.success) {
        const normalizedTasks = data.data.map((task: any) => ({
          ...task,
          id: task.id || task._id,  
          _id: task._id || task.id  
        }))
        setTasks(normalizedTasks)
      } else {
        toast.error(data.message || "Failed to load tasks")
      }
    } catch (error) {
      console.error("Fetch error:", error)
      toast.error("Error fetching tasks")
    } finally {
      setLoading(false)
    }
  }

  // Add Task
  const addTask = async (task: Partial<Task>) => {
    try {
      const res = await fetch("/api/tasks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(task),
      })

      const data = await res.json()

      if (data.success) {
        // Normalize the task data to ensure consistent ID handling
        const newTask = {
          ...data.data,
          id: data.data.id || data.data._id,
          _id: data.data._id || data.data.id
        };

        // Update the state with the new task
        setTasks((prev) => [...prev, newTask])
        toast.success("Task created successfully")
        return newTask
      } else {
        toast.error(data.message || "Failed to create task")
        return null
      }
    } catch (error) {
      console.error("Error creating task:", error)
      toast.error("Error creating task")
      return null
    }
  }

  // Update Task
  const updateTask = async (id: string, updates: Partial<Task>) => {
    if (!id) {
      console.error('Cannot update task: No ID provided')
      toast.error('Cannot update task: Invalid task ID')
      return null;
    }

    try {
      const res = await fetch(`/api/tasks/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updates),
      })

      const data = await res.json()

      if (data.success) {
        // Normalize the updated task data
        const updatedTask = {
          ...data.data,
          id: data.data.id || data.data._id,
          _id: data.data._id || data.data.id
        };

        setTasks((prev) =>
          prev.map((t) => 
            (t._id === id || t.id === id) ? { ...t, ...updatedTask } : t
          )
        )
        toast.success("Task updated")
        return updatedTask;
      } else {
        toast.error(data.message || "Update failed")
        return null;
      }
    } catch (error) {
      console.error("Update error:", error)
      toast.error("Error updating task")
      return null;
    }
  }

  // Delete Task
  const deleteTask = async (id: string) => {
    if (!id) {
      console.error('Cannot delete task: No ID provided')
      toast.error('Cannot delete task: Invalid task ID')
      return
    }

    try {
      const res = await fetch(`/api/tasks/${id}`, { method: "DELETE" })
      const data = await res.json()

      if (data.success) {
        setTasks((prev) => prev.filter((t) => t._id !== id && t.id !== id))
        toast.success("Task deleted ")
      } else {
        toast.error(data.message || "Failed to delete task")
      }
    } catch (error) {
      console.error("Delete error:", error)
      toast.error("Error deleting task")
    }
  }

  return { tasks, loading, addTask, updateTask, deleteTask }
}
