import React, { memo } from "react";
import { StyleSheet, View } from "react-native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";

interface IconWithBackgroundProps {
  name: string;
  color: string;
  backgroundColor: string;
  size?: number;
}

export const IconWithBackground = memo(
  ({ name, color, backgroundColor, size = 20 }: IconWithBackgroundProps) => (
    <View style={[styles.iconBackground, { backgroundColor }]}>
      <Icon name={name} size={size} color={color} />
    </View>
  ),
);

const styles = StyleSheet.create({
  iconBackground: {
    width: 36,
    height: 36,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
  },
});
