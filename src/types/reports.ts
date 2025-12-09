export interface MonthlyStats {
  month: string;
  questionsAnswered: number;
  correctAnswers: number;
  accuracy: number;
  studyTime: number;
  examsCompleted: number;
}

export interface PerformanceByCategory {
  category: string;
  total: number;
  correct: number;
  accuracy: number;
  trend: number; 
}

export interface DifficultyStats {
  difficulty: "Fácil" | "Médio" | "Difícil";
  total: number;
  correct: number;
  accuracy: number;
}

export interface ReportData {
  currentMonthStats: MonthlyStats;
  lastSixMonths: MonthlyStats[];
  performanceByCategory: PerformanceByCategory[];
  performanceByDifficulty: DifficultyStats[];
  totalStudyHours: number;
  averageAccuracy: number;
  bestCategory: PerformanceByCategory | null;
  weakestCategory: PerformanceByCategory | null;
  improvementTrend: number;
}
