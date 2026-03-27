import ProfileScreen from "@/screens/profile/ProfileScreen";
import SettingsScreen from "@/screens/Settings/SettingsScreen";
import { Ionicons } from "@expo/vector-icons";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { BlurView } from "expo-blur";
import React, { useRef } from "react";
import {
  Animated,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import DashboardScreen from "../screens/dashboard/DashboardScreen";
import { getFontFamily } from "./../constants/typography";
import { COLORS } from "./../screens/dashboard/constants/color";

export type TabParamList = {
  Dashboard: undefined;
  Profile: undefined;
  Settings: undefined;
};

interface TabConfig {
  name: keyof TabParamList;
  component: React.ComponentType<any>;
  label: string;
  icon: {
    focused: keyof typeof Ionicons.glyphMap;
    unfocused: keyof typeof Ionicons.glyphMap;
  };
  badge?: number;
}

const TAB_CONFIG: TabConfig[] = [
  {
    name: "Dashboard",
    component: DashboardScreen,
    label: "Accueil",
    icon: {
      focused: "home",
      unfocused: "home-outline",
    },
    badge: 0,
  },
  {
    name: "Profile",
    component: ProfileScreen,
    label: "Profil",
    icon: {
      focused: "person",
      unfocused: "person-outline",
    },
    badge: 2,
  },
  {
    name: "Settings",
    component: SettingsScreen,
    label: "Paramètres",
    icon: {
      focused: "settings",
      unfocused: "settings-outline",
    },
    badge: 0,
  },
];

const CustomTabBar = ({ state, descriptors, navigation }: any) => {
  const insets = useSafeAreaInsets();
  const scaleAnims = useRef(
    state.routes.map(() => new Animated.Value(1)),
  ).current;

  const handlePress = (
    routeName: string,
    isFocused: boolean,
    index: number,
  ) => {
    const event = navigation.emit({
      type: "tabPress",
      target: routeName,
      canPreventDefault: true,
    });

    if (!isFocused && !event.defaultPrevented) {
      Animated.sequence([
        Animated.spring(scaleAnims[index], {
          toValue: 0.85,
          useNativeDriver: true,
          speed: 20,
        }),
        Animated.spring(scaleAnims[index], {
          toValue: 1,
          useNativeDriver: true,
          speed: 20,
        }),
      ]).start();

      navigation.navigate(routeName);
    }
  };

  return (
    <View
      style={[
        styles.tabBarContainer,
        {
          paddingBottom: insets.bottom > 0 ? insets.bottom : 10,
          height: 35 + (insets.bottom > 0 ? insets.bottom : 0),
        },
      ]}
    >
      {Platform.OS === "ios" && (
        <BlurView tint="light" intensity={90} style={StyleSheet.absoluteFill} />
      )}

      <View style={styles.tabBarContent}>
        {state.routes.map((route: any, index: number) => {
          const { options } = descriptors[route.key];
          const isFocused = state.index === index;
          const config = TAB_CONFIG.find((t) => t.name === route.name)!;

          return (
            <TouchableOpacity
              key={route.key}
              accessibilityRole="button"
              accessibilityState={isFocused ? { selected: true } : {}}
              accessibilityLabel={options.tabBarAccessibilityLabel}
              testID={`tab-${route.name.toLowerCase()}`}
              onPress={() => handlePress(route.name, isFocused, index)}
              activeOpacity={0.7}
              style={styles.tabItem}
            >
              <Animated.View
                style={[
                  styles.tabItemInner,
                  {
                    transform: [{ scale: scaleAnims[index] }],
                  },
                ]}
              >
                <View style={styles.iconWrapper}>
                  <Ionicons
                    name={
                      isFocused ? config.icon.focused : config.icon.unfocused
                    }
                    size={isFocused ? 26 : 22}
                    color={isFocused ? COLORS.primary.main : COLORS.gray[400]}
                  />
                  {config.badge ? (
                    <View style={styles.badge}>
                      <Text style={styles.badgeText}>
                        {config.badge > 9 ? "9+" : config.badge}
                      </Text>
                    </View>
                  ) : null}
                </View>

                <Text
                  style={[
                    styles.tabLabel,
                    {
                      color: isFocused ? COLORS.primary.main : COLORS.gray[400],
                      fontFamily: isFocused
                        ? getFontFamily("semibold")
                        : getFontFamily("medium"),
                    },
                  ]}
                >
                  {config.label}
                </Text>

                {isFocused && Platform.OS === "android" && (
                  <View style={styles.activeIndicator} />
                )}
              </Animated.View>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
};

// ==================== COMPOSANT PRINCIPAL ====================
const Tab = createBottomTabNavigator<TabParamList>();

const TabNavigator = () => {
  return (
    <Tab.Navigator
      tabBar={(props) => <CustomTabBar {...props} />}
      screenOptions={{
        headerShown: false,
      }}
    >
      {TAB_CONFIG.map(({ name, component, label }) => (
        <Tab.Screen
          key={name}
          name={name}
          component={component}
          options={{
            title: label,
            tabBarAccessibilityLabel: `${label} onglet`,
          }}
        />
      ))}
    </Tab.Navigator>
  );
};

const styles = StyleSheet.create({
  tabBarContainer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: Platform.OS === "android" ? COLORS.white : "transparent",
    borderTopWidth: Platform.OS === "android" ? 1 : 0,
    borderTopColor: COLORS.gray[200],
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 8,
  },
  tabBarContent: {
    flexDirection: "row",
    height: 60,
    alignItems: "center",
    justifyContent: "space-around",
  },
  tabItem: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  tabItemInner: {
    alignItems: "center",
    justifyContent: "center",
  },
  iconWrapper: {
    position: "relative",
    marginBottom: 4,
  },
  tabLabel: {
    fontSize: 11,
    marginTop: 2,
  },
  activeIndicator: {
    position: "absolute",
    bottom: -8,
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: COLORS.primary.main,
  },
  badge: {
    position: "absolute",
    top: -4,
    right: -8,
    backgroundColor: COLORS.error.main,
    borderRadius: 10,
    minWidth: 16,
    height: 16,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 4,
    borderWidth: 1.5,
    borderColor: COLORS.white,
    ...Platform.select({
      ios: {
        shadowColor: COLORS.error.main,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 3,
      },
      android: {
        elevation: 3,
      },
    }),
  },
  badgeText: {
    color: COLORS.white,
    fontSize: 10,
    fontFamily: getFontFamily("bold"),
  },
});

export default TabNavigator;
