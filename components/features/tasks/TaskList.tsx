"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Edit2, Trash2, CheckCircle2, Circle, AlertCircle, Save, Loader2 } from "lucide-react"
import { useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { useTasks } from "@/context/TaskContext"
import type { Task } from "@/types/task"

interface TaskListProps {
  tasks?: Task[];
  onUpdate?: (taskId: string, updates: Partial<Task>) => Promise<any>;
  onDelete?: (taskId: string) => Promise<void>;
  onEdit?: (task: Task) => void;
}

export function TaskList({ tasks: propTasks, onUpdate: propOnUpdate, onDelete: propOnDelete, onEdit }: TaskListProps) {
  const { tasks: contextTasks, updateTask, deleteTask } = useTasks();
  const [deletingTaskId, setDeletingTaskId] = useState<string | null>(null);

  const tasks = propTasks || contextTasks;
  const handleUpdate = propOnUpdate || updateTask;
  const handleDelete = propOnDelete || deleteTask;
  const [editingAssignee, setEditingAssignee] = useState<string | null>(null);
  const [editingValue, setEditingValue] = useState("");

  const getStatusColor = (status: Task["status"]) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-700 border-green-300";
      case "in-progress":
        return "bg-blue-100 text-blue-700 border-blue-300";
      default:
        return "bg-orange-100 text-orange-700 border-orange-300";
    }
  };

  const cycleStatus = (currentStatus: Task["status"]): Task["status"] => {
    const statuses: Task["status"][] = ["pending", "in-progress", "completed"];
    const currentIndex = statuses.indexOf(currentStatus);
    return statuses[(currentIndex + 1) % statuses.length];
  };

  const startEditingAssignee = (taskId: string, currentAssignee: string) => {
    setEditingAssignee(taskId);
    setEditingValue(currentAssignee);
  };

  const saveAssignee = async (taskId: string) => {
    try {
      if (handleUpdate) {
        await handleUpdate(taskId, { assignee: editingValue });
        setEditingAssignee(null);
      }
    } catch (error) {
      console.error('Error updating assignee:', error);
    }
  };

  if (tasks.length === 0) {
    return (
      <Card className="p-12 text-center">
        <div className="text-muted-foreground">No tasks found. Create one to get started!</div>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {tasks.map((task) => (
        <Card key={task.id} className="p-6 hover:shadow-lg transition-shadow border border-gray-200">
          <div className="flex justify-between items-start">
            <div className="flex items-center space-x-3">
              <button
                onClick={() => task.id && handleUpdate?.(task.id, { status: cycleStatus(task.status) })}
                className="p-1.5 rounded-full hover:bg-gray-100"
                aria-label={`Mark as ${cycleStatus(task.status)}`}
              >
                {task.status === "completed" ? (
                  <CheckCircle2 className="w-5 h-5 text-green-500" />
                ) : task.status === "in-progress" ? (
                  <AlertCircle className="w-5 h-5 text-blue-500" />
                ) : (
                  <Circle className="w-5 h-5 text-gray-300" />
                )}
              </button>
              <div>
                <h3 className="font-medium">{task.title}</h3>
                <p className="text-sm text-gray-500">{task.description}</p>
                {task.progress !== undefined && (
                  <div className="mt-2 flex items-center gap-2">
                    <div className="w-32 bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-blue-500 h-full rounded-full transition-all"
                        style={{ width: `${task.progress}%` }}
                      />
                    </div>
                    <span className="text-xs font-semibold text-gray-700">{task.progress}%</span>
                  </div>
                )}
              </div>
            </div>
            <div className="flex items-center space-x-2">
              {editingAssignee === task.id ? (
                <div className="flex items-center space-x-2">
                  <Input
                    value={editingValue}
                    onChange={(e) => setEditingValue(e.target.value)}
                    className="h-8 w-32"
                    placeholder="Assignee"
                  />
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => task.id && saveAssignee(task.id)}
                    className="h-8 w-8 p-0"
                  >
                    <Save className="w-4 h-4" />
                  </Button>
                </div>
              ) : (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => task.id && startEditingAssignee(task.id, task.assignee || '')}
                  className="text-sm text-gray-500 hover:bg-gray-100"
                >
                  {task.assignee || 'Unassigned'}
                </Button>
              )}
              <Badge variant="outline" className={getStatusColor(task.status)}>
                {task.status}
              </Badge>
              {onEdit && (
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => onEdit(task)}
                  className="hover:bg-gray-100"
                >
                  <Edit2 className="w-4 h-4" />
                </Button>
              )}
              <Button
                size="sm"
                variant="ghost"
                onClick={async () => {
                  if (!task.id) return;
                  setDeletingTaskId(task.id);
                  try {
                    await handleDelete(task.id);
                  } catch (error) {
                    console.error("Error deleting task:", error);
                  } finally {
                    setDeletingTaskId(null);
                  }
                }}
                className="hover:bg-gray-100 flex items-center justify-center"
                disabled={!task.id || deletingTaskId === task.id}
              >
                {deletingTaskId === task.id ? (
                  <Loader2 className="text-red-500 w-4 h-4" />
                ) : (
                  <Trash2 className="w-4 h-4 text-red-500" />
                )}
              </Button>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}
