import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Task from '@/models/Task';

// GET single task
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    const { id } = await params;
    
    const task = await Task.findById(id);
    
    if (!task) {
      return NextResponse.json(
        { success: false, error: 'Task not found' },
        { status: 404 }
      );
    }
    
    const taskResponse = task.toObject();
    
    taskResponse.progress = taskResponse.progress !== undefined && taskResponse.progress !== null ? taskResponse.progress : 0;
    
    return NextResponse.json({ success: true, data: taskResponse });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

// PUT update task
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    const { id } = await params;

    const body = await request.json();

    const { percentage, ...taskData } = body;

    if (taskData.progress !== undefined) {
      taskData.progress = Math.max(0, Math.min(100, Number(taskData.progress) || 0));
    }

    const existing = await Task.findById(id);
    if (!existing) {
      return NextResponse.json(
        { success: false, error: 'Task not found' },
        { status: 404 }
      );
    }

    Object.assign(existing, taskData);

    const saved = await existing.save();

    const taskResponse = saved.toObject();

    taskResponse.progress = taskResponse.progress !== undefined && taskResponse.progress !== null ? taskResponse.progress : 0;

    return NextResponse.json({ success: true, data: taskResponse });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 400 }
    );
  }
}

// DELETE task
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    const { id } = await params;
    
    const task = await Task.findByIdAndDelete(id);
    
    if (!task) {
      return NextResponse.json(
        { success: false, error: 'Task not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({ success: true, data: {} });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
