import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Image,
  Alert,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system';
import { ArrowLeft, Upload, X, MapPin, Home, Bed, Bath } from 'lucide-react-native';
import { useAuth } from '@/ctx/AuthContext';
import { supabase } from '@/lib/supabase';
import { decode } from 'base64-arraybuffer';

export default function AddPropertyScreen() {
  const router = useRouter();
  const { session } = useAuth(); // Use session for ID

  const [title, setTitle] = useState('');
  const [price, setPrice] = useState('');
  const [location, setLocation] = useState('');
  const [description, setDescription] = useState('');
  const [bedrooms, setBedrooms] = useState('');
  const [bathrooms, setBathrooms] = useState('');
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const pickImage = async () => {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      
      if (status !== 'granted') {
        Alert.alert('Permission Required', 'Please allow access to your photos');
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        allowsEditing: true,
        aspect: [16, 9],
        quality: 0.7,
      });

      if (!result.canceled && result.assets[0]) {
        setSelectedImage(result.assets[0].uri);
      }
    } catch (error) {
      console.error('Error picking image:', error);
      Alert.alert('Error', 'Failed to pick image');
    }
  };

  const uploadImageToSupabase = async (imageUri: string): Promise<string> => {
    try {
      if (!session?.user.id) throw new Error("No user ID");

      const timestamp = Date.now();
      const fileName = `property-${session.user.id}-${timestamp}.jpg`;

      // ✅ FIX: Use string 'base64' instead of FileSystem.EncodingType.Base64
      const base64 = await FileSystem.readAsStringAsync(imageUri, {
        encoding: 'base64',
      });

      // Upload
      const { error } = await supabase.storage
        .from('property-images')
        .upload(fileName, decode(base64), {
          contentType: 'image/jpeg',
          upsert: true,
        });

      if (error) throw error;

      // Get URL
      const { data: urlData } = supabase.storage
        .from('property-images')
        .getPublicUrl(fileName);

      return urlData.publicUrl;
    } catch (error) {
      console.error('Upload Error:', error);
      throw error;
    }
  };

  const validateForm = (): boolean => {
    if (!title.trim()) { Alert.alert('Error', 'Enter a property title'); return false; }
    if (!price || isNaN(parseFloat(price))) { Alert.alert('Error', 'Enter a valid price'); return false; }
    if (!location.trim()) { Alert.alert('Error', 'Enter a location'); return false; }
    if (!bedrooms) { Alert.alert('Error', 'Enter bedrooms'); return false; }
    if (!selectedImage) { Alert.alert('Error', 'Upload a photo'); return false; }
    return true;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;
    if (!session?.user.id) {
      Alert.alert('Error', 'User not authenticated');
      return;
    }

    setIsLoading(true);

    try {
      // 1. Upload Image
      const imageUrl = await uploadImageToSupabase(selectedImage!);

      // 2. Insert to Database
      const { error } = await supabase.from('properties').insert({
        title: title.trim(),
        price: parseFloat(price),
        location_text: location.trim(),
        description: description.trim() || null,
        bedrooms: parseInt(bedrooms) || 0,
        bathrooms: parseInt(bathrooms) || 0,
        images: [imageUrl],
        agent_id: session.user.id,
        status: 'active',
        is_title_verified: false,
        views_count: 0,
        favorites_count: 0,
        latitude: 10.3157, 
        longitude: 123.8854
      });

      if (error) throw error;

      Alert.alert(
        'Success!',
        'Property listed successfully.',
        [{ text: 'OK', onPress: () => router.back() }]
      );
    } catch (error: any) {
      console.error('Error adding property:', error);
      Alert.alert('Error', error.message || 'Failed to add property');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-white" edges={['top']}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1"
      >
        {/* Header */}
        <View className="px-6 py-4 border-b border-gray-200">
          <View className="flex-row items-center">
            <TouchableOpacity onPress={() => router.back()} className="mr-4">
              <ArrowLeft size={24} color="#1F2937" />
            </TouchableOpacity>
            <Text className="text-2xl font-bold text-gray-900">Add New Listing</Text>
          </View>
        </View>

        <ScrollView className="flex-1 px-6 py-6" showsVerticalScrollIndicator={false}>
            {/* Image Upload */}
            <View className="mb-6">
              <Text className="text-base font-semibold text-gray-900 mb-3">Property Photo</Text>
              {selectedImage ? (
                <View className="relative">
                  <Image source={{ uri: selectedImage }} className="w-full h-64 rounded-2xl" resizeMode="cover" />
                  <TouchableOpacity onPress={() => setSelectedImage(null)} className="absolute top-3 right-3 bg-black/50 rounded-full p-2">
                    <X size={20} color="#FFFFFF" />
                  </TouchableOpacity>
                </View>
              ) : (
                <TouchableOpacity onPress={pickImage} className="bg-gray-50 border-2 border-dashed border-gray-300 rounded-2xl h-64 items-center justify-center">
                  <Upload size={48} color="#9CA3AF" />
                  <Text className="text-base font-semibold text-gray-900 mt-4">Tap to Upload</Text>
                </TouchableOpacity>
              )}
            </View>

            {/* Inputs */}
            <View className="mb-4">
              <Text className="text-sm font-semibold text-gray-700 mb-2">Property Title *</Text>
              <TextInput placeholder="e.g., Modern 2BR Condo" value={title} onChangeText={setTitle} className="bg-gray-50 border border-gray-300 rounded-xl px-4 py-3 text-base text-gray-900" />
            </View>

            <View className="mb-4">
              <Text className="text-sm font-semibold text-gray-700 mb-2">Price (₱) *</Text>
              <TextInput placeholder="e.g., 4500000" value={price} onChangeText={setPrice} keyboardType="numeric" className="bg-gray-50 border border-gray-300 rounded-xl px-4 py-3 text-base text-gray-900" />
            </View>

            <View className="mb-4">
              <Text className="text-sm font-semibold text-gray-700 mb-2">Location *</Text>
              <TextInput placeholder="e.g., Cebu IT Park" value={location} onChangeText={setLocation} className="bg-gray-50 border border-gray-300 rounded-xl px-4 py-3 text-base text-gray-900" />
            </View>

            <View className="flex-row gap-3 mb-4">
              <View className="flex-1">
                <Text className="text-sm font-semibold text-gray-700 mb-2">Bedrooms</Text>
                <TextInput placeholder="0" value={bedrooms} onChangeText={setBedrooms} keyboardType="numeric" className="bg-gray-50 border border-gray-300 rounded-xl px-4 py-3 text-base text-gray-900" />
              </View>
              <View className="flex-1">
                <Text className="text-sm font-semibold text-gray-700 mb-2">Bathrooms</Text>
                <TextInput placeholder="0" value={bathrooms} onChangeText={setBathrooms} keyboardType="numeric" className="bg-gray-50 border border-gray-300 rounded-xl px-4 py-3 text-base text-gray-900" />
              </View>
            </View>

            <View className="mb-6">
              <Text className="text-sm font-semibold text-gray-700 mb-2">Description</Text>
              <TextInput placeholder="Describe your property..." value={description} onChangeText={setDescription} multiline numberOfLines={4} textAlignVertical="top" className="bg-gray-50 border border-gray-300 rounded-xl px-4 py-3 text-base text-gray-900" />
            </View>

            <TouchableOpacity onPress={handleSubmit} disabled={isLoading} className="bg-teal-700 rounded-xl py-4 items-center shadow-sm mb-10">
              {isLoading ? <ActivityIndicator color="#FFFFFF" /> : <Text className="text-white text-base font-bold">Publish Listing</Text>}
            </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}