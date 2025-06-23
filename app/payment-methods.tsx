import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowLeft, Plus } from 'lucide-react-native';
import { router } from 'expo-router';

const paymentMethods = [
  { id: '1', type: 'Credit Card', brand: 'visa', last4: '4242' },
  { id: '2', type: 'Credit Card', brand: 'mastercard', last4: '5555' },
];

export default function PaymentMethodsScreen() {
    const getCardLogo = (brand: string) => {
        if (brand === 'visa') return 'https://placehold.co/50x32/1a1a72/ffffff?text=VISA';
        if (brand === 'mastercard') return 'https://placehold.co/50x32/f06400/ffffff?text=MC';
        return 'https://placehold.co/50x32/cccccc/000000?text=Card';
    }

  const renderItem = ({ item }: { item: typeof paymentMethods[0] }) => (
    <View style={styles.card}>
      <Image source={{ uri: getCardLogo(item.brand) }} style={styles.logo} />
      <View>
        <Text style={styles.cardType}>{item.type}</Text>
        <Text style={styles.cardNumber}>**** **** **** {item.last4}</Text>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}><ArrowLeft size={24} color="#1E293B" /></TouchableOpacity>
        <Text style={styles.headerTitle}>Pagamentos</Text>
        <TouchableOpacity><Plus size={24} color="#1E293B" /></TouchableOpacity>
      </View>
      <FlatList
        data={paymentMethods}
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
  card: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFFFFF', padding: 16, borderRadius: 12, borderWidth: 1, borderColor: '#E2E8F0', gap: 16 },
  logo: { width: 50, height: 32, resizeMode: 'contain' },
  cardType: { fontSize: 16, fontFamily: 'Inter-SemiBold', color: '#1E293B' },
  cardNumber: { fontSize: 14, fontFamily: 'Inter-Regular', color: '#64748B' },
});