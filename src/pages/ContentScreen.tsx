"use client";

import { MaterialIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { useState } from "react";
import {
  FlatList,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { CustomButton } from "../components/button/customButton";
import { StatCard } from "../components/dashboard/StatCard";
import { Layout } from "../components/layout";

interface ContentItem {
  id: string;
  title: string;
  description: string;
  progress: number;
  difficulty: "fácil" | "médio" | "difícil";
  icon: keyof typeof MaterialIcons.glyphMap;
  color: string;
  questionsCount: number;
  completedQuestions: number;
}

const CONTENTS: ContentItem[] = [
  {
    id: "1",
    title: "Português",
    description: "Compreensão, gramática e literatura",
    progress: 65,
    difficulty: "médio",
    icon: "language",
    color: "#4F46E5",
    questionsCount: 240,
    completedQuestions: 156,
  },
  {
    id: "2",
    title: "Matemática",
    description: "Álgebra, geometria e trigonometria",
    progress: 45,
    difficulty: "difícil",
    icon: "calculate",
    color: "#DC2626",
    questionsCount: 280,
    completedQuestions: 126,
  },
  {
    id: "3",
    title: "Física",
    description: "Mecânica, termodinâmica e óptica",
    progress: 55,
    difficulty: "difícil",
    icon: "shuffle",
    color: "#059669",
    questionsCount: 200,
    completedQuestions: 110,
  },
  {
    id: "4",
    title: "Química",
    description: "Reações, tabela periódica e soluções",
    progress: 70,
    difficulty: "médio",
    icon: "science",
    color: "#F59E0B",
    questionsCount: 220,
    completedQuestions: 154,
  },
  {
    id: "5",
    title: "História",
    description: "Eventos históricos e períodos",
    progress: 80,
    difficulty: "fácil",
    icon: "history-edu",
    color: "#8B5CF6",
    questionsCount: 180,
    completedQuestions: 144,
  },
  {
    id: "6",
    title: "Biologia",
    description: "Celular, genética e evolução",
    progress: 60,
    difficulty: "médio",
    icon: "favorite",
    color: "#EC4899",
    questionsCount: 210,
    completedQuestions: 126,
  },
];

export function ContentsScreen() {
  const navigation = useNavigation();
  const [selectedContent, setSelectedContent] = useState<string | null>(null);

  const totalQuestions = CONTENTS.reduce(
    (sum, item) => sum + item.questionsCount,
    0
  );
  const totalCompleted = CONTENTS.reduce(
    (sum, item) => sum + item.completedQuestions,
    0
  );
  const overallProgress = Math.round((totalCompleted / totalQuestions) * 100);
  const totalTime = "12h 30min";
  const currentStreak = 5;

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "fácil":
        return "#10B981";
      case "médio":
        return "#F59E0B";
      case "difícil":
        return "#EF4444";
      default:
        return "#6B7280";
    }
  };

  const handleContentPress = (contentId: string) => {
    setSelectedContent(contentId);
  };

  const handleStartSimulado = (contentTitle: string) => {
    // TODO: Navegar para tela de simulado
    console.log("[v0] Starting simulado for:", contentTitle);
    // (navigation as any).navigate("simulador", { subject: contentTitle });
  };

  const handleViewDetails = (contentTitle: string) => {
    // TODO: Navegar para tela de detalhes
    console.log("[v0] Viewing details for:", contentTitle);
  };

  const renderContentCard = ({ item }: { item: ContentItem }) => (
    <TouchableOpacity
      style={[
        styles.contentCard,
        selectedContent === item.id && styles.contentCardSelected,
      ]}
      onPress={() => handleContentPress(item.id)}
      activeOpacity={0.7}
    >
      <View style={styles.cardHeader}>
        <View
          style={[
            styles.cardIconContainer,
            { backgroundColor: item.color + "15", borderColor: item.color },
          ]}
        >
          <MaterialIcons name={item.icon} size={24} color={item.color} />
        </View>

        <View style={styles.cardTitleSection}>
          <Text style={styles.cardTitle}>{item.title}</Text>
          <Text style={styles.cardDescription} numberOfLines={1}>
            {item.description}
          </Text>
        </View>

        <View
          style={[
            styles.difficultyBadge,
            { backgroundColor: getDifficultyColor(item.difficulty) },
          ]}
        >
          <Text style={styles.difficultyText}>{item.difficulty}</Text>
        </View>
      </View>

      <View style={styles.progressSection}>
        <View style={styles.progressInfo}>
          <Text style={styles.progressLabel}>Progresso</Text>
          <Text style={styles.progressValue}>{item.progress}%</Text>
        </View>
        <View style={styles.progressBar}>
          <View
            style={[
              styles.progressFill,
              { width: `${item.progress}%`, backgroundColor: item.color },
            ]}
          />
        </View>
      </View>

      <View style={styles.statsRow}>
        <View style={styles.statItem}>
          <MaterialIcons name="quiz" size={16} color={item.color} />
          <Text style={styles.statText}>
            {item.completedQuestions}/{item.questionsCount}
          </Text>
        </View>
        <View style={styles.statSeparator} />
        <View style={styles.statItem}>
          <MaterialIcons
            name={item.progress >= 75 ? "check-circle" : "schedule"}
            size={16}
            color={item.progress >= 75 ? "#10B981" : "#6B7280"}
          />
          <Text style={styles.statText}>
            {item.progress >= 75 ? "Quase completo" : "Em progresso"}
          </Text>
        </View>
      </View>

      {selectedContent === item.id && (
        <View style={styles.expandedContent}>
          <CustomButton
            type="primary"
            onPress={() => handleStartSimulado(item.title)}
            text="Fazer Simulado"
          />
          <CustomButton
            type="secondary"
            onPress={() => handleViewDetails(item.title)}
            text="Ver Detalhes"
          />
        </View>
      )}
    </TouchableOpacity>
  );

  return (
    <Layout>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        {/* Header Section */}
        <View style={styles.headerSection}>
          <Text style={styles.headerTitle}>Conteúdos de Estudo</Text>
          <Text style={styles.headerSubtitle}>
            Escolha um conteúdo para iniciar seus estudos
          </Text>
        </View>

        {/* Quick Stats */}
        <View style={styles.section}>
          <View style={styles.statsGrid}>
            <View style={styles.statsColumn}>
              <StatCard
                title="Progresso Geral"
                value={`${overallProgress}%`}
                icon="trending-up"
                color="#4F46E5"
              />
              <StatCard
                title="Tempo Total"
                value={totalTime}
                icon="schedule"
                color="#059669"
              />
            </View>
            <View style={styles.statsColumn}>
              <StatCard
                title="Questões"
                value={`${totalCompleted}/${totalQuestions}`}
                icon="quiz"
                color="#DC2626"
              />
              <StatCard
                title="Sequência"
                value={`${currentStreak} dias`}
                icon="local-fire-department"
                color="#F59E0B"
              />
            </View>
          </View>
        </View>

        {/* Content List */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Disciplinas</Text>
            <TouchableOpacity>
              <Text style={styles.filterText}>Filtrar</Text>
            </TouchableOpacity>
          </View>

          <FlatList
            data={CONTENTS}
            renderItem={renderContentCard}
            keyExtractor={(item) => item.id}
            scrollEnabled={false}
            nestedScrollEnabled={true}
          />
        </View>

        {/* Recommendation Section */}
        <View style={styles.section}>
          <View
            style={{
              backgroundColor: "#EFF6FF",
              borderRadius: 12,
              padding: 16,
              flexDirection: "row",
              gap: 12,
              alignItems: "flex-start",
            }}
          >
            <MaterialIcons name="lightbulb" size={20} color="#3B82F6" />
            <View style={{ flex: 1 }}>
              <Text
                style={{ fontSize: 14, fontWeight: "600", color: "#1E40AF" }}
              >
                Dica de Estudo
              </Text>
              <Text
                style={{
                  fontSize: 13,
                  color: "#1E40AF",
                  marginTop: 4,
                  lineHeight: 18,
                }}
              >
                Foque em Matemática - você está com o progresso mais baixo por
                lá!
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
  headerSection: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 16,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: "700",
    color: "#111827",
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 16,
    color: "#6B7280",
    lineHeight: 24,
  },
  section: {
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#111827",
  },
  filterText: {
    fontSize: 14,
    color: "#4F46E5",
    fontWeight: "600",
  },
  statsGrid: {
    flexDirection: "row",
    gap: 12,
  },
  statsColumn: {
    flex: 1,
  },
  contentCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 2,
    borderColor: "#E5E7EB",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  contentCardSelected: {
    borderColor: "#4F46E5",
    backgroundColor: "#F0F4FF",
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
    gap: 12,
  },
  cardIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
  },
  cardTitleSection: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#111827",
    marginBottom: 2,
  },
  cardDescription: {
    fontSize: 13,
    color: "#6B7280",
  },
  difficultyBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  difficultyText: {
    color: "#FFFFFF",
    fontSize: 11,
    fontWeight: "600",
    textTransform: "capitalize",
  },
  progressSection: {
    marginBottom: 12,
  },
  progressInfo: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 6,
  },
  progressLabel: {
    fontSize: 12,
    fontWeight: "600",
    color: "#6B7280",
  },
  progressValue: {
    fontSize: 13,
    fontWeight: "700",
    color: "#111827",
  },
  progressBar: {
    height: 8,
    backgroundColor: "#E5E7EB",
    borderRadius: 4,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    borderRadius: 4,
  },
  statsRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 8,
    borderTopWidth: 1,
    borderTopColor: "#E5E7EB",
    paddingTop: 12,
  },
  statItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  statText: {
    fontSize: 12,
    fontWeight: "500",
    color: "#374151",
  },
  statSeparator: {
    width: 1,
    height: 16,
    backgroundColor: "#E5E7EB",
  },
  expandedContent: {
    marginTop: 12,
    borderTopWidth: 1,
    borderTopColor: "#E5E7EB",
    paddingTop: 12,
    gap: 8,
  },
  bottomPadding: {
    height: 40,
  },
});
