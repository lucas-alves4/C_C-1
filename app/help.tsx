import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Linking } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowLeft, ChevronRight, MessageSquare, Phone } from 'lucide-react-native';
import { router } from 'expo-router';

export default function HelpScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}><ArrowLeft size={24} color="#1E293B" /></TouchableOpacity>
        <Text style={styles.headerTitle}>Ajuda e Suporte</Text>
        <View style={{width: 24}}/>
      </View>
      <ScrollView style={styles.content}>
        <Text style={styles.sectionTitle}>Entre em Contato</Text>
        <View style={styles.menuSection}>
            <TouchableOpacity style={styles.menuItem} onPress={() => Linking.openURL('tel:+5511999999999')}>
                <View style={styles.menuItemLeft}><Phone size={20} color="#64748B" /><Text style={styles.menuItemTitle}>Ligar para Suporte</Text></View>
                <ChevronRight size={20} color="#CBD5E1" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.menuItem}>
                <View style={styles.menuItemLeft}><MessageSquare size={20} color="#64748B" /><Text style={styles.menuItemTitle}>Chat de Suporte</Text></View>
                <ChevronRight size={20} color="#CBD5E1" />
            </TouchableOpacity>
        </View>

        <Text style={styles.sectionTitle}>Perguntas Frequentes</Text>
        <View style={styles.menuSection}>
            <TouchableOpacity style={styles.menuItem}><Text style={styles.menuItemTitle}>Como funciona o pagamento?</Text><ChevronRight size={20} color="#CBD5E1" /></TouchableOpacity>
            <TouchableOpacity style={styles.menuItem}><Text style={styles.menuItemTitle}>Como cancelar um serviço?</Text><ChevronRight size={20} color="#CBD5E1" /></TouchableOpacity>
            <TouchableOpacity style={styles.menuItem}><Text style={styles.menuItemTitle}>A plataforma é segura?</Text><ChevronRight size={20} color="#CBD5E1" /></TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#F8FAFC' },
    header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingVertical: 16, backgroundColor: '#FFFFFF', borderBottomWidth: 1, borderBottomColor: '#F1F5F9' },
    headerTitle: { fontSize: 18, fontFamily: 'Inter-SemiBold', color: '#1E293B' },
    content: { flex: 1 },
    sectionTitle: { fontSize: 14, fontFamily: 'Inter-SemiBold', color: '#64748B', paddingHorizontal: 20, paddingTop: 24, paddingBottom: 8 },
    menuSection: { backgroundColor: '#FFFFFF' },
    menuItem: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingVertical: 16, borderBottomWidth: 1, borderBottomColor: '#F1F5F9' },
    menuItemLeft: { flexDirection: 'row', alignItems: 'center', gap: 12 },
    menuItemTitle: { fontSize: 16, fontFamily: 'Inter-Medium', color: '#1E293B' },
});