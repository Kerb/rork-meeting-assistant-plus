import { CheckCircle2, Circle, Clock, Inbox } from "lucide-react-native";
import React, { useMemo, useState } from "react";
import {
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  useColorScheme,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Colors from "@/constants/colors";
import { useApp } from "@/contexts/AppContext";
import { Task } from "@/types";

type TabType = "inbox" | "next" | "waiting" | "scheduled";

export default function TasksScreen() {
  const colorScheme = useColorScheme();
  const colors = colorScheme === "dark" ? Colors.dark : Colors.light;
  const { tasks, updateTask } = useApp();
  const [selectedTab, setSelectedTab] = useState<TabType>("next");
  const insets = useSafeAreaInsets();

  const filteredTasks = useMemo(() => {
    return tasks
      .filter((t) => !t.completed && t.gtdStatus === selectedTab)
      .sort((a, b) => {
        if (a.dueDate && b.dueDate) {
          return a.dueDate.localeCompare(b.dueDate);
        }
        if (a.dueDate) return -1;
        if (b.dueDate) return 1;
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      });
  }, [tasks, selectedTab]);

  const counts = useMemo(() => {
    const activeTasks = tasks.filter((t) => !t.completed);
    return {
      inbox: activeTasks.filter((t) => t.gtdStatus === "inbox").length,
      next: activeTasks.filter((t) => t.gtdStatus === "next").length,
      waiting: activeTasks.filter((t) => t.gtdStatus === "waiting").length,
      scheduled: activeTasks.filter((t) => t.gtdStatus === "scheduled").length,
    };
  }, [tasks]);

  const toggleComplete = (taskId: string, completed: boolean) => {
    updateTask(taskId, {
      completed,
      completedAt: completed ? new Date().toISOString() : undefined,
    });
  };

  const renderTask = ({ item }: { item: Task }) => {
    const isOverdue =
      item.dueDate && item.dueDate < new Date().toISOString().split("T")[0];

    return (
      <Pressable
        style={[styles.taskCard, { backgroundColor: colors.card }]}
        onPress={() => toggleComplete(item.id, !item.completed)}
      >
        <Pressable
          style={styles.checkbox}
          onPress={() => toggleComplete(item.id, !item.completed)}
        >
          {item.completed ? (
            <CheckCircle2 size={24} color={colors.mantis} fill={colors.mantis} />
          ) : (
            <Circle size={24} color={colors.textSecondary} />
          )}
        </Pressable>

        <View style={styles.taskContent}>
          <Text
            style={[
              styles.taskTitle,
              { color: item.completed ? colors.textSecondary : colors.text },
              item.completed && styles.taskCompleted,
            ]}
          >
            {item.title}
          </Text>

          <View style={styles.taskMeta}>
            {item.projectName && (
              <View style={[styles.badge, { backgroundColor: colors.mantis + "20" }]}>
                <Text style={[styles.badgeText, { color: colors.mantis }]}>
                  {item.projectName}
                </Text>
              </View>
            )}
            {item.priority && (
              <View
                style={[
                  styles.badge,
                  { backgroundColor: getPriorityColor(item.priority, colors) + "20" },
                ]}
              >
                <Text
                  style={[
                    styles.badgeText,
                    { color: getPriorityColor(item.priority, colors) },
                  ]}
                >
                  {item.priority}
                </Text>
              </View>
            )}
            {item.assignee && (
              <Text style={[styles.assignee, { color: colors.textSecondary }]}>
                @{item.assignee}
              </Text>
            )}
          </View>

          {item.dueDate && (
            <View style={styles.dueDateRow}>
              <Clock
                size={14}
                color={isOverdue ? colors.error : colors.textSecondary}
              />
              <Text
                style={[
                  styles.dueDate,
                  { color: isOverdue ? colors.error : colors.textSecondary },
                ]}
              >
                {formatDate(item.dueDate)}
              </Text>
            </View>
          )}
        </View>
      </Pressable>
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { paddingTop: insets.top + 20 }]}>
        <Text style={[styles.title, { color: colors.text }]}>Tasks</Text>
      </View>

      <View style={styles.tabs}>
        <Pressable
          style={[
            styles.tab,
            selectedTab === "inbox" && [
              styles.tabActive,
              { backgroundColor: colors.mantis },
            ],
          ]}
          onPress={() => setSelectedTab("inbox")}
        >
          <Inbox
            size={18}
            color={selectedTab === "inbox" ? "#FFFFFF" : colors.textSecondary}
          />
          <Text
            style={[
              styles.tabText,
              { color: selectedTab === "inbox" ? "#FFFFFF" : colors.textSecondary },
            ]}
          >
            Inbox
          </Text>
          {counts.inbox > 0 && (
            <View
              style={[
                styles.tabBadge,
                {
                  backgroundColor:
                    selectedTab === "inbox" ? "#FFFFFF20" : colors.backgroundSecondary,
                },
              ]}
            >
              <Text
                style={[
                  styles.tabBadgeText,
                  { color: selectedTab === "inbox" ? "#FFFFFF" : colors.text },
                ]}
              >
                {counts.inbox}
              </Text>
            </View>
          )}
        </Pressable>

        <Pressable
          style={[
            styles.tab,
            selectedTab === "next" && [
              styles.tabActive,
              { backgroundColor: colors.mantis },
            ],
          ]}
          onPress={() => setSelectedTab("next")}
        >
          <CheckCircle2
            size={18}
            color={selectedTab === "next" ? "#FFFFFF" : colors.textSecondary}
          />
          <Text
            style={[
              styles.tabText,
              { color: selectedTab === "next" ? "#FFFFFF" : colors.textSecondary },
            ]}
          >
            Next
          </Text>
          {counts.next > 0 && (
            <View
              style={[
                styles.tabBadge,
                {
                  backgroundColor:
                    selectedTab === "next" ? "#FFFFFF20" : colors.backgroundSecondary,
                },
              ]}
            >
              <Text
                style={[
                  styles.tabBadgeText,
                  { color: selectedTab === "next" ? "#FFFFFF" : colors.text },
                ]}
              >
                {counts.next}
              </Text>
            </View>
          )}
        </Pressable>

        <Pressable
          style={[
            styles.tab,
            selectedTab === "waiting" && [
              styles.tabActive,
              { backgroundColor: colors.mantis },
            ],
          ]}
          onPress={() => setSelectedTab("waiting")}
        >
          <Clock
            size={18}
            color={selectedTab === "waiting" ? "#FFFFFF" : colors.textSecondary}
          />
          <Text
            style={[
              styles.tabText,
              { color: selectedTab === "waiting" ? "#FFFFFF" : colors.textSecondary },
            ]}
          >
            Waiting
          </Text>
          {counts.waiting > 0 && (
            <View
              style={[
                styles.tabBadge,
                {
                  backgroundColor:
                    selectedTab === "waiting" ? "#FFFFFF20" : colors.backgroundSecondary,
                },
              ]}
            >
              <Text
                style={[
                  styles.tabBadgeText,
                  { color: selectedTab === "waiting" ? "#FFFFFF" : colors.text },
                ]}
              >
                {counts.waiting}
              </Text>
            </View>
          )}
        </Pressable>

        <Pressable
          style={[
            styles.tab,
            selectedTab === "scheduled" && [
              styles.tabActive,
              { backgroundColor: colors.mantis },
            ],
          ]}
          onPress={() => setSelectedTab("scheduled")}
        >
          <Clock
            size={18}
            color={selectedTab === "scheduled" ? "#FFFFFF" : colors.textSecondary}
          />
          <Text
            style={[
              styles.tabText,
              {
                color: selectedTab === "scheduled" ? "#FFFFFF" : colors.textSecondary,
              },
            ]}
          >
            Scheduled
          </Text>
          {counts.scheduled > 0 && (
            <View
              style={[
                styles.tabBadge,
                {
                  backgroundColor:
                    selectedTab === "scheduled" ? "#FFFFFF20" : colors.backgroundSecondary,
                },
              ]}
            >
              <Text
                style={[
                  styles.tabBadgeText,
                  { color: selectedTab === "scheduled" ? "#FFFFFF" : colors.text },
                ]}
              >
                {counts.scheduled}
              </Text>
            </View>
          )}
        </Pressable>
      </View>

      {filteredTasks.length > 0 ? (
        <FlatList
          data={filteredTasks}
          renderItem={renderTask}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
        />
      ) : (
        <View style={styles.emptyState}>
          <View style={[styles.emptyIcon, { backgroundColor: colors.backgroundSecondary }]}>
            <CheckCircle2 size={48} color={colors.mantis} strokeWidth={1.5} />
          </View>
          <Text style={[styles.emptyTitle, { color: colors.text }]}>
            No {selectedTab} tasks
          </Text>
          <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
            {getEmptyMessage(selectedTab)}
          </Text>
        </View>
      )}
    </View>
  );
}

