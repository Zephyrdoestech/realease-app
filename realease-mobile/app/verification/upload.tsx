import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Image, ScrollView, Alert, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system';
import { ArrowLeft, Upload, Shield, FileText } from 'lucide-react-native';
import { useAuth } from '@/ctx/AuthContext';
import { supabase } from '@/lib/supabase';
import { decode } from 'base64-arraybuffer';

export default function VerificationUploadScreen() {
  const router = useRouter();
  const { session } = useAuth();
  
  const [govId, setGovId] = useState<string | null>(null);
  const [prcId, setPrcId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const pickImage = async (setImage: (uri: string | null) => void) => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        setImage(result.assets[0].uri);
      }
    } catch (error) {
      console.log("Error picking image:", error);
      Alert.alert("Error", "Could not open image picker");
    }
  };

  const uploadFile = async (uri: string, type: 'gov' | 'prc') => {
    if (!session?.user.id) throw new Error("No user ID found");

    const base64 = await FileSystem.readAsStringAsync(uri, {
      encoding: 'base64',
    });

    const fileName = `${session.user.id}/${type}_${Date.now()}.jpg`;

    const { error } = await supabase.storage
      .from('documents')
      .upload(fileName, decode(base64), {
        contentType: 'image/jpeg',
        upsert: true,
      });

    if (error) throw error;
    
    return fileName;
  };

  const handleSubmit = async () => {
    // ✅ SAFETY CHECK: Ensure user is logged in
    if (!session?.user) {
      Alert.alert("Error", "You must be logged in.");
      return;
    }

    if (!govId || !prcId) {
      Alert.alert('Missing Documents', 'Please upload both IDs.');
      return;
    }

    setIsLoading(true);
    try {
      // 1. Upload files
      const govPath = await uploadFile(govId, 'gov');
      const prcPath = await uploadFile(prcId, 'prc');

      // 2. Update Profile status
      const { error } = await supabase
        .from('profiles')
        .update({
          verification_documents: [govPath, prcPath],
          is_verified: true, 
          verified_at: new Date().toISOString(),
        })
        .eq('id', session.user.id); // ✅ FIX: Now safely accessed

      if (error) throw error;

      Alert.alert("Success!", "You are now Verified.", [
        { text: "Done", onPress: () => router.replace('/(tabs)/profile') }
      ]);

    } catch (error: any) {
      console.error(error);
      Alert.alert("Upload Failed", error.message || "Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="px-6 py-4 border-b border-gray-200 flex-row items-center">
        <TouchableOpacity onPress={() => router.back()} className="mr-4">
          <ArrowLeft size={24} color="#1F2937" />
        </TouchableOpacity>
        <Text className="text-xl font-bold text-gray-900">Get Verified</Text>
      </View>

      <ScrollView className="flex-1 px-6 py-6">
        <View className="bg-amber-50 p-4 rounded-xl mb-8 border border-amber-100">
          <Text className="text-amber-800 text-sm">
            Please upload clear photos of your Government ID and Professional License.
          </Text>
        </View>

        <Text className="font-bold text-gray-900 mb-2">1. Government ID</Text>
        <TouchableOpacity onPress={() => pickImage(setGovId)} className="mb-6">
          {govId ? (
            <Image source={{ uri: govId }} className="w-full h-48 rounded-xl bg-gray-100" resizeMode="cover" />
          ) : (
            <View className="w-full h-48 rounded-xl bg-gray-50 border-2 border-dashed border-gray-300 items-center justify-center">
              <Upload size={32} color="#9CA3AF" />
              <Text className="text-gray-400 mt-2">Tap to upload</Text>
            </View>
          )}
        </TouchableOpacity>

        <Text className="font-bold text-gray-900 mb-2">2. PRC License</Text>
        <TouchableOpacity onPress={() => pickImage(setPrcId)} className="mb-8">
          {prcId ? (
            <Image source={{ uri: prcId }} className="w-full h-48 rounded-xl bg-gray-100" resizeMode="cover" />
          ) : (
            <View className="w-full h-48 rounded-xl bg-gray-50 border-2 border-dashed border-gray-300 items-center justify-center">
              <FileText size={32} color="#9CA3AF" />
              <Text className="text-gray-400 mt-2">Tap to upload</Text>
            </View>
          )}
        </TouchableOpacity>

        <TouchableOpacity 
          onPress={handleSubmit} 
          disabled={isLoading} 
          className="bg-teal-700 py-4 rounded-xl items-center mb-10 shadow-sm"
        >
          {isLoading ? (
            <ActivityIndicator color="white" />
          ) : (
            <Text className="text-white font-bold text-lg">Submit for Verification</Text>
          )}
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}