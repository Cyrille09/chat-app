import { Alert } from "@/src/components/alert/Alert";
import { ReactNativeElementsButton } from "@/src/components/reactNativeElements/ReactNativeElements";
import { socket } from "@/src/components/websocket/websocket";
import { ACTIONS_ERROR_MESSAGE } from "@/src/constants/globalText";
import {
  errorPopupActions,
  isLoadingActions,
} from "@/src/redux-toolkit/reducers/actionsSlice";
import { RootState } from "@/src/redux-toolkit/store";
import { router } from "expo-router";
import { Formik } from "formik";
import { View } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import styles from "./chatListStyles";
import { ReactNativeSelect } from "@/src/components/select/Select";
import { updateUserProfile } from "@/src/services/usersServices";
import { currentUserRecord } from "@/src/redux-toolkit/reducers/usersSlice";

const PreferLanguage = () => {
  const usersSlice = useSelector((state: RootState) => state.usersSlice);
  const actionsSlice = useSelector((state: RootState) => state.actionsSlice);
  const dispatch = useDispatch();

  const updateUserProfilePreferLanguageData = async (values: {
    preferLanguage: string;
    label: string;
  }) => {
    const preferLanguage = {
      language: values.label === "None" ? "" : values.label,
      isoCode: values.preferLanguage,
    };
    dispatch(isLoadingActions(true));
    updateUserProfile({
      preferLanguage,
    })
      .then((response) => {
        dispatch(isLoadingActions(false));
        socket.emit("updateUser", response.data);
        dispatch(currentUserRecord({ user: response.data }));
        router.back();
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

  const languages = [
    {
      label: "None",
      value: "",
    },
    {
      label: "English",
      value: "en",
    },
    {
      label: "Frensh",
      value: "fr",
    },
    {
      label: "Portuguese",
      value: "pt",
    },
    {
      label: "Spanish",
      value: "es",
    },
    {
      label: "German",
      value: "de",
    },
    {
      label: "Italian",
      value: "it",
    },
    {
      label: "Portuguese",
      value: "pt",
    },
    {
      label: "Yoruba",
      value: "yo",
    },
  ];

  return (
    <View style={styles.container}>
      <Formik
        form
        initialValues={{
          preferLanguage: usersSlice.currentUser.user?.preferLanguage?.isoCode,
          label: usersSlice.currentUser.user?.preferLanguage?.language,
        }}
        onSubmit={updateUserProfilePreferLanguageData}
        enableReinitialize
      >
        {({
          handleChange,
          handleBlur,
          handleSubmit,
          setFieldValue,
          values,
          errors,
        }) => (
          <View style={styles.container}>
            <View>
              {actionsSlice.errorPopup.status && (
                <Alert type="error" message={actionsSlice.errorPopup.message} />
              )}

              {actionsSlice.successPopup.status && (
                <Alert
                  type="success"
                  message={actionsSlice.successPopup.message}
                />
              )}
            </View>
            {/* {actionsSlice.isLoading && <LoadingData />} */}
            <View>
              <ReactNativeSelect
                value={values.preferLanguage}
                name="preferLanguage"
                id="preferLanguage"
                onValueChange={(itemValue: {}, itemIndex: number) => {
                  setFieldValue("preferLanguage", itemValue);
                  setFieldValue(
                    "label",
                    itemIndex > 1 ? languages[itemIndex - 1].label : "None"
                  );
                }}
                items={languages}
                label="Language List"
                required
              />
            </View>

            <View style={styles.flexRowWrap}>
              <View style={styles.leftColumn}>
                <ReactNativeElementsButton
                  title="Cancel"
                  color="primary"
                  onPress={() => router.back()}
                />
              </View>
              <View style={styles.middleColumn}></View>
              <View style={styles.rightColumn}>
                <ReactNativeElementsButton
                  title="Submit"
                  color="success"
                  onPress={() => handleSubmit()}
                />
              </View>
            </View>
          </View>
        )}
      </Formik>
    </View>
  );
};

export default PreferLanguage;
