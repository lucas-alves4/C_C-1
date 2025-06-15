import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Image,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { router } from 'expo-router';
import * as Location from 'expo-location';
import {
  Search,
  MapPin,
  Star,
  Clock,
  Filter,
  Plus,
} from 'lucide-react-native';

const { width } = Dimensions.get('window');

interface Professional {
  id: string;
  name: string;
  rating: number;
  reviewCount: number;
  distance: string;
  price: string;
  specialties: string[];
  avatar: string;
  verified: boolean;
  responseTime: string;
}

export default function HomeScreen() {
  const [location, setLocation] = useState<string>('Carregando...');
  const [searchQuery, setSearchQuery] = useState('');
  const [professionals, setProfessionals] = useState<Professional[]>([
    {
      id: '1',
      name: 'João Silva',
      rating: 4.9,
      reviewCount: 127,
      distance: '2.3 km',
      price: 'R$ 80-120/h',
      specialties: ['Móveis', 'Estantes', 'Guarda-roupas'],
      avatar: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2',
      verified: true,
      responseTime: '10 min',
    },
    {
      id: '2',
      name: 'Maria Santos',
      rating: 4.8,
      reviewCount: 89,
      distance: '1.8 km',
      price: 'R$ 70-100/h',
      specialties: ['Cozinhas', 'Banheiros', 'Móveis Planejados'],
      avatar: 'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2',
      verified: true,
      responseTime: '5 min',
    },
    {
      id: '3',
      name: 'Carlos Oliveira',
      rating: 4.7,
      reviewCount: 156,
      distance: '3.1 km',
      price: 'R$ 90-150/h',
      specialties: ['Móveis Corporativos', 'Escritórios'],
      avatar: 'https://images.pexels.com/photos/697509/pexels-photo-697509.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2',
      verified: true,
      responseTime: '15 min',
    },
  ]);

  useEffect(() => {
    getCurrentLocation();
  }, []);

  const getCurrentLocation = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setLocation('Localização não permitida');
        return;
      }

      const currentLocation = await Location.getCurrentPositionAsync({});
      const address = await Location.reverseGeocodeAsync({
        latitude: currentLocation.coords.latitude,
        longitude: currentLocation.coords.longitude,
      });

      if (address[0]) {
        setLocation(`${address[0].city}, ${address[0].region}`);
      }
    } catch (error) {
      setLocation('Erro ao obter localização');
    }
  };

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
              <View style={styles.verifiedBadge}>
                <Text style={styles.verifiedText}>✓</Text>
              </View>
            )}
          </View>
          <View style={styles.ratingContainer}>
            <Star size={14} color="#FFA500" fill="#FFA500" />
            <Text style={styles.rating}>{professional.rating}</Text>
            <Text style={styles.reviewCount}>({professional.reviewCount})</Text>
          </View>
          <View style={styles.locationContainer}>
            <MapPin size={12} color="#64748B" />
            <Text style={styles.distance}>{professional.distance}</Text>
            <Clock size={12} color="#64748B" />
            <Text style={styles.responseTime}>Responde em {professional.responseTime}</Text>
          </View>
        </View>
      </View>
      
      <View style={styles.specialtiesContainer}>
        {professional.specialties.map((specialty, index) => (
          <View key={index} style={styles.specialtyTag}>
            <Text style={styles.specialtyText}>{specialty}</Text>
          </View>
        ))}
      </View>
      
      <View style={styles.professionalFooter}>
        <Text style={styles.price}>{professional.price}</Text>
        <TouchableOpacity style={styles.contactButton}>
          <Text style={styles.contactButtonText}>Solicitar Orçamento</Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />
      
      <View style={styles.header}>
        <View style={styles.locationContainer}>
          <MapPin size={20} color="#2563EB" />
          <Text style={styles.locationText}>{location}</Text>
        </View>
        
        <TouchableOpacity style={styles.filterButton}>
          <Filter size={20} color="#64748B" />
        </TouchableOpacity>
      </View>

      <View style={styles.searchContainer}>
        <View style={styles.searchInputContainer}>
          <Search size={20} color="#64748B" />
          <TextInput
            style={styles.searchInput}
            placeholder="Buscar profissionais ou serviços..."
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.quickActions}>
          <TouchableOpacity 
            style={styles.quickActionButton}
            onPress={() => router.push('/service-request')}
          >
            <View style={styles.quickActionIcon}>
              <Plus size={24} color="#2563EB" />
            </View>
            <Text style={styles.quickActionText}>Solicitar Serviço</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Profissionais Próximos</Text>
          <Text style={styles.sectionSubtitle}>
            {professionals.length} profissionais disponíveis
          </Text>
        </View>

        <View style={styles.professionalsContainer}>
          {professionals.map(renderProfessionalCard)}
        </View>

        <View style={styles.featuredSection}>
          <Text style={styles.sectionTitle}>Serviços em Destaque</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View style={styles.featuredCard}>
              <Image
                source={{
                  uri: 'https://images.pexels.com/photos/6474471/pexels-photo-6474471.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&dpr=2'
                }}
                style={styles.featuredImage}
              />
              <Text style={styles.featuredTitle}>Montagem de Móveis</Text>
              <Text style={styles.featuredDescription}>
                Profissionais especializados em montagem
              </Text>
            </View>
            
            <View style={styles.featuredCard}>
              <Image
                source={{
                  uri: 'https://images.pexels.com/photos/6474472/pexels-photo-6474472.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&dpr=2'
                }}
                style={styles.featuredImage}
              />
              <Text style={styles.featuredTitle}>Instalação de Prateleiras</Text>
              <Text style={styles.featuredDescription}>
                Instalação segura e profissional
              </Text>
            </View>
          </ScrollView>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  locationText: {
    fontSize: 16,
    fontFamily: 'Inter-Medium',
    color: '#1E293B',
  },
  filterButton: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: '#F8FAFC',
  },
  searchContainer: {
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  searchInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 4,
    gap: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#1E293B',
    paddingVertical: 12,
  },
  content: {
    flex: 1,
  },
  quickActions: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  quickActionButton: {
    backgroundColor: '#F0F7FF',
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E0F2FE',
  },
  quickActionIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  quickActionText: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#2563EB',
  },
  sectionHeader: {
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontFamily: 'Inter-Bold',
    color: '#1E293B',
    marginBottom: 4,
  },
  sectionSubtitle: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#64748B',
  },
  professionalsContainer: {
    paddingHorizontal: 20,
    gap: 16,
  },
  professionalCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  professionalHeader: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 12,
  },
  professionalInfo: {
    flex: 1,
  },
  nameContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  professionalName: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#1E293B',
    marginRight: 8,
  },
  verifiedBadge: {
    backgroundColor: '#10B981',
    borderRadius: 10,
    width: 20,
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  verifiedText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontFamily: 'Inter-Bold',
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
    gap: 4,
  },
  rating: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#1E293B',
  },
  reviewCount: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#64748B',
  },
  distance: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#64748B',
    marginLeft: 4,
  },
  responseTime: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#64748B',
    marginLeft: 4,
  },
  specialtiesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 12,
  },
  specialtyTag: {
    backgroundColor: '#F1F5F9',
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  specialtyText: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    color: '#475569',
  },
  professionalFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  price: {
    fontSize: 16,
    fontFamily: 'Inter-Bold',
    color: '#EA580C',
  },
  contactButton: {
    backgroundColor: '#2563EB',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  contactButtonText: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#FFFFFF',
  },
  featuredSection: {
    marginTop: 32,
    paddingBottom: 32,
  },
  featuredCard: {
    width: width * 0.7,
    marginLeft: 20,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  featuredImage: {
    width: '100%',
    height: 120,
  },
  featuredTitle: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#1E293B',
    padding: 16,
    paddingBottom: 4,
  },
  featuredDescription: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#64748B',
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
});