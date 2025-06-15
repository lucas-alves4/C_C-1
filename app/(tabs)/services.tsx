import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { router } from 'expo-router';
import { Calendar, Clock, MapPin, Star, MessageSquare, MoveVertical as MoreVertical, CircleCheck as CheckCircle, CircleAlert as AlertCircle } from 'lucide-react-native';

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
  
  const services: Service[] = [
    {
      id: '1',
      title: 'Montagem de Guarda-roupa',
      professional: {
        name: 'João Silva',
        avatar: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2',
        rating: 4.9,
      },
      date: '15 Jan',
      time: '14:00',
      location: 'Rua das Flores, 123',
      status: 'confirmed',
      price: 'R$ 120',
      image: 'https://images.pexels.com/photos/6474471/pexels-photo-6474471.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&dpr=2',
    },
    {
      id: '2',
      title: 'Instalação de Prateleiras',
      professional: {
        name: 'Maria Santos',
        avatar: 'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2',
        rating: 4.8,
      },
      date: '18 Jan',
      time: '09:00',
      location: 'Av. Central, 456',
      status: 'pending',
      price: 'R$ 80',
    },
    {
      id: '3',
      title: 'Montagem de Mesa de Escritório',
      professional: {
        name: 'Carlos Oliveira',
        avatar: 'https://images.pexels.com/photos/697509/pexels-photo-697509.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2',
        rating: 4.7,
      },
      date: '12 Jan',
      time: '16:00',
      location: 'Rua do Comércio, 789',
      status: 'completed',
      price: 'R$ 100',
    },
  ];

  const getStatusColor = (status: Service['status']) => {
    switch (status) {
      case 'confirmed':
        return '#10B981';
      case 'pending':
        return '#F59E0B';
      case 'completed':
        return '#2563EB';
      case 'cancelled':
        return '#EF4444';
      default:
        return '#64748B';
    }
  };

  const getStatusText = (status: Service['status']) => {
    switch (status) {
      case 'confirmed':
        return 'Confirmado';
      case 'pending':
        return 'Pendente';
      case 'completed':
        return 'Concluído';
      case 'cancelled':
        return 'Cancelado';
      default:
        return status;
    }
  };

  const getStatusIcon = (status: Service['status']) => {
    switch (status) {
      case 'confirmed':
        return <CheckCircle size={16} color="#10B981" />;
      case 'pending':
        return <Clock size={16} color="#F59E0B" />;
      case 'completed':
        return <CheckCircle size={16} color="#2563EB" />;
      case 'cancelled':
        return <AlertCircle size={16} color="#EF4444" />;
      default:
        return <Clock size={16} color="#64748B" />;
    }
  };

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
          <View style={styles.statusContainer}>
            {getStatusIcon(service.status)}
            <Text style={[styles.statusText, { color: getStatusColor(service.status) }]}>
              {getStatusText(service.status)}
            </Text>
          </View>
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
            <Text style={styles.rating}>{service.professional.rating}</Text>
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
        <Text style={styles.price}>{service.price}</Text>
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
        <TouchableOpacity
          style={[styles.tab, activeTab === 'active' && styles.activeTab]}
          onPress={() => setActiveTab('active')}
        >
          <Text style={[styles.tabText, activeTab === 'active' && styles.activeTabText]}>
            Ativos
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'history' && styles.activeTab]}
          onPress={() => setActiveTab('history')}
        >
          <Text style={[styles.tabText, activeTab === 'history' && styles.activeTabText]}>
            Histórico
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.servicesContainer}>
          {activeTab === 'active' ? (
            activeServices.length > 0 ? (
              activeServices.map(renderServiceCard)
            ) : (
              <View style={styles.emptyState}>
                <Calendar size={48} color="#CBD5E1" />
                <Text style={styles.emptyTitle}>Nenhum serviço ativo</Text>
                <Text style={styles.emptyDescription}>
                  Solicite um novo serviço para começar
                </Text>
                <TouchableOpacity 
                  style={styles.newServiceButton}
                  onPress={() => router.push('/service-request')}
                >
                  <Text style={styles.newServiceButtonText}>Solicitar Serviço</Text>
                </TouchableOpacity>
              </View>
            )
          ) : (
            historyServices.length > 0 ? (
              historyServices.map(renderServiceCard)
            ) : (
              <View style={styles.emptyState}>
                <Clock size={48} color="#CBD5E1" />
                <Text style={styles.emptyTitle}>Nenhum histórico</Text>
                <Text style={styles.emptyDescription}>
                  Seus serviços concluídos aparecerão aqui
                </Text>
              </View>
            )
          )}
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