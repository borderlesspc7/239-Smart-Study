import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  where,
  orderBy,
  limit,
  Timestamp,
  setDoc,
  updateDoc,
} from "firebase/firestore";
import { db } from "../lib/firebaseconfig";
import {
  StudyStatistics,
  DashboardData,
  QuickAccessItem,
  StudyContent,
  ExamResult,
} from "../types/dashboard";

export class DashboardService {
  // Buscar estatísticas do usuário
  static async getUserStatistics(userId: string): Promise<StudyStatistics> {
    try {
      const userStatsDoc = await getDoc(doc(db, "userStatistics", userId));

      if (userStatsDoc.exists()) {
        const data = userStatsDoc.data();
        return {
          questionsAnswered: data.questionsAnswered || 0,
          correctAnswers: data.correctAnswers || 0,
          studyTimeTotal: data.studyTimeTotal || 0,
          currentStreak: data.currentStreak || 0,
          totalExams: data.totalExams || 0,
          averageScore: data.averageScore || 0,
          lastStudyDate: data.lastStudyDate
            ? data.lastStudyDate.toDate()
            : null,
          weeklyGoal: data.weeklyGoal || 300, // 5 horas por semana como padrão
          weeklyProgress: data.weeklyProgress || 0,
        };
      } else {
        // Criar estatísticas iniciais para usuário novo com dados de demonstração
        const initialStats: StudyStatistics = {
          questionsAnswered: 45,
          correctAnswers: 37,
          studyTimeTotal: 420, // 7 horas em minutos
          currentStreak: 5,
          totalExams: 3,
          averageScore: 85,
          lastStudyDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // ontem
          weeklyGoal: 300, // 5 horas
          weeklyProgress: 180, // 3 horas esta semana
        };

        await setDoc(doc(db, "userStatistics", userId), {
          ...initialStats,
          createdAt: Timestamp.now(),
          updatedAt: Timestamp.now(),
        });

        return initialStats;
      }
    } catch (error) {
      console.error("Erro ao buscar estatísticas do usuário:", error);
      throw error;
    }
  }

  // Buscar conteúdos recentes do usuário
  static async getRecentContent(userId: string): Promise<StudyContent[]> {
    try {
      const contentQuery = query(
        collection(db, "userContent"),
        where("userId", "==", userId),
        orderBy("lastAccessed", "desc"),
        limit(5)
      );

      const querySnapshot = await getDocs(contentQuery);
      const userContent = querySnapshot.docs.map((doc) => {
        const data = doc.data();
        return {
          id: doc.id,
          title: data.title,
          type: data.type,
          duration: data.duration,
          category: data.category,
          thumbnail: data.thumbnail,
          isCompleted: data.isCompleted || false,
          lastAccessed: data.lastAccessed
            ? data.lastAccessed.toDate()
            : undefined,
        };
      });

      // Se não há conteúdos do usuário, retorna dados de demonstração
      if (userContent.length === 0) {
        return this.getSampleContent();
      }

      return userContent;
    } catch (error) {
      console.error("Erro ao buscar conteúdos recentes:", error);
      // Retorna dados de demonstração em caso de erro
      return this.getSampleContent();
    }
  }

  // Dados de demonstração para conteúdos
  static getSampleContent(): StudyContent[] {
    return [
      {
        id: "sample1",
        title: "Introdução à Matemática Financeira",
        type: "video",
        duration: 45,
        category: "Matemática",
        isCompleted: true,
        lastAccessed: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 dias atrás
      },
      {
        id: "sample2",
        title: "Fundamentos de Programação",
        type: "text",
        duration: 30,
        category: "Tecnologia",
        isCompleted: false,
        lastAccessed: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // 1 dia atrás
      },
      {
        id: "sample3",
        title: "História do Brasil Colonial",
        type: "podcast",
        duration: 60,
        category: "História",
        isCompleted: true,
        lastAccessed: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 dias atrás
      },
      {
        id: "sample4",
        title: "Física Quântica Básica",
        type: "audio",
        duration: 25,
        category: "Física",
        isCompleted: false,
        lastAccessed: new Date(Date.now() - 12 * 60 * 60 * 1000), // 12 horas atrás
      },
    ];
  }

  // Buscar exames recentes
  static async getRecentExams(userId: string): Promise<ExamResult[]> {
    try {
      const examsQuery = query(
        collection(db, "examResults"),
        where("userId", "==", userId),
        orderBy("completedAt", "desc"),
        limit(3)
      );

      const querySnapshot = await getDocs(examsQuery);
      const userExams = querySnapshot.docs.map((doc) => {
        const data = doc.data();
        return {
          id: doc.id,
          examTitle: data.examTitle,
          score: data.score,
          totalQuestions: data.totalQuestions,
          correctAnswers: data.correctAnswers,
          completedAt: data.completedAt.toDate(),
          timeSpent: data.timeSpent,
          subject: data.subject,
        };
      });

      // Se não há exames do usuário, retorna dados de demonstração
      if (userExams.length === 0) {
        return this.getSampleExams();
      }

      return userExams;
    } catch (error) {
      console.error("Erro ao buscar exames recentes:", error);
      // Retorna dados de demonstração em caso de erro
      return this.getSampleExams();
    }
  }

