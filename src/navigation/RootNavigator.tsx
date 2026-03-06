import { createNativeStackNavigator } from "@react-navigation/native-stack";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, View } from "react-native";
import { useSelector } from "react-redux";
import { COLORS } from "../screens/dashboard/constants/color";
import { RootState } from "../store/store";
import AppNavigator from "./AppNavigator";
import AuthNavigator from "./AuthNavigator";
import { RootStackParamList } from "./types";

const Stack = createNativeStackNavigator<RootStackParamList>();

const RootNavigator = () => {
  const [isLoading, setIsLoading] = useState(true);
  const isAuthenticated = useSelector(
    (state: RootState) => state.auth.token !== null,
  );

  useEffect(() => {
    const checkAuth = async () => {
      setTimeout(() => {
        setIsLoading(false);
      }, 500);
    };
    checkAuth();
  }, []);

  if (isLoading) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: COLORS.background,
        }}
      >
        <ActivityIndicator size="large" color={COLORS.primary.main} />
      </View>
    );
  }

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {!isAuthenticated ? (
        <Stack.Screen name="Auth" component={AuthNavigator} />
      ) : (
        <Stack.Screen name="Main" component={AppNavigator} />
      )}
    </Stack.Navigator>
  );
};

export default RootNavigator;
