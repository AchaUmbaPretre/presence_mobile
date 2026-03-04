// src/screens/DashboardScreen.tsx
import React, { useEffect, useState } from "react";
import {
    Alert,
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { postPresence } from "../api/presences";

const USER_ID = 1;

export default function DashboardScreen() {
  const [journal, setJournal] = useState({
    entre: null as string | null,
    sorti: null as string | null,
    ecart: 0,
    extra: 0,
  });

  const [temps, setTemps] = useState(new Date());

  useEffect(() => {
    const cadence = setInterval(() => setTemps(new Date()), 1000);
    return () => clearInterval(cadence);
  }, []);

  const heure = temps.getHours().toString().padStart(2, "0");
  const minute = temps.getMinutes().toString().padStart(2, "0");
  const seconde = temps.getSeconds().toString().padStart(2, "0");

  const mois = [
    "janv",
    "févr",
    "mars",
    "avr",
    "mai",
    "juin",
    "juil",
    "août",
    "sept",
    "oct",
    "nov",
    "déc",
  ];
  const jour = temps.getDate();
  const moisCourt = mois[temps.getMonth()];
  const annee = temps.getFullYear();

  const dateCourte = `${jour} ${moisCourt} ${annee}`;

  const handleEntree = async () => {
    try {
      await postPresence({
        id_utilisateur: USER_ID,
        date_presence: temps.toISOString().slice(0, 10),
        datetime: temps.toISOString(),
        source: "MANUEL",
        permissions: ["attendance.events.approve"],
      });
      setJournal((p) => ({ ...p, entre: `${heure}:${minute}` }));
    } catch {
      Alert.alert("", "échec connexion");
    }
  };

  const handleSortie = async () => {
    try {
      await postPresence({
        id_utilisateur: USER_ID,
        date_presence: temps.toISOString().slice(0, 10),
        datetime: temps.toISOString(),
        source: "MANUEL",
        permissions: ["attendance.events.approve"],
      });
      setJournal((p) => ({ ...p, sorti: `${heure}:${minute}` }));
    } catch {
      Alert.alert("", "échec connexion");
    }
  };

  return (
    <View style={styles.cadre}>
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />

      <ScrollView style={styles.contenu} showsVerticalScrollIndicator={false}>
        {/* ligne identité */}
        <View style={styles.rangee}>
          <View>
            <Text style={styles.nom}>jean dupont</Text>
            <Text style={styles.fonction}>lead dev</Text>
          </View>
          <View style={styles.initialesBloc}>
            <Text style={styles.initialesTexte}>jd</Text>
          </View>
        </View>

        {/* date et heure */}
        <View style={styles.blocTemporel}>
          <Text style={styles.dateAbregee}>{dateCourte}</Text>
          <View style={styles.traitFin} />
          <View style={styles.blocHeure}>
            <Text style={styles.heureChiffre}>
              {heure}:{minute}
            </Text>
            <Text style={styles.secondeChiffre}>{seconde}</Text>
          </View>
        </View>

        {/* registre */}
        <View style={styles.registre}>
          {/* arrivée */}
          <TouchableOpacity
            onPress={handleEntree}
            disabled={!!journal.entre}
            activeOpacity={0.8}
            style={[styles.folio, journal.entre && styles.folioActif]}
          >
            <View style={styles.ligneTitre}>
              <Text style={styles.indicatif}>←</Text>
              <Text style={styles.titreAction}>arrivée</Text>
            </View>
            <Text style={styles.valeurAction}>{journal.entre || "··:··"}</Text>
            {journal.entre && <View style={styles.marque} />}
          </TouchableOpacity>

          {/* départ */}
          <TouchableOpacity
            onPress={handleSortie}
            disabled={!journal.entre || !!journal.sorti}
            activeOpacity={0.8}
            style={[
              styles.folio,
              (!journal.entre || journal.sorti) && styles.folioInactif,
              journal.sorti && styles.folioActif,
            ]}
          >
            <View style={styles.ligneTitre}>
              <Text style={styles.indicatif}>→</Text>
              <Text style={styles.titreAction}>départ</Text>
            </View>
            <Text style={styles.valeurAction}>{journal.sorti || "··:··"}</Text>
            {journal.sorti && (
              <View style={[styles.marque, styles.marqueRouge]} />
            )}
          </TouchableOpacity>
        </View>

        {/* métriques */}
        <View style={styles.tableau}>
          <View style={styles.cellule}>
            <Text style={styles.chiffre}>{journal.ecart}</Text>
            <Text style={styles.unite}>min</Text>
            <Text style={styles.libelle}>retard</Text>
          </View>
          <View style={styles.separation} />
          <View style={styles.cellule}>
            <Text style={styles.chiffre}>{journal.extra}</Text>
            <Text style={styles.unite}>h</Text>
            <Text style={styles.libelle}>extra</Text>
          </View>
          <View style={styles.separation} />
          <View style={styles.cellule}>
            <Text style={styles.chiffre}>35</Text>
            <Text style={styles.unite}>h</Text>
            <Text style={styles.libelle}>base</Text>
          </View>
        </View>

        {/* raccourcis */}
        <View style={styles.section}>
          <Text style={styles.sectionTitre}>raccourcis</Text>
          <View style={styles.grilleRaccourcis}>
            <TouchableOpacity style={styles.touche}>
              <Text style={styles.symbole}>⌗</Text>
              <Text style={styles.legende}>qr</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.touche}>
              <Text style={styles.symbole}>⌖</Text>
              <Text style={styles.legende}>géo</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.touche}>
              <Text style={styles.symbole}>⌛</Text>
              <Text style={styles.legende}>hist</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.touche}>
              <Text style={styles.symbole}>⌘</Text>
              <Text style={styles.legende}>doc</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* flux */}
        <View style={styles.section}>
          <Text style={styles.sectionTitre}>flux</Text>
          <View style={styles.flux}>
            <View style={styles.entreeFlux}>
              <View style={styles.pointFlux} />
              <View style={styles.ligneFlux} />
            </View>
            <View style={styles.entreeFlux}>
              <View style={[styles.pointFlux, styles.pointOcre]} />
            </View>
          </View>
          <View style={styles.legendeFlux}>
            <Text style={styles.texteFlux}>arrivée 08:45</Text>
            <Text style={styles.texteFlux}>pause 12:30</Text>
          </View>
        </View>

        {/* hebdo */}
        <View style={styles.section}>
          <Text style={styles.sectionTitre}>hebdo</Text>
          <View style={styles.grilleJours}>
            {["l", "m", "m", "j", "v", "s"].map((j, i) => (
              <View key={i} style={styles.caseJour}>
                <Text style={styles.lettreJour}>{j}</Text>
                <View
                  style={[
                    styles.pointe,
                    i < 4 && styles.pointeVert,
                    i === 4 && styles.pointeOcre,
                  ]}
                />
              </View>
            ))}
          </View>
        </View>

        {/* bas de page */}
        <Text style={styles.pied}>v2.4.1 · session active</Text>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  cadre: {
    flex: 1,
    backgroundColor: "#ffffff",
  },
  contenu: {
    flex: 1,
    paddingHorizontal: 28,
    paddingTop: 60,
    paddingBottom: 40,
  },
  rangee: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 48,
  },
  nom: {
    fontSize: 18,
    color: "#1a1a1a",
    fontWeight: "400",
    letterSpacing: 0.3,
    marginBottom: 4,
  },
  fonction: {
    fontSize: 12,
    color: "#767676",
    fontWeight: "300",
    letterSpacing: 0.5,
  },
  initialesBloc: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#f2f2f2",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#e5e5e5",
  },
  initialesTexte: {
    fontSize: 14,
    color: "#4d4d4d",
    fontWeight: "400",
  },
  blocTemporel: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 52,
  },
  dateAbregee: {
    fontSize: 13,
    color: "#8f8f8f",
    fontWeight: "300",
    letterSpacing: 0.3,
  },
  traitFin: {
    width: 24,
    height: 1,
    backgroundColor: "#e5e5e5",
    marginHorizontal: 14,
  },
  blocHeure: {
    flexDirection: "row",
    alignItems: "baseline",
  },
  heureChiffre: {
    fontSize: 28,
    color: "#1a1a1a",
    fontWeight: "300",
    letterSpacing: 0.8,
    marginRight: 4,
  },
  secondeChiffre: {
    fontSize: 15,
    color: "#b3b3b3",
    fontWeight: "300",
  },
  registre: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 36,
  },
  folio: {
    flex: 1,
    backgroundColor: "#fafafa",
    padding: 20,
    minHeight: 110,
    position: "relative",
    borderWidth: 1,
    borderColor: "#f0f0f0",
  },
  folioActif: {
    backgroundColor: "#ffffff",
    borderColor: "#e0e0e0",
  },
  folioInactif: {
    opacity: 0.45,
  },
  ligneTitre: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 18,
  },
  indicatif: {
    fontSize: 15,
    color: "#a6a6a6",
    marginRight: 8,
  },
  titreAction: {
    fontSize: 11,
    color: "#8f8f8f",
    fontWeight: "300",
    letterSpacing: 0.8,
    textTransform: "uppercase",
  },
  valeurAction: {
    fontSize: 24,
    color: "#1a1a1a",
    fontWeight: "300",
    letterSpacing: 0.8,
  },
  marque: {
    position: "absolute",
    top: 14,
    right: 14,
    width: 6,
    height: 6,
    backgroundColor: "#9bb88b",
  },
  marqueRouge: {
    backgroundColor: "#d4a5a5",
  },
  tableau: {
    flexDirection: "row",
    backgroundColor: "#fafafa",
    padding: 22,
    marginBottom: 44,
    borderWidth: 1,
    borderColor: "#f0f0f0",
  },
  cellule: {
    flex: 1,
    alignItems: "center",
  },
  chiffre: {
    fontSize: 24,
    color: "#1a1a1a",
    fontWeight: "300",
    marginBottom: 4,
  },
  unite: {
    fontSize: 10,
    color: "#b3b3b3",
    marginBottom: 6,
  },
  libelle: {
    fontSize: 10,
    color: "#8f8f8f",
    textTransform: "uppercase",
    letterSpacing: 0.8,
  },
  separation: {
    width: 1,
    backgroundColor: "#e5e5e5",
  },
  section: {
    marginBottom: 44,
  },
  sectionTitre: {
    fontSize: 11,
    color: "#b3b3b3",
    textTransform: "uppercase",
    letterSpacing: 1.5,
    marginBottom: 22,
  },
  grilleRaccourcis: {
    flexDirection: "row",
    gap: 10,
  },
  touche: {
    flex: 1,
    alignItems: "center",
    backgroundColor: "#fafafa",
    paddingVertical: 18,
    borderWidth: 1,
    borderColor: "#f0f0f0",
  },
  symbole: {
    fontSize: 24,
    color: "#a6a6a6",
    marginBottom: 6,
  },
  legende: {
    fontSize: 9,
    color: "#8f8f8f",
    textTransform: "uppercase",
    letterSpacing: 0.8,
  },
  flux: {
    flexDirection: "row",
    marginBottom: 8,
  },
  entreeFlux: {
    width: 32,
    alignItems: "center",
  },
  pointFlux: {
    width: 6,
    height: 6,
    backgroundColor: "#9bb88b",
    marginBottom: 4,
  },
  pointOcre: {
    backgroundColor: "#d4a5a5",
  },
  ligneFlux: {
    width: 1,
    flex: 1,
    backgroundColor: "#e5e5e5",
  },
  legendeFlux: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingLeft: 8,
  },
  texteFlux: {
    fontSize: 12,
    color: "#5c5c5c",
    fontWeight: "300",
    width: 85,
  },
  grilleJours: {
    flexDirection: "row",
    justifyContent: "space-around",
    backgroundColor: "#fafafa",
    padding: 22,
    borderWidth: 1,
    borderColor: "#f0f0f0",
  },
  caseJour: {
    alignItems: "center",
  },
  lettreJour: {
    fontSize: 11,
    color: "#8f8f8f",
    textTransform: "uppercase",
    marginBottom: 8,
  },
  pointe: {
    width: 4,
    height: 4,
    backgroundColor: "#e0e0e0",
  },
  pointeVert: {
    backgroundColor: "#9bb88b",
  },
  pointeOcre: {
    backgroundColor: "#d4a5a5",
  },
  pied: {
    fontSize: 9,
    color: "#cccccc",
    textAlign: "center",
    marginTop: 24,
    letterSpacing: 1,
  },
});
