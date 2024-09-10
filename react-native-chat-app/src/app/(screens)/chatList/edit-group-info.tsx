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
import { updateNameForm } from "@/src/components/formValidation/formValidation";
import { Divider, Image, Text, Icon } from "@rneui/themed";
import { Alert } from "@/src/components/alert/Alert";
import { Spinner } from "@/src/components/spinner/Spinner";
import { ReactNativeElementsButtonWithIcon } from "@/src/components/reactNativeElements/ReactNativeElements";
import { GlobalTextInput } from "@/src/components/globalTextInput/GlobalTextInput";
import { selectedUserRecord } from "@/src/redux-toolkit/reducers/usersSlice";
import {
  deleteGroupPhoto,
  getGroup,
  updateGroup,
  updateGroupProfileImage,
} from "@/src/services/groupsServices";
import { router } from "expo-router";

const EditGroupInfoScreen = () => {
  const actionsSlice = useSelector((state: RootState) => state.actionsSlice);
  const usersSlice = useSelector((state: RootState) => state.usersSlice);
  const chatMessageSlice = useSelector(
    (state: RootState) => state.chatMessageSlice
  );

  const dispatch = useDispatch();
  const [editName, setEditName] = useState(false);
  const [editDescription, setEditDescription] = useState(false);
  const [showImage, setShowImage] = useState<{
    selectedImage: string;
    photoUrl: string;
    saveButton: boolean;
  }>({
    selectedImage: "",
    photoUrl: "",
    saveButton: true,
  });

  const groupRecord = usersSlice.selectedUser.group;
  const userRecord = usersSlice.currentUser.user;

  useEffect(() => {
    let isSubscribed = true;

    socket.on("exitGroup", (response: { _id: string }) => {
      if (isSubscribed && response._id === userRecord._id) {
        router.navigate("/(tabs)/");
      }
    });

    socket.on("updateGroup", (response: []) => {
      if (
        isSubscribed &&
        response
          .map((user: { value: string }) => user.value)
          .includes(userRecord._id)
      ) {
        getGroupData();
      }
    });

    const getGroupData = async () => {
      getGroup(usersSlice.selectedUser.group._id)
        .then((response) => {
          if (isSubscribed) {
            dispatch(
              selectedUserRecord({
                ...usersSlice.selectedUser,
                group: response.data,
              })
            );
          }
        })
        .catch((error) => {});
    };

    return () => {
      isSubscribed = false;
      socket.off("exitGroup", (response: { _id: string }) => {
        if (isSubscribed && response._id === userRecord._id) {
          router.navigate("/(tabs)/");
        }
      });

      socket.off("updateGroup", (response: []) => {
        if (
          isSubscribed &&
          response
            .map((user: { value: string }) => user.value)
            .includes(userRecord._id)
        ) {
          getGroupData();
        }
      });
    };
  }, [dispatch, userRecord._id, usersSlice.selectedUser]);

  const updateGroupUserProfileData = async (values: {
    name?: string;
    description?: string;
  }) => {
    dispatch(isLoadingActions(true));
    updateGroup(values, groupRecord._id)
      .then((response) => {
        dispatch(isLoadingActions(false));
        setEditDescription(false);
        setEditName(false);
        socket.emit("updateGroup", groupMembersList);
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

  const updateGroupProfileImageData = () => {
    if (!showImage.photoUrl) return;

    let localUri = showImage.photoUrl;
    let filename: any = localUri.split("/").pop();
    let match = /\.(\w+)$/.exec(filename);
    let type = match ? `image/${match[1]}` : `image`;

    let data: any = new FormData();
    data.append("photoUrl", { uri: localUri, name: filename, type });
    dispatch(isLoadingActions(true));
    updateGroupProfileImage(data, groupRecord._id)
      .then((response) => {
        socket.emit("updateGroup", groupMembersList);
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

  const deleteGroupProfileImageData = () => {
    dispatch(isLoadingActions(true));
    deleteGroupPhoto(groupRecord._id)
      .then((response) => {
        socket.emit("updateGroup", groupMembersList);
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

  const groupMembersList = chatMessageSlice.chatGroupMembers.map(
    (member: {
      user: {
        name: string;
        _id: string;
      };
    }) => ({
      label: member.user.name,
      value: member.user._id,
    })
  );

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
                    deleteGroupProfileImageData();
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
                  onSubmit={updateGroupProfileImageData}
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
                      } else if (groupRecord.photoUrl) {
                        return (
                          <Image
                            source={{
                              uri: `${process.env.EXPO_PUBLIC_BASE_URL}/images/groups/${groupRecord.photoUrl}`,
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
                                  disabled={groupRecord.photoUrl ? false : true}
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
                    name: groupRecord.name,
                  }}
                  validationSchema={updateNameForm}
                  onSubmit={updateGroupUserProfileData}
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
                              <Text h4>Group name</Text>
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
                                      setFieldValue("name", groupRecord.name);
                                    }}
                                  />
                                </View>
                              )}
                            </View>
                          </View>
                          <Divider style={modalListsStyles.userDetailDivider} />
                          {!editName && (
                            <>
                              <Text>{groupRecord.name}</Text>
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
                    description: groupRecord.description,
                  }}
                  onSubmit={updateGroupUserProfileData}
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
                              <Text h4>Group description</Text>
                            </View>
                            <View style={modalListsStyles.userDetailsInfoUpBtn}>
                              {(!editDescription && (
                                <Icon
                                  type="font-awesome"
                                  name="edit"
                                  onPress={() => {
                                    setEditDescription(true);
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
                                      setEditDescription(false);
                                      setFieldValue(
                                        "description",
                                        groupRecord.description
                                      );
                                    }}
                                  />
                                </View>
                              )}
                            </View>
                          </View>
                          <Divider style={modalListsStyles.userDetailDivider} />
                          {!editDescription && (
                            <>
                              <Text>{groupRecord.description}</Text>
                            </>
                          )}

                          {editDescription && (
                            <>
                              <GlobalTextInput
                                name="description"
                                id="description"
                                placeholder="Description"
                                onBlur={handleBlur("description")}
                                textContentType={"name"}
                                autoCapitalize="none"
                                onChangeText={handleChange("description")}
                                autoCorrect={false}
                                touched={touched.description}
                                value={values.description}
                                errorContent={errors.description}
                                testID="description"
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

export default EditGroupInfoScreen;
