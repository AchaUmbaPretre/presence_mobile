import React, { memo } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { COLORS } from "../constants/color";
import { ActivityItem } from "../types/presence.types";

interface ActivityListProps {
  activities: ActivityItem[];
  onSeeAll?: () => void;
}

const ActivityRow = memo(({ activity }: { activity: ActivityItem }) => (
  <View style={styles.activityItem}>
    <View
      style={[
        styles.activityDot,
        activity.type === "arrival" && styles.activityDotSuccess,
        activity.type === "departure" && styles.activityDotError,
        activity.type === "break" && styles.activityDotWarning,
      ]}
    />
    <View style={styles.activityContent}>
      <Text style={styles.activityTitle}>
        {activity.type === "arrival"
          ? "Arrivée"
          : activity.type === "departure"
            ? "Départ"
            : "Pause déjeuner"}
      </Text>
      <Text style={styles.activityTime}>{activity.time}</Text>
    </View>
    <Text style={styles.activityStatus}>{activity.status}</Text>
  </View>
));

export const ActivityList = memo(
  ({ activities, onSeeAll }: ActivityListProps) => (
    <View style={styles.section}>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Activité récente</Text>
        {onSeeAll && (
          <TouchableOpacity onPress={onSeeAll}>
            <Text style={styles.sectionLink}>Voir tout</Text>
          </TouchableOpacity>
        )}
      </View>

      <View style={styles.activityContainer}>
        {activities.map((activity, index, array) => (
          <React.Fragment key={activity.id}>
            <ActivityRow activity={activity} />
            {index < array.length - 1 && <View style={styles.divider} />}
          </React.Fragment>
        ))}
      </View>
    </View>
  ),
);

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
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: COLORS.gray[900],
    letterSpacing: -0.2,
  },
  sectionLink: {
    fontSize: 13,
    color: COLORS.primary.main,
    fontWeight: "500",
  },
  activityContainer: {
    backgroundColor: COLORS.gray[50],
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: COLORS.gray[100],
  },
  activityItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
  },
  activityDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 12,
  },
  activityDotSuccess: {
    backgroundColor: COLORS.success.main,
  },
  activityDotError: {
    backgroundColor: COLORS.error.main,
  },
  activityDotWarning: {
    backgroundColor: COLORS.warning.main,
  },
  activityContent: {
    flex: 1,
  },
  activityTitle: {
    fontSize: 14,
    fontWeight: "500",
    color: COLORS.gray[900],
    marginBottom: 2,
  },
  activityTime: {
    fontSize: 12,
    color: COLORS.gray[500],
  },
  activityStatus: {
    fontSize: 12,
    color: COLORS.gray[400],
    marginLeft: 12,
  },
  divider: {
    height: 1,
    backgroundColor: COLORS.gray[200],
    marginVertical: 8,
  },
});
