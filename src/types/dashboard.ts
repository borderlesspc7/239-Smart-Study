export interface StudyStatistics {
  questionsAnswered: number;
  correctAnswers: number;
  studyTimeTotal: number; // em minutos
  currentStreak: number; // dias consecutivos de estudo
  totalExams: number;
  averageScore: number; // porcentagem
  lastStudyDate: Date | null;
  weeklyGoal: number; // minutos por semana
  weeklyProgress: number; // minutos estudados nesta semana
}

export interface QuickAccessItem {
  id: string;
  title: string;
  subtitle: string;
  icon: string;
  color: string;
  route: string;
  badgeCount?: number;
}

export interface StudyContent {
  id: string;
  title: string;
  type: "video" | "text" | "podcast" | "audio";
  duration?: number; // em minutos
  category: string;
  thumbnail?: string;
  isCompleted: boolean;
  lastAccessed?: Date;
}

export interface ExamResult {
  id: string;
  examTitle: string;
  score: number;
  totalQuestions: number;
  correctAnswers: number;
  completedAt: Date;
  timeSpent: number; // em minutos
  subject: string;
}

export interface DashboardData {
  statistics: StudyStatistics;
  quickAccess: QuickAccessItem[];
  recentContent: StudyContent[];
  recentExams: ExamResult[];
  todaysTasks: {
    id: string;
    title: string;
    isCompleted: boolean;
    priority: "high" | "medium" | "low";
  }[];
}
