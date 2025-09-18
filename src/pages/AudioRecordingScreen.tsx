import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  RefreshControl,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { MaterialIcons } from "@expo/vector-icons";
import { useAuth } from "../hooks/useAuth";
import { AudioService } from "../services/audioService";
import { SubjectAudioStats } from "../types/audio";
import { Layout } from "../components/layout";

export function AudioRecordingScreen() {
  const { user } = useAuth();
  const navigation = useNavigation();
  const [subjectStats, setSubjectStats] = useState<SubjectAudioStats[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadSubjectStats = async () => {
    if (!user?.uid) return;

    try {
      const stats = await AudioService.getSubjectStats(user.uid);
      setSubjectStats(stats);
    } catch (error) {
      console.error("Erro ao carregar estatísticas:", error);
      Alert.alert("Erro", "Não foi possível carregar as estatísticas");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSubjectStats();
  }, [user?.uid]);

  const onRefresh = async () => {
    setRefreshing(true);
    await loadSubjectStats();
    setRefreshing(false);
  };

  const handleSubjectPress = (subject: SubjectAudioStats) => {
    (navigation as any).navigate("subject-audio", {
      subject: subject.subjectName,
    });
  };

  const handleNewRecording = () => {
    Alert.alert("Nova Gravação", "Selecione uma matéria para começar a gravar");
  };

  const formatDuration = (seconds: number): string => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);

    if (hours > 0) {
      return `${hours}h ${minutes}min`;
    }
    return `${minutes}min`;
  };

  const getSubjectIcon = (
    subjectName: string
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
    return iconMap[subjectName] || "school";
  };

  const getSubjectColor = (subjectName: string): string => {
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
    return colorMap[subjectName] || "#6B7280";
  };

  if (loading) {
    return (
      <Layout>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Carregando...</Text>
        </View>
      </Layout>
    );
  }

  return (
    <Layout>
      <ScrollView
        style={styles.container}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerContent}>
            <MaterialIcons name="mic" size={32} color="#4F46E5" />
            <Text style={styles.headerTitle}>Gravação de Áudio</Text>
          </View>
          <Text style={styles.headerSubtitle}>
            Grave explicações e organize por matéria
          </Text>
        </View>

        {/* Botão Nova Gravação */}
        <TouchableOpacity
          style={styles.newRecordingButton}
          onPress={handleNewRecording}
          activeOpacity={0.8}
        >
          <MaterialIcons name="add-circle" size={24} color="#FFFFFF" />
          <Text style={styles.newRecordingText}>Nova Gravação</Text>
        </TouchableOpacity>

        {/* Estatísticas Gerais */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Resumo Geral</Text>
          <View style={styles.summaryStats}>
            <View style={styles.summaryCard}>
              <Text style={styles.summaryNumber}>
                {subjectStats.reduce(
                  (sum, stat) => sum + stat.totalRecordings,
                  0
                )}
              </Text>
              <Text style={styles.summaryLabel}>Gravações</Text>
            </View>
            <View style={styles.summaryCard}>
              <Text style={styles.summaryNumber}>
                {formatDuration(
                  subjectStats.reduce(
                    (sum, stat) => sum + stat.totalDuration,
                    0
                  )
                )}
              </Text>
              <Text style={styles.summaryLabel}>Tempo Total</Text>
            </View>
            <View style={styles.summaryCard}>
              <Text style={styles.summaryNumber}>
                {subjectStats.filter((stat) => stat.totalRecordings > 0).length}
              </Text>
              <Text style={styles.summaryLabel}>Matérias</Text>
            </View>
          </View>
        </View>

        {/* Lista de Matérias */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Matérias</Text>
          {subjectStats.map((subject) => (
            <TouchableOpacity
              key={subject.subjectId}
              style={styles.subjectCard}
              onPress={() => handleSubjectPress(subject)}
              activeOpacity={0.7}
            >
              <View
                style={[
                  styles.subjectIconContainer,
                  {
                    backgroundColor:
                      getSubjectColor(subject.subjectName) + "15",
                  },
                ]}
              >
                <MaterialIcons
                  name={getSubjectIcon(subject.subjectName)}
                  size={24}
                  color={getSubjectColor(subject.subjectName)}
                />
              </View>

              <View style={styles.subjectInfo}>
                <Text style={styles.subjectName}>{subject.subjectName}</Text>
                <Text style={styles.subjectStats}>
                  {subject.totalRecordings} gravações •{" "}
                  {formatDuration(subject.totalDuration)}
                </Text>
                {subject.topics.length > 0 && (
                  <Text style={styles.subjectTopics} numberOfLines={1}>
                    {subject.topics.slice(0, 2).join(", ")}
                    {subject.topics.length > 2 && "..."}
                  </Text>
                )}
              </View>

              <View style={styles.subjectActions}>
                <MaterialIcons name="chevron-right" size={20} color="#9CA3AF" />
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {/* Dicas */}
        <View style={styles.section}>
          <View style={styles.tipsCard}>
            <MaterialIcons name="lightbulb" size={20} color="#F59E0B" />
            <View style={styles.tipsContent}>
              <Text style={styles.tipsTitle}>Dicas para gravação</Text>
              <Text style={styles.tipsText}>
                • Grave em ambiente silencioso{"\n"}• Fale claramente e em ritmo
                moderado{"\n"}• Organize por tema para facilitar revisão{"\n"}•
                Grave explicações de até 10 minutos
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.bottomPadding} />
      </ScrollView>
    </Layout>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F9FAFB",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F9FAFB",
  },
  loadingText: {
    fontSize: 16,
    color: "#6B7280",
  },
  header: {
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 20,
    paddingVertical: 24,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
  },
  headerContent: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "700",
    color: "#111827",
    marginLeft: 12,
  },
  headerSubtitle: {
    fontSize: 14,
    color: "#6B7280",
    marginLeft: 44,
  },
  newRecordingButton: {
    backgroundColor: "#4F46E5",
    marginHorizontal: 20,
    marginVertical: 16,
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderRadius: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#4F46E5",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  newRecordingText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
    marginLeft: 8,
  },
  section: {
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#111827",
    marginBottom: 16,
  },
  summaryStats: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  summaryCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 16,
    flex: 1,
    marginHorizontal: 4,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  summaryNumber: {
    fontSize: 20,
    fontWeight: "700",
    color: "#111827",
    marginBottom: 4,
  },
  summaryLabel: {
    fontSize: 12,
    color: "#6B7280",
    fontWeight: "500",
  },
  subjectCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    flexDirection: "row",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  subjectIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  subjectInfo: {
    flex: 1,
    marginRight: 12,
  },
  subjectName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#111827",
    marginBottom: 4,
  },
  subjectStats: {
    fontSize: 14,
    color: "#6B7280",
    marginBottom: 2,
  },
  subjectTopics: {
    fontSize: 12,
    color: "#9CA3AF",
    fontStyle: "italic",
  },
  subjectActions: {
    justifyContent: "center",
  },
  tipsCard: {
    backgroundColor: "#FFFBEB",
    borderRadius: 12,
    padding: 16,
    flexDirection: "row",
    borderLeftWidth: 4,
    borderLeftColor: "#F59E0B",
  },
  tipsContent: {
    flex: 1,
    marginLeft: 12,
  },
  tipsTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#92400E",
    marginBottom: 8,
  },
  tipsText: {
    fontSize: 12,
    color: "#92400E",
    lineHeight: 18,
  },
  bottomPadding: {
    height: 20,
  },
});
