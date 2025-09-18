import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  RefreshControl,
  Modal,
  TextInput,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { useAuth } from "../hooks/useAuth";
import { AudioService } from "../services/audioService";
import { AudioRecording } from "../types/audio";
import { Layout } from "../components/layout";

interface SubjectAudioScreenProps {
  subject: string;
}

export function SubjectAudioScreen({ subject }: SubjectAudioScreenProps) {
  const { user } = useAuth();
  const [recordings, setRecordings] = useState<AudioRecording[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [showNewRecordingModal, setShowNewRecordingModal] = useState(false);
  const [newRecordingTitle, setNewRecordingTitle] = useState("");
  const [newRecordingTopic, setNewRecordingTopic] = useState("");

  const loadRecordings = async () => {
    if (!user?.uid) return;

    try {
      const data = await AudioService.getRecordingsBySubject(user.uid, subject);
      setRecordings(data);
    } catch (error) {
      console.error("Erro ao carregar gravações:", error);
      Alert.alert("Erro", "Não foi possível carregar as gravações");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRecordings();
  }, [user?.uid, subject]);

  const onRefresh = async () => {
    setRefreshing(true);
    await loadRecordings();
    setRefreshing(false);
  };

  const handleStartRecording = async () => {
    try {
      setIsRecording(true);
      setRecordingTime(0);

      // Simular início da gravação
      const sessionId = await AudioService.startRecording();
      console.log("Gravação iniciada:", sessionId);

      // Simular contador de tempo
      const interval = setInterval(() => {
        setRecordingTime((prev) => prev + 1);
      }, 1000);

      // Parar após 10 minutos (600 segundos) automaticamente
      setTimeout(() => {
        if (isRecording) {
          handleStopRecording(interval);
        }
      }, 600000);
    } catch (error) {
      console.error("Erro ao iniciar gravação:", error);
      Alert.alert("Erro", "Não foi possível iniciar a gravação");
      setIsRecording(false);
    }
  };

  const handleStopRecording = async (interval?: NodeJS.Timeout) => {
    try {
      if (interval) {
        clearInterval(interval);
      }

      setIsRecording(false);
      setShowNewRecordingModal(true);

      // Simular parada da gravação
      const newRecording = await AudioService.stopRecording("session_123");
      console.log("Gravação finalizada:", newRecording);
    } catch (error) {
      console.error("Erro ao parar gravação:", error);
      Alert.alert("Erro", "Não foi possível parar a gravação");
    }
  };

  const handleSaveRecording = async () => {
    if (!newRecordingTitle.trim() || !newRecordingTopic.trim()) {
      Alert.alert("Erro", "Preencha o título e o tema da gravação");
      return;
    }

    try {
      // Aqui você salvaria os metadados da gravação mais recente
      // Por enquanto, vamos simular
      Alert.alert("Sucesso", "Gravação salva com sucesso!");

      setShowNewRecordingModal(false);
      setNewRecordingTitle("");
      setNewRecordingTopic("");
      setRecordingTime(0);

      // Recarregar lista de gravações
      await loadRecordings();
    } catch (error) {
      console.error("Erro ao salvar gravação:", error);
      Alert.alert("Erro", "Não foi possível salvar a gravação");
    }
  };

  const handlePlayRecording = (recording: AudioRecording) => {
    Alert.alert("Reproduzir Áudio", `Reproduzindo: ${recording.title}`);
  };

  const handleDeleteRecording = (recording: AudioRecording) => {
    Alert.alert(
      "Excluir Gravação",
      `Tem certeza que deseja excluir "${recording.title}"?`,
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Excluir",
          style: "destructive",
          onPress: async () => {
            try {
              await AudioService.deleteRecording(recording.id);
              await loadRecordings();
              Alert.alert("Sucesso", "Gravação excluída com sucesso!");
            } catch (error) {
              Alert.alert("Erro", "Não foi possível excluir a gravação");
            }
          },
        },
      ]
    );
  };

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  };

  const formatDate = (date: Date): string => {
    return date.toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  const getSubjectIcon = (): keyof typeof MaterialIcons.glyphMap => {
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
        {/* Header da Matéria */}
        <View style={styles.header}>
          <View style={styles.headerContent}>
            <MaterialIcons name={getSubjectIcon()} size={32} color="#4F46E5" />
            <Text style={styles.headerTitle}>{subject}</Text>
          </View>
          <Text style={styles.headerSubtitle}>
            {recordings.length} gravações disponíveis
          </Text>
        </View>

        {/* Controles de Gravação */}
        <View style={styles.recordingSection}>
          {!isRecording ? (
            <TouchableOpacity
              style={styles.recordButton}
              onPress={handleStartRecording}
              activeOpacity={0.8}
            >
              <MaterialIcons name="mic" size={24} color="#FFFFFF" />
              <Text style={styles.recordButtonText}>Iniciar Gravação</Text>
            </TouchableOpacity>
          ) : (
            <View style={styles.recordingActive}>
              <View style={styles.recordingInfo}>
                <View style={styles.recordingIndicator}>
                  <View style={styles.recordingDot} />
                  <Text style={styles.recordingText}>GRAVANDO</Text>
                </View>
                <Text style={styles.recordingTime}>
                  {formatTime(recordingTime)}
                </Text>
              </View>
              <TouchableOpacity
                style={styles.stopButton}
                onPress={() => handleStopRecording()}
                activeOpacity={0.8}
              >
                <MaterialIcons name="stop" size={24} color="#FFFFFF" />
              </TouchableOpacity>
            </View>
          )}
        </View>

        {/* Lista de Gravações */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Gravações Anteriores</Text>
          {recordings.length === 0 ? (
            <View style={styles.emptyState}>
              <MaterialIcons name="mic-none" size={48} color="#D1D5DB" />
              <Text style={styles.emptyStateTitle}>Nenhuma gravação ainda</Text>
              <Text style={styles.emptyStateText}>
                Comece gravando suas explicações para esta matéria
              </Text>
            </View>
          ) : (
            recordings.map((recording) => (
              <View key={recording.id} style={styles.recordingCard}>
                <View style={styles.recordingInfo}>
                  <Text style={styles.recordingTitle} numberOfLines={1}>
                    {recording.title}
                  </Text>
                  <Text style={styles.recordingTopic} numberOfLines={1}>
                    {recording.topic}
                  </Text>
                  <View style={styles.recordingMeta}>
                    <Text style={styles.recordingDate}>
                      {formatDate(recording.createdAt)}
                    </Text>
                    <Text style={styles.recordingDuration}>
                      {AudioService.formatDuration(recording.duration)}
                    </Text>
                  </View>
                </View>

                <View style={styles.recordingActions}>
                  <TouchableOpacity
                    style={styles.actionButton}
                    onPress={() => handlePlayRecording(recording)}
                  >
                    <MaterialIcons
                      name="play-arrow"
                      size={20}
                      color="#4F46E5"
                    />
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.actionButton}
                    onPress={() => handleDeleteRecording(recording)}
                  >
                    <MaterialIcons name="delete" size={20} color="#EF4444" />
                  </TouchableOpacity>
                </View>
              </View>
            ))
          )}
        </View>

        <View style={styles.bottomPadding} />
      </ScrollView>

      {/* Modal para Nova Gravação */}
      <Modal
        visible={showNewRecordingModal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowNewRecordingModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Salvar Gravação</Text>
            <Text style={styles.modalSubtitle}>
              Gravação de {formatTime(recordingTime)} - {subject}
            </Text>

            <TextInput
              style={styles.input}
              placeholder="Título da gravação"
              value={newRecordingTitle}
              onChangeText={setNewRecordingTitle}
              placeholderTextColor="#9CA3AF"
            />

            <TextInput
              style={styles.input}
              placeholder="Tema/Tópico"
              value={newRecordingTopic}
              onChangeText={setNewRecordingTopic}
              placeholderTextColor="#9CA3AF"
            />

            <View style={styles.modalActions}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => setShowNewRecordingModal(false)}
              >
                <Text style={styles.cancelButtonText}>Cancelar</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.modalButton, styles.saveButton]}
                onPress={handleSaveRecording}
              >
                <Text style={styles.saveButtonText}>Salvar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
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
  recordingSection: {
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  recordButton: {
    backgroundColor: "#4F46E5",
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
  recordButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
    marginLeft: 8,
  },
  recordingActive: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 20,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderWidth: 2,
    borderColor: "#EF4444",
    shadowColor: "#EF4444",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 8,
  },
  recordingIndicator: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  recordingDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#EF4444",
    marginRight: 8,
  },
  recordingText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#EF4444",
  },
  recordingTime: {
    fontSize: 18,
    fontWeight: "700",
    color: "#111827",
  },
  stopButton: {
    backgroundColor: "#EF4444",
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: "center",
    alignItems: "center",
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
  emptyState: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 32,
    alignItems: "center",
    marginTop: 16,
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
  },
  recordingCard: {
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
  recordingTopic: {
    fontSize: 14,
    color: "#6B7280",
    marginBottom: 8,
  },
  recordingMeta: {
    flexDirection: "row",
    alignItems: "center",
  },
  recordingDate: {
    fontSize: 12,
    color: "#9CA3AF",
    marginRight: 12,
  },
  recordingDuration: {
    fontSize: 12,
    color: "#9CA3AF",
    fontWeight: "500",
  },
  recordingActions: {
    flexDirection: "row",
    alignItems: "center",
  },
  actionButton: {
    padding: 8,
    marginLeft: 8,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  modalContent: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 24,
    width: "100%",
    maxWidth: 400,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#111827",
    marginBottom: 8,
    textAlign: "center",
  },
  modalSubtitle: {
    fontSize: 14,
    color: "#6B7280",
    marginBottom: 24,
    textAlign: "center",
  },
  input: {
    borderWidth: 1,
    borderColor: "#D1D5DB",
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    color: "#111827",
    marginBottom: 16,
  },
  modalActions: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 8,
  },
  modalButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: "center",
    marginHorizontal: 4,
  },
  cancelButton: {
    backgroundColor: "#F3F4F6",
  },
  saveButton: {
    backgroundColor: "#4F46E5",
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#6B7280",
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#FFFFFF",
  },
  bottomPadding: {
    height: 20,
  },
});
