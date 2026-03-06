import { NavigationContainer } from "@react-navigation/native";
import { StatusBar } from "expo-status-bar";
import React, { useEffect } from "react";
import { StyleSheet, View } from "react-native";
import {
    SafeAreaProvider,
    useSafeAreaInsets,
} from "react-native-safe-area-context";
import { Provider, useDispatch } from "react-redux";
import RootNavigator from "./src/navigation/RootNavigator";
import { COLORS } from "./src/screens/dashboard/constants/color";
import { store } from "./redux/store";
import { restoreSession } from "./redux/authSlice";

const AuthInitializer = ({ children }: { children: React.ReactNode }) => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(restoreSession() as any);
  }, [dispatch]);

  return <>{children}</>;
};

const AppContent = () => {
  const insets = useSafeAreaInsets();

  return (
    <View
      style={[
        styles.container,
        {
          paddingTop: insets.top,
          paddingBottom: insets.bottom,
        },
      ]}
    >
      <AuthInitializer>
        <RootNavigator />
      </AuthInitializer>
      <StatusBar style="dark" backgroundColor={COLORS.background} />
    </View>
  );
};

export default function App() {
  return (
    <Provider store={store}>
      <SafeAreaProvider>
        <NavigationContainer>
          <AppContent />
        </NavigationContainer>
      </SafeAreaProvider>
    </Provider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
});