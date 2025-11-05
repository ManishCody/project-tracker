"use client"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
interface ProjectHeaderProps {
  project?: {
    id: string;
    name: string;
    color?: string;
  } | null;
  onAdd: () => void;
}

export default function ProjectHeader({ project, onAdd }: ProjectHeaderProps) {
  return (
    <div className="flex items-center justify-between">
      <div>
        <h1 className="text-3xl font-bold">{project?.name}</h1>
        <p className="text-muted-foreground mt-1">Manage tasks and track project progress</p>
      </div>
      <Button onClick={onAdd} className="gap-2">
        <Plus className="w-4 h-4" />
        Add Task
      </Button>
    </div>
  )
}
