import React, { useEffect, useState } from "react"
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Alert,
  ActivityIndicator,
} from "react-native"
import { useNavigation } from "expo-router"
import { BASE_URL, STRIPE_URL } from "../config"
import { useStripe } from "@stripe/stripe-react-native"
import AsyncStorage from "@react-native-async-storage/async-storage"
import { SafeAreaView } from "react-native-safe-area-context"

interface Part {
  id: number
  name: string
  price: number
  quantity: number
  discount: number
}

interface ShippingOption {
  id: number
  name: string
  price: number
}

const Checkout: React.FC = () => {
  const [cartItems, setCartItems] = useState<Part[]>([])
  const [shippingOptions, setShippingOptions] = useState<ShippingOption[]>([])
  const [selectedShipping, setSelectedShipping] =
    useState<ShippingOption | null>(null)
  const [totalPrice, setTotalPrice] = useState<number>(0)
  const [transactionId, setTransactionId] = useState<number | null>(null) // Zmienna dla ID transakcji
  const [paymentMethods, setPaymentMethods] = useState<string[]>([])
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<
    string | null
  >(null)
  const [loading, setLoading] = useState<boolean>(false)

  const navigation = useNavigation()
  const { initPaymentSheet, presentPaymentSheet } = useStripe()

  useEffect(() => {
    fetchTransactionAndCart()
    fetchShippingOptions()
    fetchPaymentMethods()
  }, [])

  // Funkcja do pobierania tokena i userId z AsyncStorage
  const getAuthData = async (): Promise<{
    token: string | null
    userId: string | null
  }> => {
    try {
      const token = await AsyncStorage.getItem("token")
      const userId = await AsyncStorage.getItem("userId")
      return { token, userId }
    } catch (error) {
      console.error("Error getting auth data:", error)
      return { token: null, userId: null }
    }
  }

  // Funkcja do pobierania ID transakcji i szczegółów koszyka
  const fetchTransactionAndCart = async () => {
    const { token, userId } = await getAuthData()

    if (!userId || !token) {
      Alert.alert("Error", "You must be logged in to proceed.")
      return
    }

    try {
      setLoading(true)
      const response = await fetch(
        `${BASE_URL}/transaction/ongoing/${userId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )

      if (!response.ok) {
        throw new Error("Failed to fetch cart items.")
      }

      const data = await response.json()
      const transactionParts = data.transactionParts || []
      const items: Part[] = transactionParts.map((transactionPart: any) => ({
        id: transactionPart.partDto.id,
        name: transactionPart.partDto.name,
        price: transactionPart.partDto.price,
        quantity: transactionPart.quantity,
        discount: transactionPart.partDto.discount,
      }))

      setCartItems(items)
      setTransactionId(data.id) // Przypisanie ID transakcji
      calculateTotalPrice(items)
    } catch (error) {
      console.error("Error fetching transaction and cart:", error)
      Alert.alert("Error", "Unable to fetch cart details.")
    } finally {
      setLoading(false)
    }
  }

  const fetchShippingOptions = async () => {
    try {
      const response = await fetch(`${BASE_URL}/shipping`)
      if (!response.ok) {
        throw new Error("Failed to fetch shipping options.")
      }

      const data = await response.json()
      setShippingOptions(data)
    } catch (error) {
      console.error("Error fetching shipping options:", error)
    }
  }

  const fetchPaymentMethods = async () => {
    try {
      // Przyjmujemy predefiniowane metody płatności
      const methods = ["Credit Card"]
      setPaymentMethods(methods)
    } catch (error) {
      console.error("Error fetching payment methods:", error)
    }
  }

  const calculateTotalPrice = (cartItems: Part[]) => {
    let total = 0
    cartItems.forEach((item) => {
      const itemPrice = item.price * item.quantity
      const discountAmount = item.discount
        ? itemPrice * (item.discount / 100)
        : 0
      total += itemPrice - discountAmount
    })
    if (selectedShipping) {
      total += selectedShipping.price
    }
    setTotalPrice(total)
  }

  const handleShippingChange = (shippingOption: ShippingOption) => {
    setSelectedShipping(shippingOption)
    calculateTotalPrice(cartItems)
  }

  const handleCheckout = async () => {
    if (!selectedShipping) {
      Alert.alert("Error", "Please select a shipping method.")
      return
    }

    if (!selectedPaymentMethod) {
      Alert.alert("Error", "Please select a payment method.")
      return
    }

    const { token, userId } = await getAuthData()

    if (!userId || !token) {
      Alert.alert("Error", "User authentication data is missing.")
      return
    }

    if (!transactionId) {
      Alert.alert("Error", "Transaction ID is missing.")
      return
    }

    try {
      setLoading(true)

      // Tworzenie PaymentIntent
      const response = await fetch(`${STRIPE_URL}payment/create-intent`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount: totalPrice * 100 }),
      })

      if (!response.ok) {
        throw new Error("Failed to create payment intent")
      }

      const data = await response.json()
      const { clientSecret } = data

      // Inicjalizacja arkusza płatności
      const { error } = await initPaymentSheet({
        paymentIntentClientSecret: clientSecret,
        merchantDisplayName: "Auto Parts Store",
      })

      if (error) {
        console.error("Error initializing payment sheet:", error)
        Alert.alert("Error", "Payment setup failed.")
        return
      }

      // Prezentacja arkusza płatności
      const { error: paymentError } = await presentPaymentSheet()

      if (paymentError) {
        console.error("Payment failed:", paymentError)
        Alert.alert("Error", "Payment failed. Please try again.")
        return
      }

      Alert.alert("Success", "Payment completed successfully.")

      // Ustawienie metody wysyłki
      const shippingResponse = await fetch(
        `${BASE_URL}/transaction/${transactionId}/shipping/${selectedShipping.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      )

      if (!shippingResponse.ok) {
        const errorText = await shippingResponse.text()
        throw new Error(`Failed to set shipping method: ${errorText}`)
      }

      // Zmiana statusu transakcji na PAID
      const statusResponse = await fetch(
        `${BASE_URL}/transaction/${transactionId}/status/PAID`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      )

      if (!statusResponse.ok) {
        const errorText = await statusResponse.text()
        throw new Error(`Failed to update transaction status: ${errorText}`)
      }

      // Utworzenie nowej transakcji
      const newTransactionResponse = await fetch(
        `${BASE_URL}/transaction/create/${userId}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      )

      if (!newTransactionResponse.ok) {
        const errorText = await newTransactionResponse.text()
        throw new Error(`Failed to create new transaction: ${errorText}`)
      }

      Alert.alert("Success", "Transaction completed and status updated.")

      // Przejście do ekranu potwierdzenia zamówienia
      navigation.navigate("orderConfirmation")
    } catch (error: any) {
      console.error("Checkout error:", error)
      Alert.alert("Error", `Something went wrong: ${error.message}`)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "black",
        }}
      >
        <ActivityIndicator size="large" color="#fff" />
        <Text style={{ color: "white", marginTop: 10 }}>Processing...</Text>
      </View>
    )
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "black" }}>
      <ScrollView style={{ padding: 20 }}>
        <Text style={{ color: "white", fontSize: 24, marginBottom: 20 }}>
          Checkout
        </Text>

        <Text style={{ color: "white", fontSize: 18 }}>Your Items</Text>
        {cartItems.map((item) => (
          <View key={item.id} style={{ marginBottom: 15 }}>
            <Text style={{ color: "white" }}>
              {item.name} x {item.quantity} - $
              {(
                item.price * item.quantity -
                (item.discount * (item.price * item.quantity)) / 100
              ).toFixed(2)}
            </Text>
          </View>
        ))}

        <Text style={{ color: "white", fontSize: 18, marginTop: 20 }}>
          Shipping
        </Text>
        {shippingOptions.map((option) => (
          <TouchableOpacity
            key={option.id}
            onPress={() => handleShippingChange(option)}
            style={{
              backgroundColor:
                selectedShipping?.id === option.id ? "green" : "gray",
              padding: 10,
              marginBottom: 10,
              borderRadius: 5,
            }}
          >
            <Text style={{ color: "white" }}>
              {option.name} - ${option.price}
            </Text>
          </TouchableOpacity>
        ))}

        <Text style={{ color: "white", fontSize: 18, marginTop: 20 }}>
          Payment Method
        </Text>
        {paymentMethods.map((method) => (
          <TouchableOpacity
            key={method}
            onPress={() => setSelectedPaymentMethod(method)}
            style={{
              backgroundColor:
                selectedPaymentMethod === method ? "green" : "gray",
              padding: 10,
              marginBottom: 10,
              borderRadius: 5,
            }}
          >
            <Text style={{ color: "white" }}>{method}</Text>
          </TouchableOpacity>
        ))}

        <Text style={{ color: "white", fontSize: 18, marginTop: 20 }}>
          Total: ${totalPrice.toFixed(2)}
        </Text>

        <TouchableOpacity
          onPress={handleCheckout}
          style={{
            backgroundColor: "blue",
            padding: 15,
            borderRadius: 5,
            marginTop: 20,
            alignItems: "center",
          }}
        >
          <Text style={{ color: "white", textAlign: "center", fontSize: 18 }}>
            Complete Payment
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  )
}

export default Checkout
