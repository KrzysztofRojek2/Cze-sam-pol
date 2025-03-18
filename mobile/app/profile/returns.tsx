import React, { useState, useEffect } from "react"
import {
  View,
  Text,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Image,
  ActivityIndicator,
} from "react-native"
import { useRouter } from "expo-router"
import * as ImagePicker from "expo-image-picker"
import { BASE_URL } from "../../config"
import { getUserId } from "../../services/authService"
import { SafeAreaView } from "react-native-safe-area-context"

const Returns = () => {
  const samplePrivacyPolicy = `
### Polityka Prywatności

Twoja prywatność jest dla nas bardzo ważna. Niniejsza Polityka Prywatności określa, w jaki sposób gromadzimy, używamy, ujawniamy i chronimy Twoje dane osobowe w naszej aplikacji.

#### 1. Jakie dane zbieramy?
Podczas korzystania z aplikacji możemy zbierać następujące dane:
- **Dane osobowe**: Imię, nazwisko, adres e-mail, numer telefonu.
- **Dane transakcyjne**: Informacje o zakupach, zwrotach i transakcjach.
- **Dane techniczne**: Adres IP, dane o urządzeniu, system operacyjny, lokalizacja (jeśli wyraziłeś zgodę).
- **Zdjęcia**: Jeśli przesyłasz zdjęcia w ramach zwrotu produktów.

#### 2. W jaki sposób wykorzystujemy Twoje dane?
Zebrane dane wykorzystujemy w celu:
- Realizacji Twoich zamówień i zwrotów.
- Kontaktowania się w sprawie wsparcia klienta.
- Analizowania i ulepszania naszych usług.
- Zapewnienia zgodności z przepisami prawa.

#### 3. Czy dzielimy się Twoimi danymi?
Twoje dane mogą być udostępniane:
- Partnerom zewnętrznym, którzy pomagają w realizacji zamówień i usług (np. dostawcom płatności, firmom kurierskim).
- Wymiarowi sprawiedliwości, gdy jest to wymagane przepisami prawa.

Nie sprzedajemy Twoich danych osobowych osobom trzecim.

#### 4. Jak chronimy Twoje dane?
- Używamy szyfrowania i bezpiecznych serwerów do przechowywania danych.
- Regularnie monitorujemy nasze systemy pod kątem luk w zabezpieczeniach.
- Dostęp do danych mają tylko upoważnieni pracownicy.

#### 5. Twoje prawa
Masz prawo do:
- Wglądu, poprawy lub usunięcia swoich danych osobowych.
- Wycofania zgody na przetwarzanie danych w dowolnym momencie.
- Złożenia skargi do odpowiedniego organu ochrony danych.

#### 6. Kontakt
Jeśli masz pytania dotyczące naszej Polityki Prywatności, skontaktuj się z nami:
- E-mail: privacy@example.com
- Telefon: +48 123 456 789

Dziękujemy za zaufanie i korzystanie z naszej aplikacji!
`
  const router = useRouter()
  const [transactionId, setTransactionId] = useState("")
  const [returnReason, setReturnReason] = useState("")
  const [returnPolicy, setReturnPolicy] = useState("")
  const [selectedImage, setSelectedImage] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [loggedUserId, setLoggedUserId] = useState<string | null>(null)

  useEffect(() => {
    const fetchReturnPolicy = async () => {
      try {
        const response = await fetch(`${BASE_URL}/return-policy`)
        const data = await response.json()
        setReturnPolicy(data.policy)
      } catch (error) {
        console.error("Error fetching return policy:", error)
      }
    }

    const fetchUserId = async () => {
      const userId = await getUserId()
      if (userId) setLoggedUserId(userId)
    }

    // fetchReturnPolicy()
    fetchUserId()
  }, [])

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

  const handleReturnSubmit = async () => {
    if (!transactionId || isNaN(Number(transactionId))) {
      alert("Please provide a valid transaction ID.")
      return
    }
    if (!returnReason.trim()) {
      alert("Please provide a reason for the return.")
      return
    }
    if (!loggedUserId) {
      alert("User not logged in. Please log in and try again.")
      return
    }

    setIsSubmitting(true)
    const formData = new FormData()
    formData.append("userId", loggedUserId)
    formData.append("transactionId", transactionId)
    formData.append("reason", returnReason)

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
      const response = await fetch(`${BASE_URL}/returns`, {
        method: "POST",
        body: formData,
      })

      if (!response.ok) {
        const contentType = response.headers.get("content-type")
        let errorMessage = "An error occurred."

        if (contentType && contentType.includes("application/json")) {
          const errorData = await response.json()
          errorMessage = errorData.message || errorMessage
        }

        alert(`Error: ${errorMessage}`)
        return
      }

      const data = await response.json()
      alert(data.message || "Return request submitted successfully!")
      setTransactionId("")
      setReturnReason("")
      setSelectedImage(null)
    } catch (error) {
      console.error("Error submitting return request:", error)
      alert("Failed to submit return request.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <SafeAreaView className="flex-1 bg-white">
      <ScrollView
        contentContainerStyle={{ paddingBottom: 50, paddingHorizontal: 20 }}
      >
        <View className="py-6">
          <Text className="text-2xl font-bold text-center my-4">
            Return a Product
          </Text>
          <Text className="text-lg font-semibold text-gray-800 mb-2">
            Return info
          </Text>
          <TextInput
            value={transactionId}
            onChangeText={setTransactionId}
            placeholder="Transaction ID"
            className="border border-gray-300 rounded-lg px-4 py-2 mb-3"
            placeholderTextColor="#4B5563"
          />
          <TextInput
            value={returnReason}
            onChangeText={setReturnReason}
            placeholder="Reason for Return"
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
            onPress={handleReturnSubmit}
            disabled={isSubmitting}
            className={`${
              isSubmitting ? "bg-gray-400" : "bg-blue-600"
            } rounded-lg py-3`}
          >
            {isSubmitting ? (
              <ActivityIndicator size="small" color="#FFFFFF" />
            ) : (
              <Text className="text-center text-white font-bold">
                Submit Return Request
              </Text>
            )}
          </TouchableOpacity>
        </View>

        <View className="py-6">
          <Text className="text-2xl font-bold text-center my-4">
            Return Policy
          </Text>
          {returnPolicy ? (
            <Text className="text-gray-700 text-sm">{returnPolicy}</Text>
          ) : (
            <Text className="text-gray-400 text-sm">{samplePrivacyPolicy}</Text>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

export default Returns
