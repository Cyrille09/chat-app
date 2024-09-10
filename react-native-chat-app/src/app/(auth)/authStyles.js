import { StyleSheet } from "react-native";
import { Colors } from "react-native-ui-lib";

export default StyleSheet.create({
  container: {
    flex: 1,
    alignContent: "flex-start",
    justifyContent: "center",
    paddingHorizontal: 20,
    backgroundColor: "#e5ddd5",
  },
  member: {
    display: "flex",
    flexDirection: "row",
    marginBottom: 30,
  },
  memberSignInUp: {
    marginLeft: 20,
    textDecorationLine: "underline",
  },

  wrapper: {
    flex: 1,
  },
  spinnerTextStyle: {
    color: Colors.white,
    fontSize: 18,
  },
  header: {
    flex: 1,
    justifyContent: "flex-end",
    paddingHorizontal: 20,
    alignItems: "center",
  },
  contentHeader: {
    flex: 0.6,
    justifyContent: "flex-end",
    alignItems: "center",
  },
  logo: {
    height: "100%",
    width: "100%",
    maxWidth: 140,
    resizeMode: "contain",
    marginBottom: 25,
  },

  // form
  form: {
    flex: 4,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    alignItems: "center",
  },
  button: {
    marginTop: 10,
    width: "100%",
  },

  // forgot password link
  forgotPasswordContent: {
    marginTop: 25,
    width: "100%",
  },
  forgotPassword: {
    textTransform: "none",
    textAlign: "center",
    fontSize: 15,
  },

  // password reset
  passwordReset: {},
  passwordResetMessage: {
    textAlign: "center",
    marginTop: 5,
    marginBottom: 30,
  },
});
