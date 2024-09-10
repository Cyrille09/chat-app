/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

const tintColorLight = "#0a7ea4";
const tintColorDark = "#fff";

export const Colors = {
  light: {
    text: "#11181C",
    background: "#fff",
    tint: tintColorLight,
    icon: "#687076",
    tabIconDefault: "#687076",
    tabIconSelected: tintColorLight,
  },
  dark: {
    text: "#ECEDEE",
    background: "#151718",
    tint: tintColorDark,
    icon: "#9BA1A6",
    tabIconDefault: "#9BA1A6",
    tabIconSelected: tintColorDark,
  },

  // gradients
  cyanGradientSoft: ["#E933B2", "#DA4FC4"],
  cyanGradient: ["#F223A8", "#C86DD7"],
  blackGradient: ["##1B1A1A", "#000"],

  // primary accent brand colour
  cyan: "#F340B2",
  turquoise: "#50D9D3",
  orange: "#FDAD71",
  blue: "#3D8CD1",

  // moods
  moodRelaxed: "#34CFCD",
  moodHappy: "#FFDB61",
  moodLively: "#C160FF",
  moodParty: "#A841D6",
  moodSpecial: "#F5663C",
  moodAmbient: "#65E2E2",

  // spa & wellness moods
  moodMildRelaxation: "#EEABFA",
  moodDeepRelaxation: "#65E2E2",
  moodEnergyActivation: "#F5663C",
  moodSpaWellness: "#65E2E2",

  // player states
  online: "#7FCF34",
  offline: "#DA3E3E",

  // used for
  greyDark: "#191C29",

  // used for inputs, cards
  greyMedium: "#2F3140",

  // used for text
  greyLight: "#7E818C",

  // form validation
  error: "#ca2626",
  danger: "#ed4c78",
  warning: "#ffcc59",
  success: "#00c9a7",

  // basic
  white: "#fff",
  black: "#000",

  // Grays
  gray50: "#f0f2f6",
  gray100: "#f9fafc",
  gray200: "#f8fafd",
  gray300: "#e7eaf3",
  gray400: "#bdc5d1",
  gray500: "#97a4af",
  gray600: "#8c98a4",
  gray700: "#677788",
  gray800: "#71869d",
  gray900: "#1e2022",

  // Colors
  darkOrBlack: "#132144",
  blueChat: "#377dff",
  teal: "#00c9a7",
  cyanChat: "#09a5be",
  yellow: "#f5ca99",
  red: "#ed4c78",
  lightBlue: "#4991c7",
  messageOwner: "#e1ffc7",
};
