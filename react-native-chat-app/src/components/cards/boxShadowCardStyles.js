import { StyleSheet } from "react-native";

const white = "#FFFFFF";

const styles = StyleSheet.create({
  boxShadowMain: {
    marginBottom: 10,
    backgroundColor: white,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 8,
  },
});

export default styles;
