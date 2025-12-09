import {
  collection,
  doc,
  getDoc,
  getDocs,
  orderBy,
  query,
  setDoc,
  Timestamp,
  updateDoc,
  where,
} from "firebase/firestore";
import { db } from "../lib/firebaseconfig";
import type { StudyStatistics } from "../types/dashboard";

export interface DetailedStatistics extends StudyStatistics {
  accuracyByCategory: {
    category: string;
    accuracy: number;
    questionsAnswered: number;
  }[];
  accuracyTrend: number[];
  monthlyProgress: {
    month: string;
    accuracy: number;
    questionsAnswered: number;
    studyTime: number;
  }[];
  dailyStreak: {
    date: Date;
    studyTime: number;
  }[];
  weakAreas: {
    category: string;
    accuracy: number;
    recommendedStudyTime: number;
  }[];
  strongAreas: {
    category: string;
    accuracy: number;
  }[];
}

export class StatisticsService {
  static async getDetailedStatistics(
    userId: string
  ): Promise<DetailedStatistics> {
    try {
      const userStatsDoc = await getDoc(doc(db, "userStatistics", userId));
      const userProgressDoc = await getDoc(doc(db, "userProgress", userId));

      if (userStatsDoc.exists()) {
        const statsData = userStatsDoc.data() as StudyStatistics;
        const progressData = userProgressDoc.exists()
          ? userProgressDoc.data()
          : {};

        return {
          ...statsData,
          accuracyByCategory:
            progressData.accuracyByCategory ||
            this.getSampleAccuracyByCategory(),
          accuracyTrend:
            progressData.accuracyTrend || this.generateSampleTrend(),
          monthlyProgress:
            progressData.monthlyProgress || this.getSampleMonthlyProgress(),
          dailyStreak:
            progressData.dailyStreak || this.generateSampleDailyStreak(),
          weakAreas: progressData.weakAreas || this.getSampleWeakAreas(),
          strongAreas: progressData.strongAreas || this.getSampleStrongAreas(),
        };
      } else {
        return this.getDefaultDetailedStatistics();
      }
    } catch (error) {
      console.error("Erro ao buscar estatísticas detalhadas:", error);
      return this.getDefaultDetailedStatistics();
    }
  }

  static async getAccuracyByCategory(userId: string) {
    try {
      const q = query(
        collection(db, "userAnswers"),
        where("userId", "==", userId)
      );

      const querySnapshot = await getDocs(q);
      const categoryMap = new Map<string, { correct: number; total: number }>();

      querySnapshot.docs.forEach((doc) => {
        const data = doc.data();
        const category = data.category || "Sem categoria";

        if (!categoryMap.has(category)) {
          categoryMap.set(category, { correct: 0, total: 0 });
        }

        const stats = categoryMap.get(category)!;
        stats.total += 1;
        if (data.isCorrect) stats.correct += 1;
      });

      return Array.from(categoryMap.entries()).map(([category, stats]) => ({
        category,
        accuracy: Math.round((stats.correct / stats.total) * 100),
        questionsAnswered: stats.total,
      }));
    } catch (error) {
      console.error("Erro ao buscar accuracy por categoria:", error);
      return this.getSampleAccuracyByCategory();
    }
  }

  static async getMonthlyProgress(userId: string) {
    try {
      const q = query(
        collection(db, "examResults"),
        where("userId", "==", userId),
        orderBy("completedAt", "asc")
      );

      const querySnapshot = await getDocs(q);
      const monthlyMap = new Map<
        string,
        {
          accuracy: number;
          count: number;
          questionsAnswered: number;
          studyTime: number;
        }
      >();

      querySnapshot.docs.forEach((doc) => {
        const data = doc.data();
        const date = data.completedAt.toDate();
        const monthKey = date.toLocaleDateString("pt-BR", {
          month: "short",
          year: "numeric",
        });

        if (!monthlyMap.has(monthKey)) {
          monthlyMap.set(monthKey, {
            accuracy: 0,
            count: 0,
            questionsAnswered: 0,
            studyTime: 0,
          });
        }

        const stats = monthlyMap.get(monthKey)!;
        stats.accuracy += data.score;
        stats.count += 1;
        stats.questionsAnswered += data.totalQuestions;
        stats.studyTime += data.timeSpent;
      });

      return Array.from(monthlyMap.entries()).map(([month, stats]) => ({
        month,
        accuracy: Math.round(stats.accuracy / stats.count),
        questionsAnswered: stats.questionsAnswered,
        studyTime: stats.studyTime,
      }));
    } catch (error) {
      console.error("Erro ao buscar progresso mensal:", error);
      return this.getSampleMonthlyProgress();
    }
  }

