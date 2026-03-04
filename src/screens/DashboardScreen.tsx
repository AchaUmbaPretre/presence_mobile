import { Images } from "@/assets";
import React, {
    useCallback,
    useEffect,
    useMemo,
    useRef,
    useState,
} from "react";
import {
    Alert,
    Animated,
    Dimensions,
    Image,
    Platform,
    RefreshControl,
    SafeAreaView,
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { postPresence } from "../api/presences";

const { width } = Dimensions.get("window");

// Types
type PresenceState = {
  heure_entree: string | null;
  heure_sortie: string | null;
  retard_minutes: number;
  heures_supplementaires: number;
};

type ActionType = "ENTREE" | "SORTIE";

// Constantes
const ID_UTILISATEUR = 1;
const HORAIRES_TYPE = {
  ENTREE: "ENTREE",
  SORTIE: "SORTIE",
} as const;

// Mapping de couleurs
const COLORS = {
  primary: {
    main: "#3B82F6",
    light: "#EFF6FF",
    dark: "#2563EB",
  },
  success: {
    main: "#10B981",
    light: "#D1FAE5",
    dark: "#059669",
  },
  error: {
    main: "#EF4444",
    light: "#FEE2E2",
    dark: "#DC2626",
  },
  warning: {
    main: "#F59E0B",
    light: "#FEF3C7",
    dark: "#D97706",
  },
  gray: {
    50: "#F9FAFB",
    100: "#F3F4F6",
    200: "#E5E7EB",
    300: "#D1D5DB",
    400: "#9CA3AF",
    500: "#6B7280",
    600: "#4B5563",
    700: "#374151",
    800: "#1F2937",
    900: "#111827",
  },
  white: "#FFFFFF",
  black: "#000000",
} as const;

// Composant réutilisable pour les cartes
const Card = React.memo(
  ({ children, style, onPress, disabled, active }: any) => (
    <TouchableOpacity
      style={[
        styles.card,
        active && styles.cardActive,
        disabled && styles.cardDisabled,
        style,
      ]}
      onPress={onPress}
      disabled={disabled}
      activeOpacity={0.7}
    >
      {children}
    </TouchableOpacity>
  ),
);

// Composant pour les icônes avec fond
const IconWithBackground = React.memo(
  ({ name, color, backgroundColor, size = 20 }: any) => (
    <View style={[styles.iconBackground, { backgroundColor }]}>
      <Icon name={name} size={size} color={color} />
    </View>
  ),
);

// Composant pour les séparateurs
const Divider = React.memo(() => <View style={styles.divider} />);

export default function DashboardScreen() {
  const [presence, setPresence] = useState<PresenceState>({
    heure_entree: null,
    heure_sortie: null,
    retard_minutes: 0,
    heures_supplementaires: 0,
  });

  const [refreshing, setRefreshing] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());

  // Animations
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(20)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 400,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 400,
        useNativeDriver: true,
      }),
    ]).start();

    // Mise à jour de l'heure
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 1000);
  }, []);

  const handlePointage = useCallback(async (type: ActionType) => {
    try {
      const res = await postPresence({
        id_utilisateur: ID_UTILISATEUR,
        date_presence: new Date().toISOString().slice(0, 10),
        datetime: new Date().toISOString(),
        source: "MANUEL",
        permissions: ["attendance.events.approve"],
      });

      setPresence((prev) => ({
        ...prev,
        [type === "ENTREE" ? "heure_entree" : "heure_sortie"]:
          new Date().toLocaleTimeString("fr-FR", {
            hour: "2-digit",
            minute: "2-digit",
          }),
      }));

      Alert.alert(
        "Pointage enregistré",
        res.data?.message || "Votre pointage a été validé",
        [{ text: "Fermer", style: "default" }],
      );
    } catch (err: any) {
      Alert.alert(
        "Erreur",
        err.response?.data?.message || "Impossible de contacter le serveur",
        [{ text: "Réessayer", style: "cancel" }],
      );
    }
  }, []);

  // Formatage de la date
  const formattedDate = useMemo(
    () =>
      currentTime.toLocaleDateString("fr-FR", {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric",
      }),
    [currentTime],
  );

  const formattedTime = useMemo(
    () =>
      currentTime.toLocaleTimeString("fr-FR", {
        hour: "2-digit",
        minute: "2-digit",
      }),
    [currentTime],
  );

  const formattedSeconds = useMemo(
    () => currentTime.toLocaleTimeString("fr-FR", { second: "2-digit" }),
    [currentTime],
  );

  const isEntryDisabled = !!presence.heure_entree;
  const isExitDisabled = !presence.heure_entree || !!presence.heure_sortie;

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.white} />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {/* Header */}
        <Animated.View
          style={[
            styles.header,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            },
          ]}
        >
          <View>
            <Text style={styles.headerTitle}>Dashboard</Text>
            <Text style={styles.headerSubtitle}>Gestion des présences</Text>
          </View>
          <View style={styles.profileContainer}>
            <View style={styles.profileBadge}>
              <Text style={styles.profileInitials}>AC</Text>
            </View>
          </View>
        </Animated.View>

        {/* Date */}
        <Animated.View
          style={[
            styles.dateChip,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            },
          ]}
        >
          <Icon
            name="calendar-blank-outline"
            size={14}
            color={COLORS.gray[500]}
          />
          <Text style={styles.dateText}>{formattedDate}</Text>
        </Animated.View>

        {/* Horloge */}
        <Animated.View
          style={[
            styles.clockContainer,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            },
          ]}
        >
          <Text style={styles.clockTime}>{formattedTime}</Text>
          <Text style={styles.clockSeconds}>{formattedSeconds}</Text>
        </Animated.View>

        {/* Cartes de présence */}
        <View style={styles.presenceGrid}>
          <Card
            onPress={() => handlePointage(HORAIRES_TYPE.ENTREE)}
            disabled={isEntryDisabled}
            active={!!presence.heure_entree}
          >
            <View style={styles.cardContent}>
              <Image
                source={Images.arriveeIcon}
                alt=""
                style={{ height: 50, width: 50 }}
              />
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
                    {presence.heure_entree || "--:--"}
                </Text>
              </View>
            </View>
          </Card>

          <Card
            onPress={() => handlePointage(HORAIRES_TYPE.SORTIE)}
            disabled={isExitDisabled}
            active={!!presence.heure_sortie}
          >
            <View style={styles.cardContent}>
                <Image
                  source={Images.departIcon}
                  alt=""
                  style={{ height: 50, width: 50 }}
                />
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
                        {presence.heure_sortie || "--:--"}
                    </Text>
                </View>
            </View>
          </Card>
        </View>

        {/* Métriques */}
        <View style={styles.metricsContainer}>
          <View style={styles.metricItem}>
            <Text style={styles.metricValue}>{presence.retard_minutes}</Text>
            <Text style={styles.metricUnit}>min</Text>
            <Text style={styles.metricLabel}>Retard</Text>
          </View>
          <Divider />
          <View style={styles.metricItem}>
            <Text style={styles.metricValue}>
              {presence.heures_supplementaires}
            </Text>
            <Text style={styles.metricUnit}>h</Text>
            <Text style={styles.metricLabel}>Suppl.</Text>
          </View>
          <Divider />
          <View style={styles.metricItem}>
            <Text style={styles.metricValue}>35</Text>
            <Text style={styles.metricUnit}>h</Text>
            <Text style={styles.metricLabel}>Objectif</Text>
          </View>
        </View>

        {/* Actions rapides */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Actions rapides</Text>
          <View style={styles.actionsGrid}>
            {[
              {
                icon: "qrcode-scan",
                label: "QR Code",
                color: COLORS.primary.main,
              },
              {
                icon: "map-marker-outline",
                label: "Géoloc",
                color: COLORS.primary.main,
              },
              {
                icon: "history",
                label: "Historique",
                color: COLORS.primary.main,
              },
              {
                icon: "file-document-outline",
                label: "Rapports",
                color: COLORS.primary.main,
              },
            ].map((action, index) => (
              <TouchableOpacity key={index} style={styles.actionItem}>
                <IconWithBackground
                  name={action.icon}
                  color={action.color}
                  backgroundColor={`${action.color}20`}
                  size={18}
                />
                <Text style={styles.actionLabel}>{action.label}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Activité récente */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Activité récente</Text>
            <TouchableOpacity>
              <Text style={styles.sectionLink}>Voir tout</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.activityContainer}>
            {[
              { type: "arrival", time: "08:45", status: "À l'heure" },
              { type: "break", time: "12:30 - 13:30", status: "1h" },
            ].map((activity, index, array) => (
              <React.Fragment key={index}>
                <View style={styles.activityItem}>
                  <View
                    style={[
                      styles.activityDot,
                      activity.type === "arrival" && styles.activityDotSuccess,
                      activity.type === "break" && styles.activityDotWarning,
                    ]}
                  />
                  <View style={styles.activityContent}>
                    <Text style={styles.activityTitle}>
                      {activity.type === "arrival"
                        ? "Arrivée"
                        : "Pause déjeuner"}
                    </Text>
                    <Text style={styles.activityTime}>{activity.time}</Text>
                  </View>
                  <Text style={styles.activityStatus}>{activity.status}</Text>
                </View>
                {index < array.length - 1 && <Divider />}
              </React.Fragment>
            ))}
          </View>
        </View>

        {/* Semaine */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Cette semaine</Text>
          <View style={styles.weekContainer}>
            {["L", "M", "M", "J", "V", "S"].map((day, index) => (
              <View key={index} style={styles.weekDay}>
                <Text style={styles.weekDayLetter}>{day}</Text>
                <View
                  style={[
                    styles.weekDayIndicator,
                    index < 4 && styles.weekDayPresent,
                    index === 4 && styles.weekDayPartial,
                  ]}
                />
              </View>
            ))}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 40,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  headerTitle: {
    fontSize: 26,
    fontWeight: "600",
    color: COLORS.gray[900],
    letterSpacing: -0.5,
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 14,
    color: COLORS.gray[500],
  },
  profileContainer: {
    position: "relative",
  },
  profileBadge: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: COLORS.gray[100],
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: COLORS.gray[200],
  },
  profileInitials: {
    fontSize: 16,
    fontWeight: "500",
    color: COLORS.primary.main,
  },
  dateChip: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.gray[50],
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    alignSelf: "flex-start",
    marginBottom: 24,
    borderWidth: 1,
    borderColor: COLORS.gray[100],
  },
  dateText: {
    fontSize: 13,
    color: COLORS.gray[600],
    marginLeft: 6,
    textTransform: "capitalize",
  },
  clockContainer: {
    flexDirection: "row",
    alignItems: "baseline",
    justifyContent: "center",
    marginBottom: 28,
  },
  clockTime: {
    fontSize: 48,
    fontWeight: "300",
    color: COLORS.gray[900],
    letterSpacing: -1,
  },
  clockSeconds: {
    fontSize: 20,
    color: COLORS.gray[400],
    marginLeft: 8,
    fontWeight: "300",
  },
  presenceGrid: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 28,
  },
  card: {
    flex: 1,
    backgroundColor: COLORS.gray[50],
    borderRadius: 16,
    borderWidth: 1,
    borderColor: COLORS.gray[100],
  },
  cardActive: {
    backgroundColor: COLORS.white,
    borderColor: COLORS.gray[200],
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.02,
    shadowRadius: 4,
    elevation: 1,
  },
  cardDisabled: {
    opacity: 0.5,
  },
  cardContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 16,
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  iconBackground: {
    width: 36,
    height: 36,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10,
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
    fontFamily: Platform.OS === "ios" ? "Courier" : "monospace",
  },
  cardTimeActive: {
    color: COLORS.gray[900],
  },
  metricsContainer: {
    flexDirection: "row",
    backgroundColor: COLORS.gray[50],
    borderRadius: 16,
    padding: 20,
    marginBottom: 28,
    borderWidth: 1,
    borderColor: COLORS.gray[100],
  },
  metricItem: {
    flex: 1,
    alignItems: "center",
  },
  metricValue: {
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    fontSize: 24,
    fontWeight: "500",
    color: COLORS.primary.main,
    marginBottom: 2,
    backgroundColor: `${COLORS.primary.light}`,
    padding: 10,
    borderRadius: 16,
    height: 50,
    width: 50,
  },
  metricUnit: {
    fontSize: 12,
    color: COLORS.gray[400],
    marginBottom: 4,
  },
  metricLabel: {
    fontSize: 12,
    color: COLORS.gray[500],
  },
  divider: {
    width: 1,
    backgroundColor: COLORS.gray[200],
    marginHorizontal: 12,
  },
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
    marginBottom: 10,
  },
  sectionLink: {
    fontSize: 13,
    color: COLORS.primary.main,
    fontWeight: "500",
  },
  actionsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
  actionItem: {
    width: (width - 50) / 2,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.gray[50],
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: COLORS.gray[100],
  },
  actionLabel: {
    fontSize: 13,
    color: COLORS.gray[700],
    marginLeft: 10,
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
  weekContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    backgroundColor: COLORS.gray[50],
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: COLORS.gray[100],
  },
  weekDay: {
    alignItems: "center",
  },
  weekDayLetter: {
    fontSize: 13,
    color: COLORS.gray[500],
    marginBottom: 8,
    fontWeight: "500",
  },
  weekDayIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: COLORS.gray[200],
  },
  weekDayPresent: {
    backgroundColor: COLORS.success.main,
  },
  weekDayPartial: {
    backgroundColor: COLORS.warning.main,
  },
});
