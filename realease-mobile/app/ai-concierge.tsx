import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { ArrowLeft, Send, Sparkles } from 'lucide-react-native';
// IMPORT THE NEW FUNCTION WE JUST FIXED
import { getAIGeneralResponse } from '@/lib/gemini';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'ai';
}

export default function AiConciergeScreen() {
  const router = useRouter();
  const flatListRef = useRef<FlatList>(null);
  
  const [inputText, setInputText] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: "Hello! I'm your RealEase AI Guide. I can tell you about Cebu neighborhoods, average prices, and local real estate tips. Ask me anything!",
      sender: 'ai',
    },
  ]);
  const [isTyping, setIsTyping] = useState(false);

  const handleSend = async () => {
    if (!inputText.trim() || isTyping) return;

    const userText = inputText.trim();
    const userMsg: Message = { id: Date.now().toString(), text: userText, sender: 'user' };
    
    setMessages((prev) => [...prev, userMsg]);
    setInputText('');
    setIsTyping(true);

    try {
      // CALLING GOOGLE DIRECTLY (via lib/gemini.ts)
      const aiResponse = await getAIGeneralResponse(userText);
      
      const aiMsg: Message = {
        id: (Date.now() + 1).toString(),
        text: aiResponse,
        sender: 'ai',
      };
      
      setMessages((prev) => [...prev, aiMsg]);
    } catch (error) {
      console.error("Chat UI Error:", error);
      setMessages((prev) => [
        ...prev, 
        { id: 'err', text: "I'm having trouble connecting to my brain. Please check your internet!", sender: 'ai' }
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  const renderMessage = ({ item }: { item: Message }) => {
    const isUser = item.sender === 'user';
    return (
      <View className={`mb-6 ${isUser ? 'items-end' : 'items-start'}`}>
        <View 
          className={`px-4 py-3 rounded-2xl max-w-[85%] ${
            isUser ? 'bg-teal-700 rounded-tr-none' : 'bg-gray-100 rounded-tl-none'
          }`}
        >
          <Text className={`text-base ${isUser ? 'text-white' : 'text-gray-800'}`}>
            {item.text}
          </Text>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView className="flex-1 bg-white" edges={['top']}>
      {/* Header */}
      <View className="px-4 py-3 border-b border-gray-100 flex-row items-center bg-white shadow-sm z-10">
        <TouchableOpacity onPress={() => router.back()} className="mr-3">
          <ArrowLeft size={24} color="#1F2937" />
        </TouchableOpacity>
        <Sparkles size={20} color="#0F766E" />
        <Text className="ml-2 text-xl font-bold text-gray-900">AI Concierge</Text>
      </View>

      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'} 
        className="flex-1"
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
      >
        <FlatList
          ref={flatListRef}
          data={messages}
          keyExtractor={(item) => item.id}
          renderItem={renderMessage}
          contentContainerStyle={{ padding: 16, paddingBottom: 32 }}
          onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
        />

        {isTyping && (
          <View className="px-6 py-2 flex-row items-center">
            <ActivityIndicator size="small" color="#0F766E" />
            <Text className="text-xs text-gray-400 italic ml-2">Consulting market knowledge...</Text>
          </View>
        )}

        <View className="p-4 border-t border-gray-100 bg-white mb-2">
          <View className="flex-row items-center bg-gray-50 rounded-full px-4 border border-gray-200">
            <TextInput
              className="flex-1 py-3 text-base text-gray-900"
              placeholder="e.g., Where is a good place to live near IT Park?"
              value={inputText}
              onChangeText={setInputText}
              onSubmitEditing={handleSend}
            />
            <TouchableOpacity onPress={handleSend} disabled={!inputText.trim() || isTyping}>
              <View className={`p-2 rounded-full ${inputText.trim() ? 'bg-teal-700' : 'bg-gray-300'}`}>
                <Send size={18} color="white" />
              </View>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}