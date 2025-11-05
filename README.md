# Task Tracker

A Next.js-based task tracking application with analytics and Gantt chart visualization.

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
│   └── utils.ts            # Helper utilities
│
├── public/                  # Static assets
│
├── node_modules/           # Dependencies
│
├── Dockerfile              # Docker configuration
├── docker-compose.yml      # Docker Compose setup
├── .dockerignore           # Docker ignore file
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
```bash
docker compose up
```

### Using Docker Run
```bash
# Build the image
docker build -t task-tracker .

# Run the container
docker run -p 3000:3000 task-tracker
```

Access the application at http://localhost:3000

## Development Setup

```bash
npm install

npm run dev

npm run build

npm start
```
