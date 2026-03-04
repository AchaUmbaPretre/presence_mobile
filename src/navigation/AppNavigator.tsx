import { createNativeStackNavigator } from "@react-navigation/native-stack";
import React from "react";
import DashboardScreen from "../screens/dashboard/DashboardScreen";

export type RootStackParamList = {
  Dashboard: undefined;
  // tu pourras ajouter d'autres écrans ici, ex: Settings: undefined
};

const Stack = createNativeStackNavigator<RootStackParamList>();

const AppNavigator = () => {
  return (
    <Stack.Navigator
      initialRouteName="Dashboard"
      screenOptions={{
        headerShown: false, // ou false si tu veux cacher le header
        headerStyle: { backgroundColor: "#2E86AB" },
        headerTintColor: "#fff",
        headerTitleStyle: { fontWeight: "bold" },
      }}
    >
      <Stack.Screen
        name="Dashboard"
        component={DashboardScreen}
        options={{ title: "Présence" }}
      />
    </Stack.Navigator>
  );
};

export default AppNavigator;
