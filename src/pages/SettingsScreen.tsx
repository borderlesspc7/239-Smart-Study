"use client";
import { MaterialIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Layout } from "../components/layout";
import { useAuth } from "../hooks/useAuth";
import { paths } from "../routes/paths";

interface SettingItem {
  id: string;
  title: string;
  subtitle?: string;
  icon: keyof typeof MaterialIcons.glyphMap;
  onPress: () => void;
  showArrow?: boolean;
  color?: string;
}

export function SettingsScreen() {
  const navigation = useNavigation();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    Alert.alert("Sair", "Tem certeza que deseja sair da sua conta?", [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Sair",
        style: "destructive",
        onPress: async () => {
          await logout();
          navigation.navigate(paths.login as never);
        },
      },
    ]);
  };

  const settingsSections: { title: string; items: SettingItem[] }[] = [
    {
      title: "Conta",
      items: [
        {
          id: "profile",
          title: "Perfil",
          subtitle: user?.name || user?.email,
          icon: "person",
          onPress: () => console.log("Navigate to profile"),
          showArrow: true,
        },
        {
          id: "exam-type",
          title: "Tipo de Prova",
          subtitle: "Alterar prova que você vai fazer",
          icon: "school",
          onPress: () => navigation.navigate(paths.examSelection as never),
          showArrow: true,
        },
      ],
    },
    {
      title: "Preferências",
      items: [
        {
          id: "notifications",
          title: "Notificações",
          subtitle: "Gerenciar notificações do app",
          icon: "notifications",
          onPress: () => console.log("Navigate to notifications"),
          showArrow: true,
        },
        {
          id: "theme",
          title: "Tema",
          subtitle: "Claro, escuro ou automático",
          icon: "palette",
          onPress: () => console.log("Navigate to theme"),
          showArrow: true,
        },
      ],
    },
    {
      title: "Suporte",
      items: [
        {
          id: "help",
          title: "Central de Ajuda",
          icon: "help",
          onPress: () => navigation.navigate(paths.faq as never),
          showArrow: true,
        },
        {
          id: "about",
          title: "Sobre",
          icon: "info",
          onPress: () => navigation.navigate(paths.about as never),
          showArrow: true,
        },
      ],
    },
    {
      title: "Conta",
      items: [
        {
          id: "logout",
          title: "Sair",
          icon: "logout",
          onPress: handleLogout,
          color: "#DC2626",
        },
      ],
    },
  ];

  return (
    <Layout>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Configurações</Text>
        </View>

        {/* Settings Sections */}
        {settingsSections.map((section, index) => (
          <View key={section.title + index} style={styles.section}>
            <Text style={styles.sectionTitle}>{section.title}</Text>
            <View style={styles.sectionContent}>
              {section.items.map((item, itemIndex) => (
                <TouchableOpacity
                  key={item.id}
                  style={[
                    styles.settingItem,
                    itemIndex === section.items.length - 1 &&
                      styles.settingItemLast,
                  ]}
                  onPress={item.onPress}
                  activeOpacity={0.7}
                >
                  <View style={styles.settingItemLeft}>
                    <View
                      style={[
                        styles.iconContainer,
                        item.color && { backgroundColor: `${item.color}20` },
                      ]}
                    >
                      <MaterialIcons
                        name={item.icon}
                        size={24}
                        color={item.color || "#4F46E5"}
                      />
                    </View>
                    <View style={styles.settingItemText}>
                      <Text
                        style={[
                          styles.settingItemTitle,
                          item.color && { color: item.color },
                        ]}
                      >
                        {item.title}
                      </Text>
                      {item.subtitle && (
                        <Text style={styles.settingItemSubtitle}>
                          {item.subtitle}
                        </Text>
                      )}
                    </View>
                  </View>
                  {item.showArrow && (
                    <MaterialIcons
                      name="chevron-right"
                      size={24}
                      color="#9CA3AF"
                    />
                  )}
                </TouchableOpacity>
              ))}
            </View>
          </View>
        ))}

        {/* App Version */}
        <View style={styles.footer}>
          <Text style={styles.versionText}>Smart Student v1.0.0</Text>
        </View>
      </ScrollView>
    </Layout>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F9FAFB",
  },
  header: {
    paddingHorizontal: 24,
    paddingTop: 24,
    paddingBottom: 16,
  },
  title: {
    fontSize: 32,
    fontWeight: "700",
    color: "#111827",
  },
  section: {
    marginTop: 24,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#6B7280",
    textTransform: "uppercase",
    letterSpacing: 0.5,
    paddingHorizontal: 24,
    marginBottom: 8,
  },
  sectionContent: {
    backgroundColor: "#FFFFFF",
    marginHorizontal: 16,
    borderRadius: 12,
    overflow: "hidden",
  },
  settingItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#F3F4F6",
  },
  settingItemLast: {
    borderBottomWidth: 0,
  },
  settingItemLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#EEF2FF",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  settingItemText: {
    flex: 1,
  },
  settingItemTitle: {
    fontSize: 16,
    fontWeight: "500",
    color: "#111827",
    marginBottom: 2,
  },
  settingItemSubtitle: {
    fontSize: 14,
    color: "#6B7280",
  },
  footer: {
    alignItems: "center",
    paddingVertical: 32,
  },
  versionText: {
    fontSize: 14,
    color: "#9CA3AF",
  },
});
