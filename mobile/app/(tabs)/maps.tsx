import React, { useState, useEffect, useRef } from "react"
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  PanResponder,
  Animated,
  Dimensions,
  ScrollView,
  Alert,
  Linking,
} from "react-native"
import MapView, { Marker, Circle } from "react-native-maps"
import * as Location from "expo-location"
import { StatusBar } from "expo-status-bar"
import { useRouter } from "expo-router"
import { icons } from "@/constants"
import { SafeAreaView } from "react-native-safe-area-context"

const stores = [
  {
    name: "Sklep w Łodzi",
    latitude: 51.7592,
    longitude: 19.456,
    icon: icons.supermarket,
    address: "ul. Pięciomorgowa 12, Łódź",
  },
  {
    name: "Sklep w Warszawie",
    latitude: 52.2297,
    longitude: 21.0122,
    icon: icons.warehouse,
    address: "ul. Marszałkowska 24, Warszawa",
  },
  {
    name: "Sklep w Krakowie",
    latitude: 50.0647,
    longitude: 19.945,
    icon: icons.supermarket,
    address: "ul. Floriańska 22, Kraków",
  },
  {
    name: "Sklep w Poznaniu",
    latitude: 52.4064,
    longitude: 16.9252,
    icon: icons.supermarket,
    address: "ul. Św. Marcin 56, Poznań",
  },
  {
    name: "Sklep w Słupsku",
    latitude: 54.464,
    longitude: 17.028,
    icon: icons.warehouse,
    address: "ul. Wojska Polskiego 23, Słupsk",
  },
]

const haversineDistance = (coords1, coords2) => {
  const toRad = (value) => (value * Math.PI) / 180
  const R = 6371

  const dLat = toRad(coords2.latitude - coords1.latitude)
  const dLon = toRad(coords2.longitude - coords1.longitude)

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(coords1.latitude)) *
      Math.cos(toRad(coords2.latitude)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2)

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  return R * c
}

