<div align="center">

# 🚀 CollabBoard

### Real-Time Multi-Tenant Project Management Platform

<p align="center">
Build scalable project management experiences with real-time collaboration, multi-tenant architecture, RBAC, and enterprise-grade security.
</p>

<img src="https://skillicons.dev/icons?i=nextjs,typescript,tailwind,postgres,prisma,supabase,redis,github,vercel" />

</p>

---

### 🌐 Live Demo

🔗 https://collab-board-virid.vercel.app/

### 📂 Repository

🔗 https://github.com/Pragati-coders/CollabBoard

</div>

---

# 📖 About CollabBoard

CollabBoard is a **production-ready project management platform** inspired by **Trello** and **Linear**, designed for modern teams requiring **real-time collaboration**, **multi-tenant workspaces**, **role-based permissions**, and **enterprise-level scalability**.

The platform enables organizations to create isolated workspaces where members can collaborate simultaneously on Kanban boards, manage projects efficiently, receive live updates, and maintain complete data isolation using PostgreSQL Row-Level Security.

Designed with modern architecture principles, CollabBoard leverages Next.js 15 Server Components, Supabase Realtime, Prisma ORM, Clerk Authentication, Redis queues, and Inngest background jobs to deliver a seamless user experience.

---

# ✨ Features

## 🏢 Workspace Management

- Multi-Tenant Organizations
- Workspace Isolation
- Invite Members
- Organization Dashboard

---
 ## Screenshots
 
 [Landing-Page]
<img width="960" height="471" alt="landing-page (CollabBorad)" src="https://github.com/user-attachments/assets/ecd7c344-41d9-4e07-9196-c1ec30b9dee0" />

 [Setup(Page)]
<img width="960" height="476" alt="Setup - (CollabBoard)" src="https://github.com/user-attachments/assets/510f0f40-f0a5-4cce-b940-61c719c81568" />

[DashBoard]
<img width="960" height="415" alt="Dashboard(Collabbboard)" src="https://github.com/user-attachments/assets/cc403a9c-eeb4-4cfa-b53c-99f6958b1909" />

[Project]
<img width="960" height="423" alt="Project(collabBorad)" src="https://github.com/user-attachments/assets/cdd738d5-f292-4d47-b84a-47eaffebcf30" />

[Task]
<img width="960" height="419" alt="Tasks (CollabBoard)" src="https://github.com/user-attachments/assets/b7d9151d-8728-49f7-8430-c050f477dcaa" />

[Teams]
<img width="960" height="416" alt="Teams (CollabBoard)" src="https://github.com/user-attachments/assets/3a6d20c7-2548-4955-8a57-91e70f4a6519" />

[Analytics]
<img width="960" height="426" alt="Analytics(CollabBoard)" src="https://github.com/user-attachments/assets/2015addf-bd97-44bf-a4e4-514849ce179a" />








---


## 📋 Project Boards

- Kanban Boards
- Multiple Columns
- Unlimited Tasks
- Drag & Drop
- Task Priorities
- Due Dates

---

## ⚡ Real-Time Collaboration

- Live Task Updates
- Presence Indicators
- Cursor Tracking
- Instant Synchronization
- Activity Feed

---

## 🔐 Authentication & Security

- Clerk Authentication
- Role Based Access Control
- Protected Routes
- Row-Level Security
- JWT Sessions

---

## 📊 Analytics

- Team Productivity
- Task Completion
- Workspace Insights
- Activity Monitoring

---

# 📚 Table of Contents

- 📖 About
- ✨ Features
- 📸 Screenshots
- 🛠 Tech Stack
- 🏗 System Architecture
- 🔄 Workflow
- 🏢 Multi-Tenant Architecture
- 🔐 RBAC Flow
- 📡 Realtime Flow
- ⚡ API Lifecycle
- 💾 Database Design
- 📂 Folder Structure
- 🌍 Deployment Architecture
- 📈 Performance Optimizations
- 🔒 Security
- 🚀 Installation
- ⚙ Environment Variables
- ▶ Running Locally
- 🧪 Testing
- 📊 Scalability
- 🔮 Future Enhancements
- 🤝 Contributing
- ⭐ Support
- 📜 License

- ---

# 🛠 Technology Stack

| Layer | Technology |
|--------|------------|
| **Frontend** | Next.js 15 (App Router) |
| **Language** | TypeScript |
| **Styling** | Tailwind CSS + Shadcn UI |
| **Authentication** | Clerk |
| **Database** | PostgreSQL |
| **ORM** | Prisma |
| **Realtime** | Supabase Realtime |
| **Background Jobs** | Inngest |
| **Caching / Queue** | Redis |
| **Deployment** | Vercel |
| **Testing** | Vitest + Playwright |
| **CI/CD** | GitHub Actions |

