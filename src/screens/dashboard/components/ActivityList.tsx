import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { LinearGradient } from "expo-linear-gradient";
import React, { memo, useCallback, useMemo } from "react";
import {
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Animated, {
  FadeInDown,
  interpolate,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from "react-native-reanimated";
import { COLORS } from "../constants/color";
import { ActivityItem } from "../types/presence.types";
import { getFontFamily } from "./../../../constants/typography";

// ==================== TYPES ====================
interface ActivityListProps {
  activities: ActivityItem[];
  onSeeAll?: () => void;
  onActivityPress?: (activity: ActivityItem) => void;
  maxItems?: number;
}

// ==================== CONFIGURATION DES ACTIVITÉS ====================
type ActivityConfig = {
  label: string;
  icon: keyof typeof Ionicons.glyphMap;
  colors: {
    primary: string;
    light: string;
    gradient: readonly [string, string];
  };
  badge: string;
};

const ACTIVITY_CONFIG: Record<string, ActivityConfig> = {
  arrival: {
    label: "Arrivée",
    icon: "log-in-outline",
    colors: {
      primary: COLORS.success.main,
      light: COLORS.success.light,
      gradient: [COLORS.success.light, COLORS.success.main] as const,
    },
    badge: "Présent",
  },
  departure: {
    label: "Départ",
    icon: "log-out-outline",
    colors: {
      primary: COLORS.error.main,
      light: COLORS.error.light,
      gradient: [COLORS.error.light, COLORS.error.main] as const,
    },
    badge: "Sorti",
  },
  break: {
    label: "Pause",
    icon: "cafe-outline",
    colors: {
      primary: COLORS.warning.main,
      light: COLORS.warning.light,
      gradient: [COLORS.warning.light, COLORS.warning.main] as const,
    },
    badge: "Pause",
  },
  absent: {
    label: "Absent",
    icon: "close-circle-outline",
    colors: {
      primary: COLORS.error.main,
      light: COLORS.error.light,
      gradient: [COLORS.error.light, COLORS.error.main] as const,
    },
    badge: "Absent",
  },
  non_travaille: {
    label: "Non travaillé",
    icon: "calendar-outline",
    colors: {
      primary: COLORS.gray[500],
      light: COLORS.gray[100],
      gradient: [COLORS.gray[100], COLORS.gray[200]] as const,
    },
    badge: "Non travaillé",
  },
  ferie: {
    label: "Férié",
    icon: "gift-outline",
    colors: {
      primary: COLORS.warning.main,
      light: COLORS.warning.light,
      gradient: [COLORS.warning.light, COLORS.warning.main] as const,
    },
    badge: "Férié",
  },
  justifie: {
    label: "Justifié",
    icon: "document-text-outline",
    colors: {
      primary: COLORS.primary.main,
      light: COLORS.primary.light,
      gradient: [COLORS.primary.light, COLORS.primary.main] as const,
    },
    badge: "Justifié",
  },
  supplementaire: {
    label: "Supplémentaire",
    icon: "trending-up-outline",
    colors: {
      primary: COLORS.success.dark,
      light: COLORS.success.light,
      gradient: [COLORS.success.light, COLORS.success.main] as const,
    },
    badge: "Suppl.",
  },
};

// ==================== CONSTANTES ====================
const ANIMATION = {
  SCALE_TO: 0.97,
  DAMPING: 12,
  GLOW_DURATION: 100,
  FADE_DURATION: 200,
  DELAY_STEP: 50,
  OPACITY_MAX: 0.15,
} as const;

// ==================== UTILS ====================
const getActivityConfig = (type: string): ActivityConfig => 
  ACTIVITY_CONFIG[type] ?? ACTIVITY_CONFIG.break;

// ==================== COMPOSANT ACTIVITY ROW ====================
interface ActivityRowProps {
  activity: ActivityItem;
  index: number;
  onPress?: (activity: ActivityItem) => void;
}

const ActivityRow = memo(({ activity, index, onPress }: ActivityRowProps) => {
  const scale = useSharedValue(1);
  const glow = useSharedValue(0);
  const config = getActivityConfig(activity.type);

  const handlePress = useCallback(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

    scale.value = withSpring(ANIMATION.SCALE_TO, { damping: ANIMATION.DAMPING }, () => {
      scale.value = withSpring(1);
    });

    glow.value = withTiming(1, { duration: ANIMATION.GLOW_DURATION }, () => {
      glow.value = withTiming(0, { duration: ANIMATION.FADE_DURATION });
      if (onPress) runOnJS(onPress)(activity);
    });
  }, [activity, onPress]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const glowStyle = useAnimatedStyle(() => ({
    opacity: interpolate(glow.value, [0, 1], [0, ANIMATION.OPACITY_MAX]),
  }));

  return (
    <Animated.View
      entering={FadeInDown.delay(100 + index * ANIMATION.DELAY_STEP).springify()}
      style={[styles.row, animatedStyle]}
    >
      <TouchableOpacity style={styles.touchable} onPress={handlePress} activeOpacity={0.9}>
        <LinearGradient colors={[COLORS.white, COLORS.gray[50]]} style={styles.gradient}>
          <Animated.View style={[styles.glow, { backgroundColor: config.colors.primary }, glowStyle]} />

          <View style={styles.item}>
            <LinearGradient colors={config.colors.gradient} style={styles.icon}>
              <Ionicons name={config.icon} size={18} color={COLORS.white} />
            </LinearGradient>

            <View style={styles.content}>
              <View style={styles.header}>
                <Text style={styles.title}>{config.label}</Text>
                <View style={[styles.badge, { backgroundColor: `${config.colors.primary}12` }]}>
                  <View style={[styles.dot, { backgroundColor: config.colors.primary }]} />
                  <Text style={[styles.badgeText, { color: config.colors.primary }]}>
                    {config.badge}
                  </Text>
                </View>
              </View>

              <View style={styles.details}>
                <View style={styles.time}>
                  <Ionicons name="time-outline" size={12} color={COLORS.gray[400]} />
                  <Text style={styles.timeText}>{activity.time}</Text>
                </View>
                {activity.status && (
                  <>
                    <View style={styles.separator} />
                    <Text style={styles.status}>{activity.status}</Text>
                  </>
                )}
              </View>
            </View>

            <View style={[styles.arrow, { backgroundColor: `${config.colors.primary}08` }]}>
              <Ionicons name="chevron-forward" size={16} color={config.colors.primary} />
            </View>
          </View>
        </LinearGradient>
      </TouchableOpacity>
    </Animated.View>
  );
});

// ==================== COMPOSANT PRINCIPAL ====================
export const ActivityList = memo(({ 
  activities, 
  onSeeAll, 
  onActivityPress, 
  maxItems = 5 
}: ActivityListProps) => {
  const displayed = useMemo(() => activities.slice(0, maxItems), [activities, maxItems]);
  const hasMore = activities.length > maxItems;

  if (displayed.length === 0) {
    return (
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <View style={styles.titleContainer}>
            <Text style={styles.sectionTitle}>Activité récente</Text>
          </View>
        </View>
        <Animated.View entering={FadeInDown.springify()} style={styles.empty}>
          <LinearGradient colors={[COLORS.gray[50], COLORS.white]} style={styles.emptyGradient}>
            <View style={styles.emptyIcon}>
              <Ionicons name="time-outline" size={32} color={COLORS.gray[300]} />
            </View>
            <Text style={styles.emptyTitle}>Aucune activité</Text>
            <Text style={styles.emptyText}>Les activités récentes apparaîtront ici</Text>
          </LinearGradient>
        </Animated.View>
      </View>
    );
  }

  return (
    <View style={styles.section}>
      <View style={styles.sectionHeader}>
        <View style={styles.titleContainer}>
          <Text style={styles.sectionTitle}>Activité récente</Text>
          <View style={styles.count}>
            <Text style={styles.countText}>{activities.length}</Text>
          </View>
        </View>
        {onSeeAll && hasMore && (
          <TouchableOpacity onPress={onSeeAll} activeOpacity={0.7}>
            <LinearGradient colors={[COLORS.primary.light, COLORS.primary.main]} style={styles.seeAll}>
              <Text style={styles.seeAllText}>Voir tout</Text>
              <Ionicons name="arrow-forward" size={14} color={COLORS.white} />
            </LinearGradient>
          </TouchableOpacity>
        )}
      </View>

      <View style={styles.container}>
        {displayed.map((activity, index) => (
          <React.Fragment key={activity.id}>
            <ActivityRow activity={activity} index={index} onPress={onActivityPress} />
            {index < displayed.length - 1 && (
              <LinearGradient colors={[COLORS.gray[100], COLORS.gray[200], COLORS.gray[100]]} style={styles.divider} />
            )}
          </React.Fragment>
        ))}
      </View>
    </View>
  );
});

// ==================== STYLES ====================
const styles = StyleSheet.create({
  section: {
    marginBottom: 28,
    paddingHorizontal: 20,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  titleContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: getFontFamily("bold"),
    color: COLORS.gray[900],
    letterSpacing: -0.5,
  },
  count: {
    backgroundColor: COLORS.primary.light,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
  },
  countText: {
    fontSize: 12,
    fontFamily: getFontFamily("semibold"),
    color: COLORS.primary.main,
  },
  seeAll: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    ...Platform.select({
      ios: {
        shadowColor: COLORS.primary.main,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.15,
        shadowRadius: 4,
      },
      android: { elevation: 3 },
    }),
  },
  seeAllText: {
    fontSize: 13,
    fontFamily: getFontFamily("medium"),
    color: COLORS.white,
  },
  container: {
    backgroundColor: COLORS.white,
    borderRadius: 20,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: COLORS.gray[200],
    ...Platform.select({
      ios: {
        shadowColor: COLORS.black,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
      },
      android: { elevation: 2 },
    }),
  },
  row: { width: "100%" },
  touchable: { width: "100%" },
  gradient: {
    padding: 16,
    position: "relative",
    overflow: "hidden",
  },
  glow: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    opacity: 0,
  },
  item: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  icon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    ...Platform.select({
      ios: {
        shadowColor: COLORS.black,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: { elevation: 2 },
    }),
  },
  content: { flex: 1 },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 4,
  },
  title: {
    fontSize: 15,
    fontFamily: getFontFamily("semibold"),
    color: COLORS.gray[900],
  },
  badge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
  },
  dot: { width: 6, height: 6, borderRadius: 3 },
  badgeText: { fontSize: 10, fontFamily: getFontFamily("medium") },
  details: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  time: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  timeText: {
    fontSize: 12,
    fontFamily: getFontFamily("regular"),
    color: COLORS.gray[500],
  },
  separator: {
    width: 3,
    height: 3,
    borderRadius: 1.5,
    backgroundColor: COLORS.gray[300],
  },
  status: {
    fontSize: 12,
    fontFamily: getFontFamily("medium"),
    color: COLORS.gray[600],
  },
  arrow: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
  },
  divider: {
    height: 1,
    marginHorizontal: 16,
  },
  empty: {
    borderRadius: 20,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: COLORS.gray[200],
  },
  emptyGradient: {
    padding: 32,
    alignItems: "center",
  },
  emptyIcon: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: COLORS.gray[100],
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 16,
    fontFamily: getFontFamily("semibold"),
    color: COLORS.gray[700],
    marginBottom: 4,
  },
  emptyText: {
    fontSize: 13,
    fontFamily: getFontFamily("regular"),
    color: COLORS.gray[500],
    textAlign: "center",
  },
});

ActivityRow.displayName = "ActivityRow";
ActivityList.displayName = "ActivityList";