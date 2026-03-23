import { RootStackParamList } from "@/navigation/types";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { LinearGradient } from "expo-linear-gradient";
import React, { memo, useCallback } from "react";
import {
  Animated,
  Platform,
  RefreshControl,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  View,
} from "react-native";
import { useSelector } from "react-redux";
import { RootState } from "redux/store";
import { ActivityList } from "./components/ActivityList";
import { Clock } from "./components/Clock";
import { Header } from "./components/Header";
import { MetricsCard } from "./components/MetricsCard";
import { PresenceCards } from "./components/PresenceCards";
import { QuickActions } from "./components/QuickActions";
import { WeekIndicator } from "./components/WeekIndicator";
import { useActivities } from "./hooks/useActivities";
import { useCombinedAnimation } from "./hooks/useAnimation";
import { useCurrentTime } from "./hooks/useCurrentTime";
import { usePresence } from "./hooks/usePresence";
import { useWeekIndicator } from "./hooks/useWeekIndicator";

const BLUE_PRO = {
  primary: "#0A4DA4",
  secondary: "#1E6EC7",
  light: "#E8F0FE",
  accent: "#2E7BE6",
  dark: "#07317A",
} as const;

type AppNavigationProp = NativeStackNavigationProp<RootStackParamList>;

const DashboardScreen = memo(() => {
  const navigation = useNavigation<AppNavigationProp>();
  const data = useSelector((state: RootState) => state.auth.currentUser);

  const { presence, isLoading, handlePointage, metrics, handleMetricPress } =
    usePresence();
  const { activities, refreshActivities, handleActivityPress, handleSeeAll } =
    useActivities(data?.id);
  const {
    days: weekDays,
    refresh: refreshWeek,
    handleDayPress,
  } = useWeekIndicator(data?.id);
  const { formattedDate, formattedTime, formattedSeconds } = useCurrentTime();
  const { animatedStyle } = useCombinedAnimation();

  const handleRefresh = useCallback(() => {
    refreshActivities();
    refreshWeek();
  }, [refreshActivities, refreshWeek]);

  const handleActionPress = useCallback(
    (action: string) => {
      switch (action) {
        case "QR Code":
          navigation.navigate("QRScanner");
          break;
        case "Géoloc":
          navigation.navigate("Geoloc");
          break;
        case "Historique":
          navigation.navigate("Historique");
          break;
        case "Rapports":
          navigation.navigate("Rapports");
          break;
        default:
          break;
      }
    },
    [navigation],
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={BLUE_PRO.primary} />
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl refreshing={isLoading} onRefresh={handleRefresh} />
        }
      >
        <Animated.View style={[styles.content, animatedStyle]}>
          <LinearGradient
            colors={[BLUE_PRO.primary, BLUE_PRO.dark]}
            style={styles.headerSection}
          >
            <View style={styles.shineEffect} />
            <View style={styles.headerContent}>
              <Header
                userName={data?.nom || "Utilisateur"}
                userRole={data?.role || "Employé"}
              />
              <Clock
                time={formattedTime}
                seconds={formattedSeconds}
                date={formattedDate}
              />
              <PresenceCards
                presence={presence}
                onPointage={handlePointage}
                isLoading={isLoading}
              />
            </View>
          </LinearGradient>

          <View style={styles.metricsSection}>
            <MetricsCard
              retard={metrics.retard}
              supplementaires={metrics.supplementaires}
              objectif={metrics.objectif}
              objectifAtteint={metrics.objectifAtteint}
            />
            <QuickActions onActionPress={handleActionPress} />
            <ActivityList
              activities={activities}
              onSeeAll={handleSeeAll}
              onActivityPress={handleActivityPress}
              maxItems={5}
            />
            <WeekIndicator
              days={weekDays}
              onDayPress={handleDayPress}
              showHours={true}
            />
          </View>
        </Animated.View>
      </ScrollView>
    </SafeAreaView>
  );
});

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: BLUE_PRO.light },
  scrollContent: { flexGrow: 1 },
  content: { flex: 1 },
  headerSection: {
    paddingTop: Platform.OS === "android" ? 16 : 0,
    paddingBottom: 24,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    ...Platform.select({
      ios: {
        shadowColor: BLUE_PRO.dark,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.25,
        shadowRadius: 12,
      },
      android: { elevation: 8 },
    }),
    position: "relative",
    overflow: "hidden",
  },
  shineEffect: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: "100%",
    backgroundColor: "rgba(255, 255, 255, 0.03)",
  },
  headerContent: { paddingHorizontal: 20, zIndex: 2 },
  metricsSection: { paddingTop: 16, paddingHorizontal: 20 },
});

export default DashboardScreen;
