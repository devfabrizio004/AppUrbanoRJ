import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { CATEGORIAS, STATUS, COLORS, SHADOW } from '../theme';

export default function ReportCard({ report, onPress }) {
  const cat = CATEGORIAS[report.categoria] || CATEGORIAS.outros;
  const sta = STATUS[report.status] || STATUS.aberto;

  const formatDate = (iso) => {
    if (!iso) return '';
    const d = new Date(iso);
    return d.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' });
  };

  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.85}>
      <View style={styles.row}>
        {/* Ícone da categoria */}
        <View style={[styles.iconBox, { backgroundColor: cat.bg }]}>
          <Ionicons name={cat.icon} size={22} color={cat.color} />
        </View>

        {/* Conteúdo */}
        <View style={styles.content}>
          <View style={styles.topRow}>
            <Text style={styles.titulo} numberOfLines={1}>{report.titulo}</Text>
            <View style={[styles.badge, { backgroundColor: sta.bg }]}>
              <Text style={[styles.badgeText, { color: sta.color }]}>{sta.label}</Text>
            </View>
          </View>

          <Text style={styles.endereco} numberOfLines={1}>
            <Ionicons name="location-outline" size={12} color={COLORS.gray500} />
            {'  '}{report.bairro || report.endereco || 'Localização não informada'}
          </Text>

          <Text style={styles.descricao} numberOfLines={2}>{report.descricao}</Text>

          <View style={styles.footer}>
            <View style={styles.catPill}>
              <Text style={[styles.catText, { color: cat.color }]}>{cat.label}</Text>
            </View>
            <View style={styles.meta}>
              <Ionicons name="thumbs-up-outline" size={13} color={COLORS.gray500} />
              <Text style={styles.metaText}>{report.votos || 0}</Text>
              <Text style={styles.date}>{formatDate(report.criadoEm)}</Text>
            </View>
          </View>
        </View>
      </View>

      {report.foto && (
        <Image source={{ uri: report.foto }} style={styles.thumbnail} />
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.white,
    borderRadius: 16,
    marginHorizontal: 16,
    marginVertical: 6,
    padding: 14,
    ...SHADOW.small,
    borderWidth: 1,
    borderColor: COLORS.gray200,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  iconBox: {
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 2,
  },
  content: {
    flex: 1,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 3,
    gap: 8,
  },
  titulo: {
    fontSize: 15,
    fontWeight: '600',
    color: COLORS.gray900,
    flex: 1,
  },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 20,
  },
  badgeText: {
    fontSize: 11,
    fontWeight: '600',
  },
  endereco: {
    fontSize: 12,
    color: COLORS.gray500,
    marginBottom: 6,
  },
  descricao: {
    fontSize: 13,
    color: COLORS.gray600,
    lineHeight: 18,
    marginBottom: 10,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  catPill: {
    backgroundColor: COLORS.gray100,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  catText: {
    fontSize: 11,
    fontWeight: '500',
  },
  meta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  metaText: {
    fontSize: 12,
    color: COLORS.gray500,
    marginRight: 8,
  },
  date: {
    fontSize: 11,
    color: COLORS.gray400,
  },
  thumbnail: {
    width: '100%',
    height: 120,
    borderRadius: 10,
    marginTop: 10,
    resizeMode: 'cover',
  },
});
