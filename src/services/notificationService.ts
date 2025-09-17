import { Question } from "../models/question/question";
import { questionService } from "./questionService";

export interface NotificationData {
  title: string;
  body: string;
  data?: any;
  icon?: string;
  badge?: string;
  actions?: NotificationAction[];
}

export interface NotificationAction {
  action: string;
  title: string;
  icon?: string;
}

export class NotificationService {
  private permission: NotificationPermission = "default";
  private isSupported: boolean = false;

  constructor() {
    this.isSupported = "Notification" in window;
    this.initializeService();
  }

  private async initializeService() {
    if (this.isSupported) {
      this.permission = Notification.permission;
    }
  }

  async requestPermission(): Promise<boolean> {
    if (!this.isSupported) {
      console.warn("Notificações não são suportadas neste navegador");
      return false;
    }

    if (this.permission === "granted") {
      return true;
    }

    if (this.permission === "denied") {
      console.warn("Permissão para notificações foi negada");
      return false;
    }

    try {
      const permission = await Notification.requestPermission();
      this.permission = permission;
      return permission === "granted";
    } catch (error) {
      console.error("Erro ao solicitar permissão para notificações:", error);
      return false;
    }
  }

  async sendStudyReminder(questions: Question[]): Promise<void> {
    if (!this.isSupported || this.permission !== "granted") {
      return;
    }

    const notificationData: NotificationData = {
      title: "📚 Hora de Estudar!",
      body: `Você tem ${questions.length} questões para revisar hoje`,
      icon: "/icons/study-icon.png",
      badge: "/icons/badge-icon.png",
      data: {
        type: "study_reminder",
        questionIds: questions.map((q) => q.id),
      },
      actions: [
        {
          action: "start_study",
          title: "Começar Estudo",
          icon: "/icons/play-icon.png",
        },
        {
          action: "snooze",
          title: "Lembrar mais tarde",
          icon: "/icons/snooze-icon.png",
        },
      ],
    };

    try {
      const notification = new Notification(notificationData.title, {
        body: notificationData.body,
        icon: notificationData.icon,
        badge: notificationData.badge,
        data: notificationData.data,
        requireInteraction: true,
        tag: "study_reminder",
      });

      // Adiciona event listeners para as ações
      notification.onclick = () => {
        window.focus();
        // Navega para a tela de estudo
        window.location.href = "/study";
        notification.close();
      };

      // Auto-close após 10 segundos se não interagir
      setTimeout(() => {
        notification.close();
      }, 10000);
    } catch (error) {
      console.error("Erro ao enviar notificação:", error);
    }
  }

  async sendDailyStudyGoal(progress: number, goal: number): Promise<void> {
    if (!this.isSupported || this.permission !== "granted") {
      return;
    }

    const percentage = Math.round((progress / goal) * 100);
    const isGoalReached = progress >= goal;

    const notificationData: NotificationData = {
      title: isGoalReached ? "🎉 Meta Diária Atingida!" : "📊 Progresso do Dia",
      body: isGoalReached
        ? `Parabéns! Você completou ${progress} questões hoje!`
        : `Você completou ${progress} de ${goal} questões (${percentage}%)`,
      icon: isGoalReached
        ? "/icons/celebration-icon.png"
        : "/icons/progress-icon.png",
      data: {
        type: "daily_progress",
        progress,
        goal,
        percentage,
      },
    };

    try {
      const notification = new Notification(notificationData.title, {
        body: notificationData.body,
        icon: notificationData.icon,
        data: notificationData.data,
        tag: "daily_progress",
      });

      notification.onclick = () => {
        window.focus();
        window.location.href = "/dashboard";
        notification.close();
      };
    } catch (error) {
      console.error("Erro ao enviar notificação de progresso:", error);
    }
  }

  async sendAchievementUnlocked(achievement: string): Promise<void> {
    if (!this.isSupported || this.permission !== "granted") {
      return;
    }

    const notificationData: NotificationData = {
      title: "🏆 Conquista Desbloqueada!",
      body: achievement,
      icon: "/icons/achievement-icon.png",
      data: {
        type: "achievement",
        achievement,
      },
    };

    try {
      const notification = new Notification(notificationData.title, {
        body: notificationData.body,
        icon: notificationData.icon,
        data: notificationData.data,
        tag: "achievement",
      });

      notification.onclick = () => {
        window.focus();
        window.location.href = "/achievements";
        notification.close();
      };
    } catch (error) {
      console.error("Erro ao enviar notificação de conquista:", error);
    }
  }

