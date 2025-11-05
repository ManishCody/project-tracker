"use client"

import type React from "react"
import { useState } from "react"
import type { Task } from "@/types/task"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card } from "@/components/ui/card"
import { toast } from "sonner"

interface Project {
  id: string
  name: string
}

interface TaskFormProps {
  projects?: Project[]
  defaultProject?: string
  task?: Task // For edit mode
  onSubmit: (task: Omit<Task, "_id" | "createdAt" | "updatedAt">) => Promise<void> | void
  onCancel: () => void
}

export function TaskForm({ projects = [], defaultProject = "", task, onSubmit, onCancel }: TaskFormProps) {
  const isEditMode = !!task
  const [title, setTitle] = useState(task?.title || "")
  const [assignee, setAssignee] = useState(task?.assignee || "")
  const [project, setProject] = useState(task?.project || defaultProject)
  
  // Helper function to format date for input[type="date"]
  const formatDateForInput = (date: string | Date | undefined): string => {
    if (!date) return ''
    const d = typeof date === 'string' ? new Date(date) : date
    return d.toISOString().split('T')[0]
  }

  const [startDate, setStartDate] = useState(() => formatDateForInput(task?.startDate))
  const [endDate, setEndDate] = useState(() => formatDateForInput(task?.endDate))
  const [status, setStatus] = useState<Task["status"]>(task?.status || "in-progress")
  const [progress, setProgress] = useState(task?.progress || 0)
  const [priority, setPriority] = useState<"low" | "medium" | "high">(task?.priority || "medium")
  const [description, setDescription] = useState(task?.description || "")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!title || !startDate || !endDate || !project) {
      toast.error("Please fill in all required fields")
      return
    }
    
    if (!description || description.trim().length < 10) {
      toast.error("Description must be at least 10 characters")
      return
    }
    
    const start = new Date(startDate)
    const end = new Date(endDate)
    if (!(end > start)) {
      toast.error("End date must be after start date")
      return
    }
    
    setIsSubmitting(true)
    try {
      await onSubmit({
        title,
        description,
        project,
        assignee,
        startDate,
        endDate,
        status,
        ...(priority && { priority }),
        progress,
      } as Omit<Task, "id">)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Card className="w-full max-w-md p-6 shadow-lg">
      <h2 className="text-2xl font-bold mb-6">{isEditMode ? "Edit Task" : "Create New Task"}</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Label htmlFor="title">Task Title *</Label>
          <Input
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter task title"
            required
          />
        </div>

        <div>
          <Label htmlFor="project">Project *</Label>
          <select
            id="project"
            value={project}
            onChange={(e) => setProject(e.target.value)}
            className="w-full px-3 py-2 border rounded-md bg-input text-foreground border-border"
            required
          >
            <option value="">Select a project</option>
            {projects.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <Label htmlFor="description">Description *</Label>
          <Input
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Enter task description (min 10 characters)"
            required
          />
        </div>

        <div>
          <Label htmlFor="assignee">Assignee</Label>
          <Input
            id="assignee"
            value={assignee}
            onChange={(e) => setAssignee(e.target.value)}
            placeholder="Assign to..."
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="startDate">Start Date *</Label>
            <Input
              id="startDate"
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              required
            />
          </div>

          <div>
            <Label htmlFor="endDate">End Date *</Label>
            <Input id="endDate" type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} required />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="status">Status</Label>
            <select
              id="status"
              value={status}
              onChange={(e) => setStatus(e.target.value as Task["status"])}
              className="w-full px-3 py-2 border rounded-md bg-input text-foreground border-border"
            >
              <option value="pending">Pending</option>
              <option value="in-progress">In Progress</option>
              <option value="completed">Completed</option>
            </select>
          </div>

          <div>
            <Label htmlFor="priority">Priority</Label>
            <select
              id="priority"
              value={priority}
              onChange={(e) => setPriority(e.target.value as "low" | "medium" | "high")}
              className="w-full px-3 py-2 border rounded-md bg-input text-foreground border-border"
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </div>
        </div>

        <div>
          <Label htmlFor="progress">Progress (%) - Max 100</Label>
          <Input
            id="progress"
            type="number"
            min="0"
            max="100"
            value={progress}
            onChange={(e) => {
              const val = e.target.value
              const numVal = val === '' ? 0 : Math.min(100, Math.max(0, parseInt(val, 10)))
              setProgress(isNaN(numVal) ? 0 : numVal)
            }}
            onBlur={(e) => {
              const val = parseInt(e.target.value, 10)
              if (isNaN(val) || val < 0) setProgress(0)
              else if (val > 100) setProgress(100)
            }}
            placeholder="0-100"
          />
        </div>

        <div className="flex gap-2 justify-end pt-4">
          <Button type="button" variant="outline" onClick={onCancel} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? (isEditMode ? "Updating..." : "Creating...") : (isEditMode ? "Update Task" : "Create Task")}
          </Button>
        </div>
      </form>
    </Card>
  )
}
