import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, ScrollView, Image, Alert, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowLeft, User, Mail, Phone, MapPin, Camera } from 'lucide-react-native';
import { router } from 'expo-router';
import { API_URL } from '@/config/api';

interface ProfileData {
  name: string;
  email: string;
  phone: string;
  location: string;
}

export default function EditProfileScreen() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [profile, setProfile] = useState<ProfileData>({ name: '', email: '', phone: '', location: '' });

  useEffect(() => {
    const fetchCurrentProfile = async () => {
      setLoading(true);
      try {
        const response = await fetch(`${API_URL}/profile/1`);
        const data = await response.json();
        if (!response.ok) throw new Error(data.message);
        setProfile({
          name: data.name || '',
          email: data.email || '',
          phone: data.phone || '',
          location: data.location || ''
        });
      } catch (error: any) {
        Alert.alert("Erro", "Não foi possível carregar os dados do perfil.");
      } finally {
        setLoading(false);
      }
    };
    fetchCurrentProfile();
  }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      const response = await fetch(`${API_URL}/profile/1`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(profile)
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message);
      
      Alert.alert("Sucesso!", "Seu perfil foi atualizado.", [{
        text: 'OK',
        onPress: () => router.back()
      }]);

    } catch (error: any) {
      Alert.alert("Erro ao Salvar", error.message);
    } finally {
      setSaving(false);
    }
  };

  const handleInputChange = (field: keyof ProfileData, value: string) => {
    setProfile(prev => ({ ...prev, [field]: value }));
  };

  if (loading) {
    return (
      <SafeAreaView style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color="#2563EB" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}><ArrowLeft size={24} color="#1E293B" /></TouchableOpacity>
        <Text style={styles.headerTitle}>Editar Perfil</Text>
        <View style={{ width: 24 }} />
      </View>
      <ScrollView style={styles.content}>
        <View style={styles.avatarSection}>
            <Image 
                source={{ uri: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2' }}
                style={styles.avatar}
            />
            <TouchableOpacity style={styles.cameraButton}>
                <Camera size={20} color="#FFFFFF" />
            </TouchableOpacity>
        </View>

        <Text style={styles.label}>Nome Completo</Text>
        <View style={styles.inputContainer}>
          <User color="#64748B" size={20} />
          <TextInput style={styles.input} value={profile.name} onChangeText={v => handleInputChange('name', v)} />
        </View>
        
        <Text style={styles.label}>E-mail</Text>
        <View style={styles.inputContainer}>
          <Mail color="#64748B" size={20} />
          <TextInput style={styles.input} value={profile.email} onChangeText={v => handleInputChange('email', v)} keyboardType="email-address" />
        </View>

        <Text style={styles.label}>Telefone</Text>
        <View style={styles.inputContainer}>
          <Phone color="#64748B" size={20} />
          <TextInput style={styles.input} value={profile.phone} onChangeText={v => handleInputChange('phone', v)} placeholder="(00) 00000-0000" keyboardType="phone-pad" />
        </View>

        <Text style={styles.label}>Localização</Text>
        <View style={styles.inputContainer}>
          <MapPin color="#64748B" size={20} />
          <TextInput style={styles.input} value={profile.location} onChangeText={v => handleInputChange('location', v)} />
        </View>

        <TouchableOpacity style={styles.saveButton} onPress={handleSave} disabled={saving}>
          {saving ? <ActivityIndicator color="#FFFFFF" /> : <Text style={styles.saveButtonText}>Salvar Alterações</Text>}
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8FAFC' },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingVertical: 16, backgroundColor: '#FFFFFF', borderBottomWidth: 1, borderBottomColor: '#F1F5F9' },
  headerTitle: { fontSize: 18, fontFamily: 'Inter-SemiBold', color: '#1E293B' },
  content: { flex: 1, padding: 20 },
  avatarSection: { alignItems: 'center', marginBottom: 24 },
  avatar: { width: 120, height: 120, borderRadius: 60, marginBottom: -20 },
  cameraButton: { position: 'relative', bottom: 0, left: 40, backgroundColor: '#2563EB', padding: 8, borderRadius: 20, borderWidth: 2, borderColor: '#FFFFFF' },
  label: { fontSize: 14, fontFamily: 'Inter-Medium', color: '#475569', marginBottom: 8, paddingLeft: 4 },
  inputContainer: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFFFFF', borderRadius: 12, paddingHorizontal: 16, borderWidth: 1, borderColor: '#E2E8F0', marginBottom: 16 },
  input: { flex: 1, fontSize: 16, fontFamily: 'Inter-Regular', color: '#1E293B', paddingVertical: 16, paddingLeft: 12 },
  saveButton: { backgroundColor: '#2563EB', borderRadius: 12, paddingVertical: 16, alignItems: 'center', marginTop: 16, height: 54, justifyContent: 'center' },
  saveButtonText: { fontSize: 16, fontFamily: 'Inter-SemiBold', color: '#FFFFFF' },
});