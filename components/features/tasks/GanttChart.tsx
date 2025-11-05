"use client"

import type React from "react"
import { useMemo, useState, useRef } from "react"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ChevronRight, ZoomIn, ZoomOut } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Task } from "@/types/task"

interface GanttChartProps {
  tasks: Array<Omit<Task, 'id'> & { id: string }> // Ensure id is always present
}

export function GanttChart({ tasks }: GanttChartProps) {
  const [hoveredTaskId, setHoveredTaskId] = useState<string | null>(null)
  const [zoom, setZoom] = useState(1) 
  const scrollContainerRef = useRef<HTMLDivElement>(null)

  const { startDate, endDate, dayCount } = useMemo(() => {
    if (tasks.length === 0) {
      const today = new Date()
      return {
        startDate: today,
        endDate: new Date(today.getTime() + 60 * 24 * 60 * 60 * 1000),
        dayCount: 60,
      }
    }

    const dates = tasks.flatMap((t) => [new Date(t.startDate), new Date(t.endDate)])
    const minDate = new Date(Math.min(...dates.map((d) => d.getTime())))
    const maxDate = new Date(Math.max(...dates.map((d) => d.getTime())))

    minDate.setDate(1)
    maxDate.setMonth(maxDate.getMonth() + 1, 0)

    const dayCount = Math.ceil((maxDate.getTime() - minDate.getTime()) / (1000 * 60 * 60 * 24)) + 1

    return { startDate: minDate, endDate: maxDate, dayCount }
  }, [tasks])

  const monthRangeDisplay = useMemo(() => {
    const startMonth = startDate.toLocaleDateString("en-US", { month: "long", year: "numeric" })
    const endMonth = endDate.toLocaleDateString("en-US", { month: "long", year: "numeric" })
    return startMonth === endMonth ? startMonth : `${startMonth} - ${endMonth}`
  }, [startDate, endDate])

  const getDayPosition = (dateStr: string | Date) => {
    const taskDate = typeof dateStr === 'string' ? new Date(dateStr) : dateStr
    const days = Math.floor((taskDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24))
    return Math.max(0, days)
  }

  const getDayWidth = (startStr: string | Date, endStr: string | Date) => {
    const start = getDayPosition(startStr)
    const end = getDayPosition(endStr)
    return Math.max(1, end - start + 1)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-emerald-500 hover:bg-emerald-600"
      case "in-progress":
        return "bg-blue-500 hover:bg-blue-600"
      case "not-started":
        return "bg-orange-400 hover:bg-orange-500"
      default:
        return "bg-slate-400 hover:bg-slate-500"
    }
  }

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-emerald-50 text-emerald-700 border-emerald-200"
      case "in-progress":
        return "bg-blue-50 text-blue-700 border-blue-200"
      case "not-started":
        return "bg-orange-50 text-orange-700 border-orange-200"
      default:
        return "bg-slate-100 text-slate-600 border-slate-200"
    }
  }

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "completed":
        return "Done"
      case "in-progress":
        return "In Progress"
      default:
        return "Not Started"
    }
  }

  const handleZoomIn = () => {
    setZoom((prev) => Math.min(prev + 0.5, 2))
  }

  const handleZoomOut = () => {
    setZoom((prev) => Math.max(prev - 0.5, 0.5))
  }

  const handleWheel = (e: React.WheelEvent) => {
    if (e.ctrlKey || e.metaKey) {
      e.preventDefault()
      if (e.deltaY < 0) {
        handleZoomIn()
      } else {
        handleZoomOut()
      }
    }
  }

  const cellWidth = 52 * zoom

  if (tasks.length === 0) {
    return (
      <Card className="p-12 text-center border border-border">
        <div className="text-muted-foreground">No tasks to display on the timeline</div>
      </Card>
    )
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between px-6 py-3 bg-slate-50 rounded-lg border border-border">
        <div>
          <p className="text-sm font-semibold text-slate-900">Viewing: {monthRangeDisplay}</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={handleZoomOut} className="gap-1 bg-transparent hover:bg-black hover:text-white">
            <ZoomOut className="w-4 h-4" />
            Out
          </Button>
          <Button variant="outline" size="sm" onClick={handleZoomIn} className="gap-1 bg-transparent hover:bg-black hover:text-white">
            <ZoomIn className="w-4 h-4" />
            In
          </Button>
        </div>
      </div>

      <Card className="overflow-hidden border border-border bg-white">
        <div 
          ref={scrollContainerRef} 
          className="overflow-auto" 
          onWheel={handleWheel}
          style={{ maxHeight: '400px', height: '400px' }}
        >
          <div className="min-w-max p-6">
            <div className="flex gap-2 mb-6">
              <div className="w-56 shrink-0" />
              <div className="flex">
                {Array.from({ length: dayCount }).map((_, i) => {
                  const date = new Date(startDate.getTime() + i * 24 * 60 * 60 * 1000)
                  const isWeekend = date.getDay() === 0 || date.getDay() === 6
                  const isFirstDayOfMonth = date.getDate() === 1

                  return (
                    <div
                      key={i}
                      className={`shrink-0 text-center text-xs font-medium py-2 px-1 rounded border-r border-slate-200 ${
                        isWeekend ? "bg-slate-100 text-slate-600" : "text-slate-700"
                      } ${isFirstDayOfMonth ? "border-l-2 border-l-slate-400" : ""}`}
                      style={{ width: cellWidth }}
                      title={date.toLocaleDateString()}
                    >
                      {isFirstDayOfMonth && (
                        <div className="text-xs font-bold text-slate-800 mb-1">
                          {date.toLocaleDateString("en-US", { month: "short" })}
                        </div>
                      )}
                      {date.getDate()}
                    </div>
                  )
                })}
              </div>
            </div>

            {tasks.map((task) => (
              <div
                key={task.id}
                className={`flex gap-2 mb-3 items-center transition-all rounded-lg p-3 ${
                  hoveredTaskId === task.id ? "bg-blue-50 ring-1 ring-blue-300" : "hover:bg-slate-50"
                }`}
                onMouseEnter={() => setHoveredTaskId(task.id)}
                onMouseLeave={() => setHoveredTaskId(null)}
              >
                <div className="w-56 shrink-0 pr-4">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-semibold truncate leading-tight text-slate-900">{task.title}</h4>
                      <div className="flex items-center gap-2 mt-1">
                        <ChevronRight className="w-3 h-3 text-slate-400 shrink-0 " />
                        <span className="text-xs text-slate-600 truncate">{task.assignee}</span>
                      </div>
                    </div>
                  </div>
                  <Badge variant="outline" className={`mt-2 text-xs font-medium ${getStatusBadgeColor(task.status)}`}>
                    {getStatusLabel(task.status)}
                  </Badge>
                </div>

                <div className="flex gap-1 relative flex-1" style={{ minWidth: `${dayCount * cellWidth}px` }}>
                  <div className="absolute inset-0 flex pointer-events-none">
                    {Array.from({ length: dayCount }).map((_, i) => {
                      const isWeekend =
                        new Date(startDate.getTime() + i * 24 * 60 * 60 * 1000).getDay() === 0 ||
                        new Date(startDate.getTime() + i * 24 * 60 * 60 * 1000).getDay() === 6
                      return (
                        <div
                          key={i}
                          className={`shrink-0 border-r border-slate-200 ${isWeekend ? "bg-slate-50" : ""}`}
                          style={{ width: cellWidth }}
                        />
                      )
                    })}
                  </div>

                  <div className="relative h-12 flex items-center">
                    <div
                      className={`absolute h-full rounded-md flex items-center px-3 text-xs font-bold transition-all shadow-sm ${getStatusColor(
                        task.status,
                      )}`}
                      style={{
                        width: `${getDayWidth(task.startDate, task.endDate) * cellWidth - 4}px`,
                        marginLeft: `${getDayPosition(task.startDate) * cellWidth}px`,
                        opacity: 0.9,
                      }}
                      title={`${task.title} - ${task.progress}% complete`}
                    >
                      <div className="text-white flex items-center gap-1">
                        <span>{task.progress}%</span>
                      </div>

                      <div className="absolute bottom-0 left-0 right-0 h-1 bg-black/10 rounded-b-md overflow-hidden">
                        <div className="h-full bg-white/60" style={{ width: `${task.progress}%` }} />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}

            <div className="mt-8 pt-4 border-t border-slate-200 flex gap-6 text-xs">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-emerald-500 rounded" />
                <span className="text-slate-600">Completed</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-blue-500 rounded" />
                <span className="text-slate-600">In Progress</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-orange-400 rounded" />
                <span className="text-slate-600">Not Started</span>
              </div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  )
}
