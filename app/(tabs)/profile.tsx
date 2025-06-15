import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Switch,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { router } from 'expo-router';
import { User, Settings, Bell, MapPin, Star, CreditCard, CircleHelp as HelpCircle, Shield, LogOut, ChevronRight, CreditCard as Edit } from 'lucide-react-native';

export default function ProfileScreen() {
  const [notificationsEnabled, setNotificationsEnabled] = React.useState(true);

  const menuItems = [
    {
      id: 'edit-profile',
      title: 'Editar Perfil',
      icon: Edit,
      onPress: () => router.push('/edit-profile'),
    },
    {
      id: 'addresses',
      title: 'Meus Endereços',
      icon: MapPin,
      onPress: () => router.push('/addresses'),
    },
    {
      id: 'payment',
      title: 'Métodos de Pagamento',
      icon: CreditCard,
      onPress: () => router.push('/payment-methods'),
    },
    {
      id: 'reviews',
      title: 'Minhas Avaliações',
      icon: Star,
      onPress: () => router.push('/my-reviews'),
    },
    {
      id: 'settings',
      title: 'Configurações',
      icon: Settings,
      onPress: () => router.push('/settings'),
    },
    {
      id: 'help',
      title: 'Ajuda e Suporte',
      icon: HelpCircle,
      onPress: () => router.push('/help'),
    },
    {
      id: 'privacy',
      title: 'Privacidade',
      icon: Shield,
      onPress: () => router.push('/privacy'),
    },
  ];

  const renderMenuItem = (item: any) => (
    <TouchableOpacity
      key={item.id}
      style={styles.menuItem}
      onPress={item.onPress}
    >
      <View style={styles.menuItemLeft}>
        <View style={styles.menuItemIcon}>
          <item.icon size={20} color="#64748B" />
        </View>
        <Text style={styles.menuItemTitle}>{item.title}</Text>
      </View>
      <ChevronRight size={20} color="#64748B" />
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />
      
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Perfil</Text>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.profileSection}>
          <View style={styles.avatarContainer}>
            <Image
              source={{
                uri: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2'
              }}
              style={styles.avatar}
            />
            <TouchableOpacity style={styles.editAvatarButton}>
              <Edit size={16} color="#FFFFFF" />
            </TouchableOpacity>
          </View>
          
          <Text style={styles.userName}>Maria Silva</Text>
          <Text style={styles.userEmail}>maria.silva@email.com</Text>
          <Text style={styles.userLocation}>São Paulo, SP</Text>
          
          <View style={styles.statsContainer}>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>12</Text>
              <Text style={styles.statLabel}>Serviços</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>4.8</Text>
              <Text style={styles.statLabel}>Avaliação</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>8</Text>
              <Text style={styles.statLabel}>Reviews</Text>
            </View>
          </View>
        </View>

        <View style={styles.notificationSection}>
          <View style={styles.menuItem}>
            <View style={styles.menuItemLeft}>
              <View style={styles.menuItemIcon}>
                <Bell size={20} color="#64748B" />
              </View>
              <Text style={styles.menuItemTitle}>Notificações</Text>
            </View>
            <Switch
              value={notificationsEnabled}
              onValueChange={setNotificationsEnabled}
              trackColor={{ false: '#E2E8F0', true: '#93C5FD' }}
              thumbColor={notificationsEnabled ? '#2563EB' : '#CBD5E1'}
            />
          </View>
        </View>

        <View style={styles.menuSection}>
          {menuItems.map(renderMenuItem)}
        </View>

        <View style={styles.logoutSection}>
          <TouchableOpacity
            style={styles.logoutButton}
            onPress={() => router.replace('/auth')}
          >
            <LogOut size={20} color="#EF4444" />
            <Text style={styles.logoutText}>Sair da Conta</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.versionSection}>
          <Text style={styles.versionText}>Versão 1.0.0</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  header: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  headerTitle: {
    fontSize: 24,
    fontFamily: 'Inter-Bold',
    color: '#1E293B',
  },
  content: {
    flex: 1,
  },
  profileSection: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 20,
    paddingVertical: 32,
    alignItems: 'center',
    marginBottom: 12,
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: 16,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  editAvatarButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#2563EB',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: '#FFFFFF',
  },
  userName: {
    fontSize: 24,
    fontFamily: 'Inter-Bold',
    color: '#1E293B',
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#64748B',
    marginBottom: 2,
  },
  userLocation: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#64748B',
    marginBottom: 24,
  },
  statsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 24,
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statNumber: {
    fontSize: 20,
    fontFamily: 'Inter-Bold',
    color: '#1E293B',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#64748B',
  },
  statDivider: {
    width: 1,
    height: 40,
    backgroundColor: '#E2E8F0',
    marginHorizontal: 16,
  },
  notificationSection: {
    backgroundColor: '#FFFFFF',
    marginBottom: 12,
  },
  menuSection: {
    backgroundColor: '#FFFFFF',
    marginBottom: 12,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  menuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  menuItemIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F8FAFC',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  menuItemTitle: {
    fontSize: 16,
    fontFamily: 'Inter-Medium',
    color: '#1E293B',
  },
  logoutSection: {
    backgroundColor: '#FFFFFF',
    marginBottom: 12,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    gap: 12,
  },
  logoutText: {
    fontSize: 16,
    fontFamily: 'Inter-Medium',
    color: '#EF4444',
  },
  versionSection: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  versionText: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#94A3B8',
  },
});