---

# 🏗 High-Level System Architecture

```text
                                   🌍 Internet
                                        │
                                        ▼
                           ┌────────────────────────┐
                           │      Vercel Edge       │
                           └────────────┬───────────┘
                                        │
                                        ▼
                         ┌──────────────────────────┐
                         │   Next.js 15 Application │
                         └────────────┬─────────────┘
                                      │
             ┌────────────────────────┼─────────────────────────┐
             │                        │                         │
             ▼                        ▼                         ▼
      Authentication             API Routes             Server Actions
         (Clerk)                                           (Next.js)
             │                        │                         │
             └────────────────────────┼─────────────────────────┘
                                      ▼
                           Business Logic Layer
                                      │
      ┌───────────────────────────────┼──────────────────────────────┐
      ▼                               ▼                              ▼
 Prisma ORM                   Realtime Service              Background Jobs
(PostgreSQL)              (Supabase Realtime)            (Inngest + Redis)
      │                               │                              │
      ▼                               ▼                              ▼
 PostgreSQL                   Live Collaboration             Notifications
      │
      ▼
 Supabase Storage
```

---

# 🔄 Application Workflow

```text
                 User Opens Application
                          │
                          ▼
                 Authentication (Clerk)
                          │
                          ▼
                Workspace Verification
                          │
                          ▼
                  Dashboard Loaded
                          │
        ┌─────────────────┼──────────────────┐
        ▼                 ▼                  ▼
   View Boards      Create Board      Invite Members
        │                 │                  │
        └─────────────────┼──────────────────┘
                          ▼
                  Open Project Board
                          │
                          ▼
                  Create / Update Task
                          │
                          ▼
                Prisma Updates Database
                          │
                          ▼
             Supabase Broadcasts Changes
                          │
        ┌─────────────────┼──────────────────┐
        ▼                 ▼                  ▼
      User A            User B            User C
  Instantly Updated  Instantly Updated  Instantly Updated
```

---

# 🏢 Multi-Tenant Architecture

Each organization has its own isolated workspace.

Data is separated using **Organization IDs** and **PostgreSQL Row-Level Security (RLS)**.

```text
                    PostgreSQL Database

        ┌─────────────────────────────────────────┐
        │                                         │
        │      Organization ID (org_id)           │
        │                                         │
        └─────────────────────────────────────────┘
                     │                  │
                     │                  │
             ┌───────▼──────┐   ┌──────▼───────┐
             │ Organization │   │ Organization │
             │      A       │   │      B       │
             └──────┬───────┘   └──────┬───────┘
                    │                  │
          ┌─────────┴─────────┐  ┌─────┴──────────┐
          ▼                   ▼  ▼                ▼
     Workspace A         Members A         Workspace B
          │                                     │
          ▼                                     ▼
     Boards & Tasks                      Boards & Tasks

     🔒 Users can only access their own organization.
```

---

# 🔐 Authentication & Authorization Flow

```text
                 User Visits Website
                          │
                          ▼
                   Clerk Sign In
                          │
                          ▼
                    JWT Generated
                          │
                          ▼
                  Next.js Middleware
                          │
                          ▼
               Authentication Check
                          │
                          ▼
                Organization Lookup
                          │
                          ▼
                 Role Permission Check
                          │
                          ▼
               Dashboard / Access Granted
```

---

# 👥 Role-Based Access Control (RBAC)

```text
                     Organization
                           │
          ┌────────────────┼─────────────────┐
          ▼                ▼                 ▼
        Owner            Admin            Member
          │                │                 │
          │                │                 │
   Manage Billing    Manage Workspace   Manage Tasks
   Delete Workspace  Invite Members     Comment
   Full Access       Manage Boards      Update Profile
                     Assign Roles
```

---

# 🧩 Application Layers

```text
Presentation Layer
        │
        ▼
Pages & UI Components
        │
        ▼
Server Actions
        │
        ▼
Business Logic
        │
        ▼
Service Layer
        │
        ▼
Repository Layer
        │
        ▼
Prisma ORM
        │
        ▼
PostgreSQL Database
```

---

# 📡 Data Flow

```text
User Action
     │
     ▼
React Component
     │
     ▼
Server Action
     │
     ▼
Validation
     │
     ▼
Authentication
     │
     ▼
Authorization
     │
     ▼
Business Logic
     │
     ▼
Prisma ORM
     │
     ▼
PostgreSQL
     │
     ▼
Realtime Broadcast
     │
     ▼
Connected Users Updated
```
---

# 📡 Realtime Collaboration Architecture

