import { router } from "expo-router";
import { Calendar, CheckCircle2, Clock, Mic, Upload, Sparkles } from "lucide-react-native";
import React, { useMemo, useState } from "react";
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  useColorScheme,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import Colors from "@/constants/colors";
import { useApp } from "@/contexts/AppContext";
import { generateSampleMeetings, generateSampleTasks } from "@/utils/sampleData";

export default function TodayScreen() {
  const colorScheme = useColorScheme();
  const colors = colorScheme === "dark" ? Colors.dark : Colors.light;
  const { tasks, meetings, isLoading, addTasksFromMeeting, addMeeting } = useApp();
  const insets = useSafeAreaInsets();
  const [showDemoButton, setShowDemoButton] = useState(true);

  const hasData = tasks.length > 0 || meetings.length > 0;

  const loadSampleData = () => {
    const sampleMeetings = generateSampleMeetings();
    const sampleTasks = generateSampleTasks();
    
    sampleMeetings.forEach(meeting => {
      addMeeting(meeting);
    });
    
    addTasksFromMeeting(sampleTasks);
    setShowDemoButton(false);
  };

  const todayTasks = useMemo(() => {
    const today = new Date().toISOString().split("T")[0];
    return tasks.filter(
      (t) =>
        !t.completed &&
        (t.gtdStatus === "next" || (t.dueDate && t.dueDate <= today))
    ).slice(0, 5);
  }, [tasks]);

  const recentMeetings = useMemo(() => {
    return meetings.slice(0, 3);
  }, [meetings]);

  const stats = useMemo(() => {
    const activeTasks = tasks.filter((t) => !t.completed);
    const nextActions = activeTasks.filter((t) => t.gtdStatus === "next");
    const overdue = activeTasks.filter((t) => {
      if (!t.dueDate) return false;
      return t.dueDate < new Date().toISOString().split("T")[0];
    });

    return {
      total: activeTasks.length,
      next: nextActions.length,
      overdue: overdue.length,
    };
  }, [tasks]);

  if (isLoading) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <ActivityIndicator size="large" color={colors.mantis} />
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={[styles.header, { paddingTop: insets.top + 20 }]}>
          <Text style={[styles.greeting, { color: colors.text }]}>
            {getGreeting()}
          </Text>
          <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
            {new Date().toLocaleDateString("en-US", {
              weekday: "long",
              month: "long",
              day: "numeric",
            })}
          </Text>
        </View>

        <View style={styles.statsContainer}>
          <View style={[styles.statCard, { backgroundColor: colors.card }]}>
            <Text style={[styles.statNumber, { color: colors.mantis }]}>
              {stats.next}
            </Text>
            <Text style={[styles.statLabel, { color: colors.textSecondary }]}>
              Next Actions
            </Text>
          </View>
          <View style={[styles.statCard, { backgroundColor: colors.card }]}>
            <Text style={[styles.statNumber, { color: colors.info }]}>
              {stats.total}
            </Text>
            <Text style={[styles.statLabel, { color: colors.textSecondary }]}>
              Active Tasks
            </Text>
          </View>
          <View style={[styles.statCard, { backgroundColor: colors.card }]}>
            <Text
              style={[
                styles.statNumber,
                { color: stats.overdue > 0 ? colors.error : colors.mantis },
              ]}
            >
              {stats.overdue}
            </Text>
            <Text style={[styles.statLabel, { color: colors.textSecondary }]}>
              Overdue
            </Text>
          </View>
        </View>

        {!hasData && showDemoButton && (
          <Pressable
            style={[styles.demoButton, { backgroundColor: colors.mantis + "15", borderColor: colors.mantis }]}
            onPress={loadSampleData}
          >
            <Sparkles size={20} color={colors.mantis} />
            <Text style={[styles.demoButtonText, { color: colors.mantis }]}>
              Load Sample Data to Explore
            </Text>
          </Pressable>
        )}

        <View style={styles.actionButtons}>
          <Pressable
            style={[styles.primaryButton, { backgroundColor: colors.mantis }]}
            onPress={() => router.push("/(tabs)/record")}
          >
            <Mic size={20} color="#FFFFFF" />
            <Text style={styles.primaryButtonText}>Record Meeting</Text>
          </Pressable>
          <Pressable
            style={[styles.secondaryButton, { borderColor: colors.border }]}
            onPress={() => router.push("/(tabs)/record")}
          >
            <Upload size={20} color={colors.mantis} />
            <Text style={[styles.secondaryButtonText, { color: colors.mantis }]}>
              Import Audio
            </Text>
          </Pressable>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>
              Focus Today
            </Text>
            <Pressable onPress={() => router.push("/(tabs)/tasks")}>
              <Text style={[styles.seeAllText, { color: colors.mantis }]}>
                See all
              </Text>
            </Pressable>
          </View>
          {todayTasks.length > 0 ? (
            <View style={styles.taskList}>
              {todayTasks.map((task) => (
                <Pressable
                  key={task.id}
                  style={[styles.taskCard, { backgroundColor: colors.card }]}
                  onPress={() => {}}
                >
                  <View style={styles.taskIcon}>
                    <CheckCircle2 size={20} color={colors.mantis} />
                  </View>
                  <View style={styles.taskContent}>
                    <Text style={[styles.taskTitle, { color: colors.text }]}>
                      {task.title}
                    </Text>
                    {task.projectName && (
                      <Text style={[styles.taskProject, { color: colors.textSecondary }]}>
                        {task.projectName}
                      </Text>
                    )}
                  </View>
                  {task.dueDate && (
                    <View style={styles.taskDue}>
                      <Clock size={14} color={colors.textSecondary} />
                      <Text style={[styles.taskDueText, { color: colors.textSecondary }]}>
                        {formatDate(task.dueDate)}
                      </Text>
                    </View>
                  )}
                </Pressable>
              ))}
            </View>
          ) : (
            <View style={[styles.emptyState, { backgroundColor: colors.backgroundSecondary }]}>
              <CheckCircle2 size={48} color={colors.mantis} strokeWidth={1.5} />
              <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
                No tasks for today. You&apos;re all caught up!
              </Text>
            </View>
          )}
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>
              Recent Meetings
            </Text>
            <Pressable onPress={() => router.push("/(tabs)/meetings")}>
              <Text style={[styles.seeAllText, { color: colors.mantis }]}>
                See all
              </Text>
            </Pressable>
          </View>
          {recentMeetings.length > 0 ? (
            <View style={styles.meetingList}>
              {recentMeetings.map((meeting) => (
                <Pressable
                  key={meeting.id}
                  style={[styles.meetingCard, { backgroundColor: colors.card }]}
                  onPress={() => {}}
                >
                  <View style={styles.meetingHeader}>
                    <Calendar size={18} color={colors.mantis} />
                    <Text style={[styles.meetingTitle, { color: colors.text }]}>
                      {meeting.title}
                    </Text>
                  </View>
                  <View style={styles.meetingFooter}>
                    <Text style={[styles.meetingDate, { color: colors.textSecondary }]}>
                      {formatDate(meeting.startedAt)}
                    </Text>
                    <View
                      style={[
                        styles.statusBadge,
                        { backgroundColor: getStatusColor(meeting.status, colors) + "20" },
                      ]}
                    >
                      <Text
                        style={[
                          styles.statusText,
                          { color: getStatusColor(meeting.status, colors) },
                        ]}
                      >
                        {meeting.status}
                      </Text>
                    </View>
                  </View>
                </Pressable>
              ))}
            </View>
          ) : (
            <View style={[styles.emptyState, { backgroundColor: colors.backgroundSecondary }]}>
              <Calendar size={48} color={colors.mantis} strokeWidth={1.5} />
              <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
                No meetings yet. Start recording your first meeting!
              </Text>
            </View>
          )}
        </View>

        <View style={{ height: 32 }} />
      </ScrollView>
    </View>
  );
}

function getGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 18) return "Good afternoon";
  return "Good evening";
}

function formatDate(dateString: string) {
  const date = new Date(dateString);
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  if (date.toDateString() === today.toDateString()) return "Today";
  if (date.toDateString() === yesterday.toDateString()) return "Yesterday";

  return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

function getStatusColor(status: string, colors: any) {
  switch (status) {
    case "ready":
      return colors.success;
    case "transcribing":
    case "analyzing":
      return colors.info;
    case "error":
      return colors.error;
    default:
      return colors.textSecondary;
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 20,
    paddingBottom: 8,
  },
  greeting: {
    fontSize: 32,
    fontWeight: "700",
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
  },
  statsContainer: {
    flexDirection: "row",
    paddingHorizontal: 20,
    gap: 12,
    marginTop: 16,
  },
  statCard: {
    flex: 1,
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
  },
  statNumber: {
    fontSize: 28,
    fontWeight: "700",
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    textAlign: "center",
  },
  actionButtons: {
    flexDirection: "row",
    paddingHorizontal: 20,
    gap: 12,
    marginTop: 24,
  },
  primaryButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 16,
    borderRadius: 12,
    gap: 8,
  },
  primaryButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
  secondaryButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 16,
    borderRadius: 12,
    borderWidth: 2,
    gap: 8,
  },
  secondaryButtonText: {
    fontSize: 16,
    fontWeight: "600",
  },
  demoButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 16,
    marginHorizontal: 20,
    marginTop: 20,
    borderRadius: 12,
    borderWidth: 2,
    gap: 8,
  },
  demoButtonText: {
    fontSize: 15,
    fontWeight: "600",
  },
  section: {
    marginTop: 32,
    paddingHorizontal: 20,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "700",
  },
  seeAllText: {
    fontSize: 14,
    fontWeight: "600",
  },
  taskList: {
    gap: 12,
  },
  taskCard: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderRadius: 12,
    gap: 12,
  },
  taskIcon: {
    width: 32,
    height: 32,
    alignItems: "center",
    justifyContent: "center",
  },
  taskContent: {
    flex: 1,
  },
  taskTitle: {
    fontSize: 16,
    fontWeight: "500",
    marginBottom: 2,
  },
  taskProject: {
    fontSize: 13,
  },
  taskDue: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  taskDueText: {
    fontSize: 12,
  },
  meetingList: {
    gap: 12,
  },
  meetingCard: {
    padding: 16,
    borderRadius: 12,
  },
  meetingHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 12,
  },
  meetingTitle: {
    fontSize: 16,
    fontWeight: "600",
    flex: 1,
  },
  meetingFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  meetingDate: {
    fontSize: 13,
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  statusText: {
    fontSize: 12,
    fontWeight: "600",
    textTransform: "capitalize",
  },
  emptyState: {
    padding: 32,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  emptyText: {
    marginTop: 12,
    fontSize: 14,
    textAlign: "center",
  },
});
