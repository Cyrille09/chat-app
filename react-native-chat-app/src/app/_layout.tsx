import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { useFonts } from "expo-font";
import { Slot } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
import "react-native-reanimated";

import { useColorScheme } from "@/src/hooks/useColorScheme";
import { AuthReduxProvider } from "../context/authReduxProvider";
import { store } from "../redux-toolkit/store";
import { Provider } from "react-redux";

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    SpaceMono: require("../../assets/fonts/SpaceMono-Regular.ttf"),
    ffMarkLight: require("../../assets/fonts/ff-mark/light.ttf"),
    ffMarkRegular: require("../../assets/fonts/ff-mark/regular.ttf"),
    ffMarkBold: require("../../assets/fonts/ff-mark/bold.ttf"),
    AppIcons: require("../../assets/fonts/icons/fonts/app-icons.ttf"),
  });

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <Provider store={store}>
      <AuthReduxProvider>
        <ThemeProvider
          value={colorScheme === "dark" ? DarkTheme : DefaultTheme}
        >
          <Slot />
        </ThemeProvider>
      </AuthReduxProvider>
    </Provider>
  );
}
