"use client"

import { Card } from "@/components/ui/card"
import { CheckCircle2, Clock, AlertCircle, TrendingUp } from "lucide-react"

interface TaskStatsProps {
  stats: {
    completed: number
    inProgress: number
    notStarted: number
    avgProgress: number
    total: number
  }
}

export function TaskStats({ stats }: TaskStatsProps) {
  const completionPercentage = stats.total > 0 ? Math.round((stats.completed / stats.total) * 100) : 0

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <Card className="p-5 border-l-4 border-green-500/50">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm text-muted-foreground font-medium">Completed</p>
            <p className="text-3xl font-bold mt-2">{stats.completed}</p>
            <p className="text-xs text-green-600 mt-1 font-medium">{completionPercentage}% of total</p>
          </div>
          <CheckCircle2 className="w-8 h-8 text-green-500 opacity-20" />
        </div>
      </Card>

      <Card className="p-5 border-l-4 border-blue-500/50">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm text-muted-foreground font-medium">In Progress</p>
            <p className="text-3xl font-bold mt-2">{stats.inProgress}</p>
            <p className="text-xs text-blue-600 mt-1 font-medium">Currently active</p>
          </div>
          <Clock className="w-8 h-8 text-blue-500 opacity-20" />
        </div>
      </Card>

      <Card className="p-5 border-l-4 border-accent/90">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm text-muted-foreground font-medium">Not Started</p>
            <p className="text-3xl font-bold mt-2">{stats.notStarted}</p>
            <p className="text-xs text-muted-foreground mt-1 font-medium">Pending tasks</p>
          </div>
          <AlertCircle className="w-8 h-8 text-muted-foreground opacity-20" />
        </div>
      </Card>

      <Card className="p-5 border-l-4 border-accent/50">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm text-muted-foreground font-medium">Avg Progress</p>
            <p className="text-3xl font-bold mt-2">{stats.avgProgress}%</p>
            <p className="text-xs text-accent mt-1 font-medium">Overall project</p>
          </div>
          <TrendingUp className="w-8 h-8 text-accent opacity-20" />
        </div>
      </Card>
    </div>
  )
}
