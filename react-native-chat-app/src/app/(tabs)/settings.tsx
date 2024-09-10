import { BoxShadowCard } from "@/src/components/cards/BoxShadowCard";
import { socket } from "@/src/components/websocket/websocket";
import { ACTIONS_ERROR_MESSAGE } from "@/src/constants/globalText";
import {
  errorPopupActions,
  isLoadingActions,
  successDeleteUserPhotoActions,
  successPopupActions,
} from "@/src/redux-toolkit/reducers/actionsSlice";
import { RootState } from "@/src/redux-toolkit/store";
import {
  deleteUserPhoto,
  getUserProfile,
  updateUserProfile,
  updateUserProfileImage,
} from "@/src/services/usersServices";
import { Formik } from "formik";
import { useEffect, useState } from "react";
import {
  View,
  SafeAreaView,
  ScrollView,
  Alert as ReactNativeAlert,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { useDispatch, useSelector } from "react-redux";
import modalListsStyles from "@/src/components/modalLists/modalListsStyles";
import {
  updateMessageForm,
  updateNameForm,
} from "@/src/components/formValidation/formValidation";
import { Divider, Image, Text, Icon } from "@rneui/themed";
import { Alert } from "@/src/components/alert/Alert";
import { Spinner } from "@/src/components/spinner/Spinner";
import { ReactNativeElementsButtonWithIcon } from "@/src/components/reactNativeElements/ReactNativeElements";
import { GlobalTextInput } from "@/src/components/globalTextInput/GlobalTextInput";
import { currentUserRecord } from "@/src/redux-toolkit/reducers/usersSlice";

const SettingsScreen = () => {
  const actionsSlice = useSelector((state: RootState) => state.actionsSlice);
  const usersSlice = useSelector((state: RootState) => state.usersSlice);

  const dispatch = useDispatch();
  const [editName, setEditName] = useState(false);
  const [editMessage, setEditMessage] = useState(false);
  const [showImage, setShowImage] = useState<{
    selectedImage: string;
    photoUrl: string;
    saveButton: boolean;
  }>({
    selectedImage: "",
    photoUrl: "",
    saveButton: true,
  });

  useEffect(() => {
    let isSubscribed = true;

    socket.on("updateUser", (response: { _id: string }) => {
      if (isSubscribed && response._id === usersSlice.currentUser.user._id)
        getCurrentUserData();
    });

    const getCurrentUserData = async () => {
      getUserProfile()
        .then((response) => {
          if (isSubscribed) {
            dispatch(currentUserRecord(response.data));
          }
        })
        .catch((error) => {});
    };

    return () => {
      isSubscribed = false;
      socket.off("updateUser", (response: { _id: string }) => {
        if (isSubscribed && response._id === usersSlice.currentUser.user._id)
          getCurrentUserData();
      });
    };
  }, [usersSlice.selectedUser.user, dispatch]);

  const updateUserProfileData = async (values: {
    name?: string;
    message?: string;
  }) => {
    dispatch(isLoadingActions(true));
    updateUserProfile(values)
      .then((response) => {
        dispatch(isLoadingActions(false));
        setEditMessage(false);
        setEditName(false);
        socket.emit("updateUser", response.data);
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

  const pickImage = async () => {
    // No permissions request is necessary for launching the image library
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setShowImage({
        ...showImage,
        selectedImage: result.assets[0].uri,
        photoUrl: result.assets[0].uri,
        saveButton: false,
      });
    }
  };

  const updateUserProfileImageData = () => {
    if (!showImage.photoUrl) return;

    let localUri = showImage.photoUrl;
    let filename: any = localUri.split("/").pop();
    let match = /\.(\w+)$/.exec(filename);
    let type = match ? `image/${match[1]}` : `image`;

    let data: any = new FormData();
    data.append("photoUrl", { uri: localUri, name: filename, type });
    dispatch(isLoadingActions(true));
    updateUserProfileImage(data)
      .then((response) => {
        socket.emit("updateUser", response.data);
        setShowImage({
          selectedImage: "",
          photoUrl: "",
          saveButton: true,
        });
        dispatch(isLoadingActions(false));
        dispatch(
          successPopupActions({ status: true, message: ACTIONS_ERROR_MESSAGE })
        );
      })
      .catch((error) => {
        dispatch(
          errorPopupActions({ status: true, message: ACTIONS_ERROR_MESSAGE })
        );
        dispatch(isLoadingActions(false));
      });
  };

  const deleteUserProfileImageData = () => {
    dispatch(isLoadingActions(true));
    deleteUserPhoto()
      .then((response) => {
        socket.emit("updateUser", response.data);
        dispatch(isLoadingActions(false));
        setShowImage({
          selectedImage: "",
          photoUrl: "",
          saveButton: true,
        });
      })
      .catch((error) => {
        dispatch(
          errorPopupActions({ status: true, message: ACTIONS_ERROR_MESSAGE })
        );
        dispatch(isLoadingActions(false));
      });
  };

  return (
    <SafeAreaView>
      <ScrollView style={modalListsStyles.userProfile}>
        <>
          {actionsSlice.successDeleteUserPhoto.status &&
            ReactNativeAlert.alert(
              "Delete Photo",
              "Do you want to delete your photo?",
              [
                {
                  text: "Cancel",
                  onPress: () => {
                    dispatch(
                      successDeleteUserPhotoActions({
                        status: false,
                        record: {},
                      })
                    );
                  },
                  style: "cancel",
                },
                {
                  text: "Yes",
                  onPress: () => {
                    dispatch(
                      successDeleteUserPhotoActions({
                        status: false,
                        record: {},
                      })
                    );
                    deleteUserProfileImageData();
                  },
                },
              ]
            )}
        </>
        <View style={modalListsStyles.userDetails}>
          <View style={{ marginBottom: 10 }}>
            <BoxShadowCard>
              <View style={modalListsStyles.userProfileDetailsInfo}>
                <Formik
                  initialValues={{
                    photoUrl: "",
                    name: "",
                  }}
                  onSubmit={updateUserProfileImageData}
                  enableReinitialize
                >
                  {({
                    handleChange,
                    handleBlur,
                    setFieldValue,
                    handleSubmit,
                    values,
                    errors,
                  }) => {
                    const displayImage = () => {
                      if (showImage.selectedImage) {
                        return (
                          <Image
                            source={{ uri: showImage.selectedImage }}
                            alt="avatar"
                            containerStyle={modalListsStyles.userProfileAvatar}
                          />
                        );
                      } else if (usersSlice.currentUser.user.photoUrl) {
                        return (
                          <Image
                            source={{
                              uri: `${process.env.EXPO_PUBLIC_BASE_URL}/images/profile/${usersSlice.currentUser.user.photoUrl}`,
                            }}
                            alt="avatar"
                            containerStyle={modalListsStyles.userProfileAvatar}
                          />
                        );
                      } else {
                        return (
                          <Image
                            source={require("@/assets/chat-images/images/placeholder.png")}
                            alt="avatar"
                            containerStyle={modalListsStyles.userProfileAvatar}
                          />
                        );
                      }
                    };
                    return (
                      <View>
                        <View>
                          {actionsSlice.errorPopup.status && (
                            <Alert
                              type="error"
                              message={actionsSlice.errorPopup.message}
                            />
                          )}
                        </View>
                        {actionsSlice.isLoading && (
                          <Spinner
                            visible={actionsSlice.isLoading}
                            textContent={"Loading"}
                          />
                        )}
                        <View>
                          <View>
                            <Text h4>Profile picture</Text>
                          </View>
                          <Divider style={modalListsStyles.userDetailDivider} />
                          <View style={modalListsStyles.userDetailsAvatar}>
                            <View
                              style={modalListsStyles.userDetailDisplayImage}
                            >
                              {displayImage()}
                            </View>
                            <View style={modalListsStyles.flexRowWrap}>
                              <View
                                style={modalListsStyles.userProfileAvatarSave}
                              >
                                <ReactNativeElementsButtonWithIcon
                                  title="Save"
                                  iconRight
                                  color="success"
                                  onPress={() => handleSubmit()}
                                  disabled={showImage.photoUrl ? false : true}
                                />
                              </View>

                              <View
                                style={modalListsStyles.userProfileAvatarAdd}
                              >
                                <ReactNativeElementsButtonWithIcon
                                  title="Add"
                                  iconRight
                                  iconName="image"
                                  color="primary"
                                  onPress={pickImage}
                                />
                              </View>

                              <View
                                style={modalListsStyles.userProfileAvatarDelete}
                              >
                                <ReactNativeElementsButtonWithIcon
                                  title="Delete"
                                  iconRight
                                  iconName="trash"
                                  color="secondary"
                                  onPress={() => {
                                    dispatch(
                                      successDeleteUserPhotoActions({
                                        status: true,
                                        record: {},
                                      })
                                    );
                                  }}
                                  disabled={
                                    usersSlice.currentUser.user.photoUrl
                                      ? false
                                      : true
                                  }
                                />
                              </View>
                            </View>
                          </View>
                        </View>
                      </View>
                    );
                  }}
                </Formik>
              </View>
            </BoxShadowCard>
          </View>

          <View style={{ marginBottom: 10 }}>
            <BoxShadowCard>
              <View style={modalListsStyles.userDetailsInfo}>
                <Formik
                  initialValues={{
                    name: usersSlice.currentUser.user.name,
                  }}
                  validationSchema={updateNameForm}
                  onSubmit={updateUserProfileData}
                  enableReinitialize
                >
                  {({
                    handleChange,
                    handleBlur,
                    handleSubmit,
                    values,
                    errors,
                    touched,
                    setFieldValue,
                  }) => (
                    <View>
                      <View>
                        {actionsSlice.errorPopup.status && (
                          <Alert
                            type="error"
                            message={actionsSlice.errorPopup.message}
                          />
                        )}
                      </View>
                      {actionsSlice.isLoading && (
                        <Spinner
                          visible={actionsSlice.isLoading}
                          textContent={"Loading"}
                        />
                      )}
                      <View>
                        <View>
                          <View style={modalListsStyles.flexRowWrap}>
                            <View style={modalListsStyles.leftSide}>
                              <Text h4>Prefer language</Text>
                            </View>
                          </View>
                          <Divider style={modalListsStyles.userDetailDivider} />

                          <>
                            <Text>
                              {usersSlice.currentUser.user?.preferLanguage
                                ?.language || "None"}
                            </Text>
                          </>
                        </View>
                      </View>
                    </View>
                  )}
                </Formik>
              </View>
            </BoxShadowCard>
          </View>

          <View style={{ marginBottom: 10 }}>
            <BoxShadowCard>
              <View style={modalListsStyles.userDetailsInfo}>
                <Formik
                  initialValues={{
                    name: usersSlice.currentUser.user.name,
                  }}
                  validationSchema={updateNameForm}
                  onSubmit={updateUserProfileData}
                  enableReinitialize
                >
                  {({
                    handleChange,
                    handleBlur,
                    handleSubmit,
                    values,
                    errors,
                    touched,
                    setFieldValue,
                  }) => (
                    <View>
                      <View>
                        {actionsSlice.errorPopup.status && (
                          <Alert
                            type="error"
                            message={actionsSlice.errorPopup.message}
                          />
                        )}
                      </View>
                      {actionsSlice.isLoading && (
                        <Spinner
                          visible={actionsSlice.isLoading}
                          textContent={"Loading"}
                        />
                      )}
                      <View>
                        <View>
                          <View style={modalListsStyles.flexRowWrap}>
                            <View style={modalListsStyles.leftSide}>
                              <Text h4>Your name</Text>
                            </View>

                            <View style={modalListsStyles.userDetailsInfoUpBtn}>
                              {(!editName && (
                                <Icon
                                  type="font-awesome"
                                  name="edit"
                                  onPress={() => {
                                    setEditName(true);
                                  }}
                                />
                              )) || (
                                <View style={modalListsStyles.flexRowWrap}>
                                  <Icon
                                    type="font-awesome"
                                    name="check"
                                    onPress={() => {
                                      handleSubmit();
                                    }}
                                    style={{ marginRight: 20 }}
                                  />
                                  <Icon
                                    type="font-awesome"
                                    name="close"
                                    onPress={() => {
                                      setEditName(false);
                                      setFieldValue(
                                        "name",
                                        usersSlice.currentUser.user.name
                                      );
                                    }}
                                  />
                                </View>
                              )}
                            </View>
                          </View>
                          <Divider style={modalListsStyles.userDetailDivider} />
                          {!editName && (
                            <>
                              <Text>{usersSlice.currentUser.user.name}</Text>
                            </>
                          )}

                          {editName && (
                            <>
                              <GlobalTextInput
                                name="name"
                                id="name"
                                placeholder="Name"
                                onBlur={handleBlur("name")}
                                textContentType={"name"}
                                autoCapitalize="none"
                                value={values.name}
                                onChangeText={handleChange("name")}
                                autoCorrect={false}
                                touched={touched.name}
                                errorContent={errors.name}
                                rounded={true}
                              />
                            </>
                          )}
                        </View>
                      </View>
                    </View>
                  )}
                </Formik>
              </View>
            </BoxShadowCard>
          </View>

          <View style={{ marginBottom: 10 }}>
            <BoxShadowCard>
              <View style={modalListsStyles.userDetailsInfo}>
                <Formik
                  initialValues={{
                    message: usersSlice.currentUser.user.message,
                  }}
                  validationSchema={updateMessageForm}
                  onSubmit={updateUserProfileData}
                  enableReinitialize
                >
                  {({
                    handleChange,
                    handleBlur,
                    handleSubmit,
                    values,
                    errors,
                    touched,
                    setFieldValue,
                  }) => (
                    <View>
                      <View>
                        {actionsSlice.errorPopup.status && (
                          <Alert
                            type="error"
                            message={actionsSlice.errorPopup.message}
                          />
                        )}
                      </View>
                      {actionsSlice.isLoading && (
                        <Spinner
                          visible={actionsSlice.isLoading}
                          textContent={"Loading"}
                        />
                      )}
                      <View>
                        <View>
                          <View style={modalListsStyles.flexRowWrap}>
                            <View style={modalListsStyles.leftSide}>
                              <Text h4>About</Text>
                            </View>
                            <View style={modalListsStyles.userDetailsInfoUpBtn}>
                              {(!editMessage && (
                                <Icon
                                  type="font-awesome"
                                  name="edit"
                                  onPress={() => {
                                    setEditMessage(true);
                                  }}
                                />
                              )) || (
                                <View style={modalListsStyles.flexRowWrap}>
                                  <Icon
                                    type="font-awesome"
                                    name="check"
                                    onPress={() => {
                                      handleSubmit();
                                    }}
                                    style={{ marginRight: 20 }}
                                  />

                                  <Icon
                                    type="font-awesome"
                                    name="close"
                                    onPress={() => {
                                      setEditMessage(false);
                                      setFieldValue(
                                        "message",
                                        usersSlice.currentUser.user.message
                                      );
                                    }}
                                  />
                                </View>
                              )}
                            </View>
                          </View>
                          <Divider style={modalListsStyles.userDetailDivider} />
                          {!editMessage && (
                            <>
                              <Text>{usersSlice.currentUser.user.message}</Text>
                            </>
                          )}

                          {editMessage && (
                            <>
                              <GlobalTextInput
                                name="message"
                                id="message"
                                placeholder="Message"
                                onBlur={handleBlur("message")}
                                textContentType={"name"}
                                autoCapitalize="none"
                                onChangeText={handleChange("message")}
                                autoCorrect={false}
                                touched={touched.name}
                                value={values.message}
                                errorContent={errors.message}
                                testID="message"
                                rounded={true}
                              />
                            </>
                          )}
                        </View>
                      </View>
                    </View>
                  )}
                </Formik>
              </View>
            </BoxShadowCard>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default SettingsScreen;
