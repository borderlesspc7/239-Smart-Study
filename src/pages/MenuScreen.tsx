"use client";

import { MaterialIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { useEffect, useState } from "react";
import {
  Alert,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { QuickAccessCard } from "../components/dashboard/QuickAccessCard";
import { RecentContentCard } from "../components/dashboard/RecentContentCard";
import { StatCard } from "../components/dashboard/StatCard";
import { WeeklyProgress } from "../components/dashboard/WeeklyProgress";
import { Layout } from "../components/layout";
import { useAuth } from "../hooks/useAuth";
import { paths } from "../routes/paths";
import { DashboardService } from "../services/dashboardService";
import type { DashboardData } from "../types/dashboard";

export function MenuScreen() {
  const { user, logout } = useAuth();
  const navigation = useNavigation();
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(
    null
  );
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadDashboardData = async () => {
    if (!user?.uid) return;

    try {
      const data = await DashboardService.getDashboardData(user.uid);
      setDashboardData(data);
    } catch (error) {
      console.error("Erro ao carregar dados do dashboard:", error);
      Alert.alert("Erro", "Não foi possível carregar os dados do dashboard");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboardData();
  }, [user?.uid]);

  const onRefresh = async () => {
    setRefreshing(true);
    await loadDashboardData();
    setRefreshing(false);
  };

  const handleLogout = async () => {
    Alert.alert("Sair", "Tem certeza que deseja sair?", [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Sair",
        style: "destructive",
        onPress: async () => {
          try {
            await logout();
          } catch (error) {
            Alert.alert("Erro", "Não foi possível sair da conta");
          }
        },
      },
    ]);
  };

  const handleQuickAccess = (route: string) => {
    console.log("Tentando navegar para:", route);
    (navigation as any).navigate(route);
  };

  const handleViewContentLibrary = () => {
    (navigation as any).navigate(paths.contentLibrary);
  };

  const handleContentPress = (content: any) => {
    // TODO: Implementar abertura de conteúdo
    Alert.alert("Conteúdo", `Abrindo: ${content.title}`);
  };

  const formatAccuracyPercentage = () => {
    if (!dashboardData?.statistics.questionsAnswered) return "0%";
    const accuracy =
      (dashboardData.statistics.correctAnswers /
        dashboardData.statistics.questionsAnswered) *
      100;
    return `${Math.round(accuracy)}%`;
  };

  const formatStudyTime = () => {
    if (!dashboardData?.statistics.studyTimeTotal) return "0h";
    const hours = Math.floor(dashboardData.statistics.studyTimeTotal / 60);
    const minutes = dashboardData.statistics.studyTimeTotal % 60;
    if (hours === 0) return `${minutes}min`;
    if (minutes === 0) return `${hours}h`;
    return `${hours}h ${minutes}min`;
  };

  if (loading || !dashboardData) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Carregando...</Text>
      </View>
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
        {/* Estatísticas Principais */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Seu Progresso</Text>
          <View style={styles.statsGrid}>
            <View style={styles.statsColumn}>
              <StatCard
                title="Questões Respondidas"
                value={dashboardData.statistics.questionsAnswered}
                icon="quiz"
                color="#4F46E5"
              />
              <StatCard
                title="Tempo Total de Estudo"
                value={formatStudyTime()}
                icon="schedule"
                color="#059669"
              />
            </View>
            <View style={styles.statsColumn}>
              <StatCard
                title="Taxa de Acerto"
                value={formatAccuracyPercentage()}
                icon="check-circle"
                color="#DC2626"
              />
              <StatCard
                title="Sequência de Dias"
                value={`${dashboardData.statistics.currentStreak} dias`}
                icon="local-fire-department"
                color="#F59E0B"
              />
            </View>
          </View>
        </View>

        {/* Meta Semanal */}
        <View style={styles.section}>
          <WeeklyProgress
            weeklyGoal={dashboardData.statistics.weeklyGoal}
            weeklyProgress={dashboardData.statistics.weeklyProgress}
          />
        </View>

        {/* Content Library Button */}
        <View style={styles.section}>
          <TouchableOpacity
            style={styles.contentLibraryButton}
            onPress={handleViewContentLibrary}
          >
            <MaterialIcons name="library-books" size={24} color="#fff" />
            <View style={styles.buttonContent}>
              <Text style={styles.buttonTitle}>Biblioteca de Conteúdo</Text>
              <Text style={styles.buttonSubtitle}>
                Vídeos, textos e podcasts
              </Text>
            </View>
            <MaterialIcons name="arrow-forward" size={24} color="#fff" />
          </TouchableOpacity>
        </View>

        {/* Acesso Rápido */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Acesso Rápido</Text>
          {dashboardData.quickAccess.map((item) => (
            <QuickAccessCard
              key={item.id}
              item={item}
              onPress={handleQuickAccess}
            />
          ))}
        </View>

        {/* Conteúdos Recentes */}
        {dashboardData.recentContent.length > 0 && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Conteúdos Recentes</Text>
              <TouchableOpacity>
                <Text style={styles.seeAllText}>Ver todos</Text>
              </TouchableOpacity>
            </View>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              style={styles.horizontalScroll}
            >
              {dashboardData.recentContent.map((content) => (
                <RecentContentCard
                  key={content.id}
                  content={content}
                  onPress={handleContentPress}
                />
              ))}
            </ScrollView>
          </View>
        )}

        {/* Tarefas de Hoje */}
        {dashboardData.todaysTasks.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Tarefas de Hoje</Text>
            {dashboardData.todaysTasks.slice(0, 3).map((task) => (
              <View key={task.id} style={styles.taskItem}>
                <MaterialIcons
                  name={
                    task.isCompleted ? "check-circle" : "radio-button-unchecked"
                  }
                  size={20}
                  color={task.isCompleted ? "#10B981" : "#D1D5DB"}
                />
                <Text
                  style={[
                    styles.taskText,
                    task.isCompleted && styles.taskCompleted,
                  ]}
                >
                  {task.title}
                </Text>
                <View
                  style={[
                    styles.priorityBadge,
                    {
                      backgroundColor:
                        task.priority === "high"
                          ? "#EF4444"
                          : task.priority === "medium"
                          ? "#F59E0B"
                          : "#10B981",
                    },
                  ]}
                >
                  <Text style={styles.priorityText}>
                    {task.priority === "high"
                      ? "Alta"
                      : task.priority === "medium"
                      ? "Média"
                      : "Baixa"}
                  </Text>
                </View>
              </View>
            ))}
          </View>
        )}

        <View style={styles.bottomPadding} />
      </ScrollView>
    </Layout>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F9FAFB",
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
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  seeAllText: {
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
  horizontalScroll: {
    marginLeft: -20,
    paddingLeft: 20,
  },
  taskItem: {
    backgroundColor: "#FFFFFF",
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
    flexDirection: "row",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  taskText: {
    flex: 1,
    fontSize: 14,
    color: "#111827",
    marginLeft: 12,
    marginRight: 8,
  },
  taskCompleted: {
    textDecorationLine: "line-through",
    color: "#6B7280",
  },
  priorityBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  priorityText: {
    fontSize: 10,
    color: "#FFFFFF",
    fontWeight: "600",
  },
  bottomPadding: {
    height: 20,
  },
  contentLibraryButton: {
    backgroundColor: "#6366F1",
    borderRadius: 12,
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  buttonContent: {
    flex: 1,
  },
  buttonTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#fff",
  },
  buttonSubtitle: {
    fontSize: 13,
    color: "rgba(255,255,255,0.8)",
    marginTop: 2,
  },
});
