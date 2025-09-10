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
}
