import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Send, ChevronLeft, Bot, User } from 'lucide-react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { supabase } from '@/lib/supabase';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  created_at: string;
}

export default function ChatScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome-1',
      text: 'Hello! I am your Realease AI assistant. How can I help you find your dream home today?',
      sender: 'bot',
      created_at: new Date().toISOString(),
    },
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const flatListRef = useRef<FlatList>(null);

  useEffect(() => {
    if (messages.length > 0) {
      setTimeout(() => {
        flatListRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }
  }, [messages]);

  const sendMessage = async () => {
    if (!message.trim()) return;

    const userText = message.trim();
    setMessage('');

    const userMsg: Message = {
      id: Date.now().toString(),
      text: userText,
      sender: 'user',
      created_at: new Date().toISOString(),
    };
    
    setMessages((prev) => [...prev, userMsg]);
    setIsLoading(true);

    try {
      const { data, error } = await supabase.functions.invoke('ai-chat', {
        body: {
          message: userText,
          propertyDetails: { id: id || 'general' },
        },
      });

      if (error) throw error;

      const botMsg: Message = {
        id: (Date.now() + 1).toString(),
        text: data.answer || "I'm sorry, I couldn't understand that.",
        sender: 'bot',
        created_at: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, botMsg]);

    } catch (error: any) {
      console.error('Chat Error:', error);
      
      // IMPROVED ERROR MESSAGE:
      // This will try to show the specific error from Supabase (like "API Key missing" or "404")
      const errorMessage = error.context?.message || error.message || 'Failed to connect';
      
      Alert.alert('Connection Detail', errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const renderMessage = ({ item }: { item: Message }) => {
    const isUser = item.sender === 'user';
    return (
      <View key={item.id} className={`flex-row mb-4 ${isUser ? 'justify-end' : 'justify-start'}`}>
        {!isUser && (
          <View className="w-8 h-8 rounded-full bg-teal-100 items-center justify-center mr-2">
            <Bot size={16} color="#0F766E" />
          </View>
        )}
        <View
          className={`px-4 py-3 max-w-[80%] ${
            isUser 
              ? 'bg-teal-700 rounded-2xl rounded-tr-none' 
              : 'bg-white border border-gray-200 rounded-2xl rounded-tl-none'
          }`}
        >
          <Text className={`text-base ${isUser ? 'text-white' : 'text-gray-800'}`}>
            {item.text}
          </Text>
          <Text className={`text-[10px] mt-1 ${isUser ? 'text-teal-200' : 'text-gray-400'}`}>
            {new Date(item.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </Text>
        </View>
        {isUser && (
          <View className="w-8 h-8 rounded-full bg-teal-800 items-center justify-center ml-2">
            <User size={16} color="white" />
          </View>
        )}
      </View>
    );
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <View className="px-4 py-3 bg-white border-b border-gray-200 flex-row items-center justify-between">
        <TouchableOpacity onPress={() => router.back()} className="p-2 -ml-2">
          <ChevronLeft size={24} color="#374151" />
        </TouchableOpacity>
        <View className="items-center">
          <Text className="text-lg font-bold text-gray-900">AI Assistant</Text>
          <View className="flex-row items-center">
            <View className="w-2 h-2 rounded-full bg-green-500 mr-1" />
            <Text className="text-xs text-green-600 font-medium">Online</Text>
          </View>
        </View>
        <View className="w-8" />
      </View>

      <FlatList
        ref={flatListRef}
        data={messages}
        keyExtractor={(item) => item.id}
        renderItem={renderMessage}
        contentContainerStyle={{ padding: 16, paddingBottom: 20 }}
        className="flex-1"
        showsVerticalScrollIndicator={false}
      />

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
      >
        <View className="p-4 bg-white border-t border-gray-200">
          <View className="flex-row items-center bg-gray-100 rounded-full px-4 py-2 border border-gray-200">
            <TextInput
              className="flex-1 text-base text-gray-900 max-h-24 mr-2"
              placeholder="Ask about this property..."
              placeholderTextColor="#9CA3AF"
              value={message}
              onChangeText={setMessage}
              multiline
            />
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={sendMessage}
              disabled={isLoading || !message.trim()}
              className={`w-10 h-10 rounded-full items-center justify-center ${
                message.trim() ? 'bg-teal-700' : 'bg-gray-300'
              }`}
            >
              {isLoading ? (
                <ActivityIndicator size="small" color="white" />
              ) : (
                <Send size={18} color="white" />
              )}
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}