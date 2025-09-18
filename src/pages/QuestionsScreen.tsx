import React, { useState, useEffect, useMemo } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TextInput,
  TouchableOpacity,
  Alert,
  RefreshControl,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { useNavigation, useRoute } from "@react-navigation/native";
import { Layout } from "../components/layout";
import { QuestionFilters } from "../components/questions/QuestionFilters";
import { QuestionCard } from "../components/questions/QuestionCard";
import { Question, QuestionFilter, allQuestions } from "../models/question";

interface RouteParams {
  categoryId?: string;
  categoryName?: string;
}

export function QuestionsScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  const params = route.params as RouteParams;
  const [searchText, setSearchText] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [filters, setFilters] = useState<QuestionFilter>({});

  // Simular carregamento inicial
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Se há parâmetros da rota, configurar filtros iniciais
    if (params?.categoryId && params?.categoryName) {
      setFilters({
        categoryId: params.categoryId,
        category: params.categoryName,
      });
    }

    // Simular carregamento de questões
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, [params]);

  // Filtrar questões baseado nos filtros e busca
  const filteredQuestions = useMemo(() => {
    let filtered = [...allQuestions];

    // Filtro por categoria
    if (filters.categoryId) {
      filtered = filtered.filter((q) => q.categoryId === filters.categoryId);
    }

    // Filtro por dificuldade
    if (filters.difficulty) {
      filtered = filtered.filter((q) => q.difficulty === filters.difficulty);
    }

    // Filtro por busca
    if (searchText.trim()) {
      const search = searchText.toLowerCase().trim();
      filtered = filtered.filter(
        (q) =>
          q.question.toLowerCase().includes(search) ||
          q.category.toLowerCase().includes(search) ||
          q.answer.toLowerCase().includes(search)
      );
    }

    return filtered;
  }, [filters, searchText]);

  const handleQuestionPress = (question: Question) => {
    // TODO: Navegar para tela de detalhes da questão ou quiz
    Alert.alert(
      "Questão Selecionada",
      `Categoria: ${question.category}\nDificuldade: ${question.difficulty}`,
      [
        { text: "Voltar", style: "cancel" },
        {
          text: "Responder",
          onPress: () => console.log("Iniciando questão..."),
        },
      ]
    );
  };

  const handleFiltersChange = (newFilters: QuestionFilter) => {
    setFilters(newFilters);
  };

  const handleClearFilters = () => {
    setFilters({});
    setSearchText("");
  };

  const onRefresh = async () => {
    setRefreshing(true);
    // Simular atualização de dados
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setRefreshing(false);
  };

  const renderQuestion = ({ item }: { item: Question }) => (
    <QuestionCard question={item} onPress={handleQuestionPress} />
  );

  const renderHeader = () => (
    <View>
      {/* Cabeçalho da matéria específica */}
      {params?.categoryName && (
        <View style={styles.categoryHeader}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <MaterialIcons name="arrow-back" size={24} color="#4F46E5" />
          </TouchableOpacity>
          <View style={styles.categoryInfo}>
            <Text style={styles.categoryTitle}>{params.categoryName}</Text>
            <Text style={styles.categorySubtitle}>
              {filteredQuestions.length} questões disponíveis
            </Text>
          </View>
        </View>
      )}

      {/* Barra de pesquisa */}
      <View style={styles.searchContainer}>
        <MaterialIcons name="search" size={24} color="#9CA3AF" />
        <TextInput
          style={styles.searchInput}
          placeholder={`Buscar questões${
            params?.categoryName ? ` em ${params.categoryName}` : ""
          }...`}
          value={searchText}
          onChangeText={setSearchText}
          placeholderTextColor="#9CA3AF"
        />
        {searchText.length > 0 && (
          <TouchableOpacity onPress={() => setSearchText("")}>
            <MaterialIcons name="clear" size={24} color="#9CA3AF" />
          </TouchableOpacity>
        )}
      </View>

      {/* Botão de filtros */}
      <View style={styles.filtersHeader}>
        <TouchableOpacity
          style={[
            styles.filtersButton,
            showFilters && styles.filtersButtonActive,
          ]}
          onPress={() => setShowFilters(!showFilters)}
        >
          <MaterialIcons
            name="tune"
            size={20}
            color={showFilters ? "#FFFFFF" : "#4F46E5"}
          />
          <Text
            style={[
              styles.filtersButtonText,
              showFilters && styles.filtersButtonTextActive,
            ]}
          >
            Filtros
          </Text>
        </TouchableOpacity>

        <Text style={styles.resultsCount}>
          {filteredQuestions.length} questões encontradas
        </Text>
      </View>

      {/* Filtros */}
      {showFilters && (
        <QuestionFilters
          filters={filters}
          onFiltersChange={handleFiltersChange}
          onClearFilters={handleClearFilters}
        />
      )}
    </View>
  );

  const renderEmptyState = () => (
    <View style={styles.emptyContainer}>
      <MaterialIcons name="quiz" size={64} color="#D1D5DB" />
      <Text style={styles.emptyTitle}>Nenhuma questão encontrada</Text>
      <Text style={styles.emptyText}>
        Tente ajustar os filtros ou termos de busca
      </Text>
      <TouchableOpacity
        style={styles.clearFiltersButton}
        onPress={handleClearFilters}
      >
        <Text style={styles.clearFiltersText}>Limpar filtros</Text>
      </TouchableOpacity>
    </View>
  );

  if (loading) {
    return (
      <Layout>
        <View style={styles.loadingContainer}>
          <MaterialIcons name="quiz" size={48} color="#4F46E5" />
          <Text style={styles.loadingText}>Carregando questões...</Text>
        </View>
      </Layout>
    );
  }

  return (
    <Layout>
      <View style={styles.container}>
        <FlatList
          data={filteredQuestions}
          renderItem={renderQuestion}
          keyExtractor={(item) => `${item.categoryId}-${item.id}`}
          ListHeaderComponent={renderHeader}
          ListEmptyComponent={renderEmptyState}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          showsVerticalScrollIndicator={false}
          contentContainerStyle={[
            styles.listContent,
            filteredQuestions.length === 0 && styles.listContentEmpty,
          ]}
        />
      </View>
    </Layout>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F9FAFB",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    gap: 16,
  },
  loadingText: {
    fontSize: 16,
    color: "#6B7280",
    fontWeight: "500",
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    margin: 16,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: "#111827",
    marginLeft: 12,
  },
  filtersHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    marginBottom: 8,
  },
  filtersButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: "#FFFFFF",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: "#4F46E5",
  },
  filtersButtonActive: {
    backgroundColor: "#4F46E5",
  },
  filtersButtonText: {
    fontSize: 14,
    fontWeight: "500",
    color: "#4F46E5",
  },
  filtersButtonTextActive: {
    color: "#FFFFFF",
  },
  resultsCount: {
    fontSize: 14,
    color: "#6B7280",
    fontWeight: "500",
  },
  listContent: {
    paddingBottom: 20,
  },
  listContentEmpty: {
    flexGrow: 1,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 32,
    paddingVertical: 64,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#374151",
    textAlign: "center",
    marginTop: 16,
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 14,
    color: "#6B7280",
    textAlign: "center",
    lineHeight: 20,
    marginBottom: 24,
  },
  clearFiltersButton: {
    backgroundColor: "#4F46E5",
    borderRadius: 8,
    paddingHorizontal: 24,
    paddingVertical: 12,
  },
  clearFiltersText: {
    fontSize: 14,
    fontWeight: "500",
    color: "#FFFFFF",
  },
  categoryHeader: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 16,
    backgroundColor: "#FFFFFF",
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
  },
  backButton: {
    marginRight: 12,
    padding: 4,
  },
  categoryInfo: {
    flex: 1,
  },
  categoryTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#111827",
    marginBottom: 2,
  },
  categorySubtitle: {
    fontSize: 14,
    color: "#6B7280",
  },
});
