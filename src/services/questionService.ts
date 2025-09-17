import {
  Question,
  QuestionFilter,
  StudyRecommendation,
  StudySession,
} from "../models/question/question";
import { allQuestions, categories } from "../models/question";

export class QuestionService {
  private questions: Question[] = [];
  private userFavorites: Set<string> = new Set();
  private studyHistory: Map<string, any> = new Map();

  constructor() {
    this.initializeQuestions();
    this.loadUserData();
  }

  private initializeQuestions() {
    // Adiciona campos padrão para as questões existentes
    this.questions = allQuestions.map((question) => ({
      ...question,
      tags: this.generateTags(question),
      examType: this.determineExamType(question),
      isFavorite: false,
      studyRecommendations: this.generateStudyRecommendations(question),
      lastStudied: null,
      studyCount: 0,
      correctAnswers: 0,
      wrongAnswers: 0,
      averageTime: 0,
    }));
  }

  private generateTags(question: Question): string[] {
    const tags: string[] = [];

    // Tags baseadas na categoria
    tags.push(question.category.toLowerCase());

    // Tags baseadas na dificuldade
    tags.push(question.difficulty.toLowerCase());

    // Tags específicas baseadas no conteúdo da questão
    const questionText = question.question.toLowerCase();

    if (questionText.includes("fórmula") || questionText.includes("calcular")) {
      tags.push("cálculo");
    }
    if (questionText.includes("definir") || questionText.includes("conceito")) {
      tags.push("conceitos");
    }
    if (
      questionText.includes("analisar") ||
      questionText.includes("interpretar")
    ) {
      tags.push("análise");
    }
    if (questionText.includes("aplicar") || questionText.includes("usar")) {
      tags.push("aplicação");
    }

    return tags;
  }

  private determineExamType(
    question: Question
  ): "ENEM" | "VESTIBULAR" | "CONCURSO" | "GENERAL" {
    // Lógica para determinar o tipo de exame baseado no conteúdo
    const questionText = question.question.toLowerCase();

    if (
      questionText.includes("enem") ||
      questionText.includes("prova do enem")
    ) {
      return "ENEM";
    }
    if (
      questionText.includes("vestibular") ||
      questionText.includes("fuvest")
    ) {
      return "VESTIBULAR";
    }
    if (questionText.includes("concurso") || questionText.includes("público")) {
      return "CONCURSO";
    }

    return "GENERAL";
  }

  private generateStudyRecommendations(question: Question): string[] {
    const recommendations: string[] = [];

    // Recomendações baseadas na categoria
    switch (question.category) {
      case "Matemática":
        recommendations.push("Revisar fórmulas fundamentais");
        recommendations.push("Praticar resolução de problemas");
        break;
      case "Física":
        recommendations.push("Estudar leis e princípios físicos");
        recommendations.push("Praticar cálculos com unidades");
        break;
      case "Química":
        recommendations.push("Revisar tabela periódica");
        recommendations.push("Estudar reações químicas");
        break;
      case "Biologia":
        recommendations.push("Revisar conceitos de biologia celular");
        recommendations.push("Estudar ecologia e evolução");
        break;
      case "História":
        recommendations.push("Revisar cronologia histórica");
        recommendations.push("Estudar contextos sociais e políticos");
        break;
      case "Geografia":
        recommendations.push("Estudar mapas e localizações");
        recommendations.push("Revisar conceitos geográficos");
        break;
      case "Português":
        recommendations.push("Revisar gramática e ortografia");
        recommendations.push("Praticar interpretação de textos");
        break;
      case "Literatura":
        recommendations.push("Revisar movimentos literários");
        recommendations.push("Estudar obras e autores");
        break;
      case "Filosofia":
        recommendations.push("Revisar conceitos filosóficos");
        recommendations.push("Estudar filósofos e suas teorias");
        break;
      case "Sociologia":
        recommendations.push("Revisar teorias sociológicas");
        recommendations.push("Estudar conceitos de sociedade");
        break;
      case "Inglês":
        recommendations.push("Praticar vocabulário");
        recommendations.push("Revisar gramática inglesa");
        break;
    }

    return recommendations;
  }

