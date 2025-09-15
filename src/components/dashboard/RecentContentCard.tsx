import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { StudyContent } from "../../types/dashboard";

interface RecentContentCardProps {
  content: StudyContent;
  onPress: (content: StudyContent) => void;
}

export const RecentContentCard: React.FC<RecentContentCardProps> = ({
  content,
  onPress,
}) => {
  const getTypeIcon = (type: StudyContent["type"]) => {
    switch (type) {
      case "video":
        return "play-circle-filled";
      case "audio":
        return "headset";
      case "podcast":
        return "podcast";
      case "text":
        return "article";
      default:
        return "description";
    }
  };

  const getTypeColor = (type: StudyContent["type"]) => {
    switch (type) {
      case "video":
        return "#EF4444";
      case "audio":
        return "#8B5CF6";
      case "podcast":
        return "#F59E0B";
      case "text":
        return "#10B981";
      default:
        return "#6B7280";
    }
  };

  const formatDuration = (minutes?: number) => {
    if (!minutes) return "";
    if (minutes < 60) return `${minutes}min`;
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return `${hours}h ${remainingMinutes}min`;
  };

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={() => onPress(content)}
      activeOpacity={0.7}
    >
      <View style={styles.contentContainer}>
        <View
          style={[
            styles.typeIconContainer,
            { backgroundColor: getTypeColor(content.type) + "20" },
          ]}
        >
          <MaterialIcons
            name={
              getTypeIcon(content.type) as keyof typeof MaterialIcons.glyphMap
            }
            size={20}
            color={getTypeColor(content.type)}
          />
        </View>

        <View style={styles.textContainer}>
          <Text style={styles.title} numberOfLines={2}>
            {content.title}
          </Text>
          <View style={styles.metaContainer}>
            <Text style={styles.category}>{content.category}</Text>
            {content.duration && (
              <>
                <Text style={styles.separator}>•</Text>
                <Text style={styles.duration}>
                  {formatDuration(content.duration)}
                </Text>
              </>
            )}
          </View>
        </View>

        {content.isCompleted && (
          <View style={styles.completedIndicator}>
            <MaterialIcons name="check-circle" size={20} color="#10B981" />
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#FFFFFF",
    borderRadius: 8,
    padding: 12,
    marginRight: 12,
    width: 200,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  contentContainer: {
    flexDirection: "column",
  },
  typeIconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8,
  },
  textContainer: {
    flex: 1,
    marginBottom: 8,
  },
  title: {
    fontSize: 14,
    fontWeight: "600",
    color: "#111827",
    marginBottom: 4,
    lineHeight: 18,
  },
  metaContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  category: {
    fontSize: 12,
    color: "#6B7280",
  },
  separator: {
    fontSize: 12,
    color: "#D1D5DB",
    marginHorizontal: 4,
  },
  duration: {
    fontSize: 12,
    color: "#6B7280",
  },
  completedIndicator: {
    position: "absolute",
    top: 8,
    right: 8,
  },
});
