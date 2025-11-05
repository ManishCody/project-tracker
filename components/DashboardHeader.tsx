"use client"

interface Project {
  id: string
  name: string
  color: string
}

interface DashboardHeaderProps {
  projects: Project[]
  selectedProject: string
  onProjectChange: (projectId: string) => void
}

export function DashboardHeader({ projects, selectedProject, onProjectChange }: DashboardHeaderProps) {
  return (
    <header className="border-b border-border bg-card/50 backdrop-blur">
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-linear-to-br from-primary to-accent flex items-center justify-center">
              <span className="text-sm font-bold text-primary-foreground">PT</span>
            </div>
            <h1 className="text-xl font-bold">Project Tracker</h1>
          </div>

          {/* Project Selector */}
          <div className="flex gap-2">
            {projects.map((project) => (
              <button
                key={project.id}
                onClick={() => onProjectChange(project.id)}
                className={`px-4 py-2 rounded-lg font-medium transition-all ${
                  selectedProject === project.id
                    ? "bg-primary text-primary-foreground shadow-lg"
                    : "bg-card border border-border text-foreground hover:bg-muted"
                }`}
              >
                {project.name}
              </button>
            ))}
          </div>
        </div>
      </div>
    </header>
  )
}