const Maps = () => {
  const router = useRouter()
  const [userLocation, setUserLocation] = useState(null)
  const [nearestStore, setNearestStore] = useState(null)
  const [selectedStore, setSelectedStore] = useState(null)
  const [mapHeight] = useState(
    new Animated.Value(Dimensions.get("window").height * 0.6)
  )
  const [panelHeight, setPanelHeight] = useState(300)
  const panY = useRef(new Animated.Value(0)).current

  useEffect(() => {
    ;(async () => {
      try {
        const { status } = await Location.requestForegroundPermissionsAsync()
        if (status !== "granted") {
          Alert.alert(
            "Brak uprawnień",
            "Nie możemy uzyskać Twojej lokalizacji."
          )
          return
        }

        const location = await Location.getCurrentPositionAsync({})
        setUserLocation(location.coords)

        let closest = null
        let minDistance = Infinity

        stores.forEach((store) => {
          const distance = haversineDistance(location.coords, {
            latitude: store.latitude,
            longitude: store.longitude,
          })
          if (distance < minDistance) {
            minDistance = distance
            closest = { ...store, distance }
          }
        })

        setNearestStore(closest)
      } catch (error) {
        Alert.alert("Błąd", "Nie udało się pobrać lokalizacji.")
      }
    })()
  }, [])

  const handleMarkerPress = (store) => {
    setSelectedStore(store)
  }

  const handlePanResponderMove = (_, gestureState) => {
    const { dy } = gestureState
    const maxMapHeight = Dimensions.get("window").height * 0.6
    const minMapHeight = Dimensions.get("window").height * 0.3
    const newMapHeight = Math.max(
      minMapHeight,
      Math.min(maxMapHeight, mapHeight.__getValue() + dy)
    )
    const newPanelHeight = Math.max(200, panelHeight - dy)

    mapHeight.setValue(newMapHeight)
    setPanelHeight(newPanelHeight)
  }

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderMove: handlePanResponderMove,
    })
  ).current

  const handleGetDirections = () => {
    if (selectedStore) {
      const url = `https://www.google.com/maps/dir/?api=1&origin=${userLocation.latitude},${userLocation.longitude}&destination=${selectedStore.latitude},${selectedStore.longitude}`
      Linking.openURL(url)
    } else {
      Alert.alert(
        "Brak wybranego sklepu",
        "Wybierz sklep, do którego chcesz wyznaczyć trasę."
      )
    }
  }

  return (
    <View className="h-full bg-white">
      <Animated.View
        style={{
          height: mapHeight,
          width: "100%",
          backgroundColor: "gray",
        }}
      >
        <MapView
          style={{ flex: 1 }}
          initialRegion={{
            latitude: 52.1,
            longitude: 19.4,
            latitudeDelta: 8,
            longitudeDelta: 2,
          }}
        >
          {stores.map((store, index) => (
            <Marker
              key={index}
              coordinate={{
                latitude: store.latitude,
                longitude: store.longitude,
              }}
              title={store.name}
              description={store.address}
              onPress={() => handleMarkerPress(store)}
            >
              <View
                style={{
                  alignItems: "center",
                  justifyContent: "center",
                  width: 40,
                  height: 40,
                  borderRadius: 20,
                  backgroundColor: "white",
                  borderWidth: 2,
                  borderColor: "#FF5722",
                }}
              >
                <Image
                  source={store.icon}
                  style={{ width: 24, height: 24 }}
                  resizeMode="contain"
                />
              </View>
            </Marker>
          ))}

          {userLocation && (
            <Marker
              coordinate={userLocation}
              title="Twoja lokalizacja"
              description="Tutaj jesteś"
            >
              <View
                style={{
                  alignItems: "center",
                  justifyContent: "center",
                  width: 30,
                  height: 30,
                  borderRadius: 20,
                  backgroundColor: "rgba(173, 216, 230, 0.5)",
                }}
              >
                <View
                  style={{
                    width: 20,
                    height: 20,
                    borderRadius: 10,
                    backgroundColor: "blue",
                  }}
                />
              </View>
            </Marker>
          )}
        </MapView>
      </Animated.View>

      <Animated.View
        style={{
          height: panelHeight,
          backgroundColor: "#fff",
          padding: 16,
          borderTopWidth: 1,
          borderTopColor: "#ddd",
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
        }}
        {...panResponder.panHandlers}
      >
        <ScrollView contentContainerStyle={{ paddingBottom: 16 }}>
          <Text className="text-lg text-center font-bold text-black mb-4">
            Znajdź Nasze Sklepy
          </Text>
          <Text className="text-center text-gray-700 mb-6">
            Odwiedź nasze sklepy w największych miastach Polski: Łodzi,
            Warszawie, Krakowie i Poznaniu.
          </Text>

          {nearestStore && (
            <View className="p-4 bg-gray-100 rounded-lg shadow-lg">
              <Text className="text-center font-bold text-orange-600 mb-2">
                Najbliżej ciebie: {nearestStore.name}
              </Text>
              <Text className="text-center text-gray-600">
                Adres: {nearestStore.address}
              </Text>
              <Text className="text-center text-gray-600">
                Odległość:{" "}
                {haversineDistance(userLocation, nearestStore).toFixed(2)} km
              </Text>
            </View>
          )}

          <TouchableOpacity
            onPress={handleGetDirections}
            className="bg-green-500 py-3 px-6 rounded-full items-center mt-6"
          >
            <Text className="text-white font-bold">
              Wyznacz trasę do wybranego sklepu
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </Animated.View>

      <StatusBar backgroundColor={`rgba(0,0,0,0.1)`} style="dark" />
    </View>
  )
}

export default Maps

// kilka sklepów np w warszamie żeby zrobić klasteryzacje na mapie
// np 6 sklepow w warszawie i zeby sklepy sie polaczyly
// dodanie usuwania produktu z koszyka
// na profil page dodanie wysylanie zapytania do endpointu
// dodanie podstrony dla pracownika
// zrobić wybór ilośi wybranego produktu odrazu przy dodawaniu do koszyka
