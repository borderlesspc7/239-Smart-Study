export interface AudioRecording {
  id: string;
  title: string;
  subject: string;
  topic: string;
  duration: number; // em segundos
  fileSize: number; // em bytes
  createdAt: Date;
  updatedAt: Date;
  userId: string;
  audioUrl?: string; // URL do arquivo no Firebase Storage
  isProcessed: boolean;
}

export interface AudioMetadata {
  id: string;
  name: string;
  discipline: string;
  topic: string;
  duration: number;
  date: Date;
  filePath: string;
  userId: string;
}

export interface SubjectAudioStats {
  subjectId: string;
  subjectName: string;
  totalRecordings: number;
  totalDuration: number; // em segundos
  lastRecording?: Date;
  topics: string[];
}

export interface AudioRecordingFormData {
  title: string;
  topic: string;
  subject: string;
}

export interface AudioPlayerState {
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  playbackRate: number;
}