CollabBoard uses **Supabase Realtime** to synchronize task updates instantly across all connected users. Every action—creating, updating, moving, or deleting a task—is broadcast to all active workspace members.

```text
                 User A
                   │
             Drag Task Card
                   │
                   ▼
          Next.js Server Action
                   │
                   ▼
           Prisma Updates Database
                   │
                   ▼
          Supabase Realtime Channel
                   │
      ┌────────────┼─────────────┐
      ▼            ▼             ▼
   User B       User C       User D
Instant Sync  Instant Sync  Instant Sync
```

---

# ⚡ API Lifecycle

Every request follows a secure and optimized lifecycle before reaching the database.

```text
Browser
   │
   ▼
Next.js Route
   │
   ▼
Middleware
(Authentication)
   │
   ▼
Input Validation
   │
   ▼
RBAC Permission Check
   │
   ▼
Server Action
   │
   ▼
Business Logic
   │
   ▼
Prisma ORM
   │
   ▼
PostgreSQL
   │
   ▼
Response Returned
```

---

# 💾 Database Entity Relationship (ER Diagram)

```text
Organization
      │
      │ 1:N
      ▼
Workspace
      │
      │ 1:N
      ▼
Board
      │
      │ 1:N
      ▼
Column
      │
      │ 1:N
      ▼
Task
 ┌────┼───────────────┬─────────────┐
 ▼    ▼               ▼             ▼
User Comment      Attachment      Label
 │
 ▼
Activity Log
```

---

# 📂 Project Architecture (System Design)

Instead of a traditional folder tree, the project follows a layered architecture.

```text
                    Client
                      │
                      ▼
              Next.js Pages
                      │
                      ▼
              React Components
                      │
                      ▼
               Custom Hooks
                      │
                      ▼
              Server Actions
                      │
                      ▼
             Business Services
                      │
                      ▼
              Repository Layer
                      │
                      ▼
                 Prisma ORM
                      │
                      ▼
                 PostgreSQL
```

---

# 🔄 Request Lifecycle

```text
User Click
     │
     ▼
React Component
     │
     ▼
Server Action
     │
     ▼
Authentication
     │
     ▼
Authorization
     │
     ▼
Validation
     │
     ▼
Business Logic
     │
     ▼
Database Query
     │
     ▼
Realtime Broadcast
     │
     ▼
Updated UI
```

---

# ☁️ Deployment Architecture

The application is deployed using Vercel with managed backend services.

```text
                   Developer
                        │
                  Git Push
                        │
                        ▼
               GitHub Repository
                        │
                        ▼
                GitHub Actions
                        │
                        ▼
                Vercel Deployment
                        │
      ┌─────────────────┼──────────────────┐
      ▼                 ▼                  ▼
  Clerk Auth      PostgreSQL DB     Supabase Realtime
      │                 │                  │
      └─────────────────┼──────────────────┘
                        ▼
                  Live Application
```

---

# 📊 Scalability Architecture

CollabBoard is designed to scale horizontally with increasing users and organizations.

```text
                     Internet
                         │
                         ▼
                  Vercel Edge Network
                         │
                         ▼
                 Load Balanced App
                         │
         ┌───────────────┼────────────────┐
         ▼               ▼                ▼
   API Instance 1   API Instance 2   API Instance 3
         │               │                │
         └───────────────┼────────────────┘
                         ▼
                   PostgreSQL Cluster
                         │
                         ▼
               Supabase Realtime Engine
                         │
                         ▼
                    Connected Clients
```

---

# ⚙ Background Job Processing

Heavy operations are handled asynchronously using **Inngest** and **Redis**.

```text
User Action
     │
     ▼
Server Action
     │
     ▼
Create Job
     │
     ▼
Redis Queue
     │
     ▼
Inngest Worker
     │
 ┌───┼───────────────┐
 ▼   ▼               ▼
Email Notification
Workspace Digest
Reminder Scheduler
```

---

# 🔒 Security Architecture

```text
User
 │
 ▼
HTTPS
 │
 ▼
Vercel Edge
 │
 ▼
Clerk Authentication
 │
 ▼
JWT Verification
 │
 ▼
Next.js Middleware
 │
 ▼
RBAC Permission Check
 │
 ▼
PostgreSQL Row-Level Security
 │
 ▼
Secure Data Access
```

---

# 📈 Performance Optimizations

| Optimization | Description |
|--------------|-------------|
| ⚡ Server Components | Reduce client-side JavaScript |
| ⚡ Server Actions | Eliminate unnecessary API calls |
| ⚡ Lazy Loading | Load components on demand |
| ⚡ Image Optimization | Faster page rendering |
| ⚡ Prisma Query Optimization | Efficient database queries |
| ⚡ Redis Caching | Faster repeated requests |
| ⚡ Realtime Sync | Instant UI updates |
| ⚡ Edge Deployment | Low-latency global access |
| ⚡ Row-Level Security | Secure multi-tenant isolation |

