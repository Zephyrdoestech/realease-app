// app/verification/upload.tsx
import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Image,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system';
import { ArrowLeft, Upload, Shield, CheckCircle, AlertCircle, X } from 'lucide-react-native';
import { useAuth } from '@/ctx/AuthContext';
import { supabase } from '@/lib/supabase';
import { decode } from 'base64-arraybuffer';

interface DocumentImage {
  uri: string;
  fileName: string;
}

export default function VerificationUploadScreen() {
  const router = useRouter();
  const { profile, user } = useAuth();

  const [govIdImage, setGovIdImage] = useState<DocumentImage | null>(null);
  const [prcLicenseImage, setPrcLicenseImage] = useState<DocumentImage | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const pickImage = async (
    type: 'government-id' | 'prc-license'
  ): Promise<void> => {
    try {
      // Request permissions
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();

      if (status !== 'granted') {
        Alert.alert(
          'Permission Required',
          'Please allow access to your photos to upload verification documents'
        );
        return;
      }

      // Launch image picker
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        quality: 0.9,
        base64: false, // We'll use FileSystem instead
      });

      if (!result.canceled && result.assets[0]) {
        const asset = result.assets[0];
        const fileName = `${type}-${Date.now()}.jpg`;

        const documentImage: DocumentImage = {
          uri: asset.uri,
          fileName,
        };

        if (type === 'government-id') {
          setGovIdImage(documentImage);
        } else {
          setPrcLicenseImage(documentImage);
        }
      }
    } catch (error) {
      console.error('Error picking image:', error);
      Alert.alert('Error', 'Failed to pick image');
    }
  };

  const uploadImageToSupabase = async (
    imageUri: string,
    fileName: string,
    userId: string
  ): Promise<string> => {
    try {
      // CRITICAL: Use FileSystem to read file as base64
      // This prevents network fetch errors on Android
      const base64 = await FileSystem.readAsStringAsync(imageUri, {
        encoding: FileSystem.EncodingType.Base64,
      });

      // Create path: documents/user_id/filename
      const filePath = `${userId}/${fileName}`;

      // Upload to Supabase Storage
      const { data, error } = await supabase.storage
        .from('documents')
        .upload(filePath, decode(base64), {
          contentType: 'image/jpeg',
          upsert: false,
        });

      if (error) throw error;

      // Return the storage path (not public URL for security)
      return data.path;
    } catch (error) {
      console.error('Error uploading document:', error);
      throw new Error('Failed to upload document');
    }
  };

  const handleSubmit = async () => {
    // Validation
    if (!govIdImage) {
      Alert.alert('Required', 'Please upload your Government ID');
      return;
    }

    if (!prcLicenseImage) {
      Alert.alert('Required', 'Please upload your PRC License');
      return;
    }

    if (!user?.id) {
      Alert.alert('Error', 'User not authenticated');
      return;
    }

    setIsLoading(true);

    try {
      // Step 1: Upload Government ID
      const govIdPath = await uploadImageToSupabase(
        govIdImage.uri,
        govIdImage.fileName,
        user.id
      );

      // Step 2: Upload PRC License
      const prcLicensePath = await uploadImageToSupabase(
        prcLicenseImage.uri,
        prcLicenseImage.fileName,
        user.id
      );

      // Step 3: Update profile with document paths and verification status
      const { error: updateError } = await supabase
        .from('profiles')
        .update({
          verification_documents: [govIdPath, prcLicensePath],
          // HACKATHON DEMO: Auto-verify for instant badge
          is_verified: true,
          verified_at: new Date().toISOString(),
        })
        .eq('id', user.id);

      if (updateError) throw updateError;

      // Success!
      Alert.alert(
        'Verification Submitted! ✓',
        'Your documents have been uploaded and verified. You now have the Verified Agent badge!',
        [
          {
            text: 'Great!',
            onPress: () => router.back(),
          },
        ]
      );
    } catch (error: any) {
      console.error('Error submitting verification:', error);
      Alert.alert('Error', error.message || 'Failed to submit verification');
    } finally {
      setIsLoading(false);
    }
  };

  const DocumentUploadSection = ({
    title,
    subtitle,
    image,
    onPress,
    onRemove,
  }: {
    title: string;
    subtitle: string;
    image: DocumentImage | null;
    onPress: () => void;
    onRemove: () => void;
  }) => (
    <View className="mb-6">
      <Text className="text-base font-bold text-gray-900 mb-2">{title}</Text>
      <Text className="text-sm text-gray-600 mb-3">{subtitle}</Text>

      {image ? (
        <View className="relative">
          <Image
            source={{ uri: image.uri }}
            className="w-full h-64 rounded-2xl"
            resizeMode="cover"
          />
          <TouchableOpacity
            onPress={onRemove}
            activeOpacity={0.7}
            className="absolute top-3 right-3 bg-black/50 rounded-full p-2"
          >
            <X size={20} color="#FFFFFF" />
          </TouchableOpacity>
          <View className="absolute bottom-3 left-3 bg-green-500 rounded-full px-3 py-1.5 flex-row items-center">
            <CheckCircle size={16} color="#FFFFFF" />
            <Text className="text-white text-xs font-bold ml-1">
              Uploaded
            </Text>
          </View>
          <TouchableOpacity
            onPress={onPress}
            activeOpacity={0.7}
            className="mt-3 bg-gray-100 rounded-xl py-3 items-center"
          >
            <Text className="text-teal-700 font-semibold">Change Image</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <TouchableOpacity
          onPress={onPress}
          activeOpacity={0.7}
          className="bg-gray-50 border-2 border-dashed border-gray-300 rounded-2xl py-8 items-center"
        >
          <Upload size={48} color="#9CA3AF" />
          <Text className="text-base font-semibold text-gray-900 mt-4 mb-1">
            Select Image
          </Text>
          <Text className="text-sm text-gray-600">
            JPG or PNG, max 10MB
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );

  return (
    <SafeAreaView className="flex-1 bg-white" edges={['top']}>
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
          <View className="flex-1">
            <Text className="text-2xl font-bold text-gray-900">
              Get Verified
            </Text>
          </View>
        </View>
      </View>

      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
      >
        <View className="px-6 py-6">
          {/* Info Banner */}
          <View className="bg-teal-50 border-2 border-teal-700 rounded-2xl p-5 mb-6">
            <View className="flex-row items-start">
              <View className="bg-teal-700 rounded-full p-3 mr-4">
                <Shield size={24} color="#FFFFFF" />
              </View>
              <View className="flex-1">
                <Text className="text-lg font-bold text-gray-900 mb-2">
                  Build Trust with Buyers
                </Text>
                <Text className="text-sm text-gray-700 leading-6">
                  Verified agents get 10x more inquiries. Upload your Government
                  ID and PRC License to receive the Verified Agent badge.
                </Text>
              </View>
            </View>
          </View>

          {/* Instructions */}
          <View className="bg-blue-50 rounded-xl p-4 mb-6">
            <View className="flex-row items-start">
              <AlertCircle size={20} color="#3B82F6" className="mt-0.5" />
              <View className="flex-1 ml-3">
                <Text className="text-sm font-semibold text-blue-900 mb-1">
                  What you need:
                </Text>
                <Text className="text-sm text-blue-800 leading-5">
                  • Valid Government-issued ID (Passport, Driver's License, or
                  National ID){'\n'}• Active PRC Real Estate License{'\n'}•
                  Clear, readable photos of both documents
                </Text>
              </View>
            </View>
          </View>

          {/* Upload Sections */}
          <DocumentUploadSection
            title="1. Government ID"
            subtitle="Passport, Driver's License, or National ID"
            image={govIdImage}
            onPress={() => pickImage('government-id')}
            onRemove={() => setGovIdImage(null)}
          />

          <DocumentUploadSection
            title="2. PRC Real Estate License"
            subtitle="Professional Regulation Commission License"
            image={prcLicenseImage}
            onPress={() => pickImage('prc-license')}
            onRemove={() => setPrcLicenseImage(null)}
          />

          {/* Privacy Notice */}
          <View className="bg-gray-50 rounded-xl p-4 mb-6">
            <Text className="text-xs text-gray-600 leading-5">
              🔒 <Text className="font-semibold">Your privacy is protected.</Text>
              {' '}Documents are encrypted and stored securely. Only RealEase
              verification team can access these files. We never share your
              personal information with third parties.
            </Text>
          </View>

          {/* Submit Button */}
          <TouchableOpacity
            onPress={handleSubmit}
            disabled={isLoading || !govIdImage || !prcLicenseImage}
            activeOpacity={0.8}
            className={`
              rounded-xl py-4 items-center shadow-sm mb-4
              ${
                isLoading || !govIdImage || !prcLicenseImage
                  ? 'bg-gray-300'
                  : 'bg-teal-700'
              }
            `}
          >
            {isLoading ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <View className="flex-row items-center">
                <Shield size={20} color="#FFFFFF" />
                <Text className="text-white text-base font-bold ml-2">
                  Submit for Verification
                </Text>
              </View>
            )}
          </TouchableOpacity>

          {/* Help Text */}
          <Text className="text-center text-sm text-gray-600">
            Verification typically takes 24-48 hours.{'\n'}
            <Text className="font-semibold">(Demo: Instant verification)</Text>
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}