import { TaskList } from "../../tasks/TaskList";
import { Task } from "@/types/task";

interface TaskContainerProps {
  tasks: Task[];
  onEdit: (task: Task) => void;
  onUpdate: (id: string, updates: Partial<Task>) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
}

export function TaskContainer({ tasks, onEdit, onUpdate, onDelete }: TaskContainerProps) {
  return (
    <TaskList tasks={tasks} onEdit={onEdit} onUpdate={onUpdate} onDelete={onDelete} />
  )
}
