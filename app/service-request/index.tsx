import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Image,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { router } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import * as Location from 'expo-location';
import {
  ArrowLeft,
  Camera,
  MapPin,
  Calendar,
  Clock,
  FileText,
  Upload,
  X,
} from 'lucide-react-native';

interface ServiceImage {
  id: string;
  uri: string;
}

export default function ServiceRequestScreen() {
  const [serviceType, setServiceType] = useState('');
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('');
  const [preferredDate, setPreferredDate] = useState('');
  const [preferredTime, setPreferredTime] = useState('');
  const [budget, setBudget] = useState('');
  const [images, setImages] = useState<ServiceImage[]>([]);

  const serviceTypes = [
    'Montagem de Móveis',
    'Instalação de Prateleiras',
    'Montagem de Cozinha',
    'Montagem de Guarda-roupa',
    'Montagem de Mesa',
    'Instalação de TV',
    'Outros',
  ];

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permissão necessária', 'Precisamos de acesso às suas fotos.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      const newImage: ServiceImage = {
        id: Date.now().toString(),
        uri: result.assets[0].uri,
      };
      setImages([...images, newImage]);
    }
  };

  const takePhoto = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permissão necessária', 'Precisamos de acesso à câmera.');
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      const newImage: ServiceImage = {
        id: Date.now().toString(),
        uri: result.assets[0].uri,
      };
      setImages([...images, newImage]);
    }
  };

  const removeImage = (imageId: string) => {
    setImages(images.filter(img => img.id !== imageId));
  };

  const getCurrentLocation = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permissão necessária', 'Precisamos de acesso à localização.');
        return;
      }

      const currentLocation = await Location.getCurrentPositionAsync({});
      const address = await Location.reverseGeocodeAsync({
        latitude: currentLocation.coords.latitude,
        longitude: currentLocation.coords.longitude,
      });

      if (address[0]) {
        const fullAddress = `${address[0].street}, ${address[0].name} - ${address[0].city}, ${address[0].region}`;
        setLocation(fullAddress);
      }
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível obter a localização.');
    }
  };

  const handleSubmit = () => {
    if (!serviceType || !description || !location) {
      Alert.alert('Campos obrigatórios', 'Preencha todos os campos obrigatórios.');
      return;
    }

    // Simulate service request submission
    Alert.alert(
      'Solicitação enviada!',
      'Sua solicitação foi enviada para os profissionais. Você receberá orçamentos em breve.',
      [
        {
          text: 'OK',
          onPress: () => router.back(),
        }
      ]
    );
  };

  const showImageOptions = () => {
    Alert.alert(
      'Adicionar Foto',
      'Como você gostaria de adicionar uma foto?',
      [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Câmera', onPress: takePhoto },
        { text: 'Galeria', onPress: pickImage },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />
      
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <ArrowLeft size={24} color="#1E293B" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Solicitar Serviço</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.form}>
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Tipo de Serviço *</Text>
            <View style={styles.serviceTypesContainer}>
              {serviceTypes.map((type) => (
                <TouchableOpacity
                  key={type}
                  style={[
                    styles.serviceTypeButton,
                    serviceType === type && styles.serviceTypeButtonActive
                  ]}
                  onPress={() => setServiceType(type)}
                >
                  <Text style={[
                    styles.serviceTypeText,
                    serviceType === type && styles.serviceTypeTextActive
                  ]}>
                    {type}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Descrição do Serviço *</Text>
            <View style={styles.inputContainer}>
              <FileText size={20} color="#64748B" />
              <TextInput
                style={[styles.input, styles.textArea]}
                placeholder="Descreva detalhadamente o que precisa ser feito..."
                value={description}
                onChangeText={setDescription}
                multiline
                numberOfLines={4}
                textAlignVertical="top"
              />
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Localização *</Text>
            <View style={styles.inputContainer}>
              <MapPin size={20} color="#64748B" />
              <TextInput
                style={styles.input}
                placeholder="Endereço onde será realizado o serviço"
                value={location}
                onChangeText={setLocation}
              />
              <TouchableOpacity onPress={getCurrentLocation}>
                <Text style={styles.locationButton}>Usar atual</Text>
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.row}>
            <View style={[styles.section, styles.halfWidth]}>
              <Text style={styles.sectionTitle}>Data Preferida</Text>
              <View style={styles.inputContainer}>
                <Calendar size={20} color="#64748B" />
                <TextInput
                  style={styles.input}
                  placeholder="dd/mm/aaaa"
                  value={preferredDate}
                  onChangeText={setPreferredDate}
                />
              </View>
            </View>

            <View style={[styles.section, styles.halfWidth]}>
              <Text style={styles.sectionTitle}>Horário</Text>
              <View style={styles.inputContainer}>
                <Clock size={20} color="#64748B" />
                <TextInput
                  style={styles.input}
                  placeholder="hh:mm"
                  value={preferredTime}
                  onChangeText={setPreferredTime}
                />
              </View>
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Orçamento Estimado</Text>
            <View style={styles.inputContainer}>
              <Text style={styles.currencySymbol}>R$</Text>
              <TextInput
                style={styles.input}
                placeholder="0,00"
                value={budget}
                onChangeText={setBudget}
                keyboardType="numeric"
              />
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Fotos do Móvel/Local</Text>
            <Text style={styles.sectionDescription}>
              Adicione fotos para ajudar os profissionais a entenderem melhor o serviço
            </Text>
            
            <View style={styles.imagesContainer}>
              {images.map((image) => (
                <View key={image.id} style={styles.imageContainer}>
                  <Image source={{ uri: image.uri }} style={styles.imagePreview} />
                  <TouchableOpacity
                    style={styles.removeImageButton}
                    onPress={() => removeImage(image.id)}
                  >
                    <X size={16} color="#FFFFFF" />
                  </TouchableOpacity>
                </View>
              ))}
              
              {images.length < 5 && (
                <TouchableOpacity
                  style={styles.addImageButton}
                  onPress={showImageOptions}
                >
                  <Upload size={24} color="#64748B" />
                  <Text style={styles.addImageText}>Adicionar Foto</Text>
                </TouchableOpacity>
              )}
            </View>
          </View>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
          <Text style={styles.submitButtonText}>Enviar Solicitação</Text>
        </TouchableOpacity>
      </View>
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
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  headerTitle: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    color: '#1E293B',
  },
  placeholder: {
    width: 24,
  },
  content: {
    flex: 1,
  },
  form: {
    padding: 20,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#1E293B',
    marginBottom: 8,
  },
  sectionDescription: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#64748B',
    marginBottom: 12,
  },
  serviceTypesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  serviceTypeButton: {
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  serviceTypeButtonActive: {
    backgroundColor: '#2563EB',
    borderColor: '#2563EB',
  },
  serviceTypeText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#64748B',
  },
  serviceTypeTextActive: {
    color: '#FFFFFF',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 4,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    gap: 12,
  },
  input: {
    flex: 1,
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#1E293B',
    paddingVertical: 12,
  },
  textArea: {
    minHeight: 80,
    textAlignVertical: 'top',
  },
  currencySymbol: {
    fontSize: 16,
    fontFamily: 'Inter-Medium',
    color: '#64748B',
  },
  locationButton: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    color: '#2563EB',
  },
  row: {
    flexDirection: 'row',
    gap: 12,
  },
  halfWidth: {
    flex: 1,
  },
  imagesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  imageContainer: {
    position: 'relative',
  },
  imagePreview: {
    width: 80,
    height: 80,
    borderRadius: 12,
  },
  removeImageButton: {
    position: 'absolute',
    top: -8,
    right: -8,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#EF4444',
    alignItems: 'center',
    justifyContent: 'center',
  },
  addImageButton: {
    width: 80,
    height: 80,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#E2E8F0',
    borderStyle: 'dashed',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F8FAFC',
  },
  addImageText: {
    fontSize: 10,
    fontFamily: 'Inter-Medium',
    color: '#64748B',
    marginTop: 4,
    textAlign: 'center',
  },
  footer: {
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
  },
  submitButton: {
    backgroundColor: '#2563EB',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
  },
  submitButtonText: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#FFFFFF',
  },
});