import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Switch } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowLeft, Bell, Lock, Palette, User, ChevronRight } from 'lucide-react-native';
import { router } from 'expo-router';

export default function SettingsScreen() {
  const [notifications, setNotifications] = useState(true);
  const [darkMode, setDarkMode] = useState(false);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <ArrowLeft size={24} color="#1E293B" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Configurações</Text>
        <View style={{ width: 24 }} />
      </View>
      <ScrollView style={styles.content}>
        <Text style={styles.sectionTitle}>Geral</Text>
        <View style={styles.menuSection}>
            <View style={styles.menuItem}>
                <View style={styles.menuItemLeft}>
                    <Bell size={20} color="#64748B" />
                    <Text style={styles.menuItemTitle}>Notificações</Text>
                </View>
                <Switch value={notifications} onValueChange={setNotifications} trackColor={{ false: '#E2E8F0', true: '#93C5FD' }} thumbColor={notifications ? '#2563EB' : '#CBD5E1'}/>
            </View>
            <View style={styles.menuItem}>
                <View style={styles.menuItemLeft}>
                    <Palette size={20} color="#64748B" />
                    <Text style={styles.menuItemTitle}>Modo Escuro</Text>
                </View>
                <Switch value={darkMode} onValueChange={setDarkMode} trackColor={{ false: '#E2E8F0', true: '#93C5FD' }} thumbColor={darkMode ? '#2563EB' : '#CBD5E1'}/>
            </View>
        </View>

        <Text style={styles.sectionTitle}>Conta</Text>
        <View style={styles.menuSection}>
            <TouchableOpacity style={styles.menuItem}>
                <View style={styles.menuItemLeft}>
                    <User size={20} color="#64748B" />
                    <Text style={styles.menuItemTitle}>Informações da Conta</Text>
                </View>
                <ChevronRight size={20} color="#CBD5E1" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.menuItem}>
                <View style={styles.menuItemLeft}>
                    <Lock size={20} color="#64748B" />
                    <Text style={styles.menuItemTitle}>Alterar Senha</Text>
                </View>
                <ChevronRight size={20} color="#CBD5E1" />
            </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8FAFC' },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingVertical: 16, backgroundColor: '#FFFFFF', borderBottomWidth: 1, borderBottomColor: '#F1F5F9' },
  headerTitle: { fontSize: 18, fontFamily: 'Inter-SemiBold', color: '#1E293B' },
  content: { flex: 1 },
  sectionTitle: { fontSize: 14, fontFamily: 'Inter-SemiBold', color: '#64748B', paddingHorizontal: 20, paddingTop: 24, paddingBottom: 8 },
  menuSection: { backgroundColor: '#FFFFFF' },
  menuItem: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingVertical: 16, borderBottomWidth: 1, borderBottomColor: '#F1F5F9' },
  menuItemLeft: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  menuItemTitle: { fontSize: 16, fontFamily: 'Inter-Medium', color: '#1E293B' },
});