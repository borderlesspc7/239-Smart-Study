export interface Question {
  id: string;
  question: string;
  answer: string;
  options: string[];
  category: string;
  difficulty: string;
  type: string;
  createdAt: string;
  updatedAt: string;
  categoryId: string;
  // Novos campos para funcionalidades
  tags?: string[];
  examType?: "ENEM" | "VESTIBULAR" | "CONCURSO" | "GENERAL";
  isFavorite?: boolean;
  studyRecommendations?: string[];
  lastStudied?: string;
  studyCount?: number;
  correctAnswers?: number;
  wrongAnswers?: number;
  averageTime?: number; // em segundos
}

export interface QuestionFilter {
  category?: string;
  categoryId?: string;
  difficulty?: "Fácil" | "Médio" | "Difícil";
  type?: string;
  examType?: "ENEM" | "VESTIBULAR" | "CONCURSO" | "GENERAL";
  tags?: string[];
  isFavorite?: boolean;
  searchTerm?: string;
}

export interface StudyRecommendation {
  topic: string;
  description: string;
  resources: string[];
  priority: "high" | "medium" | "low";
}

export interface StudySession {
  id: string;
  userId: string;
  questions: string[];
  startTime: string;
  endTime?: string;
  score?: number;
  recommendations: StudyRecommendation[];
}
