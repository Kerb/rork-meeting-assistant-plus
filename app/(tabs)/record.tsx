import { Audio } from "expo-av";
import { Mic, Square, Upload } from "lucide-react-native";
import React, { useCallback, useState } from "react";
import {
  Alert,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  useColorScheme,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Colors from "@/constants/colors";
import { useApp } from "@/contexts/AppContext";
import { Meeting } from "@/types";

export default function RecordScreen() {
  const colorScheme = useColorScheme();
  const colors = colorScheme === "dark" ? Colors.dark : Colors.light;
  const { addMeeting } = useApp();
  const insets = useSafeAreaInsets();

  const [recording, setRecording] = useState<Audio.Recording | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [duration, setDuration] = useState(0);
  const [meetingTitle, setMeetingTitle] = useState("");

  const startRecording = useCallback(async () => {
    try {
      console.log("Requesting audio permissions...");
      const permission = await Audio.requestPermissionsAsync();

      if (!permission.granted) {
        Alert.alert("Permission required", "Please grant audio recording permission to use this feature.");
        return;
      }

      if (Platform.OS !== "web") {
        await Audio.setAudioModeAsync({
          allowsRecordingIOS: true,
          playsInSilentModeIOS: true,
        });
      }

      console.log("Starting recording...");
      const { recording: newRecording } = await Audio.Recording.createAsync(
        Platform.OS !== "web"
          ? {
              android: {
                extension: ".m4a",
                outputFormat: Audio.AndroidOutputFormat.MPEG_4,
                audioEncoder: Audio.AndroidAudioEncoder.AAC,
                sampleRate: 44100,
                numberOfChannels: 2,
                bitRate: 128000,
              },
              ios: {
                extension: ".wav",
                outputFormat: Audio.IOSOutputFormat.LINEARPCM,
                audioQuality: Audio.IOSAudioQuality.HIGH,
                sampleRate: 44100,
                numberOfChannels: 2,
                bitRate: 128000,
                linearPCMBitDepth: 16,
                linearPCMIsBigEndian: false,
                linearPCMIsFloat: false,
              },
              web: {},
            }
          : Audio.RecordingOptionsPresets.HIGH_QUALITY
      );

      newRecording.setOnRecordingStatusUpdate((status) => {
        if (status.isRecording) {
          setDuration(Math.floor(status.durationMillis / 1000));
        }
      });

      setRecording(newRecording);
      setIsRecording(true);
      console.log("Recording started");
    } catch (err) {
      console.error("Failed to start recording:", err);
      Alert.alert("Error", "Failed to start recording. Please try again.");
    }
  }, []);

  const stopRecording = useCallback(async () => {
    if (!recording) return;

    try {
      console.log("Stopping recording...");
      await recording.stopAndUnloadAsync();
      const uri = recording.getURI();

      if (Platform.OS !== "web") {
        await Audio.setAudioModeAsync({
          allowsRecordingIOS: false,
        });
      }

      console.log("Recording stopped. URI:", uri);

      const newMeeting: Meeting = {
        id: Date.now().toString(),
        title: meetingTitle || `Meeting ${new Date().toLocaleString()}`,
        startedAt: new Date().toISOString(),
        duration,
        audioUri: uri || undefined,
        status: "ready",
        createdAt: new Date().toISOString(),
      };

      addMeeting(newMeeting);

      setRecording(null);
      setIsRecording(false);
      setDuration(0);
      setMeetingTitle("");

      Alert.alert("Success", "Meeting recorded successfully! Check the Meetings tab to transcribe and analyze.");
    } catch (err) {
      console.error("Failed to stop recording:", err);
      Alert.alert("Error", "Failed to save recording. Please try again.");
    }
  }, [recording, meetingTitle, duration, addMeeting]);

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.content, { paddingTop: insets.top }]}>
        <View style={styles.header}>
          <Text style={[styles.title, { color: colors.text }]}>Record Meeting</Text>
          <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
            {isRecording ? "Recording in progress..." : "Start recording your meeting"}
          </Text>
        </View>

        {!isRecording && (
          <View style={styles.inputContainer}>
            <Text style={[styles.label, { color: colors.text }]}>Meeting Title</Text>
            <TextInput
              style={[
                styles.input,
                {
                  backgroundColor: colors.backgroundSecondary,
                  color: colors.text,
                  borderColor: colors.border,
                },
              ]}
              placeholder="Enter meeting title (optional)"
              placeholderTextColor={colors.textSecondary}
              value={meetingTitle}
              onChangeText={setMeetingTitle}
            />
          </View>
        )}

        <View style={styles.visualizer}>
          {isRecording ? (
            <>
              <View style={[styles.recordingPulse, { backgroundColor: colors.error + "20" }]}>
                <View style={[styles.recordingDot, { backgroundColor: colors.error }]} />
              </View>
              <Text style={[styles.duration, { color: colors.text }]}>
                {formatDuration(duration)}
              </Text>
            </>
          ) : (
            <>
              <View style={[styles.micIcon, { backgroundColor: colors.mantis + "20" }]}>
                <Mic size={64} color={colors.mantis} />
              </View>
              <Text style={[styles.readyText, { color: colors.textSecondary }]}>
                Ready to record
              </Text>
            </>
          )}
        </View>

        <View style={styles.controls}>
          {isRecording ? (
            <Pressable
              style={[styles.stopButton, { backgroundColor: colors.error }]}
              onPress={stopRecording}
            >
              <Square size={28} color="#FFFFFF" fill="#FFFFFF" />
              <Text style={styles.buttonText}>Stop Recording</Text>
            </Pressable>
          ) : (
            <>
              <Pressable
                style={[styles.recordButton, { backgroundColor: colors.mantis }]}
                onPress={startRecording}
              >
                <Mic size={24} color="#FFFFFF" />
                <Text style={styles.buttonText}>Start Recording</Text>
              </Pressable>
              <Pressable
                style={[styles.importButton, { borderColor: colors.border }]}
                onPress={() => {
                  Alert.alert("Import Audio", "Audio import feature will be available in the next update!");
                }}
              >
                <Upload size={24} color={colors.mantis} />
                <Text style={[styles.importButtonText, { color: colors.mantis }]}>
                  Import Audio
                </Text>
              </Pressable>
            </>
          )}
        </View>

        {!isRecording && (
          <View style={[styles.infoBox, { backgroundColor: colors.backgroundSecondary }]}>
            <Text style={[styles.infoText, { color: colors.textSecondary }]}>
              Tip: For best results, place your device near the speakers and minimize background noise.
            </Text>
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    padding: 20,
  },
  header: {
    marginBottom: 32,
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
  },
  inputContainer: {
    marginBottom: 32,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 8,
  },
  input: {
    padding: 16,
    borderRadius: 12,
    fontSize: 16,
    borderWidth: 1,
  },
  visualizer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 32,
  },
  recordingPulse: {
    width: 160,
    height: 160,
    borderRadius: 80,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 24,
  },
  recordingDot: {
    width: 24,
    height: 24,
    borderRadius: 12,
  },
  duration: {
    fontSize: 48,
    fontWeight: "700",
    fontVariant: ["tabular-nums"] as any,
  },
  micIcon: {
    width: 160,
    height: 160,
    borderRadius: 80,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 24,
  },
  readyText: {
    fontSize: 18,
  },
  controls: {
    gap: 12,
  },
  recordButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 18,
    borderRadius: 16,
    gap: 12,
  },
  stopButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 18,
    borderRadius: 16,
    gap: 12,
  },
  importButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 18,
    borderRadius: 16,
    borderWidth: 2,
    gap: 12,
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "600",
  },
  importButtonText: {
    fontSize: 18,
    fontWeight: "600",
  },
  infoBox: {
    padding: 16,
    borderRadius: 12,
    marginTop: 16,
  },
  infoText: {
    fontSize: 14,
    lineHeight: 20,
  },
});
