import React from "react";
import { StyleSheet, Text } from "react-native";
import { getFontFamily } from "../../../constants/typography";
import { COLORS } from "../../dashboard/constants/color";
import { COMPANY } from "../constants/settings.constants";

export const SettingsFooter: React.FC = () => {
  return (
    <Text style={styles.footerText}>
      © {COMPANY.year} {COMPANY.name}. Tous droits réservés.
    </Text>
  );
};

const styles = StyleSheet.create({
  footerText: {
    textAlign: "center",
    fontSize: 12,
    fontFamily: getFontFamily("regular"),
    color: COLORS.gray[400],
    marginTop: 24,
  },
});
