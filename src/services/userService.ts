import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import { db } from "../lib/firebaseconfig";
import type { User } from "../types/user";

export const userService = {
  async saveExamType(
    userId: string,
    examType: "ENEM" | "VESTIBULAR" | "CONCURSO" | "GENERAL"
  ): Promise<void> {
    try {
      const userRef = doc(db, "users", userId);
      const userDoc = await getDoc(userRef);

      if (userDoc.exists()) {
        await updateDoc(userRef, {
          preferredExamType: examType,
          updatedAt: new Date(),
        });
      } else {
        await setDoc(userRef, {
          uid: userId,
          preferredExamType: examType,
          createdAt: new Date(),
          updatedAt: new Date(),
        });
      }
    } catch (error) {
      console.error("Error saving exam type:", error);
      throw error;
    }
  },

  async getExamType(
    userId: string
  ): Promise<"ENEM" | "VESTIBULAR" | "CONCURSO" | "GENERAL" | null> {
    try {
      const userRef = doc(db, "users", userId);
      const userDoc = await getDoc(userRef);

      if (userDoc.exists()) {
        const userData = userDoc.data() as User;
        return userData.preferredExamType || null;
      }

      return null;
    } catch (error) {
      console.error("Error getting exam type:", error);
      throw error;
    }
  },

  async getUserData(userId: string): Promise<User | null> {
    try {
      const userRef = doc(db, "users", userId);
      const userDoc = await getDoc(userRef);

      if (userDoc.exists()) {
        return userDoc.data() as User;
      }

      return null;
    } catch (error) {
      console.error("Error getting user data:", error);
      throw error;
    }
  },

  async savePreferredSubjects(
    userId: string,
    subjectIds: string[]
  ): Promise<void> {
    try {
      const userRef = doc(db, "users", userId);
      const userDoc = await getDoc(userRef);

      if (userDoc.exists()) {
        await updateDoc(userRef, {
          preferredSubjects: subjectIds,
          updatedAt: new Date(),
        });
      } else {
        await setDoc(userRef, {
          uid: userId,
          preferredSubjects: subjectIds,
          createdAt: new Date(),
          updatedAt: new Date(),
        });
      }
    } catch (error) {
      console.error("Error saving preferred subjects:", error);
      throw error;
    }
  },

  async getPreferredSubjects(userId: string): Promise<string[] | null> {
    try {
      const userRef = doc(db, "users", userId);
      const userDoc = await getDoc(userRef);

      if (userDoc.exists()) {
        const userData = userDoc.data() as User;
        return userData.preferredSubjects || null;
      }

      return null;
    } catch (error) {
      console.error("Error getting preferred subjects:", error);
      throw error;
    }
  },

  async saveContentTopics(userId: string, topics: string[]): Promise<void> {
    try {
      const userRef = doc(db, "users", userId);
      const userDoc = await getDoc(userRef);

      if (userDoc.exists()) {
        await updateDoc(userRef, {
          contentTopics: topics,
          updatedAt: new Date(),
        });
      } else {
        await setDoc(userRef, {
          uid: userId,
          contentTopics: topics,
          createdAt: new Date(),
          updatedAt: new Date(),
        });
      }
    } catch (error) {
      console.error("Error saving content topics:", error);
      throw error;
    }
  },

  async getContentTopics(userId: string): Promise<string[] | null> {
    try {
      const userRef = doc(db, "users", userId);
      const userDoc = await getDoc(userRef);

      if (userDoc.exists()) {
        const userData = userDoc.data() as User;
        return userData.contentTopics || null;
      }

      return null;
    } catch (error) {
      console.error("Error getting content topics:", error);
      throw error;
    }
  },
};
