import { Alert } from "@/src/components/alert/Alert";
import { changeUserProfilePasswordForm } from "@/src/components/formValidation/formValidation";
import { ACTIONS_ERROR_MESSAGE } from "@/src/constants/globalText";
import {
  errorPopupActions,
  isLoadingActions,
  successPopupActions,
} from "@/src/redux-toolkit/reducers/actionsSlice";
import { RootState } from "@/src/redux-toolkit/store";
import { Formik } from "formik";
import { useState } from "react";
import { View } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import styles from "./chatListStyles";
import { changeUserProfilePassword } from "@/src/services/usersServices";
import { GlobalTextInput } from "@/src/components/globalTextInput/GlobalTextInput";
import { GlobalButton } from "@/src/components/globalButton/GlobalButton";

const ChangePassword = () => {
  const actionsSlice = useSelector((state: RootState) => state.actionsSlice);
  const dispatch = useDispatch();

  const [secureTextEntry, setSecureTextEntry] = useState<boolean>(true);
  const [iconName, setIconName] = useState<string>("icon-eye");

  const onIconPress = () => {
    let iconName = secureTextEntry ? "icon-eye-off" : "icon-eye";
    setSecureTextEntry(!secureTextEntry);
    setIconName(iconName);
  };

  const ChangePasswordData = (
    values: {
      oldPassword: string;
      password: string;
    },
    { resetForm }: any
  ) => {
    dispatch(isLoadingActions(true));
    changeUserProfilePassword(values.oldPassword, values.password)
      .then((response) => {
        dispatch(
          successPopupActions({
            status: true,
            message: ` Your password was changed successfully`,
            display: "",
          })
        );
        resetForm();
      })
      .catch((error) => {
        dispatch(isLoadingActions(false));
        dispatch(
          errorPopupActions({
            status: true,
            message: ` Your current password is incorrect, or ${ACTIONS_ERROR_MESSAGE.toLowerCase()}`,
            display: "",
          })
        );
      });
  };

  return (
    <View style={styles.container}>
      <Formik
        form
        initialValues={{
          password: "",
          oldPassword: "",
        }}
        validationSchema={changeUserProfilePasswordForm}
        onSubmit={ChangePasswordData}
        enableReinitialize
      >
        {({
          handleChange,
          handleBlur,
          handleSubmit,
          setFieldValue,
          touched,
          values,
          errors,
        }) => (
          <View style={styles.changePassword}>
            {actionsSlice.errorPopup.status && (
              <Alert type="error" message={actionsSlice.errorPopup.message} />
            )}

            {actionsSlice.successPopup.status && (
              <Alert
                type="success"
                message={actionsSlice.successPopup.message}
              />
            )}

            <GlobalTextInput
              name="oldPassword"
              autoCapitalize="none"
              secureTextEntry={secureTextEntry}
              textContentType={"password"}
              placeholder="Current Password"
              onBlur={handleBlur("oldPassword")}
              onChangeText={handleChange("oldPassword")}
              rightIcon={iconName}
              onIconPress={onIconPress}
              autoCorrect={false}
              touched={touched.oldPassword}
              errorContent={errors.oldPassword}
              testID="oldPassword"
              rounded={true}
            />

            <GlobalTextInput
              name="password"
              autoCapitalize="none"
              secureTextEntry={secureTextEntry}
              textContentType={"password"}
              placeholder="Password"
              onBlur={handleBlur("password")}
              onChangeText={handleChange("password")}
              rightIcon={iconName}
              onIconPress={onIconPress}
              autoCorrect={false}
              touched={touched.password}
              errorContent={errors.password}
              testID="password"
              rounded={true}
            />

            <View style={styles.button}>
              <GlobalButton
                name="Change Password"
                type="success"
                size="large"
                onPress={handleSubmit}
                testID="loginButton"
              />
            </View>
          </View>
        )}
      </Formik>
    </View>
  );
};

export default ChangePassword;
