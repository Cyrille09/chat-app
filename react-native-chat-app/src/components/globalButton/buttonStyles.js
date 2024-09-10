import { StyleSheet } from "react-native";
import { Colors } from "@/src/constants/Colors";
export default StyleSheet.create({
  container: {},
  button: {
    flexDirection: "row",
    alignSelf: "stretch",
    padding: 8,
    alignContent: "center",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: Colors.greyMedium,
    height: 52,
    borderRadius: 52,
    borderColor: "transparent",
    borderWidth: 1,
  },
  text: {
    color: Colors.white,
    fontFamily: "ffMarkBold",
    fontSize: 17,
    letterSpacing: -0.4,
  },
  leftIcon: {
    color: Colors.white,
    marginRight: 7,
  },
  rightIcon: {
    color: Colors.white,
    marginLeft: 7,
  },

  xsmall: {
    paddingVertical: 10,
    paddingHorizontal: 14,
    height: "auto",
  },
  xsmallText: {
    fontFamily: "ffMarkRegular",
    fontSize: 14,
    letterSpacing: -0.6,
    lineHeight: 14,
    position: "relative",
    top: 1,
  },

  small: {
    paddingVertical: 13,
    paddingHorizontal: 19,
    height: "auto",
  },
  smallText: {
    fontFamily: "ffMarkRegular",
    fontSize: 14,
    letterSpacing: -0.6,
    lineHeight: 14,
  },

  grey: {
    backgroundColor: Colors.greyLight,
    color: Colors.white,
  },

  greyOutline: {
    backgroundColor: "transparent",
    borderWidth: 1,
    borderColor: Colors.greyLight,
    color: "#7E818C",
  },

  success: {
    backgroundColor: Colors.success,
    color: Colors.white,
  },
});
