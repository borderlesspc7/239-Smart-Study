import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  orderBy,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import {
  deleteObject,
  getDownloadURL,
  ref,
  uploadBytes,
} from "firebase/storage";
import { db, storage } from "../lib/firebaseconfig";
import { categories } from "../models/question/categories";
import { AudioRecording, SubjectAudioStats } from "../types/audio";

export class AudioService {
  // 🔹 Obter todas as gravações de um usuário
  static async getAllRecordings(userId: string): Promise<AudioRecording[]> {
    const q = query(
      collection(db, "recordings"),
      where("userId", "==", userId),
      orderBy("createdAt", "desc")
    );

    const snapshot = await getDocs(q);
    return snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt.toDate(),
      updatedAt: doc.data().updatedAt.toDate(),
    })) as AudioRecording[];
  }

  // 🔹 Obter gravações filtrando por matéria
  static async getRecordingsBySubject(
    userId: string,
    subject: string
  ): Promise<AudioRecording[]> {
    const q = query(
      collection(db, "recordings"),
      where("userId", "==", userId),
      where("subject", "==", subject),
      orderBy("createdAt", "desc")
    );

    const snapshot = await getDocs(q);
    return snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt.toDate(),
      updatedAt: doc.data().updatedAt.toDate(),
    })) as AudioRecording[];
  }

  static async getSubjectStats(userId: string): Promise<SubjectAudioStats[]> {
    const recordings = await this.getAllRecordings(userId);
    const statsMap = new Map<string, SubjectAudioStats>();

    categories.forEach((category) => {
      statsMap.set(category.name, {
        subjectId: category.id,
        subjectName: category.name,
        totalRecordings: 0,
        totalDuration: 0,
        topics: [],
      });
    });

    recordings.forEach((r) => {
      const subjectStat = statsMap.get(r.subject);
      if (subjectStat) {
        subjectStat.totalRecordings++;
        subjectStat.totalDuration += r.duration;
        if (!subjectStat.topics.includes(r.topic)) {
          subjectStat.topics.push(r.topic);
        }
        if (
          !subjectStat.lastRecording ||
          r.createdAt > subjectStat.lastRecording
        ) {
          subjectStat.lastRecording = r.createdAt;
        }
      }
    });

    return Array.from(statsMap.values());
  }

  // 🔹 Upload de gravação para o Storage e criação no Firestore
  static async saveRecording(data: {
    userId: string;
    subject: string;
    title: string;
    topic: string;
    duration: number;
    uri: string;
  }): Promise<AudioRecording> {
    const fileRef = ref(
      storage,
      `recordings/${data.userId}/${Date.now()}_${data.title}.m4a`
    );

    const response = await fetch(data.uri);
    const blob = await response.blob();
    const uploadResult = await uploadBytes(fileRef, blob);

    const downloadURL = await getDownloadURL(uploadResult.ref);
    const createdAt = new Date();

    const docRef = await addDoc(collection(db, "recordings"), {
      userId: data.userId,
      title: data.title,
      subject: data.subject,
      topic: data.topic,
      duration: data.duration,
      uri: downloadURL,
      fileSize: blob.size,
      createdAt,
      updatedAt: createdAt,
      isProcessed: true,
    });

    return {
      id: docRef.id,
      ...data,
      uri: downloadURL,
      fileSize: blob.size,
      createdAt,
      updatedAt: createdAt,
      isProcessed: true,
    };
  }

  // 🔹 Atualizar metadados (título, tópico, etc.)
  static async saveRecordingMetadata(
    recordingId: string,
    metadata: Partial<AudioRecording>
  ): Promise<void> {
    const docRef = doc(db, "recordings", recordingId);
    await updateDoc(docRef, {
      ...metadata,
      updatedAt: new Date(),
    });
  }

  // 🔹 Excluir gravação (Firestore + Storage)
  static async deleteRecording(recordingId: string): Promise<void> {
    const docRef = doc(db, "recordings", recordingId);
    const snapshot = await getDocs(query(collection(db, "recordings")));
    const data = snapshot.docs.find((d) => d.id === recordingId)?.data();
    if (data?.uri) {
      const fileRef = ref(storage, data.uri);
      await deleteObject(fileRef).catch(() => null);
    }
    await deleteDoc(docRef);
  }

  // 🔹 Utilitários de formatação
  static formatDuration(seconds: number): string {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;
    if (hours > 0)
      return `${hours}:${minutes.toString().padStart(2, "0")}:${remainingSeconds
        .toString()
        .padStart(2, "0")}`;
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
  }

  static formatFileSize(bytes: number): string {
    const sizes = ["Bytes", "KB", "MB", "GB"];
    if (bytes === 0) return "0 Bytes";
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return Math.round((bytes / Math.pow(1024, i)) * 100) / 100 + " " + sizes[i];
  }
}
