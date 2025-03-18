import React, { useEffect, useState } from "react"
import {
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from "react-native"
import { useLocalSearchParams, useNavigation, useRouter } from "expo-router"
import AsyncStorage from "@react-native-async-storage/async-storage"
import { BASE_URL } from "../../config"
import { SafeAreaView } from "react-native-safe-area-context"
import { logout } from "@/services/authService"

interface Product {
  id: number
  name: string
  description: string
  image: string
  price: number
  discount: number
  quantity: number
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

const getOngoingTransaction = async (userId: string): Promise<any> => {
  try {
    const token = await getToken()
    const response = await fetch(`${BASE_URL}/transaction/ongoing/${userId}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    })

    return await response.json()
  } catch (error) {}
}

const createTransaction = async (userId: string): Promise<any> => {
  try {
    const token = await getToken()
    const response = await fetch(`${BASE_URL}/transaction/create/${userId}`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    })

    if (!response.ok) {
      throw new Error("Failed to create transaction")
    }

    return await response.json()
  } catch (error) {
    console.error("Error creating transaction:", error)
    throw error
  }
}

const addProductToTransaction = async (
  transactionId: number,
  productId: number
): Promise<void> => {
  try {
    const token = await getToken()
    const response = await fetch(
      `${BASE_URL}/transaction/${transactionId}/parts/${productId}`,
      {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    )

    if (!response.ok) {
      throw new Error("Failed to add product to transaction")
    }
  } catch (error) {
    console.error("Error adding product to transaction:", error)
    throw error
  }
}

const increaseProductQuantity = async (
  transactionId: number,
  productId: number
): Promise<void> => {
  try {
    const token = await getToken()
    const response = await fetch(
      `${BASE_URL}/transaction/${transactionId}/parts/${productId}/increase`,
      {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    )

    if (!response.ok) {
      throw new Error("Failed to increase product quantity")
    }
  } catch (error) {
    console.error("Error increasing product quantity:", error)
    throw error
  }
}

const handleAddOrUpdateProduct = async (
  transactionId: number,
  productId: number
): Promise<void> => {
  try {
    const token = await getToken()
    const response = await fetch(`${BASE_URL}/transaction/${transactionId}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    })

    if (!response.ok) {
      throw new Error("Failed to fetch transaction details")
    }

    const transaction = await response.json()

    const existingProduct = transaction.transactionParts.find(
      (part: any) => part.partDto.id === productId
    )

    if (existingProduct) {
      await increaseProductQuantity(transactionId, productId)
      Alert.alert("Success", "Product quantity updated in your cart.")
    } else {
      await addProductToTransaction(transactionId, productId)
      Alert.alert("Success", "Product added to your cart.")
    }
  } catch (error) {
    console.error("Error handling add/update product:", error)
    Alert.alert("Error", "Failed to update cart.")
  }
}

const ProductPage: React.FC = () => {
  const { id } = useLocalSearchParams()
  const [product, setProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState<boolean>(true)
  const navigation = useNavigation()
  const router = useRouter()
  const [isEmployee, setIsEmployee] = useState(false)

  const checkIfEmployee = async () => {
    const token = await getToken()
    if (token) {
      fetch(`${BASE_URL}/auth/isEmployee`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      })
        .then((response) => response.json())
        .then((data) => setIsEmployee(data))
    }
  }

  useEffect(() => {
    checkIfEmployee()
  }, [])

  useEffect(() => {
    navigation.setOptions({
      headerShown: true,
      title: "",
      headerStyle: {
        backgroundColor: "black",
      },
      headerTintColor: "white",
    })
  }, [navigation])

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true)
        const response = await fetch(`${BASE_URL}/part/${id}`)
        const data = await response.json()
        setProduct(data)
      } catch (error) {
        console.error("Error fetching product:", error)
        Alert.alert("Error", "Unable to fetch product data.")
      } finally {
        setLoading(false)
      }
    }

    if (id) {
      fetchProduct()
    }
  }, [id])

  const handleAddToCart = async () => {
    try {
      const userId = await getUserId()
      if (!userId) {
        Alert.alert("Error", "You must be logged in to add items to the cart.")
        return
      }

      let transaction

      try {
        transaction = await getOngoingTransaction(userId)
      } catch {
        transaction = await createTransaction(userId)
      }

      await handleAddOrUpdateProduct(transaction.id, product!.id)
    } catch (error) {
      console.error("Error adding product to cart:", error)
      Alert.alert("Error", "Failed to add product to cart.")
    }
  }

  if (loading) {
    return (
      <View className="flex-1 items-center justify-center bg-black">
        <ActivityIndicator size="large" color="#fff" />
        <Text className="text-white mt-4">Loading product...</Text>
      </View>
    )
  }

  if (!product) {
    return (
      <View className="flex-1 items-center justify-center bg-black">
        <Text className="text-white">Product not found.</Text>
      </View>
    )
  }

  return (
    <SafeAreaView className="flex-1 bg-black">
      <ScrollView contentContainerStyle={{ paddingBottom: 20 }}>
        <View className="p-4">
          <Image
            source={{ uri: product.image }}
            style={{ width: "100%", height: 300, borderRadius: 10 }}
          />
          <Text className="text-2xl text-white font-bold mt-4">
            {product.name}
          </Text>
          <Text className="text-xl text-gray-400 mt-2">
            ${product.price.toFixed(2)}
          </Text>
          {product.discount > 0 && (
            <Text className="text-lg text-red-500">
              -{product.discount}% Off
            </Text>
          )}
          <Text className="text-md text-white mt-4">{product.description}</Text>
        </View>

        <TouchableOpacity
          className="bg-blue-500 p-4 m-4 rounded-lg items-center"
          onPress={handleAddToCart}
        >
          <Text className="text-white text-lg font-bold">Add to Cart</Text>
        </TouchableOpacity>

        {isEmployee && (
          <TouchableOpacity
            className="bg-red-500 p-4 m-4 rounded-lg items-center"
            onPress={() =>
              router.push({
                pathname: "../profile/reportIssue",
                params: {
                  productName: product.name,
                  productImage: product.image,
                },
              })
            }
          >
            <Text className="text-white text-lg font-bold">Report Issue</Text>
          </TouchableOpacity>
        )}
      </ScrollView>
    </SafeAreaView>
  )
}

export default ProductPage
