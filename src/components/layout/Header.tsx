import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { useAuth } from "../../hooks/useAuth";

interface HeaderProps {
  title?: string;
  showProfile?: boolean;
  onProfilePress?: () => void;
  onMenuPress?: () => void;
  showMenuButton?: boolean;
}

export function Header({
  title,
  showProfile = true,
  onProfilePress,
  onMenuPress,
  showMenuButton = true,
}: HeaderProps) {
  const { user } = useAuth();

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Bom dia";
    if (hour < 18) return "Boa tarde";
    return "Boa noite";
  };

  return (
    <>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      <View style={styles.container}>
        <View style={styles.content}>
          {showMenuButton && (
            <TouchableOpacity style={styles.menuButton} onPress={onMenuPress}>
              <MaterialIcons name="menu" size={24} color="#374151" />
            </TouchableOpacity>
          )}

          <View style={styles.titleContainer}>
            {title ? (
              <Text style={styles.title}>{title}</Text>
            ) : (
              <View>
                <Text style={styles.greeting}>
                  {getGreeting()}, {user?.name || "Usuário"}!
                </Text>
                <Text style={styles.subGreeting}>
                  Pronto para estudar hoje?
                </Text>
              </View>
            )}
          </View>

          {showProfile && (
            <TouchableOpacity
              style={styles.profileButton}
              onPress={onProfilePress}
            >
              <MaterialIcons name="account-circle" size={32} color="#4F46E5" />
            </TouchableOpacity>
          )}
        </View>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#FFFFFF",
    paddingTop: StatusBar.currentHeight || 44,
    paddingHorizontal: 20,
    paddingBottom: 16,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
    zIndex: 1000,
  },
  content: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  menuButton: {
    padding: 8,
    marginRight: 12,
  },
  titleContainer: {
    flex: 1,
  },
  title: {
    fontSize: 20,
    fontWeight: "600",
    color: "#111827",
  },
  greeting: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#111827",
    marginBottom: 2,
  },
  subGreeting: {
    fontSize: 14,
    color: "#6B7280",
  },
  profileButton: {
    padding: 4,
  },
});
