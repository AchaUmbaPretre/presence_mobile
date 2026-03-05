import React, { memo, useCallback } from "react";
import {
  Animated,
  RefreshControl,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
} from "react-native";
import { ActivityList } from "./components/ActivityList";
import { Clock } from "./components/Clock";
import { Header } from "./components/Header";
import { MetricsCard } from "./components/MetricsCard";
import { PresenceCards } from "./components/PresenceCards";
import { QuickActions } from "./components/QuickActions";
import { WeekIndicator } from "./components/WeekIndicator";
import { COLORS } from "./constants/color";
import { ACTIVITES_RECENTES, WEEK_DAYS } from "./constants/dashboard.constants";
import { useCombinedAnimation } from "./hooks/useAnimation";
import { useCurrentTime } from "./hooks/useCurrentTime";
import { usePresence } from "./hooks/usePresence";

const DashboardScreen = memo(() => {
  const { presence, isLoading, handlePointage } = usePresence();
  const { formattedDate, formattedTime, formattedSeconds } = useCurrentTime();
  const { animatedStyle } = useCombinedAnimation();

  const weekDays = WEEK_DAYS.map((day, index) => ({
    ...day,
    present: index < 4,
    partial: index === 4,
    date: new Date(),
  }));

  const activities = ACTIVITES_RECENTES.map((item) => ({
    ...item,
    id: item.id,
    date: new Date().toISOString(),
  }));

  const handleRefresh = useCallback(() => {}, []);

  const handleActionPress = useCallback((action: string) => {
    console.log("Action pressed:", action);
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.white} />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl refreshing={isLoading} onRefresh={handleRefresh} />
        }
      >
        <Animated.View style={animatedStyle}>
          <Header />
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
          <MetricsCard
            retard={presence.retard_minutes}
            supplementaires={presence.heures_supplementaires}
          />
          <QuickActions onActionPress={handleActionPress} />
          <ActivityList activities={activities} onSeeAll={() => {}} />
          <WeekIndicator days={weekDays} />
        </Animated.View>
      </ScrollView>
    </SafeAreaView>
  );
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.gray[50],
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 50,
  },
});

export default DashboardScreen;
