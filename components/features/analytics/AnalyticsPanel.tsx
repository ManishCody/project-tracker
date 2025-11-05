"use client"

import { useMemo } from "react"
import { Card } from "@/components/ui/card"
import { DoughnutChart } from "./chart/DoughnutChart"

interface Task {
  id: string
  status: "pending" | "in-progress" | "completed"
  project: string
  progress: number
  priority?: "low" | "medium" | "high"
}

interface AnalyticsPanelProps {
  tasks: Task[]
  selectedProject: string
}

export function AnalyticsPanel({ tasks, selectedProject }: AnalyticsPanelProps) {
  // If "all" is selected, use all tasks, otherwise filter by project
  const projectTasks = selectedProject === "all" 
    ? tasks 
    : tasks.filter((t) => t.project === selectedProject)

  const statusBreakdown = useMemo(() => {
    const completed = projectTasks.filter((t) => t.status === "completed").length
    const inProgress = projectTasks.filter((t) => t.status === "in-progress").length
    const pending = projectTasks.filter((t) => t.status === "pending").length

    return {
      labels: ["Completed", "In Progress", "Pending"],
      data: [completed, inProgress, pending],
    }
  }, [projectTasks])

  return (
    <div className="space-y-4">
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Task Status</h3>
        <DoughnutChart data={statusBreakdown} />
      </Card>

      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Team Performance</h3>
        <div className="space-y-3">
          <div className="flex justify-between items-center text-sm">
            <span className="text-muted-foreground">Assigned Tasks</span>
            <span className="font-medium">{projectTasks.length}</span>
          </div>
          <div className="flex justify-between items-center text-sm">
            <span className="text-muted-foreground">On Track</span>
            <span className="font-medium text-green-500">{projectTasks.filter((t) => t.progress >= 50).length}</span>
          </div>
          <div className="flex justify-between items-center text-sm">
            <span className="text-muted-foreground">At Risk</span>
            <span className="font-medium text-orange-500">
              {projectTasks.filter((t) => t.progress < 50 && t.status !== "completed").length}
            </span>
          </div>
        </div>
      </Card>
    </div>
  )
}
