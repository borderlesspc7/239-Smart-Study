import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { Layout } from "../components/layout";
import { categories } from "../models/question";
import { paths } from "../routes/paths";

interface SubjectCardProps {
  category: {
    id: string;
    name: string;
  };
  onPress: (categoryId: string, categoryName: string) => void;
}

function SubjectCard({ category, onPress }: SubjectCardProps) {
  const getSubjectIcon = (name: string) => {
    switch (name) {
      case "Matemática":
        return "calculate";
      case "Física":
        return "science";
      case "Química":
        return "biotech";
      case "Biologia":
        return "eco";
      case "História":
        return "history-edu";
      case "Geografia":
        return "public";
      case "Português":
        return "menu-book";
      case "Literatura":
        return "auto-stories";
      case "Filosofia":
        return "psychology";
      case "Sociologia":
        return "groups";
      case "Inglês":
        return "translate";
      default:
        return "quiz";
    }
  };

  const getSubjectColor = (name: string) => {
    switch (name) {
      case "Matemática":
        return "#3B82F6";
      case "Física":
        return "#8B5CF6";
      case "Química":
        return "#10B981";
      case "Biologia":
        return "#059669";
      case "História":
        return "#F59E0B";
      case "Geografia":
        return "#06B6D4";
      case "Português":
        return "#DC2626";
      case "Literatura":
        return "#BE185D";
      case "Filosofia":
        return "#7C3AED";
      case "Sociologia":
        return "#0891B2";
      case "Inglês":
        return "#EA580C";
      default:
        return "#6B7280";
    }
  };

  const color = getSubjectColor(category.name);

  return (
    <TouchableOpacity
      style={[styles.subjectCard, { borderColor: color + "30" }]}
      onPress={() => onPress(category.id, category.name)}
      activeOpacity={0.7}
    >
      <View style={[styles.iconContainer, { backgroundColor: color + "15" }]}>
        <MaterialIcons
          name={
            getSubjectIcon(category.name) as keyof typeof MaterialIcons.glyphMap
          }
          size={32}
          color={color}
        />
      </View>

      <Text style={styles.subjectName}>{category.name}</Text>

      <View style={styles.subjectFooter}>
        <Text style={styles.questionCount}>Ver questões</Text>
        <MaterialIcons name="arrow-forward" size={16} color={color} />
      </View>
    </TouchableOpacity>
  );
}

export function QuestionsHomeScreen() {
  const navigation = useNavigation();

  const handleSubjectPress = (categoryId: string, categoryName: string) => {
    (navigation as any).navigate(paths.questionsBySubject, {
      categoryId,
      categoryName,
    });
  };

  return (
    <Layout>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.titleContainer}>
            <MaterialIcons name="quiz" size={32} color="#4F46E5" />
            <Text style={styles.title}>Questões por Matéria</Text>
          </View>
          <Text style={styles.subtitle}>
            Pratique questões organizadas por disciplina e melhore seu
            desempenho acadêmico
          </Text>
        </View>

        {/* Features */}
        <View style={styles.featuresContainer}>
          <Text style={styles.featuresTitle}>Recursos Disponíveis</Text>
          <View style={styles.featuresGrid}>
            <View style={styles.featureCard}>
              <View style={styles.featureIconContainer}>
                <MaterialIcons name="filter-list" size={24} color="#4F46E5" />
              </View>
              <Text style={styles.featureTitle}>Filtros Avançados</Text>
              <Text style={styles.featureDescription}>
                Filtre por dificuldade e tipo de questão
              </Text>
            </View>

            <View style={styles.featureCard}>
              <View style={styles.featureIconContainer}>
                <MaterialIcons name="search" size={24} color="#10B981" />
              </View>
              <Text style={styles.featureTitle}>Busca Inteligente</Text>
              <Text style={styles.featureDescription}>
                Encontre questões específicas rapidamente
              </Text>
            </View>

            <View style={styles.featureCard}>
              <View style={styles.featureIconContainer}>
                <MaterialIcons name="analytics" size={24} color="#F59E0B" />
              </View>
              <Text style={styles.featureTitle}>Progresso</Text>
              <Text style={styles.featureDescription}>
                Acompanhe seu desempenho em tempo real
              </Text>
            </View>

            <View style={styles.featureCard}>
              <View style={styles.featureIconContainer}>
                <MaterialIcons name="quiz" size={24} color="#DC2626" />
              </View>
              <Text style={styles.featureTitle}>Questões Diversas</Text>
              <Text style={styles.featureDescription}>
                Milhares de questões de todas as matérias
              </Text>
            </View>
          </View>
        </View>

        {/* Subjects Grid */}
        <View style={styles.subjectsSection}>
          <Text style={styles.sectionTitle}>Escolha uma Matéria</Text>
          <View style={styles.subjectsGrid}>
            {categories.map((category) => (
              <SubjectCard
                key={category.id}
                category={category}
                onPress={handleSubjectPress}
              />
            ))}
          </View>
        </View>

        {/* Bottom Spacing */}
        <View style={styles.bottomSpacing} />
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
    padding: 20,
    paddingBottom: 16,
  },
  titleContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
    gap: 12,
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    color: "#111827",
  },
  subtitle: {
    fontSize: 16,
    color: "#6B7280",
    lineHeight: 24,
  },
  featuresContainer: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  featuresTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#111827",
    marginBottom: 16,
    textAlign: "center",
  },
  featuresGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
    justifyContent: "space-between",
  },
  featureCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 16,
    width: "48%",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
    borderWidth: 1,
    borderColor: "#F3F4F6",
  },
  featureIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#F9FAFB",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
  },
  featureTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#111827",
    marginBottom: 4,
    textAlign: "center",
  },
  featureDescription: {
    fontSize: 11,
    color: "#6B7280",
    textAlign: "center",
    lineHeight: 16,
  },
  subjectsSection: {
    paddingHorizontal: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#111827",
    marginBottom: 16,
  },
  subjectsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
    justifyContent: "space-between",
  },
  subjectCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 16,
    width: "48%",
    borderWidth: 1,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
  },
  subjectName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#111827",
    marginBottom: 8,
  },
  subjectFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  questionCount: {
    fontSize: 12,
    color: "#6B7280",
    fontWeight: "500",
  },
  bottomSpacing: {
    height: 20,
  },
});
