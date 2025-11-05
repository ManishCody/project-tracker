import { GanttChart } from "../../tasks/GanttChart";
import { Task } from "@/types/task";

interface TimelineSectionProps {
  tasks: Task[];
}

export function TimelineSection({ tasks }: TimelineSectionProps) {
  // Ensure each task has an id and convert dates to strings if needed
  const processedTasks = tasks.map(task => ({
    ...task,
    id: task._id, // Use _id as id since GanttChart expects id
    startDate: typeof task.startDate === 'string' ? task.startDate : task.startDate.toISOString().split('T')[0],
    endDate: typeof task.endDate === 'string' ? task.endDate : task.endDate.toISOString().split('T')[0],
    progress: task.progress || 0,
    assignee: task.assignee || 'Unassigned'
  }));

  return (
    <div className="lg:col-span-2 space-y-4">
      <h2 className="text-xl font-semibold">Project Timeline</h2>
      <GanttChart tasks={processedTasks} />
    </div>
  )
}