---
---

# 📂 Project Structure

```text
CollabBoard
│
├── 📁 app
│   ├── Dashboard
│   ├── Authentication
│   ├── Workspaces
│   ├── Boards
│   ├── Tasks
│   ├── Members
│   ├── Settings
│   └── API Routes
│
├── 📁 components
│   ├── UI Components
│   ├── Board Components
│   ├── Task Components
│   ├── Layout Components
│   └── Shared Components
│
├── 📁 actions
│   ├── Board Actions
│   ├── Task Actions
│   ├── Workspace Actions
│   └── Member Actions
│
├── 📁 services
│   ├── Authentication Service
│   ├── Board Service
│   ├── Task Service
│   ├── Notification Service
│   └── Analytics Service
│
├── 📁 lib
│   ├── Prisma
│   ├── Clerk
│   ├── Supabase
│   ├── Redis
│   ├── Validators
│   └── Utilities
│
├── 📁 prisma
│   ├── Schema
│   ├── Migrations
│   └── Seed
│
├── 📁 hooks
│
├── 📁 types
│
├── 📁 public
│
├── 📁 tests
│
└── 📁 docs
```

---

# 🚀 Getting Started

Clone the repository.

```bash
git clone https://github.com/Pragati-coders/CollabBoard.git
```

Move inside the project.

```bash
cd CollabBoard
```

Install dependencies.

```bash
npm install
```

or

```bash
pnpm install
```

---

# ⚙ Environment Variables

Create a **.env** file in the root directory.

```env
# Database
DATABASE_URL=

# Clerk
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
CLERK_SECRET_KEY=

# Supabase
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=

# Redis
REDIS_URL=

# Inngest
INNGEST_EVENT_KEY=

# Application
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

---

# ▶ Running Locally

Development

```bash
npm run dev
```

Production

```bash
npm run build
```

Start

```bash
npm start
```

---

# 🧪 Testing

Run Unit Tests

```bash
npm run test
```

Run End-to-End Tests

```bash
npm run test:e2e
```

Run Coverage

```bash
npm run coverage
```

---

# 📦 Build

```bash
npm run build
```

The optimized production build will be generated inside the `.next` directory.

---

# 🌍 Deployment

Deploy using **Vercel**.

```bash
vercel
```

Production deployment pipeline

```text
Developer
     │
     ▼
Git Push
     │
     ▼
GitHub Repository
     │
     ▼
GitHub Actions
     │
     ▼
Vercel Build
     │
     ▼
Production Deployment
```

---

# 📈 Monitoring

The application can be monitored using

- Vercel Analytics
- Vercel Speed Insights
- Supabase Dashboard
- PostgreSQL Metrics
- Redis Monitoring
- GitHub Actions Logs

---

# 🔮 Future Enhancements

- AI Task Suggestions
- AI Sprint Planning
- Calendar View
- Timeline View
- Gantt Charts
- Workspace Templates
- Slack Integration
- Microsoft Teams Integration
- GitHub Integration
- Jira Import
- Dark Mode Enhancements
- Mobile Application
- Offline Support
- Push Notifications
- Audit Logs
- Team Analytics Dashboard

---

# 🤝 Contributing

Contributions are always welcome.

To contribute:

1. Fork the repository

2. Create your feature branch

```bash
git checkout -b feature/new-feature
```

3. Commit your changes

```bash
git commit -m "Add new feature"
```

4. Push the branch

```bash
git push origin feature/new-feature
```

5. Open a Pull Request

---

# 📝 License

This project is licensed under the **MIT License**.

---

# 👩‍💻 Author

### Pragati 

Full Stack Developer 

- 💼 Open to Software Engineering Opportunities
- 🌎 India
- 💻 Passionate about Scalable Web Applications
- 🚀 Building Production-Ready SaaS Products

---

# 🙏 Acknowledgements

Special thanks to the amazing open-source community and the teams behind:

- Next.js
- React
- Prisma
- Supabase
- Clerk
- Tailwind CSS
- Shadcn UI
- Inngest
- Vercel

---

# ⭐ Show Your Support

If you found this project helpful,

⭐ Star this repository

🍴 Fork this repository

🐛 Report Issues

💡 Share Feedback

---

<div align="center">

### 🚀 Built with ❤️ using Next.js 15, TypeScript, Prisma & Supabase

**If you like this project, don't forget to leave a ⭐ on GitHub!**

</div>

