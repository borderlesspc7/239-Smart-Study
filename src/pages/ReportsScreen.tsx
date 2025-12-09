"use client";

import { useEffect, useState } from "react";
import {
  Alert,
  RefreshControl,
  ScrollView,
  StyleSheet,
  View,
} from "react-native";
import { Layout } from "../components/layout";
import { CategoryPerformance } from "../components/reports/CategoryPerformance";
import { HighlightCard } from "../components/reports/HighlightCard";
import { ProgressChart } from "../components/reports/ProgressChart";
import { ReportHeader } from "../components/reports/ReportHeader";
import { useAuth } from "../hooks/useAuth";
import { ReportService } from "../services/reportService";
import type { ReportData } from "../types/reports";

export function ReportsScreen() {
  const { user } = useAuth();
  const [reportData, setReportData] = useState<ReportData | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadReportData = async () => {
    if (!user?.uid) return;

    try {
      const data = await ReportService.generateUserReport(user.uid);
      setReportData(data);
    } catch (error) {
      console.error("Erro ao carregar relatório:", error);
      Alert.alert("Erro", "Não foi possível carregar o relatório");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadReportData();
  }, [user?.uid]);

  const onRefresh = async () => {
    setRefreshing(true);
    await loadReportData();
    setRefreshing(false);
  };

  const handlePeriodChange = (period: "month" | "semester" | "year") => {
    // TODO: Implementar mudança de período
    console.log("Período selecionado:", period);
  };

  const handleCategoryPress = (category: any) => {
    // TODO: Implementar navegação para detalhes da categoria
    Alert.alert(
      "Detalhes da Matéria",
      `${category.category}: ${category.accuracy}%`
    );
  };

  if (!reportData) {
    return (
      <Layout>
        <View style={styles.container}>
          {/* Loading state - placeholder */}
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
        {/* Header com seletor de período */}
        <ReportHeader title="Relatórios" onPeriodChange={handlePeriodChange} />

        {/* Métricas principais */}
        <View style={styles.section}>
          <HighlightCard
            title="Taxa de Acerto"
            value={`${reportData.currentMonthStats.accuracy}%`}
            icon="check-circle"
            color="#10B981"
            trend={reportData.improvementTrend}
          />
          <HighlightCard
            title="Questões Respondidas"
            value={reportData.currentMonthStats.questionsAnswered}
            subtitle={`${reportData.currentMonthStats.correctAnswers} acertos`}
            icon="quiz"
            color="#4F46E5"
          />
          <HighlightCard
            title="Tempo de Estudo"
            value={`${Math.floor(
              reportData.currentMonthStats.studyTime / 60
            )}h ${reportData.currentMonthStats.studyTime % 60}min`}
            icon="schedule"
            color="#F59E0B"
          />
          <HighlightCard
            title="Simulados Realizados"
            value={reportData.currentMonthStats.examsCompleted}
            icon="assignment"
            color="#EC4899"
          />
        </View>

        {/* Gráfico de progresso - últimos 6 meses */}
        <View style={styles.sectionPadding}>
          <ProgressChart
            title="Progresso - Últimos 6 Meses"
            data={reportData.lastSixMonths.map((m) => m.accuracy)}
            labels={reportData.lastSixMonths.map((m) => m.month)}
            type="line"
            color="#4F46E5"
          />
        </View>

        {/* Gráfico de questões por dificuldade */}
        <View style={styles.sectionPadding}>
          <ProgressChart
            title="Questões por Dificuldade"
            data={reportData.performanceByDifficulty.map((d) => d.accuracy)}
            labels={reportData.performanceByDifficulty.map((d) => d.difficulty)}
            type="bar"
            color="#10B981"
          />
        </View>

        {/* Performance por matéria */}
        <View style={styles.sectionPadding}>
          <CategoryPerformance
            categories={reportData.performanceByCategory}
            onCategoryPress={handleCategoryPress}
          />
        </View>

        {/* Resumo e insights */}
        <View style={styles.section}>
          <View style={styles.insightCard}>
            <View style={styles.insightHeader}>
              <View style={styles.insightIcon}>
                <View style={styles.insightIconBg} />
              </View>
              <View style={styles.insightContent}>
                <View style={styles.insightTitle}>Sua Melhor Matéria</View>
                {reportData.bestCategory && (
                  <>
                    <View style={styles.insightValue}>
                      {reportData.bestCategory.category}
                    </View>
                    <View style={styles.insightValue}>
                      {reportData.bestCategory.accuracy}% de acerto
                    </View>
                  </>
                )}
              </View>
            </View>
          </View>

          <View style={styles.insightCard}>
            <View style={styles.insightHeader}>
              <View style={styles.insightIcon}>
                <View
                  style={[styles.insightIconBg, { backgroundColor: "#FEE2E2" }]}
                />
              </View>
              <View style={styles.insightContent}>
                <View style={styles.insightTitle}>Área de Melhora</View>
                {reportData.weakestCategory && (
                  <>
                    <View style={styles.insightValue}>
                      {reportData.weakestCategory.category}
                    </View>
                    <View style={styles.insightValue}>
                      {reportData.weakestCategory.accuracy}% de acerto
                    </View>
                  </>
                )}
              </View>
            </View>
          </View>

          <View style={styles.insightCard}>
            <View style={styles.insightHeader}>
              <View style={styles.insightIcon}>
                <View
                  style={[styles.insightIconBg, { backgroundColor: "#FEF3C7" }]}
                />
              </View>
              <View style={styles.insightContent}>
                <View style={styles.insightTitle}>
                  Total de Horas de Estudo
                </View>
                <View style={styles.insightValue}>
                  {reportData.totalStudyHours}h
                </View>
                <View style={styles.insightValue}>Últimos 6 meses</View>
              </View>
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
  section: {
    paddingHorizontal: 0,
    paddingVertical: 12,
  },
  sectionPadding: {
    paddingVertical: 12,
  },
  insightCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 20,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  insightHeader: {
    flexDirection: "row",
    alignItems: "flex-start",
  },
  insightIcon: {
    marginRight: 12,
  },
  insightIconBg: {
    width: 48,
    height: 48,
    borderRadius: 8,
    backgroundColor: "#D1FAE5",
  },
  insightContent: {
    flex: 1,
  },
  insightTitle: {
    fontSize: 12,
    color: "#6B7280",
    fontWeight: "600",
    marginBottom: 4,
  },
  insightValue: {
    fontSize: 16,
    fontWeight: "700",
    color: "#111827",
    marginBottom: 2,
  },
  insightSubtitle: {
    fontSize: 12,
    color: "#9CA3AF",
  },
  bottomPadding: {
    height: 20,
  },
});
