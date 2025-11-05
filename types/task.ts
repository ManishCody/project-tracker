export interface Task {
  _id: string;
  id?: string; // For compatibility with some libraries that expect 'id'
  title: string;
  description: string;
  status: 'pending' | 'in-progress' | 'completed';
  priority?: 'low' | 'medium' | 'high';
  startDate: Date | string;
  endDate: Date | string;
  assignee?: string;
  progress?: number;
  project?: string;
  tags?: string[];
  createdAt: Date | string;
  updatedAt: Date | string;
}

export interface Project {
  _id: string;
  name: string;
  description?: string;
  status: 'active' | 'archived' | 'completed';
  startDate: Date | string;
  endDate?: Date | string;
  createdAt: Date | string;
  updatedAt: Date | string;
}

export type TaskFormData = Omit<Task, '_id' | 'createdAt' | 'updatedAt'>;

export type ProjectFormData = Omit<Project, '_id' | 'createdAt' | 'updatedAt'>;
