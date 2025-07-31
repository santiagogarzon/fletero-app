import * as React from "react";
import { View, Text, ScrollView, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Button from "../components/Button";
import { FirebaseTestService } from "../services/firebaseTestService";

export default function FirebaseTestScreen() {
  const [testResults, setTestResults] = React.useState<any>(null);
  const [isLoading, setIsLoading] = React.useState(false);

  const runFirebaseTests = async () => {
    setIsLoading(true);
    try {
      const results = await FirebaseTestService.testFirebaseConfig();
      setTestResults(results);

      if (results.auth && results.firestore) {
        Alert.alert("Success", "Firebase connection is working!");
      } else {
        Alert.alert(
          "Error",
          "Firebase connection failed. Check the console for details."
        );
      }
    } catch (error: any) {
      Alert.alert("Error", error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <ScrollView className="flex-1 p-6">
        <Text className="text-2xl font-bold text-gray-900 mb-4">
          Firebase Connection Test
        </Text>

        <Text className="text-gray-600 mb-6">
          This screen helps debug Firebase connection issues. Run the test to
          check if Firebase is properly configured.
        </Text>

        <Button
          title="Run Firebase Tests"
          onPress={runFirebaseTests}
          loading={isLoading}
          fullWidth
        />

        {testResults && (
          <View className="mt-6 p-4 bg-gray-100 rounded-lg">
            <Text className="text-lg font-semibold mb-2">Test Results:</Text>

            <View className="space-y-2">
              <Text className="text-sm">
                <Text className="font-medium">Auth:</Text>{" "}
                <Text
                  className={
                    testResults.auth ? "text-green-600" : "text-red-600"
                  }
                >
                  {testResults.auth ? "✅ Working" : "❌ Failed"}
                </Text>
              </Text>

              <Text className="text-sm">
                <Text className="font-medium">Firestore:</Text>{" "}
                <Text
                  className={
                    testResults.firestore ? "text-green-600" : "text-red-600"
                  }
                >
                  {testResults.firestore ? "✅ Working" : "❌ Failed"}
                </Text>
              </Text>
            </View>

            <Text className="text-sm font-medium mt-4 mb-2">
              Configuration:
            </Text>
            <Text className="text-xs text-gray-600">
              {JSON.stringify(testResults.config, null, 2)}
            </Text>
          </View>
        )}

        <View className="mt-6 p-4 bg-blue-50 rounded-lg">
          <Text className="text-sm font-medium text-blue-900 mb-2">
            Troubleshooting Steps:
          </Text>
          <Text className="text-xs text-blue-800">
            1. Verify Firebase project exists in Firebase Console{"\n"}
            2. Check if Authentication is enabled{"\n"}
            3. Verify Firestore is enabled{"\n"}
            4. Check if the API key is correct{"\n"}
            5. Ensure the project ID matches
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
