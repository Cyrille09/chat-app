import { StyleSheet } from "react-native";
import { Colors } from "@/src/constants/Colors";

export default StyleSheet.create({
  container: {
    borderRadius: 5,
    padding: 10,
    textAlign: "center",
    alignItems: "center",
    marginBottom: 20,
    width: "100%",
  },
  error: {
    backgroundColor: Colors.danger,
  },
  warning: {
    backgroundColor: Colors.warning,
    color: Colors.black,
  },
  success: {
    backgroundColor: Colors.success,
  },
  message: {
    color: Colors.white,
    fontSize: 14,
    lineHeight: 16,
    letterSpacing: -0.4,
  },
  dark: {
    color: Colors.black,
  },
});
