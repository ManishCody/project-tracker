"use client"

import React from "react"

interface TaskFiltersProps {
  searchTerm: string
  setSearchTerm: (value: string) => void
  selectedStatuses: string[]
  setSelectedStatuses: (statuses: string[]) => void
  selectedAssignee: string
  setSelectedAssignee: (value: string) => void
  uniqueAssignees: string[]
}

export function TaskFilters({
  searchTerm,
  setSearchTerm,
  selectedStatuses,
  setSelectedStatuses,
  selectedAssignee,
  setSelectedAssignee,
  uniqueAssignees,
}: TaskFiltersProps) {
  const taskStatuses = ["pending", "in-progress", "completed"]

  const toggleStatus = (status: string) => {
    if (selectedStatuses.includes(status)) {
      setSelectedStatuses(selectedStatuses.filter((s) => s !== status))
    } else {
      setSelectedStatuses([...selectedStatuses, status])
    }
  }

  return (
    <div className="space-y-4">
      {/* Search */}
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
        {/* Status Filter */}
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-muted-foreground">Status:</span>
          <div className="flex gap-2">
            {taskStatuses.map((status) => (
              <label key={status} className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={selectedStatuses.includes(status)}
                  onChange={() => toggleStatus(status)}
                  className="w-4 h-4 rounded border-border text-primary focus:ring-primary"
                />
                <span className="text-sm capitalize">{status.replace("-", " ")}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Assignee Filter */}
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
  )
}
