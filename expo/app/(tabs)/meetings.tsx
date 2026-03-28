import { Calendar, FileText, Loader } from "lucide-react-native";
import React from "react";
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
import { Meeting } from "@/types";

export default function MeetingsScreen() {
  const colorScheme = useColorScheme();
  const colors = colorScheme === "dark" ? Colors.dark : Colors.light;
  const { meetings } = useApp();
  const insets = useSafeAreaInsets();

  const renderMeeting = ({ item }: { item: Meeting }) => (
    <Pressable
      style={[styles.card, { backgroundColor: colors.card }]}
      onPress={() => {}}
    >
      <View style={styles.cardHeader}>
        <View style={styles.cardIcon}>
          <Calendar size={20} color={colors.mantis} />
        </View>
        <View style={styles.cardContent}>
          <Text style={[styles.cardTitle, { color: colors.text }]} numberOfLines={2}>
            {item.title}
          </Text>
          <Text style={[styles.cardDate, { color: colors.textSecondary }]}>
            {formatDateTime(item.startedAt)}
          </Text>
        </View>
        <View
          style={[
            styles.statusBadge,
            { backgroundColor: getStatusColor(item.status, colors) + "20" },
          ]}
        >
          {item.status === "transcribing" || item.status === "analyzing" ? (
            <Loader size={14} color={getStatusColor(item.status, colors)} />
          ) : (
            <Text
              style={[
                styles.statusText,
                { color: getStatusColor(item.status, colors) },
              ]}
            >
              {item.status}
            </Text>
          )}
        </View>
      </View>

      {item.summary && (
        <View style={[styles.summaryBox, { backgroundColor: colors.backgroundSecondary }]}>
          <FileText size={16} color={colors.textSecondary} />
          <Text
            style={[styles.summaryText, { color: colors.textSecondary }]}
            numberOfLines={2}
          >
            {item.summary}
          </Text>
        </View>
      )}

      {item.duration && (
        <Text style={[styles.duration, { color: colors.textSecondary }]}>
          Duration: {formatDuration(item.duration)}
        </Text>
      )}
    </Pressable>
  );

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { paddingTop: insets.top + 20 }]}>
        <Text style={[styles.title, { color: colors.text }]}>Meetings</Text>
        <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
          {meetings.length} {meetings.length === 1 ? "meeting" : "meetings"}
        </Text>
      </View>

      {meetings.length > 0 ? (
        <FlatList
          data={meetings}
          renderItem={renderMeeting}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
        />
      ) : (
        <View style={styles.emptyState}>
          <View style={[styles.emptyIcon, { backgroundColor: colors.backgroundSecondary }]}>
            <Calendar size={48} color={colors.mantis} strokeWidth={1.5} />
          </View>
          <Text style={[styles.emptyTitle, { color: colors.text }]}>
            No meetings yet
          </Text>
          <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
            Record your first meeting to get started with AI-powered meeting analysis
          </Text>
        </View>
      )}
    </View>
  );
}

function formatDateTime(dateString: string) {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

function formatDuration(seconds: number) {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}m ${secs}s`;
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
  header: {
    paddingHorizontal: 20,
    paddingBottom: 12,
  },
  title: {
    fontSize: 32,
    fontWeight: "700",
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
  },
  list: {
    padding: 20,
    gap: 12,
  },
  card: {
    borderRadius: 16,
    padding: 16,
    gap: 12,
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 12,
  },
  cardIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  cardContent: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 4,
  },
  cardDate: {
    fontSize: 14,
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    minWidth: 80,
    alignItems: "center",
  },
  statusText: {
    fontSize: 12,
    fontWeight: "600",
    textTransform: "capitalize",
  },
  summaryBox: {
    flexDirection: "row",
    gap: 8,
    padding: 12,
    borderRadius: 8,
  },
  summaryText: {
    flex: 1,
    fontSize: 13,
    lineHeight: 18,
  },
  duration: {
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
