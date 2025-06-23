import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, KeyboardAvoidingView, Platform, ScrollView, Image, Alert, ActivityIndicator } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { User, Mail, Lock, Phone, MapPin } from 'lucide-react-native';
import { API_URL } from '@/config/api';

type UserType = 'client' | 'professional';

export default function AuthScreen() {
  const [isLogin, setIsLogin] = useState(true);
  const [userType, setUserType] = useState<UserType>('client');
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', password: '', phone: '', location: '' });

  const handleAuth = async () => {
    if (!formData.email || !formData.password) {
        Alert.alert('Erro', 'Email e senha são obrigatórios.');
        return;
    }
    setLoading(true);
    const endpoint = isLogin ? '/login' : '/register';
    const body = isLogin ? { email: formData.email, password: formData.password } : { ...formData, userType };

    try {
      const response = await fetch(`${API_URL}${endpoint}`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Ocorreu um erro.');
      
      if (isLogin) {
        router.replace('/(tabs)');
      } else {
        Alert.alert('Sucesso!', 'Conta criada. Por favor, faça o login.');
        setIsLogin(true);
      }
    } catch (error: any) {
      Alert.alert('Erro', error.message);
    } finally {
      setLoading(false);
    }
  };

  const updateFormData = (field: string, value: string) => { setFormData(prev => ({ ...prev, [field]: value })); };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.keyboardView}>
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <View style={styles.header}><Image source={require('../../assets/images/logo.png')} style={styles.logo} /><Text style={styles.subtitle}>{isLogin ? 'Entre na sua conta' : 'Crie sua conta'}</Text></View>
          {!isLogin && (
            <View style={styles.userTypeSelector}>
              <TouchableOpacity style={[styles.userTypeButton, userType === 'client' && styles.userTypeButtonActive]} onPress={() => setUserType('client')}><Text style={[styles.userTypeText, userType === 'client' && styles.userTypeTextActive]}>Cliente</Text></TouchableOpacity>
              <TouchableOpacity style={[styles.userTypeButton, userType === 'professional' && styles.userTypeButtonActive]} onPress={() => setUserType('professional')}><Text style={[styles.userTypeText, userType === 'professional' && styles.userTypeTextActive]}>Profissional</Text></TouchableOpacity>
            </View>
          )}
          <View style={styles.form}>
            {!isLogin && (<View style={styles.inputContainer}><User color="#64748B" size={20} /><TextInput style={styles.input} placeholder="Nome completo" value={formData.name} onChangeText={(v) => updateFormData('name', v)} autoCapitalize="words" /></View>)}
            <View style={styles.inputContainer}><Mail color="#64748B" size={20} /><TextInput style={styles.input} placeholder="Email" value={formData.email} onChangeText={(v) => updateFormData('email', v)} keyboardType="email-address" autoCapitalize="none" /></View>
            <View style={styles.inputContainer}><Lock color="#64748B" size={20} /><TextInput style={styles.input} placeholder="Senha" value={formData.password} onChangeText={(v) => updateFormData('password', v)} secureTextEntry /></View>
            {!isLogin && (
              <>
                <View style={styles.inputContainer}><Phone color="#64748B" size={20} /><TextInput style={styles.input} placeholder="Telefone" value={formData.phone} onChangeText={(v) => updateFormData('phone', v)} keyboardType="phone-pad" /></View>
                <View style={styles.inputContainer}><MapPin color="#64748B" size={20} /><TextInput style={styles.input} placeholder="Cidade" value={formData.location} onChangeText={(v) => updateFormData('location', v)} /></View>
              </>
            )}
            <TouchableOpacity style={styles.authButton} onPress={handleAuth} disabled={loading}>{loading ? <ActivityIndicator color="#FFFFFF" /> : <Text style={styles.authButtonText}>{isLogin ? 'Entrar' : 'Criar Conta'}</Text>}</TouchableOpacity>
            <TouchableOpacity style={styles.switchModeButton} onPress={() => setIsLogin(!isLogin)}><Text style={styles.switchModeText}>{isLogin ? 'Não tem conta? Cadastre-se' : 'Já tem conta? Entre'}</Text></TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFFFFF' },
  keyboardView: { flex: 1 },
  scrollContent: { flexGrow: 1, padding: 24, justifyContent: 'center' },
  header: { alignItems: 'center', marginBottom: 32 },
  logo: { width: 114.2, height: 110, marginBottom: 16, resizeMode: 'contain' },
  subtitle: { fontSize: 16, fontFamily: 'Inter-Regular', color: '#64748B', textAlign: 'center' },
  userTypeSelector: { flexDirection: 'row', backgroundColor: '#F1F5F9', borderRadius: 12, padding: 4, marginBottom: 24 },
  userTypeButton: { flex: 1, paddingVertical: 12, alignItems: 'center', borderRadius: 8 },
  userTypeButtonActive: { backgroundColor: '#2563EB' },
  userTypeText: { fontSize: 14, fontFamily: 'Inter-Medium', color: '#64748B' },
  userTypeTextActive: { color: '#FFFFFF' },
  form: { gap: 16 },
  inputContainer: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#F8FAFC', borderRadius: 12, paddingHorizontal: 16, borderWidth: 1, borderColor: '#E2E8F0' },
  input: { flex: 1, fontSize: 16, fontFamily: 'Inter-Regular', color: '#1E293B', paddingVertical: 16, paddingLeft: 12 },
  authButton: { backgroundColor: '#2563EB', borderRadius: 12, paddingVertical: 16, alignItems: 'center', marginTop: 8 },
  authButtonText: { fontSize: 16, fontFamily: 'Inter-SemiBold', color: '#FFFFFF' },
  switchModeButton: { alignItems: 'center', marginTop: 16, padding: 8 },
  switchModeText: { fontSize: 14, fontFamily: 'Inter-Medium', color: '#2563EB' },
});