  async sendQuestionRecommendation(question: Question): Promise<void> {
    if (!this.isSupported || this.permission !== "granted") {
      return;
    }

    const notificationData: NotificationData = {
      title: "💡 Questão Recomendada",
      body: `Nova questão de ${question.category} para você praticar`,
      icon: "/icons/question-icon.png",
      data: {
        type: "question_recommendation",
        questionId: question.id,
      },
      actions: [
        {
          action: "view_question",
          title: "Ver Questão",
          icon: "/icons/eye-icon.png",
        },
        {
          action: "dismiss",
          title: "Dispensar",
          icon: "/icons/close-icon.png",
        },
      ],
    };

    try {
      const notification = new Notification(notificationData.title, {
        body: notificationData.body,
        icon: notificationData.icon,
        data: notificationData.data,
        tag: "question_recommendation",
      });

      notification.onclick = () => {
        window.focus();
        window.location.href = `/question/${question.id}`;
        notification.close();
      };
    } catch (error) {
      console.error("Erro ao enviar notificação de recomendação:", error);
    }
  }

  // Método para agendar notificações periódicas
  schedulePeriodicStudy(userId: string, times: string[]): void {
    // Remove notificações anteriores
    this.clearScheduledNotifications();

    times.forEach((time) => {
      const [hours, minutes] = time.split(":").map(Number);
      const now = new Date();
      const scheduledTime = new Date();
      scheduledTime.setHours(hours, minutes, 0, 0);

      // Se o horário já passou hoje, agenda para amanhã
      if (scheduledTime <= now) {
        scheduledTime.setDate(scheduledTime.getDate() + 1);
      }

      const timeUntilNotification = scheduledTime.getTime() - now.getTime();

      setTimeout(async () => {
        const questions = questionService.getQuestionsForPeriodicStudy(
          userId,
          5
        );
        if (questions.length > 0) {
          await this.sendStudyReminder(questions);
        }

        // Agenda a próxima notificação
        this.schedulePeriodicStudy(userId, times);
      }, timeUntilNotification);
    });
  }

  private clearScheduledNotifications(): void {
    // Limpa timeouts de notificações agendadas
    // Implementação específica depende de como você está gerenciando os timeouts
  }

  // Método para configurar notificações baseadas no progresso do usuário
  async setupSmartNotifications(userId: string): Promise<void> {
    const hasPermission = await this.requestPermission();
    if (!hasPermission) return;

    // Configura notificações inteligentes baseadas no comportamento do usuário
    const userStats = this.getUserStudyStats(userId);

    if (userStats.dailyGoal > 0) {
      // Envia notificação de progresso diário
      await this.sendDailyStudyGoal(
        userStats.dailyProgress,
        userStats.dailyGoal
      );
    }

    // Envia recomendações de questões baseadas no histórico
    const recommendedQuestions = questionService.getQuestionsForPeriodicStudy(
      userId,
      3
    );
    if (recommendedQuestions.length > 0) {
      await this.sendQuestionRecommendation(recommendedQuestions[0]);
    }
  }

  private getUserStudyStats(userId: string): any {
    // Implementa lógica para obter estatísticas do usuário
    // Por enquanto, retorna dados mockados
    return {
      dailyProgress: 5,
      dailyGoal: 10,
      weeklyProgress: 35,
      weeklyGoal: 50,
    };
  }

  // Método para testar notificações
  async testNotification(): Promise<void> {
    if (!this.isSupported || this.permission !== "granted") {
      console.warn("Notificações não disponíveis");
      return;
    }

    const notificationData: NotificationData = {
      title: "🔔 Teste de Notificação",
      body: "Esta é uma notificação de teste do Smart Study",
      icon: "/icons/test-icon.png",
      data: {
        type: "test",
      },
    };

    try {
      const notification = new Notification(notificationData.title, {
        body: notificationData.body,
        icon: notificationData.icon,
        data: notificationData.data,
      });

      notification.onclick = () => {
        window.focus();
        notification.close();
      };
    } catch (error) {
      console.error("Erro ao enviar notificação de teste:", error);
    }
  }
}

// Instância singleton do serviço
export const notificationService = new NotificationService();
