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
import { decode } from 'base64-arraybuffer';
// ✅ Import the Gemini logic
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

  // 🪄 HACKATHON DEV HELPER: Populate data instantly for the demo
  const fillExampleData = () => {
    setTitle('Luxurious 2BR Condo near IT Park');
    setPrice('7500000');
    setLocation('Lahug, Cebu City');
    setBedrooms('2');
    setBathrooms('2');
    setDescription(''); // Clear this so we can show off the AI generation next
  };

  const pickImage = async () => {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        return Alert.alert('Permission Required', 'Please allow access to photos to upload listings.');
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

  // ✅ UNIVERSAL UPLOAD LOGIC
  const uploadImage = async (uri: string) => {
    if (!session?.user.id) throw new Error("No User ID found");

    const timestamp = Date.now();
    const fileName = `${session.user.id}/prop_${timestamp}.jpg`;

    // Fetch the file and convert to arrayBuffer (Works on Mobile + Web)
    const response = await fetch(uri);
    const fileData = await response.arrayBuffer();
    
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

  // ✨ AI MAGIC: Generate Description
  const handleAiGenerate = async () => {
    if (!title || !price || !location) {
      Alert.alert("Details Needed", "Please fill in the Title, Price, and Location first so the AI has context.");
      return;
    }

    setIsAiGenerating(true);
    try {
      const specs = `${bedrooms || 0} Beds, ${bathrooms || 0} Baths`;
      const generatedText = await generateListingDescription(title, location, price, specs);
      
      if (generatedText) {
        setDescription(generatedText);
      }
    } catch (error) {
      Alert.alert("AI Error", "Failed to generate description. Please try again.");
    } finally {
      setIsAiGenerating(false);
    }
  };

  const handleSubmit = async () => {
    if (!title || !price || !location || !selectedImage) {
      Alert.alert('Missing Fields', 'Please ensure all required fields are filled and a photo is uploaded.');
      return;
    }

    setIsLoading(true);

    try {
      // 1. Upload Image to Supabase Storage
      const imageUrl = await uploadImage(selectedImage);

      // 2. Insert Listing to Database
      const { error } = await supabase.from('properties').insert({
        agent_id: session?.user.id,
        title: title.trim(),
        price: parseFloat(price),
        location_text: location.trim(),
        description: description.trim(),
        bedrooms: parseInt(bedrooms) || 0,
        bathrooms: parseInt(bathrooms) || 0,
        images: [imageUrl],
        status: 'active',
        // Mocking coordinates near Cebu center for the map demo
        latitude: 10.3157 + (Math.random() * 0.04 - 0.02),
        longitude: 123.8854 + (Math.random() * 0.04 - 0.02),
      } as any);

      if (error) throw error;

      Alert.alert("Success!", "Your property is now live and verified.", [
        { text: "View Dashboard", onPress: () => router.back() }
      ]);
    } catch (error: any) {
      Alert.alert("Listing Failed", error.message);
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-white dark:bg-gray-900" edges={['top']}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} className="flex-1">
        
        {/* Header */}
        <View className="px-6 py-4 border-b border-gray-100 dark:border-gray-800 flex-row items-center justify-between">
          <View className="flex-row items-center">
            <TouchableOpacity onPress={() => router.back()} className="mr-4 p-1">
              <ArrowLeft size={24} color="#111827" className="dark:text-white" />
            </TouchableOpacity>
            <Text className="text-xl font-bold text-gray-900 dark:text-white">Add Property</Text>
          </View>
          
          {/* 🪄 DEV HELPER BUTTON */}
          <TouchableOpacity 
            onPress={fillExampleData} 
            className="bg-teal-50 dark:bg-teal-900/30 px-3 py-1.5 rounded-full flex-row items-center border border-teal-100 dark:border-teal-800"
          >
             <Wand2 size={14} color="#0F766E" />
             <Text className="text-xs font-bold text-teal-700 dark:text-teal-400 ml-1.5">Fill Demo</Text>
          </TouchableOpacity>
        </View>

        <ScrollView className="flex-1 px-6 py-6" showsVerticalScrollIndicator={false}>
          
          {/* Image Picker Area */}
          <View className="mb-6">
            <Text className="text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Main Property Photo</Text>
            {selectedImage ? (
              <View className="relative">
                <Image source={{ uri: selectedImage }} className="w-full h-56 rounded-2xl" resizeMode="cover" />
                <TouchableOpacity 
                  onPress={() => setSelectedImage(null)}
                  className="absolute top-3 right-3 bg-black/60 p-2 rounded-full"
                >
                  <X size={18} color="white" />
                </TouchableOpacity>
              </View>
            ) : (
              <TouchableOpacity 
                onPress={pickImage}
                className="h-56 bg-gray-50 dark:bg-gray-800 border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-2xl items-center justify-center"
              >
                <View className="bg-white dark:bg-gray-700 p-4 rounded-full shadow-sm">
                   <Upload size={28} color="#0F766E" />
                </View>
                <Text className="text-gray-500 dark:text-gray-400 mt-3 font-medium">Tap to select property image</Text>
              </TouchableOpacity>
            )}
          </View>

          {/* Form Content */}
          <View className="space-y-5">
            <View>
              <Text className="text-xs font-bold text-gray-400 uppercase mb-1 ml-1 tracking-widest">Basic Information</Text>
              <TextInput 
                className="bg-gray-50 dark:bg-gray-800 p-4 rounded-xl text-gray-900 dark:text-white border border-gray-100 dark:border-gray-700 text-base"
                placeholder="Listing Title (e.g. Modern Studio)" 
                placeholderTextColor="#9CA3AF"
                value={title} onChangeText={setTitle} 
              />
            </View>

            <View className="flex-row gap-4">
              <View className="flex-1">
                <TextInput 
                  className="bg-gray-50 dark:bg-gray-800 p-4 rounded-xl text-gray-900 dark:text-white border border-gray-100 dark:border-gray-700 text-base"
                  placeholder="Price (₱)" 
                  placeholderTextColor="#9CA3AF"
                  keyboardType="numeric" 
                  value={price} onChangeText={setPrice} 
                />
              </View>
              <View className="flex-1">
                <TextInput 
                  className="bg-gray-50 dark:bg-gray-800 p-4 rounded-xl text-gray-900 dark:text-white border border-gray-100 dark:border-gray-700 text-base"
                  placeholder="Location (City)" 
                  placeholderTextColor="#9CA3AF"
                  value={location} onChangeText={setLocation} 
                />
              </View>
            </View>

            <View className="flex-row gap-4">
              <View className="flex-1 flex-row items-center bg-gray-50 dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 px-4">
                <Bed size={18} color="#6B7280" />
                <TextInput 
                  className="flex-1 p-4 text-gray-900 dark:text-white text-base"
                  placeholder="Beds" keyboardType="numeric" 
                  value={bedrooms} onChangeText={setBedrooms} 
                />
              </View>
              <View className="flex-1 flex-row items-center bg-gray-50 dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 px-4">
                <Bath size={18} color="#6B7280" />
                <TextInput 
                  className="flex-1 p-4 text-gray-900 dark:text-white text-base"
                  placeholder="Baths" keyboardType="numeric" 
                  value={bathrooms} onChangeText={setBathrooms} 
                />
              </View>
            </View>

            <View>
              <View className="flex-row justify-between items-center mb-2 px-1">
                <Text className="text-sm font-bold text-gray-700 dark:text-gray-300">Property Description</Text>
                
                {/* ✨ AI MAGIC BUTTON */}
                <TouchableOpacity 
                  onPress={handleAiGenerate}
                  disabled={isAiGenerating}
                  className="flex-row items-center bg-teal-600 px-3 py-1.5 rounded-full shadow-sm active:opacity-80"
                >
                  {isAiGenerating ? (
                    <ActivityIndicator size="small" color="white" />
                  ) : (
                    <>
                      <Sparkles size={14} color="white" />
                      <Text className="text-[11px] font-bold text-white ml-1.5 uppercase tracking-tighter">Generate with AI</Text>
                    </>
                  )}
                </TouchableOpacity>
              </View>
              
              <TextInput 
                className="bg-gray-50 dark:bg-gray-800 p-4 rounded-2xl text-gray-900 dark:text-white border border-gray-100 dark:border-gray-700 min-h-[120px] text-base leading-5"
                placeholder="Share more details about the property..." 
                placeholderTextColor="#9CA3AF"
                multiline textAlignVertical="top" 
                value={description} onChangeText={setDescription} 
              />
            </View>
          </View>

          <TouchableOpacity 
            onPress={handleSubmit} 
            disabled={isLoading}
            className="bg-teal-700 mt-10 py-4 rounded-2xl items-center shadow-lg active:scale-[0.98] transition-transform"
          >
            {isLoading ? (
              <ActivityIndicator color="white" />
            ) : (
              <Text className="text-white font-bold text-lg uppercase tracking-widest">Publish Listing</Text>
            )}
          </TouchableOpacity>
          
          <View className="h-24" />
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}