  private static getDefaultDetailedStatistics(): DetailedStatistics {
    return {
      questionsAnswered: 234,
      correctAnswers: 189,
      studyTimeTotal: 2850,
      currentStreak: 7,
      totalExams: 12,
      averageScore: 81,
      lastStudyDate: new Date(),
      weeklyGoal: 300,
      weeklyProgress: 245,
      accuracyByCategory: this.getSampleAccuracyByCategory(),
      accuracyTrend: this.generateSampleTrend(),
      monthlyProgress: this.getSampleMonthlyProgress(),
      dailyStreak: this.generateSampleDailyStreak(),
      weakAreas: this.getSampleWeakAreas(),
      strongAreas: this.getSampleStrongAreas(),
    };
  }

  private static getSampleAccuracyByCategory() {
    return [
      { category: "Matemática", accuracy: 87, questionsAnswered: 45 },
      { category: "Português", accuracy: 82, questionsAnswered: 38 },
      { category: "História", accuracy: 78, questionsAnswered: 32 },
      { category: "Física", accuracy: 85, questionsAnswered: 28 },
      { category: "Química", accuracy: 80, questionsAnswered: 25 },
      { category: "Biologia", accuracy: 79, questionsAnswered: 22 },
    ];
  }

  private static generateSampleTrend() {
    const trend = [];
    for (let i = 29; i >= 0; i--) {
      trend.push(Math.floor(Math.random() * 25) + 70);
    }
    return trend;
  }

  private static getSampleMonthlyProgress() {
    return [
      { month: "nov", accuracy: 76, questionsAnswered: 45, studyTime: 420 },
      { month: "dez", accuracy: 79, questionsAnswered: 52, studyTime: 480 },
      { month: "jan", accuracy: 81, questionsAnswered: 58, studyTime: 520 },
      { month: "fev", accuracy: 83, questionsAnswered: 61, studyTime: 550 },
      { month: "mar", accuracy: 85, questionsAnswered: 78, studyTime: 620 },
    ];
  }

  private static generateSampleDailyStreak() {
    const streak = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      streak.push({
        date,
        studyTime: Math.floor(Math.random() * 120) + 30,
      });
    }
    return streak;
  }

  private static getSampleWeakAreas() {
    return [
      { category: "Física", accuracy: 72, recommendedStudyTime: 120 },
      { category: "História", accuracy: 76, recommendedStudyTime: 90 },
      { category: "Química", accuracy: 78, recommendedStudyTime: 75 },
    ];
  }

  private static getSampleStrongAreas() {
    return [
      { category: "Matemática", accuracy: 91 },
      { category: "Português", accuracy: 88 },
      { category: "Física", accuracy: 85 },
    ];
  }

  static async updateStatistics(
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

  static async logDailyStudyTime(
    userId: string,
    minutes: number,
    category?: string
  ): Promise<void> {
    try {
      const dailyLogRef = doc(
        collection(db, "userDailyLogs"),
        `${userId}_${new Date().toISOString().split("T")[0]}`
      );

      const existingLog = await getDoc(dailyLogRef);
      const currentData = existingLog.exists()
        ? existingLog.data()
        : { studyTime: 0, categories: {} };

      const updatedCategories = currentData.categories || {};
      if (category) {
        updatedCategories[category] =
          (updatedCategories[category] || 0) + minutes;
      }

      await setDoc(dailyLogRef, {
        userId,
        date: Timestamp.now(),
        studyTime: (currentData.studyTime || 0) + minutes,
        categories: updatedCategories,
      });
    } catch (error) {
      console.error("Erro ao registrar tempo de estudo diário:", error);
      throw error;
    }
  }
}
