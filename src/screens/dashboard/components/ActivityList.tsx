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
type ActivityType =
  | "arrival"
  | "departure"
  | "break"
  | "absent"
  | "non_travaille"
  | "ferie"
  | "justifie";

interface ActivityConfig {
  label: string;
  icon: keyof typeof Ionicons.glyphMap;
  colors: {
    primary: string;
    light: string;
    gradient: readonly [string, string];
  };
  badge: string;
}

// Configuration des activités avec tous les statuts
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

// Fonction de mapping simplifiée
const getActivityConfig = (type: string): ActivityConfig => {
  console.log(`🔍 Recherche config pour type: "${type}"`);

  // Retourner la config si elle existe
  if (ACTIVITY_CONFIG[type]) {
    return ACTIVITY_CONFIG[type];
  }

  // Fallback
  console.warn(`⚠️ Type inconnu: "${type}", fallback sur break`);
  return ACTIVITY_CONFIG.break;
};

// ==================== COMPOSANT ACTIVITY ROW ====================
interface ActivityRowProps {
  activity: ActivityItem;
  index: number;
  onPress?: (activity: ActivityItem) => void;
}

const ActivityRow = memo(({ activity, index, onPress }: ActivityRowProps) => {
  const scale = useSharedValue(1);
  const glow = useSharedValue(0);

  // Récupérer la configuration
  const config = useMemo(
    () => getActivityConfig(activity.type),
    [activity.type],
  );

  // Debug - pour voir les types reçus
  console.log(`📝 Type reçu: "${activity.type}" → Config:`, config.label);

  // Gestion du clic
  const handlePress = useCallback(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

    scale.value = withSpring(0.97, { damping: 12 }, () => {
      scale.value = withSpring(1);
    });

    glow.value = withTiming(1, { duration: 100 }, () => {
      glow.value = withTiming(0, { duration: 200 });
      if (onPress) {
        runOnJS(onPress)(activity);
      }
    });
  }, [activity, onPress, scale, glow]);

  // Styles animés
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const glowStyle = useAnimatedStyle(() => ({
    opacity: interpolate(glow.value, [0, 1], [0, 0.15]),
  }));

  return (
    <Animated.View
      entering={FadeInDown.delay(100 + index * 50).springify()}
      style={[styles.activityRowWrapper, animatedStyle]}
    >
      <TouchableOpacity
        style={styles.activityTouchable}
        onPress={handlePress}
        activeOpacity={0.9}
      >
        <LinearGradient
          colors={[COLORS.white, COLORS.gray[50]]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.activityGradient}
        >
          {/* Effet de glow */}
          <Animated.View
            style={[
              styles.glowEffect,
              { backgroundColor: config.colors.primary },
              glowStyle,
            ]}
          />

          <View style={styles.activityItem}>
            {/* Icône avec gradient */}
            <LinearGradient
              colors={config.colors.gradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.iconContainer}
            >
              <Ionicons name={config.icon} size={18} color={COLORS.white} />
            </LinearGradient>

            {/* Contenu principal */}
            <View style={styles.activityContent}>
              <View style={styles.titleRow}>
                <Text style={styles.activityTitle}>{config.label}</Text>
                <View
                  style={[
                    styles.typeBadge,
                    { backgroundColor: `${config.colors.primary}12` },
                  ]}
                >
                  <View
                    style={[
                      styles.typeDot,
                      { backgroundColor: config.colors.primary },
                    ]}
                  />
                  <Text
                    style={[styles.typeText, { color: config.colors.primary }]}
                  >
                    {config.badge}
                  </Text>
                </View>
              </View>

              <View style={styles.detailsRow}>
                <View style={styles.timeContainer}>
                  <Ionicons
                    name="time-outline"
                    size={12}
                    color={COLORS.gray[400]}
                  />
                  <Text style={styles.activityTime}>{activity.time}</Text>
                </View>
                {activity.status && (
                  <>
                    <View style={styles.statusDot} />
                    <Text style={styles.activityStatus}>{activity.status}</Text>
                  </>
                )}
              </View>
            </View>

            {/* Flèche de navigation */}
            <View
              style={[
                styles.arrowContainer,
                { backgroundColor: `${config.colors.primary}08` },
              ]}
            >
              <Ionicons
                name="chevron-forward"
                size={16}
                color={config.colors.primary}
              />
            </View>
          </View>
        </LinearGradient>
      </TouchableOpacity>
    </Animated.View>
  );
});

