# PMantis - Features & Implementation Guide

## Overview

**PMantis** is a beautiful AI-powered meeting assistant built with React Native, Expo, and TypeScript. It combines meeting recording, AI transcription, automatic task extraction, and GTD (Getting Things Done) methodology to help teams stay organized and productive.

## Current Implementation (MVP v1)

### ✅ Complete Features

#### 1. **Today/Home Screen** (`app/(tabs)/index.tsx`)
- Dynamic greeting based on time of day
- At-a-glance statistics: Next Actions, Active Tasks, Overdue items
- Quick action buttons: Record Meeting, Import Audio
- Focus Today section showing top 5 priority tasks
- Recent meetings overview with status indicators
- Demo data button to explore features

#### 2. **Audio Recording** (`app/(tabs)/record.tsx`)
- High-quality audio capture using expo-av
- Cross-platform support (iOS: .wav, Android: .m4a, Web: compatible)
- Real-time recording duration display
- Optional meeting title input
- Visual recording indicator with mantis-green pulse animation
- Proper permission handling

#### 3. **Meetings Management** (`app/(tabs)/meetings.tsx`)
- List view of all recorded meetings
- Meeting cards showing:
  - Title and timestamp
  - Duration
  - Status (recording, transcribing, analyzing, ready, error)
  - Summary preview
- Empty state with onboarding message

#### 4. **GTD Task System** (`app/(tabs)/tasks.tsx`)
- Four-tab interface:
  - **Inbox**: New tasks for processing
  - **Next**: Actionable items ready to work on
  - **Waiting**: Tasks blocked on others
  - **Scheduled**: Time-specific tasks
- Task cards display:
  - Title and description
  - Project name
  - Assignee
  - Due date with overdue highlighting
  - Priority level (high/medium/low)
- Task completion with checkbox
- Count badges on each tab
- Smart sorting by due date and priority

