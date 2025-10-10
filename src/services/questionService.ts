import type { Question, QuestionFilter } from "../models/question";
import { allQuestions } from "../models/question/index";

export const questionService = {
  getFilteredQuestions(filter: QuestionFilter): Question[] {
    let filtered = [...allQuestions];

    if (filter.examType) {
      filtered = filtered.filter(
        (q) => q.examType === filter.examType || !q.examType
      );
    }

    if (filter.category) {
      filtered = filtered.filter((q) => q.category === filter.category);
    }

    if (filter.categoryId) {
      filtered = filtered.filter((q) => q.categoryId === filter.categoryId);
    }

    if (filter.difficulty) {
      filtered = filtered.filter((q) => q.difficulty === filter.difficulty);
    }

    if (filter.type) {
      filtered = filtered.filter((q) => q.type === filter.type);
    }

    if (filter.tags && filter.tags.length > 0) {
      filtered = filtered.filter((q) =>
        q.tags?.some((tag) => filter.tags?.includes(tag))
      );
    }

    if (filter.isFavorite !== undefined) {
      filtered = filtered.filter((q) => q.isFavorite === filter.isFavorite);
    }

    if (filter.searchTerm) {
      const searchLower = filter.searchTerm.toLowerCase();
      filtered = filtered.filter(
        (q) =>
          q.question.toLowerCase().includes(searchLower) ||
          q.category.toLowerCase().includes(searchLower)
      );
    }

    return filtered;
  },

  getRandomQuestions(filter: QuestionFilter, count = 10): Question[] {
    const filtered = this.getFilteredQuestions(filter);

    const shuffled = [...filtered].sort(() => Math.random() - 0.5);

    return shuffled.slice(0, Math.min(count, shuffled.length));
  },

  getQuestionById(id: string): Question | undefined {
    return allQuestions.find((q) => q.id === id);
  },
};
