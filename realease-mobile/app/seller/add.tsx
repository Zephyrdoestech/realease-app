import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, ScrollView, Image,
  Alert, ActivityIndicator, KeyboardAvoidingView, Platform
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import { ArrowLeft, Upload, X, MapPin, Home, Bed, Bath, Sparkles, Wand2 } from 'lucide-react-native';
import { useAuth } from '@/ctx/AuthContext';
import { supabase } from '@/lib/supabase';
import { generateListingDescription } from '@/lib/gemini';

export default function AddPropertyScreen() {
  const router = useRouter();
  const { session } = useAuth();

  const [title, setTitle] = useState('');
  const [price, setPrice] = useState('');
  const [location, setLocation] = useState('');
  const [description, setDescription] = useState('');
  const [bedrooms, setBedrooms] = useState('');
  const [bathrooms, setBathrooms] = useState('');
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isAiGenerating, setIsAiGenerating] = useState(false);

  // 🪄 DEV HELPER
  const fillExampleData = () => {
    setTitle('Luxury Skyline Condo with Ocean View');
    setPrice('12500000');
    setLocation('Cebu Business Park, Cebu City');
    setBedrooms('2');
    setBathrooms('2');
    setDescription('Experience luxury living at its finest. This fully furnished unit offers breathtaking views of the ocean and city skyline. Includes parking and access to gym/pool.');
  };

  const pickImage = async () => {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        return Alert.alert('Permission Required', 'Please allow access to photos');
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
      Alert.alert('Error', 'Failed to pick image');
    }
  };

  // ✅ FIXED: Universal Upload Logic (No FileSystem)
  const uploadImage = async (uri: string) => {
    if (!session?.user.id) throw new Error("No User ID");

    const timestamp = Date.now();
    const fileName = `property-${session.user.id}-${timestamp}.jpg`;

    // 1. Fetch file data
    const response = await fetch(uri);
    // 2. Convert to ArrayBuffer (Works on Mobile & Web)
    const fileData = await response.arrayBuffer();
    
    // 3. Upload
    const { error } = await supabase.storage
      .from('property-images')
      .upload(fileName, fileData, {
        contentType: 'image/jpeg',
        upsert: false,
      });

    if (error) throw error;

    const { data } = supabase.storage.from('property-images').getPublicUrl(fileName);
    return data.publicUrl;
  };

  const handleAiGenerate = async () => {
    if (!title || !price || !location) {
      Alert.alert("Missing Info", "Please enter Title, Price, and Location first.");
      return;
    }
    setIsAiGenerating(true);
    const text = await generateListingDescription(title, location, price, `${bedrooms} Beds, ${bathrooms} Baths`);
    if (text) setDescription(text);
    setIsAiGenerating(false);
  };

  const handleSubmit = async () => {
    if (!title || !price || !location || !selectedImage) {
      Alert.alert('Missing Fields', 'Please fill all fields and upload an image.');
      return;
    }

    setIsLoading(true);

    try {
      // 1. Upload Image
      const imageUrl = await uploadImage(selectedImage);

      // 2. Insert Data
      const { error } = await supabase.from('properties').insert({
        agent_id: session?.user.id,
        title: title.trim(),
        price: parseFloat(price) || 0,
        location_text: location.trim(),
        description: description.trim(),
        bedrooms: parseInt(bedrooms) || 0,
        bathrooms: parseInt(bathrooms) || 0,
        images: [imageUrl],
        status: 'active',
        is_title_verified: false,
        views_count: 0,
        favorites_count: 0,
        // Default coordinates for Demo Map
        latitude: 10.3157 + (Math.random() * 0.05 - 0.025),
        longitude: 123.8854 + (Math.random() * 0.05 - 0.025),
      } as any);

      if (error) throw error;

      Alert.alert("Success", "Property Listed!", [{ text: "OK", onPress: () => router.back() }]);
    } catch (error: any) {
      console.error(error);
      Alert.alert("Error", error.message || "Failed to add property");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-white dark:bg-gray-900" edges={['top']}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} className="flex-1">
        
        {/* Header */}
        <View className="px-6 py-4 border-b border-gray-200 dark:border-gray-800 flex-row items-center justify-between">
          <View className="flex-row items-center">
            <TouchableOpacity onPress={() => router.back()} className="mr-4">
              <ArrowLeft size={24} className="text-gray-900 dark:text-white" />
            </TouchableOpacity>
            <Text className="text-xl font-bold text-gray-900 dark:text-white">Add Listing</Text>
          </View>
          
          {/* 🪄 DEV BUTTON */}
          <TouchableOpacity onPress={fillExampleData} className="bg-teal-50 dark:bg-teal-900/30 px-3 py-1.5 rounded-lg flex-row items-center">
             <Wand2 size={14} className="text-teal-700 dark:text-teal-400 mr-1" />
             <Text className="text-xs font-bold text-teal-700 dark:text-teal-400">Fill Demo</Text>
          </TouchableOpacity>
        </View>

        <ScrollView className="flex-1 px-6 py-6" showsVerticalScrollIndicator={false}>
          
          {/* Image Picker */}
          <View className="mb-6">
            <Text className="text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Property Photo</Text>
            {selectedImage ? (
              <View>
                <Image source={{ uri: selectedImage }} className="w-full h-56 rounded-xl" resizeMode="cover" />
                <TouchableOpacity 
                  onPress={() => setSelectedImage(null)}
                  className="absolute top-2 right-2 bg-black/50 p-2 rounded-full"
                >
                  <X size={20} color="white" />
                </TouchableOpacity>
              </View>
            ) : (
              <TouchableOpacity 
                onPress={pickImage}
                className="h-56 bg-gray-50 dark:bg-gray-800 border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-xl items-center justify-center"
              >
                <Upload size={32} color="#9CA3AF" />
                <Text className="text-gray-400 mt-2">Tap to Upload</Text>
              </TouchableOpacity>
            )}
          </View>

          {/* Form Fields */}
          <View className="space-y-4">
            <View>
              <Text className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Title</Text>
              <TextInput 
                className="bg-gray-50 dark:bg-gray-800 p-3 rounded-lg text-gray-900 dark:text-white border border-gray-200 dark:border-gray-700"
                placeholder="e.g. Modern Condo" 
                placeholderTextColor="#9CA3AF"
                value={title} onChangeText={setTitle} 
              />
            </View>

            <View>
              <Text className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Price (₱)</Text>
              <TextInput 
                className="bg-gray-50 dark:bg-gray-800 p-3 rounded-lg text-gray-900 dark:text-white border border-gray-200 dark:border-gray-700"
                placeholder="0" 
                placeholderTextColor="#9CA3AF"
                keyboardType="numeric" 
                value={price} onChangeText={setPrice} 
              />
            </View>

            <View>
              <Text className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Location</Text>
              <TextInput 
                className="bg-gray-50 dark:bg-gray-800 p-3 rounded-lg text-gray-900 dark:text-white border border-gray-200 dark:border-gray-700"
                placeholder="City, Area" 
                placeholderTextColor="#9CA3AF"
                value={location} onChangeText={setLocation} 
              />
            </View>

            <View className="flex-row gap-4">
              <View className="flex-1">
                <Text className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Beds</Text>
                <TextInput 
                  className="bg-gray-50 dark:bg-gray-800 p-3 rounded-lg text-gray-900 dark:text-white border border-gray-200 dark:border-gray-700"
                  placeholder="0" keyboardType="numeric" 
                  value={bedrooms} onChangeText={setBedrooms} 
                />
              </View>
              <View className="flex-1">
                <Text className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Baths</Text>
                <TextInput 
                  className="bg-gray-50 dark:bg-gray-800 p-3 rounded-lg text-gray-900 dark:text-white border border-gray-200 dark:border-gray-700"
                  placeholder="0" keyboardType="numeric" 
                  value={bathrooms} onChangeText={setBathrooms} 
                />
              </View>
            </View>

            <View>
              <View className="flex-row justify-between items-center mb-1">
                <Text className="text-sm font-medium text-gray-700 dark:text-gray-300">Description</Text>
                {/* AI Generator Button */}
                <TouchableOpacity 
                  onPress={handleAiGenerate}
                  disabled={isAiGenerating}
                  className="flex-row items-center bg-teal-50 dark:bg-teal-900/30 px-2 py-1 rounded-md"
                >
                  {isAiGenerating ? (
                    <ActivityIndicator size="small" color="#0F766E" />
                  ) : (
                    <>
                      <Sparkles size={12} color="#0F766E" />
                      <Text className="text-[10px] font-bold text-teal-700 dark:text-teal-400 ml-1">AI Write</Text>
                    </>
                  )}
                </TouchableOpacity>
              </View>
              <TextInput 
                className="bg-gray-50 dark:bg-gray-800 p-3 rounded-lg text-gray-900 dark:text-white border border-gray-200 dark:border-gray-700 min-h-[100px]"
                placeholder="Details..." 
                placeholderTextColor="#9CA3AF"
                multiline textAlignVertical="top" 
                value={description} onChangeText={setDescription} 
              />
            </View>
          </View>

          <TouchableOpacity 
            onPress={handleSubmit} 
            disabled={isLoading}
            className="bg-teal-700 mt-8 py-4 rounded-xl items-center shadow-lg"
          >
            {isLoading ? <ActivityIndicator color="white" /> : <Text className="text-white font-bold text-lg">Publish Listing</Text>}
          </TouchableOpacity>
          
          <View className="h-20" />
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}