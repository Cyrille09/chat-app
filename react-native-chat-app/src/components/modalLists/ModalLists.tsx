import { useDispatch, useSelector } from "react-redux";
import { GlobalModal } from "../modal/Modal";
import { Image, Text, Icon } from "@rneui/themed";
import { Picker } from "@react-native-picker/picker";

import { RootState } from "@/src/redux-toolkit/store";
import { View } from "react-native";
import styles from "./modalListsStyles";
import { Alert } from "../alert/Alert";
import { Formik } from "formik";
import {
  errorPopupActions,
  hideActions,
  isLoadingActions,
} from "@/src/redux-toolkit/reducers/actionsSlice";
import { createUserContacts } from "@/src/services/userContactsServices";
import { socket } from "../websocket/websocket";
import { ACTIONS_ERROR_MESSAGE } from "@/src/constants/globalText";
import { addContactForm } from "../formValidation/formValidation";

export const SendImageMessage = ({ footer, show, handleClose }: any) => {
  const actionsSlice = useSelector((state: RootState) => state.actionsSlice);

  return (
    <GlobalModal
      title={`Send Image`}
      show={show}
      handleClose={handleClose}
      footer={footer}
      size="lg"
    >
      <View style={styles.modal}>
        <View>
          <View>
            {actionsSlice.errorPopup.status && (
              <Alert type="error" message={actionsSlice.errorPopup.message} />
            )}
          </View>
          {/* {actionsSlice.isLoading && <LoadingData />} */}
          <View style={styles.sendImageMessage}>
            <Image
              source={{
                uri: actionsSlice.successSendImageMessage.record.selectedImage,
              }}
              alt="Image"
              style={{ height: 250, width: 250 }}
              containerStyle={styles.sendImageMessageAvatar}
            />
          </View>

          {footer && <View style={styles.footer}>{footer}</View>}
        </View>
      </View>
    </GlobalModal>
  );
};

export const SendDocumentMessage = ({ footer, show, handleClose }: any) => {
  const actionsSlice = useSelector((state: RootState) => state.actionsSlice);

  return (
    <GlobalModal
      title={`Send Document`}
      show={show}
      handleClose={handleClose}
      footer={footer}
      size="lg"
    >
      <View style={[styles.modal, { overflow: "scroll" }]}>
        <View>
          <View>
            {actionsSlice.errorPopup.status && (
              <Alert type="error" message={actionsSlice.errorPopup.message} />
            )}
          </View>
          {/* {actionsSlice.isLoading && <LoadingData />} */}
          <View style={styles.sendDocumentMessage}>
            <Icon
              type="font-awesome"
              name="file-o"
              size={200}
              //   style={styles.backToTopIcon}
            />
            <Text>
              {actionsSlice.successSendDocumentMessage.record.message?.name}
            </Text>
          </View>

          {footer && <View style={styles.footer}>{footer}</View>}
        </View>
      </View>
    </GlobalModal>
  );
};

export const AddNewContactUser = ({
  footer,
  show,
  users,
  currentUser,
  handleClose,
}: any) => {
  const actionsSlice = useSelector((state: RootState) => state.actionsSlice);
  const dispatch = useDispatch();

  const createUserContactsDetail = async (values: { userId: string }) => {
    dispatch(isLoadingActions(true));
    createUserContacts(values.userId)
      .then((response) => {
        socket.emit("contactUser", currentUser);
        dispatch(hideActions());
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

  const usersList = users?.map((user: { name: string; _id: string }) => ({
    label: user.name,
    value: user._id,
  }));

  return (
    <GlobalModal
      title={`Add Contact User`}
      show={show}
      handleClose={handleClose}
      footer={footer}
    >
      <View style={styles.modal}>
        <Formik
          form
          initialValues={{
            userId: usersList[0]?.value,
          }}
          validationSchema={addContactForm}
          onSubmit={createUserContactsDetail}
          enableReinitialize
        >
          {({ handleChange, handleBlur, setFieldValue, values, errors }) => (
            <View>
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
                <View>
                  <Picker
                    selectedValue={values.userId}
                    onValueChange={(itemValue, itemIndex) => {
                      console.log("itemValue", itemValue);
                      setFieldValue("userId", itemValue);
                    }}
                  >
                    {usersList.map((user: { value: string; label: string }) => (
                      <Picker.Item
                        key={user.value}
                        label={user.label}
                        value={user.value}
                      />
                    ))}
                  </Picker>
                </View>
              </View>

              {footer && <View style={styles.footer}>{footer}</View>}
            </View>
          )}
        </Formik>
      </View>
    </GlobalModal>
  );
};
