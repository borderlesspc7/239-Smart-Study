import React from "react";
import { Question } from "../../models/question/question";

interface QuestionCardProps {
  question: Question;
  isSelected?: boolean;
  onSelect?: (question: Question) => void;
  onToggleFavorite?: (questionId: string) => void;
  onSelectForStudy?: (questionId: string) => void;
}

export const QuestionCard: React.FC<QuestionCardProps> = ({
  question,
  isSelected = false,
  onSelect,
  onToggleFavorite,
  onSelectForStudy,
}) => {
  const handleCardClick = () => {
    if (onSelect) {
      onSelect(question);
    }
  };

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onToggleFavorite) {
      onToggleFavorite(question.id);
    }
  };

  const handleStudyClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onSelectForStudy) {
      onSelectForStudy(question.id);
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "Fácil":
        return "bg-green-100 text-green-800";
      case "Médio":
        return "bg-yellow-100 text-yellow-800";
      case "Difícil":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getExamTypeColor = (examType: string) => {
    switch (examType) {
      case "ENEM":
        return "bg-blue-100 text-blue-800";
      case "VESTIBULAR":
        return "bg-purple-100 text-purple-800";
      case "CONCURSO":
        return "bg-orange-100 text-orange-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div
      className={`bg-white rounded-lg shadow-md border-2 transition-all duration-200 hover:shadow-lg cursor-pointer ${
        isSelected
          ? "border-blue-500 bg-blue-50"
          : "border-gray-200 hover:border-gray-300"
      }`}
      onClick={handleCardClick}
    >
      <div className="p-6">
        {/* Header com categoria e ações */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center space-x-2">
            <span className="text-sm font-medium text-gray-600">
              {question.category}
            </span>
            <span
              className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(
                question.difficulty
              )}`}
            >
              {question.difficulty}
            </span>
            {question.examType && (
              <span
                className={`px-2 py-1 rounded-full text-xs font-medium ${getExamTypeColor(
                  question.examType
                )}`}
              >
                {question.examType}
              </span>
            )}
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={handleFavoriteClick}
              className={`p-2 rounded-full transition-colors ${
                question.isFavorite
                  ? "text-red-500 hover:text-red-600"
                  : "text-gray-400 hover:text-red-500"
              }`}
              title={
                question.isFavorite
                  ? "Remover dos favoritos"
                  : "Adicionar aos favoritos"
              }
            >
              <svg
                className="w-5 h-5"
                fill={question.isFavorite ? "currentColor" : "none"}
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                />
              </svg>
            </button>

            <button
              onClick={handleStudyClick}
              className={`p-2 rounded-full transition-colors ${
                isSelected
                  ? "text-blue-500 hover:text-blue-600"
                  : "text-gray-400 hover:text-blue-500"
              }`}
              title={
                isSelected ? "Remover da seleção" : "Selecionar para estudo"
              }
            >
              <svg
                className="w-5 h-5"
                fill={isSelected ? "currentColor" : "none"}
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </button>
          </div>
        </div>

        {/* Conteúdo da questão */}
        <div className="mb-4">
          <h3 className="text-lg font-medium text-gray-900 mb-2 line-clamp-3">
            {question.question.length > 150
              ? `${question.question.substring(0, 150)}...`
              : question.question}
          </h3>

          <div className="text-sm text-gray-600">
            <p className="mb-2">
              <span className="font-medium">Resposta:</span> {question.answer}
            </p>

            <div className="flex flex-wrap gap-1">
              {question.options.map((option, index) => (
                <span
                  key={index}
                  className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs"
                >
                  {String.fromCharCode(65 + index)}) {option}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Tags */}
        {question.tags && question.tags.length > 0 && (
          <div className="mb-4">
            <div className="flex flex-wrap gap-1">
              {question.tags.slice(0, 3).map((tag, index) => (
                <span
                  key={index}
                  className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs"
                >
                  #{tag}
                </span>
              ))}
              {question.tags.length > 3 && (
                <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded-full text-xs">
                  +{question.tags.length - 3} mais
                </span>
              )}
            </div>
          </div>
        )}

        {/* Estatísticas */}
        <div className="flex items-center justify-between text-sm text-gray-500">
          <div className="flex items-center space-x-4">
            {question.studyCount && question.studyCount > 0 && (
              <span className="flex items-center">
                <svg
                  className="w-4 h-4 mr-1"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                  />
                </svg>
                {question.studyCount}
              </span>
            )}

            {question.correctAnswers && question.correctAnswers > 0 && (
              <span className="flex items-center text-green-600">
                <svg
                  className="w-4 h-4 mr-1"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                {question.correctAnswers}
              </span>
            )}
          </div>

          <div className="text-xs">
            {question.lastStudied && (
              <span>
                Último estudo:{" "}
                {new Date(question.lastStudied).toLocaleDateString()}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
