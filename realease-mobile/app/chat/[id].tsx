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
  Easing
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { ArrowLeft, Send } from 'lucide-react-native';
import { mockProperties } from '@/constants/data';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'agent';
  timestamp: Date;
}

// 🟢 Custom Typing Indicator Component (Guaranteed Animation)
const TypingDots = () => {
  const [animations] = useState([
    new Animated.Value(0),
    new Animated.Value(0),
    new Animated.Value(0)
  ]);

  useEffect(() => {
    const animate = (index: number) => {
      Animated.sequence([
        Animated.timing(animations[index], {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(animations[index], {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start(() => animate(index));
    };

    // Stagger the animations
    setTimeout(() => animate(0), 0);
    setTimeout(() => animate(1), 200);
    setTimeout(() => animate(2), 400);
  }, []);

  return (
    <View className="flex-row items-center h-4 w-10 justify-between">
      {animations.map((anim, index) => (
        <Animated.View
          key={index}
          style={{
            width: 8,
            height: 8,
            borderRadius: 4,
            backgroundColor: '#9CA3AF',
            transform: [
              {
                translateY: anim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0, -6], // Bounce up by 6px
                }),
              },
            ],
          }}
        />
      ))}
    </View>
  );
};

export default function ChatScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const flatListRef = useRef<FlatList>(null);
  
  const property = mockProperties.find((p) => p.id === id);
  const [inputText, setInputText] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [isTyping, setIsTyping] = useState(false);

  useEffect(() => {
    if (property) {
      setMessages([{
        id: 'greeting',
        text: `Hello! I'm ${property.agentName}. How can I help you with ${property.title}?`,
        sender: 'agent',
        timestamp: new Date(),
      }]);
    }
  }, [property]);

  if (!property) {
    return (
      <SafeAreaView className="flex-1 bg-gray-100">
        <View className="flex-1 items-center justify-center">
          <Text className="text-lg text-gray-600">Property not found</Text>
        </View>
      </SafeAreaView>
    );
  }

  const formatPrice = (price: number) => `₱${price.toLocaleString('en-PH')}`;

  const generateAutoReply = (userMessage: string): string => {
    const lower = userMessage.toLowerCase();
    if (lower.includes('viewing') || lower.includes('visit')) return "I'm available this Tuesday and Thursday! What time works best?";
    if (lower.includes('price') || lower.includes('cost')) return `It is listed at ${formatPrice(property.price)}. We also accept bank financing!`;
    if (lower.includes('location') || lower.includes('where')) return `It is located at ${property.location}. Very close to major landmarks.`;
    if (lower.includes('thanks') || lower.includes('thank')) return "You're welcome! Let me know if you have other questions.";
    return "That's a great question! Let me check the owner's files and get back to you in a moment.";
  };

  const sendMessage = () => {
    if (inputText.trim() === '') return;

    const userMsg: Message = {
      id: Date.now().toString(),
      text: inputText.trim(),
      sender: 'user',
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputText('');
    setIsTyping(true);

    // Auto-scroll to bottom
    setTimeout(() => flatListRef.current?.scrollToEnd(), 100);

    // Fake Agent Reply
    setTimeout(() => {
      const replyMsg: Message = {
        id: (Date.now() + 1).toString(),
        text: generateAutoReply(userMsg.text),
        sender: 'agent',
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, replyMsg]);
      setIsTyping(false);
      setTimeout(() => flatListRef.current?.scrollToEnd(), 100);
    }, 2000); // 2 second delay for realism
  };

  const renderMessage = ({ item }: { item: Message }) => {
    const isUser = item.sender === 'user';
    return (
      <View className={`mb-4 flex-row ${isUser ? 'justify-end' : 'justify-start'}`}>
        {!isUser && (
          <View className="bg-teal-700 rounded-full w-8 h-8 items-center justify-center mr-2 self-end mb-1">
            <Text className="text-white text-xs font-bold">{property.agentName.charAt(0)}</Text>
          </View>
        )}
        <View className={`max-w-[75%] px-4 py-3 rounded-2xl ${isUser ? 'bg-teal-700 rounded-tr-none' : 'bg-gray-200 rounded-tl-none'}`}>
          <Text className={`text-base ${isUser ? 'text-white' : 'text-gray-900'}`}>{item.text}</Text>
          <Text className={`text-[10px] mt-1 ${isUser ? 'text-teal-200' : 'text-gray-500'} self-end`}>
            {item.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </Text>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView className="flex-1 bg-white" edges={['top']}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} className="flex-1" keyboardVerticalOffset={0}>
        
        {/* Header */}
        <View className="bg-white border-b border-gray-200 px-4 py-3 flex-row items-center shadow-sm z-10">
          <TouchableOpacity onPress={() => router.back()} className="mr-3">
            <ArrowLeft size={24} color="#1F2937" />
          </TouchableOpacity>
          <View className="bg-teal-100 rounded-full w-10 h-10 items-center justify-center mr-3">
            <Text className="text-teal-800 text-lg font-bold">{property.agentName.charAt(0)}</Text>
          </View>
          <View>
            <Text className="text-base font-bold text-gray-900">{property.agentName}</Text>
            <View className="flex-row items-center">
              <View className="w-2 h-2 bg-green-500 rounded-full mr-1.5" />
              <Text className="text-xs text-gray-500 font-medium">Online</Text>
            </View>
          </View>
        </View>

        {/* List */}
        <FlatList
          ref={flatListRef}
          data={messages}
          renderItem={renderMessage}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ padding: 16, paddingBottom: 20 }}
          ListFooterComponent={
            isTyping ? (
              <View className="flex-row items-center ml-10 mb-4">
                <View className="bg-gray-200 px-4 py-3 rounded-2xl rounded-tl-none">
                  <TypingDots />
                </View>
              </View>
            ) : null
          }
        />

        {/* Input */}
        <View className="bg-white border-t border-gray-100 px-4 py-3 pb-6">
          <View className="flex-row items-center bg-gray-100 rounded-full px-1 py-1">
            <TextInput
              value={inputText}
              onChangeText={setInputText}
              placeholder="Type a message..."
              placeholderTextColor="#9CA3AF"
              className="flex-1 ml-4 text-base text-gray-900 h-10" // Fixed height prevents jump
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