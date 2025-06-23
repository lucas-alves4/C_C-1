import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet, KeyboardAvoidingView,
  Platform, ScrollView, Image, Alert, ActivityIndicator
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { User, Mail, Lock, Phone, MapPin } from 'lucide-react-native';
import { API_URL } from '../apiConfig'; // <-- A mudança principal está aqui

type UserType = 'client' | 'professional';

export default function AuthScreen() {
  const [isLogin, setIsLogin] = useState(true);
  const [userType, setUserType] = useState<UserType>('client');
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    location: '',
  });

  const handleAuth = async () => {
    if (!formData.email || !formData.password) {
        Alert.alert('Erro', 'Email e senha são obrigatórios.');
        return;
    }
    setLoading(true);
    const endpoint = isLogin ? '/login' : '/register';
    const body = isLogin
      ? { email: formData.email, password: formData.password }
      : { ...formData, userType };

    try {
      const response = await fetch(`${API_URL}${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Ocorreu um erro de rede.');
      }
      
      if (isLogin) {
        // No futuro, você salvará o token `data.accessToken` aqui
        router.replace('/(tabs)');
      } else {
        Alert.alert('Sucesso!', 'Sua conta foi criada. Por favor, faça o login.');
        setIsLogin(true);
      }
    } catch (error: any) {
      Alert.alert('Erro de Rede', `Não foi possível conectar ao servidor. Verifique seu IP em apiConfig.ts e se o servidor está rodando. \n\nDetalhes: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const updateFormData = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <View style={styles.header}>
            <Image
              source={require('../../assets/images/logo.png')}
              style={styles.logo}
            />
            <Text style={styles.subtitle}>
              {isLogin ? 'Entre na sua conta' : 'Crie sua conta'}
            </Text>
          </View>

          {!isLogin && (
            <View style={styles.userTypeSelector}>
              <TouchableOpacity
                style={[
                  styles.userTypeButton,
                  userType === 'client' && styles.userTypeButtonActive
                ]}
                onPress={() => setUserType('client')}
              >
                <Text style={[
                  styles.userTypeText,
                  userType === 'client' && styles.userTypeTextActive
                ]}>
                  Cliente
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.userTypeButton,
                  userType === 'professional' && styles.userTypeButtonActive
                ]}
                onPress={() => setUserType('professional')}
              >
                <Text style={[
                  styles.userTypeText,
                  userType === 'professional' && styles.userTypeTextActive
                ]}>
                  Profissional
                </Text>
              </TouchableOpacity>
            </View>
          )}

          <View style={styles.form}>
            {!isLogin && (
              <View style={styles.inputContainer}>
                <User color="#64748B" size={20} />
                <TextInput
                  style={styles.input}
                  placeholder="Nome completo"
                  value={formData.name}
                  onChangeText={(value) => updateFormData('name', value)}
                  autoCapitalize="words"
                />
              </View>
            )}

            <View style={styles.inputContainer}>
              <Mail color="#64748B" size={20} />
              <TextInput
                style={styles.input}
                placeholder="Email"
                value={formData.email}
                onChangeText={(value) => updateFormData('email', value)}
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>

            <View style={styles.inputContainer}>
              <Lock color="#64748B" size={20} />
              <TextInput
                style={styles.input}
                placeholder="Senha"
                value={formData.password}
                onChangeText={(value) => updateFormData('password', value)}
                secureTextEntry
              />
            </View>

            {!isLogin && (
              <>
                <View style={styles.inputContainer}>
                  <Phone color="#64748B"