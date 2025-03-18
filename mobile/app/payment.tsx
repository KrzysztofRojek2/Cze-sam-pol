import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Alert, StyleSheet } from 'react-native';
import { useStripe } from '@stripe/stripe-react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { BASE_URL } from '../config';

const PaymentScreen = () => {
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const { initPaymentSheet, presentPaymentSheet } = useStripe();

  useEffect(() => {
    // Fetch payment intent on component mount
    fetchPaymentIntent();
  }, []);

  const fetchPaymentIntent = async () => {
    const token = await AsyncStorage.getItem('token');
    const userId = await AsyncStorage.getItem('userId');
    if (!userId || !token) {
      Alert.alert('Error', 'You must be logged in to proceed with payment.');
      return;
    }

    try {
      const response = await fetch(`${BASE_URL}/payment/create-intent`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          amount: 5000, // Example: 50 USD in cents
          currency: 'usd',
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to create payment intent.');
      }

      const { clientSecret } = await response.json();
      setClientSecret(clientSecret);
      initializePaymentSheet(clientSecret);
    } catch (error) {
      console.error('Error fetching payment intent:', error);
    }
  };

  const initializePaymentSheet = async (clientSecret: string) => {
    const { error } = await initPaymentSheet({
      paymentIntentClientSecret: clientSecret,
    });

    if (error) {
      console.error('Error initializing payment sheet:', error);
      Alert.alert('Error', 'Failed to initialize payment sheet.');
    }
  };

  const openPaymentSheet = async () => {
    if (!clientSecret) return;

    const { error } = await presentPaymentSheet();

    if (error) {
      console.error('Payment failed:', error);
      Alert.alert('Payment failed', error.message);
    } else {
      Alert.alert('Success', 'Your payment was successful!');
      // Update transaction status on the server
      finalizeTransaction();
    }
  };

  const finalizeTransaction = async () => {
    const token = await AsyncStorage.getItem('token');
    const userId = await AsyncStorage.getItem('userId');
    if (!userId || !token) {
      Alert.alert('Error', 'You must be logged in to finalize the transaction.');
      return;
    }

    try {
      const response = await fetch(`${BASE_URL}/transaction/${userId}/status/PAID`, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to update transaction status.');
      }

      Alert.alert('Success', 'Transaction completed and marked as PAID.');
    } catch (error) {
      console.error('Error finalizing transaction:', error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Complete Your Payment</Text>
      <TouchableOpacity
        onPress={openPaymentSheet}
        style={styles.button}
        disabled={!clientSecret}>
        <Text style={styles.buttonText}>Pay Now</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'black' },
  title: { color: 'white', fontSize: 24, marginBottom: 20 },
  button: { backgroundColor: 'blue', padding: 15, borderRadius: 5 },
  buttonText: { color: 'white', fontSize: 18 },
});

export default PaymentScreen;