  // Dados de demonstração para exames
  static getSampleExams(): ExamResult[] {
    return [
      {
        id: "exam1",
        examTitle: "Simulado ENEM - Matemática",
        score: 85,
        totalQuestions: 20,
        correctAnswers: 17,
        completedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // 1 dia atrás
        timeSpent: 45,
        subject: "Matemática",
      },
      {
        id: "exam2",
        examTitle: "Prova de História Geral",
        score: 78,
        totalQuestions: 15,
        correctAnswers: 12,
        completedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 dias atrás
        timeSpent: 30,
        subject: "História",
      },
      {
        id: "exam3",
        examTitle: "Teste de Português",
        score: 92,
        totalQuestions: 25,
        correctAnswers: 23,
        completedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), // 5 dias atrás
        timeSpent: 60,
        subject: "Português",
      },
    ];
  }

  // Definir itens de acesso rápido
  static getQuickAccessItems(): QuickAccessItem[] {
    return [
      {
        id: "questions",
        title: "Banco de Questões",
        subtitle: "Pratique com milhares de questões",
        icon: "quiz",
        color: "#4F46E5",
        route: "/questions",
      },
      {
        id: "audio-recording",
        title: "Gravação de Áudios",
        subtitle: "Grave resumos e anotações",
        icon: "mic",
        color: "#DC2626",
        route: "/audio-recording",
      },
      {
        id: "study-plan",
        title: "Roteiro de Estudos",
        subtitle: "Organize seu cronograma",
        icon: "calendar-today",
        color: "#059669",
        route: "/study-plan",
      },
      {
        id: "mock-exams",
        title: "Exames Simulados",
        subtitle: "Teste seus conhecimentos",
        icon: "assignment",
        color: "#7C3AED",
        route: "/mock-exams",
      },
      {
        id: "content",
        title: "Conteúdos",
        subtitle: "Vídeos, textos e podcasts",
        icon: "play-circle-filled",
        color: "#EA580C",
        route: "/content",
      },
      {
        id: "progress",
        title: "Progresso",
        subtitle: "Acompanhe sua evolução",
        icon: "trending-up",
        color: "#0891B2",
        route: "/progress",
      },
    ];
  }

  // Buscar tarefas do dia
  static async getTodaysTasks(userId: string) {
    try {
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const tasksQuery = query(
        collection(db, "userTasks"),
        where("userId", "==", userId),
        where("dueDate", ">=", Timestamp.fromDate(today)),
        where(
          "dueDate",
          "<",
          Timestamp.fromDate(new Date(today.getTime() + 24 * 60 * 60 * 1000))
        ),
        orderBy("priority", "desc")
      );

      const querySnapshot = await getDocs(tasksQuery);
      const userTasks = querySnapshot.docs.map((doc) => {
        const data = doc.data();
        return {
          id: doc.id,
          title: data.title,
          isCompleted: data.isCompleted || false,
          priority: data.priority || "medium",
        };
      });

      // Se não há tarefas do usuário, retorna dados de demonstração
      if (userTasks.length === 0) {
        return this.getSampleTasks();
      }

      return userTasks;
    } catch (error) {
      console.error("Erro ao buscar tarefas do dia:", error);
      // Retorna dados de demonstração em caso de erro
      return this.getSampleTasks();
    }
  }

  // Dados de demonstração para tarefas
  static getSampleTasks() {
    return [
      {
        id: "task1",
        title: "Revisar fórmulas de matemática",
        isCompleted: true,
        priority: "high" as const,
      },
      {
        id: "task2",
        title: "Ler capítulo 3 de história",
        isCompleted: false,
        priority: "medium" as const,
      },
      {
        id: "task3",
        title: "Fazer exercícios de física",
        isCompleted: false,
        priority: "high" as const,
      },
      {
        id: "task4",
        title: "Gravar resumo de português",
        isCompleted: false,
        priority: "low" as const,
      },
    ];
  }

  // Buscar todos os dados do dashboard
  static async getDashboardData(userId: string): Promise<DashboardData> {
    try {
      const [statistics, recentContent, recentExams, todaysTasks] =
        await Promise.all([
          this.getUserStatistics(userId),
          this.getRecentContent(userId),
          this.getRecentExams(userId),
          this.getTodaysTasks(userId),
        ]);

      return {
        statistics,
        quickAccess: this.getQuickAccessItems(),
        recentContent,
        recentExams,
        todaysTasks,
      };
    } catch (error) {
      console.error("Erro ao buscar dados do dashboard:", error);
      throw error;
    }
  }

  // Atualizar estatísticas do usuário
  static async updateUserStatistics(
    userId: string,
    updates: Partial<StudyStatistics>
  ): Promise<void> {
    try {
      const userStatsRef = doc(db, "userStatistics", userId);
      await updateDoc(userStatsRef, {
        ...updates,
        updatedAt: Timestamp.now(),
      });
    } catch (error) {
      console.error("Erro ao atualizar estatísticas:", error);
      throw error;
    }
  }

  // Registrar tempo de estudo
  static async logStudyTime(userId: string, minutes: number): Promise<void> {
    try {
      const stats = await this.getUserStatistics(userId);
      const newTotal = stats.studyTimeTotal + minutes;
      const newWeeklyProgress = stats.weeklyProgress + minutes;

      await this.updateUserStatistics(userId, {
        studyTimeTotal: newTotal,
        weeklyProgress: newWeeklyProgress,
        lastStudyDate: new Date(),
      });
    } catch (error) {
      console.error("Erro ao registrar tempo de estudo:", error);
      throw error;
    }
  }
}
