import React, { useState } from 'react';
import {
  View,
  Text,
  Image,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useChefOnboarding } from '../../hooks/use-chef-onboarding';
import { uploadPhoto, deletePhoto } from '../../services/photo-service';
import { updateChefProfile } from '../../services/chef-profile-service';
import { ChefOnboardingParamList } from '../../navigation/ChefOnboardingNavigator';

type NavigationProp = NativeStackNavigationProp<ChefOnboardingParamList, 'PhotoUpload'>;

interface Props {
  navigation: NavigationProp;
}

const MAX_PHOTOS = 10;

export default function PhotoUploadScreen({ navigation }: Props) {
  const { chefProfile, refreshProfile } = useChefOnboarding();
  const [isUploading, setIsUploading] = useState(false);
  const [deletingUrl, setDeletingUrl] = useState<string | null>(null);

  const photos = chefProfile?.photos ?? [];

  const handleAddPhoto = async () => {
    if (!chefProfile) return;

    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission Required', 'Please allow photo library access to upload photos.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 0.8,
    });

    if (result.canceled || !result.assets[0]) return;

    setIsUploading(true);
    try {
      const publicUrl = await uploadPhoto(chefProfile.userId, result.assets[0].uri);
      const updatedPhotos = [...photos, publicUrl];
      await updateChefProfile(chefProfile.id, { photos: updatedPhotos });
      await refreshProfile();
    } catch {
      Alert.alert('Error', 'Failed to upload photo. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  const handleDeletePhoto = (photoUrl: string) => {
    Alert.alert('Delete Photo', 'Are you sure you want to remove this photo?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          if (!chefProfile) return;
          setDeletingUrl(photoUrl);
          try {
            await deletePhoto(chefProfile.userId, photoUrl);
            const updatedPhotos = photos.filter((p) => p !== photoUrl);
            await updateChefProfile(chefProfile.id, { photos: updatedPhotos });
            await refreshProfile();
          } catch {
            Alert.alert('Error', 'Failed to delete photo. Please try again.');
          } finally {
            setDeletingUrl(null);
          }
        },
      },
    ]);
  };

  const renderPhoto = ({ item }: { item: string }) => (
    <View style={styles.photoWrapper}>
      <Image source={{ uri: item }} style={styles.photo} />
      <TouchableOpacity
        style={styles.deleteButton}
        onPress={() => handleDeletePhoto(item)}
        disabled={deletingUrl === item}
      >
        {deletingUrl === item ? (
          <ActivityIndicator size="small" color="#fff" />
        ) : (
          <Text style={styles.deleteButtonText}>X</Text>
        )}
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.subtitle}>
        {photos.length} of {MAX_PHOTOS} photos
      </Text>

      <FlatList
        data={photos}
        renderItem={renderPhoto}
        keyExtractor={(item) => item}
        numColumns={2}
        columnWrapperStyle={styles.row}
        contentContainerStyle={styles.grid}
        ListEmptyComponent={
          <Text style={styles.emptyText}>
            Add photos to show off your cooking and presentation
          </Text>
        }
      />

      {photos.length < MAX_PHOTOS && (
        <TouchableOpacity
          style={styles.addPhotoButton}
          onPress={handleAddPhoto}
          disabled={isUploading}
          activeOpacity={0.7}
        >
          {isUploading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.addPhotoText}>Add Photo</Text>
          )}
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
    padding: 20,
  },
  subtitle: {
    fontSize: 14,
    color: '#64748b',
    marginBottom: 16,
    textAlign: 'center',
  },
  grid: {
    paddingBottom: 20,
  },
  row: {
    gap: 12,
    marginBottom: 12,
  },
  photoWrapper: {
    flex: 1,
    aspectRatio: 1,
    position: 'relative',
  },
  photo: {
    width: '100%',
    height: '100%',
    borderRadius: 12,
    backgroundColor: '#e2e8f0',
  },
  deleteButton: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: 'rgba(0,0,0,0.6)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  deleteButtonText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 13,
  },
  emptyText: {
    textAlign: 'center',
    color: '#94a3b8',
    fontSize: 15,
    marginTop: 40,
    paddingHorizontal: 20,
  },
  addPhotoButton: {
    backgroundColor: '#2563eb',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
  },
  addPhotoText: {
    color: '#fff',
    fontSize: 17,
    fontWeight: '700',
  },
});
