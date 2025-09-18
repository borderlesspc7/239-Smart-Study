import React, { useState } from "react";
import { View, StyleSheet, Alert } from "react-native";
import { Header } from "./Header";
import { Sidebar, SidebarItem } from "./Sidebar";
import { useAuth } from "../../hooks/useAuth";
import { useNavigation } from "@react-navigation/native";
import { paths } from "../../routes/paths";

interface LayoutProps {
  children: React.ReactNode;
  title?: string;
  showHeader?: boolean;
  showSidebar?: boolean;
  sidebarItems?: SidebarItem[];
  onSidebarItemPress?: (item: SidebarItem) => void;
}

const defaultSidebarItems: SidebarItem[] = [
  {
    id: "dashboard",
    title: "Dashboard",
    icon: "dashboard",
    route: paths.dashboard,
  },
  {
    id: "study",
    title: "Estudar",
    icon: "school",
    subItems: [
      {
        id: "questions",
        title: "Questões",
        icon: "quiz",
        route: paths.questionsHome,
      },
      {
        id: "audio-recording",
        title: "Gravação de Áudio",
        icon: "mic",
        route: paths.audioRecording,
      },
      {
        id: "practice",
        title: "Prática",
        icon: "fitness-center",
        route: paths.practice,
      },
      {
        id: "simulator",
        title: "Simulado",
        icon: "assignment",
        route: paths.simulator,
      },
    ],
  },
  {
    id: "progress",
    title: "Progresso",
    icon: "trending-up",
    subItems: [
      {
        id: "statistics",
        title: "Estatísticas",
        icon: "bar-chart",
        route: paths.statistics,
      },
      {
        id: "reports",
        title: "Relatórios",
        icon: "assessment",
        route: paths.reports,
      },
      {
        id: "achievements",
        title: "Conquistas",
        icon: "emoji-events",
        route: paths.achievements,
      },
    ],
  },
  {
    id: "content",
    title: "Conteúdo",
    icon: "library-books",
    subItems: [
      {
        id: "subjects",
        title: "Matérias",
        icon: "subject",
        route: paths.subjects,
      },
      {
        id: "favorites",
        title: "Favoritos",
        icon: "favorite",
        route: paths.favorites,
      },
      {
        id: "recent",
        title: "Recentes",
        icon: "history",
        route: paths.recent,
      },
    ],
  },
  {
    id: "settings",
    title: "Configurações",
    icon: "settings",
    route: paths.settings,
  },
  {
    id: "help",
    title: "Ajuda",
    icon: "help",
    subItems: [
      {
        id: "faq",
        title: "FAQ",
        icon: "help-outline",
        route: paths.faq,
      },
      {
        id: "support",
        title: "Suporte",
        icon: "support",
        route: paths.support,
      },
      {
        id: "about",
        title: "Sobre",
        icon: "info",
        route: paths.about,
      },
    ],
  },
];

export function Layout({
  children,
  title,
  showHeader = true,
  showSidebar = true,
  sidebarItems = defaultSidebarItems,
  onSidebarItemPress,
}: LayoutProps) {
  const [isSidebarVisible, setIsSidebarVisible] = useState(false);
  const { logout } = useAuth();
  const navigation = useNavigation();
  const handleMenuPress = () => {
    setIsSidebarVisible(true);
  };

  const handleSidebarClose = () => {
    setIsSidebarVisible(false);
  };

  const handleProfilePress = () => {
    Alert.alert("Perfil", "Deseja sair da sua conta?", [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Sair",
        style: "destructive",
        onPress: async () => {
          try {
            await logout();
          } catch (error) {
            Alert.alert("Erro", "Não foi possível sair da conta");
          }
        },
      },
    ]);
  };

  const handleSidebarItemPress = (item: SidebarItem) => {
    if (onSidebarItemPress) {
      onSidebarItemPress(item);
    } else if (item.route) {
      (navigation as any).navigate(item.route);
    }
  };

  return (
    <View style={styles.container}>
      {showHeader && (
        <Header
          title={title}
          onMenuPress={handleMenuPress}
          onProfilePress={handleProfilePress}
          showMenuButton={showSidebar}
        />
      )}

      <View style={styles.content}>{children}</View>

      {showSidebar && (
        <Sidebar
          items={sidebarItems}
          isVisible={isSidebarVisible}
          onClose={handleSidebarClose}
          onItemPress={handleSidebarItemPress}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F9FAFB",
  },
  content: {
    flex: 1,
  },
});
