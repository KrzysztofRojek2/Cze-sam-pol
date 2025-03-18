import AsyncStorage from "@react-native-async-storage/async-storage"
import { BASE_URL } from "../config"

export const getToken = async () => {
  try {
    const token = await AsyncStorage.getItem("token")
    return token ? token : null
  } catch (error) {
    console.error("Error getting token:", error)
    return null
  }
}

export const getUserId = async () => {
  try {
    const userId = await AsyncStorage.getItem("userId")
    return userId ? userId : null
  } catch (error) {
    console.error("Error getting userId:", error)
    return null
  }
}

export const logout = async () => {
  try {
    await AsyncStorage.removeItem("token")
    await AsyncStorage.removeItem("userId")
  } catch (error) {
    console.error("Error logging out:", error)
  }
}

export const login = async (username, password) => {
  try {
    const response = await fetch(`${BASE_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    })
    if (!response.ok) throw new Error("Invalid credentials")
    const data = await response.json()

    await AsyncStorage.setItem("token", data.accessToken)
    await AsyncStorage.setItem("userId", data.userId.toString())
    return data
  } catch (error) {
    console.error("Error during login:", error)
    throw error
  }
}

export const register = async (username, password) => {
  try {
    const response = await fetch(`${BASE_URL}/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    })
    if (!response.ok) throw new Error("Invalid credentials")
    const data = await response.json()

    return data
  } catch (error) {
    console.error("Error during login:", error)
    throw error
  }
}