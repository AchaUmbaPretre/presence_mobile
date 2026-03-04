import { Images } from "@/assets";
import React, { memo } from "react";
import {
    ActivityIndicator,
    Image,
    Platform,
    StyleSheet,
    Text,
    View,
} from "react-native";
import { COLORS } from "../constants/color";
import { HORAIRES_TYPE } from "../constants/dashboard.constants";
import { PresenceState } from "../types/presence.types";
import { Card } from "./Card";

interface PresenceCardsProps {
  presence: PresenceState;
  onPointage: (type: "ENTREE" | "SORTIE") => void;
  isLoading?: boolean;
}

export const PresenceCards = memo(
  ({ presence, onPointage, isLoading }: PresenceCardsProps) => {
    const isEntryDisabled = !!presence.heure_entree;
    const isExitDisabled = !presence.heure_entree || !!presence.heure_sortie;

    return (
      <View style={styles.presenceGrid}>
        <Card
          onPress={() => onPointage(HORAIRES_TYPE.ENTREE)}
          disabled={isEntryDisabled || isLoading}
          active={!!presence.heure_entree}
        >
          <View style={styles.cardContent}>
            <Image source={Images.arriveeIcon} style={styles.cardIcon} />
            <View>
              <View style={styles.cardHeader}>
                <Text
                  style={[
                    styles.cardLabel,
                    !!presence.heure_entree && styles.cardLabelActive,
                  ]}
                >
                  Arrivée
                </Text>
              </View>
              <Text
                style={[
                  styles.cardTime,
                  !!presence.heure_entree && styles.cardTimeActive,
                ]}
              >
                {isLoading ? (
                  <ActivityIndicator size="small" />
                ) : (
                  presence.heure_entree || "--:--"
                )}
              </Text>
            </View>
          </View>
        </Card>

        <Card
          onPress={() => onPointage(HORAIRES_TYPE.SORTIE)}
          disabled={isExitDisabled || isLoading}
          active={!!presence.heure_sortie}
        >
          <View style={styles.cardContent}>
            <Image source={Images.departIcon} style={styles.cardIcon} />
            <View>
              <View style={styles.cardHeader}>
                <Text
                  style={[
                    styles.cardLabel,
                    !!presence.heure_sortie && styles.cardLabelActive,
                  ]}
                >
                  Départ
                </Text>
              </View>
              <Text
                style={[
                  styles.cardTime,
                  !!presence.heure_sortie && styles.cardTimeActive,
                ]}
              >
                {isLoading ? (
                  <ActivityIndicator size="small" />
                ) : (
                  presence.heure_sortie || "--:--"
                )}
              </Text>
            </View>
          </View>
        </Card>
      </View>
    );
  },
);

const styles = StyleSheet.create({
  presenceGrid: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 28,
  },
  cardContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 16,
  },
  cardIcon: {
    height: 50,
    width: 50,
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  cardLabel: {
    fontSize: 14,
    color: COLORS.gray[500],
  },
  cardLabelActive: {
    color: COLORS.gray[900],
    fontWeight: "500",
  },
  cardTime: {
    fontSize: 20,
    fontWeight: "500",
    color: COLORS.gray[400],
    fontFamily: Platform.select({
      ios: "Courier",
      android: "monospace",
      default: "monospace",
    }),
    minHeight: 30,
  },
  cardTimeActive: {
    color: COLORS.gray[900],
  },
});
