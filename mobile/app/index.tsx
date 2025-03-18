import React, { useEffect, useState } from "react"
import { View, Text, TouchableOpacity } from "react-native"
import { useRouter } from "expo-router"
import { getToken, getUserId } from "@/services/authService"

export default function MainScreen() {
  const router = useRouter()
  const [isLoggedIn, setIsLoggedIn] = useState(false)

  useEffect(() => {
    const checkLoginStatus = async () => {
      const token = await getToken()
      const userId = await getUserId()

      if (token && userId) {
        setIsLoggedIn(true)
        router.replace("/home")
      } else {
        setIsLoggedIn(false)
        router.replace("/login")
      }
    }

    checkLoginStatus()
  }, [])

  const handleConfirm = () => {
    return router.push("/home")
  }

  const handleLogin = () => {
    return router.push("/login")
  }

  return (
    <View className="flex-1 justify-center items-center bg-purple-500">
      <Text className="text-3xl font-bold text-orange-500  mb-4">
        Czasampol
      </Text>

      <TouchableOpacity
        className="bg-orange-500 rounded px-4 py-2"
        onPress={handleConfirm}
      >
        <Text className="text-white text-lg ">Przejdź do sklepu</Text>
      </TouchableOpacity>

      <TouchableOpacity
        className="bg-green-500 rounded px-4 py-2 mt-4"
        onPress={handleLogin}
      >
        <Text className="text-white text-lg ">Zaloguj się</Text>
      </TouchableOpacity>
    </View>
  )
}
