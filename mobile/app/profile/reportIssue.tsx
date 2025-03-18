import React, { useState } from "react"
import {
  View,
  Text,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Image,
  ActivityIndicator,
} from "react-native"
import * as ImagePicker from "expo-image-picker"
import { getToken, getUserId, logout } from "@/services/authService"
import { router } from "expo-router"
import { BASE_URL } from "@/config"
import { images } from "@/constants"
import { SafeAreaView } from "react-native-safe-area-context"
import { useLocalSearchParams } from "expo-router"

const ReportIssue = () => {
  const [issueDescription, setIssueDescription] = useState("")
  const [selectedImage, setSelectedImage] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { productName, productImage } = useLocalSearchParams()

  console.log(productName, productImage)

  const handleImagePick = async () => {
    const permissionResult =
      await ImagePicker.requestMediaLibraryPermissionsAsync()
    if (!permissionResult.granted) {
      alert("Permission to access media library is required!")
      return
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    })

    if (!result.canceled) {
      setSelectedImage(result.assets[0].uri)
    }
  }

  const handleTakePhoto = async () => {
    const permissionResult = await ImagePicker.requestCameraPermissionsAsync()
    if (!permissionResult.granted) {
      alert("Permission to access the camera is required!")
      return
    }

    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      quality: 1,
    })

    if (!result.canceled) {
      setSelectedImage(result.assets[0].uri)
    }
  }

  const handleRemoveImage = () => {
    setSelectedImage(null)
  }

  const handleSubmitIssue = async () => {
    if (!issueDescription.trim()) {
      alert("Please provide a description of the issue.")
      return
    }

    const token = await getToken()
    const userId = await getUserId()

    if (!token || !userId) {
      alert("You must be logged in to submit an issue report.")
      return
    } else {
      try {
        const response = await fetch(`${BASE_URL}/auth/isEmployee`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        })
      } catch (error) {
        console.error("Error checking employee role:", error)
        logout()
        router.push("/login")
      }
    }

    setIsSubmitting(true)
    const formData = new FormData()
    formData.append("description", issueDescription + "\n\n" + productName)
    formData.append("userId", userId)

    if (selectedImage) {
      const filename = selectedImage.split("/").pop() || "image.jpg"
      const match = /\.(\w+)$/.exec(filename)
      const type = match ? `image/${match[1]}` : "image"

      formData.append("image", {
        uri: selectedImage,
        name: filename,
        type,
      } as any)
    }

    try {
      const response = await fetch(`${BASE_URL}/error-reports/report`, {
        method: "POST",
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      })

      if (!response.ok) {
        const errorMessage = "Failed to submit the issue. Please try again."
        alert(`Error: ${errorMessage}`)
        return
      }

      alert("Issue reported successfully!")
      setIssueDescription("")
      setSelectedImage(null)
    } catch (error) {
      console.error("Error submitting issue report:", error)
      alert("An error occurred while submitting the issue.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <SafeAreaView className="flex-1 bg-white">
      <ScrollView
        contentContainerStyle={{ paddingBottom: 50, paddingHorizontal: 20 }}
      >
        {productName && (
          <Text className="text-2xl font-bold text-gray-800 text-center">
            {"Report Issue for: "}
          </Text>
        )}
        <View className="items-center my-6">
          {productImage ? (
            <Image
              source={{ uri: productImage }}
              style={{
                width: 120,
                height: 120,
                borderRadius: 60,
                marginBottom: 10,
              }}
            />
          ) : (
            <Image
              source={images.problem}
              style={{
                width: 120,
                height: 120,
                borderRadius: 60,
                marginBottom: 10,
              }}
            />
          )}
          <Text className="text-xl font-bold text-gray-800">
            {productName || "Did a problem occur?"}
          </Text>
        </View>

        <View className="py-6">
          <TextInput
            value={issueDescription}
            onChangeText={setIssueDescription}
            placeholder="Describe the issue..."
            className="border border-gray-300 rounded-lg px-4 py-2 mb-3"
            placeholderTextColor="#4B5563"
            multiline
            numberOfLines={4}
          />
          <View className="mb-4">
            <Text className="text-gray-800 mb-2">
              Upload a Photo (optional):
            </Text>
            {selectedImage ? (
              <>
                <Image
                  source={{ uri: selectedImage }}
                  style={{
                    width: 100,
                    height: 100,
                    borderRadius: 8,
                    marginBottom: 10,
                  }}
                />
                <TouchableOpacity
                  onPress={handleRemoveImage}
                  className="bg-red-500 rounded-lg py-2 px-4 mb-2"
                >
                  <Text className="text-center text-white font-bold">
                    Remove Photo
                  </Text>
                </TouchableOpacity>
              </>
            ) : null}

            <TouchableOpacity
              onPress={handleImagePick}
              className="bg-gray-300 rounded-lg py-2 px-4 mb-2"
            >
              <Text className="text-center text-gray-800 font-bold">
                Choose from Gallery
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={handleTakePhoto}
              className="bg-gray-300 rounded-lg py-2 px-4"
            >
              <Text className="text-center text-gray-800 font-bold">
                Take a Photo
              </Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            onPress={handleSubmitIssue}
            disabled={isSubmitting}
            className={`${
              isSubmitting ? "bg-gray-400" : "bg-orange-600"
            } rounded-lg py-3`}
          >
            {isSubmitting ? (
              <ActivityIndicator size="small" color="#FFFFFF" />
            ) : (
              <Text className="text-center text-white font-bold">
                Submit Issue Report
              </Text>
            )}
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

export default ReportIssue
