import React, { useState } from "react";
import { QuestionBank } from "../components/questions/QuestionBank";
import { NotificationManager } from "../components/notifications/NotificationManager";
import { Question } from "../models/question/question";

export const QuestionBankPage: React.FC = () => {
  const [selectedQuestion, setSelectedQuestion] = useState<Question | null>(
    null
  );
  const [showNotifications, setShowNotifications] = useState(false);
  const [studyMode, setStudyMode] = useState(false);

  const handleQuestionSelect = (question: Question) => {
    setSelectedQuestion(question);
    setStudyMode(false);
  };

  const handleStartStudy = (questionIds: string[]) => {
    setStudyMode(true);
    setSelectedQuestion(null);
    // Aqui você pode navegar para uma página de estudo ou abrir um modal
    console.log("Iniciando estudo com questões:", questionIds);
  };

  const handleCloseQuestion = () => {
    setSelectedQuestion(null);
  };

  const handleCloseStudy = () => {
    setStudyMode(false);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Banco de Questões
              </h1>
              <p className="text-gray-600">
                Pratique e estude com questões de diferentes matérias
              </p>
            </div>

            <div className="flex items-center space-x-4">
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className="px-4 py-2 text-gray-600 hover:text-gray-900 transition-colors"
                title="Configurações de notificação"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 17h5l-5 5v-5zM4.828 7l2.586 2.586a2 2 0 002.828 0L16 7l-6 6-6-6z"
                  />
                </svg>
              </button>

              <button
                onClick={() => setStudyMode(!studyMode)}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  studyMode
                    ? "bg-blue-500 text-white"
                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                }`}
              >
                {studyMode ? "Sair do Modo Estudo" : "Modo Estudo"}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Conteúdo principal */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Banco de questões */}
          <div className="lg:col-span-3">
            <QuestionBank
              onQuestionSelect={handleQuestionSelect}
              onStartStudy={handleStartStudy}
            />
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="space-y-6">
              {/* Configurações de notificação */}
              {showNotifications && (
                <NotificationManager userId="current-user" />
              )}

              {/* Estatísticas rápidas */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">
                  Suas Estatísticas
                </h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">
                      Questões estudadas hoje
                    </span>
                    <span className="text-sm font-medium text-gray-900">
                      12
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">
                      Taxa de acerto
                    </span>
                    <span className="text-sm font-medium text-green-600">
                      85%
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">
                      Tempo médio por questão
                    </span>
                    <span className="text-sm font-medium text-gray-900">
                      2m 30s
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">
                      Sequência atual
                    </span>
                    <span className="text-sm font-medium text-blue-600">
                      5 dias
                    </span>
                  </div>
                </div>
              </div>

              {/* Dicas de estudo */}
              <div className="bg-blue-50 rounded-lg border border-blue-200 p-6">
                <h3 className="text-lg font-medium text-blue-900 mb-4">
                  💡 Dica do Dia
                </h3>
                <p className="text-sm text-blue-800">
                  Estude em intervalos de 25 minutos com pausas de 5 minutos
                  para melhorar a retenção de conteúdo.
                </p>
              </div>

              {/* Conquistas recentes */}
              <div className="bg-yellow-50 rounded-lg border border-yellow-200 p-6">
                <h3 className="text-lg font-medium text-yellow-900 mb-4">
                  🏆 Conquistas
                </h3>
                <div className="space-y-2">
                  <div className="flex items-center">
                    <span className="text-sm text-yellow-800">
                      ✅ Primeira questão respondida
                    </span>
                  </div>
                  <div className="flex items-center">
                    <span className="text-sm text-yellow-800">
                      ✅ 10 questões em sequência
                    </span>
                  </div>
                  <div className="flex items-center">
                    <span className="text-sm text-yellow-800">
                      ✅ 5 dias de estudo
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal de questão selecionada */}
      {selectedQuestion && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold text-gray-900">
                  {selectedQuestion.category}
                </h3>
                <button
                  onClick={handleCloseQuestion}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <h4 className="text-lg font-medium text-gray-900 mb-2">
                    Questão
                  </h4>
                  <p className="text-gray-700 whitespace-pre-wrap">
                    {selectedQuestion.question}
                  </p>
                </div>

                <div>
                  <h4 className="text-lg font-medium text-gray-900 mb-2">
                    Opções
                  </h4>
                  <div className="space-y-2">
                    {selectedQuestion.options.map((option, index) => (
                      <div
                        key={index}
                        className="flex items-center p-3 bg-gray-50 rounded-lg"
                      >
                        <span className="w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-medium mr-3">
                          {String.fromCharCode(65 + index)}
                        </span>
                        <span className="text-gray-700">{option}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <h4 className="text-lg font-medium text-green-900 mb-2">
                    Resposta Correta
                  </h4>
                  <p className="text-green-800 font-medium">
                    {selectedQuestion.answer}
                  </p>
                </div>

                {selectedQuestion.studyRecommendations &&
                  selectedQuestion.studyRecommendations.length > 0 && (
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                      <h4 className="text-lg font-medium text-blue-900 mb-2">
                        Recomendações de Estudo
                      </h4>
                      <ul className="space-y-1">
                        {selectedQuestion.studyRecommendations.map(
                          (rec, index) => (
                            <li key={index} className="text-blue-800 text-sm">
                              • {rec}
                            </li>
                          )
                        )}
                      </ul>
                    </div>
                  )}
              </div>

              <div className="mt-6 flex justify-end space-x-3">
                <button
                  onClick={handleCloseQuestion}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
                >
                  Fechar
                </button>
                <button
                  onClick={() => {
                    // Adicionar aos favoritos
                    handleCloseQuestion();
                  }}
                  className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors"
                >
                  Adicionar aos Favoritos
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
