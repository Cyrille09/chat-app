import { Alert } from "@/src/components/alert/Alert";
import { addContactForm } from "@/src/components/formValidation/formValidation";
import { ReactNativeElementsButton } from "@/src/components/reactNativeElements/ReactNativeElements";
import { socket } from "@/src/components/websocket/websocket";
import { ACTIONS_ERROR_MESSAGE } from "@/src/constants/globalText";
import {
  errorPopupActions,
  isLoadingActions,
  successPopupActions,
} from "@/src/redux-toolkit/reducers/actionsSlice";
import { RootState } from "@/src/redux-toolkit/store";
import {
  createUserContacts,
  getRequestUserContact,
  getUserContacts,
} from "@/src/services/userContactsServices";
import { router } from "expo-router";
import { Formik } from "formik";
import { useEffect, useState } from "react";
import { View } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import styles from "./chatListStyles";
import { ReactNativeSelect } from "@/src/components/select/Select";
import { userContactsRecord } from "@/src/redux-toolkit/reducers/userContactsSlice";

const AddNewContact = () => {
  const usersSlice = useSelector((state: RootState) => state.usersSlice);
  const actionsSlice = useSelector((state: RootState) => state.actionsSlice);
  const [users, setUsers] = useState<[]>([]);
  const dispatch = useDispatch();

  useEffect(() => {
    let isSubscribed = true;

    // contact user
    socket.on("contactUser", (response: any) => {
      if (isSubscribed && response._id === usersSlice.currentUser.user._id) {
        userContactData();
      }
    });

    const getRequestUserContactData = () => {
      getRequestUserContact("")
        .then((response) => {
          if (isSubscribed) {
            setUsers(response.data);
          }
        })
        .catch((error) => {});
    };

    const userContactData = async () => {
      await getUserContacts("")
        .then((response) => {
          dispatch(userContactsRecord(response.data.users));
        })
        .catch((error) => {});
    };

    getRequestUserContactData();

    return () => {
      isSubscribed = false;
      // contact user
      socket.off("contactUser", (response: any) => {
        if (isSubscribed && response._id === usersSlice.currentUser.user._id) {
          userContactData();
        }
      });
    };
  }, []);

  const createUserContactsDetail = async (
    values: { userId: string; label: string },
    { resetForm }: any
  ) => {
    dispatch(isLoadingActions(true));
    createUserContacts(values.userId)
      .then((response) => {
        socket.emit("contactUser", usersSlice.currentUser.user);
        dispatch(
          successPopupActions({
            status: true,
            message: `${values.label} was added to your contact list`,
            display: "",
          })
        );
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

    resetForm();
  };

  const usersList =
    (users.length > 9 &&
      users?.map((user: { name: string; _id: string }) => ({
        label: user.name,
        value: user._id,
      }))) ||
    [];

  return (
    <View style={styles.container}>
      <Formik
        form
        initialValues={{
          userId: "",
          label: "",
        }}
        validationSchema={addContactForm}
        onSubmit={createUserContactsDetail}
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
                value={values.userId}
                name="userId"
                id="userId"
                onValueChange={(itemValue: {}, itemIndex: number) => {
                  setFieldValue("userId", itemValue);
                  setFieldValue("label", usersList[itemIndex].label);
                }}
                items={usersList}
                label="Users"
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

export default AddNewContact;
