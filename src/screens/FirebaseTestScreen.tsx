import * as React from "react";
import { useState } from "react";
import { View, Text, ScrollView, TouchableOpacity, Alert } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { FirebaseTestService } from "../services/firebaseTestService";
import { cn } from "../utils/cn";

export default function FirebaseTestScreen() {
  const [testResults, setTestResults] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);

  const runAllTests = async () => {
    setIsLoading(true);
    try {
      const results = await FirebaseTestService.getConnectionStatus();
      setTestResults(results);

      // Show alert if Firestore is not found
      if (!results.results.firestore.success) {
        Alert.alert(
          "❌ Firestore Database Not Found",
          "You need to create the Firestore database in your Firebase project. Check the instructions below.",
          [{ text: "OK" }]
        );
      }
    } catch (error) {
      console.error("Test failed:", error);
      Alert.alert("Error", "Failed to run tests");
    } finally {
      setIsLoading(false);
    }
  };

  const runAuthTest = async () => {
    setIsLoading(true);
    try {
      const result = await FirebaseTestService.testAuthConnection();
      setTestResults({ results: { auth: result } });
    } catch (error) {
      console.error("Auth test failed:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const runFirestoreTest = async () => {
    setIsLoading(true);
    try {
      const result = await FirebaseTestService.testFirestoreConnection();
      setTestResults({ results: { firestore: result } });

      if (!result.success) {
        Alert.alert(
          "❌ Firestore Database Not Found",
          "You need to create the Firestore database in your Firebase project. Check the instructions below.",
          [{ text: "OK" }]
        );
      }
    } catch (error) {
      console.error("Firestore test failed:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const renderTestResult = (testName: string, result: any) => {
    const isSuccess = result?.success;

    return (
      <View
        key={testName}
        className={cn(
          "p-4 rounded-lg mb-3",
          isSuccess
            ? "bg-green-50 border border-green-200"
            : "bg-red-50 border border-red-200"
        )}
      >
        <View className="flex-row items-center mb-2">
          <Ionicons
            name={isSuccess ? "checkmark-circle" : "close-circle"}
            size={20}
            color={isSuccess ? "#10b981" : "#ef4444"}
          />
          <Text
            className={cn(
              "ml-2 font-semibold",
              isSuccess ? "text-green-800" : "text-red-800"
            )}
          >
            {testName}
          </Text>
        </View>

        <Text
          className={cn(
            "text-sm",
            isSuccess ? "text-green-700" : "text-red-700"
          )}
        >
          {result?.message || "No result"}
        </Text>

        {result?.instructions && (
          <View className="mt-3 p-3 bg-blue-50 rounded border border-blue-200">
            <Text className="text-blue-800 font-semibold mb-2">
              📋 Instructions to Fix:
            </Text>
            {result.instructions.map((instruction: string, index: number) => (
              <Text key={index} className="text-blue-700 text-sm mb-1">
                {instruction}
              </Text>
            ))}
          </View>
        )}

        {result?.error && (
          <View className="mt-2 p-2 bg-gray-100 rounded">
            <Text className="text-gray-600 text-xs">
              Error: {result.error.code} - {result.error.message}
            </Text>
          </View>
        )}
      </View>
    );
  };

  return (
    <ScrollView className="flex-1 bg-gray-50">
      <View className="p-4">
        <View className="bg-white rounded-lg p-4 mb-4 shadow-sm">
          <Text className="text-2xl font-bold text-gray-800 mb-2">
            🔥 Firebase Test
          </Text>
          <Text className="text-gray-600 mb-4">
            Test your Firebase configuration and identify issues
          </Text>

          <View className="space-y-2">
            <TouchableOpacity
              onPress={runAllTests}
              disabled={isLoading}
              className={cn(
                "p-3 rounded-lg flex-row items-center justify-center",
                isLoading ? "bg-gray-300" : "bg-blue-500"
              )}
            >
              <Ionicons name="play" size={20} color="white" />
              <Text className="text-white font-semibold ml-2">
                {isLoading ? "Running Tests..." : "Run All Tests"}
              </Text>
            </TouchableOpacity>

            <View className="flex-row space-x-2">
              <TouchableOpacity
                onPress={runAuthTest}
                disabled={isLoading}
                className={cn(
                  "flex-1 p-3 rounded-lg flex-row items-center justify-center",
                  isLoading ? "bg-gray-300" : "bg-green-500"
                )}
              >
                <Ionicons name="shield-checkmark" size={16} color="white" />
                <Text className="text-white font-semibold ml-1">Auth</Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={runFirestoreTest}
                disabled={isLoading}
                className={cn(
                  "flex-1 p-3 rounded-lg flex-row items-center justify-center",
                  isLoading ? "bg-gray-300" : "bg-orange-500"
                )}
              >
                <Ionicons name="document-text" size={16} color="white" />
                <Text className="text-white font-semibold ml-1">Firestore</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {testResults && (
          <View className="bg-white rounded-lg p-4 shadow-sm">
            <Text className="text-lg font-semibold text-gray-800 mb-3">
              Test Results
            </Text>

            <View className="mb-4 p-3 bg-gray-100 rounded">
              <Text className="text-gray-800 font-semibold">
                Overall Status: {testResults.overall}
              </Text>
              <View className="flex-row mt-2 space-x-4">
                <Text>Auth: {testResults.summary?.auth}</Text>
                <Text>Firestore: {testResults.summary?.firestore}</Text>
                <Text>Config: {testResults.summary?.config}</Text>
                <Text>Network: {testResults.summary?.network}</Text>
              </View>
            </View>

            {testResults.results.auth &&
              renderTestResult("Authentication", testResults.results.auth)}
            {testResults.results.firestore &&
              renderTestResult(
                "Firestore Database",
                testResults.results.firestore
              )}
            {testResults.results.config &&
              renderTestResult("Configuration", testResults.results.config)}
            {testResults.results.network &&
              renderTestResult("Network", testResults.results.network)}
            {testResults.results.offline &&
              renderTestResult("Offline Mode", testResults.results.offline)}
          </View>
        )}

        <View className="bg-blue-50 rounded-lg p-4 border border-blue-200">
          <Text className="text-blue-800 font-semibold mb-2">
            🚨 Common Issues & Solutions
          </Text>

          <View className="space-y-2">
            <View>
              <Text className="text-blue-700 font-medium">
                "Failed to get document because the client is offline"
              </Text>
              <Text className="text-blue-600 text-sm">
                This usually means Firestore database doesn't exist. Create it
                in Firebase Console.
              </Text>
            </View>

            <View>
              <Text className="text-blue-700 font-medium">
                "auth/configuration-not-found"
              </Text>
              <Text className="text-blue-600 text-sm">
                Firebase project doesn't exist or configuration is wrong. Check
                your project ID.
              </Text>
            </View>

            <View>
              <Text className="text-blue-700 font-medium">
                "auth/operation-not-allowed"
              </Text>
              <Text className="text-blue-600 text-sm">
                Authentication method not enabled. Enable Email/Password and
                Anonymous auth in Firebase Console.
              </Text>
            </View>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}
