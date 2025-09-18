import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { AudioRecording } from "../../types/audio";
import { AudioService } from "../../services/audioService";

interface AudioListProps {
  recordings: AudioRecording[];
  onPlayRecording: (recording: AudioRecording) => void;
  onDeleteRecording: (recording: AudioRecording) => void;
  onEditRecording?: (recording: AudioRecording) => void;
  showSubject?: boolean;
}

export const AudioList: React.FC<AudioListProps> = ({
  recordings,
  onPlayRecording,
  onDeleteRecording,
  onEditRecording,
  showSubject = false,
}) => {
  const formatDate = (date: Date): string => {
    return date.toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getSubjectIcon = (
    subject: string
  ): keyof typeof MaterialIcons.glyphMap => {
    const iconMap: Record<string, keyof typeof MaterialIcons.glyphMap> = {
      Matemática: "calculate",
      Física: "science",
      Química: "biotech",
      Biologia: "eco",
      História: "history-edu",
      Geografia: "public",
      Português: "translate",
      Literatura: "menu-book",
      Filosofia: "psychology",
      Sociologia: "groups",
      Inglês: "language",
    };
    return iconMap[subject] || "school";
  };

  const getSubjectColor = (subject: string): string => {
    const colorMap: Record<string, string> = {
      Matemática: "#4F46E5",
      Física: "#7C3AED",
      Química: "#059669",
      Biologia: "#DC2626",
      História: "#D97706",
      Geografia: "#0891B2",
      Português: "#BE123C",
      Literatura: "#7C2D12",
      Filosofia: "#4338CA",
      Sociologia: "#BE185D",
      Inglês: "#0D9488",
    };
    return colorMap[subject] || "#6B7280";
  };

  const renderRecordingItem = ({ item }: { item: AudioRecording }) => (
    <View style={styles.recordingCard}>
      <View style={styles.recordingHeader}>
        <View style={styles.recordingInfo}>
          <Text style={styles.recordingTitle} numberOfLines={2}>
            {item.title}
          </Text>
          {showSubject && (
            <View style={styles.subjectContainer}>
              <MaterialIcons
                name={getSubjectIcon(item.subject)}
                size={16}
                color={getSubjectColor(item.subject)}
              />
              <Text
                style={[
                  styles.subjectText,
                  { color: getSubjectColor(item.subject) },
                ]}
              >
                {item.subject}
              </Text>
            </View>
          )}
          <Text style={styles.recordingTopic} numberOfLines={1}>
            {item.topic}
          </Text>
        </View>

        <View style={styles.recordingActions}>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => onPlayRecording(item)}
          >
            <MaterialIcons name="play-arrow" size={20} color="#4F46E5" />
          </TouchableOpacity>

          {onEditRecording && (
            <TouchableOpacity
              style={styles.actionButton}
              onPress={() => onEditRecording(item)}
            >
              <MaterialIcons name="edit" size={20} color="#F59E0B" />
            </TouchableOpacity>
          )}

          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => onDeleteRecording(item)}
          >
            <MaterialIcons name="delete" size={20} color="#EF4444" />
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.recordingMeta}>
        <View style={styles.metaItem}>
          <MaterialIcons name="schedule" size={14} color="#9CA3AF" />
          <Text style={styles.metaText}>
            {AudioService.formatDuration(item.duration)}
          </Text>
        </View>

        <View style={styles.metaItem}>
          <MaterialIcons name="storage" size={14} color="#9CA3AF" />
          <Text style={styles.metaText}>
            {AudioService.formatFileSize(item.fileSize)}
          </Text>
        </View>

        <View style={styles.metaItem}>
          <MaterialIcons name="access-time" size={14} color="#9CA3AF" />
          <Text style={styles.metaText}>{formatDate(item.createdAt)}</Text>
        </View>
      </View>

      {!item.isProcessed && (
        <View style={styles.processingIndicator}>
          <MaterialIcons name="sync" size={16} color="#F59E0B" />
          <Text style={styles.processingText}>Processando...</Text>
        </View>
      )}
    </View>
  );

  const EmptyState = () => (
    <View style={styles.emptyState}>
      <MaterialIcons name="mic-none" size={48} color="#D1D5DB" />
      <Text style={styles.emptyStateTitle}>Nenhuma gravação encontrada</Text>
      <Text style={styles.emptyStateText}>
        Comece gravando suas explicações para vê-las aqui
      </Text>
    </View>
  );

  return (
    <FlatList
      data={recordings}
      keyExtractor={(item) => item.id}
      renderItem={renderRecordingItem}
      ListEmptyComponent={EmptyState}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={
        recordings.length === 0 ? styles.emptyContainer : styles.listContainer
      }
    />
  );
};

const styles = StyleSheet.create({
  listContainer: {
    paddingBottom: 20,
  },
  emptyContainer: {
    flexGrow: 1,
    justifyContent: "center",
    paddingVertical: 40,
  },
  recordingCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  recordingHeader: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 12,
  },
  recordingInfo: {
    flex: 1,
    marginRight: 12,
  },
  recordingTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#111827",
    marginBottom: 4,
  },
  subjectContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 4,
  },
  subjectText: {
    fontSize: 12,
    fontWeight: "500",
    marginLeft: 4,
  },
  recordingTopic: {
    fontSize: 14,
    color: "#6B7280",
  },
  recordingActions: {
    flexDirection: "row",
    alignItems: "center",
  },
  actionButton: {
    padding: 8,
    marginLeft: 4,
  },
  recordingMeta: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: "#F3F4F6",
  },
  metaItem: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  metaText: {
    fontSize: 12,
    color: "#9CA3AF",
    marginLeft: 4,
  },
  processingIndicator: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: "#F3F4F6",
  },
  processingText: {
    fontSize: 12,
    color: "#F59E0B",
    marginLeft: 4,
    fontWeight: "500",
  },
  emptyState: {
    alignItems: "center",
    paddingVertical: 40,
  },
  emptyStateTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#111827",
    marginTop: 16,
    marginBottom: 8,
  },
  emptyStateText: {
    fontSize: 14,
    color: "#6B7280",
    textAlign: "center",
    lineHeight: 20,
    paddingHorizontal: 20,
  },
});