function formatDate(dateString: string) {
  const date = new Date(dateString);
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  if (date.toDateString() === today.toDateString()) return "Today";
  if (date.toDateString() === tomorrow.toDateString()) return "Tomorrow";

  return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

function getPriorityColor(priority: string, colors: any) {
  switch (priority) {
    case "high":
      return colors.error;
    case "medium":
      return colors.warning;
    case "low":
      return colors.info;
    default:
      return colors.textSecondary;
  }
}

function getEmptyMessage(tab: TabType) {
  switch (tab) {
    case "inbox":
      return "New tasks will appear here for processing";
    case "next":
      return "Add your next actions to focus on what matters";
    case "waiting":
      return "Tasks waiting on others will be tracked here";
    case "scheduled":
      return "Tasks with specific dates will show up here";
    default:
      return "No tasks found";
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 20,
    paddingBottom: 12,
  },
  title: {
    fontSize: 32,
    fontWeight: "700",
  },
  tabs: {
    flexDirection: "row",
    paddingHorizontal: 20,
    gap: 8,
    marginBottom: 16,
  },
  tab: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 12,
    gap: 6,
  },
  tabActive: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  tabText: {
    fontSize: 13,
    fontWeight: "600",
  },
  tabBadge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 10,
    minWidth: 20,
    alignItems: "center",
  },
  tabBadgeText: {
    fontSize: 11,
    fontWeight: "700",
  },
  list: {
    padding: 20,
    gap: 12,
  },
  taskCard: {
    flexDirection: "row",
    padding: 16,
    borderRadius: 12,
    gap: 12,
    alignItems: "flex-start",
  },
  checkbox: {
    paddingTop: 2,
  },
  taskContent: {
    flex: 1,
    gap: 8,
  },
  taskTitle: {
    fontSize: 16,
    fontWeight: "500",
    lineHeight: 22,
  },
  taskCompleted: {
    textDecorationLine: "line-through",
  },
  taskMeta: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    alignItems: "center",
  },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  badgeText: {
    fontSize: 11,
    fontWeight: "600",
    textTransform: "capitalize",
  },
  assignee: {
    fontSize: 13,
  },
  dueDateRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  dueDate: {
    fontSize: 13,
  },
  emptyState: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 32,
  },
  emptyIcon: {
    width: 96,
    height: 96,
    borderRadius: 48,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: "700",
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 14,
    textAlign: "center",
    maxWidth: 280,
  },
});
