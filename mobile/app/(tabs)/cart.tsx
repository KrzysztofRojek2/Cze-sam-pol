import React, { useState } from "react"
import {
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from "react-native"
import AsyncStorage from "@react-native-async-storage/async-storage"
import { useNavigation, useFocusEffect } from "expo-router"
import { BASE_URL } from "../../config"
import { SafeAreaView } from "react-native-safe-area-context"

interface Part {
  id: number
  name: string
  description: string
  image: string
  price: number
  discount: number
}

interface CartItem {
  partDto: Part
  quantity: number
}

const Cart: React.FC = () => {
  const [cartItems, setCartItems] = useState<CartItem[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [transactionId, setTransactionId] = useState<number | null>(null) // Dodaj stan dla transactionId
  const navigation = useNavigation()

  useFocusEffect(
    React.useCallback(() => {
      fetchCartItems()
    }, [])
  )

  const fetchCartItems = async () => {
    try {
      setLoading(true)
      const userId = await getUserId()
      if (!userId) {
        Alert.alert("Error", "You must be logged in to view your cart.")
        return
      }

      const token = await getToken()
      const response = await fetch(
        `${BASE_URL}/transaction/ongoing/${userId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )

      const data = await response.json()

      // Sortowanie elementów koszyka alfabetycznie po nazwie
      const sortedItems = (data.transactionParts || []).sort(
        (a: CartItem, b: CartItem) =>
          a.partDto.name.localeCompare(b.partDto.name)
      )

      setCartItems(sortedItems)
      setTransactionId(data.id) // Przypisz transactionId z odpowiedzi
    } catch (error) {
      // console.error("Error fetching cart items:", error)
      // Alert.alert("Error", "Unable to fetch cart items.")
    } finally {
      setLoading(false)
    }
  }

  const getToken = async (): Promise<string | null> => {
    try {
      return await AsyncStorage.getItem("token")
    } catch (error) {
      console.error("Error getting token:", error)
      return null
    }
  }

  const getUserId = async (): Promise<string | null> => {
    try {
      return await AsyncStorage.getItem("userId")
    } catch (error) {
      console.error("Error getting userId:", error)
      return null
    }
  }

  const goToCheckout = () => {
    // Przejdź do ekranu checkout
    navigation.navigate("checkout")
  }

  const increaseQuantity = async (partId: number) => {
    try {
      if (!transactionId) {
        throw new Error("Transaction ID is missing.")
      }

      const token = await getToken()
      const response = await fetch(
        `${BASE_URL}/transaction/${transactionId}/parts/${partId}/increase`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      )

      const updatedCartItems = cartItems.map((item) => {
        if (item.partDto.id === partId) {
          return {
            ...item,
            quantity: item.quantity + 1, // Zwiększ ilość o 1
          };
        }
        return item;
      });
      setCartItems(updatedCartItems)

      if (!response.ok) {
        throw new Error("Failed to increase quantity.")
      }

    } catch (error) {
      console.error("Error increasing quantity:", error)
      Alert.alert("Error", "Failed to increase quantity.")
    }
  }

  const decreaseQuantity = async (partId: number, quantity: number) => {
    let isZero = false;
    try {
      if (!transactionId) {
        throw new Error("Transaction ID is missing.")
      }

      const token = await getToken()
      if (quantity >= 1) {
        const response = await fetch(
          `${BASE_URL}/transaction/${transactionId}/parts/${partId}/decrease`,
          {
            method: "PUT",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        )

        if (!response.ok) {
          throw new Error("Failed to decrease quantity.")
        }

        

        const updatedCartItems = cartItems.map((item) => {
          if (item.partDto.id === partId) {
            if(item.quantity - 1 === 0 )
              isZero = true
            return {
              ...item,
              quantity: item.quantity - 1, // Zwiększ ilość o 1
            };
          }
          return item;
        });
        setCartItems(updatedCartItems)
      } else {
        const response = await fetch(
          `${BASE_URL}/transaction/${transactionId}/parts/${partId}`,
          {
            method: "DELETE",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        )

        if (!response.ok) {
          throw new Error("Failed to remove product.")
        }
      }

    } catch (error) {
      console.error("Error decreasing quantity:", error)
      Alert.alert("Error", "Failed to update quantity.")
    }

    if(isZero)
      fetchCartItems() // Odśwież koszyk po zmianie
  }

  if (loading) {
    return (
      <View className="flex-1 items-center justify-center bg-black">
        <ActivityIndicator size="large" color="#fff" />
        <Text className="text-white mt-4">Loading your cart...</Text>
      </View>
    )
  }

  if (cartItems.length === 0) {
    return (
      <View className="flex-1 items-center justify-center bg-black">
        <Text className="text-white text-lg">Your cart is empty.</Text>
      </View>
    )
  }

  return (
    <SafeAreaView className="flex-1 bg-black">
      <ScrollView contentContainerStyle={{ paddingBottom: 20 }}>
        <View className="p-4">
          {cartItems.map((item) => (
            <View
              key={item.partDto.id}
              className="flex-row items-center bg-gray-800 p-4 mb-4 rounded-lg"
            >
              <Image
                source={{ uri: item.partDto.image }}
                style={{ width: 80, height: 80, borderRadius: 10 }}
              />
              <View className="ml-4 flex-1">
                <Text className="text-white text-lg font-bold">
                  {item.partDto.name}
                </Text>
                <Text className="text-gray-400 text-sm">
                  {item.partDto.description}
                </Text>
                <Text className="text-gray-300 text-md">
                  ${item.partDto.price.toFixed(2)}
                </Text>
                <Text className="text-gray-400 text-sm">
                  Quantity: {item.quantity}
                </Text>
              </View>
              <View className="flex-row space-x-2">
                <TouchableOpacity
                  onPress={() =>
                    decreaseQuantity(item.partDto.id, item.quantity)
                  }
                  className="bg-red-500 px-2 py-1 rounded-lg"
                >
                  <Text className="text-white">-</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => increaseQuantity(item.partDto.id)}
                  className="bg-green-500 px-2 py-1 rounded-lg"
                >
                  <Text className="text-white">+</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))}
        </View>
        <TouchableOpacity
          onPress={goToCheckout}
          className="bg-blue-500 px-6 py-3 rounded-lg mx-4 my-4"
        >
          <Text className="text-white text-lg text-center">Go to Checkout</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  )
}

export default Cart
