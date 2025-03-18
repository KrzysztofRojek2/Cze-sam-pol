import React, { useEffect, useState } from "react"
import { View, Text, TouchableOpacity, ScrollView, Switch } from "react-native"
import { useRouter } from "expo-router"
import { getToken, logout } from "../../services/authService"
import { BASE_URL } from "../../config"
import { SafeAreaView } from "react-native-safe-area-context"

const Profile: React.FC = () => {
  const router = useRouter()
  const [notificationsEnabled, setNotificationsEnabled] = useState(false)
  const [isEmployee, setIsEmployee] = useState(false)

  const toggleNotifications = () => {
    setNotificationsEnabled((previousState) => !previousState)
  }

  const checkIfEmployee = async () => {
    const token = await getToken()
    if (token) {
      try {
        const response = await fetch(`${BASE_URL}/auth/isEmployee`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        })
        const data = await response.json()
        if (data) {
          setIsEmployee(data)
        }
      } catch (error) {
        console.error("Error checking employee role:", error)
        logout()
        console.log("Logging out")
        router.push("/login")
      }
    }
  }

  useEffect(() => {
    checkIfEmployee()
  }, [])

  return (
    <View className="flex-1 bg-gray-200">
      <SafeAreaView className="flex-1">
        <View className="flex-1 justify-between">
          <View>
            <View className="p-4 bg-gray-300 items-center">
              <Text className="text-2xl font-bold">Account</Text>
              <Text className="text-lg text-gray-700">Hello</Text>
              <Text className="text-sm text-gray-500">account@email.com</Text>
            </View>

            <ScrollView contentContainerStyle={{ paddingBottom: 16 }}>
              {[
                { label: "My Orders", route: "../profile/MyOrders" },
                { label: "Personal Data", route: "../profile/PersonalData" },
                { label: "Information", route: "../profile/terms" },
                { label: "Returns", route: "../profile/returns" },
              ].map((item, index) => (
                <TouchableOpacity
                  key={index}
                  onPress={() => router.push(item.route)}
                  className="bg-white p-4 border-b border-gray-300 flex-row justify-between items-center"
                >
                  <Text className="text-base">{item.label}</Text>
                </TouchableOpacity>
              ))}

              <View className="bg-white p-4 border-b border-gray-300 flex-row justify-between items-center">
                <Text className="text-base">Enable Notifications</Text>
                <Switch
                  value={notificationsEnabled}
                  onValueChange={toggleNotifications}
                />
              </View>

              {isEmployee && (
                <TouchableOpacity
                  onPress={() => router.push("../profile/reportIssue")}
                  className="bg-white p-4 border-b border-gray-300 flex-row justify-between items-center"
                >
                  <Text className="text-base">Report Issue</Text>
                </TouchableOpacity>
              )}
            </ScrollView>
          </View>

          <TouchableOpacity
            onPress={() => {
              logout()
              console.log("Logging out")
              router.push("/login")
            }}
            className="bg-red-500 p-4"
          >
            <Text className="text-center text-white text-base font-bold">
              Log Out
            </Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </View>
  )
}

export default Profile
