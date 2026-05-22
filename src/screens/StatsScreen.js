import React, { useState, useCallback } from 'react';
import {
  View, Text, StyleSheet, ScrollView, RefreshControl,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { getStats } from '../database/db';
import { COLORS, CATEGORIAS, STATUS, SHADOW } from '../theme';

// tela de estatisticas - mostra um resumo geral de tudo que foi registrado

export default function StatsScreen() {
  const [stats, setStats] = useState(null);
  const [refreshing, setRefreshing] = useState(false);

  const load = async () => {
    const s = await getStats();
    setStats(s);
  };

  useFocusEffect(
    useCallback(() => {
      load();
    }, [])
  );

  const onRefresh = async () => {
    setRefreshing(true);
    await load();
    setRefreshing(false);
  };

  if (!stats) return null;

  // calcula porcentagem
  const pct = (n) => (stats.total > 0 ? Math.round((n / stats.total) * 100) : 0);

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[COLORS.primary]} />}
    >
      {/* numero total de registros */}
      <View style={styles.hero}>
        <Text style={styles.heroLabel}>Total de denúncias</Text>
        <Text style={styles.heroNumber}>{stats.total}</Text>
        <Text style={styles.heroSub}>registradas pelos moradores</Text>
      </View>

      {/* cards por status */}
      <View style={styles.grid}>
        {[
          { key: 'abertos', label: 'Abertos', value: stats.abertos, ...STATUS.aberto },
          { key: 'em_andamento', label: 'Em Andamento', value: stats.em_andamento, ...STATUS.em_andamento },
          { key: 'resolvidos', label: 'Resolvidos', value: stats.resolvidos, ...STATUS.resolvido },
        ].map((item) => (
          <View key={item.key} style={[styles.statCard, { borderTopColor: item.color, borderTopWidth: 3 }]}>
            <Ionicons name={item.icon} size={22} color={item.color} />
            <Text style={styles.statValue}>{item.value}</Text>
            <Text style={styles.statLabel}>{item.label}</Text>
            <Text style={[styles.statPct, { color: item.color }]}>{pct(item.value)}%</Text>
          </View>
        ))}
      </View>

      {/* barra de resolucao */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Taxa de resolução</Text>
        <View style={styles.progressBar}>
          <View
            style={[
              styles.progressFill,
              { width: `${pct(stats.resolvidos)}%`, backgroundColor: COLORS.primary },
            ]}
          />
        </View>
        <Text style={styles.progressLabel}>
          {pct(stats.resolvidos)}% dos problemas foram resolvidos
        </Text>
      </View>

      {/* por categoria */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Por categoria</Text>
        {Object.entries(CATEGORIAS).map(([key, cat]) => {
          const count = stats.porCategoria[key] || 0;
          if (count === 0) return null;
          const barPct = pct(count);
          return (
            <View key={key} style={styles.catRow}>
              <View style={[styles.catIcon, { backgroundColor: cat.bg }]}>
                <Ionicons name={cat.icon} size={16} color={cat.color} />
              </View>
              <View style={styles.catInfo}>
                <View style={styles.catTopRow}>
                  <Text style={styles.catName}>{cat.label}</Text>
                  <Text style={styles.catCount}>{count}</Text>
                </View>
                <View style={styles.catBarBg}>
                  <View
                    style={[
                      styles.catBarFill,
                      { width: `${barPct}%`, backgroundColor: cat.color },
                    ]}
                  />
                </View>
              </View>
            </View>
          );
        })}
        {stats.total === 0 && (
          <Text style={styles.empty}>Nenhuma denúncia ainda. Adicione a primeira!</Text>
        )}
      </View>

      {/* mensagem final */}
      <View style={[styles.section, styles.impactCard]}>
        <Ionicons name="people" size={28} color={COLORS.primary} />
        <Text style={styles.impactTitle}>Valeu pela participação!</Text>
        <Text style={styles.impactText}>
          Cada registro ajuda a mostrar onde o Rio precisa de atenção.
          {stats.resolvidos > 0
            ? ` Com ${stats.resolvidos} problema${stats.resolvidos > 1 ? 's' : ''} resolvido${stats.resolvidos > 1 ? 's' : ''}, o app já fez diferença.`
            : ' Comece registrando um problema do seu bairro.'}
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
    paddingTop: 32,
    paddingBottom: 32,
    alignItems: 'center',
  },
  heroLabel: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.7)',
    marginBottom: 4,
  },
  heroNumber: {
    fontSize: 60,
    fontWeight: '800',
    color: COLORS.white,
    lineHeight: 68,
  },
  heroSub: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.7)',
    marginTop: 4,
  },
  grid: {
    flexDirection: 'row',
    gap: 10,
    padding: 16,
  },
  statCard: {
    flex: 1,
    backgroundColor: COLORS.white,
    borderRadius: 14,
    padding: 14,
    alignItems: 'center',
    ...SHADOW.small,
  },
  statValue: {
    fontSize: 26,
    fontWeight: '800',
    color: COLORS.gray900,
    marginTop: 8,
  },
  statLabel: {
    fontSize: 11,
    color: COLORS.gray500,
    marginTop: 2,
    textAlign: 'center',
  },
  statPct: {
    fontSize: 12,
    fontWeight: '600',
    marginTop: 4,
  },
  section: {
    backgroundColor: COLORS.white,
    margin: 16,
    marginTop: 0,
    borderRadius: 16,
    padding: 16,
    ...SHADOW.small,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: COLORS.gray800,
    marginBottom: 14,
  },
  progressBar: {
    height: 10,
    backgroundColor: COLORS.gray100,
    borderRadius: 99,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 99,
  },
  progressLabel: {
    fontSize: 12,
    color: COLORS.gray500,
    marginTop: 8,
    textAlign: 'center',
  },
  catRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    gap: 12,
  },
  catIcon: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  catInfo: {
    flex: 1,
  },
  catTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  catName: {
    fontSize: 13,
    fontWeight: '500',
    color: COLORS.gray700,
  },
  catCount: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.gray900,
  },
  catBarBg: {
    height: 6,
    backgroundColor: COLORS.gray100,
    borderRadius: 99,
    overflow: 'hidden',
  },
  catBarFill: {
    height: '100%',
    borderRadius: 99,
  },
  empty: {
    color: COLORS.gray400,
    textAlign: 'center',
    fontSize: 13,
  },
  impactCard: {
    alignItems: 'center',
    backgroundColor: COLORS.primaryLight,
    borderWidth: 1,
    borderColor: COLORS.primary + '30',
  },
  impactTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.primary,
    marginTop: 10,
    marginBottom: 8,
  },
  impactText: {
    fontSize: 13,
    color: COLORS.primaryDark,
    textAlign: 'center',
    lineHeight: 20,
  },
});
