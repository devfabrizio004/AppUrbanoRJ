// tela de detalhe: mostra o registro completo, permite editar e deletar

import React, { useState, useEffect } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  Image, Alert, TextInput, ActivityIndicator, Modal,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { getReportById, updateReport, deleteReport, upvoteReport } from '../database/db';
import { COLORS, CATEGORIAS, STATUS, SHADOW } from '../theme';

export default function DetailScreen({ route, navigation }) {
  const { id } = route.params;
  const [report, setReport] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [titulo, setTitulo] = useState('');
  const [descricao, setDescricao] = useState('');
  const [status, setStatus] = useState('');
  const [saving, setSaving] = useState(false);
  const [statusModal, setStatusModal] = useState(false);

  useEffect(() => {
    loadReport();
  }, []);

  const loadReport = async () => {
    const data = await getReportById(id);
    if (data) {
      setReport(data);
      setTitulo(data.titulo);
      setDescricao(data.descricao);
      setStatus(data.status);
    }
  };

  const handleSave = async () => {
    if (!titulo.trim()) {
      Alert.alert('Atenção', 'O título não pode estar vazio.');
      return;
    }
    setSaving(true);
    const updated = await updateReport(id, { titulo, descricao, status });
    setSaving(false);
    if (updated) {
      setReport(updated);
      setEditMode(false);
    }
  };

  const handleDelete = () => {
    Alert.alert(
      'Apagar essa denúncia',
      'Vai apagar de vez, não tem como desfazer. Confirma?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Excluir',
          style: 'destructive',
          onPress: async () => {
            await deleteReport(id);
            navigation.goBack();
          },
        },
      ]
    );
  };

  const handleUpvote = async () => {
    const updated = await upvoteReport(id);
    if (updated) setReport(updated);
  };

  const handleStatusChange = async (newStatus) => {
    setStatusModal(false);
    const updated = await updateReport(id, { status: newStatus });
    if (updated) {
      setReport(updated);
      setStatus(newStatus);
    }
  };

  if (!report) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );
  }

  const cat = CATEGORIAS[report.categoria] || CATEGORIAS.outros;
  const sta = STATUS[report.status] || STATUS.aberto;

  const formatDate = (iso) => {
    if (!iso) return '';
    return new Date(iso).toLocaleDateString('pt-BR', {
      day: '2-digit', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit',
    });
  };

  return (
    <>
      <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 40 }}>
        {/* Foto */}
        {report.foto && (
          <Image source={{ uri: report.foto }} style={styles.coverPhoto} />
        )}

        {/* Header do card */}
        <View style={styles.headerCard}>
          <View style={[styles.catBadge, { backgroundColor: cat.bg }]}>
            <Ionicons name={cat.icon} size={16} color={cat.color} />
            <Text style={[styles.catBadgeText, { color: cat.color }]}>{cat.label}</Text>
          </View>

          <TouchableOpacity
            style={[styles.statusBadge, { backgroundColor: sta.bg }]}
            onPress={() => setStatusModal(true)}
          >
            <Ionicons name={sta.icon} size={14} color={sta.color} />
            <Text style={[styles.statusBadgeText, { color: sta.color }]}>{sta.label}</Text>
            <Ionicons name="chevron-down" size={12} color={sta.color} />
          </TouchableOpacity>
        </View>

        <View style={styles.body}>
          {editMode ? (
            <>
              <TextInput
                style={styles.editTitle}
                value={titulo}
                onChangeText={setTitulo}
                multiline
              />
              <TextInput
                style={styles.editDesc}
                value={descricao}
                onChangeText={setDescricao}
                multiline
                textAlignVertical="top"
              />
            </>
          ) : (
            <>
              <Text style={styles.title}>{report.titulo}</Text>
              <Text style={styles.description}>{report.descricao}</Text>
            </>
          )}

          {/* Localização */}
          {(report.endereco || report.bairro) && (
            <View style={styles.infoRow}>
              <Ionicons name="location" size={16} color={COLORS.primary} />
              <Text style={styles.infoText}>
                {[report.endereco, report.bairro].filter(Boolean).join(' — ')}
              </Text>
            </View>
          )}

          {report.latitude && (
            <View style={styles.infoRow}>
              <Ionicons name="navigate" size={16} color={COLORS.info} />
              <Text style={styles.infoText}>
                {report.latitude.toFixed(5)}, {report.longitude.toFixed(5)}
              </Text>
            </View>
          )}

          {/* Datas */}
          <View style={styles.separator} />
          <View style={styles.infoRow}>
            <Ionicons name="calendar-outline" size={16} color={COLORS.gray500} />
            <Text style={styles.dateText}>Registrado em {formatDate(report.criadoEm)}</Text>
          </View>
          {report.atualizadoEm !== report.criadoEm && (
            <View style={styles.infoRow}>
              <Ionicons name="refresh-outline" size={16} color={COLORS.gray500} />
              <Text style={styles.dateText}>Atualizado em {formatDate(report.atualizadoEm)}</Text>
            </View>
          )}

          {/* Votos */}
          <View style={styles.separator} />
          <View style={styles.voteRow}>
            <Text style={styles.voteLabel}>Moradores que confirmaram este problema:</Text>
            <TouchableOpacity style={styles.voteBtn} onPress={handleUpvote}>
              <Ionicons name="thumbs-up" size={18} color={COLORS.primary} />
              <Text style={styles.voteCount}>{report.votos || 0}</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Ações */}
        <View style={styles.actions}>
          {editMode ? (
            <>
              <TouchableOpacity
                style={[styles.actionBtn, styles.saveBtn]}
                onPress={handleSave}
                disabled={saving}
              >
                {saving ? (
                  <ActivityIndicator color={COLORS.white} size="small" />
                ) : (
                  <>
                    <Ionicons name="checkmark" size={18} color={COLORS.white} />
                    <Text style={styles.saveBtnText}>Salvar alterações</Text>
                  </>
                )}
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.actionBtn, styles.cancelBtn]}
                onPress={() => {
                  setEditMode(false);
                  setTitulo(report.titulo);
                  setDescricao(report.descricao);
                }}
              >
                <Text style={styles.cancelBtnText}>Cancelar</Text>
              </TouchableOpacity>
            </>
          ) : (
            <>
              <TouchableOpacity
                style={[styles.actionBtn, styles.editBtn]}
                onPress={() => setEditMode(true)}
              >
                <Ionicons name="pencil" size={16} color={COLORS.primary} />
                <Text style={styles.editBtnText}>Editar</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.actionBtn, styles.deleteBtn]}
                onPress={handleDelete}
              >
                <Ionicons name="trash-outline" size={16} color={COLORS.danger} />
                <Text style={styles.deleteBtnText}>Excluir</Text>
              </TouchableOpacity>
            </>
          )}
        </View>
      </ScrollView>

      {/* Modal de status */}
      <Modal visible={statusModal} transparent animationType="slide">
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setStatusModal(false)}
        >
          <View style={styles.modalSheet}>
            <Text style={styles.modalTitle}>Alterar Status</Text>
            {Object.entries(STATUS).map(([key, val]) => (
              <TouchableOpacity
                key={key}
                style={[styles.modalOption, report.status === key && { backgroundColor: val.bg }]}
                onPress={() => handleStatusChange(key)}
              >
                <Ionicons name={val.icon} size={20} color={val.color} />
                <Text style={[styles.modalOptionText, { color: val.color }]}>{val.label}</Text>
                {report.status === key && <Ionicons name="checkmark" size={18} color={val.color} />}
              </TouchableOpacity>
            ))}
          </View>
        </TouchableOpacity>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.gray50,
  },
  loading: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  coverPhoto: {
    width: '100%',
    height: 220,
    resizeMode: 'cover',
  },
  headerCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.gray200,
  },
  catBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 20,
    gap: 6,
  },
  catBadgeText: { fontSize: 13, fontWeight: '600' },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 20,
    gap: 4,
  },
  statusBadgeText: { fontSize: 13, fontWeight: '600' },
  body: {
    backgroundColor: COLORS.white,
    margin: 16,
    borderRadius: 16,
    padding: 16,
    ...SHADOW.small,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: COLORS.gray900,
    marginBottom: 10,
    lineHeight: 26,
  },
  description: {
    fontSize: 15,
    color: COLORS.gray600,
    lineHeight: 22,
    marginBottom: 14,
  },
  editTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.gray900,
    borderWidth: 1,
    borderColor: COLORS.primary,
    borderRadius: 10,
    padding: 10,
    marginBottom: 10,
  },
  editDesc: {
    fontSize: 14,
    color: COLORS.gray700,
    borderWidth: 1,
    borderColor: COLORS.gray300,
    borderRadius: 10,
    padding: 10,
    minHeight: 100,
    marginBottom: 10,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
    marginBottom: 8,
  },
  infoText: {
    fontSize: 14,
    color: COLORS.gray700,
    flex: 1,
    lineHeight: 20,
  },
  dateText: {
    fontSize: 13,
    color: COLORS.gray500,
    flex: 1,
  },
  separator: {
    height: 1,
    backgroundColor: COLORS.gray100,
    marginVertical: 12,
  },
  voteRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  voteLabel: {
    fontSize: 13,
    color: COLORS.gray600,
    flex: 1,
    marginRight: 10,
  },
  voteBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.primaryLight,
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 8,
    gap: 6,
  },
  voteCount: {
    fontSize: 15,
    fontWeight: '700',
    color: COLORS.primary,
  },
  actions: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    gap: 10,
  },
  actionBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 12,
    paddingVertical: 13,
    gap: 6,
  },
  saveBtn: { backgroundColor: COLORS.primary },
  saveBtnText: { color: COLORS.white, fontWeight: '700', fontSize: 15 },
  cancelBtn: { backgroundColor: COLORS.gray100 },
  cancelBtnText: { color: COLORS.gray700, fontWeight: '600', fontSize: 15 },
  editBtn: { backgroundColor: COLORS.primaryLight, borderWidth: 1, borderColor: COLORS.primary + '50' },
  editBtnText: { color: COLORS.primary, fontWeight: '600', fontSize: 15 },
  deleteBtn: { backgroundColor: COLORS.dangerLight, borderWidth: 1, borderColor: COLORS.danger + '50' },
  deleteBtnText: { color: COLORS.danger, fontWeight: '600', fontSize: 15 },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalSheet: {
    backgroundColor: COLORS.white,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
  },
  modalTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: COLORS.gray900,
    marginBottom: 16,
    textAlign: 'center',
  },
  modalOption: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 14,
    paddingHorizontal: 12,
    borderRadius: 12,
    marginBottom: 8,
  },
  modalOptionText: {
    fontSize: 15,
    fontWeight: '600',
    flex: 1,
  },
});
