import React from "react";
import { View, Text, ActivityIndicator } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useAuth } from "../hooks/useAuth";
import type { ReactNode } from "react";
import { paths } from "./paths";

interface ProtectedRouteProps {
  children: ReactNode;
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { user, loading } = useAuth();
  const navigation = useNavigation<any>();

  React.useEffect(() => {
    if (!loading && !user) {
      navigation.navigate(paths.login);
    }
  }, [user, loading, navigation]);

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text>Loading...</Text>
      </View>
    );
  }

  if (!user) {
    return null; // O redirecionamento será feito pelo useEffect
  }

  return <>{children}</>;
}
