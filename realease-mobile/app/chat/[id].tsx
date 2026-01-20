import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  Animated,
  ActivityIndicator
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { ArrowLeft, Send } from 'lucide-react-native';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/ctx/AuthContext';
import { mockProperties } from '@/constants/data';

// --- Typing Indicator Component ---
const TypingDots = () => {
  const animations = useRef([new Animated.Value(0), new Animated.Value(0), new Animated.Value(0)]).current;

  useEffect(() => {
    const animate = (index: number) => {
      Animated.sequence([
        Animated.timing(animations[index], { toValue: 1, duration: 300, useNativeDriver: true }),
        Animated.timing(animations[index], { toValue: 0, duration: 300, useNativeDriver: true }),
      ]).start(() => animate(index));
    };
    animations.forEach((_, i) => {
      const timeout = setTimeout(() => animate(i), i * 200);
      return () => clearTimeout(timeout);
    });
  }, []);

  return (
    <View className="flex-row items-center h-4 w-10 justify-between ml-2">
      {animations.map((anim, index) => (
        <Animated.View
          key={index}
          style={{
            width: 6,
            height: 6,
            borderRadius: 3,
            backgroundColor: '#9CA3AF',
            transform: [{ translateY: anim.interpolate({ inputRange: [0, 1], outputRange: [0, -4] }) }],
          }}
        />
      ))}
    </View>
  );
};

