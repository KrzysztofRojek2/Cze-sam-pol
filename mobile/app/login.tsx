import React, { useState } from "react"
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ImageBackground,
} from "react-native"
import { useRouter } from "expo-router"
import { SafeAreaView } from "react-native-safe-area-context"
import { images } from "../constants"
import AsyncStorage from "@react-native-async-storage/async-storage"
import { login } from "../services/authService"

const LoginPanel = () => {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(null)
  const router = useRouter()

  const handleSubmit = async () => {
    setError(null)
    setSuccess(null)

    try {
      const data = await login(username, password)
      console.log("data", data)
      setSuccess("Login successful!")
      router.push("/home")
    } catch (error) {
      setError(error.message)
      console.error(error)
    }
  }

  return (
    <View className="flex-1">
      <ImageBackground
        source={images.loginbg}
        style={{ flex: 1 }}
        resizeMode="cover"
      >
        <View className="flex-1 items-center justify-center bg-black/50">
          <View className="w-11/12 max-w-md p-6 rounded-lg border border-white bg-white/20 backdrop-blur-md">
            <Text className="text-3xl font-bold text-white mb-8">Login</Text>

            <TextInput
              className="w-full h-12 px-4 mb-4 text-white bg-transparent border border-white rounded-full"
              placeholder="Email"
              placeholderTextColor="white"
              value={username}
              onChangeText={setUsername}
            />
            <TextInput
              className="w-full h-12 px-4 mb-6 text-white bg-transparent border border-white rounded-full"
              placeholder="Password"
              placeholderTextColor="white"
              secureTextEntry
              value={password}
              onChangeText={setPassword}
            />

            <TouchableOpacity
              className="w-full h-12 bg-white rounded-full justify-center items-center mb-2"
              onPress={handleSubmit}
            >
              <Text className="text-lg font-bold text-black">Log in</Text>
            </TouchableOpacity>

            {error && (
              <Text className="text-red-500 mt-4 text-center">{error}</Text>
            )}
            {success && (
              <Text className="text-green-500 mt-4 text-center">{success}</Text>
            )}

            <Text className="text-white mt-4">
              Don't have an account?{" "}
              <TouchableOpacity onPress={() => router.push("/register")}>
                <Text className="text-blue-400 font-bold">Register</Text>
              </TouchableOpacity>
            </Text>
          </View>
        </View>
      </ImageBackground>
    </View>
  )
}

export default LoginPanel
