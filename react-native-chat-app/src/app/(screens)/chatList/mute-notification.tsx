import { Alert } from "@/src/components/alert/Alert";
import { ReactNativeElementsButton } from "@/src/components/reactNativeElements/ReactNativeElements";
import { socket } from "@/src/components/websocket/websocket";
import { ACTIONS_ERROR_MESSAGE } from "@/src/constants/globalText";
import {
  errorPopupActions,
  isLoadingActions,
} from "@/src/redux-toolkit/reducers/actionsSlice";
import { RootState } from "@/src/redux-toolkit/store";
import { muteUserContact } from "@/src/services/userContactsServices";

import { router } from "expo-router";
import { Formik } from "formik";
import { ScrollView, View } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import styles from "./chatListStyles";
import { ReactNativeSelect } from "@/src/components/select/Select";
import { muteGroupContact } from "@/src/services/groupsServices";
import { addDays, addHours, addMonths, addWeeks, addYears } from "date-fns";

const MuteNotication = () => {
  const usersSlice = useSelector((state: RootState) => state.usersSlice);
  const actionsSlice = useSelector((state: RootState) => state.actionsSlice);
  const dispatch = useDispatch();

  const muteUserContactDetail = async (values: { muteDate: Date }) => {
    dispatch(isLoadingActions(true));
    if (usersSlice.selectedUser.isGroup) {
      muteGroupContact(usersSlice.selectedUser._id, values.muteDate)
        .then((response) => {
          socket.emit("muteGroupMessage", {
            ...usersSlice.currentUser.user,
            groupId: usersSlice.selectedUser.group._id,
            muteDate: values.muteDate,
          });
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
    } else {
      muteUserContact(usersSlice.selectedUser.user, values.muteDate)
        .then((response) => {
          const receiverInfo = response?.data?.users.find(
            (user: { user: string }) =>
              user.user === usersSlice.selectedUser.user._id
          );
          socket.emit("updateContactUser", {
            ...usersSlice.currentUser.user,
            receiverInfo,
            updatedType: "mute",
          });

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
    }
  };

  const muteLists = [
    {
      label: "6 Hours",
      value: addHours(new Date(), 6),
    },
    {
      label: "12 Hours",
      value: addHours(new Date(), 12),
    },
    {
      label: "1 Day",
      value: addDays(new Date(), 1),
    },
    {
      label: "1 Week",
      value: addWeeks(new Date(), 1),
    },
    {
      label: "1 Month",
      value: addMonths(new Date(), 1),
    },
    {
      label: "6 Month",
      value: addMonths(new Date(), 6),
    },
    {
      label: "1 Year",
      value: addYears(new Date(), 1),
    },
  ];

  return (
    <View style={styles.container}>
      <ScrollView>
        <Formik
          form
          initialValues={{
            muteDate: addHours(new Date(), 6),
          }}
          onSubmit={muteUserContactDetail}
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
          }) => {
            return (
              <View style={styles.container}>
                <View>
                  {actionsSlice.errorPopup.status && (
                    <Alert
                      type="error"
                      message={actionsSlice.errorPopup.message}
                    />
                  )}
                </View>
                {/* {actionsSlice.isLoading && <LoadingData />} */}
                <View>
                  <ReactNativeSelect
                    value={values.muteDate}
                    name="muteDate"
                    id="muteDate"
                    onValueChange={(selected: {}) => {
                      setFieldValue(`muteDate`, selected);
                    }}
                    items={muteLists}
                    label="Mute List"
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
                      disabled={values.muteDate ? false : true}
                    />
                  </View>
                </View>
              </View>
            );
          }}
        </Formik>
      </ScrollView>
    </View>
  );
};

export default MuteNotication;
