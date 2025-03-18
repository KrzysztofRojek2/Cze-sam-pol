import React, { useState, useEffect } from "react"
import {
  View,
  Text,
  ScrollView,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native"
import { BASE_URL } from "../../config"
import { getUserId } from "../../services/authService"
import { SafeAreaView } from "react-native-safe-area-context"

const PersonalData = () => {
  const [user, setUser] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
  })

  const [address, setAddress] = useState({
    country: "",
    postalCode: "",
    street: "",
    city: "",
    state: "",
    apartmentNumber: "",
  })

  const [originalUser, setOriginalUser] = useState({})
  const [originalAddress, setOriginalAddress] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [loggedUserId, setLoggedUserId] = useState<string | null>(null)
  const [errors, setErrors] = useState<any>({})

  useEffect(() => {
    const fetchData = async () => {
      const userId = await getUserId()
      if (userId) {
        setLoggedUserId(userId)
        try {
          const userResponse = await fetch(`${BASE_URL}/user/${userId}`)
          const addressResponse = await fetch(
            `${BASE_URL}/user/${userId}/address`
          )
          if (userResponse.ok && addressResponse.ok) {
            const userData = await userResponse.json()
            const addressData = await addressResponse.json()
            setUser(userData)
            setAddress(addressData)
            setOriginalUser(userData)
            setOriginalAddress(addressData)
          } else {
            alert("Failed to fetch user or address data.")
          }
        } catch (error) {
          console.error("Error fetching data:", error)
          alert("An error occurred while fetching data.")
        }
      }
    }

    fetchData()
  }, [])

  const handleInputChange = (field: string, value: string) => {
    setUser((prev) => ({ ...prev, [field]: value }))
  }

  const handleAddressChange = (field: string, value: string) => {
    setAddress((prev) => ({ ...prev, [field]: value }))
  }

  const validate = () => {
    const newErrors: any = {}

    // Walidacja danych użytkownika
    if (!user.firstName.trim()) {
      newErrors.firstName = "First name is required."
    }
    if (!user.lastName.trim()) {
      newErrors.lastName = "Last name is required."
    }
    if (!user.email.trim()) {
      newErrors.email = "Email is required."
    } else if (!/^\S+@\S+\.\S+$/.test(user.email)) {
      newErrors.email = "Invalid email format."
    }
    if (!user.phoneNumber.trim()) {
      newErrors.phoneNumber = "Phone number is required."
    } else if (!/^\d{9,15}$/.test(user.phoneNumber)) {
      newErrors.phoneNumber = "Phone number must contain 9-15 digits."
    }

    // Walidacja danych adresowych
    if (!address.country.trim()) {
      newErrors.country = "Country is required."
    }
    if (!address.city.trim()) {
      newErrors.city = "City is required."
    }
    if (!address.street.trim()) {
      newErrors.street = "Street is required."
    }
    if (!address.postalCode.trim()) {
      newErrors.postalCode = "Postal code is required."
    }

    setErrors(newErrors)

    // Jeśli brak błędów, zwróć true
    return Object.keys(newErrors).length === 0
  }

  const handleUpdate = async () => {
    if (!loggedUserId) {
      alert("User not logged in. Please log in and try again.")
      return
    }

    // Sprawdź walidację
    if (!validate()) {
      alert("Please fix the errors in the form.")
      return
    }

    setIsSubmitting(true)

    // Scalenie aktualnych danych z oryginalnymi
    const fullUserPayload = { ...originalUser, ...user }
    const fullAddressPayload = { ...originalAddress, ...address }

    try {
      // Update user data
      const userResponse = await fetch(
        `${BASE_URL}/user/update/${loggedUserId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(fullUserPayload),
        }
      )

      if (!userResponse.ok) {
        const errorData = await userResponse.json().catch(() => null)
        const errorMessage =
          errorData?.message || "An error occurred while updating user data."
        alert(`Error: ${errorMessage}`)
        return
      }

      // Update address data
      const addressResponse = await fetch(
        `${BASE_URL}/address/update/${loggedUserId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(fullAddressPayload),
        }
      )

      if (!addressResponse.ok) {
        const errorData = await addressResponse.json().catch(() => null)
        const errorMessage =
          errorData?.message || "An error occurred while updating address."
        alert(`Error: ${errorMessage}`)
        return
      }

      alert("Personal data and address updated successfully!")
    } catch (error) {
      console.error("Error updating data:", error)
      alert("Failed to update personal data or address.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <SafeAreaView className="flex-1 bg-white">
      <ScrollView
        contentContainerStyle={{ paddingBottom: 50, paddingHorizontal: 20 }}
      >
        <View className="mt-10 py-6">
          <Text className="text-2xl font-bold text-center my-4">
            Update Personal Information
          </Text>

          {/* User Fields */}
          <TextInput
            placeholder="First Name"
            value={user.firstName}
            placeholderTextColor="#9CA3AF"
            onChangeText={(value) => handleInputChange("firstName", value)}
            className={`border ${
              errors.firstName ? "border-red-500" : "border-gray-300"
            } rounded-lg px-4 py-2 mb-3`}
          />
          {errors.firstName && (
            <Text className="text-red-500">{errors.firstName}</Text>
          )}
          <TextInput
            placeholder="Last Name"
            value={user.lastName}
            placeholderTextColor="#9CA3AF"
            onChangeText={(value) => handleInputChange("lastName", value)}
            className={`border ${
              errors.lastName ? "border-red-500" : "border-gray-300"
            } rounded-lg px-4 py-2 mb-3`}
          />
          {errors.lastName && (
            <Text className="text-red-500">{errors.lastName}</Text>
          )}
          <TextInput
            placeholder="Email"
            value={user.email}
            placeholderTextColor="#9CA3AF"
            onChangeText={(value) => handleInputChange("email", value)}
            className={`border ${
              errors.email ? "border-red-500" : "border-gray-300"
            } rounded-lg px-4 py-2 mb-3`}
          />
          {errors.email && <Text className="text-red-500">{errors.email}</Text>}
          <TextInput
            placeholder="Phone Number"
            value={user.phoneNumber}
            placeholderTextColor="#9CA3AF"
            onChangeText={(value) => handleInputChange("phoneNumber", value)}
            className={`border ${
              errors.phoneNumber ? "border-red-500" : "border-gray-300"
            } rounded-lg px-4 py-2 mb-3`}
          />
          {errors.phoneNumber && (
            <Text className="text-red-500">{errors.phoneNumber}</Text>
          )}

          {/* Address Fields */}
          <TextInput
            placeholder="Country"
            value={address.country}
            placeholderTextColor="#9CA3AF"
            onChangeText={(value) => handleAddressChange("country", value)}
            className={`border ${
              errors.country ? "border-red-500" : "border-gray-300"
            } rounded-lg px-4 py-2 mb-3`}
          />
          {errors.country && (
            <Text className="text-red-500">{errors.country}</Text>
          )}
          <TextInput
            placeholder="Postal Code"
            value={address.postalCode}
            placeholderTextColor="#9CA3AF"
            onChangeText={(value) => handleAddressChange("postalCode", value)}
            className={`border ${
              errors.postalCode ? "border-red-500" : "border-gray-300"
            } rounded-lg px-4 py-2 mb-3`}
          />
          {errors.postalCode && (
            <Text className="text-red-500">{errors.postalCode}</Text>
          )}
          <TextInput
            placeholder="Street"
            value={address.street}
            placeholderTextColor="#9CA3AF"
            onChangeText={(value) => handleAddressChange("street", value)}
            className={`border ${
              errors.street ? "border-red-500" : "border-gray-300"
            } rounded-lg px-4 py-2 mb-3`}
          />
          {errors.street && (
            <Text className="text-red-500">{errors.street}</Text>
          )}
          <TextInput
            placeholder="City"
            value={address.city}
            placeholderTextColor="#9CA3AF"
            onChangeText={(value) => handleAddressChange("city", value)}
            className={`border ${
              errors.city ? "border-red-500" : "border-gray-300"
            } rounded-lg px-4 py-2 mb-3`}
          />
          {errors.city && <Text className="text-red-500">{errors.city}</Text>}
          <TextInput
            placeholder="State"
            value={address.state}
            placeholderTextColor="#9CA3AF"
            onChangeText={(value) => handleAddressChange("state", value)}
            className="border border-gray-300 rounded-lg px-4 py-2 mb-3"
          />
          <TextInput
            placeholder="Apartment Number"
            value={address.apartmentNumber}
            placeholderTextColor="#9CA3AF"
            onChangeText={(value) =>
              handleAddressChange("apartmentNumber", value)
            }
            className="border border-gray-300 rounded-lg px-4 py-2 mb-3"
          />
        </View>

        <TouchableOpacity
          onPress={handleUpdate}
          disabled={isSubmitting}
          className={`${
            isSubmitting ? "bg-gray-400" : "bg-blue-600"
          } rounded-lg py-3`}
        >
          {isSubmitting ? (
            <ActivityIndicator size="small" color="#FFFFFF" />
          ) : (
            <Text className="text-center text-white font-bold">
              Update Personal Data
            </Text>
          )}
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  )
}

export default PersonalData
