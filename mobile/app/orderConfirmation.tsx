import React from "react"
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
} from "react-native"
import { useNavigation } from "expo-router"
import { useRouter } from "expo-router"

import { SafeAreaView } from "react-native-safe-area-context"

const OrderConfirmation: React.FC = () => {
  const router = useRouter()

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollViewContent}>
        <View style={styles.content}>
          <Text style={styles.title}>Thank You for Your Order!</Text>
          <Text style={styles.subtitle}>
            Your order has been successfully placed. We are preparing your items
            for shipment and will update you shortly.
          </Text>

          <View style={styles.orderSummary}>
            <Text style={styles.sectionTitle}>Order Summary</Text>
            <Text style={styles.text}>
              Order Number: <Text style={styles.boldText}>#123456</Text>
            </Text>
            <Text style={styles.text}>
              Total: <Text style={styles.boldText}>$99.99</Text>
            </Text>
            <Text style={styles.text}>
              Estimated Delivery:{" "}
              <Text style={styles.boldText}>5-7 Business Days</Text>
            </Text>
          </View>

          <TouchableOpacity
            style={styles.button}
            onPress={() => router.push("./profile/MyOrders")}
          >
            <Text style={styles.buttonText}>Go to Orders</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f9f9f9",
  },
  scrollViewContent: {
    flexGrow: 1,
    justifyContent: "center",
    paddingHorizontal: 20,
  },
  content: {
    alignItems: "center",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#2d2d2d",
    marginBottom: 10,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 16,
    color: "#7d7d7d",
    textAlign: "center",
    marginBottom: 30,
    lineHeight: 22,
  },
  orderSummary: {
    width: "100%",
    backgroundColor: "#ffffff",
    borderRadius: 10,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#2d2d2d",
    marginBottom: 10,
  },
  text: {
    fontSize: 16,
    color: "#555555",
    marginBottom: 5,
  },
  boldText: {
    fontWeight: "bold",
    color: "#000",
  },
  button: {
    backgroundColor: "#4CAF50",
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 10,
    marginTop: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  buttonText: {
    color: "#ffffff",
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
  },
})

export default OrderConfirmation
