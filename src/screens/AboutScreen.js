import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SHADOW } from '../theme';

// tela de informacoes do app
// feita por: [nomes do grupo]

const InfoRow = ({ icon, title, subtitle }) => (
  <View style={styles.infoRow}>
    <View style={styles.infoIcon}>
      <Ionicons name={icon} size={20} color={COLORS.primary} />
    </View>
    <View style={{ flex: 1 }}>
      <Text style={styles.infoTitle}>{title}</Text>
      {subtitle ? <Text style={styles.infoSub}>{subtitle}</Text> : null}
    </View>
  </View>
);

export default function AboutScreen() {
  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>

      {/* topo com logo e nome */}
      <View style={styles.hero}>
        <View style={styles.logoCircle}>
          <Ionicons name="home" size={40} color={COLORS.white} />
        </View>
        <Text style={styles.appName}>UrbanoRJ</Text>
        <Text style={styles.tagline}>Denuncie. Acompanhe. Mude o Rio.</Text>
        <View style={styles.versionBadge}>
          <Text style={styles.versionText}>v1.0.0</Text>
        </View>
      </View>

      {/* descricao do projeto */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>O que é o UrbanoRJ?</Text>
        <Text style={styles.cardText}>
          O UrbanoRJ é um app pra quem mora no Rio e tá cansado de ver buraco na rua, poste apagado
          e foco de dengue sem ninguém resolver. Com ele você registra o problema, coloca a localização
          e manda foto pra ficar documentado.
        </Text>
        <Text style={[styles.cardText, { marginTop: 10 }]}>
          A ideia é simples: se mais gente votar num problema, fica mais fácil cobrar a prefeitura.
          Juntos a gente consegue pressionar pra ter uma cidade melhor.
        </Text>
      </View>

      {/* como usar */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Como usar</Text>
        <InfoRow
          icon="add-circle-outline"
          title="Registra o problema"
          subtitle="Tira uma foto e descreve o que tá acontecendo"
        />
        <InfoRow
          icon="location-outline"
          title="Marca o local"
          subtitle="Usa o GPS ou digita o endereço na mão"
        />
        <InfoRow
          icon="thumbs-up-outline"
          title="Confirma o problema"
          subtitle="Vota nos registros que você também viu"
        />
        <InfoRow
          icon="refresh-outline"
          title="Acompanha"
          subtitle="Vê quando o status muda pra 'Resolvido'"
        />
      </View>

      {/* tecnologias utilizadas */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Tecnologias do projeto</Text>
        {[
          { icon: 'logo-react', label: 'React Native com Expo' },
          { icon: 'navigate-outline', label: 'React Navigation (Stack + Tab)' },
          { icon: 'server-outline', label: 'AsyncStorage para salvar os dados' },
          { icon: 'camera-outline', label: 'Expo Image Picker (câmera e galeria)' },
          { icon: 'location-outline', label: 'Expo Location (GPS e geocodificação)' },
        ].map((t) => (
          <View key={t.label} style={styles.techRow}>
            <Ionicons name={t.icon} size={16} color={COLORS.primary} />
            <Text style={styles.techLabel}>{t.label}</Text>
          </View>
        ))}
      </View>

      {/* info academica */}
      <View style={[styles.card, styles.disciplineCard]}>
        <Ionicons name="school" size={24} color={COLORS.primary} />
        <Text style={styles.disciplineTitle}>Trabalho da Faculdade</Text>
        <Text style={styles.disciplineText}>
          Projeto desenvolvido para a disciplina de Desenvolvimento Mobile.{'\n'}
          Tema: Cidadania — Registro de Problemas Urbanos.
        </Text>
      </View>

    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.gray50,
  },
  content: {
    paddingBottom: 40,
  },
  hero: {
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    paddingTop: 32,
    paddingBottom: 32,
  },
  logoCircle: {
    width: 80,
    height: 80,
    borderRadius: 24,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  appName: {
    fontSize: 28,
    fontWeight: '800',
    color: COLORS.white,
    letterSpacing: -0.5,
  },
  tagline: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.75)',
    marginTop: 4,
  },
  versionBadge: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 20,
    marginTop: 12,
  },
  versionText: {
    color: COLORS.white,
    fontSize: 12,
    fontWeight: '600',
  },
  card: {
    backgroundColor: COLORS.white,
    margin: 16,
    marginBottom: 0,
    borderRadius: 16,
    padding: 16,
    ...SHADOW.small,
  },
  cardTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: COLORS.gray800,
    marginBottom: 12,
  },
  cardText: {
    fontSize: 14,
    color: COLORS.gray600,
    lineHeight: 22,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 12,
  },
  infoIcon: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: COLORS.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  infoTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.gray800,
  },
  infoSub: {
    fontSize: 12,
    color: COLORS.gray500,
    marginTop: 1,
  },
  techRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 10,
  },
  techLabel: {
    fontSize: 14,
    color: COLORS.gray700,
  },
  disciplineCard: {
    alignItems: 'center',
    backgroundColor: COLORS.primaryLight,
    borderWidth: 1,
    borderColor: COLORS.primary + '30',
    margin: 16,
  },
  disciplineTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: COLORS.primary,
    marginTop: 10,
    marginBottom: 6,
  },
  disciplineText: {
    fontSize: 13,
    color: COLORS.primaryDark,
    textAlign: 'center',
    lineHeight: 20,
  },
});
