import Constants from "expo-constants";
import { PlatformColor } from "react-native";

const { platformColors } = Constants.expoConfig;

const colorTokens = Object.keys(platformColors);

export const colors = {};
colorTokens.forEach((token) => {
  const iosToken = token[0].toUpperCase() + token.slice(1);
  const androidToken = `@color/${token}`;
  colors[token] = PlatformColor(
    Platform.select({ ios: iosToken, android: androidToken })
  );
});
