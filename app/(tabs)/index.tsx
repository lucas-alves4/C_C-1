import React, { useState, useEffect } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Image,
  Dimensions, ActivityIndicator, Alert
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { router, useFocusEffect } from 'expo-router';
import * as Location from 'expo-location';
import { Search, MapPin, Star, Clock, Filter, Plus } from 'lucide-react-native';
import { API_URL } from '../apiConfig';

const { width } = Dimensions.get('window');

interface Professional {
  id: string; name: string; rating: number; reviewCount: number; distance: string;
  price: string; specialties: string[]; avatar: string; verified: boolean; responseTime: string;
}

export default function HomeScreen() {
  const [location, setLocation] = useState<string>('Carregando...');
  const [searchQuery, setSearchQuery] = useState('');
  const [professionals, setProfessionals] = useState<Professional[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchProfessionals = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/professionals`);
      if (!response.ok) throw new Error('Falha ao buscar profissionais');
      const data = await response.json();
      setProfessionals(data);
    } catch (e: any) {
      Alert.alert('Erro', e.message);
    } finally {
      setLoading(false);
    }
  };

  const getCurrentLocation = async () => {
    try {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setLocation('Permissão negada'); return;
      }
      let currentLocation = await Location.getCurrentPositionAsync({});
      let address = await Location.reverseGeocodeAsync(currentLocation.coords);
      if (address[0]) setLocation(`${address[0].city}, ${address[0].region}`);
    } catch (error) { setLocation('Erro ao obter local'); }
  };
  
  useFocusEffect(
    React.useCallback(() => {
        getCurrentLocation();
        fetchProfessionals();
    }, [])
  );

  const renderProfessionalCard = (professional: Professional) => (
    <TouchableOpacity
      key={professional.id}
      style={styles.professionalCard}
      onPress={() => router.push(`/professional-profile?id=${professional.id}`)}
    >
      <View style={styles.professionalHeader}>
        <Image source={{ uri: professional.avatar }} style={styles.avatar} />
        <View style={styles.professionalInfo}>
          <View style={styles.nameContainer}>
            <Text style={styles.professionalName}>{professional.name}</Text>
            {professional.verified && (
              <View style={styles.verifiedBadge}><Text style={styles.verifiedText}>✓</Text></View>
            )}
          </View>
          <View style={styles.ratingContainer}>
            <Star size={14} color="#FFA500" fill="#FFA500" />
            <Text style={styles.rating}>{professional.rating.toFixed(1)}</Text>
            <Text style={styles.reviewCount}>({professional.reviewCount})</Text>
          </View>
          <View style={styles.locationContainer}>
            <MapPin size={12} color="#64748B" />
            <Text style={styles.distance}>{professional.distance}</Text>
          </View>
        </View>
      </View>
      <View style={styles.specialtiesContainer}>
        {professional.specialties.map((specialty, index) => (
          <View key={index} style={styles.specialtyTag}><Text style={styles.specialtyText}>{specialty}</Text></View>
        ))}
      </View>
      <View style={styles.professionalFooter}>
        <Text style={styles.price}>{professional.price}</Text>
        <TouchableOpacity style={styles.contactButton} onPress={() => router.push('/service-request')} >
          <Text style={styles.contactButtonText}>Solicitar Orçamento</Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />
      <View style={styles.header}>
        <View style={styles.locationContainer}><MapPin size={20} color="#2563EB" /><Text style={styles.locationText}>{location}</Text></View>
        <TouchableOpacity style={styles.filterButton}><Filter size={20} color="#64748B" /></TouchableOpacity>
      </View>
      <View style={styles.searchContainer}>
        <View style={styles.searchInputContainer}>
          <Search size={20} color="#64748B" />
          <TextInput style={styles.searchInput} placeholder="Buscar profissionais ou serviços..." value={searchQuery} onChangeText={setSearchQuery} />
        </View>
      </View>
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.quickActions}>
          <TouchableOpacity style={styles.quickActionButton} onPress={() => router.push('/service-request')}>
            <View style={styles.quickActionIcon}><Plus size={24} color="#2563EB" /></View>
            <Text style={styles.quickActionText}>Solicitar Novo Serviço</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Profissionais Próximos</Text>
          {!loading && <Text style={styles.sectionSubtitle}>{professionals.length} profissionais disponíveis</Text>}
        </View>
        {loading ? <ActivityIndicator size="large" color="#2563EB" style={{ marginVertical: 20 }}/> : 
        <View style={styles.professionalsContainer}>{professionals.map(renderProfessionalCard)}</View>}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFFFFF' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, paddingVertical: 16, borderBottomWidth: 1, borderBottomColor: '#F1F5F9' },
  locationContainer: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  locationText: { fontSize: 16, fontFamily: 'Inter-Medium', color: '#1E293B' },
  filterButton: { padding: 8 },
  searchContainer: { paddingHorizontal: 20, paddingTop: 16 },
  searchInputContainer: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#F8FAFC', borderRadius: 12, paddingHorizontal: 16, gap: 12 },
  searchInput: { flex: 1, fontSize: 16, fontFamily: 'Inter-Regular', color: '#1E293B', paddingVertical: 12 },
  content: { flex: 1 },
  quickActions: { paddingHorizontal: 20, marginVertical: 16 },
  quickActionButton: { backgroundColor: '#F0F7FF', borderRadius: 16, padding: 20, alignItems: 'center', borderWidth: 1, borderColor: '#E0F2FE' },
  quickActionIcon: { width: 48, height: 48, borderRadius: 24, backgroundColor: '#FFFFFF', alignItems: 'center', justifyContent: 'center', marginBottom: 12 },
  quickActionText: { fontSize: 16, fontFamily: 'Inter-SemiBold', color: '#2563EB' },
  sectionHeader: { paddingHorizontal: 20, marginBottom: 16 },
  sectionTitle: { fontSize: 20, fontFamily: 'Inter-Bold', color: '#1E293B', marginBottom: 4 },
  sectionSubtitle: { fontSize: 14, fontFamily: 'Inter-Regular', color: '#64748B' },
  professionalsContainer: { paddingHorizontal: 20, gap: 16, paddingBottom: 32 },
  professionalCard: { backgroundColor: '#FFFFFF', borderRadius: 16, padding: 16, borderWidth: 1, borderColor: '#E2E8F0' },
  professionalHeader: { flexDirection: 'row', marginBottom: 12 },
  avatar: { width: 60, height: 60, borderRadius: 30, marginRight: 12 },
  professionalInfo: { flex: 1, justifyContent: 'center' },
  nameContainer: { flexDirection: 'row', alignItems: 'center', marginBottom: 4 },
  professionalName: { fontSize: 16, fontFamily: 'Inter-SemiBold', color: '#1E293B', marginRight: 8 },
  verifiedBadge: { backgroundColor: '#10B981', borderRadius: 10, width: 20, height: 20, alignItems: 'center', justifyContent: 'center' },
  verifiedText: { color: '#FFFFFF', fontSize: 12, fontFamily: 'Inter-Bold' },
  ratingContainer: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  rating: { fontSize: 14, fontFamily: 'Inter-Medium', color: '#1E293B' },
  reviewCount: { fontSize: 12, fontFamily: 'Inter-Regular', color: '#64748B' },
  distance: { fontSize: 12, fontFamily: 'Inter-Regular', color: '#64748B', marginLeft: 4 },
  specialtiesContainer: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 12 },
  specialtyTag: { backgroundColor: '#F1F5F9', borderRadius: 12, paddingHorizontal: 8, paddingVertical: 4 },
  specialtyText: { fontSize: 12, fontFamily: 'Inter-Medium', color: '#475569' },
  professionalFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', borderTopWidth: 1, borderTopColor: '#F1F5F9', paddingTop: 12, marginTop: 4 },
  price: { fontSize: 16, fontFamily: 'Inter-Bold', color: '#EA580C' },
  contactButton: { backgroundColor: '#2563EB', borderRadius: 8, paddingHorizontal: 16, paddingVertical: 8 },
  contactButtonText: { fontSize: 14, fontFamily: 'Inter-SemiBold', color: '#FFFFFF' },
});