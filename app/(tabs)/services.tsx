import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { router, useFocusEffect } from 'expo-router';
import { Calendar, Clock, MapPin, Star, MessageSquare, MoreVertical, CheckCircle, AlertCircle } from 'lucide-react-native';

const API_URL = 'http://localhost:3000/api';

interface Service {
  id: string;
  title: string;
  professional: {
    name: string;
    avatar: string;
    rating: number;
  };
  date: string;
  time: string;
  location: string;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  price: string;
  image?: string;
}

export default function ServicesScreen() {
  const [activeTab, setActiveTab] = useState<'active' | 'history'>('active');
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  
  const fetchServices = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/services`);
      const data = await response.json();
      setServices(data);
    } catch (error) {
      console.error("Erro ao buscar serviços:", error);
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      fetchServices();
    }, [])
  );

  const getStatusColor = (status: Service['status']) => { /* ... (mesma função) ... */ };
  const getStatusText = (status: Service['status']) => { /* ... (mesma função) ... */ };
  const getStatusIcon = (status: Service['status']) => { /* ... (mesma função) ... */ };
  
  const activeServices = services.filter(s => s.status === 'pending' || s.status === 'confirmed');
  const historyServices = services.filter(s => s.status === 'completed' || s.status === 'cancelled');

  const renderServiceCard = (service: Service) => (
    <TouchableOpacity
      key={service.id}
      style={styles.serviceCard}
      onPress={() => router.push(`/service-details?id=${service.id}`)}
    >
      <View style={styles.serviceHeader}>
        <View style={styles.serviceInfo}>
          <Text style={styles.serviceTitle}>{service.title}</Text>
          {/* ... (resto do card) ... */}
        </View>
        <TouchableOpacity style={styles.moreButton}>
          <MoreVertical size={20} color="#64748B" />
        </TouchableOpacity>
      </View>

      {service.image && (
        <Image source={{ uri: service.image }} style={styles.serviceImage} />
      )}

      <View style={styles.professionalInfo}>
        <Image source={{ uri: service.professional.avatar }} style={styles.professionalAvatar} />
        <View style={styles.professionalDetails}>
          <Text style={styles.professionalName}>{service.professional.name}</Text>
          <View style={styles.ratingContainer}>
            <Star size={14} color="#FFA500" fill="#FFA500" />
            <Text style={styles.rating}>{service.professional.rating?.toFixed(1) || 'N/A'}</Text>
          </View>
        </View>
      </View>

      <View style={styles.serviceDetails}>
        <View style={styles.detailRow}>
          <Calendar size={16} color="#64748B" />
          <Text style={styles.detailText}>{service.date} às {service.time}</Text>
        </View>
        <View style={styles.detailRow}>
          <MapPin size={16} color="#64748B" />
          <Text style={styles.detailText}>{service.location}</Text>
        </View>
      </View>
      
      <View style={styles.serviceFooter}>
        <Text style={styles.price}>R$ {service.price.toFixed(2)}</Text>
        <View style={styles.actionButtons}>
          <TouchableOpacity 
            style={styles.messageButton}
            onPress={() => router.push(`/chat?professionalId=${service.professional.name}`)}
          >
            <MessageSquare size={16} color="#2563EB" />
          </TouchableOpacity>
          {service.status === 'completed' && (
            <TouchableOpacity 
              style={styles.reviewButton}
              onPress={() => router.push(`/review?serviceId=${service.id}`)}
            >
              <Text style={styles.reviewButtonText}>Avaliar</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Meus Serviços</Text>
      </View>
      <View style={styles.tabContainer}>
        {/* ... (Tabs) ... */}
      </View>
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {loading ? <ActivityIndicator style={{marginTop: 50}} size="large" color="#2563EB" /> :
        <View style={styles.servicesContainer}>
          {activeTab === 'active' ? (
            activeServices.length > 0 ? (
              activeServices.map(renderServiceCard)
            ) : (
              <View style={styles.emptyState}>
                <Calendar size={48} color="#CBD5E1" />
                <Text style={styles.emptyTitle}>Nenhum serviço ativo</Text>
              </View>
            )
          ) : (
            historyServices.length > 0 ? (
              historyServices.map(renderServiceCard)
            ) : (
              <View style={styles.emptyState}>
                <Clock size={48} color="#CBD5E1" />
                <Text style={styles.emptyTitle}>Nenhum histórico</Text>
              </View>
            )
          )}
        </View>}
      </ScrollView>
    </SafeAreaView>
  );
}

// OS ESTILOS PERMANECEM OS MESMOS
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  headerTitle: {
    fontSize: 24,
    fontFamily: 'Inter-Bold',
    color: '#1E293B',
  },
  tabContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 16,
    gap: 8,
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderRadius: 12,
    backgroundColor: '#F8FAFC',
  },
  activeTab: {
    backgroundColor: '#2563EB',
  },
  tabText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#64748B',
  },
  activeTabText: {
    color: '#FFFFFF',
  },
  content: {
    flex: 1,
  },
  servicesContainer: {
    padding: 20,
    gap: 16,
  },
  serviceCard: {
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
  serviceHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  serviceInfo: {
    flex: 1,
  },
  serviceTitle: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#1E293B',
    marginBottom: 4,
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  statusText: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
  },
  moreButton: {
    padding: 4,
  },
  serviceImage: {
    width: '100%',
    height: 120,
    borderRadius: 12,
    marginBottom: 12,
  },
  professionalInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  professionalAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
  },
  professionalDetails: {
    flex: 1,
  },
  professionalName: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#1E293B',
    marginBottom: 2,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  rating: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#64748B',
  },
  serviceDetails: {
    gap: 8,
    marginBottom: 12,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  detailText: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#64748B',
  },
  serviceFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  price: {
    fontSize: 16,
    fontFamily: 'Inter-Bold',
    color: '#EA580C',
  },
  actionButtons: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  messageButton: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: '#F0F7FF',
  },
  reviewButton: {
    backgroundColor: '#2563EB',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  reviewButtonText: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    color: '#FFFFFF',
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyTitle: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    color: '#1E293B',
    marginTop: 16,
    marginBottom: 8,
  },
  emptyDescription: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#64748B',
    textAlign: 'center',
    marginBottom: 24,
  },
  newServiceButton: {
    backgroundColor: '#2563EB',
    borderRadius: 12,
    paddingHorizontal: 24,
    paddingVertical: 12,
  },
  newServiceButtonText: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#FFFFFF',
  },
});