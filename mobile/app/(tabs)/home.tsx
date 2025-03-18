import { ScrollView, View, Text, Image, TouchableOpacity } from "react-native"
import { StatusBar } from "expo-status-bar"
import { icons, images } from "../../constants"
import { useRouter } from "expo-router"
import AsyncStorage from "@react-native-async-storage/async-storage"
import { useEffect, useState } from "react"
import { BASE_URL } from "../../config"
import { SafeAreaView } from "react-native-safe-area-context"

interface Subcategory {
  id: number
  name: string
}

interface Category {
  id: number
  name: string
  icon: string
  subcategories: Subcategory[]
}

interface Part {
  id: number
  name: string
  description: string
  image: string
  price: number
  discount: number
  quantity: number
  categoryName: number
  carId: number
}

const products = [
  {
    id: 1,
    name: "Brake Discs",
    category: "Braking System",
    image: images.cat1,
  },
  { id: 2, name: "Brakes", category: "Braking System", image: images.cat2 },
  {
    id: 3,
    name: "Spark Plugs",
    category: "Ignition System",
    image: images.cat3,
  },
  {
    id: 4,
    name: "Brake Discs",
    category: "Braking System",
    image: images.cat1,
  },
  { id: 5, name: "Brakes", category: "Braking System", image: images.cat2 },
]

export default function Home() {
  const router = useRouter()
  const [categories, setCategories] = useState<Category[]>([])
  const [products, setProducts] = useState<Part[]>([])

  useEffect(() => {
    const fetchAndStoreCategories = async () => {
      try {
        const response = await fetch(`${BASE_URL}/category`)
        const data = await response.json()
        setCategories(data)
        await AsyncStorage.setItem("categories", JSON.stringify(data))
      } catch (error) {
        console.error("Error fetching categories:", error)
      }
    }

    fetchAndStoreCategories()
  }, [])

  useEffect(() => {
    if (categories.length > 0) {
      const fetchProducts = async () => {
        try {
          const response = await fetch(
            `${BASE_URL}/partPageable?pageNo=0&pageSize=5`
          )
          const data = await response.json()
          const productsWithCategoryNames = data.parts.map(
            (product: { categoryId: number }) => {
              const category = categories.find(
                (cat) => cat.id === product.categoryId
              )
              return {
                ...product,
                categoryName: category ? category.name : "Unknown",
              }
            }
          )
          setProducts(productsWithCategoryNames)
        } catch (error) {
          console.error("Error fetching products:", error)
        }
      }

      fetchProducts()
    }
  }, [categories])

  return (
    <View className="h-full bg-white">
      <SafeAreaView className="flex-1">
        <ScrollView contentContainerStyle={{ paddingBottom: 50, flexGrow: 1 }}>
          <View className="relative h-60 w-full">
            <Image
              source={images.porshe}
              style={{ width: "100%", height: "100%", resizeMode: "cover" }}
            />
            <TouchableOpacity
              style={{
                position: "absolute",
                top: 15,
                left: 15,
                paddingVertical: 0,
                paddingHorizontal: 0,
                borderRadius: 5,
                overflow: "hidden",
              }}
            >
              <Image source={images.logo} className="w-10 h-10" />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => router.push("/search/shop")}
              style={{
                position: "absolute",
                bottom: 15,
                alignSelf: "center",
                backgroundColor: "#FF8C00",
                paddingVertical: 6,
                paddingHorizontal: 16,
                borderRadius: 25,
              }}
            >
              <Text
                style={{ color: "white", fontWeight: "bold", fontSize: 12 }}
              >
                Products
              </Text>
            </TouchableOpacity>
          </View>

          <View className="bg-black p-4">
            <View className="mb-5 flex-row justify-center items-center">
              <View className="bg-white w-4 h-4 rounded-full mx-2"></View>
              <Text className="text-lg text-center font-bold text-white">
                Car Parts & Accessories
              </Text>
              <View className="bg-white w-4 h-4 rounded-full mx-2"></View>
            </View>
            <View className="flex-row justify-around items-center">
              {categories.slice(0, 6).map((category) => (
                <TouchableOpacity
                  key={category.id}
                  onPress={() =>
                    router.push(`/search/shop?category=${category.id}`)
                  }
                >
                  <View className="items-center">
                    <Image
                      source={{ uri: category.icon }}
                      className="w-10 h-10"
                    />
                    <Text className="text-white text-xs">
                      {category.name.split(" ")[0]}
                    </Text>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <View className="my-2 flex-row flex-wrap justify-between">
            {products.map((item, index) => (
              <TouchableOpacity
                onPress={() => router.push(`/product/${item.id}`)}
                key={item.id}
                className={`p-1 shadow-sm shadow-gray-400 ${
                  index === 3 ? "w-2/3" : "w-1/3"
                }`}
              >
                <View className="bg-gray-200 rounded-lg items-center overflow-hidden h-48">
                  <Image
                    source={{ uri: item.image }}
                    className="w-full h-32 rounded-lg"
                  />
                  <Text
                    className="text-black text-md pt-2 pb-1 text-center"
                    style={{ lineHeight: 14 }}
                  >
                    {item.name}
                  </Text>
                  <Text className="text-gray-400 text-sm pb-2">
                    {item.categoryName}
                  </Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>

          <View className="relative h-60 w-full">
            <TouchableOpacity onPress={() => router.push("/search/shop")}>
              <Image
                source={images.interior}
                style={{ width: "100%", height: "100%", resizeMode: "cover" }}
              />
              <View
                style={{
                  position: "absolute",
                  bottom: 40,
                  left: 30,
                  paddingVertical: 0,
                  paddingHorizontal: 0,
                  borderRadius: 5,
                  overflow: "hidden",
                }}
              >
                <Text className="text-white font-bold text-lg">
                  BROWSE ACCESSORIES
                </Text>
              </View>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </SafeAreaView>

      <StatusBar backgroundColor={`rgba(0,0,0,1)`} style="dark" />
    </View>
  )
}
