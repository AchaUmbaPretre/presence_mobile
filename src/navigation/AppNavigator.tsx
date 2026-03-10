import GeolocScreen from "@/screens/geoloc/GeolocScreen";
import HistoryScreen from "@/screens/historique/HistoryScreen";
import QRScannerScreen from "@/screens/qr-code/QRScannerScreen";
import RapportPresenceScreen from "@/screens/rapportPresence/RapportPresenceScreen";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import React from "react";
import { COLORS } from "./../screens/dashboard/constants/color";
import TabNavigator from "./TabNavigator";

export type AppStackParamList = {
  Tabs: undefined;
  QRScanner: undefined;
  Geoloc: undefined;
  Historique: undefined;
  Rapports: undefined;
};

const Stack = createNativeStackNavigator<AppStackParamList>();

const AppNavigator = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        animation: "slide_from_right",
        contentStyle: {
          backgroundColor: COLORS.background,
        },
      }}
    >
      <Stack.Screen name="Tabs" component={TabNavigator} />
      <Stack.Screen name="QRScanner" component={QRScannerScreen} />
      <Stack.Screen name="Geoloc" component={GeolocScreen} />
      <Stack.Screen name="Historique" component={HistoryScreen} />
      <Stack.Screen name="Rapports" component={RapportPresenceScreen} />
    </Stack.Navigator>
  );
};

export default AppNavigator;