  private loadUserData() {
    // Carrega dados do usuário do localStorage ou Firebase
    const savedFavorites = localStorage.getItem("userFavorites");
    if (savedFavorites) {
      this.userFavorites = new Set(JSON.parse(savedFavorites));
    }

    const savedHistory = localStorage.getItem("studyHistory");
    if (savedHistory) {
      this.studyHistory = new Map(JSON.parse(savedHistory));
    }
  }

  private saveUserData() {
    // Salva dados do usuário no localStorage ou Firebase
    localStorage.setItem(
      "userFavorites",
      JSON.stringify([...this.userFavorites])
    );
    localStorage.setItem(
      "studyHistory",
      JSON.stringify([...this.studyHistory])
    );
  }

  // Métodos de filtro e busca
  getQuestions(filter: QuestionFilter = {}): Question[] {
    let filteredQuestions = [...this.questions];

    if (filter.category) {
      filteredQuestions = filteredQuestions.filter((q) =>
        q.category.toLowerCase().includes(filter.category!.toLowerCase())
      );
    }

    if (filter.categoryId) {
      filteredQuestions = filteredQuestions.filter(
        (q) => q.categoryId === filter.categoryId
      );
    }

    if (filter.difficulty) {
      filteredQuestions = filteredQuestions.filter(
        (q) => q.difficulty === filter.difficulty
      );
    }

    if (filter.type) {
      filteredQuestions = filteredQuestions.filter(
        (q) => q.type === filter.type
      );
    }

    if (filter.examType) {
      filteredQuestions = filteredQuestions.filter(
        (q) => q.examType === filter.examType
      );
    }

    if (filter.tags && filter.tags.length > 0) {
      filteredQuestions = filteredQuestions.filter((q) =>
        filter.tags!.some((tag) => q.tags?.includes(tag.toLowerCase()))
      );
    }

    if (filter.isFavorite !== undefined) {
      filteredQuestions = filteredQuestions.filter((q) =>
        filter.isFavorite
          ? this.userFavorites.has(q.id)
          : !this.userFavorites.has(q.id)
      );
    }

    if (filter.searchTerm) {
      const searchTerm = filter.searchTerm.toLowerCase();
      filteredQuestions = filteredQuestions.filter(
        (q) =>
          q.question.toLowerCase().includes(searchTerm) ||
          q.answer.toLowerCase().includes(searchTerm) ||
          q.tags?.some((tag) => tag.includes(searchTerm))
      );
    }

    return filteredQuestions;
  }

  // Métodos de favoritos
  toggleFavorite(questionId: string): boolean {
    if (this.userFavorites.has(questionId)) {
      this.userFavorites.delete(questionId);
      this.saveUserData();
      return false;
    } else {
      this.userFavorites.add(questionId);
      this.saveUserData();
      return true;
    }
  }

  getFavoriteQuestions(): Question[] {
    return this.questions.filter((q) => this.userFavorites.has(q.id));
  }

  // Métodos de recomendações de estudo
  getStudyRecommendations(questionIds: string[]): StudyRecommendation[] {
    const recommendations: StudyRecommendation[] = [];
    const categoryCount: Map<string, number> = new Map();
    const difficultyCount: Map<string, number> = new Map();

    // Analisa as questões selecionadas
    questionIds.forEach((id) => {
      const question = this.questions.find((q) => q.id === id);
      if (question) {
        categoryCount.set(
          question.category,
          (categoryCount.get(question.category) || 0) + 1
        );
        difficultyCount.set(
          question.difficulty,
          (difficultyCount.get(question.difficulty) || 0) + 1
        );
      }
    });

    // Gera recomendações baseadas na análise
    categoryCount.forEach((count, category) => {
      if (count > 0) {
        recommendations.push({
          topic: category,
          description: `Revisar conceitos fundamentais de ${category}`,
          resources: this.getResourcesForCategory(category),
          priority: count > 2 ? "high" : count > 1 ? "medium" : "low",
        });
      }
    });

    // Adiciona recomendações baseadas na dificuldade
    const totalQuestions = questionIds.length;
    const difficultQuestions = difficultyCount.get("Difícil") || 0;

    if (difficultQuestions / totalQuestions > 0.5) {
      recommendations.push({
        topic: "Conceitos Avançados",
        description: "Focar em conceitos mais complexos e aplicações práticas",
        resources: [
          "Livros avançados",
          "Vídeo-aulas especializadas",
          "Exercícios desafiadores",
        ],
        priority: "high",
      });
    }

    return recommendations;
  }

