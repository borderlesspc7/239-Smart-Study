import React, { useState, useEffect } from "react";
import { useNotifications } from "../../hooks/useQuestions";
import { Question } from "../../models/question/question";
import { questionService } from "../../services/questionService";

interface NotificationManagerProps {
  userId: string;
}

export const NotificationManager: React.FC<NotificationManagerProps> = ({
  userId,
}) => {
  const {
    permission,
    isSupported,
    requestPermission,
    sendStudyReminder,
    sendDailyProgress,
    sendAchievement,
    testNotification,
  } = useNotifications();

  const [isEnabled, setIsEnabled] = useState(false);
  const [studyTimes, setStudyTimes] = useState<string[]>([
    "09:00",
    "15:00",
    "20:00",
  ]);
  const [dailyGoal, setDailyGoal] = useState(10);
  const [dailyProgress, setDailyProgress] = useState(0);

  useEffect(() => {
    if (permission === "granted") {
      setIsEnabled(true);
      setupPeriodicNotifications();
    }
  }, [permission]);

  const setupPeriodicNotifications = () => {
    if (isEnabled) {
      // Configura notificações periódicas
      const questions = questionService.getQuestionsForPeriodicStudy(userId, 5);
      if (questions.length > 0) {
        sendStudyReminder(questions);
      }
    }
  };

  const handleToggleNotifications = async () => {
    if (!isEnabled) {
      const granted = await requestPermission();
      if (granted) {
        setIsEnabled(true);
        setupPeriodicNotifications();
      }
    } else {
      setIsEnabled(false);
    }
  };

  const handleTestNotification = async () => {
    await testNotification();
  };

  const handleSendStudyReminder = async () => {
    const questions = questionService.getQuestionsForPeriodicStudy(userId, 5);
    if (questions.length > 0) {
      await sendStudyReminder(questions);
    }
  };

  const handleSendProgressUpdate = async () => {
    await sendDailyProgress(dailyProgress, dailyGoal);
  };

  const handleSendAchievement = async () => {
    await sendAchievement("Primeira questão respondida!");
  };

  const handleTimeChange = (index: number, time: string) => {
    const newTimes = [...studyTimes];
    newTimes[index] = time;
    setStudyTimes(newTimes);
  };

  const addStudyTime = () => {
    if (studyTimes.length < 5) {
      setStudyTimes([...studyTimes, "12:00"]);
    }
  };

  const removeStudyTime = (index: number) => {
    if (studyTimes.length > 1) {
      const newTimes = studyTimes.filter((_, i) => i !== index);
      setStudyTimes(newTimes);
    }
  };

  if (!isSupported) {
    return (
      <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded">
        <p className="font-bold">Notificações não suportadas</p>
        <p>Seu navegador não suporta notificações push.</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-medium text-gray-900">
          Configurações de Notificações
        </h3>
        <div className="flex items-center space-x-4">
          <span
            className={`text-sm font-medium ${
              permission === "granted"
                ? "text-green-600"
                : permission === "denied"
                ? "text-red-600"
                : "text-yellow-600"
            }`}
          >
            {permission === "granted"
              ? "Permitido"
              : permission === "denied"
              ? "Negado"
              : "Pendente"}
          </span>
          <button
            onClick={handleToggleNotifications}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              isEnabled
                ? "bg-red-500 hover:bg-red-600 text-white"
                : "bg-blue-500 hover:bg-blue-600 text-white"
            }`}
          >
            {isEnabled ? "Desativar" : "Ativar"} Notificações
          </button>
        </div>
      </div>

      {isEnabled && (
        <div className="space-y-6">
          {/* Configurações de horários de estudo */}
          <div>
            <h4 className="text-md font-medium text-gray-900 mb-3">
              Horários de Estudo
            </h4>
            <div className="space-y-2">
              {studyTimes.map((time, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <input
                    type="time"
                    value={time}
                    onChange={(e) => handleTimeChange(index, e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  {studyTimes.length > 1 && (
                    <button
                      onClick={() => removeStudyTime(index)}
                      className="text-red-500 hover:text-red-700"
                      title="Remover horário"
                    >
                      <svg
                        className="w-5 h-5"
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
                  )}
                </div>
              ))}
              {studyTimes.length < 5 && (
                <button
                  onClick={addStudyTime}
                  className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                >
                  + Adicionar horário
                </button>
              )}
            </div>
          </div>

          {/* Configurações de meta diária */}
          <div>
            <h4 className="text-md font-medium text-gray-900 mb-3">
              Meta Diária
            </h4>
            <div className="flex items-center space-x-4">
              <div>
                <label className="block text-sm text-gray-700 mb-1">
                  Questões por dia
                </label>
                <input
                  type="number"
                  value={dailyGoal}
                  onChange={(e) => setDailyGoal(Number(e.target.value))}
                  min="1"
                  max="100"
                  className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 w-20"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-700 mb-1">
                  Progresso atual
                </label>
                <input
                  type="number"
                  value={dailyProgress}
                  onChange={(e) => setDailyProgress(Number(e.target.value))}
                  min="0"
                  max={dailyGoal}
                  className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 w-20"
                />
              </div>
            </div>
          </div>

          {/* Testes de notificação */}
          <div>
            <h4 className="text-md font-medium text-gray-900 mb-3">
              Testar Notificações
            </h4>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={handleTestNotification}
                className="px-4 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded-lg text-sm font-medium transition-colors"
              >
                Teste Básico
              </button>
              <button
                onClick={handleSendStudyReminder}
                className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg text-sm font-medium transition-colors"
              >
                Lembrete de Estudo
              </button>
              <button
                onClick={handleSendProgressUpdate}
                className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg text-sm font-medium transition-colors"
              >
                Progresso Diário
              </button>
              <button
                onClick={handleSendAchievement}
                className="px-4 py-2 bg-yellow-500 hover:bg-yellow-600 text-white rounded-lg text-sm font-medium transition-colors"
              >
                Conquista
              </button>
            </div>
          </div>

          {/* Status das notificações */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h5 className="text-sm font-medium text-gray-900 mb-2">
              Status das Notificações
            </h5>
            <div className="space-y-2 text-sm text-gray-600">
              <div className="flex items-center">
                <div
                  className={`w-2 h-2 rounded-full mr-2 ${
                    isEnabled ? "bg-green-500" : "bg-red-500"
                  }`}
                ></div>
                Notificações: {isEnabled ? "Ativas" : "Inativas"}
              </div>
              <div className="flex items-center">
                <div className="w-2 h-2 rounded-full mr-2 bg-blue-500"></div>
                Horários configurados: {studyTimes.length}
              </div>
              <div className="flex items-center">
                <div className="w-2 h-2 rounded-full mr-2 bg-purple-500"></div>
                Meta diária: {dailyGoal} questões
              </div>
            </div>
          </div>
        </div>
      )}

      {!isEnabled && (
        <div className="text-center py-8">
          <div className="text-gray-400 text-6xl mb-4">🔔</div>
          <h4 className="text-lg font-medium text-gray-900 mb-2">
            Ative as notificações
          </h4>
          <p className="text-gray-600 mb-4">
            Receba lembretes de estudo e acompanhe seu progresso diário
          </p>
          <button
            onClick={handleToggleNotifications}
            className="px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-medium transition-colors"
          >
            Ativar Notificações
          </button>
        </div>
      )}
    </div>
  );
};
