import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowLeft, Star } from 'lucide-react-native';
import { router } from 'expo-router';

const reviews = [
  { id: '1', professional: 'João Silva', rating: 5, comment: 'Excelente profissional, muito rápido!', date: '12/01/2025' },
  { id: '2', professional: 'Ana Costa', rating: 4, comment: 'Bom serviço, mas atrasou um pouco.', date: '25/12/2024' },
];

export default function MyReviewsScreen() {
    const renderStars = (rating: number) => {
        return Array(5).fill(0).map((_, i) => (
            <Star key={i} size={16} color={i < rating ? "#FFA500" : "#E2E8F0"} fill={i < rating ? "#FFA500" : "transparent"}/>
        ))
    }

  const renderItem = ({ item }: { item: typeof reviews[0] }) => (
    <View style={styles.reviewCard}>
        <View style={styles.reviewHeader}>
            <Text style={styles.professionalName}>{item.professional}</Text>
            <View style={styles.starsContainer}>{renderStars(item.rating)}</View>
        </View>
      <Text style={styles.comment}>{item.comment}</Text>
      <Text style={styles.date}>{item.date}</Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}><ArrowLeft size={24} color="#1E293B" /></TouchableOpacity>
        <Text style={styles.headerTitle}>Minhas Avaliações</Text>
        <View style={{width: 24}}/>
      </View>
      <FlatList
        data={reviews}
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
  reviewCard: { backgroundColor: '#FFFFFF', padding: 16, borderRadius: 12, borderWidth: 1, borderColor: '#E2E8F0' },
  reviewHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  professionalName: { fontSize: 16, fontFamily: 'Inter-Bold', color: '#1E293B' },
  starsContainer: { flexDirection: 'row', gap: 2 },
  comment: { fontSize: 14, fontFamily: 'Inter-Regular', color: '#475569', marginBottom: 8, lineHeight: 20 },
  date: { fontSize: 12, color: '#94A3B8' },
});