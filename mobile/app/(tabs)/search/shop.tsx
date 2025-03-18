import React, { useEffect, useState } from "react"
import {
  ScrollView,
  View,
  Text,
  TextInput,
  Image,
  TouchableOpacity,
} from "react-native"
import { StatusBar } from "expo-status-bar"
import { useLocalSearchParams } from "expo-router"
import { BASE_URL } from "../../../config"
import { useRouter } from "expo-router"
import { SafeAreaView } from "react-native-safe-area-context"

interface Product {
  id: number
  name: string
  description: string
  image: string
  price: number
  discount: number
  quantity: number
  categoryId: number
}

interface PartResponse {
  parts: Product[]
  totalPages: number
  totalElements: number
}

export default function Shop() {
  const router = useRouter()
  const { search, category } = useLocalSearchParams() // Pobranie tekstu wyszukiwania z URL-a
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [pageNo, setPageNo] = useState<number>(0)
  const [pageSize, setPageSize] = useState<number>(10)
  const [lastQuery, setLastQuery] = useState<string>("")
  const [totalPages, setTotalPages] = useState<number>(0)
  const [filterText, setFilterText] = useState<string>("") // Pole do filtrowania produktów

  useEffect(() => {
    // Ustawienie domyślnego tekstu filtra na podstawie parametru `search`
    if (search) {
      setFilterText(search as string)
    }
  }, [search])

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true)
        let url = `${BASE_URL}/partPageable?pageNo=${pageNo}&pageSize=${pageSize}`

        if (category) {
          url = `${BASE_URL}/part/category/${category}?pageNo=${pageNo}&pageSize=${pageSize}`
        }

        setLastQuery(url)
        const response = await fetch(url)
        const data: PartResponse = await response.json()

        setProducts(data.parts || [])
        setTotalPages(data.totalPages || 0)
      } catch (error) {
        console.error("Error fetching products:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchProducts()
  }, [category, pageNo, pageSize])

  // Filtrowanie produktów na podstawie wpisanego tekstu
  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(filterText.toLowerCase())
  )

  return (
    <View className="h-full bg-black">
      <SafeAreaView className="flex-1">
        <ScrollView contentContainerStyle={{ paddingBottom: 50, flexGrow: 1 }}>
          <View className="p-4">
            {/* Pole tekstowe do filtrowania */}
            <TextInput
              placeholder="Search by name..."
              placeholderTextColor="#999"
              value={filterText}
              onChangeText={setFilterText} // Aktualizacja filtra na podstawie wpisywanego tekstu
              className="bg-gray-800 text-white p-2 rounded-md mb-4"
            />
          </View>

          {loading ? (
            <View className="flex-1 items-center justify-center">
              <Text className="text-white">Loading...</Text>
            </View>
          ) : filteredProducts.length === 0 ? (
            <View className="flex-1 items-center justify-center">
              <Text className="text-white text-center">No products found.</Text>
              <Text className="text-gray-400 text-sm text-center mt-2">
                Last query: {lastQuery}
              </Text>
            </View>
          ) : (
            <View className="my-2 flex-row flex-wrap justify-between">
              {filteredProducts.map((product, index) => (
                <TouchableOpacity
                  key={product.id}
                  onPress={() => {
                    router.push(`/product/${product.id}`)
                  }}
                  className={`p-1 shadow-sm shadow-gray-400 ${
                    index % 3 === 0 ? "w-2/3" : "w-1/3"
                  }`}
                >
                  <View className="bg-gray-200 rounded-lg items-center overflow-hidden h-48">
                    <Image
                      source={{ uri: product.image }}
                      className="w-full h-32 rounded-lg"
                    />
                    <Text
                      className="text-black text-md pt-2 pb-1 text-center"
                      style={{ lineHeight: 14 }}
                    >
                      {product.name}
                    </Text>
                    <Text className="text-gray-400 text-sm">
                      ${product.price.toFixed(2)}
                    </Text>
                    {product.discount > 0 && (
                      <Text className="text-red-500 text-xs">
                        -{product.discount}% Off
                      </Text>
                    )}
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </ScrollView>

        <View className="flex-row justify-between p-4">
          <TouchableOpacity
            onPress={() => setPageNo((prev) => Math.max(prev - 1, 0))}
            className="bg-gray-800 p-2 rounded-lg"
            disabled={pageNo === 0}
          >
            <Text className="text-white">Previous</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setPageNo((prev) => prev + 1)}
            disabled={pageNo >= totalPages - 1}
            className={`bg-gray-800 p-2 rounded-lg ${
              pageNo >= totalPages - 1 ? "opacity-50" : ""
            }`}
          >
            <Text className="text-white">Next</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
      <StatusBar backgroundColor={`rgba(0,0,0,1)`} style="light" />
    </View>
  )
}
