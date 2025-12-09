import type {
  DifficultyStats,
  MonthlyStats,
  PerformanceByCategory,
  ReportData,
} from "../types/reports";

export class ReportService {
  // Gerar dados de relatório do usuário
  static async generateUserReport(userId: string): Promise<ReportData> {
    try {
      // Simulando dados de relatório
      const currentMonthStats = this.getCurrentMonthStats();
      const lastSixMonths = this.getLastSixMonthsStats();
      const performanceByCategory = this.getPerformanceByCategory();
      const performanceByDifficulty = this.getPerformanceByDifficulty();

      const bestCategory = performanceByCategory.reduce((best, current) =>
        current.accuracy > (best?.accuracy || 0) ? current : best
      );

      const weakestCategory = performanceByCategory.reduce((worst, current) =>
        current.accuracy < (worst?.accuracy || 100) ? current : worst
      );

      const totalStudyHours =
        lastSixMonths.reduce((acc, month) => acc + month.studyTime, 0) / 60;
      const averageAccuracy =
        lastSixMonths.reduce((acc, month) => acc + month.accuracy, 0) /
        lastSixMonths.length;

      // Calcular tendência de melhoria
      const currentAccuracy = currentMonthStats.accuracy;
      const previousMonthAccuracy =
        lastSixMonths[0]?.accuracy || currentAccuracy;
      const improvementTrend = currentAccuracy - previousMonthAccuracy;

      return {
        currentMonthStats,
        lastSixMonths,
        performanceByCategory,
        performanceByDifficulty,
        totalStudyHours: Math.round(totalStudyHours),
        averageAccuracy: Math.round(averageAccuracy),
        bestCategory,
        weakestCategory,
        improvementTrend,
      };
    } catch (error) {
      console.error("Erro ao gerar relatório:", error);
      throw error;
    }
  }

  // Dados do mês atual
  private static getCurrentMonthStats(): MonthlyStats {
    return {
      month: new Date().toLocaleDateString("pt-BR", {
        month: "long",
        year: "numeric",
      }),
      questionsAnswered: 127,
      correctAnswers: 104,
      accuracy: 82,
      studyTime: 840, // minutos
      examsCompleted: 5,
    };
  }

  // Dados dos últimos 6 meses
  private static getLastSixMonthsStats(): MonthlyStats[] {
    const months = [];
    const currentDate = new Date();

    for (let i = 5; i >= 0; i--) {
      const date = new Date(
        currentDate.getFullYear(),
        currentDate.getMonth() - i,
        1
      );
      const monthName = date.toLocaleDateString("pt-BR", { month: "short" });

      months.push({
        month: monthName,
        questionsAnswered: Math.floor(Math.random() * 100) + 50,
        correctAnswers: Math.floor(Math.random() * 80) + 30,
        accuracy: Math.floor(Math.random() * 30) + 65,
        studyTime: Math.floor(Math.random() * 400) + 300,
        examsCompleted: Math.floor(Math.random() * 4) + 2,
      });
    }

    return months;
  }

  // Performance por categoria
  private static getPerformanceByCategory(): PerformanceByCategory[] {
    const categories = [
      { name: "Matemática", total: 45, correct: 38 },
      { name: "Português", total: 38, correct: 32 },
      { name: "História", total: 32, correct: 26 },
      { name: "Física", total: 28, correct: 21 },
      { name: "Química", total: 25, correct: 19 },
      { name: "Biologia", total: 22, correct: 18 },
    ];

    return categories.map((cat) => ({
      category: cat.name,
      total: cat.total,
      correct: cat.correct,
      accuracy: Math.round((cat.correct / cat.total) * 100),
      trend: Math.floor(Math.random() * 20) - 10,
    }));
  }

  // Performance por dificuldade
  private static getPerformanceByDifficulty(): DifficultyStats[] {
    return [
      {
        difficulty: "Fácil",
        total: 62,
        correct: 58,
        accuracy: 94,
      },
      {
        difficulty: "Médio",
        total: 85,
        correct: 68,
        accuracy: 80,
      },
      {
        difficulty: "Difícil",
        total: 43,
        correct: 29,
        accuracy: 67,
      },
    ];
  }
}
