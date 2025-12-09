export interface StudyStatistics {
  questionsAnswered: number;
  correctAnswers: number;
  studyTimeTotal: number;
  currentStreak: number;
  totalExams: number;
  averageScore: number;
  lastStudyDate: Date | null;
  weeklyGoal: number;
  weeklyProgress: number;
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
  duration?: number;
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
  timeSpent: number;
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
