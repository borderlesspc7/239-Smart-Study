import {
  collection,
  doc,
  getDocs,
  getDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
  startAfter,
  DocumentSnapshot,
  QueryDocumentSnapshot,
} from "firebase/firestore";
import { db } from "../lib/firebaseconfig";
import {
  Question,
  QuestionFilter,
  StudySession,
} from "../models/question/question";

export class FirestoreService {
  private questionsCollection = collection(db, "questions");
  private favoritesCollection = collection(db, "favorites");
  private studySessionsCollection = collection(db, "studySessions");
  private userStatsCollection = collection(db, "userStats");

  // Métodos para questões
  async getQuestions(
    filter: QuestionFilter = {},
    pageSize: number = 20,
    lastDoc?: DocumentSnapshot
  ): Promise<{
    questions: Question[];
    lastDoc: DocumentSnapshot | null;
    hasMore: boolean;
  }> {
    try {
      let q = query(this.questionsCollection);

      // Aplica filtros
      if (filter.categoryId) {
        q = query(q, where("categoryId", "==", filter.categoryId));
      }
      if (filter.difficulty) {
        q = query(q, where("difficulty", "==", filter.difficulty));
      }
      if (filter.examType) {
        q = query(q, where("examType", "==", filter.examType));
      }
      if (filter.isFavorite) {
        q = query(q, where("isFavorite", "==", true));
      }

      // Ordenação e paginação
      q = query(q, orderBy("createdAt", "desc"), limit(pageSize));

      if (lastDoc) {
        q = query(q, startAfter(lastDoc));
      }

      const snapshot = await getDocs(q);
      const questions = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Question[];

      const lastDocument = snapshot.docs[snapshot.docs.length - 1] || null;
      const hasMore = snapshot.docs.length === pageSize;

      return {
        questions,
        lastDoc: lastDocument,
        hasMore,
      };
    } catch (error) {
      console.error("Erro ao buscar questões:", error);
      throw error;
    }
  }

