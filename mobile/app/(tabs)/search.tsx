import React, { useEffect, useRef, useState } from "react"
import {
  ScrollView,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  Animated,
} from "react-native"
import { StatusBar } from "expo-status-bar"
import { icons, images } from "../../constants"
import { useRouter } from "expo-router"
import AsyncStorage from "@react-native-async-storage/async-storage"
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

const SearchPage: React.FC = () => {
  const router = useRouter()
  const [categories, setCategories] = useState<Category[]>([])
  const [searchTerm, setSearchTerm] = useState<string>("")
  const [expandedCategoryId, setExpandedCategoryId] = useState<number | null>(
    null
  )
  const rotationAnim = useRef<{ [key: number]: Animated.Value }>({}).current

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch(`${BASE_URL}/category`)
        const data = await response.json()
        setCategories(data)
      } catch (error) {
        console.error("Error fetching categories:", error)
      }
    }

    const loadCategories = async () => {
      try {
        const storedCategories = await AsyncStorage.getItem("categories")
        if (storedCategories) {
          setCategories(JSON.parse(storedCategories))
        } else {
          fetchCategories()
        }
      } catch (error) {
        console.error("Error loading categories:", error)
      }
    }

    loadCategories()
  }, [])

  useEffect(() => {
    categories.forEach((category) => {
      if (!rotationAnim[category.id]) {
        rotationAnim[category.id] = new Animated.Value(0)
      }
    })
  }, [categories])

  const toggleCategory = (id: number) => {
    if (expandedCategoryId !== null && rotationAnim[expandedCategoryId]) {
      Animated.timing(rotationAnim[expandedCategoryId], {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }).start()
    }

    if (expandedCategoryId !== id && rotationAnim[id]) {
      Animated.timing(rotationAnim[id], {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }).start()
      setExpandedCategoryId(id)
    } else {
      setExpandedCategoryId(null)
    }
  }

  const handleSearch = () => {
    if (searchTerm.trim()) {
      router.replace(`/search/shop?search=${encodeURIComponent(searchTerm)}`)
    }
  }

  return (
    <View className="h-full bg-black">
      <SafeAreaView className="flex-1">
        <View className="p-4">
          <View className="flex-row items-center">
            <TouchableOpacity onPress={handleSearch}>
              <Image
                source={icons.search}
                className="w-6 h-6"
                style={{ tintColor: "#fff" }}
              />
            </TouchableOpacity>
            <TextInput
              style={{
                borderWidth: 1,
                borderColor: "#666",
                borderRadius: 8,
                padding: 10,
                flex: 1,
                marginLeft: 10,
                backgroundColor: "#333",
                color: "#fff",
              }}
              placeholder="Search for products..."
              value={searchTerm}
              onChangeText={setSearchTerm}
              onSubmitEditing={handleSearch}
              placeholderTextColor={"#aaa"}
            />
          </View>
        </View>

        <ScrollView contentContainerStyle={{ paddingBottom: 50 }}>
          <View className="p-4">
            <Text className="text-lg font-bold text-white">Categories</Text>
            {categories.map((category) => {
              const rotate = rotationAnim[category.id]?.interpolate({
                inputRange: [0, 1],
                outputRange: ["0deg", "180deg"],
              })

              return (
                <View key={category.id} className="mb-4">
                  <TouchableOpacity
                    onPress={() => toggleCategory(category.id)}
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      justifyContent: "space-between",
                      paddingVertical: 10,
                      paddingHorizontal: 10,
                      backgroundColor: "#444",
                      borderRadius: 8,
                    }}
                  >
                    <View
                      style={{ flexDirection: "row", alignItems: "center" }}
                    >
                      <Image
                        source={{ uri: category.icon }}
                        className="w-8 h-8 mr-2"
                      />
                      <Text className="text-white font-semibold">
                        {category.name}
                      </Text>
                    </View>
                    <Animated.View
                      style={{ transform: rotate ? [{ rotate }] : [] }}
                    >
                      <Text
                        style={{
                          fontSize: 18,
                          fontWeight: "medium",
                          color: "#fff",
                        }}
                      >
                        ▽
                      </Text>
                    </Animated.View>
                  </TouchableOpacity>

                  {expandedCategoryId === category.id && (
                    <View style={{ marginLeft: 20 }}>
                      {category.subcategories.map((subcategory) => (
                        <TouchableOpacity
                          key={subcategory.id}
                          onPress={() =>
                            router.replace(
                              `/search/shop?category=${category.id}`
                            )
                          }
                          style={{
                            paddingVertical: 5,
                            paddingHorizontal: 10,
                            backgroundColor: "#555",
                            borderRadius: 5,
                            marginVertical: 5,
                          }}
                        >
                          <Text className="text-white">{subcategory.name}</Text>
                        </TouchableOpacity>
                      ))}
                    </View>
                  )}
                </View>
              )
            })}
          </View>
        </ScrollView>
      </SafeAreaView>
      <StatusBar backgroundColor={`rgba(0,0,0,1)`} style="light" />
    </View>
  )
}

export default SearchPage
