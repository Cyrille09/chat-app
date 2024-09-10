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
import { getUserContacts } from "@/src/services/userContactsServices";
import { Image, Text } from "@rneui/themed";

import { router } from "expo-router";
import { FieldArray, Formik } from "formik";
import { useEffect, useState } from "react";
import { ScrollView, View } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import styles from "./chatListStyles";
import { GlobalTextInput } from "@/src/components/globalTextInput/GlobalTextInput";
import { createGroup } from "@/src/services/groupsServices";
import { updateMessageForm } from "@/src/components/formValidation/formValidation";
import { updateMessage } from "@/src/services/messagesServices";

const EditMessage = () => {
  const usersSlice = useSelector((state: RootState) => state.usersSlice);
  const actionsSlice = useSelector((state: RootState) => state.actionsSlice);
  const dispatch = useDispatch();

  const editMessageData = (values: { message: string }) => {
    dispatch(isLoadingActions(true));
    updateMessage(
      { message: values.message, editMessage: true },
      actionsSlice.successEditMessage.record._id
    )
      .then((response) => {
        dispatch(hideActions());
        if (usersSlice.selectedUser.isGroup) {
          socket.emit("updateGroupMessage", {
            groupId: usersSlice.selectedUser.group._id,
          });
        } else {
          socket.emit("updateMessage", { ...response.data });
        }

        router.back();
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
      <ScrollView>
        <Formik
          form
          initialValues={{
            message: actionsSlice.successEditMessage.record.message,
          }}
          validationSchema={updateMessageForm}
          onSubmit={editMessageData}
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
                  <GlobalTextInput
                    name="message"
                    id="message"
                    placeholder="Type a message..."
                    onBlur={handleBlur("message")}
                    textContentType={"name"}
                    autoCapitalize="none"
                    onChangeText={handleChange("message")}
                    autoCorrect={false}
                    touched={touched.message}
                    errorContent={errors.message}
                    testID="message"
                    rounded={true}
                    value={values.message}
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
                      title="Send"
                      color="success"
                      onPress={() => handleSubmit()}
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

export default EditMessage;