  async getQuestionById(id: string): Promise<Question | null> {
    try {
      const docRef = doc(this.questionsCollection, id);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        return {
          id: docSnap.id,
          ...docSnap.data(),
        } as Question;
      }

      return null;
    } catch (error) {
      console.error("Erro ao buscar questão:", error);
      throw error;
    }
  }

  async searchQuestions(
    searchTerm: string,
    pageSize: number = 20
  ): Promise<{
    questions: Question[];
    lastDoc: DocumentSnapshot | null;
    hasMore: boolean;
  }> {
    try {
      // Firestore não suporta busca de texto completo nativamente
      // Aqui você pode implementar uma busca usando índices ou usar Algolia/Elasticsearch
      // Por enquanto, vamos fazer uma busca simples por categoria
      const q = query(
        this.questionsCollection,
        where("category", ">=", searchTerm),
        where("category", "<=", searchTerm + "\uf8ff"),
        limit(pageSize)
      );

      const snapshot = await getDocs(q);
      const questions = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Question[];

      return {
        questions,
        lastDoc: snapshot.docs[snapshot.docs.length - 1] || null,
        hasMore: snapshot.docs.length === pageSize,
      };
    } catch (error) {
      console.error("Erro ao buscar questões:", error);
      throw error;
    }
  }

  async updateQuestion(
    questionId: string,
    updates: Partial<Question>
  ): Promise<void> {
    try {
      const docRef = doc(this.questionsCollection, questionId);
      await updateDoc(docRef, {
        ...updates,
        updatedAt: new Date().toISOString(),
      });
    } catch (error) {
      console.error("Erro ao atualizar questão:", error);
      throw error;
    }
  }

  // Métodos para favoritos
  async addToFavorites(userId: string, questionId: string): Promise<void> {
    try {
      await addDoc(this.favoritesCollection, {
        userId,
        questionId,
        createdAt: new Date().toISOString(),
      });
    } catch (error) {
      console.error("Erro ao adicionar aos favoritos:", error);
      throw error;
    }
  }

  async removeFromFavorites(userId: string, questionId: string): Promise<void> {
    try {
      const q = query(
        this.favoritesCollection,
        where("userId", "==", userId),
        where("questionId", "==", questionId)
      );

      const snapshot = await getDocs(q);
      const batch = snapshot.docs.map((doc) => deleteDoc(doc.ref));
      await Promise.all(batch);
    } catch (error) {
      console.error("Erro ao remover dos favoritos:", error);
      throw error;
    }
  }

  async getUserFavorites(userId: string): Promise<string[]> {
    try {
      const q = query(this.favoritesCollection, where("userId", "==", userId));

      const snapshot = await getDocs(q);
      return snapshot.docs.map((doc) => doc.data().questionId);
    } catch (error) {
      console.error("Erro ao buscar favoritos:", error);
      throw error;
    }
  }

  // Métodos para sessões de estudo
  async createStudySession(session: StudySession): Promise<string> {
    try {
      const docRef = await addDoc(this.studySessionsCollection, {
        ...session,
        createdAt: new Date().toISOString(),
      });
      return docRef.id;
    } catch (error) {
      console.error("Erro ao criar sessão de estudo:", error);
      throw error;
    }
  }

  async updateStudySession(
    sessionId: string,
    updates: Partial<StudySession>
  ): Promise<void> {
    try {
      const docRef = doc(this.studySessionsCollection, sessionId);
      await updateDoc(docRef, {
        ...updates,
        updatedAt: new Date().toISOString(),
      });
    } catch (error) {
      console.error("Erro ao atualizar sessão de estudo:", error);
      throw error;
    }
  }

  async getUserStudySessions(
    userId: string,
    limitCount: number = 10
  ): Promise<StudySession[]> {
    try {
      const q = query(
        this.studySessionsCollection,
        where("userId", "==", userId),
        orderBy("startTime", "desc"),
        limit(limitCount)
      );

      const snapshot = await getDocs(q);
      return snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as StudySession[];
    } catch (error) {
      console.error("Erro ao buscar sessões de estudo:", error);
      throw error;
    }
  }

  // Métodos para estatísticas do usuário
  async updateUserStats(userId: string, stats: any): Promise<void> {
    try {
      const docRef = doc(this.userStatsCollection, userId);
      await updateDoc(docRef, {
        ...stats,
        updatedAt: new Date().toISOString(),
      });
    } catch (error) {
      console.error("Erro ao atualizar estatísticas:", error);
      throw error;
    }
  }

  async getUserStats(userId: string): Promise<any> {
    try {
      const docRef = doc(this.userStatsCollection, userId);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        return docSnap.data();
      }

      return null;
    } catch (error) {
      console.error("Erro ao buscar estatísticas:", error);
      throw error;
    }
  }

  // Métodos para sincronização
  async syncQuestionsToFirestore(questions: Question[]): Promise<void> {
    try {
      const batch = questions.map((question) =>
        addDoc(this.questionsCollection, {
          ...question,
          syncedAt: new Date().toISOString(),
        })
      );

      await Promise.all(batch);
    } catch (error) {
      console.error("Erro ao sincronizar questões:", error);
      throw error;
    }
  }

  // Métodos para notificações
  async saveNotificationSettings(userId: string, settings: any): Promise<void> {
    try {
      const docRef = doc(this.userStatsCollection, userId);
      await updateDoc(docRef, {
        notificationSettings: settings,
        updatedAt: new Date().toISOString(),
      });
    } catch (error) {
      console.error("Erro ao salvar configurações de notificação:", error);
      throw error;
    }
  }

  async getNotificationSettings(userId: string): Promise<any> {
    try {
      const docRef = doc(this.userStatsCollection, userId);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        return docSnap.data().notificationSettings || {};
      }

      return {};
    } catch (error) {
      console.error("Erro ao buscar configurações de notificação:", error);
      throw error;
    }
  }
}

// Instância singleton do serviço
export const firestoreService = new FirestoreService();
