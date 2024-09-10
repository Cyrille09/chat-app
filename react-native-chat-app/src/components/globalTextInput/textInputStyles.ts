import { Colors } from "@/src/constants/Colors";
import { StyleSheet } from "react-native";

export default StyleSheet.create({
  container: {
    flexDirection: "column",
    alignSelf: "center",
    marginBottom: 20,
    width: "100%",
  },
  group: {},
  input: {
    paddingHorizontal: 10,
    paddingVertical: 15,
    // backgroundColor: Colors.greyMedium,
    backgroundColor: Colors.white,
    borderRadius: 4,
    borderColor: Colors.greyMedium,
    borderWidth: 1,
    fontSize: 15,
    minHeight: 52,
    width: "100%",
  },
  title: {
    marginTop: 20,
    marginBottom: 12,
    fontFamily: "ffMarkBold",
    color: Colors.white,
  },

  rounded: {
    borderRadius: 10,
    paddingHorizontal: 20,
    paddingVertical: 12,
  },

  errorMessage: {
    marginVertical: 0,
    color: Colors.error,
    fontSize: 15,
    marginBottom: 0,
    marginTop: 8,
  },
  invalid: {
    borderColor: Colors.error,
  },

  rightIcon: {
    paddingRight: 50,
  },
  iconLeft: {
    flex: 1,
    position: "absolute",
    top: 0,
    right: 0,
    paddingRight: 20,
    height: "100%",
    alignSelf: "center",
    justifyContent: "center",
  },
  icon: {
    color: Colors.greyLight,
  },
});
