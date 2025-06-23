import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, Switch, ActivityIndicator, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { router, useFocusEffect } from 'expo-router';
import { Settings, Bell, MapPin, Star, CreditCard, HelpCircle, Shield, LogOut, ChevronRight, Edit } from 'lucide-react-native';
import { API_URL } from '@/config/api';

interface UserProfile {
    id: number; name: string; email: string; location: string; avatar: string; user_type: 'client' | 'professional';
    stats: { servicesCount: number; avgRating: number; reviewsCount: number; };
}

export default function ProfileScreen() {
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useFocusEffect(
    React.useCallback(() => {
      const fetchProfileData = async () => {
        if (!loading) setLoading(true);
        try {
          const response = await fetch(`${API_URL}/profile/1`);
          if (!response.ok) throw new Error("Não foi possível carregar o perfil.");
          const data = await response.json();
          setProfile(data);
        } catch (error: any) {
          Alert.alert("Erro de Perfil", error.message);
        } finally {
          setLoading(false);
        }
      };
      fetchProfileData();
    }, [])
  );

  const menuItems = [
    { id: 'edit-profile', title: 'Editar Perfil', icon: Edit, onPress: () => router.push('/edit-profile') },
    { id: 'addresses', title: 'Meus Endereços', icon: MapPin, onPress: () => router.push('/addresses') },
    { id: 'payment', title: 'Métodos de Pagamento', icon: CreditCard, onPress: () => router.push('/payment-methods') },
    { id: 'reviews', title: 'Minhas Avaliações', icon: Star, onPress: () => router.push('/my-reviews') },
    { id: 'settings', title: 'Configurações', icon: Settings, onPress: () => router.push('/settings') },
    { id: 'help', title: 'Ajuda e Suporte', icon: HelpCircle, onPress: () => router.push('/help') },
    { id: 'privacy', title: 'Privacidade', icon: Shield, onPress: () => router.push('/privacy') },
  ];

  const renderMenuItem = (item: any) => (
    <TouchableOpacity key={item.id} style={styles.menuItem} onPress={item.onPress}>
      <View style={styles.menuItemLeft}><item.icon size={20} color="#64748B" style={styles.icon} /><Text style={styles.menuItemTitle}>{item.title}</Text></View>
      <ChevronRight size={20} color="#CBD5E1" />
    </TouchableOpacity>
  );
  
  if (loading) {
    return (
        <SafeAreaView style={[styles.container, { justifyContent: 'center', alignItems: 'center'}]}>
            <ActivityIndicator size="large" color="#2563EB" />
        </SafeAreaView>
    )
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />
      <View style={styles.header}><Text style={styles.headerTitle}>Perfil</Text></View>
      <ScrollView showsVerticalScrollIndicator={false}>
        {profile ? (
          <>
            <View style={styles.profileSection}>
                <TouchableOpacity style={styles.avatarContainer} onPress={() => router.push('/edit-profile')}>
                    <Image source={{ uri: profile.avatar || 'https://placehold.co/100x100' }} style={styles.avatar}/>
                    <View style={styles.editAvatarButton}><Edit size={16} color="#FFFFFF" /></View>
                </TouchableOpacity>
              <Text style={styles.userName}>{profile.name}</Text>
              <Text style={styles.userEmail}>{profile.email}</Text>
            </View>

            <View style={styles.statsContainer}>
                <View style={styles.statItem}><Text style={styles.statNumber}>{profile.stats.servicesCount || 0}</Text><Text style={styles.statLabel}>{profile.user_type === 'professional' ? 'Trabalhos' : 'Serviços'}</Text></View>
                <View style={styles.statDivider} />
                <View style={styles.statItem}><Text style={styles.statNumber}>{(profile.stats.avgRating || 0).toFixed(1)}</Text><Text style={styles.statLabel}>Avaliação</Text></View>
                <View style={styles.statDivider} />
                <View style={styles.statItem}><Text style={styles.statNumber}>{profile.stats.reviewsCount || 0}</Text><Text style={styles.statLabel}>Reviews</Text></View>
            </View>

            <Text style={styles.sectionTitle}>Conta</Text>
            <View style={styles.menuSection}>{menuItems.slice(0, 4).map(renderMenuItem)}</View>

            <Text style={styles.sectionTitle}>Preferências</Text>
            <View style={styles.menuSection}><View style={styles.menuItem}><View style={styles.menuItemLeft}><Bell size={20} color="#64748B" style={styles.icon}/><Text style={styles.menuItemTitle}>Notificações</Text></View><Switch value={notificationsEnabled} onValueChange={setNotificationsEnabled} trackColor={{ false: '#E2E8F0', true: '#93C5FD' }} thumbColor={notificationsEnabled ? '#2563EB' : '#CBD5E1'}/></View></View>
            
            <Text style={styles.sectionTitle}>Suporte</Text>
            <View style={styles.menuSection}>{menuItems.slice(4).map(renderMenuItem)}</View>
            
            <View style={styles.logoutSection}><TouchableOpacity style={styles.logoutButton} onPress={() => router.replace('/auth')}><LogOut size={20} color="#EF4444" /><Text style={styles.logoutText}>Sair da Conta</Text></TouchableOpacity></View>
          </>
        ) : (
            <View style={{alignItems: 'center', marginTop: 50, paddingHorizontal: 20}}><Text style={{textAlign: 'center'}}>Não foi possível carregar o perfil.</Text></View>
        )}
        <View style={styles.versionSection}><Text style={styles.versionText}>Versão 1.0.1</Text></View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#F8FAFC' },
    header: { paddingHorizontal: 20, paddingVertical: 16, backgroundColor: '#FFFFFF', borderBottomWidth: 1, borderBottomColor: '#F1F5F9' },
    headerTitle: { fontSize: 24, fontFamily: 'Inter-Bold', color: '#1E293B' },
    profileSection: { backgroundColor: '#FFFFFF', paddingVertical: 20, alignItems: 'center' },
    avatarContainer: { position: 'relative', marginBottom: 12 },
    avatar: { width: 100, height: 100, borderRadius: 50 },
    editAvatarButton: { position: 'absolute', bottom: 0, right: 0, width: 32, height: 32, borderRadius: 16, backgroundColor: '#2563EB', alignItems: 'center', justifyContent: 'center', borderWidth: 2, borderColor: '#FFFFFF' },
    userName: { fontSize: 22, fontFamily: 'Inter-Bold', color: '#1E293B' },
    userEmail: { fontSize: 16, fontFamily: 'Inter-Regular', color: '#64748B' },
    statsContainer: { flexDirection: 'row', backgroundColor: '#FFFFFF', paddingVertical: 20, borderTopWidth: 1, borderBottomWidth: 1, borderColor: '#F1F5F9', marginTop: 20 },
    statItem: { flex: 1, alignItems: 'center' },
    statNumber: { fontSize: 18, fontFamily: 'Inter-Bold', color: '#1E293B' },
    statLabel: { fontSize: 12, fontFamily: 'Inter-Regular', color: '#64748B', textTransform: 'uppercase', marginTop: 4 },
    statDivider: { width: 1, height: '100%', backgroundColor: '#F1F5F9' },
    sectionTitle: { fontSize: 14, fontFamily: 'Inter-SemiBold', color: '#64748B', paddingHorizontal: 20, paddingTop: 24, paddingBottom: 8 },
    menuSection: { backgroundColor: '#FFFFFF' },
    menuItem: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: '#F1F5F9' },
    menuItemLeft: { flexDirection: 'row', alignItems: 'center', gap: 16 },
    icon: {},
    menuItemTitle: { fontSize: 16, fontFamily: 'Inter-Medium', color: '#1E293B' },
    logoutSection: { backgroundColor: '#FFFFFF', marginTop: 24 },
    logoutButton: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: 16, gap: 12 },
    logoutText: { fontSize: 16, fontFamily: 'Inter-Medium', color: '#EF4444' },
    versionSection: { alignItems: 'center', paddingVertical: 32 },
    versionText: { fontSize: 12, fontFamily: 'Inter-Regular', color: '#94A3B8' },
});