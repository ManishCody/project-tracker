"use client"

import { useState, useMemo } from "react"
import { DashboardHeader } from "@/components/layout/DashboardHeader"
import { TaskStats } from "./TaskStats"
import { GanttChart } from "@/components/features/tasks/GanttChart"
import { TaskForm } from "@/components/features/tasks/TaskForm"
import { TaskList } from "@/components/features/tasks/TaskList"
import { AnalyticsPanel } from "@/components/features/analytics/AnalyticsPanel"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"

export interface Task {
  id: string
  title: string
  project: string
  assignee: string
  startDate: string
  endDate: string
  status: "not-started" | "in-progress" | "completed"
  progress: number
}

interface Project {
  id: string
  name: string
  color: string
}

const DEMO_PROJECTS: Project[] = [
  { id: "1", name: "Marketing Pro", color: "bg-orange-500" },
  { id: "2", name: "Product Launch", color: "bg-blue-500" },
  { id: "3", name: "Website Redesign", color: "bg-purple-500" },
]

const DEMO_TASKS: Task[] = [
  {
    id: "1",
    title: "Marketing Research",
    project: "1",
    assignee: "Jessica",
    startDate: "2024-01-01",
    endDate: "2024-01-10",
    status: "completed",
    progress: 100,
  },
  {
    id: "2",
    title: "Define Specifications",
    project: "1",
    assignee: "Alex",
    startDate: "2024-01-05",
    endDate: "2024-01-12",
    status: "in-progress",
    progress: 60,
  },
  {
    id: "3",
    title: "Marketing Plan",
    project: "1",
    assignee: "Sarah",
    startDate: "2024-01-08",
    endDate: "2024-01-15",
    status: "in-progress",
    progress: 45,
  },
  {
    id: "4",
    title: "Detail Design",
    project: "2",
    assignee: "Mike",
    startDate: "2024-01-10",
    endDate: "2024-01-18",
    status: "in-progress",
    progress: 75,
  },
  {
    id: "5",
    title: "Software Development",
    project: "2",
    assignee: "Emma",
    startDate: "2024-01-15",
    endDate: "2024-02-05",
    status: "in-progress",
    progress: 55,
  },
  {
    id: "6",
    title: "Test Plan",
    project: "2",
    assignee: "David",
    startDate: "2024-01-20",
    endDate: "2024-02-02",
    status: "not-started",
    progress: 0,
  },
  {
    id: "7",
    title: "Testing & QA",
    project: "3",
    assignee: "Lisa",
    startDate: "2024-02-01",
    endDate: "2024-02-10",
    status: "not-started",
    progress: 0,
  },
  {
    id: "8",
    title: "User Documentation",
    project: "3",
    assignee: "John",
    startDate: "2024-02-05",
    endDate: "2024-02-15",
    status: "not-started",
    progress: 0,
  },
]

export function Dashboard() {
  const [selectedProject, setSelectedProject] = useState<string>("1")
  const [tasks, setTasks] = useState<Task[]>(DEMO_TASKS)
  const [showTaskForm, setShowTaskForm] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")

  const filteredTasks = useMemo(() => {
    return tasks.filter((task) => {
      const matchesProject = task.project === selectedProject
      const matchesSearch =
        task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        task.assignee.toLowerCase().includes(searchTerm.toLowerCase())
      return matchesProject && matchesSearch
    })
  }, [tasks, selectedProject, searchTerm])

  const stats = useMemo(() => {
    const projectTasks = tasks.filter((t) => t.project === selectedProject)
    const completed = projectTasks.filter((t) => t.status === "completed").length
    const inProgress = projectTasks.filter((t) => t.status === "in-progress").length
    const notStarted = projectTasks.filter((t) => t.status === "not-started").length
    const avgProgress =
      projectTasks.length > 0
        ? Math.round(projectTasks.reduce((sum, t) => sum + t.progress, 0) / projectTasks.length)
        : 0

    return { completed, inProgress, notStarted, avgProgress, total: projectTasks.length }
  }, [tasks, selectedProject])

  const handleAddTask = (newTask: Omit<Task, "id">) => {
    const task: Task = {
      ...newTask,
      id: Date.now().toString(),
    }
    setTasks([...tasks, task])
    setShowTaskForm(false)
  }

  const handleUpdateTask = (taskId: string, updates: Partial<Task>) => {
    setTasks(tasks.map((t) => (t.id === taskId ? { ...t, ...updates } : t)))
  }

  const handleDeleteTask = (taskId: string) => {
    setTasks(tasks.filter((t) => t.id !== taskId))
  }

  const currentProject = DEMO_PROJECTS.find((p) => p.id === selectedProject)

  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      <DashboardHeader
        projects={DEMO_PROJECTS}
        selectedProject={selectedProject}
        onProjectChange={setSelectedProject}
      />

      <div className="flex-1 overflow-auto">
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

            <AnalyticsPanel tasks={tasks} selectedProject={selectedProject} />
          </div>

          <div className="space-y-4">
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
            <TaskList tasks={filteredTasks} onUpdate={handleUpdateTask} onDelete={handleDeleteTask} />
          </div>
        </div>
      </div>

      {showTaskForm && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <TaskForm
            projects={DEMO_PROJECTS}
            onSubmit={handleAddTask}
            onCancel={() => setShowTaskForm(false)}
            defaultProject={selectedProject}
          />
        </div>
      )}
    </div>
  )
}
