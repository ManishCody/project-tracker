"use client"

import { useState, useMemo, useEffect } from "react"
import { DashboardHeader } from "@/components/layout/DashboardHeader"
import { TaskStats } from "./TaskStats"
import { GanttChart } from "@/components/features/tasks/GanttChart"
import { TaskForm } from "@/components/features/tasks/TaskForm"
import { TaskList } from "@/components/features/tasks/TaskList"
import { AnalyticsPanel } from "@/components/features/analytics/AnalyticsPanel"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import { toast } from "sonner"

export interface Task {
  _id?: string
  id: string
  title: string
  description?: string
  project: string
  assignee: string
  startDate: string
  endDate: string
  status: "pending" | "in-progress" | "completed"
  priority?: "low" | "medium" | "high"
  progress: number
  tags?: string[]
}

interface Project {
  id: string
  name: string
  color: string
}

const DEMO_PROJECTS: Project[] = [
  { id: "all", name: "All", color: "bg-gray-500" },
  { id: "1", name: "Task Tracker", color: "bg-orange-500" },
  { id: "2", name: "Product Launch", color: "bg-blue-500" },
  { id: "3", name: "Website Redesign", color: "bg-purple-500" },
]

export function Dashboard() {
  const [selectedProject, setSelectedProject] = useState<string>("all") // Start with "all"
  const [tasks, setTasks] = useState<Task[]>([])
  const [showTaskForm, setShowTaskForm] = useState(false)
  const [editingTask, setEditingTask] = useState<Task | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedStatuses, setSelectedStatuses] = useState<string[]>(["pending", "in-progress", "completed"])
  const [selectedAssignee, setSelectedAssignee] = useState<string>("all")
  const [loading, setLoading] = useState(true)

  // Fetch tasks from API
  useEffect(() => {
    fetchTasks()
  }, [])

  const fetchTasks = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/tasks')
      const data = await response.json()
      
      if (data.success) {
        // Transform API data to match frontend format
        const transformedTasks: Task[] = data.data.map((task: any) => ({
          id: task._id,
          _id: task._id,
          title: task.title,
          description: task.description,
          project: task.project || "1", // Use project from API or default to "1"
          assignee: task.assignee || "Unassigned",
          startDate: task.startDate,
          endDate: task.endDate,
          status: task.status,
          priority: task.priority,
          progress: task.progress !== undefined ? task.progress : 0,
          tags: task.tags
        }))
        setTasks(transformedTasks)
      }
    } catch (error) {
      console.error('Error fetching tasks:', error)
    } finally {
      setLoading(false)
    }
  }

  // Get unique assignees for filter
  const uniqueAssignees = useMemo(() => {
    const assignees = new Set<string>()
    tasks.forEach(task => {
      if (task.assignee && task.assignee !== "Unassigned") {
        assignees.add(task.assignee)
      }
    })
    return Array.from(assignees).sort()
  }, [tasks])

  const filteredTasks = useMemo(() => {
    return tasks.filter((task) => {
      const matchesProject = selectedProject === "all" || task.project === selectedProject
      
      // Filter by status
      const matchesStatus = selectedStatuses.includes(task.status)
      
      // Filter by assignee (show all if "all" is selected)
      const matchesAssignee = selectedAssignee === "all" || task.assignee === selectedAssignee
      
      // Filter by search term
      const matchesSearch =
        task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        task.assignee.toLowerCase().includes(searchTerm.toLowerCase())
      
      return matchesProject && matchesStatus && matchesAssignee && matchesSearch
    })
  }, [tasks, selectedProject, searchTerm, selectedStatuses, selectedAssignee])

  const stats = useMemo(() => {
    // Filter tasks based on selected project
    const projectTasks = selectedProject === "all" 
      ? tasks 
      : tasks.filter((t) => t.project === selectedProject)
    
    const completed = projectTasks.filter((t) => t.status === "completed").length
    const inProgress = projectTasks.filter((t) => t.status === "in-progress").length
    const pending = projectTasks.filter((t) => t.status === "pending").length
    const avgProgress =
      projectTasks.length > 0
        ? Math.round(projectTasks.reduce((sum, t) => sum + t.progress, 0) / projectTasks.length)
        : 0

    return { completed, inProgress, notStarted: pending, avgProgress, total: projectTasks.length }
  }, [tasks, selectedProject])

  const handleAddTask = async (newTask: Omit<Task, "id">) => {
    try {
      const response = await fetch('/api/tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: newTask.title,
          description: newTask.description || `Task for ${newTask.title}`,
          status: newTask.status,
          priority: newTask.priority, // Optional - can be undefined
          startDate: newTask.startDate,
          endDate: newTask.endDate,
          assignee: newTask.assignee,
          project: newTask.project, // Store project in API
          progress: newTask.progress || 0,
          tags: newTask.tags || []
        })
      })
      
      const data = await response.json()
      if (data.success) {
        // Optimize: Add new task to local state instead of refetching
        const createdTask = data.data
        const transformedTask: Task = {
          id: createdTask._id,
          _id: createdTask._id,
          title: createdTask.title,
          description: createdTask.description,
          project: createdTask.project || "1", // Use project from API or default
          assignee: createdTask.assignee || "Unassigned",
          startDate: createdTask.startDate,
          endDate: createdTask.endDate,
          status: createdTask.status,
          priority: createdTask.priority,
          progress: createdTask.progress !== undefined ? createdTask.progress : 0,
          tags: createdTask.tags || []
        }
        setTasks(prevTasks => [...prevTasks, transformedTask])
        setShowTaskForm(false)
        toast.success('Task created successfully!')
      } else {
        // Show error message
        toast.error(data.error || 'Failed to create task')
      }
    } catch (error) {
      console.error('Error adding task:', error)
      toast.error('Failed to create task. Please try again.')
    }
  }

  const handleEditTask = (task: Task) => {
    setEditingTask(task)
    setShowTaskForm(true)
  }

  const handleUpdateTaskForm = async (updatedTask: Omit<Task, "id">) => {
    if (!editingTask) return
    
    try {
      const response = await fetch(`/api/tasks/${editingTask._id || editingTask.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: updatedTask.title,
          description: updatedTask.description,
          status: updatedTask.status,
          priority: updatedTask.priority,
          startDate: updatedTask.startDate,
          endDate: updatedTask.endDate,
          assignee: updatedTask.assignee,
          project: updatedTask.project,
          progress: updatedTask.progress || 0,
          tags: updatedTask.tags || []
        })
      })
      
      const data = await response.json()
      if (data.success) {
        // Optimize: Update local state instead of refetching
        const updatedTaskData = data.data
        setTasks(prevTasks => 
          prevTasks.map(task => 
            task.id === editingTask.id || task._id === editingTask._id
              ? {
                  ...task,
                  title: updatedTaskData.title || task.title,
                  description: updatedTaskData.description || task.description,
                  assignee: updatedTaskData.assignee || task.assignee,
                  startDate: updatedTaskData.startDate || task.startDate,
                  endDate: updatedTaskData.endDate || task.endDate,
                  status: updatedTaskData.status || task.status,
                  priority: updatedTaskData.priority !== undefined ? updatedTaskData.priority : task.priority,
                  project: updatedTaskData.project !== undefined ? updatedTaskData.project : task.project,
                  progress: updatedTaskData.progress !== undefined ? updatedTaskData.progress : task.progress,
                  tags: updatedTaskData.tags || task.tags
                }
              : task
          )
        )
        setShowTaskForm(false)
        setEditingTask(null)
        toast.success('Task updated successfully!')
      } else {
        toast.error(data.error || 'Failed to update task')
      }
    } catch (error) {
      console.error('Error updating task:', error)
      toast.error('Failed to update task. Please try again.')
    }
  }

  const handleUpdateTask = async (taskId: string, updates: Partial<Task>) => {
    try {
      const response = await fetch(`/api/tasks/${taskId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates)
      })
      
      const data = await response.json()
      if (data.success) {
        // Optimize: Update local state instead of refetching
        const updatedTask = data.data
        setTasks(prevTasks => 
          prevTasks.map(task => 
            task.id === taskId || task._id === taskId
              ? {
                  ...task,
                  title: updatedTask.title || task.title,
                  description: updatedTask.description || task.description,
                  assignee: updatedTask.assignee || task.assignee,
                  startDate: updatedTask.startDate || task.startDate,
                  endDate: updatedTask.endDate || task.endDate,
                  status: updatedTask.status || task.status,
                  priority: updatedTask.priority !== undefined ? updatedTask.priority : task.priority,
                  project: updatedTask.project !== undefined ? updatedTask.project : task.project,
                  progress: updatedTask.progress !== undefined ? updatedTask.progress : task.progress,
                  tags: updatedTask.tags || task.tags
                }
              : task
          )
        )
        toast.success('Task updated successfully!')
      } else {
        toast.error(data.error || 'Failed to update task')
      }
    } catch (error) {
      console.error('Error updating task:', error)
      toast.error('Failed to update task. Please try again.')
    }
  }

  const handleDeleteTask = async (taskId: string) => {
    try {
      const response = await fetch(`/api/tasks/${taskId}`, {
        method: 'DELETE'
      })
      
      const data = await response.json()
      if (data.success) {
        // Optimize: Remove task from local state instead of refetching
        setTasks(prevTasks => prevTasks.filter(task => task.id !== taskId && task._id !== taskId))
        toast.success('Task deleted successfully!')
      } else {
        toast.error(data.error || 'Failed to delete task')
      }
    } catch (error) {
      console.error('Error deleting task:', error)
      toast.error('Failed to delete task. Please try again.')
    }
  }

  const currentProject = DEMO_PROJECTS.find((p) => p.id === selectedProject)

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-xl">Loading tasks...</div>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      <DashboardHeader
        projects={DEMO_PROJECTS}
        selectedProject={selectedProject}
        onProjectChange={setSelectedProject}
      />

      <div className="flex-1 overflow-y-auto">
        <div className="max-w-7xl mx-auto p-6 space-y-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold">{currentProject?.name}</h1>
              <p className="text-muted-foreground mt-1">Manage tasks and track project progress</p>
            </div>
            <Button onClick={() => setShowTaskForm(true)} className="gap-2">
              <Plus className="w-4 h-4" />
              Add Task
            </Button>
          </div>

          <TaskStats stats={stats} />

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-4">
              <h2 className="text-xl font-semibold">Project Timeline</h2>
              <GanttChart tasks={filteredTasks} />
            </div>

            <AnalyticsPanel tasks={filteredTasks} selectedProject={selectedProject} />
          </div>

          <div className="space-y-4">
            <div className="flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold">Tasks</h2>
                <input
                  type="text"
                  placeholder="Search tasks or assignees..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="px-4 py-2 rounded-lg bg-card border border-border text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              
              {/* Filters */}
              <div className="flex flex-wrap items-center gap-4 p-4 bg-card rounded-lg border border-border">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-muted-foreground">Status:</span>
                  <div className="flex gap-2">
                    {["pending", "in-progress", "completed"].map((status) => (
                      <label key={status} className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={selectedStatuses.includes(status)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSelectedStatuses([...selectedStatuses, status])
                            } else {
                              setSelectedStatuses(selectedStatuses.filter(s => s !== status))
                            }
                          }}
                          className="w-4 h-4 rounded border-border text-primary focus:ring-primary"
                        />
                        <span className="text-sm capitalize">{status.replace("-", " ")}</span>
                      </label>
                    ))}
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-muted-foreground">Assignee:</span>
                  <select
                    value={selectedAssignee}
                    onChange={(e) => setSelectedAssignee(e.target.value)}
                    className="px-3 py-1.5 rounded-md bg-input border border-border text-foreground focus:outline-none focus:ring-2 focus:ring-primary text-sm"
                  >
                    <option value="all">All Assignees</option>
                    {uniqueAssignees.map((assignee) => (
                      <option key={assignee} value={assignee}>
                        {assignee}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
            <TaskList tasks={filteredTasks} onUpdate={handleUpdateTask} onDelete={handleDeleteTask} onEdit={handleEditTask} />
          </div>
        </div>
      </div>

      {showTaskForm && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <TaskForm
            projects={DEMO_PROJECTS.filter(p => p.id !== "all")}
            task={editingTask || undefined}
            onSubmit={editingTask ? handleUpdateTaskForm : handleAddTask}
            onCancel={() => {
              setShowTaskForm(false)
              setEditingTask(null)
            }}
            defaultProject={selectedProject === "all" ? "1" : selectedProject}
          />
        </div>
      )}
    </div>
  )
}
