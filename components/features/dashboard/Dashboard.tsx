"use client"

import { useState, useMemo } from "react"
import { useTasks } from "@/hook/useTasks"
import { DashboardHeader } from "@/components/layout/DashboardHeader"
import { TaskStats } from "./TaskStats"
import { AnalyticsPanel } from "../analytics/AnalyticsPanel"

import ProjectHeader from "./component/ProjectHeader"
import { TaskFilters } from "./component/TaskFilters"
import { TimelineSection } from "./component/TimelineSection"
import { TaskContainer } from "./component/TaskContainer"
import { TaskForm } from "../tasks/TaskForm"
import { Task, Project as ProjectType } from "@/types/task"

interface DashboardProject {
  id: string;
  name: string;
  color: string;
}

const DEMO_PROJECTS: DashboardProject[] = [
  { id: "all", name: "All", color: "bg-gray-500" },
  { id: "1", name: "Task Tracker", color: "bg-orange-500" },
  { id: "2", name: "Product Launch", color: "bg-blue-500" },
  { id: "3", name: "Website Redesign", color: "bg-purple-500" },
]

export function Dashboard() {
  const { tasks, loading, addTask, updateTask, deleteTask } = useTasks()

  const handleSubmitTask = async (taskData: Omit<Task, '_id' | 'createdAt' | 'updatedAt'>) => {
    try {
      if (editingTask && editingTask._id) {
        await updateTask(editingTask._id, taskData)
      } else {
        await addTask(taskData)
      }
      setShowTaskForm(false)
      setEditingTask(null)
    } catch (error) {
      console.error('Error saving task:', error)
    }
  }

  const [selectedProject, setSelectedProject] = useState("all")
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedStatuses, setSelectedStatuses] = useState(["pending", "in-progress", "completed"])
  const [selectedAssignee, setSelectedAssignee] = useState("all")
  const [showTaskForm, setShowTaskForm] = useState(false)
  const [editingTask, setEditingTask] = useState<Task | null>(null)

  const currentProject = useMemo(() => {
    return DEMO_PROJECTS.find((p) => p.id === selectedProject) || null
  }, [selectedProject])

  const uniqueAssignees = useMemo(() => {
    return Array.from(new Set(tasks.map((t) => t.assignee || '').filter((a) => a && a !== "Unassigned"))).sort()
  }, [tasks])

  const filteredTasks = useMemo(() => {
    return tasks.filter((task: Task) => {
      const matchProject = selectedProject === "all" || task.project === selectedProject
      const matchStatus = selectedStatuses.includes(task.status)
      const matchAssignee = selectedAssignee === "all" || task.assignee === selectedAssignee
      const matchSearch =
        task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (task.assignee || '').toLowerCase().includes(searchTerm.toLowerCase())

      return matchProject && matchStatus && matchAssignee && matchSearch
    })
  }, [tasks, selectedProject, selectedStatuses, selectedAssignee, searchTerm])

  const stats = useMemo(() => {
    const projectTasks = selectedProject === "all" ? tasks : tasks.filter((t) => t.project === selectedProject)
    const completed = projectTasks.filter((t) => t.status === "completed").length
    const inProgress = projectTasks.filter((t) => t.status === "in-progress").length
    const pending = projectTasks.filter((t) => t.status === "pending").length
    const avgProgress =
      projectTasks.length > 0
        ? Math.round(projectTasks.reduce((sum, t) => sum + (t.progress || 0), 0) / projectTasks.length)
        : 0

    return { completed, inProgress, notStarted: pending, avgProgress, total: projectTasks.length }
  }, [tasks, selectedProject])

  const filterProps = {
    searchTerm,
    setSearchTerm,
    selectedStatuses,
    setSelectedStatuses,
    selectedAssignee,
    setSelectedAssignee,
    uniqueAssignees,
  }

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
          <ProjectHeader project={currentProject} onAdd={() => setShowTaskForm(true)} />

          <TaskStats stats={stats} />

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <TimelineSection tasks={filteredTasks} />
            <AnalyticsPanel tasks={filteredTasks} selectedProject={selectedProject} />
          </div>

          <TaskFilters {...filterProps} />

          <TaskContainer
            tasks={filteredTasks}
            onEdit={(task) => { setEditingTask(task); setShowTaskForm(true) }}
            onUpdate={updateTask}
            onDelete={deleteTask}
          />
        </div>
      </div>

      {showTaskForm && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <TaskForm
            projects={DEMO_PROJECTS.filter(p => p.id !== "all")}
            task={editingTask || undefined}
            onSubmit={handleSubmitTask}
            onCancel={() => { setShowTaskForm(false); setEditingTask(null) }}
            defaultProject={selectedProject === "all" ? "1" : selectedProject}
          />
        </div>
      )}
    </div>
  )
}
