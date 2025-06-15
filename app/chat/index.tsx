import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Image,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { router, useLocalSearchParams } from 'expo-router';
import { ArrowLeft, Send, Phone, Video, MoveVertical as MoreVertical, Paperclip, Camera } from 'lucide-react-native';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'professional';
  timestamp: Date;
  type?: 'text' | 'image';
  imageUri?: string;
}

export default function ChatScreen() {
  const { professionalId } = useLocalSearchParams();
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: 'Olá! Vi sua solicitação de montagem de guarda-roupa. Posso ajudar!',
      sender: 'professional',
      timestamp: new Date(Date.now() - 3600000),
    },
    {
      id: '2',
      text: 'Oi! Que bom! Preciso montar um guarda-roupa de 6 portas.',
      sender: 'user',
      timestamp: new Date(Date.now() - 3500000),
    },
    {
      id: '3',
      text: 'Perfeito! Tenho experiência com esse tipo de móvel. Posso ir até aí amanhã às 14h para dar uma olhada e fazer o orçamento.',
      sender: 'professional',
      timestamp: new Date(Date.now() - 3400000),
    },
    {
      id: '4',
      text: 'Excelente! Qual seria o valor aproximado?',
      sender: 'user',
      timestamp: new Date(Date.now() - 3300000),
    },
    {
      id: '5',
      text: 'Para um guarda-roupa de 6 portas, geralmente fica entre R$ 150 a R$ 200, dependendo da complexidade.',
      sender: 'professional',
      timestamp: new Date(Date.now() - 3200000),
    },
  ]);
  
  const scrollViewRef = useRef<ScrollView>(null);

  useEffect(() => {
    // Scroll to bottom when messages change
    setTimeout(() => {
      scrollViewRef.current?.scrollToEnd({ animated: true });
    }, 100);
  }, [messages]);

  const sendMessage = () => {
    if (message.trim()) {
      const newMessage: Message = {
        id: Date.now().toString(),
        text: message.trim(),
        sender: 'user',
        timestamp: new Date(),
      };
      
      setMessages([...messages, newMessage]);
      setMessage('');
      
      // Simulate professional response
      setTimeout(() => {
        const response: Message = {
          id: (Date.now() + 1).toString(),
          text: 'Recebi sua mensagem! Vou responder em instantes.',
          sender: 'professional',
          timestamp: new Date(),
        };
        setMessages(prev => [...prev, response]);
      }, 2000);
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('pt-BR', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const renderMessage = (msg: Message) => {
    const isUser = msg.sender === 'user';
    
    return (
      <View
        key={msg.id}
        style={[
          styles.messageContainer,
          isUser ? styles.userMessage : styles.professionalMessage
        ]}
      >
        <View style={[
          styles.messageBubble,
          isUser ? styles.userBubble : styles.professionalBubble
        ]}>
          <Text style={[
            styles.messageText,
            isUser ? styles.userMessageText : styles.professionalMessageText
          ]}>
            {msg.text}
          </Text>
          <Text style={[
            styles.messageTime,
            isUser ? styles.userMessageTime : styles.professionalMessageTime
          ]}>
            {formatTime(msg.timestamp)}
          </Text>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />
      
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <ArrowLeft size={24} color="#1E293B" />
        </TouchableOpacity>
        
        <View style={styles.professionalInfo}>
          <Image
            source={{
              uri: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2'
            }}
            style={styles.avatar}
          />
          <View style={styles.professionalDetails}>
            <Text style={styles.professionalName}>{professionalId}</Text>
            <Text style={styles.onlineStatus}>Online</Text>
          </View>
        </View>
        
        <View style={styles.headerActions}>
          <TouchableOpacity style={styles.headerButton}>
            <Phone size={20} color="#64748B" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.headerButton}>
            <Video size={20} color="#64748B" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.headerButton}>
            <MoreVertical size={20} color="#64748B" />
          </TouchableOpacity>
        </View>
      </View>

      <KeyboardAvoidingView
        style={styles.chatContainer}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView
          ref={scrollViewRef}
          style={styles.messagesContainer}
          contentContainerStyle={styles.messagesContent}
          showsVerticalScrollIndicator={false}
        >
          {messages.map(renderMessage)}
        </ScrollView>

        <View style={styles.inputContainer}>
          <TouchableOpacity style={styles.attachButton}>
            <Paperclip size={20} color="#64748B" />
          </TouchableOpacity>
          
          <TextInput
            style={styles.textInput}
            placeholder="Digite sua mensagem..."
            value={message}
            onChangeText={setMessage}
            multiline
            maxLength={1000}
          />
          
          <TouchableOpacity style={styles.cameraButton}>
            <Camera size={20} color="#64748B" />
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[
              styles.sendButton,
              message.trim() ? styles.sendButtonActive : styles.sendButtonInactive
            ]}
            onPress={sendMessage}
            disabled={!message.trim()}
          >
            <Send size={18} color={message.trim() ? "#FFFFFF" : "#94A3B8"} />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
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
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
    backgroundColor: '#FFFFFF',
  },
  professionalInfo: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 16,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
  },
  professionalDetails: {
    flex: 1,
  },
  professionalName: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#1E293B',
  },
  onlineStatus: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#10B981',
  },
  headerActions: {
    flexDirection: 'row',
    gap: 8,
  },
  headerButton: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: '#F8FAFC',
  },
  chatContainer: {
    flex: 1,
  },
  messagesContainer: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  messagesContent: {
    padding: 16,
    paddingBottom: 8,
  },
  messageContainer: {
    marginBottom: 12,
    maxWidth: '80%',
  },
  userMessage: {
    alignSelf: 'flex-end',
  },
  professionalMessage: {
    alignSelf: 'flex-start',
  },
  messageBubble: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 18,
  },
  userBubble: {
    backgroundColor: '#2563EB',
    borderBottomRightRadius: 4,
  },
  professionalBubble: {
    backgroundColor: '#FFFFFF',
    borderBottomLeftRadius: 4,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  messageText: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    lineHeight: 20,
    marginBottom: 4,
  },
  userMessageText: {
    color: '#FFFFFF',
  },
  professionalMessageText: {
    color: '#1E293B',
  },
  messageTime: {
    fontSize: 11,
    fontFamily: 'Inter-Regular',
  },
  userMessageTime: {
    color: '#DBEAFE',
    textAlign: 'right',
  },
  professionalMessageTime: {
    color: '#94A3B8',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
    gap: 8,
  },
  attachButton: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: '#F8FAFC',
  },
  textInput: {
    flex: 1,
    backgroundColor: '#F8FAFC',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 10,
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#1E293B',
    maxHeight: 100,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  cameraButton: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: '#F8FAFC',
  },
  sendButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sendButtonActive: {
    backgroundColor: '#2563EB',
  },
  sendButtonInactive: {
    backgroundColor: '#F1F5F9',
  },
});