// ==================== COMPOSANT PRINCIPAL ====================
export const ActivityList = memo(
  ({
    activities,
    onSeeAll,
    onActivityPress,
    maxItems = 5,
  }: ActivityListProps) => {
    const displayedActivities = useMemo(
      () => activities.slice(0, maxItems),
      [activities, maxItems],
    );

    const hasMore = activities.length > maxItems;

    // État vide
    if (displayedActivities.length === 0) {
      return (
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <View style={styles.titleContainer}>
              <Text style={styles.sectionTitle}>Activité récente</Text>
            </View>
          </View>
          <Animated.View
            entering={FadeInDown.springify()}
            style={styles.emptyContainer}
          >
            <LinearGradient
              colors={[COLORS.gray[50], COLORS.white]}
              style={styles.emptyGradient}
            >
              <View style={styles.emptyIconContainer}>
                <Ionicons
                  name="time-outline"
                  size={32}
                  color={COLORS.gray[300]}
                />
              </View>
              <Text style={styles.emptyTitle}>Aucune activité</Text>
              <Text style={styles.emptyText}>
                Les activités récentes apparaîtront ici
              </Text>
            </LinearGradient>
          </Animated.View>
        </View>
      );
    }

    return (
      <View style={styles.section}>
        {/* En-tête de section */}
        <View style={styles.sectionHeader}>
          <View style={styles.titleContainer}>
            <Text style={styles.sectionTitle}>Activité récente</Text>
            <View style={styles.countBadge}>
              <Text style={styles.countText}>{activities.length}</Text>
            </View>
          </View>
          {onSeeAll && hasMore && (
            <TouchableOpacity
              onPress={() => {
                Haptics.selectionAsync();
                onSeeAll();
              }}
              activeOpacity={0.7}
            >
              <LinearGradient
                colors={[COLORS.primary.light, COLORS.primary.main]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.seeAllButton}
              >
                <Text style={styles.sectionLink}>Voir tout</Text>
                <Ionicons name="arrow-forward" size={14} color={COLORS.white} />
              </LinearGradient>
            </TouchableOpacity>
          )}
        </View>

        {/* Liste des activités */}
        <View style={styles.activityContainer}>
          {displayedActivities.map((activity, index) => (
            <React.Fragment key={activity.id}>
              <ActivityRow
                activity={activity}
                index={index}
                onPress={onActivityPress}
              />
              {index < displayedActivities.length - 1 && (
                <LinearGradient
                  colors={[
                    COLORS.gray[100],
                    COLORS.gray[200],
                    COLORS.gray[100],
                  ]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={styles.divider}
                />
              )}
            </React.Fragment>
          ))}
        </View>
      </View>
    );
  },
);

// ==================== STYLES ====================
const styles = StyleSheet.create({
  section: {
    marginBottom: 28,
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
  countBadge: {
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
  seeAllButton: {
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
      android: {
        elevation: 3,
      },
    }),
  },
  sectionLink: {
    fontSize: 13,
    fontFamily: getFontFamily("medium"),
    color: COLORS.white,
  },
  activityContainer: {
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
      android: {
        elevation: 2,
      },
    }),
  },
  activityRowWrapper: {
    width: "100%",
  },
  activityTouchable: {
    width: "100%",
  },
  activityGradient: {
    padding: 16,
    position: "relative",
    overflow: "hidden",
  },
  glowEffect: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    opacity: 0,
  },
  activityItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  iconContainer: {
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
      android: {
        elevation: 2,
      },
    }),
  },
  activityContent: {
    flex: 1,
  },
  titleRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 4,
  },
  activityTitle: {
    fontSize: 15,
    fontFamily: getFontFamily("semibold"),
    color: COLORS.gray[900],
  },
  typeBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
  },
  typeDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  typeText: {
    fontSize: 10,
    fontFamily: getFontFamily("medium"),
  },
  detailsRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  timeContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  activityTime: {
    fontSize: 12,
    fontFamily: getFontFamily("regular"),
    color: COLORS.gray[500],
  },
  statusDot: {
    width: 3,
    height: 3,
    borderRadius: 1.5,
    backgroundColor: COLORS.gray[300],
  },
  activityStatus: {
    fontSize: 12,
    fontFamily: getFontFamily("medium"),
    color: COLORS.gray[600],
  },
  arrowContainer: {
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
  emptyContainer: {
    borderRadius: 20,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: COLORS.gray[200],
  },
  emptyGradient: {
    padding: 32,
    alignItems: "center",
  },
  emptyIconContainer: {
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

// Ajout des display names
ActivityRow.displayName = "ActivityRow";
ActivityList.displayName = "ActivityList";