export default function ChatScreen() {
  const { id } = useLocalSearchParams();
  const propertyId = Array.isArray(id) ? id[0] : id;
  const { session } = useAuth();
  const router = useRouter();
  const flatListRef = useRef<FlatList>(null);
  
  const property = mockProperties.find((p) => String(p.id) === String(propertyId));
  
  const [inputText, setInputText] = useState('');
  const [messages, setMessages] = useState<any[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [loading, setLoading] = useState(true);

  // 1. Realtime Listener & Initial Load
  useEffect(() => {
    if (!propertyId || !session?.user?.id) return;

    fetchInitialMessages();

    const channel = supabase
      .channel(`property-chat-${propertyId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
          filter: `property_id=eq.${propertyId}`,
        },
        (payload) => {
          const newMessage = payload.new;
          
          setMessages((current) => {
            // Prevent duplicate messages if the user sent it locally
            if (current.some(m => m.id === newMessage.id)) return current;
            
            const formattedMsg = {
              ...newMessage,
              timestamp: newMessage.created_at ? new Date(newMessage.created_at) : new Date(),
              sender: newMessage.sender_id === session.user.id ? 'user' : 'agent'
            };
            return [...current, formattedMsg];
          });

          if (newMessage.sender_id !== session.user.id) {
            setIsTyping(false);
          }
          
          setTimeout(() => flatListRef.current?.scrollToEnd({ animated: true }), 200);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [propertyId, session?.user?.id]);

  const fetchInitialMessages = async () => {
    try {
      const { data, error } = await supabase
        .from('messages')
        .select('*')
        .eq('property_id', String(propertyId))
        .order('created_at', { ascending: true });

      if (error) throw error;

      if (data) {
        const formatted = data.map(m => ({
          ...m,
          timestamp: m.created_at ? new Date(m.created_at) : new Date(),
          sender: m.sender_id === session?.user?.id ? 'user' : 'agent'
        }));
        setMessages(formatted);
      }
    } catch (err) {
      console.error("Fetch error:", err);
    } finally {
      setLoading(false);
      setTimeout(() => flatListRef.current?.scrollToEnd({ animated: false }), 300);
    }
  };

  const sendMessage = async () => {
    if (inputText.trim() === '' || !session?.user?.id) return;

    const messageText = inputText.trim();
    const currentUserId = session.user.id;
    setInputText('');

    try {
      // 🟢 THE FIX: Add (supabase.from('messages') as any) 
      // This stops TypeScript from complaining about the 'insert' method
      const { error } = await (supabase.from('messages') as any).insert([
        {
          text: messageText,
          property_id: String(propertyId),
          sender_id: currentUserId,
          sender_type: 'user', 
        },
      ]);

      if (error) {
        console.error("Supabase Insert Error:", error.message);
        alert("Error: " + error.message);
      }
    } catch (err: any) {
      console.error("General Error:", err.message);
    }
  };

  const renderMessage = ({ item }: any) => {
    const isUser = item.sender === 'user';
    return (
      <View className={`mb-4 flex-row ${isUser ? 'justify-end' : 'justify-start'}`}>
        {!isUser && (
          <View className="bg-teal-700 rounded-full w-8 h-8 items-center justify-center mr-2 self-end mb-1">
            <Text className="text-white text-xs font-bold">{property?.agentName?.charAt(0) || 'A'}</Text>
          </View>
        )}
        <View className={`max-w-[75%] px-4 py-3 rounded-2xl ${isUser ? 'bg-teal-700 rounded-tr-none' : 'bg-gray-200 rounded-tl-none'}`}>
          <Text className={`text-base ${isUser ? 'text-white' : 'text-gray-900'}`}>{item.text}</Text>
          <Text className={`text-[10px] mt-1 ${isUser ? 'text-teal-200' : 'text-gray-500'} self-end`}>
            {item.timestamp instanceof Date ? item.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}
          </Text>
        </View>
      </View>
    );
  };

  if (!property) {
    return (
      <SafeAreaView className="flex-1 bg-white justify-center items-center">
        <Text className="text-gray-500">Property not found</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-white" edges={['top']}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'} 
        className="flex-1" 
        keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
      >
        {/* Header */}
        <View className="bg-white border-b border-gray-200 px-4 py-3 flex-row items-center shadow-sm z-10">
          <TouchableOpacity onPress={() => router.back()} className="mr-3">
            <ArrowLeft size={24} color="#1F2937" />
          </TouchableOpacity>
          <View className="bg-teal-100 rounded-full w-10 h-10 items-center justify-center mr-3">
            <Text className="text-teal-800 text-lg font-bold">{property.agentName?.charAt(0)}</Text>
          </View>
          <View>
            <Text className="text-base font-bold text-gray-900">{property.agentName}</Text>
            <View className="flex-row items-center">
              <View className="w-2 h-2 bg-green-500 rounded-full mr-1.5" />
              <Text className="text-xs text-gray-500 font-medium">Online</Text>
            </View>
          </View>
        </View>

        {loading ? (
          <View className="flex-1 justify-center items-center">
            <ActivityIndicator color="#0F766E" />
          </View>
        ) : (
          <FlatList
            ref={flatListRef}
            data={messages}
            renderItem={renderMessage}
            keyExtractor={(item) => item.id || Math.random().toString()}
            contentContainerStyle={{ padding: 16, paddingBottom: 20 }}
            ListFooterComponent={isTyping ? (
              <View className="flex-row items-center ml-10 mb-4">
                 <View className="bg-gray-200 px-3 py-3 rounded-2xl rounded-tl-none">
                    <TypingDots />
                 </View>
              </View>
            ) : null}
            onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
          />
        )}

        {/* Input */}
        <View className="bg-white border-t border-gray-100 px-4 py-3 pb-6">
          <View className="flex-row items-center bg-gray-100 rounded-full px-1 py-1">
            <TextInput
              value={inputText}
              onChangeText={setInputText}
              placeholder="Type a message..."
              placeholderTextColor="#9CA3AF"
              className="flex-1 ml-4 text-base text-gray-900 h-10"
              onSubmitEditing={sendMessage}
              returnKeyType="send"
            />
            <TouchableOpacity
              onPress={sendMessage}
              disabled={!inputText.trim()}
              className={`w-10 h-10 rounded-full items-center justify-center ${inputText.trim() ? 'bg-teal-700' : 'bg-gray-300'}`}
            >
              <Send size={18} color="white" />
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}