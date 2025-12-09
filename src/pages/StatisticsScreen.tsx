"use client";

import { useEffect, useState } from "react";
import {
  Alert,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { Layout } from "../components/layout";
import { ProgressChart } from "../components/reports/ProgressChart";
import { useAuth } from "../hooks/useAuth";
import {
  StatisticsService,
  type DetailedStatistics,
} from "../services/statisticsService";

export function StatisticsScreen() {
  const { user } = useAuth();
  const [statistics, setStatistics] = useState<DetailedStatistics | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadStatistics = async () => {
    if (!user?.uid) return;

    try {
      const data = await StatisticsService.getDetailedStatistics(user.uid);
      setStatistics(data);
    } catch (error) {
      console.error("Erro ao carregar estatísticas:", error);
      Alert.alert("Erro", "Não foi possível carregar as estatísticas");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadStatistics();
  }, [user?.uid]);

  const onRefresh = async () => {
    setRefreshing(true);
    await loadStatistics();
    setRefreshing(false);
  };

  if (loading || !statistics) {
    return (
      <Layout>
        <View style={styles.container}>
          <Text style={styles.loadingText}>Carregando estatísticas...</Text>
        </View>
      </Layout>
    );
  }

  const accuracy = Math.round(
    (statistics.correctAnswers / statistics.questionsAnswered) * 100
  );

  const studyHours = Math.floor(statistics.studyTimeTotal / 60);
  const studyMinutes = statistics.studyTimeTotal % 60;

  return (
    <Layout>
      <ScrollView
        style={styles.container}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {/* Header com título */}
        <View style={styles.header}>
          <Text style={styles.title}>Estatísticas</Text>
          <Text style={styles.subtitle}>Seu progresso até agora</Text>
        </View>

        {/* Cartões principais de estatísticas */}
        <View style={styles.mainCardsContainer}>
          <View style={[styles.card, styles.cardPrimary]}>
            <Text style={styles.cardLabel}>Taxa de Acerto</Text>
            <Text style={styles.cardValue}>{accuracy}%</Text>
            <Text style={styles.cardSubtitle}>
              {statistics.correctAnswers} acertos de{" "}
              {statistics.questionsAnswered}
            </Text>
          </View>

          <View style={[styles.card, styles.cardGreen]}>
            <Text style={styles.cardLabel}>Sequência de Estudos</Text>
            <Text style={styles.cardValue}>{statistics.currentStreak}</Text>
            <Text style={styles.cardSubtitle}>dias consecutivos</Text>
          </View>
        </View>

        <View style={styles.mainCardsContainer}>
          <View style={[styles.card, styles.cardOrange]}>
            <Text style={styles.cardLabel}>Tempo Total</Text>
            <Text style={styles.cardValue}>
              {studyHours}h {studyMinutes}m
            </Text>
            <Text style={styles.cardSubtitle}>de estudo</Text>
          </View>

          <View style={[styles.card, styles.cardPurple]}>
            <Text style={styles.cardLabel}>Simulados</Text>
            <Text style={styles.cardValue}>{statistics.totalExams}</Text>
            <Text style={styles.cardSubtitle}>
              Média: {Math.round(statistics.averageScore)}%
            </Text>
          </View>
        </View>

        {/* Progresso da semana */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Progresso da Semana</Text>
            <Text style={styles.sectionValue}>
              {statistics.weeklyProgress} / {statistics.weeklyGoal} min
            </Text>
          </View>

          <View style={styles.progressBarContainer}>
            <View
              style={[
                styles.progressBar,
                {
                  width: `${
                    (statistics.weeklyProgress / statistics.weeklyGoal) * 100
                  }%`,
                },
              ]}
            />
          </View>

          <Text style={styles.progressText}>
            {Math.round(
              (statistics.weeklyProgress / statistics.weeklyGoal) * 100
            )}
            % da meta semanal
          </Text>
        </View>

        {/* Tendência de Acerto - Últimos 30 dias */}
        <View style={styles.sectionPadding}>
          <ProgressChart
            title="Tendência de Acerto - Últimos 30 Dias"
            data={statistics.accuracyTrend}
            labels={statistics.accuracyTrend.map((_, i) => String(i - 29 + 30))}
            type="line"
            color="#4F46E5"
          />
        </View>

        {/* Progresso Mensal */}
        <View style={styles.sectionPadding}>
          <ProgressChart
            title="Progresso Mensal"
            data={statistics.monthlyProgress.map((m) => m.accuracy)}
            labels={statistics.monthlyProgress.map((m) => m.month)}
            type="bar"
            color="#10B981"
          />
        </View>

        {/* Performance por Categoria */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Performance por Matéria</Text>

          {statistics.accuracyByCategory.map((cat, index) => (
            <View key={index} style={styles.categoryItem}>
              <View style={styles.categoryHeader}>
                <Text style={styles.categoryName}>{cat.category}</Text>
                <Text style={styles.categoryAccuracy}>{cat.accuracy}%</Text>
              </View>
              <View style={styles.categoryProgressBar}>
                <View
                  style={[
                    styles.categoryProgress,
                    {
                      width: `${cat.accuracy}%`,
                      backgroundColor:
                        cat.accuracy >= 80
                          ? "#10B981"
                          : cat.accuracy >= 60
                          ? "#F59E0B"
                          : "#EF4444",
                    },
                  ]}
                />
              </View>
              <Text style={styles.categorySubtitle}>
                {cat.questionsAnswered} questões
              </Text>
            </View>
          ))}
        </View>

        {/* Áreas Fortes */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Suas Melhores Áreas</Text>

          {statistics.strongAreas.map((area, index) => (
            <View key={index} style={styles.strengthCard}>
              <View style={styles.strengthBadge} />
              <View style={styles.strengthContent}>
                <Text style={styles.strengthTitle}>{area.category}</Text>
                <Text style={styles.strengthAccuracy}>{area.accuracy}%</Text>
              </View>
            </View>
          ))}
        </View>

        {/* Áreas de Melhora */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Áreas de Melhora</Text>

          {statistics.weakAreas.map((area, index) => (
            <View key={index} style={styles.weakCard}>
              <View style={styles.weakBadge} />
              <View style={styles.weakContent}>
                <Text style={styles.weakTitle}>{area.category}</Text>
                <Text style={styles.weakAccuracy}>
                  {area.accuracy}% • {area.recommendedStudyTime}min recomendado
                </Text>
              </View>
            </View>
          ))}
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
  header: {
    paddingHorizontal: 20,
    paddingVertical: 24,
    backgroundColor: "#FFFFFF",
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    color: "#111827",
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: "#6B7280",
  },
  loadingText: {
    fontSize: 16,
    color: "#6B7280",
    textAlign: "center",
    marginTop: 20,
  },
  mainCardsContainer: {
    flexDirection: "row",
    paddingHorizontal: 20,
    paddingVertical: 12,
    gap: 12,
  },
  card: {
    flex: 1,
    borderRadius: 12,
    padding: 16,
    justifyContent: "center",
    alignItems: "flex-start",
  },
  cardPrimary: {
    backgroundColor: "#EEF2FF",
  },
  cardGreen: {
    backgroundColor: "#ECFDF5",
  },
  cardOrange: {
    backgroundColor: "#FEF3C7",
  },
  cardPurple: {
    backgroundColor: "#F3E8FF",
  },
  cardLabel: {
    fontSize: 12,
    color: "#6B7280",
    fontWeight: "600",
    marginBottom: 4,
  },
  cardValue: {
    fontSize: 24,
    fontWeight: "700",
    color: "#111827",
    marginBottom: 4,
  },
  cardSubtitle: {
    fontSize: 12,
    color: "#6B7280",
  },
  section: {
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  sectionPadding: {
    paddingVertical: 12,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#111827",
  },
  sectionValue: {
    fontSize: 14,
    fontWeight: "600",
    color: "#4F46E5",
  },
  progressBarContainer: {
    height: 8,
    backgroundColor: "#E5E7EB",
    borderRadius: 4,
    overflow: "hidden",
    marginBottom: 8,
  },
  progressBar: {
    height: "100%",
    backgroundColor: "#4F46E5",
    borderRadius: 4,
  },
  progressText: {
    fontSize: 12,
    color: "#6B7280",
    textAlign: "center",
  },
  categoryItem: {
    backgroundColor: "#FFFFFF",
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
  },
  categoryHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  categoryName: {
    fontSize: 14,
    fontWeight: "600",
    color: "#111827",
  },
  categoryAccuracy: {
    fontSize: 14,
    fontWeight: "700",
    color: "#4F46E5",
  },
  categoryProgressBar: {
    height: 6,
    backgroundColor: "#E5E7EB",
    borderRadius: 3,
    overflow: "hidden",
    marginBottom: 6,
  },
  categoryProgress: {
    height: "100%",
    borderRadius: 3,
  },
  categorySubtitle: {
    fontSize: 11,
    color: "#9CA3AF",
  },
  strengthCard: {
    flexDirection: "row",
    backgroundColor: "#ECFDF5",
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
    alignItems: "center",
  },
  strengthBadge: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#10B981",
    marginRight: 12,
  },
  strengthContent: {
    flex: 1,
  },
  strengthTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#111827",
  },
  strengthAccuracy: {
    fontSize: 12,
    color: "#059669",
    fontWeight: "600",
  },
  weakCard: {
    flexDirection: "row",
    backgroundColor: "#FEF2F2",
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
    alignItems: "center",
  },
  weakBadge: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#EF4444",
    marginRight: 12,
  },
  weakContent: {
    flex: 1,
  },
  weakTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#111827",
  },
  weakAccuracy: {
    fontSize: 12,
    color: "#DC2626",
    fontWeight: "600",
  },
  bottomPadding: {
    height: 20,
  },
});
