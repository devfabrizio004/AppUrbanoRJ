// tela principal - lista todas as denuncias com filtros e busca

import React, { useState, useEffect, useCallback } from 'react';
import {
  View, Text, StyleSheet, FlatList, TouchableOpacity,
  TextInput, RefreshControl, StatusBar, ScrollView,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { getAllReports, seedDemoData } from '../database/db';
import ReportCard from '../components/ReportCard';
import { COLORS, CATEGORIAS } from '../theme';

const FILTROS_STATUS = [
  { key: 'todos', label: 'Todos' },
  { key: 'aberto', label: 'Abertos' },
  { key: 'em_andamento', label: 'Em Andamento' },
  { key: 'resolvido', label: 'Resolvidos' },
];

export default function HomeScreen({ navigation }) {
  const [reports, setReports] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [search, setSearch] = useState('');
  const [statusFiltro, setStatusFiltro] = useState('todos');
  const [catFiltro, setCatFiltro] = useState('todas');
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);

  const loadReports = async () => {
    await seedDemoData();
    const data = await getAllReports();
    setReports(data);
    setLoading(false);
  };

  useFocusEffect(
    useCallback(() => {
      loadReports();
    }, [])
  );

  useEffect(() => {
    let result = [...reports];

    if (statusFiltro !== 'todos') {
      result = result.filter((r) => r.status === statusFiltro);
    }
    if (catFiltro !== 'todas') {
      result = result.filter((r) => r.categoria === catFiltro);
    }
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        (r) =>
          r.titulo?.toLowerCase().includes(q) ||
          r.descricao?.toLowerCase().includes(q) ||
          r.bairro?.toLowerCase().includes(q) ||
          r.endereco?.toLowerCase().includes(q)
      );
    }

    setFiltered(result);
  }, [reports, search, statusFiltro, catFiltro]);

  const onRefresh = async () => {
    setRefreshing(true);
    await loadReports();
    setRefreshing(false);
  };

  const ListHeader = () => (
    <View>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.appTitle}>UrbanoRJ</Text>
          <Text style={styles.subtitle}>Denuncie problemas do seu bairro</Text>
        </View>
        <TouchableOpacity
          style={styles.notifBtn}
          onPress={() => navigation.navigate('Stats')}
        >
          <Ionicons name="bar-chart-outline" size={22} color={COLORS.white} />
        </TouchableOpacity>
      </View>

      {/* Barra de busca */}
      <View style={styles.searchBox}>
        <Ionicons name="search" size={18} color={COLORS.gray400} style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Busca por título, bairro..."
          placeholderTextColor={COLORS.gray400}
          value={search}
          onChangeText={setSearch}
        />
        {search.length > 0 && (
          <TouchableOpacity onPress={() => setSearch('')}>
            <Ionicons name="close-circle" size={18} color={COLORS.gray400} />
          </TouchableOpacity>
        )}
      </View>

      {/* Filtros de status */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.filtersScroll}
        contentContainerStyle={styles.filtersContent}
      >
        {FILTROS_STATUS.map((f) => (
          <TouchableOpacity
            key={f.key}
            style={[styles.filterChip, statusFiltro === f.key && styles.filterChipActive]}
            onPress={() => setStatusFiltro(f.key)}
          >
            <Text style={[styles.filterText, statusFiltro === f.key && styles.filterTextActive]}>
              {f.label}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Filtros de categoria */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.catFilters}
      >
        <TouchableOpacity
          style={[styles.catChip, catFiltro === 'todas' && styles.catChipActive]}
          onPress={() => setCatFiltro('todas')}
        >
          <Text style={[styles.catChipText, catFiltro === 'todas' && styles.catChipTextActive]}>
            Todas as categorias
          </Text>
        </TouchableOpacity>
        {Object.entries(CATEGORIAS).map(([key, val]) => (
          <TouchableOpacity
            key={key}
            style={[
              styles.catChip,
              catFiltro === key && { backgroundColor: val.bg, borderColor: val.color },
            ]}
            onPress={() => setCatFiltro(key === catFiltro ? 'todas' : key)}
          >
            <Ionicons name={val.icon} size={13} color={catFiltro === key ? val.color : COLORS.gray600} />
            <Text style={[styles.catChipText, catFiltro === key && { color: val.color }]}>
              {' '}{val.label}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Contador */}
      <Text style={styles.count}>
        {filtered.length} ocorrência{filtered.length !== 1 ? 's' : ''} encontrada{filtered.length !== 1 ? 's' : ''}
      </Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.primary} />
      <FlatList
        data={filtered}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <ReportCard
            report={item}
            onPress={() => navigation.navigate('Detail', { id: item.id })}
          />
        )}
        ListHeaderComponent={ListHeader}
        ListEmptyComponent={
          !loading && (
            <View style={styles.empty}>
              <Ionicons name="search-outline" size={48} color={COLORS.gray300} />
              <Text style={styles.emptyTitle}>Nada encontrado aqui</Text>
              <Text style={styles.emptyText}>Muda os filtros ou adiciona uma nova denúncia aí embaixo</Text>
            </View>
          )
        }
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[COLORS.primary]} />}
        contentContainerStyle={{ paddingBottom: 100 }}
      />

      {/* FAB */}
      <TouchableOpacity
        style={styles.fab}
        onPress={() => navigation.navigate('NewReport')}
        activeOpacity={0.85}
      >
        <Ionicons name="add" size={28} color={COLORS.white} />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.gray50,
  },
  header: {
    backgroundColor: COLORS.primary,
    paddingTop: 52,
    paddingBottom: 20,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
  },
  appTitle: {
    fontSize: 26,
    fontWeight: '800',
    color: COLORS.white,
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.75)',
    marginTop: 2,
  },
  notifBtn: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: 'rgba(255,255,255,0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    marginHorizontal: 16,
    marginTop: 14,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: COLORS.gray200,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  searchIcon: { marginRight: 8 },
  searchInput: {
    flex: 1,
    fontSize: 15,
    color: COLORS.gray800,
  },
  filtersScroll: { marginTop: 14 },
  filtersContent: {
    paddingHorizontal: 16,
    gap: 8,
  },
  filterChip: {
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 20,
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: COLORS.gray200,
    marginRight: 8,
  },
  filterChipActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  filterText: {
    fontSize: 13,
    color: COLORS.gray600,
    fontWeight: '500',
  },
  filterTextActive: {
    color: COLORS.white,
  },
  catFilters: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    gap: 6,
  },
  catChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20,
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: COLORS.gray200,
    marginRight: 6,
  },
  catChipActive: {
    backgroundColor: COLORS.primaryLight,
    borderColor: COLORS.primary,
  },
  catChipText: {
    fontSize: 12,
    color: COLORS.gray600,
    fontWeight: '500',
  },
  catChipTextActive: {
    color: COLORS.primary,
  },
  count: {
    fontSize: 12,
    color: COLORS.gray500,
    marginHorizontal: 20,
    marginBottom: 8,
    marginTop: 4,
  },
  empty: {
    alignItems: 'center',
    paddingTop: 60,
    paddingHorizontal: 40,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.gray700,
    marginTop: 16,
    textAlign: 'center',
  },
  emptyText: {
    fontSize: 13,
    color: COLORS.gray400,
    marginTop: 6,
    textAlign: 'center',
    lineHeight: 20,
  },
  fab: {
    position: 'absolute',
    bottom: 24,
    right: 20,
    width: 58,
    height: 58,
    borderRadius: 29,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 8,
  },
});
