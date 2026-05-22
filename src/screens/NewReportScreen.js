// tela de formulario pra registrar uma nova denuncia
// usa GPS e camera opcional

import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity,
  Alert, ActivityIndicator, Image, KeyboardAvoidingView, Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import * as Location from 'expo-location';
import { createReport } from '../database/db';
import { COLORS, CATEGORIAS, SHADOW } from '../theme';

export default function NewReportScreen({ navigation }) {
  const [titulo, setTitulo] = useState('');
  const [descricao, setDescricao] = useState('');
  const [categoria, setCategoria] = useState('');
  const [endereco, setEndereco] = useState('');
  const [bairro, setBairro] = useState('');
  const [foto, setFoto] = useState(null);
  const [coords, setCoords] = useState(null);
  const [loading, setLoading] = useState(false);
  const [locLoading, setLocLoading] = useState(false);

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permissão negada', 'Precisamos de acesso à galeria para anexar fotos.');
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 0.7,
    });
    if (!result.canceled) {
      setFoto(result.assets[0].uri);
    }
  };

  const takePhoto = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permissão negada', 'Precisamos de acesso à câmera.');
      return;
    }
    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      quality: 0.7,
    });
    if (!result.canceled) {
      setFoto(result.assets[0].uri);
    }
  };

  const getLocation = async () => {
    setLocLoading(true);
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permissão negada', 'Não foi possível acessar sua localização.');
        return;
      }
      const loc = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.High });
      setCoords({ lat: loc.coords.latitude, lon: loc.coords.longitude });

      const [place] = await Location.reverseGeocodeAsync({
        latitude: loc.coords.latitude,
        longitude: loc.coords.longitude,
      });
      if (place) {
        setEndereco(`${place.street || ''} ${place.streetNumber || ''}`.trim());
        setBairro(place.district || place.subregion || '');
      }
    } catch (e) {
      Alert.alert('Erro', 'Não foi possível obter a localização.');
    } finally {
      setLocLoading(false);
    }
  };

  const handleSubmit = async () => {
    if (!titulo.trim()) {
      Alert.alert('Campo obrigatório', 'Informe o título da ocorrência.');
      return;
    }
    if (!categoria) {
      Alert.alert('Campo obrigatório', 'Selecione a categoria do problema.');
      return;
    }
    if (!descricao.trim()) {
      Alert.alert('Campo obrigatório', 'Descreva o problema com mais detalhes.');
      return;
    }

    setLoading(true);
    const result = await createReport({
      titulo: titulo.trim(),
      descricao: descricao.trim(),
      categoria,
      endereco,
      bairro,
      latitude: coords?.lat,
      longitude: coords?.lon,
      foto,
    });
    setLoading(false);

    if (result) {
      Alert.alert(
        '✅ Denúncia registrada!',
        'Valeu! Seu registro foi salvo. Bora cobrar solução!',
        [{ text: 'OK', onPress: () => navigation.goBack() }]
      );
    } else {
      Alert.alert('Erro', 'Não foi possível salvar. Tente novamente.');
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView style={styles.container} contentContainerStyle={styles.content}>
        {/* Título */}
        <View style={styles.section}>
          <Text style={styles.label}>Título da denúncia *</Text>
          <TextInput
            style={styles.input}
            placeholder="Ex: Buraco na Rua X, poste apagado..."
            placeholderTextColor={COLORS.gray400}
            value={titulo}
            onChangeText={setTitulo}
            maxLength={80}
          />
        </View>

        {/* Categoria */}
        <View style={styles.section}>
          <Text style={styles.label}>Categoria *</Text>
          <View style={styles.categoriaGrid}>
            {Object.entries(CATEGORIAS).map(([key, val]) => (
              <TouchableOpacity
                key={key}
                style={[
                  styles.catOption,
                  categoria === key && { backgroundColor: val.bg, borderColor: val.color, borderWidth: 2 },
                ]}
                onPress={() => setCategoria(key)}
                activeOpacity={0.8}
              >
                <Ionicons
                  name={val.icon}
                  size={20}
                  color={categoria === key ? val.color : COLORS.gray500}
                />
                <Text style={[styles.catOptionText, categoria === key && { color: val.color }]}>
                  {val.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Descrição */}
        <View style={styles.section}>
          <Text style={styles.label}>Descrição *</Text>
          <TextInput
            style={[styles.input, styles.textarea]}
            placeholder="Conta com detalhes: faz quanto tempo, o que pode acontecer, já houve acidente?"
            placeholderTextColor={COLORS.gray400}
            value={descricao}
            onChangeText={setDescricao}
            multiline
            numberOfLines={4}
            textAlignVertical="top"
            maxLength={500}
          />
          <Text style={styles.charCount}>{descricao.length}/500</Text>
        </View>

        {/* Localização */}
        <View style={styles.section}>
          <Text style={styles.label}>Localização</Text>
          <TouchableOpacity style={styles.locBtn} onPress={getLocation}>
            {locLoading ? (
              <ActivityIndicator size="small" color={COLORS.primary} />
            ) : (
              <Ionicons name="location" size={18} color={COLORS.primary} />
            )}
            <Text style={styles.locBtnText}>
              {coords ? '✅ Localização ok!' : 'Pegar minha localização agora'}
            </Text>
          </TouchableOpacity>
          <TextInput
            style={[styles.input, { marginTop: 8 }]}
            placeholder="Rua e número"
            placeholderTextColor={COLORS.gray400}
            value={endereco}
            onChangeText={setEndereco}
          />
          <TextInput
            style={[styles.input, { marginTop: 8 }]}
            placeholder="Bairro"
            placeholderTextColor={COLORS.gray400}
            value={bairro}
            onChangeText={setBairro}
          />
        </View>

        {/* Foto */}
        <View style={styles.section}>
          <Text style={styles.label}>Foto (opcional)</Text>
          {foto ? (
            <View>
              <Image source={{ uri: foto }} style={styles.photoPreview} />
              <TouchableOpacity style={styles.removePhoto} onPress={() => setFoto(null)}>
                <Ionicons name="close-circle" size={24} color={COLORS.danger} />
                <Text style={styles.removePhotoText}>Remover foto</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <View style={styles.photoButtons}>
              <TouchableOpacity style={styles.photoBtn} onPress={takePhoto}>
                <Ionicons name="camera" size={22} color={COLORS.primary} />
                <Text style={styles.photoBtnText}>Câmera</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.photoBtn} onPress={pickImage}>
                <Ionicons name="images" size={22} color={COLORS.primary} />
                <Text style={styles.photoBtnText}>Galeria</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>

        {/* Botão de envio */}
        <TouchableOpacity
          style={[styles.submitBtn, loading && { opacity: 0.7 }]}
          onPress={handleSubmit}
          disabled={loading}
          activeOpacity={0.85}
        >
          {loading ? (
            <ActivityIndicator color={COLORS.white} />
          ) : (
            <>
              <Ionicons name="send" size={18} color={COLORS.white} />
              <Text style={styles.submitText}>Registrar Denúncia</Text>
            </>
          )}
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.gray50,
  },
  content: {
    padding: 16,
    paddingBottom: 40,
  },
  section: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.gray700,
    marginBottom: 8,
  },
  input: {
    backgroundColor: COLORS.white,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.gray200,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 15,
    color: COLORS.gray900,
  },
  textarea: {
    minHeight: 110,
    paddingTop: 12,
  },
  charCount: {
    textAlign: 'right',
    fontSize: 11,
    color: COLORS.gray400,
    marginTop: 4,
  },
  categoriaGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  catOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: COLORS.gray200,
    gap: 6,
    marginBottom: 4,
  },
  catOptionText: {
    fontSize: 12,
    color: COLORS.gray600,
    fontWeight: '500',
  },
  locBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.primaryLight,
    borderRadius: 12,
    padding: 12,
    gap: 8,
    borderWidth: 1,
    borderColor: COLORS.primary + '40',
  },
  locBtnText: {
    fontSize: 14,
    color: COLORS.primary,
    fontWeight: '500',
  },
  photoButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  photoBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.white,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: COLORS.primary,
    borderStyle: 'dashed',
    paddingVertical: 16,
    gap: 8,
  },
  photoBtnText: {
    fontSize: 14,
    color: COLORS.primary,
    fontWeight: '600',
  },
  photoPreview: {
    width: '100%',
    height: 200,
    borderRadius: 12,
    resizeMode: 'cover',
  },
  removePhoto: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
    gap: 6,
  },
  removePhotoText: {
    fontSize: 13,
    color: COLORS.danger,
  },
  submitBtn: {
    backgroundColor: COLORS.primary,
    borderRadius: 14,
    paddingVertical: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    marginTop: 8,
    ...SHADOW.medium,
  },
  submitText: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.white,
  },
});
