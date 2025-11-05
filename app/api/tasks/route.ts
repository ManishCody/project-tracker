import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Task from '@/models/Task';

// GET all tasks
export async function GET(request: NextRequest) {
  try {
    await connectDB();
    
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const priority = searchParams.get('priority');
    
    let query: any = {};
    if (status) query.status = status;
    if (priority) query.priority = priority;
    
    const tasks = await Task.find(query).sort({ createdAt: -1 });
    
    const tasksWithProgress = tasks.map(task => {
      const taskObj = task.toObject();
      taskObj.progress = taskObj.progress !== undefined && taskObj.progress !== null ? taskObj.progress : 0;
      return taskObj;
    });
    
    return NextResponse.json({
      success: true,
      count: tasksWithProgress.length,
      data: tasksWithProgress,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    await connectDB();
    
    const body = await request.json();
    
    if (!body.title || body.title.trim().length < 3) {
      return NextResponse.json(
        { success: false, error: 'Title must be at least 3 characters' },
        { status: 400 }
      );
    }
    
    if (!body.description || body.description.trim().length < 10) {
      return NextResponse.json(
        { success: false, error: 'Description must be at least 10 characters' },
        { status: 400 }
      );
    }
    
    if (!body.startDate || !body.endDate) {
      return NextResponse.json(
        { success: false, error: 'Start date and end date are required' },
        { status: 400 }
      );
    }
    
    const { percentage, ...taskData } = body;
    
    const progressValue = taskData.progress !== undefined 
      ? Math.max(0, Math.min(100, Number(taskData.progress) || 0))
      : 0;
    taskData.progress = progressValue;
    
    if (taskData.project !== undefined && taskData.project !== null && taskData.project !== '') {
      taskData.project = String(taskData.project).trim();
    }
    
    const task = await Task.create(taskData);
    
    const taskResponse = task.toObject();
    
    taskResponse.progress = (taskResponse.progress !== undefined && taskResponse.progress !== null) 
      ? taskResponse.progress 
      : progressValue;
    
    if (taskData.project) {
      taskResponse.project = taskData.project;
    }
    
    return NextResponse.json(
      { success: true, data: taskResponse },
      { status: 201 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 400 }
    );
  }
}
