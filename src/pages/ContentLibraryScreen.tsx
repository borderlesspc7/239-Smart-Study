"use client";
import { MaterialIcons } from "@expo/vector-icons";
import { useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Layout } from "../components/layout/Layout";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  header: {
    alignItems: "center",
    marginBottom: 24,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "bold",
  },
  headerSubtitle: {
    fontSize: 16,
    color: "#555",
  },
  statsContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 24,
  },
  statCard: {
    alignItems: "center",
  },
  statNumber: {
    fontSize: 20,
    fontWeight: "bold",
  },
  statLabel: {
    fontSize: 16,
    color: "#555",
  },
  categoriesSection: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 8,
  },
  categoryContainer: {
    marginBottom: 16,
  },
  categoryHeader: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 12,
    borderLeftWidth: 8,
  },
  categoryIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  categoryInfo: {
    flex: 1,
  },
  categoryTitle: {
    fontSize: 18,
    fontWeight: "bold",
  },
  categoryCount: {
    fontSize: 16,
    color: "#555",
  },
  contentList: {
    marginTop: 8,
  },
  contentItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 12,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    marginBottom: 8,
  },
  contentItemLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  contentTypeIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  contentItemInfo: {
    flex: 1,
  },
  contentItemTitle: {
    fontSize: 16,
    fontWeight: "bold",
  },
  contentItemDescription: {
    fontSize: 14,
    color: "#555",
    marginTop: 4,
  },
  contentMeta: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 8,
  },
  contentTypeLabel: {
    fontSize: 12,
    color: "#555",
    marginRight: 8,
  },
  contentDuration: {
    fontSize: 12,
    color: "#555",
  },
});

interface ContentItem {
  id: string;
  title: string;
  type: "video" | "text" | "podcast";
  duration?: string;
  thumbnail?: string;
  description: string;
}

interface ContentCategory {
  id: string;
  title: string;
  icon: string;
  color: string;
  contentCount: number;
  items: ContentItem[];
}

