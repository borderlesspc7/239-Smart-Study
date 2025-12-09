"use client";
import { MaterialIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Layout } from "../components/layout";

interface FeatureItem {
  icon: keyof typeof MaterialIcons.glyphMap;
  title: string;
  description: string;
}

const features: FeatureItem[] = [
  {
    icon: "quiz",
    title: "Banco de Questões",
    description:
      "Acesso a milhares de questões de provas anteriores organizadas por matéria e dificuldade.",
  },
  {
    icon: "mic",
    title: "Gravação de Áudio",
    description:
      "Grave suas anotações em áudio e revise-as quando precisar para melhorar o aprendizado.",
  },
  {
    icon: "assignment",
    title: "Simulados Completos",
    description:
      "Realize simulados realistas que simulam as condições reais da prova para se preparar melhor.",
  },
  {
    icon: "library-books",
    title: "Materiais de Estudo",
    description:
      "Organize seus materiais por matéria e tópicos para estudar de forma estruturada.",
  },
  {
    icon: "bar-chart",
    title: "Acompanhamento de Progresso",
    description:
      "Visualize seu desempenho em tempo real com gráficos e relatórios detalhados.",
  },
  {
    icon: "emoji-events",
    title: "Conquistas",
    description:
      "Ganhe badges e conquistas ao atingir metas e manter seu foco no estudo.",
  },
];

export function AboutScreen() {
  const navigation = useNavigation();

  return (
    <Layout>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        {/* Header com voltar */}
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={styles.backButton}
          >
            <MaterialIcons name="arrow-back" size={24} color="#4F46E5" />
          </TouchableOpacity>
          <Text style={styles.title}>Sobre</Text>
          <View style={{ width: 40 }} />
        </View>

        {/* Logo/Icon */}
        <View style={styles.logoContainer}>
          <View style={styles.logo}>
            <MaterialIcons name="school" size={48} color="#FFFFFF" />
          </View>
          <Text style={styles.appName}>Smart Student</Text>
          <Text style={styles.version}>Versão 1.0.0</Text>
        </View>

        {/* Descrição */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>O que é Smart Student?</Text>
          <Text style={styles.description}>
            Smart Student é uma plataforma completa de estudo projetada para
            ajudar você a se preparar melhor para provas como ENEM, FUVEST e
            outros exames importantes.
          </Text>
          <Text style={styles.description}>
            Nossa missão é tornar o estudo mais eficiente, organizado e
            motivador através de ferramentas inteligentes e uma interface
            intuitiva.
          </Text>
        </View>

        {/* Recursos */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Recursos Principais</Text>
          <View style={styles.featuresContainer}>
            {features.map((feature, index) => (
              <View key={index} style={styles.featureCard}>
                <View style={styles.featureIcon}>
                  <MaterialIcons
                    name={feature.icon}
                    size={28}
                    color="#4F46E5"
                  />
                </View>
                <View style={styles.featureContent}>
                  <Text style={styles.featureTitle}>{feature.title}</Text>
                  <Text style={styles.featureDescription}>
                    {feature.description}
                  </Text>
                </View>
              </View>
            ))}
          </View>
        </View>

        {/* Informações adicionais */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Informações</Text>

          <View style={styles.infoCard}>
            <View style={styles.infoBadge}>
              <MaterialIcons name="check-circle" size={24} color="#10B981" />
            </View>
            <View style={styles.infoContent}>
              <Text style={styles.infoTitle}>Totalmente Gratuito</Text>
              <Text style={styles.infoDescription}>
                Acesso completo a todos os recursos sem custo adicional.
              </Text>
            </View>
          </View>

          <View style={styles.infoCard}>
            <View style={[styles.infoBadge, { backgroundColor: "#DDD6FE" }]}>
              <MaterialIcons name="security" size={24} color="#4F46E5" />
            </View>
            <View style={styles.infoContent}>
              <Text style={styles.infoTitle}>Segurança de Dados</Text>
              <Text style={styles.infoDescription}>
                Seus dados estão protegidos com criptografia de ponta a ponta.
              </Text>
            </View>
          </View>

          <View style={styles.infoCard}>
            <View style={[styles.infoBadge, { backgroundColor: "#FEF3C7" }]}>
              <MaterialIcons name="update" size={24} color="#F59E0B" />
            </View>
            <View style={styles.infoContent}>
              <Text style={styles.infoTitle}>Atualizações Constantes</Text>
              <Text style={styles.infoDescription}>
                Novas questões e recursos são adicionados regularmente.
              </Text>
            </View>
          </View>
        </View>

        {/* Contato e Suporte */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Suporte</Text>
          <Text style={styles.description}>
            Tem dúvidas ou encontrou um problema? Entre em contato conosco
            através de:
          </Text>

          <TouchableOpacity style={styles.contactButton}>
            <MaterialIcons name="email" size={20} color="#4F46E5" />
            <Text style={styles.contactButtonText}>
              suporte@smartstudent.com
            </Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.contactButton}>
            <MaterialIcons name="help" size={20} color="#4F46E5" />
            <Text style={styles.contactButtonText}>
              Acessar Central de Ajuda
            </Text>
          </TouchableOpacity>
        </View>

        {/* Rodapé */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>
            © 2025 Smart Student. Todos os direitos reservados.
          </Text>
          <Text style={styles.footerLinks}>Termos | Privacidade | Cookies</Text>
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
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 16,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    color: "#111827",
  },
  logoContainer: {
    alignItems: "center",
    paddingVertical: 32,
  },
  logo: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#4F46E5",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
  },
  appName: {
    fontSize: 28,
    fontWeight: "700",
    color: "#111827",
    marginBottom: 4,
  },
  version: {
    fontSize: 14,
    color: "#9CA3AF",
  },
  section: {
    paddingHorizontal: 20,
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#111827",
    marginBottom: 16,
  },
  description: {
    fontSize: 14,
    color: "#6B7280",
    lineHeight: 22,
    marginBottom: 12,
  },
  featuresContainer: {
    gap: 12,
  },
  featureCard: {
    flexDirection: "row",
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  featureIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#EEF2FF",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  featureContent: {
    flex: 1,
  },
  featureTitle: {
    fontSize: 15,
    fontWeight: "600",
    color: "#111827",
    marginBottom: 4,
  },
  featureDescription: {
    fontSize: 13,
    color: "#6B7280",
    lineHeight: 18,
  },
  infoCard: {
    flexDirection: "row",
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  infoBadge: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#DCFCE7",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  infoContent: {
    flex: 1,
  },
  infoTitle: {
    fontSize: 15,
    fontWeight: "600",
    color: "#111827",
    marginBottom: 4,
  },
  infoDescription: {
    fontSize: 13,
    color: "#6B7280",
    lineHeight: 18,
  },
  contactButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginBottom: 12,
    borderLeftWidth: 3,
    borderLeftColor: "#4F46E5",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  contactButtonText: {
    fontSize: 14,
    color: "#4F46E5",
    fontWeight: "500",
    marginLeft: 12,
  },
  footer: {
    paddingHorizontal: 20,
    paddingVertical: 24,
    alignItems: "center",
  },
  footerText: {
    fontSize: 12,
    color: "#9CA3AF",
    textAlign: "center",
    marginBottom: 8,
  },
  footerLinks: {
    fontSize: 12,
    color: "#4F46E5",
    textAlign: "center",
  },
});