  private getResourcesForCategory(category: string): string[] {
    const resources: { [key: string]: string[] } = {
      Matemática: [
        "Livros de matemática",
        "Calculadora científica",
        "Exercícios práticos",
      ],
      Física: [
        "Fórmulas de física",
        "Simuladores físicos",
        "Experimentos virtuais",
      ],
      Química: [
        "Tabela periódica",
        "Simuladores de reações",
        "Laboratório virtual",
      ],
      Biologia: [
        "Atlas de anatomia",
        "Microscópio virtual",
        "Documentários científicos",
      ],
      História: ["Mapas históricos", "Documentários", "Cronologias"],
      Geografia: [
        "Mapas mundiais",
        "Atlas geográfico",
        "Simuladores climáticos",
      ],
      Português: ["Gramática", "Dicionários", "Textos literários"],
      Literatura: [
        "Obras literárias",
        "Análises críticas",
        "Biografias de autores",
      ],
      Filosofia: [
        "Textos filosóficos",
        "História da filosofia",
        "Debates filosóficos",
      ],
      Sociologia: [
        "Teorias sociológicas",
        "Pesquisas sociais",
        "Análises de sociedade",
      ],
      Inglês: [
        "Dicionários bilíngues",
        "Filmes em inglês",
        "Exercícios de conversação",
      ],
    };

    return resources[category] || ["Material de estudo geral"];
  }

  // Métodos de sessão de estudo
  startStudySession(userId: string, questionIds: string[]): StudySession {
    const session: StudySession = {
      id: Date.now().toString(),
      userId,
      questions: questionIds,
      startTime: new Date().toISOString(),
      recommendations: this.getStudyRecommendations(questionIds),
    };

    return session;
  }

  endStudySession(sessionId: string, score: number): void {
    // Atualiza estatísticas das questões
    const session = this.studyHistory.get(sessionId);
    if (session) {
      session.endTime = new Date().toISOString();
      session.score = score;
      this.studyHistory.set(sessionId, session);
      this.saveUserData();
    }
  }

  // Métodos de notificações
  getQuestionsForPeriodicStudy(userId: string, limit: number = 5): Question[] {
    // Retorna questões que o usuário precisa revisar
    const userQuestions = this.questions.filter(
      (q) => this.userFavorites.has(q.id) || (q.studyCount && q.studyCount > 0)
    );

    // Ordena por prioridade (favoritas primeiro, depois por dificuldade)
    return userQuestions
      .sort((a, b) => {
        if (this.userFavorites.has(a.id) && !this.userFavorites.has(b.id))
          return -1;
        if (!this.userFavorites.has(a.id) && this.userFavorites.has(b.id))
          return 1;
        return 0;
      })
      .slice(0, limit);
  }

  // Métodos de estatísticas
  getQuestionStats(questionId: string): any {
    const question = this.questions.find((q) => q.id === questionId);
    if (!question) return null;

    return {
      studyCount: question.studyCount || 0,
      correctAnswers: question.correctAnswers || 0,
      wrongAnswers: question.wrongAnswers || 0,
      accuracy:
        question.correctAnswers && question.studyCount
          ? (question.correctAnswers / question.studyCount) * 100
          : 0,
      averageTime: question.averageTime || 0,
      lastStudied: question.lastStudied,
    };
  }

  // Métodos de busca avançada
  searchQuestions(query: string): Question[] {
    const searchTerm = query.toLowerCase();
    return this.questions.filter(
      (q) =>
        q.question.toLowerCase().includes(searchTerm) ||
        q.answer.toLowerCase().includes(searchTerm) ||
        q.tags?.some((tag) => tag.includes(searchTerm)) ||
        q.category.toLowerCase().includes(searchTerm)
    );
  }

  // Métodos de categorias
  getCategories() {
    return categories;
  }

  getQuestionsByCategory(categoryId: string): Question[] {
    return this.questions.filter((q) => q.categoryId === categoryId);
  }

  // Métodos de tags
  getAllTags(): string[] {
    const allTags = new Set<string>();
    this.questions.forEach((q) => {
      q.tags?.forEach((tag) => allTags.add(tag));
    });
    return Array.from(allTags).sort();
  }

  getQuestionsByTag(tag: string): Question[] {
    return this.questions.filter((q) => q.tags?.includes(tag.toLowerCase()));
  }
}

// Instância singleton do serviço
export const questionService = new QuestionService();
