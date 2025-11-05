"use client"

import { useMemo } from "react"
import { Card } from "@/components/ui/card"
import { DoughnutChart } from "./chart/DoughnutChart"

interface Task {
  id: string
  status: "not-started" | "in-progress" | "completed"
  project: string
  progress: number
}

interface AnalyticsPanelProps {
  tasks: Task[]
  selectedProject: string
}

export function AnalyticsPanel({ tasks, selectedProject }: AnalyticsPanelProps) {
  const projectTasks = tasks.filter((t) => t.project === selectedProject)

  const statusBreakdown = useMemo(() => {
    const completed = projectTasks.filter((t) => t.status === "completed").length
    const inProgress = projectTasks.filter((t) => t.status === "in-progress").length
    const notStarted = projectTasks.filter((t) => t.status === "not-started").length

    return {
      labels: ["Completed", "In Progress", "Not Started"],
      data: [completed, inProgress, notStarted],
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