#### 5. **Design System** (`constants/colors.ts`)
- Mantis-green primary color (#4CAF50)
- Full light/dark mode support
- Semantic color naming (success, warning, error, info)
- Consistent spacing and typography
- Clean, modern mobile-first design

#### 6. **State Management** (`contexts/AppContext.tsx`)
- React Context with create-context-hook
- AsyncStorage persistence
- Meeting CRUD operations
- Task CRUD operations
- Project management
- Optimized with useMemo and useCallback

#### 7. **Type Safety** (`types/index.ts`)
- Complete TypeScript definitions
- Meeting types with status tracking
- Task types with GTD status
- Project types with context tags
- Priority levels
- MeetingAnalysis interface for AI responses

### 🎨 Design Highlights

- **Mantis Theme**: Sharp green accents (#4CAF50) inspired by the precision of a praying mantis
- **Mobile-Native**: Optimized for mobile screens, not web-ported UI
- **Smooth Animations**: Micro-interactions and transitions
- **Status Indicators**: Clear visual feedback for processing states
- **Empty States**: Helpful onboarding messages
- **Safe Area Handling**: Proper insets for notch and tab bar

## Future AI Features (Requires Backend)

### 🤖 AI Integration Plan

#### 1. **Speech-to-Text (STT)**
```typescript
// Use Rork's STT API
const transcribeAudio = async (audioUri: string) => {
  const formData = new FormData();
  formData.append('audio', {
    uri: audioUri,
    name: 'recording.wav',
    type: 'audio/wav'
  });
  
  const response = await fetch('https://toolkit.rork.com/stt/transcribe/', {
    method: 'POST',
    body: formData
  });
  
  return await response.json(); // { text: string, language: string }
};
```

#### 2. **Meeting Analysis with LLM**
```typescript
import { generateObject } from "@rork/toolkit-sdk";
import { z } from "zod";

const analyzeMeeting = async (transcript: string, meetingTitle: string) => {
  const analysis = await generateObject({
    messages: [
      {
        role: "system",
        content: ANALYSIS_SYSTEM_PROMPT // See LLM prompts below
      },
      {
        role: "user",
        content: `TRANSCRIPT: ${transcript}\n\nMEETING: ${meetingTitle}`
      }
    ],
    schema: z.object({
      meeting: z.object({
        title: z.string(),
        date: z.string(),
        summary: z.string()
      }),
      projects: z.array(z.object({ name: z.string() })),
      tasks: z.array(z.object({
        project: z.string().optional(),
        title: z.string(),
        assignee: z.string().optional(),
        due_date: z.string().optional(),
        priority: z.enum(["low", "medium", "high"]).optional(),
        gtd_status: z.enum(["inbox", "next", "waiting", "scheduled"]).optional()
      })),
      decisions: z.array(z.string())
    })
  });
  
  return analysis;
};
```

#### 3. **MoM Generation**
```typescript
import { generateText } from "@rork/toolkit-sdk";

const generateMoM = async (transcript: string) => {
  const mom = await generateText({
    messages: [
      {
        role: "system",
        content: MOM_SYSTEM_PROMPT // Professional PM-style MoM
      },
      {
        role: "user",
        content: `Generate MoM:\n\n${transcript}`
      }
    ]
  });
  
  return mom;
};
```

### 📋 LLM Prompts

#### Analysis System Prompt
```
You are an assistant that analyzes meeting transcripts. Return ONLY valid JSON UTF-8 without comments.

Schema:
{
  "meeting": {"title": string, "date": "YYYY-MM-DD", "summary": string},
  "projects": [{"name": string}],
  "tasks": [{
    "project": string|null,
    "title": string,
    "assignee": string|null,
    "due_date": "YYYY-MM-DD"|null,
    "priority": "low"|"medium"|"high"|null,
    "gtd_status": "next"|"waiting"|"scheduled"|null
  }],
  "decisions": [string]
}

Do not invent facts. If data is missing, use null.
```

#### MoM System Prompt
```
You are a professional Project Manager. Write a concise MoM: 5-7 bullet points covering topics, decisions, and risks.

End with an "Action items:" section in format "Who → What → Deadline".

Professional tone, no fluff.
```

### 🔄 Full Workflow (With Backend)

1. **User records meeting** → Audio saved locally
2. **Tap "Transcribe & Analyze"** button on meeting detail
3. **Upload audio** → Backend STT API
4. **Receive transcript** → Display in meeting detail
5. **Analyze with LLM** → Extract tasks, generate MoM
6. **Save results**:
   - Update meeting with summary and transcript
   - Create tasks in GTD system
   - Save decisions
7. **User can**:
   - Edit extracted tasks
   - Move tasks between GTD categories
   - Create calendar events (future)
   - Sync to Trello (future)
   - Email MoM to stakeholders (future)

## Architecture Decisions

### Why Create-Context-Hook?
- Cleaner than raw React Context
- Automatic TypeScript inference
- Simplified provider/hook pattern
- Better performance with useMemo

### Why AsyncStorage?
- Native persistence without backend
- Fast local access
- Perfect for MVP
- Easy migration to backend later

### Why GTD?
- Industry-proven methodology
- Natural fit for meeting action items
- Clear mental model for users
- Reduces cognitive load

### Why Mantis Theme?
- Unique, memorable branding
- Green = productivity, growth
- Mantis = precision, focus, patience
- Differentiates from generic blue/purple apps

## Next Steps

### Phase 1: Core AI (Backend Required)
- [ ] Create Meeting Detail screen
- [ ] Integrate STT API for transcription
- [ ] Integrate LLM for analysis
- [ ] Add "Transcribe & Analyze" button
- [ ] Show progress indicators during processing
- [ ] Handle errors gracefully

### Phase 2: Integrations
- [ ] Google Calendar OAuth
- [ ] Calendar time-blocking with Pomodoro
- [ ] Trello API integration
- [ ] Email integration (SendGrid)
- [ ] Pre-meeting briefs
- [ ] Weekly summaries

### Phase 3: Smart Features
- [ ] Smart reminders and notifications
- [ ] Deadline tracking with escalation
- [ ] Project organization
- [ ] Context tags (@calls, @home, etc.)
- [ ] Bulk task actions
- [ ] Search and filters

### Phase 4: Polish
- [ ] Animations and micro-interactions
- [ ] Haptic feedback
- [ ] Offline queue for uploads
- [ ] Audio playback in meeting detail
- [ ] Multi-language UI (RU/EN)
- [ ] Settings screen

## File Structure Summary

```
app/(tabs)/
├── index.tsx        # Today screen - dashboard and quick actions
├── record.tsx       # Audio recording with expo-av
├── meetings.tsx     # Meeting list view
└── tasks.tsx        # GTD task management

contexts/
└── AppContext.tsx   # Global state: meetings, tasks, projects

types/
└── index.ts         # TypeScript definitions

utils/
└── sampleData.ts    # Demo data generator

constants/
└── colors.ts        # Mantis theme colors
```

## Tech Stack

- **React Native** - Cross-platform native framework
- **Expo** - Development platform and APIs
- **Expo Router** - File-based navigation
- **TypeScript** - Type safety
- **AsyncStorage** - Local persistence
- **Expo AV** - Audio recording
- **React Query** - Future: API state management
- **Lucide Icons** - Beautiful icon set

## Development Notes

### Testing
1. **Load sample data** to explore all features
2. **Record a real meeting** to test audio capture
3. **Test on both light/dark modes**
4. **Try all GTD tabs** to see task organization

### Performance
- All state changes are memoized
- AsyncStorage operations are async
- Lists use FlatList for performance
- Safe area insets properly handled

### Cross-Platform Notes
- Audio recording works on iOS, Android, and Web
- Safe area handled differently per platform
- Tab bar automatically adjusts to device
- Dark mode follows system preference

---

**PMantis is ready for AI integration!** Once you enable backend, you can add the STT and LLM features to unlock the full power of AI-assisted meeting management.
