import {
  View,
  Text,
  KeyboardAvoidingView,
  Keyboard,
  TouchableWithoutFeedback,
  TouchableOpacity,
} from "react-native";

// style components
import authStyles from "./authStyles";
import { Formik } from "formik";
import { GlobalTextInput } from "@/src/components/globalTextInput/GlobalTextInput";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Alert } from "@/src/components/alert/Alert";
import { Spinner } from "@/src/components/spinner/Spinner";
import { GlobalButton } from "@/src/components/globalButton/GlobalButton";
import { useRouter } from "expo-router";
import { signupForm } from "@/src/components/formValidation/formValidation";
import {
  errorPopupActions,
  isLoadingActions,
} from "@/src/redux-toolkit/reducers/actionsSlice";
import { addUser, updateUserProfile } from "@/src/services/usersServices";
import { RootState } from "@/src/redux-toolkit/store";
import { storeTokenInLocalStorage } from "@/src/lib/asyncStorage";
import { loginSuccess } from "@/src/redux-toolkit/reducers/authSlice";
import { socket } from "@/src/components/websocket/websocket";
import { ACTIONS_ERROR_MESSAGE } from "@/src/constants/globalText";

const RegisterScreen = ({}) => {
  const actionsSlice = useSelector((state: RootState) => state.actionsSlice);

  const [verifyText, setVerifyText] = useState<boolean>(false);
  const [secureTextEntry, setSecureTextEntry] = useState<boolean>(true);
  const [iconName, setIconName] = useState<string>("icon-eye");
  const dispatch = useDispatch();
  const router = useRouter();

  const onIconPress = () => {
    let iconName = secureTextEntry ? "icon-eye-off" : "icon-eye";
    setSecureTextEntry(!secureTextEntry);
    setIconName(iconName);
  };
  const initialValues = { name: "", email: "", password: "" };

  const signUpData = async (values: {
    name: string;
    email: string;
    password: string;
  }) => {
    dispatch(isLoadingActions(true));

    addUser(values.name.trim(), values.email.trim(), values.password)
      .then((response) => {
        const user = response.data;
        setVerifyText(true);
        storeTokenInLocalStorage(user.token);
        dispatch(loginSuccess({ token: user.token }));
        dispatch(isLoadingActions(false));
        updateUserProfileData();
        router.navigate("/(tabs)");
      })
      .catch((error) => {
        dispatch(isLoadingActions(false));
        dispatch(
          errorPopupActions({
            status: true,
            message: ACTIONS_ERROR_MESSAGE,
            display: "",
          })
        );
      });
  };

  const updateUserProfileData = () => {
    const lastSeen = {
      status: true,
      date: new Date(),
    };
    updateUserProfile({ lastSeen })
      .then((response) => {
        socket.emit("userStatus", response.data);
      })
      .catch((error) => {});
  };

  const closeErrorPopupActionsData = () => {
    dispatch(
      errorPopupActions({
        status: false,
        message: "",
        display: "",
      })
    );
  };

  return (
    <KeyboardAvoidingView style={authStyles.wrapper} behavior="padding">
      <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
        <View style={authStyles.container}>
          {actionsSlice.isLoading && (
            <Spinner
              visible={actionsSlice.isLoading}
              textContent={"Logging you in..."}
            />
          )}
          <View style={authStyles.header}>
            <View style={authStyles.member}>
              <View>
                <Text>Already a Member?</Text>
              </View>
              <View>
                <TouchableOpacity
                  activeOpacity={0.8}
                  onPress={() => {
                    closeErrorPopupActionsData();
                    router.navigate("/(auth)/sign-in");
                  }}
                  testID="forgotPasswordButton"
                >
                  <Text style={authStyles.memberSignInUp}>Sign in</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
          <Formik
            form
            initialValues={initialValues}
            validationSchema={signupForm}
            onSubmit={signUpData}
          >
            {({
              handleChange,
              handleBlur,
              handleSubmit,
              values,
              errors,
              touched,
            }) => (
              <View style={(authStyles.form, { flex: 2 })}>
                {actionsSlice.errorPopup.status && (
                  <Alert
                    type="error"
                    message={actionsSlice.errorPopup.message}
                  />
                )}

                <GlobalTextInput
                  name="name"
                  id="name"
                  placeholder="Name"
                  onBlur={handleBlur("name")}
                  textContentType={"name"}
                  autoCapitalize="none"
                  value={!verifyText ? values.name : ""}
                  onChangeText={handleChange("name")}
                  autoCorrect={false}
                  touched={touched.name}
                  errorContent={errors.name}
                  testID="name"
                  rounded={true}
                />

                <GlobalTextInput
                  name="email"
                  id="email"
                  placeholder="Email"
                  onBlur={handleBlur("email")}
                  textContentType={"emailAddress"}
                  autoCapitalize="none"
                  value={!verifyText ? values.email : ""}
                  onChangeText={handleChange("email")}
                  autoCorrect={false}
                  touched={touched.email}
                  errorContent={errors.email}
                  testID="email"
                  rounded={true}
                  onChange={() => closeErrorPopupActionsData()}
                />
                <GlobalTextInput
                  name="password"
                  autoCapitalize="none"
                  secureTextEntry={secureTextEntry}
                  textContentType={"password"}
                  placeholder="Password"
                  onBlur={handleBlur("password")}
                  value={!verifyText ? values.password : ""}
                  onChangeText={handleChange("password")}
                  rightIcon={iconName}
                  onIconPress={onIconPress}
                  autoCorrect={false}
                  touched={touched.password}
                  errorContent={errors.password}
                  testID="password"
                  rounded={true}
                  onChange={() => closeErrorPopupActionsData()}
                />

                <View style={authStyles.button}>
                  <GlobalButton
                    name="Sign in"
                    type="success"
                    size="large"
                    onPress={handleSubmit}
                    testID="loginButton"
                  />
                </View>

                {/* <View style={authStyles.forgotPasswordContent}>
                  <TouchableOpacity
                    activeOpacity={0.8}
                    onPress={() => {
                      navigation.navigate(FORGOT_PASSWORD_SCREEN);
                    }}
                    testID="forgotPasswordButton"
                  >
                    <Text style={authStyles.forgotPassword}>
                      Forgotten password?
                    </Text>
                  </TouchableOpacity>
                </View> */}
              </View>
            )}
          </Formik>
        </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
};

export default RegisterScreen;
