import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowLeft, Plus } from 'lucide-react-native';
import { router } from 'expo-router';

const addresses = [
  { id: '1', name: 'Casa', address: 'Rua das Flores, 123, Centro', city: 'São Paulo, SP' },
  { id: '2', name: 'Trabalho', address: 'Av. Paulista, 1000, Bela Vista', city: 'São Paulo, SP' },
];

export default function AddressesScreen() {
  const renderItem = ({ item }: { item: typeof addresses[0] }) => (
    <View style={styles.addressCard}>
      <Text style={styles.cardName}>{item.name}</Text>
      <Text style={styles.cardAddress}>{item.address}</Text>
      <Text style={styles.cardCity}>{item.city}</Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}><ArrowLeft size={24} color="#1E293B" /></TouchableOpacity>
        <Text style={styles.headerTitle}>Meus Endereços</Text>
        <TouchableOpacity><Plus size={24} color="#1E293B" /></TouchableOpacity>
      </View>
      <FlatList
        data={addresses}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.list}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8FAFC' },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingVertical: 16, backgroundColor: '#FFFFFF', borderBottomWidth: 1, borderBottomColor: '#F1F5F9' },
  headerTitle: { fontSize: 18, fontFamily: 'Inter-SemiBold', color: '#1E293B' },
  list: { padding: 20, gap: 16 },
  addressCard: { backgroundColor: '#FFFFFF', padding: 16, borderRadius: 12, borderWidth: 1, borderColor: '#E2E8F0' },
  cardName: { fontSize: 16, fontFamily: 'Inter-Bold', color: '#1E293B', marginBottom: 4 },
  cardAddress: { fontSize: 14, fontFamily: 'Inter-Regular', color: '#475569' },
  cardCity: { fontSize: 14, fontFamily: 'Inter-Regular', color: '#64748B', marginTop: 2 },
});