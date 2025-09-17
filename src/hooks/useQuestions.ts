import { useState, useEffect, useCallback } from "react";
import {
  Question,
  QuestionFilter,
  StudyRecommendation,
} from "../models/question/question";
import { questionService } from "../services/questionService";
import { notificationService } from "../services/notificationService";

export interface UseQuestionsReturn {
  questions: Question[];
  loading: boolean;
  error: string | null;
  filters: QuestionFilter;
  setFilters: (filters: QuestionFilter) => void;
  searchQuestions: (query: string) => void;
  toggleFavorite: (questionId: string) => boolean;
  getStudyRecommendations: (questionIds: string[]) => StudyRecommendation[];
  getQuestionsByCategory: (categoryId: string) => Question[];
  getQuestionsByTag: (tag: string) => Question[];
  getAllTags: () => string[];
  getCategories: () => any[];
  refreshQuestions: () => void;
}

export const useQuestions = (): UseQuestionsReturn => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<QuestionFilter>({});

  const loadQuestions = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const filteredQuestions = questionService.getQuestions(filters);
      setQuestions(filteredQuestions);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Erro ao carregar questões"
      );
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    loadQuestions();
  }, [loadQuestions]);

  const handleSetFilters = useCallback((newFilters: QuestionFilter) => {
    setFilters((prev) => ({ ...prev, ...newFilters }));
  }, []);

  const searchQuestions = useCallback(
    (query: string) => {
      if (!query.trim()) {
        setQuestions(questionService.getQuestions(filters));
        return;
      }

      const searchResults = questionService.searchQuestions(query);
      setQuestions(searchResults);
    },
    [filters]
  );

  const toggleFavorite = useCallback((questionId: string): boolean => {
    const isFavorite = questionService.toggleFavorite(questionId);

    // Atualiza a lista local
    setQuestions((prev) =>
      prev.map((q) => (q.id === questionId ? { ...q, isFavorite } : q))
    );

    return isFavorite;
  }, []);

  const getStudyRecommendations = useCallback(
    (questionIds: string[]): StudyRecommendation[] => {
      return questionService.getStudyRecommendations(questionIds);
    },
    []
  );

  const getQuestionsByCategory = useCallback(
    (categoryId: string): Question[] => {
      return questionService.getQuestionsByCategory(categoryId);
    },
    []
  );

  const getQuestionsByTag = useCallback((tag: string): Question[] => {
    return questionService.getQuestionsByTag(tag);
  }, []);

  const getAllTags = useCallback((): string[] => {
    return questionService.getAllTags();
  }, []);

  const getCategories = useCallback(() => {
    return questionService.getCategories();
  }, []);

  const refreshQuestions = useCallback(() => {
    loadQuestions();
  }, [loadQuestions]);

  return {
    questions,
    loading,
    error,
    filters,
    setFilters: handleSetFilters,
    searchQuestions,
    toggleFavorite,
    getStudyRecommendations,
    getQuestionsByCategory,
    getQuestionsByTag,
    getAllTags,
    getCategories,
    refreshQuestions,
  };
};

export const useFavorites = () => {
  const [favorites, setFavorites] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);

  const loadFavorites = useCallback(async () => {
    try {
      setLoading(true);
      const favoriteQuestions = questionService.getFavoriteQuestions();
      setFavorites(favoriteQuestions);
    } catch (err) {
      console.error("Erro ao carregar favoritos:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadFavorites();
  }, [loadFavorites]);

  const toggleFavorite = useCallback((questionId: string): boolean => {
    const isFavorite = questionService.toggleFavorite(questionId);

    if (isFavorite) {
      // Adiciona aos favoritos
      const question = questionService
        .getQuestions()
        .find((q) => q.id === questionId);
      if (question) {
        setFavorites((prev) => [...prev, { ...question, isFavorite: true }]);
      }
    } else {
      // Remove dos favoritos
      setFavorites((prev) => prev.filter((q) => q.id !== questionId));
    }

    return isFavorite;
  }, []);

  return {
    favorites,
    loading,
    toggleFavorite,
    refreshFavorites: loadFavorites,
  };
};

export const useStudySession = () => {
  const [session, setSession] = useState<any>(null);
  const [recommendations, setRecommendations] = useState<StudyRecommendation[]>(
    []
  );
  const [loading, setLoading] = useState(false);

  const startSession = useCallback(async (questionIds: string[]) => {
    try {
      setLoading(true);
      const newSession = questionService.startStudySession(
        "current-user",
        questionIds
      );
      setSession(newSession);
      setRecommendations(newSession.recommendations);
    } catch (err) {
      console.error("Erro ao iniciar sessão de estudo:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  const endSession = useCallback(
    async (score: number) => {
      if (session) {
        try {
          questionService.endStudySession(session.id, score);
          setSession(null);
          setRecommendations([]);
        } catch (err) {
          console.error("Erro ao finalizar sessão de estudo:", err);
        }
      }
    },
    [session]
  );

  return {
    session,
    recommendations,
    loading,
    startSession,
    endSession,
  };
};

export const useNotifications = () => {
  const [permission, setPermission] =
    useState<NotificationPermission>("default");
  const [isSupported, setIsSupported] = useState(false);

  useEffect(() => {
    setIsSupported("Notification" in window);
    if (isSupported) {
      setPermission(Notification.permission);
    }
  }, [isSupported]);

  const requestPermission = useCallback(async (): Promise<boolean> => {
    const granted = await notificationService.requestPermission();
    setPermission(Notification.permission);
    return granted;
  }, []);

  const sendStudyReminder = useCallback(async (questions: Question[]) => {
    await notificationService.sendStudyReminder(questions);
  }, []);

  const sendDailyProgress = useCallback(
    async (progress: number, goal: number) => {
      await notificationService.sendDailyStudyGoal(progress, goal);
    },
    []
  );

  const sendAchievement = useCallback(async (achievement: string) => {
    await notificationService.sendAchievementUnlocked(achievement);
  }, []);

  const testNotification = useCallback(async () => {
    await notificationService.testNotification();
  }, []);

  return {
    permission,
    isSupported,
    requestPermission,
    sendStudyReminder,
    sendDailyProgress,
    sendAchievement,
    testNotification,
  };
};
