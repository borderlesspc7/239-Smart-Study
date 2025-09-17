import React, { useState, useEffect } from "react";
import { Question, QuestionFilter } from "../../models/question/question";
import { useQuestions } from "../../hooks/useQuestions";
import { QuestionCard } from "./QuestionCard";
import { QuestionFilters } from "./QuestionFilters";
import { SearchBar } from "./SearchBar";
import { StudyRecommendations } from "./StudyRecommendations";

interface QuestionBankProps {
  onQuestionSelect?: (question: Question) => void;
  onStartStudy?: (questionIds: string[]) => void;
}

export const QuestionBank: React.FC<QuestionBankProps> = ({
  onQuestionSelect,
  onStartStudy,
}) => {
  const {
    questions,
    loading,
    error,
    filters,
    setFilters,
    searchQuestions,
    toggleFavorite,
    getStudyRecommendations,
    getAllTags,
    getCategories,
  } = useQuestions();

  const [selectedQuestions, setSelectedQuestions] = useState<string[]>([]);
  const [showRecommendations, setShowRecommendations] = useState(false);
  const [recommendations, setRecommendations] = useState<any[]>([]);

  const handleQuestionSelect = (question: Question) => {
    if (onQuestionSelect) {
      onQuestionSelect(question);
    }
  };

  const handleQuestionToggle = (questionId: string) => {
    const isFavorite = toggleFavorite(questionId);
    // Aqui você pode adicionar feedback visual ou som
    console.log(
      `Questão ${questionId} ${
        isFavorite ? "adicionada aos" : "removida dos"
      } favoritos`
    );
  };

  const handleQuestionSelectForStudy = (questionId: string) => {
    setSelectedQuestions((prev) => {
      if (prev.includes(questionId)) {
        return prev.filter((id) => id !== questionId);
      } else {
        return [...prev, questionId];
      }
    });
  };

  const handleStartStudy = () => {
    if (selectedQuestions.length > 0) {
      setShowRecommendations(true);
      const recs = getStudyRecommendations(selectedQuestions);
      setRecommendations(recs);

      if (onStartStudy) {
        onStartStudy(selectedQuestions);
      }
    }
  };

  const handleFilterChange = (newFilters: QuestionFilter) => {
    setFilters(newFilters);
  };

  const handleSearch = (query: string) => {
    searchQuestions(query);
  };

  const handleClearSelection = () => {
    setSelectedQuestions([]);
    setShowRecommendations(false);
    setRecommendations([]);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
        <p className="font-bold">Erro ao carregar questões</p>
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Banco de Questões
        </h1>
        <p className="text-gray-600">
          Encontre e pratique questões de diferentes matérias e níveis
        </p>
      </div>

      {/* Barra de pesquisa */}
      <div className="mb-6">
        <SearchBar onSearch={handleSearch} />
      </div>

      {/* Filtros */}
      <div className="mb-6">
        <QuestionFilters
          filters={filters}
          onFilterChange={handleFilterChange}
          categories={getCategories()}
          tags={getAllTags()}
        />
      </div>

      {/* Controles de seleção */}
      {selectedQuestions.length > 0 && (
        <div className="mb-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <span className="text-blue-700 font-medium">
                {selectedQuestions.length} questão(ões) selecionada(s)
              </span>
              <button
                onClick={handleStartStudy}
                className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors"
              >
                Começar Estudo
              </button>
              <button
                onClick={handleClearSelection}
                className="text-blue-600 hover:text-blue-800 underline"
              >
                Limpar Seleção
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Recomendações de estudo */}
      {showRecommendations && recommendations.length > 0 && (
        <div className="mb-6">
          <StudyRecommendations recommendations={recommendations} />
        </div>
      )}

      {/* Lista de questões */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {questions.map((question) => (
          <QuestionCard
            key={question.id}
            question={question}
            isSelected={selectedQuestions.includes(question.id)}
            onSelect={handleQuestionSelect}
            onToggleFavorite={handleQuestionToggle}
            onSelectForStudy={handleQuestionSelectForStudy}
          />
        ))}
      </div>

      {questions.length === 0 && (
        <div className="text-center py-12">
          <div className="text-gray-400 text-6xl mb-4">📚</div>
          <h3 className="text-xl font-medium text-gray-900 mb-2">
            Nenhuma questão encontrada
          </h3>
          <p className="text-gray-600">
            Tente ajustar os filtros ou fazer uma nova pesquisa
          </p>
        </div>
      )}
    </div>
  );
};
