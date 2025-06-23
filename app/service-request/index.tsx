import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Image, Alert, ActivityIndicator
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { router } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import * as Location from 'expo-location';
import { ArrowLeft, MapPin, Calendar, Clock, FileText, Upload, X } from 'lucide-react-native';

const API_URL = 'http://localhost:3000/api';

interface ServiceImage { id: string; uri: string; }

export default function ServiceRequestScreen() {
  const [serviceType, setServiceType] = useState('');
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('');
  const [preferredDate, setPreferredDate] = useState('');
  const [preferredTime, setPreferredTime] = useState('');
  const [budget, setBudget] = useState('');
  const [images, setImages] = useState<ServiceImage[]>([]);
  const [loading, setLoading] = useState(false);

  const serviceTypes = [
    'Montagem de Móveis', 'Instalação de Prateleiras', 'Montagem de Cozinha',
    'Montagem de Guarda-roupa', 'Montagem de Mesa', 'Instalação de TV', 'Outros',
  ];

  // Funções pickImage, takePhoto, removeImage, showImageOptions, getCurrentLocation permanecem as mesmas

  const handleSubmit = async () => {
    if (!serviceType || !description || !location) {
      Alert.alert('Campos obrigatórios', 'Preencha o tipo de serviço, descrição e localização.');
      return;
    }
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/service-request`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          serviceType, description, location, preferredDate, preferredTime, budget
        }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Erro ao enviar solicitação.');
      
      Alert.alert(
        'Solicitação enviada!',
        'Sua solicitação foi enviada. Você receberá orçamentos em breve.',
        [{ text: 'OK', onPress: () => router.back() }]
      );
    } catch (error: any) {
      Alert.alert('Erro', error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <ArrowLeft size={24} color="#1E293B" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Solicitar Serviço</Text>
        <View style={{width: 24}} />
      </View>
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* ... (Todo o JSX do formulário permanece o mesmo) ... */}
      </ScrollView>
      <View style={styles.footer}>
        <TouchableOpacity style={styles.submitButton} onPress={handleSubmit} disabled={loading}>
          {loading ? <ActivityIndicator color="#FFFFFF" /> :
          <Text style={styles.submitButtonText}>Enviar Solicitação</Text>}
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

// OS ESTILOS PERMANECEM OS MESMOS
const styles = StyleSheet.create({
  // ...
});