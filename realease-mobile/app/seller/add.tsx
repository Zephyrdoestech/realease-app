// app/seller/add.tsx
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
import { ArrowLeft, Upload, X, MapPin, Home, Bed, Bath } from 'lucide-react-native';
import { useAuth } from '@/ctx/AuthContext';
import { supabase } from '@/lib/supabase';
import { decode } from 'base64-arraybuffer';

export default function AddPropertyScreen() {
  const router = useRouter();
  const { profile } = useAuth();

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
      // Request permissions
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      
      if (status !== 'granted') {
        Alert.alert('Permission Required', 'Please allow access to your photos');
        return;
      }

      // Launch image picker
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [16, 9],
        quality: 0.8,
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
      // Generate unique filename
      const timestamp = Date.now();
      const fileName = `property-${profile?.id}-${timestamp}.jpg`;

      // Fetch the image and convert to blob
      const response = await fetch(imageUri);
      const blob = await response.blob();

      // Convert blob to base64
      const base64 = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          const base64String = reader.result as string;
          // Remove the data:image/jpeg;base64, prefix
          const base64Data = base64String.split(',')[1];
          resolve(base64Data);
        };
        reader.onerror = reject;
        reader.readAsDataURL(blob);
      });

      // Upload to Supabase Storage
      const { data, error } = await supabase.storage
        .from('property-images')
        .upload(fileName, decode(base64), {
          contentType: 'image/jpeg',
          upsert: false,
        });

      if (error) throw error;

      // Get public URL
      const { data: urlData } = supabase.storage
        .from('property-images')
        .getPublicUrl(fileName);

      return urlData.publicUrl;
    } catch (error) {
      console.error('Error uploading image:', error);
      throw new Error('Failed to upload image');
    }
  };

  const validateForm = (): boolean => {
    if (!title.trim()) {
      Alert.alert('Error', 'Please enter a property title');
      return false;
    }

    if (!price || isNaN(parseFloat(price))) {
      Alert.alert('Error', 'Please enter a valid price');
      return false;
    }

    if (!location.trim()) {
      Alert.alert('Error', 'Please enter a location');
      return false;
    }

    if (!bedrooms || isNaN(parseInt(bedrooms))) {
      Alert.alert('Error', 'Please enter number of bedrooms');
      return false;
    }

    if (!bathrooms || isNaN(parseInt(bathrooms))) {
      Alert.alert('Error', 'Please enter number of bathrooms');
      return false;
    }

    if (!selectedImage) {
      Alert.alert('Error', 'Please upload at least one photo');
      return false;
    }

    return true;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;
    if (!profile?.id) {
      Alert.alert('Error', 'User not authenticated');
      return;
    }

    setIsLoading(true);

    try {
      // Step 1: Upload image to Storage
      const imageUrl = await uploadImageToSupabase(selectedImage!);

      // Step 2: Insert property record
      const { data, error } = await supabase.from('properties').insert({
        title: title.trim(),
        price: parseFloat(price),
        location_text: location.trim(),
        description: description.trim() || null,
        bedrooms: parseInt(bedrooms),
        bathrooms: parseInt(bathrooms),
        images: [imageUrl],
        agent_id: profile.id,
        status: 'active',
        is_title_verified: false,
        views_count: 0,
        favorites_count: 0,
      });

      if (error) throw error;

      Alert.alert(
        'Success!',
        'Your property has been listed successfully',
        [
          {
            text: 'OK',
            onPress: () => router.back(),
          },
        ]
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
            <TouchableOpacity
              onPress={() => router.back()}
              activeOpacity={0.7}
              className="mr-4"
            >
              <ArrowLeft size={24} color="#1F2937" />
            </TouchableOpacity>
            <Text className="text-2xl font-bold text-gray-900">
              Add New Listing
            </Text>
          </View>
        </View>

        <ScrollView
          className="flex-1"
          showsVerticalScrollIndicator={false}
        >
          <View className="px-6 py-6">
            {/* Image Upload */}
            <View className="mb-6">
              <Text className="text-base font-semibold text-gray-900 mb-3">
                Property Photo
              </Text>
              
              {selectedImage ? (
                <View className="relative">
                  <Image
                    source={{ uri: selectedImage }}
                    className="w-full h-64 rounded-2xl"
                    resizeMode="cover"
                  />
                  <TouchableOpacity
                    onPress={() => setSelectedImage(null)}
                    activeOpacity={0.7}
                    className="absolute top-3 right-3 bg-black/50 rounded-full p-2"
                  >
                    <X size={20} color="#FFFFFF" />
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={pickImage}
                    activeOpacity={0.7}
                    className="mt-3 bg-gray-100 rounded-xl py-3 items-center"
                  >
                    <Text className="text-teal-700 font-semibold">
                      Change Photo
                    </Text>
                  </TouchableOpacity>
                </View>
              ) : (
                <TouchableOpacity
                  onPress={pickImage}
                  activeOpacity={0.7}
                  className="bg-gray-50 border-2 border-dashed border-gray-300 rounded-2xl h-64 items-center justify-center"
                >
                  <Upload size={48} color="#9CA3AF" />
                  <Text className="text-base font-semibold text-gray-900 mt-4 mb-1">
                    Tap to Upload Photo
                  </Text>
                  <Text className="text-sm text-gray-600">
                    JPG or PNG, max 5MB
                  </Text>
                </TouchableOpacity>
              )}
            </View>

            {/* Title */}
            <View className="mb-4">
              <Text className="text-sm font-semibold text-gray-700 mb-2">
                Property Title *
              </Text>
              <View className="flex-row items-center bg-gray-50 border border-gray-300 rounded-xl px-4 py-3">
                <Home size={20} color="#9CA3AF" />
                <TextInput
                  placeholder="e.g., Modern 2BR Condo in Cebu Business Park"
                  placeholderTextColor="#9CA3AF"
                  value={title}
                  onChangeText={setTitle}
                  className="flex-1 ml-3 text-base text-gray-900"
                />
              </View>
            </View>

            {/* Price */}
            <View className="mb-4">
              <Text className="text-sm font-semibold text-gray-700 mb-2">
                Price (₱) *
              </Text>
              <TextInput
                placeholder="e.g., 4500000"
                placeholderTextColor="#9CA3AF"
                value={price}
                onChangeText={setPrice}
                keyboardType="numeric"
                className="bg-gray-50 border border-gray-300 rounded-xl px-4 py-3 text-base text-gray-900"
              />
            </View>

            {/* Location */}
            <View className="mb-4">
              <Text className="text-sm font-semibold text-gray-700 mb-2">
                Location *
              </Text>
              <View className="flex-row items-center bg-gray-50 border border-gray-300 rounded-xl px-4 py-3">
                <MapPin size={20} color="#9CA3AF" />
                <TextInput
                  placeholder="e.g., Cebu Business Park, Cebu City"
                  placeholderTextColor="#9CA3AF"
                  value={location}
                  onChangeText={setLocation}
                  className="flex-1 ml-3 text-base text-gray-900"
                />
              </View>
            </View>

            {/* Bedrooms & Bathrooms */}
            <View className="flex-row gap-3 mb-4">
              <View className="flex-1">
                <Text className="text-sm font-semibold text-gray-700 mb-2">
                  Bedrooms *
                </Text>
                <View className="flex-row items-center bg-gray-50 border border-gray-300 rounded-xl px-4 py-3">
                  <Bed size={20} color="#9CA3AF" />
                  <TextInput
                    placeholder="0"
                    placeholderTextColor="#9CA3AF"
                    value={bedrooms}
                    onChangeText={setBedrooms}
                    keyboardType="numeric"
                    className="flex-1 ml-3 text-base text-gray-900"
                  />
                </View>
              </View>

              <View className="flex-1">
                <Text className="text-sm font-semibold text-gray-700 mb-2">
                  Bathrooms *
                </Text>
                <View className="flex-row items-center bg-gray-50 border border-gray-300 rounded-xl px-4 py-3">
                  <Bath size={20} color="#9CA3AF" />
                  <TextInput
                    placeholder="0"
                    placeholderTextColor="#9CA3AF"
                    value={bathrooms}
                    onChangeText={setBathrooms}
                    keyboardType="numeric"
                    className="flex-1 ml-3 text-base text-gray-900"
                  />
                </View>
              </View>
            </View>

            {/* Description */}
            <View className="mb-6">
              <Text className="text-sm font-semibold text-gray-700 mb-2">
                Description (Optional)
              </Text>
              <TextInput
                placeholder="Describe your property..."
                placeholderTextColor="#9CA3AF"
                value={description}
                onChangeText={setDescription}
                multiline
                numberOfLines={4}
                textAlignVertical="top"
                className="bg-gray-50 border border-gray-300 rounded-xl px-4 py-3 text-base text-gray-900"
              />
            </View>

            {/* Submit Button */}
            <TouchableOpacity
              onPress={handleSubmit}
              disabled={isLoading}
              activeOpacity={0.8}
              className="bg-teal-700 rounded-xl py-4 items-center shadow-sm"
            >
              {isLoading ? (
                <ActivityIndicator color="#FFFFFF" />
              ) : (
                <Text className="text-white text-base font-bold">
                  Publish Listing
                </Text>
              )}
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}