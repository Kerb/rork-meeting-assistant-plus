import AsyncStorage from "@react-native-async-storage/async-storage";
import createContextHook from "@nkzw/create-context-hook";
import { useCallback, useEffect, useMemo, useState } from "react";
import { Meeting, Project, Task } from "@/types";

const STORAGE_KEYS = {
  MEETINGS: "pmantis_meetings",
  TASKS: "pmantis_tasks",
  PROJECTS: "pmantis_projects",
};

export const [AppProvider, useApp] = createContextHook(() => {
  const [meetings, setMeetings] = useState<Meeting[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [meetingsData, tasksData, projectsData] = await Promise.all([
        AsyncStorage.getItem(STORAGE_KEYS.MEETINGS),
        AsyncStorage.getItem(STORAGE_KEYS.TASKS),
        AsyncStorage.getItem(STORAGE_KEYS.PROJECTS),
      ]);

      if (meetingsData) setMeetings(JSON.parse(meetingsData));
      if (tasksData) setTasks(JSON.parse(tasksData));
      if (projectsData) setProjects(JSON.parse(projectsData));
    } catch (error) {
      console.error("Failed to load data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const saveMeetings = useCallback(async (newMeetings: Meeting[]) => {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.MEETINGS, JSON.stringify(newMeetings));
      setMeetings(newMeetings);
    } catch (error) {
      console.error("Failed to save meetings:", error);
    }
  }, []);

  const saveTasks = useCallback(async (newTasks: Task[]) => {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.TASKS, JSON.stringify(newTasks));
      setTasks(newTasks);
    } catch (error) {
      console.error("Failed to save tasks:", error);
    }
  }, []);

  const saveProjects = useCallback(async (newProjects: Project[]) => {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.PROJECTS, JSON.stringify(newProjects));
      setProjects(newProjects);
    } catch (error) {
      console.error("Failed to save projects:", error);
    }
  }, []);

  const addMeeting = useCallback((meeting: Meeting) => {
    const newMeetings = [meeting, ...meetings];
    saveMeetings(newMeetings);
  }, [meetings, saveMeetings]);

  const updateMeeting = useCallback((id: string, updates: Partial<Meeting>) => {
    const newMeetings = meetings.map((m) =>
      m.id === id ? { ...m, ...updates } : m
    );
    saveMeetings(newMeetings);
  }, [meetings, saveMeetings]);

  const addTask = useCallback((task: Task) => {
    const newTasks = [task, ...tasks];
    saveTasks(newTasks);
  }, [tasks, saveTasks]);

  const updateTask = useCallback((id: string, updates: Partial<Task>) => {
    const newTasks = tasks.map((t) =>
      t.id === id ? { ...t, ...updates } : t
    );
    saveTasks(newTasks);
  }, [tasks, saveTasks]);

  const addProject = useCallback((project: Project) => {
    const newProjects = [project, ...projects];
    saveProjects(newProjects);
  }, [projects, saveProjects]);

  const addTasksFromMeeting = useCallback((newTasks: Task[]) => {
    const combined = [...newTasks, ...tasks];
    saveTasks(combined);
  }, [tasks, saveTasks]);

  return useMemo(() => ({
    meetings,
    tasks,
    projects,
    isLoading,
    addMeeting,
    updateMeeting,
    addTask,
    updateTask,
    addProject,
    addTasksFromMeeting,
  }), [meetings, tasks, projects, isLoading, addMeeting, updateMeeting, addTask, updateTask, addProject, addTasksFromMeeting]);
});
