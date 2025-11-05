# Task Tracker

A Next.js-based task tracking application with REST API, MongoDB, analytics, and Gantt chart visualization.

## Folder Structure

```
my-app/
├── app/                      # Next.js app directory
│   ├── layout.tsx           # Root layout component
│   ├── page.tsx             # Home page
│   ├── globals.css          # Global styles
│   └── favicon.ico          # App icon
│
├── components/              # React components
│   ├── features/           # Feature-specific components
│   │   ├── analytics/      # Analytics related components
│   │   ├── dashboard/      # Dashboard components
│   │   └── tasks/          # Task management components
│   ├── layout/             # Layout components
│   └── ui/                 # Reusable UI components
│
├── lib/                     # Utility functions
│   ├── utils.ts            # Helper utilities
│   └── mongodb.ts          # MongoDB connection
│
├── models/                  # Database models
│   └── Task.ts             # Task model with validation
│
├── public/                  # Static assets
│
├── node_modules/           # Dependencies
│
├── Dockerfile              # Docker configuration
├── docker-compose.yml      # Docker Compose with MongoDB
├── .dockerignore           # Docker ignore file
├── env.example             # Environment variables example
├── package.json            # Project dependencies
├── next.config.ts          # Next.js configuration
└── tsconfig.json           # TypeScript configuration
```

## Docker Hub

**Docker Image:** `mandy45/task-tracker:latest`

**Docker Hub URL:** https://hub.docker.com/r/mandy45/task-tracker

### Pull and Run from Docker Hub
```bash
docker pull mandy45/task-tracker:latest
docker run -p 3000:3000 mandy45/task-tracker:latest
```

Or run directly (will pull automatically):
```bash
docker run -p 3000:3000 mandy45/task-tracker:latest
```

## Running with Docker

### Using Docker Compose (Recommended)
This will start both the app and MongoDB:
```bash
docker compose up
```

To seed the database with demo data:
```bash
docker compose exec task-tracker npm run seed
```

### Using Docker Run
```bash
# Build the image
docker build -t task-tracker .

# Run the container
docker run -p 3000:3000 task-tracker
```

Access the application at http://localhost:3000

## REST API Endpoints

### Tasks
- `GET /api/tasks` - Get all tasks (supports ?status=pending&priority=high)
- `POST /api/tasks` - Create a new task
- `GET /api/tasks/[id]` - Get a single task
- `PUT /api/tasks/[id]` - Update a task
- `DELETE /api/tasks/[id]` - Delete a task

### Example Request
```bash
# Get all tasks
curl http://localhost:3000/api/tasks

# Create a task
curl -X POST http://localhost:3000/api/tasks \
  -H "Content-Type: application/json" \
  -d '{
    "title": "New Task",
    "description": "Task description here",
    "status": "pending",
    "priority": "high",
    "startDate": "2024-01-01",
    "endDate": "2024-01-10",
    "assignee": "John Doe"
  }'
```

## Development Setup

```bash
npm install

npm run dev

npm run build

npm start
```

## Environment Variables

Create a `.env.local` file with:
```
MONGODB_URI=mongodb://localhost:27017/tasktracker
```