export function ContentLibraryScreen() {
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null);

  const categories: ContentCategory[] = [
    {
      id: "mathematics",
      title: "Matemática",
      icon: "calculate",
      color: "#6366F1",
      contentCount: 12,
      items: [
        {
          id: "m1",
          title: "Álgebra Básica",
          type: "video",
          duration: "15min",
          description: "Conceitos fundamentais de álgebra",
        },
        {
          id: "m2",
          title: "Equações Lineares",
          type: "text",
          description: "Guia completo sobre equações lineares",
        },
        {
          id: "m3",
          title: "Matemática em Contexto",
          type: "podcast",
          duration: "32min",
          description: "Discussão sobre aplicações práticas",
        },
      ],
    },
    {
      id: "physics",
      title: "Física",
      icon: "flash-on",
      color: "#EC4899",
      contentCount: 8,
      items: [
        {
          id: "p1",
          title: "Mecânica Clássica",
          type: "video",
          duration: "22min",
          description: "Leis de Newton e movimento",
        },
        {
          id: "p2",
          title: "Termodinâmica",
          type: "text",
          description: "Princípios de transferência de calor",
        },
      ],
    },
    {
      id: "chemistry",
      title: "Química",
      icon: "science",
      color: "#14B8A6",
      contentCount: 10,
      items: [
        {
          id: "c1",
          title: "Ligações Químicas",
          type: "video",
          duration: "18min",
          description: "Tipos de ligações e estruturas",
        },
        {
          id: "c2",
          title: "Reações Orgânicas",
          type: "podcast",
          duration: "28min",
          description: "Análise de mecanismos de reação",
        },
      ],
    },
    {
      id: "languages",
      title: "Idiomas",
      icon: "language",
      color: "#F59E0B",
      contentCount: 15,
      items: [
        {
          id: "l1",
          title: "English Pronunciation",
          type: "video",
          duration: "12min",
          description: "Técnicas de pronúncia correta",
        },
        {
          id: "l2",
          title: "Vocabulário Avançado",
          type: "text",
          description: "Expansão de vocabulário e expressões",
        },
      ],
    },
  ];

  const getContentTypeIcon = (type: string) => {
    switch (type) {
      case "video":
        return "play-circle";
      case "text":
        return "description";
      case "podcast":
        return "headphones";
      default:
        return "note";
    }
  };

  const getContentTypeColor = (type: string) => {
    switch (type) {
      case "video":
        return "#FF6B6B";
      case "text":
        return "#4ECDC4";
      case "podcast":
        return "#95E1D3";
      default:
        return "#999";
    }
  };

  const getContentTypeLabel = (type: string) => {
    switch (type) {
      case "video":
        return "Vídeo";
      case "text":
        return "Texto";
      case "podcast":
        return "Podcast";
      default:
        return "Conteúdo";
    }
  };

  const renderContentItem = (item: ContentItem) => (
    <TouchableOpacity key={item.id} style={styles.contentItem}>
      <View style={styles.contentItemLeft}>
        <View
          style={[
            styles.contentTypeIcon,
            { backgroundColor: getContentTypeColor(item.type) },
          ]}
        >
          <MaterialIcons
            name={getContentTypeIcon(item.type) as any}
            size={20}
            color="#fff"
          />
        </View>
        <View style={styles.contentItemInfo}>
          <Text style={styles.contentItemTitle}>{item.title}</Text>
          <Text style={styles.contentItemDescription}>{item.description}</Text>
          <View style={styles.contentMeta}>
            <Text style={styles.contentTypeLabel}>
              {getContentTypeLabel(item.type)}
            </Text>
            {item.duration && (
              <Text style={styles.contentDuration}>{item.duration}</Text>
            )}
          </View>
        </View>
      </View>
      <MaterialIcons name="chevron-right" size={24} color="#999" />
    </TouchableOpacity>
  );

  const renderCategory = (category: ContentCategory) => {
    const isExpanded = expandedCategory === category.id;

    return (
      <View key={category.id} style={styles.categoryContainer}>
        <TouchableOpacity
          style={[styles.categoryHeader, { borderLeftColor: category.color }]}
          onPress={() => setExpandedCategory(isExpanded ? null : category.id)}
        >
          <View
            style={[styles.categoryIcon, { backgroundColor: category.color }]}
          >
            <MaterialIcons name={category.icon as any} size={24} color="#fff" />
          </View>
          <View style={styles.categoryInfo}>
            <Text style={styles.categoryTitle}>{category.title}</Text>
            <Text style={styles.categoryCount}>
              {category.contentCount} conteúdos
            </Text>
          </View>
          <MaterialIcons
            name={isExpanded ? "expand-less" : "expand-more"}
            size={28}
            color={category.color}
          />
        </TouchableOpacity>

        {isExpanded && (
          <View style={styles.contentList}>
            {category.items.map((item) => renderContentItem(item))}
          </View>
        )}
      </View>
    );
  };

  return (
    <Layout title="Conteúdo" showHeader showSidebar>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Biblioteca de Conteúdo</Text>
          <Text style={styles.headerSubtitle}>
            Explore vídeos, textos e podcasts
          </Text>
        </View>

        <View style={styles.statsContainer}>
          <View style={styles.statCard}>
            <MaterialIcons name="video-library" size={28} color="#FF6B6B" />
            <Text style={styles.statNumber}>45</Text>
            <Text style={styles.statLabel}>Vídeos</Text>
          </View>
          <View style={styles.statCard}>
            <MaterialIcons name="description" size={28} color="#4ECDC4" />
            <Text style={styles.statNumber}>38</Text>
            <Text style={styles.statLabel}>Textos</Text>
          </View>
          <View style={styles.statCard}>
            <MaterialIcons name="podcasts" size={28} color="#95E1D3" />
            <Text style={styles.statNumber}>24</Text>
            <Text style={styles.statLabel}>Podcasts</Text>
          </View>
        </View>

        <View style={styles.categoriesSection}>
          <Text style={styles.sectionTitle}>Categorias</Text>
          {categories.map((category) => renderCategory(category))}
        </View>

        <View style={{ height: 20 }} />
      </ScrollView>
    </Layout>
  );
}
