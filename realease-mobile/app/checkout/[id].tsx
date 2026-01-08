// app/checkout/[id].tsx
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  Image,
  TouchableOpacity,
  Modal,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import {
  ArrowLeft,
  Shield,
  Lock,
  CreditCard,
  CheckCircle,
  Clock,
  QrCode,
} from 'lucide-react-native';
import { mockProperties } from '../../constants/data';
import { Button } from '../components/Button';

type PaymentMethod = 'gcash' | 'maya' | 'credit';
type PaymentStep = 'checkout' | 'loading' | 'qr' | 'success';

export default function CheckoutScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const [selectedPayment, setSelectedPayment] = useState<PaymentMethod>('gcash');
  const [paymentStep, setPaymentStep] = useState<PaymentStep>('checkout');
  const [countdown, setCountdown] = useState(3);

  const property = mockProperties.find((p) => p.id === id);

  if (!property) {
    return (
      <SafeAreaView className="flex-1 bg-gray-100">
        <View className="flex-1 items-center justify-center">
          <Text className="text-lg text-gray-600">Property not found</Text>
        </View>
      </SafeAreaView>
    );
  }

  const formatPrice = (price: number): string => {
    return `₱${price.toLocaleString('en-PH', { minimumFractionDigits: 2 })}`;
  };

  const reservationFee = 5000;
  const serviceFee = 150;
  const total = reservationFee + serviceFee;

  const paymentMethods = [
    { id: 'gcash', name: 'GCash', icon: '💰' },
    { id: 'maya', name: 'Maya (PayMaya)', icon: '💳' },
    { id: 'credit', name: 'Credit Card', icon: '💳' },
  ];

  const handlePayment = () => {
    setPaymentStep('loading');

    // Step 1: Loading (2 seconds)
    setTimeout(() => {
      setPaymentStep('qr');
      setCountdown(3);
    }, 2000);
  };

  // QR Code countdown timer
  useEffect(() => {
    if (paymentStep === 'qr' && countdown > 0) {
      const timer = setTimeout(() => {
        setCountdown(countdown - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else if (paymentStep === 'qr' && countdown === 0) {
      setPaymentStep('success');
    }
  }, [paymentStep, countdown]);

  const handleReturnHome = () => {
    router.push('/(tabs)');
  };

  const PaymentMethodOption = ({
    method,
  }: {
    method: { id: PaymentMethod; name: string; icon: string };
  }) => (
    <TouchableOpacity
      onPress={() => setSelectedPayment(method.id)}
      activeOpacity={0.7}
      className={`
        flex-row items-center p-4 rounded-xl mb-3
        ${
          selectedPayment === method.id
            ? 'bg-teal-50 border-2 border-teal-700'
            : 'bg-white border border-gray-300'
        }
      `}
    >
      <View className="flex-row items-center flex-1">
        <Text className="text-2xl mr-3">{method.icon}</Text>
        <Text
          className={`text-base font-semibold ${
            selectedPayment === method.id ? 'text-teal-700' : 'text-gray-900'
          }`}
        >
          {method.name}
        </Text>
      </View>
      <View
        className={`
        w-6 h-6 rounded-full border-2 items-center justify-center
        ${
          selectedPayment === method.id
            ? 'border-teal-700 bg-teal-700'
            : 'border-gray-300'
        }
      `}
      >
        {selectedPayment === method.id && (
          <View className="w-3 h-3 rounded-full bg-white" />
        )}
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView className="flex-1 bg-gray-100" edges={['top']}>
      {/* Header */}
      <View className="bg-white px-6 py-4 border-b border-gray-200">
        <View className="flex-row items-center">
          <TouchableOpacity
            onPress={() => router.back()}
            activeOpacity={0.7}
            className="mr-4"
          >
            <ArrowLeft size={24} color="#1F2937" />
          </TouchableOpacity>
          <View>
            <Text className="text-2xl font-bold text-gray-900">
              Secure Reservation
            </Text>
            <Text className="text-sm text-gray-600 mt-1">
              Complete payment to reserve
            </Text>
          </View>
        </View>
      </View>

      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        <View className="px-6 py-6">
          {/* Property Summary Card */}
          <View className="bg-white rounded-2xl overflow-hidden mb-6 shadow-sm">
            <View className="flex-row">
              <Image
                source={{ uri: property.imageUrl }}
                className="w-24 h-24"
                resizeMode="cover"
              />
              <View className="flex-1 p-4">
                <Text className="text-base font-bold text-gray-900 mb-1" numberOfLines={1}>
                  {property.title}
                </Text>
                <Text className="text-sm text-gray-600 mb-2" numberOfLines={1}>
                  {property.location}
                </Text>
                <Text className="text-xl font-bold text-teal-700">
                  {formatPrice(property.price)}
                </Text>
              </View>
            </View>
          </View>

          {/* Trust Badge */}
          <View className="bg-teal-50 border-2 border-teal-700 rounded-xl p-4 mb-6 flex-row items-center">
            <Lock size={24} color="#0F766E" />
            <View className="flex-1 ml-3">
              <Text className="text-sm font-bold text-teal-900 mb-1">
                Secure Escrow Protection
              </Text>
              <Text className="text-xs text-teal-700">
                Funds held securely until viewing is confirmed
              </Text>
            </View>
          </View>

          {/* Cost Breakdown */}
          <View className="bg-white rounded-2xl p-6 mb-6">
            <Text className="text-lg font-bold text-gray-900 mb-4">
              Payment Summary
            </Text>

            <View className="space-y-3">
              <View className="flex-row justify-between items-center pb-3">
                <Text className="text-base text-gray-700">Reservation Fee</Text>
                <Text className="text-base font-semibold text-gray-900">
                  {formatPrice(reservationFee)}
                </Text>
              </View>

              <View className="flex-row justify-between items-center pb-3 border-b border-gray-200">
                <View className="flex-row items-center">
                  <Text className="text-base text-gray-700">Service Fee</Text>
                  <Text className="text-xs text-gray-500 ml-2">(Escrow)</Text>
                </View>
                <Text className="text-base font-semibold text-gray-900">
                  {formatPrice(serviceFee)}
                </Text>
              </View>

              <View className="flex-row justify-between items-center pt-2">
                <Text className="text-lg font-bold text-gray-900">Total</Text>
                <Text className="text-2xl font-bold text-teal-700">
                  {formatPrice(total)}
                </Text>
              </View>
            </View>
          </View>

          {/* Payment Methods */}
          <View className="mb-6">
            <Text className="text-lg font-bold text-gray-900 mb-4">
              Payment Method
            </Text>
            {paymentMethods.map((method) => (
              <PaymentMethodOption
                key={method.id}
                method={method as { id: PaymentMethod; name: string; icon: string }}
              />
            ))}
          </View>

          {/* Security Notice */}
          <View className="bg-gray-50 rounded-xl p-4 mb-6 flex-row items-start">
            <Shield size={20} color="#6B7280" />
            <Text className="flex-1 ml-3 text-xs text-gray-600 leading-5">
              Your payment is protected by 256-bit SSL encryption. Funds are held
              in escrow and only released after viewing confirmation.
            </Text>
          </View>

          {/* Pay Button */}
          <Button
            title={`Pay Securely ${formatPrice(total)}`}
            onPress={handlePayment}
            variant="primary"
            size="lg"
            fullWidth
            icon={<CreditCard size={22} color="#FFFFFF" />}
          />
        </View>
      </ScrollView>

      {/* Payment Modal */}
      <Modal
        visible={paymentStep !== 'checkout'}
        transparent
        animationType="fade"
      >
        <View className="flex-1 bg-black/50 justify-center items-center px-6">
          <View className="bg-white rounded-3xl p-8 w-full max-w-sm">
            {/* Loading State */}
            {paymentStep === 'loading' && (
              <View className="items-center">
                <ActivityIndicator size="large" color="#0F766E" />
                <Text className="text-lg font-bold text-gray-900 mt-6 mb-2">
                  Connecting to GCash...
                </Text>
                <Text className="text-sm text-gray-600 text-center">
                  Please wait while we set up your secure payment
                </Text>
              </View>
            )}

            {/* QR Code State */}
            {paymentStep === 'qr' && (
              <View className="items-center">
                <View className="bg-teal-100 rounded-full p-4 mb-4">
                  <QrCode size={48} color="#0F766E" />
                </View>
                <Text className="text-lg font-bold text-gray-900 mb-2">
                  Scan QR Code
                </Text>
                <Text className="text-sm text-gray-600 text-center mb-6">
                  Open your GCash app and scan this code
                </Text>

                {/* Mock QR Code */}
                <View className="bg-gray-100 w-48 h-48 rounded-2xl items-center justify-center mb-6">
                  <QrCode size={120} color="#1F2937" />
                </View>

                {/* Amount Display */}
                <View className="bg-teal-50 rounded-xl p-4 w-full mb-4">
                  <Text className="text-center text-sm text-gray-600 mb-1">
                    Amount to Pay
                  </Text>
                  <Text className="text-center text-2xl font-bold text-teal-700">
                    {formatPrice(total)}
                  </Text>
                </View>

                {/* Timer */}
                <View className="flex-row items-center">
                  <Clock size={16} color="#6B7280" />
                  <Text className="text-sm text-gray-600 ml-2">
                    Auto-confirming in {countdown}s...
                  </Text>
                </View>
              </View>
            )}

            {/* Success State */}
            {paymentStep === 'success' && (
              <View className="items-center">
                <View className="bg-green-100 rounded-full p-6 mb-6">
                  <CheckCircle size={64} color="#22C55E" />
                </View>
                <Text className="text-2xl font-bold text-gray-900 mb-2">
                  Reservation Confirmed!
                </Text>
                <Text className="text-sm text-gray-600 text-center mb-6">
                  Your payment was successful. The agent will contact you soon.
                </Text>

                {/* Reference Number */}
                <View className="bg-gray-50 rounded-xl p-4 w-full mb-6">
                  <Text className="text-center text-xs text-gray-600 mb-1">
                    Reference Number
                  </Text>
                  <Text className="text-center text-lg font-bold text-gray-900">
                    RE-2026-{property.id.toUpperCase()}XYZ
                  </Text>
                </View>

                {/* Details */}
                <View className="w-full space-y-2 mb-6">
                  <View className="flex-row justify-between py-2 border-b border-gray-200">
                    <Text className="text-sm text-gray-600">Property</Text>
                    <Text className="text-sm font-semibold text-gray-900" numberOfLines={1}>
                      {property.title.length > 20
                        ? property.title.substring(0, 20) + '...'
                        : property.title}
                    </Text>
                  </View>
                  <View className="flex-row justify-between py-2 border-b border-gray-200">
                    <Text className="text-sm text-gray-600">Amount Paid</Text>
                    <Text className="text-sm font-semibold text-teal-700">
                      {formatPrice(total)}
                    </Text>
                  </View>
                  <View className="flex-row justify-between py-2">
                    <Text className="text-sm text-gray-600">Status</Text>
                    <View className="flex-row items-center">
                      <View className="w-2 h-2 rounded-full bg-green-500 mr-2" />
                      <Text className="text-sm font-semibold text-green-600">
                        Confirmed
                      </Text>
                    </View>
                  </View>
                </View>

                <Button
                  title="Return to Home"
                  onPress={handleReturnHome}
                  variant="primary"
                  size="lg"
                  fullWidth
                />
              </View>
            )}
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}