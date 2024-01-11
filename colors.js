import Constants from "expo-constants";
import { PlatformColor } from "react-native";

const { platformColors } = Constants.expoConfig;

const colorTokens = Object.keys(platformColors);

export const colors = {};

const platformColorWeb = (token) => {
  const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
  const getScheme = (mediaQuery) => (mediaQuery.matches ? "dark" : "light");
  mediaQuery.addEventListener("change", (event) => {
    const colorScheme = getScheme(event);
    colors[token] = platformColors[token][colorScheme];
    // as react won't trigger rerender, we will realod the page once the colorscheme changes
    window.location.reload();
  });
  colors[token] = platformColors[token][getScheme(mediaQuery)];
};

colorTokens.forEach((token) => {
  const iosToken = token[0].toUpperCase() + token.slice(1);
  const androidToken = `@color/${token}`;
  colors[token] = PlatformColor(
    Platform.select({ ios: iosToken, android: androidToken })
  );
  Platform.select({
    ios: () => {
      colors[token] = PlatformColor(iosToken);
    },
    android: () => {
      colors[token] = PlatformColor(androidToken);
    },
    web: () => platformColorWeb(token),
  })?.();
});
