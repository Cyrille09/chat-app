import { Alert } from "@/src/components/alert/Alert";
import { ReactNativeElementsButton } from "@/src/components/reactNativeElements/ReactNativeElements";
import { socket } from "@/src/components/websocket/websocket";
import { ACTIONS_ERROR_MESSAGE } from "@/src/constants/globalText";
import {
  errorPopupActions,
  hideActions,
  isLoadingActions,
} from "@/src/redux-toolkit/reducers/actionsSlice";
import { RootState } from "@/src/redux-toolkit/store";
import {
  disappearContactUserMessage,
  muteUserContact,
} from "@/src/services/userContactsServices";

import { router } from "expo-router";
import { Formik } from "formik";
import { ScrollView, View } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import styles from "./chatListStyles";
import { ReactNativeSelect } from "@/src/components/select/Select";
import { muteGroupContact, updateGroup } from "@/src/services/groupsServices";
import { addDays, addHours, addMonths, addWeeks, addYears } from "date-fns";

const DisappearMessage = () => {
  const usersSlice = useSelector((state: RootState) => state.usersSlice);
  const actionsSlice = useSelector((state: RootState) => state.actionsSlice);
  const dispatch = useDispatch();

  const disappearMessageDetail = async (values: { disappear: string }) => {
    dispatch(isLoadingActions(true));
    const user = usersSlice.currentUser.user;

    if (usersSlice.selectedUser.isGroup) {
      updateGroup(
        {
          disappearIn: values.disappear,
          message: `${user.name} has set the disappear message to ${values.disappear}`,
        },
        usersSlice.selectedUser.group._id
      )
        .then((response) => {
          socket.emit("disappearGroupMessage", {
            group: response.data,
          });
          dispatch(hideActions());
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
      disappearContactUserMessage(
        usersSlice.selectedUser.user,
        values.disappear,
        `${user.name} has set the disappear message to ${values.disappear}`
      )
        .then((response) => {
          const receiverInfo = response?.data?.users.find(
            (user: { user: string }) =>
              user.user === usersSlice.selectedUser.user._id
          );
          socket.emit("updateContactUser", {
            ...user,
            receiverInfo,
            updatedType: "disappear",
          });
          dispatch(hideActions());
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

  const disappearLists = [
    {
      label: "6 Hours",
      value: "6 hours",
    },
    {
      label: "1 Day",
      value: "1 day",
    },
    {
      label: "1 Week",
      value: "1 week",
    },
  ];

  return (
    <View style={styles.container}>
      <ScrollView>
        <Formik
          form
          initialValues={{
            disappear: disappearLists[0].value,
          }}
          onSubmit={disappearMessageDetail}
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
                    value={values.disappear}
                    name="disappear"
                    id="disappear"
                    onValueChange={(selected: {}) => {
                      setFieldValue(`disappear`, selected);
                    }}
                    items={disappearLists}
                    label="Disappear List"
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
                      disabled={values.disappear ? false : true}
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

export default DisappearMessage;
