import { AudioRecording, SubjectAudioStats } from "../types/audio";
import { categories } from "../models/question/categories";

// Dados mockados para demonstração
const mockAudioRecordings: AudioRecording[] = [
  {
    id: "1",
    title: "Derivadas - Regras Básicas",
    subject: "Matemática",
    topic: "Cálculo Diferencial",
    duration: 420, // 7 minutos
    fileSize: 3200000, // ~3MB
    createdAt: new Date("2024-01-15T10:30:00"),
    updatedAt: new Date("2024-01-15T10:30:00"),
    userId: "user1",
    isProcessed: true,
  },
  {
    id: "2",
    title: "Leis de Newton",
    subject: "Física",
    topic: "Mecânica",
    duration: 380, // 6 minutos e 20 segundos
    fileSize: 2900000,
    createdAt: new Date("2024-01-14T14:15:00"),
    updatedAt: new Date("2024-01-14T14:15:00"),
    userId: "user1",
    isProcessed: true,
  },
  {
    id: "3",
    title: "Equações Químicas",
    subject: "Química",
    topic: "Reações Químicas",
    duration: 320, // 5 minutos e 20 segundos
    fileSize: 2400000,
    createdAt: new Date("2024-01-13T16:45:00"),
    updatedAt: new Date("2024-01-13T16:45:00"),
    userId: "user1",
    isProcessed: true,
  },
  {
    id: "4",
    title: "Mitose e Meiose",
    subject: "Biologia",
    topic: "Divisão Celular",
    duration: 480, // 8 minutos
    fileSize: 3600000,
    createdAt: new Date("2024-01-12T09:20:00"),
    updatedAt: new Date("2024-01-12T09:20:00"),
    userId: "user1",
    isProcessed: true,
  },
  {
    id: "5",
    title: "Segunda Guerra Mundial",
    subject: "História",
    topic: "Guerras Mundiais",
    duration: 600, // 10 minutos
    fileSize: 4500000,
    createdAt: new Date("2024-01-11T13:30:00"),
    updatedAt: new Date("2024-01-11T13:30:00"),
    userId: "user1",
    isProcessed: true,
  },
];

export class AudioService {
  // Obter todas as gravações de áudio
  static async getAllRecordings(userId: string): Promise<AudioRecording[]> {
    // Simular delay de API
    await new Promise((resolve) => setTimeout(resolve, 500));
    return mockAudioRecordings.filter(
      (recording) => recording.userId === userId
    );
  }

  // Obter gravações por matéria
  static async getRecordingsBySubject(
    userId: string,
    subject: string
  ): Promise<AudioRecording[]> {
    await new Promise((resolve) => setTimeout(resolve, 300));
    return mockAudioRecordings.filter(
      (recording) =>
        recording.userId === userId && recording.subject === subject
    );
  }

  // Obter estatísticas por matéria
  static async getSubjectStats(userId: string): Promise<SubjectAudioStats[]> {
    await new Promise((resolve) => setTimeout(resolve, 400));

    const userRecordings = mockAudioRecordings.filter(
      (recording) => recording.userId === userId
    );

    const statsMap = new Map<string, SubjectAudioStats>();

    // Inicializar todas as matérias
    categories.forEach((category) => {
      statsMap.set(category.name, {
        subjectId: category.id,
        subjectName: category.name,
        totalRecordings: 0,
        totalDuration: 0,
        topics: [],
      });
    });

    // Calcular estatísticas das gravações existentes
    userRecordings.forEach((recording) => {
      const existing = statsMap.get(recording.subject);
      if (existing) {
        existing.totalRecordings++;
        existing.totalDuration += recording.duration;

        if (!existing.topics.includes(recording.topic)) {
          existing.topics.push(recording.topic);
        }

        if (
          !existing.lastRecording ||
          recording.createdAt > existing.lastRecording
        ) {
          existing.lastRecording = recording.createdAt;
        }
      }
    });

    return Array.from(statsMap.values());
  }

  // Simular gravação de áudio (mock)
  static async startRecording(): Promise<string> {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    return "recording_session_123";
  }

  static async stopRecording(sessionId: string): Promise<AudioRecording> {
    await new Promise((resolve) => setTimeout(resolve, 2000));

    // Simular criação de nova gravação
    const newRecording: AudioRecording = {
      id: Date.now().toString(),
      title: "Gravação sem título",
      subject: "",
      topic: "",
      duration: Math.floor(Math.random() * 600) + 60, // 1-10 minutos
      fileSize: Math.floor(Math.random() * 5000000) + 1000000,
      createdAt: new Date(),
      updatedAt: new Date(),
      userId: "user1",
      isProcessed: true,
    };

    mockAudioRecordings.unshift(newRecording);
    return newRecording;
  }

  // Simular salvamento de metadados
  static async saveRecordingMetadata(
    recordingId: string,
    metadata: Partial<AudioRecording>
  ): Promise<void> {
    await new Promise((resolve) => setTimeout(resolve, 500));

    const index = mockAudioRecordings.findIndex((r) => r.id === recordingId);
    if (index !== -1) {
      mockAudioRecordings[index] = {
        ...mockAudioRecordings[index],
        ...metadata,
        updatedAt: new Date(),
      };
    }
  }

  // Simular exclusão de gravação
  static async deleteRecording(recordingId: string): Promise<void> {
    await new Promise((resolve) => setTimeout(resolve, 300));

    const index = mockAudioRecordings.findIndex((r) => r.id === recordingId);
    if (index !== -1) {
      mockAudioRecordings.splice(index, 1);
    }
  }

  // Formatar duração em formato legível
  static formatDuration(seconds: number): string {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;

    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, "0")}:${remainingSeconds
        .toString()
        .padStart(2, "0")}`;
    }
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
  }

  // Formatar tamanho do arquivo
  static formatFileSize(bytes: number): string {
    const sizes = ["Bytes", "KB", "MB", "GB"];
    if (bytes === 0) return "0 Bytes";
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return Math.round((bytes / Math.pow(1024, i)) * 100) / 100 + " " + sizes[i];
  }
}
