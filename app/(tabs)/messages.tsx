import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { router } from 'expo-router';
import { Search, MessageCircle, Check, CheckCheck } from 'lucide-react-native';

interface Message {
  id: string;
  professional: {
    name: string;
    avatar: string;
    online: boolean;
  };
  lastMessage: string;
  timestamp: string;
  unreadCount: number;
  status: 'sent' | 'delivered' | 'read';
}

export default function MessagesScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  
  const messages: Message[] = [
    {
      id: '1',
      professional: {
        name: 'João Silva',
        avatar: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2',
        online: true,
      },
      lastMessage: 'Posso chegar às 14h, tudo bem?',
      timestamp: '10:30',
      unreadCount: 2,
      status: 'delivered',
    },
    {
      id: '2',
      professional: {
        name: 'Maria Santos',
        avatar: 'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2',
        online: false,
      },
      lastMessage: 'Obrigada pela oportunidade!',
      timestamp: 'Ontem',
      unreadCount: 0,
      status: 'read',
    },
    {
      id: '3',
      professional: {
        name: 'Carlos Oliveira',
        avatar: 'https://images.pexels.com/photos/697509/pexels-photo-697509.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2',
        online: true,
      },
      lastMessage: 'Vou enviar o orçamento em instantes',
      timestamp: '08:45',
      unreadCount: 1,
      status: 'sent',
    },
    {
      id: '4',
      professional: {
        name: 'Ana Costa',
        avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2',
        online: false,
      },
      lastMessage: 'Perfeito! Até amanhã então.',
      timestamp: '2 dias',
      unreadCount: 0,
      status: 'read',
    },
  ];

  const filteredMessages = messages.filter(message =>
    message.professional.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getStatusIcon = (status: Message['status']) => {
    switch (status) {
      case 'sent':
        return <Check size={16} color="#64748B" />;
      case 'delivered':
        return <CheckCheck size={16} color="#64748B" />;
      case 'read':
        return <CheckCheck size={16} color="#2563EB" />;
      default:
        return null;
    }
  };

  const renderMessageItem = (message: Message) => (
    <TouchableOpacity
      key={message.id}
      style={styles.messageItem}
      onPress={() => router.push(`/chat?professionalId=${message.professional.name}`)}
    >
      <View style={styles.avatarContainer}>
        <Image source={{ uri: message.professional.avatar }} style={styles.avatar} />
        {message.professional.online && <View style={styles.onlineIndicator} />}
      </View>
      
      <View style={styles.messageContent}>
        <View style={styles.messageHeader}>
          <Text style={styles.professionalName}>{message.professional.name}</Text>
          <View style={styles.messageTimestamp}>
            {getStatusIcon(message.status)}
            <Text style={styles.timestamp}>{message.timestamp}</Text>
          </View>
        </View>
        
        <View style={styles.messagePreview}>
          <Text style={[
            styles.lastMessage,
            message.unreadCount > 0 && styles.unreadMessage
          ]}>
            {message.lastMessage}
          </Text>
          {message.unreadCount > 0 && (
            <View style={styles.unreadBadge}>
              <Text style={styles.unreadCount}>{message.unreadCount}</Text>
            </View>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />
      
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Mensagens</Text>
      </View>

      <View style={styles.searchContainer}>
        <View style={styles.searchInputContainer}>
          <Search size={20} color="#64748B" />
          <TextInput
            style={styles.searchInput}
            placeholder="Buscar conversas..."
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {filteredMessages.length > 0 ? (
          <View style={styles.messagesContainer}>
            {filteredMessages.map(renderMessageItem)}
          </View>
        ) : (
          <View style={styles.emptyState}>
            <MessageCircle size={48} color="#CBD5E1" />
            <Text style={styles.emptyTitle}>
              {searchQuery ? 'Nenhuma conversa encontrada' : 'Nenhuma mensagem'}
            </Text>
            <Text style={styles.emptyDescription}>
              {searchQuery 
                ? 'Tente buscar por outro nome'
                : 'Suas conversas com profissionais aparecerão aqui'
              }
            </Text>
          </View>
        )}
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
  messagesContainer: {
    paddingHorizontal: 20,
  },
  messageItem: {
    flexDirection: 'row',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  avatarContainer: {
    position: 'relative',
    marginRight: 12,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  onlineIndicator: {
    position: 'absolute',
    bottom: 2,
    right: 2,
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: '#10B981',
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  messageContent: {
    flex: 1,
  },
  messageHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  professionalName: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#1E293B',
  },
  messageTimestamp: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  timestamp: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#64748B',
  },
  messagePreview: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  lastMessage: {
    flex: 1,
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#64748B',
    marginRight: 8,
  },
  unreadMessage: {
    color: '#1E293B',
    fontFamily: 'Inter-Medium',
  },
  unreadBadge: {
    backgroundColor: '#2563EB',
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 6,
  },
  unreadCount: {
    fontSize: 12,
    fontFamily: 'Inter-Bold',
    color: '#FFFFFF',
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 60,
    paddingHorizontal: 40,
  },
  emptyTitle: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    color: '#1E293B',
    marginTop: 16,
    marginBottom: 8,
    textAlign: 'center',
  },
  emptyDescription: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#64748B',
    textAlign: 'center',
  },
});