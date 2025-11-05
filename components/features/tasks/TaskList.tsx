"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Edit2, Trash2, CheckCircle2, Circle, AlertCircle, Save } from "lucide-react"
import { useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"

interface Task {
  id: string
  title: string
  assignee: string
  status: "not-started" | "in-progress" | "completed"
  progress: number
}

interface TaskListProps {
  tasks: Task[]
  onUpdate: (taskId: string, updates: Partial<Task>) => void
  onDelete: (taskId: string) => void
}

export function TaskList({ tasks, onUpdate, onDelete }: TaskListProps) {
  const [editingAssignee, setEditingAssignee] = useState<string | null>(null)
  const [editingValue, setEditingValue] = useState("")

  const getStatusColor = (status: Task["status"]) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-700 border-green-300"
      case "in-progress":
        return "bg-blue-100 text-blue-700 border-blue-300"
      default:
        return "bg-orange-100 text-orange-700 border-orange-300"
    }
  }

  const getStatusLabel = (status: Task["status"]) => {
    switch (status) {
      case "completed":
        return "Done"
      case "in-progress":
        return "In Progress"
      default:
        return "Not Started"
    }
  }

  const cycleStatus = (currentStatus: Task["status"]) => {
    const statuses: Task["status"][] = ["not-started", "in-progress", "completed"]
    const currentIndex = statuses.indexOf(currentStatus)
    return statuses[(currentIndex + 1) % statuses.length]
  }

  const startEditingAssignee = (taskId: string, currentAssignee: string) => {
    setEditingAssignee(taskId)
    setEditingValue(currentAssignee)
  }

  const saveAssignee = (taskId: string) => {
    onUpdate(taskId, { assignee: editingValue })
    setEditingAssignee(null)
  }

  if (tasks.length === 0) {
    return (
      <Card className="p-12 text-center">
        <div className="text-muted-foreground">No tasks found. Create one to get started!</div>
      </Card>
    )
  }

  return (
    <div className="grid gap-4">
      {tasks.map((task) => (
        <Card key={task.id} className="p-6 hover:shadow-lg transition-shadow border border-gray-200">
          <div className="flex items-start justify-between gap-4 mb-4">
            <div className="flex items-start gap-4 flex-1 min-w-0">
              <button
                onClick={() => onUpdate(task.id, { status: cycleStatus(task.status) })}
                className="shrink-0 hover:opacity-70 transition-opacity pt-1"
                title="Click to change status"
              >
                {task.status === "completed" ? (
                  <CheckCircle2 className="w-6 h-6 text-green-500" />
                ) : task.status === "in-progress" ? (
                  <AlertCircle className="w-6 h-6 text-blue-500" />
                ) : (
                  <Circle className="w-6 h-6 text-orange-500" />
                )}
              </button>

              <div className="flex-1 min-w-0">
                <h3 className="text-lg font-semibold text-foreground truncate">{task.title}</h3>
              </div>
            </div>

            <div className="flex gap-2 shrink-0">
              <Button size="sm" variant="ghost" className="hover:bg-gray-100">
                <Edit2 className="w-4 h-4 text-gray-600" />
              </Button>
              <Button size="sm" variant="ghost" onClick={() => onDelete(task.id)} className="hover:bg-gray-100">
                <Trash2 className="w-4 h-4 text-red-500" />
              </Button>
            </div>
          </div>

          <div className="flex items-center gap-4 flex-wrap">
            <Badge variant="outline" className={`text-sm font-medium px-3 py-1 border ${getStatusColor(task.status)}`}>
              {getStatusLabel(task.status)}
            </Badge>

            {editingAssignee === task.id ? (
              <div className="flex items-center gap-2">
                <Input
                  value={editingValue}
                  onChange={(e) => setEditingValue(e.target.value)}
                  placeholder="Assign to..."
                  className="h-8 text-sm w-40"
                  autoFocus
                />
                <Button size="sm" variant="ghost" onClick={() => saveAssignee(task.id)} className="h-8 w-8 p-0">
                  <Save className="w-4 h-4" />
                </Button>
              </div>
            ) : (
              <div className="text-sm">
                <span className="text-gray-500">Assigned to:</span>
                <button
                  onClick={() => startEditingAssignee(task.id, task.assignee)}
                  className="ml-2 font-medium text-blue-600 hover:underline"
                >
                  {task.assignee || "Unassigned"}
                </button>
              </div>
            )}

            <div className="ml-auto flex items-center gap-3">
              <div className="flex items-center gap-2">
                <div className="w-32 bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-blue-500 h-full rounded-full transition-all"
                    style={{ width: `${task.progress}%` }}
                  />
                </div>
                <span className="text-sm font-semibold text-gray-700 w-10 text-right">{task.progress}%</span>
              </div>
            </div>
          </div>
        </Card>
      ))}
    </div>
  )
}
