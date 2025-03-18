import React, { useState, useEffect } from "react";
import { View, Text, ScrollView, Image, TouchableOpacity, StyleSheet } from "react-native";
import { BASE_URL } from "../../config";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router"

interface Transaction {
  id: number;
  date: string;
  status: string;
  price: number;
  userID: number;
  shippingID: number;
  transactionParts: {
    partDto: {
      id: number;
      name: string;
      description: string;
      image: string;
      price: number;
      discount: number;
    };
    quantity: number;
  }[];
}

const MyOrders: React.FC = () => {
  const router = useRouter()

  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [userId, setUserId] = useState<number | null>(null);

  useEffect(() => {
    const fetchUserId = async () => {
      const storedUserId = await AsyncStorage.getItem("userId");
      setUserId(storedUserId ? parseInt(storedUserId, 10) : null);
    };

    fetchUserId();
  }, []);

  useEffect(() => {
    if (userId !== null) {
      fetchTransactions();
    }
  }, [userId]);

  const fetchTransactions = async () => {
    try {
      const response = await fetch(`${BASE_URL}/transaction/passed/${userId}`);
      const data = await response.json();

      const filteredData = data
        .map((transaction: any) => ({
          id: transaction.id,
          date: new Date(transaction.date).toLocaleDateString(), // Format daty
          rawDate: new Date(transaction.date), // Surowa data do sortowania
          transactionParts: transaction.transactionParts.map((part: any) => ({
            partDto: {
              image: part.partDto.image,
              name: part.partDto.name,
              price: part.partDto.price,
            },
            quantity: part.quantity,
          })),
        }))
        .sort((a: { rawDate: number }, b: { rawDate: number }) => b.rawDate - a.rawDate); // Sortowanie od najnowszych do najstarszych

      setTransactions(filteredData);
    } catch (error) {
      console.error("Error fetching transactions:", error);
    }
  };

  return (
    <ScrollView className="mt-16">
      <Text className="text-2xl font-bold mb-4">History of Transactions</Text>

      {transactions.map((transaction) => {
        // Obliczanie sumy elementów transakcji
        const totalPrice = transaction.transactionParts.reduce(
          (sum, part) => sum + part.quantity * part.partDto.price,
          0
        );

        return (
          <View
            key={transaction.id}
            className="bg-white p-4 mb-4 border border-gray-300 rounded-lg shadow-sm"
          >
            {/* Główne informacje o transakcji */}
            <View className="mb-4">
              <Text className="text-lg font-semibold">Transaction ID: {transaction.id}</Text>
              <Text className="text-sm text-gray-500">Date: {transaction.date}</Text>
              <Text className="text-lg font-semibold mt-2">
                Total Price: {totalPrice.toFixed(2)} zł
              </Text>
            </View>

            {/* Lista elementów w transakcji */}
            <View>
              {transaction.transactionParts.map((part, index) => (
                <View
                  key={index}
                  className="flex-row justify-between items-center p-2 mb-2 bg-gray-100 rounded-lg"
                >
                  <View className="flex-row items-center">
                    <Image
                      source={{ uri: part.partDto.image }}
                      style={{ width: 50, height: 50, marginRight: 8, borderRadius: 8 }}
                    />
                    <View>
                      <Text className="font-semibold">{part.partDto.name}</Text>
                      <Text className="text-sm text-gray-500">
                        {part.quantity} x {part.partDto.price.toFixed(2)} zł
                      </Text>
                    </View>
                  </View>
                  <Text className="font-semibold text-right">
                    {(part.quantity * part.partDto.price).toFixed(2)} zł
                  </Text>
                  
                </View>
              ))}
              
            </View>
          </View>
        );
      })}
      <TouchableOpacity
                style={styles.button}
                onPress={() => router.push("../(tabs)/home")}
              >
                <Text style={styles.buttonText}>Back to Home</Text>
              </TouchableOpacity>
    </ScrollView>
  );
};

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


export default MyOrders;
