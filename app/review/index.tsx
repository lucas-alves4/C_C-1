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
import { router, useLocalSearchParams } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import {
  ArrowLeft,
  Star,
  Camera,
  X,
} from 'lucide-react-native';

interface ReviewImage {
  id: string;
  uri: string;
}

export default function ReviewScreen() {
  const { serviceId } = useLocalSearchParams();
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [images, setImages] = useState<ReviewImage[]>([]);

  const ratingLabels = [
    '',
    'Muito Ruim',
    'Ruim',
    'Regular',
    'Bom',
    'Excelente',
  ];

  const quickComments = [
    'Serviço excelente!',
    'Profissional pontual',
    'Trabalho bem feito',
    'Recomendo!',
    'Preço justo',
    'Muito educado',
  ];

  const renderStars = () => {
    return (
      <View style={styles.starsContainer}>
        {[1, 2, 3, 4, 5].map((star) => (
          <TouchableOpacity
            key={star}
            onPress={() => setRating(star)}
            style={styles.starButton}
          >
            <Star
              size={32}
              color={star <= rating ? '#FFA500' : '#E2E8F0'}
              fill={star <= rating ? '#FFA500' : 'transparent'}
            />
          </TouchableOpacity>
        ))}
      </View>
    );
  };

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
      const newImage: ReviewImage = {
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
      const newImage: ReviewImage = {
        id: Date.now().toString(),
        uri: result.assets[0].uri,
      };
      setImages([...images, newImage]);
    }
  };

  const removeImage = (imageId: string) => {
    setImages(images.filter(img => img.id !== imageId));
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

  const handleSubmit = () => {
    if (rating === 0) {
      Alert.alert('Avaliação obrigatória', 'Por favor, dê uma nota ao serviço.');
      return;
    }

    // Simulate review submission
    Alert.alert(
      'Avaliação enviada!',
      'Obrigado pelo seu feedback. Sua avaliação ajuda outros usuários.',
      [
        {
          text: 'OK',
          onPress: () => router.back(),
        }
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
        <Text style={styles.headerTitle}>Avaliar Serviço</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.serviceInfo}>
          <Image
            source={{
              uri: 'https://images.pexels.com/photos/6474471/pexels-photo-6474471.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&dpr=2'
            }}
            style={styles.serviceImage}
          />
          <View style={styles.serviceDetails}>
            <Text style={styles.serviceTitle}>Montagem de Guarda-roupa</Text>
            <View style={styles.professionalInfo}>
              <Image
                source={{
                  uri: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2'
                }}
                style={styles.professionalAvatar}
              />
              <Text style={styles.professionalName}>João Silva</Text>
            </View>
          </View>
        </View>

        <View style={styles.ratingSection}>
          <Text style={styles.sectionTitle}>Como foi o serviço?</Text>
          {renderStars()}
          {rating > 0 && (
            <Text style={styles.ratingLabel}>{ratingLabels[rating]}</Text>
          )}
        </View>

        <View style={styles.commentSection}>
          <Text style={styles.sectionTitle}>Deixe um comentário</Text>
          <TextInput
            style={styles.commentInput}
            placeholder="Conte como foi sua experiência com o profissional..."
            value={comment}
            onChangeText={setComment}
            multiline
            numberOfLines={4}
            textAlignVertical="top"
          />
          
          <View style={styles.quickCommentsContainer}>
            <Text style={styles.quickCommentsTitle}>Sugestões rápidas:</Text>
            <View style={styles.quickComments}>
              {quickComments.map((quickComment) => (
                <TouchableOpacity
                  key={quickComment}
                  style={styles.quickCommentButton}
                  onPress={() => setComment(comment ? `${comment} ${quickComment}` : quickComment)}
                >
                  <Text style={styles.quickCommentText}>{quickComment}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </View>

        <View style={styles.photosSection}>
          <Text style={styles.sectionTitle}>Adicionar Fotos</Text>
          <Text style={styles.sectionDescription}>
            Mostre o resultado do trabalho (opcional)
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
            
            {images.length < 3 && (
              <TouchableOpacity
                style={styles.addImageButton}
                onPress={showImageOptions}
              >
                <Camera size={24} color="#64748B" />
                <Text style={styles.addImageText}>Adicionar Foto</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity
          style={[
            styles.submitButton,
            rating === 0 && styles.submitButtonDisabled
          ]}
          onPress={handleSubmit}
          disabled={rating === 0}
        >
          <Text style={[
            styles.submitButtonText,
            rating === 0 && styles.submitButtonTextDisabled
          ]}>
            Enviar Avaliação
          </Text>
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
  serviceInfo: {
    flexDirection: 'row',
    padding: 20,
    backgroundColor: '#F8FAFC',
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  serviceImage: {
    width: 80,
    height: 80,
    borderRadius: 12,
    marginRight: 16,
  },
  serviceDetails: {
    flex: 1,
    justifyContent: 'center',
  },
  serviceTitle: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    color: '#1E293B',
    marginBottom: 8,
  },
  professionalInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  professionalAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    marginRight: 8,
  },
  professionalName: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#64748B',
  },
  ratingSection: {
    padding: 20,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    color: '#1E293B',
    marginBottom: 16,
  },
  starsContainer: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 12,
  },
  starButton: {
    padding: 4,
  },
  ratingLabel: {
    fontSize: 16,
    fontFamily: 'Inter-Medium',
    color: '#2563EB',
  },
  commentSection: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  commentInput: {
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#1E293B',
    minHeight: 100,
    textAlignVertical: 'top',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: 16,
  },
  quickCommentsContainer: {
    marginTop: 8,
  },
  quickCommentsTitle: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#64748B',
    marginBottom: 8,
  },
  quickComments: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  quickCommentButton: {
    backgroundColor: '#F1F5F9',
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  quickCommentText: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#475569',
  },
  photosSection: {
    padding: 20,
  },
  sectionDescription: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#64748B',
    marginBottom: 16,
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
    width: 100,
    height: 100,
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
    width: 100,
    height: 100,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#E2E8F0',
    borderStyle: 'dashed',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F8FAFC',
  },
  addImageText: {
    fontSize: 12,
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
  submitButtonDisabled: {
    backgroundColor: '#E2E8F0',
  },
  submitButtonText: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#FFFFFF',
  },
  submitButtonTextDisabled: {
    color: '#94A3B8',
  },
});