import { Meeting, Task } from "@/types";

export function generateSampleMeetings(): Meeting[] {
  const now = new Date();
  const yesterday = new Date(now);
  yesterday.setDate(yesterday.getDate() - 1);
  const twoDaysAgo = new Date(now);
  twoDaysAgo.setDate(twoDaysAgo.getDate() - 2);

  return [
    {
      id: "meeting-1",
      title: "Product Roadmap Planning Q1 2025",
      startedAt: now.toISOString(),
      duration: 3600,
      status: "ready",
      summary: "Discussed upcoming features for Q1: AI-powered search, mobile redesign, and API v3. Decided to prioritize mobile redesign. Allocated budget for external design consultants. Set sprint goals for January.",
      createdAt: now.toISOString(),
    },
    {
      id: "meeting-2",
      title: "Weekly Team Sync",
      startedAt: yesterday.toISOString(),
      duration: 1800,
      status: "ready",
      summary: "Team updates on current sprint progress. Backend team completed API migration. Frontend blocked on design assets. QA found 3 critical bugs in staging. Agreed to extend sprint by 2 days.",
      createdAt: yesterday.toISOString(),
    },
    {
      id: "meeting-3",
      title: "Client Kickoff - Acme Corp",
      startedAt: twoDaysAgo.toISOString(),
      duration: 2700,
      status: "ready",
      summary: "Initial meeting with Acme Corp to discuss their SaaS platform requirements. They need custom reporting dashboard, SSO integration, and bulk import tools. Timeline: 3 months. Budget approved.",
      createdAt: twoDaysAgo.toISOString(),
    },
  ];
}

export function generateSampleTasks(): Task[] {
  const today = new Date().toISOString().split("T")[0];
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const nextWeek = new Date();
  nextWeek.setDate(nextWeek.getDate() + 7);

  return [
    {
      id: "task-1",
      projectName: "Mobile App",
      title: "Review mobile redesign mockups",
      assignee: "Sarah",
      dueDate: today,
      priority: "high",
      gtdStatus: "next",
      relatedTaskIds: [],
      completed: false,
      createdAt: new Date().toISOString(),
    },
    {
      id: "task-2",
      projectName: "Mobile App",
      title: "Schedule design review meeting",
      assignee: "Alex",
      dueDate: tomorrow.toISOString().split("T")[0],
      priority: "medium",
      gtdStatus: "next",
      relatedTaskIds: [],
      completed: false,
      createdAt: new Date().toISOString(),
    },
    {
      id: "task-3",
      projectName: "API v3",
      title: "Draft API v3 specification document",
      assignee: "Jordan",
      dueDate: nextWeek.toISOString().split("T")[0],
      priority: "high",
      gtdStatus: "next",
      relatedTaskIds: [],
      completed: false,
      createdAt: new Date().toISOString(),
    },
    {
      id: "task-4",
      projectName: "Acme Corp",
      title: "Wait for SSO credentials from Acme IT team",
      assignee: "Morgan",
      priority: "medium",
      gtdStatus: "waiting",
      relatedTaskIds: [],
      completed: false,
      createdAt: new Date().toISOString(),
    },
    {
      id: "task-5",
      projectName: "Acme Corp",
      title: "Design custom reporting dashboard wireframes",
      dueDate: nextWeek.toISOString().split("T")[0],
      priority: "high",
      gtdStatus: "scheduled",
      relatedTaskIds: [],
      completed: false,
      createdAt: new Date().toISOString(),
    },
    {
      id: "task-6",
      title: "Review and respond to support tickets",
      priority: "low",
      gtdStatus: "inbox",
      relatedTaskIds: [],
      completed: false,
      createdAt: new Date().toISOString(),
    },
    {
      id: "task-7",
      projectName: "Backend",
      title: "Investigate staging environment bugs",
      assignee: "Chris",
      dueDate: today,
      priority: "high",
      gtdStatus: "next",
      relatedTaskIds: [],
      completed: false,
      createdAt: new Date().toISOString(),
    },
    {
      id: "task-8",
      title: "Update team wiki documentation",
      priority: "low",
      gtdStatus: "inbox",
      relatedTaskIds: [],
      completed: false,
      createdAt: new Date().toISOString(),
    },
  ];
}
