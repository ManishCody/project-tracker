"use client";

import { Toaster } from "sonner";
import { TaskProvider } from "@/context/TaskContext";

export default function ClientProviders({ children }: { children: React.ReactNode }) {
  return (
    <TaskProvider>
      {children}
      <Toaster position="top-right" />
    </TaskProvider>
  );
}
