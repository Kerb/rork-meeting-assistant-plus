export type GTDStatus = "inbox" | "next" | "waiting" | "scheduled" | "someday" | "done";

export type Priority = "low" | "medium" | "high";

export type MeetingStatus = "recording" | "uploading" | "transcribing" | "analyzing" | "ready" | "error";

export interface Project {
  id: string;
  name: string;
  description?: string;
  contextTags: string[];
  createdAt: string;
}

export interface Task {
  id: string;
  projectId?: string;
  projectName?: string;
  title: string;
  description?: string;
  assignee?: string;
  dueDate?: string;
  priority?: Priority;
  gtdStatus: GTDStatus;
  sourceMeetingId?: string;
  relatedTaskIds: string[];
  completed: boolean;
  createdAt: string;
  completedAt?: string;
}

export interface Decision {
  id: string;
  text: string;
  meetingId: string;
  createdAt: string;
}

export interface Meeting {
  id: string;
  projectId?: string;
  title: string;
  startedAt: string;
  duration?: number;
  audioUri?: string;
  transcriptText?: string;
  summary?: string;
  status: MeetingStatus;
  errorMessage?: string;
  createdAt: string;
}

export interface MeetingAnalysis {
  meeting: {
    title: string;
    date: string;
    summary: string;
  };
  projects: { name: string }[];
  tasks: {
    project?: string;
    title: string;
    assignee?: string;
    due_date?: string;
    priority?: Priority;
    gtd_status?: GTDStatus;
    source_meeting: string;
  }[];
  decisions: string[];
}
