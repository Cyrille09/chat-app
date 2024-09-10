import { BoxShadowCard } from "@/src/components/cards/BoxShadowCard";
import { socket } from "@/src/components/websocket/websocket";
import { ACTIONS_ERROR_MESSAGE } from "@/src/constants/globalText";
import {
  errorPopupActions,
  isLoadingActions,
  successAddStoryFeedActions,
  successDisplayEmojiActions,
} from "@/src/redux-toolkit/reducers/actionsSlice";
import { RootState } from "@/src/redux-toolkit/store";
import { Picker } from "emoji-mart-native";
import { Formik } from "formik";
import { useState } from "react";
import { View, SafeAreaView, ScrollView, TouchableOpacity } from "react-native";
import * as ImagePicker from "expo-image-picker";
import { useDispatch, useSelector } from "react-redux";
import modalListsStyles from "@/src/components/modalLists/modalListsStyles";
import { updateMessageForm } from "@/src/components/formValidation/formValidation";
import { Image, Text, Icon } from "@rneui/themed";
import { Alert } from "@/src/components/alert/Alert";
import { Spinner } from "@/src/components/spinner/Spinner";
import { ReactNativeElementsButtonWithIcon } from "@/src/components/reactNativeElements/ReactNativeElements";
import { GlobalTextInput } from "@/src/components/globalTextInput/GlobalTextInput";
import {
  sendStoryFeed,
  sendStoryFeedImageOrVideo,
} from "@/src/services/storyFeedsServices";
import { router } from "expo-router";

const StoryFeedScreen = () => {
  const actionsSlice = useSelector((state: RootState) => state.actionsSlice);
  const [open, setOpen] = useState(false);
  const dispatch = useDispatch();
  const [showImage, setShowImage] = useState<{
    selectedImage: string;
    photoUrl: string;
    saveButton: boolean;
  }>({
    selectedImage: "",
    photoUrl: "",
    saveButton: true,
  });

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

  const sendStoryFeedData = (values: { message: string }) => {
    sendStoryFeed(values.message)
      .then((response) => {
        socket.emit("storyFeed", response.data);
        dispatch(
          successAddStoryFeedActions({
            status: true,
            record: { text: false, imageOrVideo: false },
          })
        );
        router.navigate("/(tabs)/storyFeed");
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

  const sendStoryFeedImageImageData = () => {
    if (!showImage.photoUrl) return;

    let localUri = showImage.photoUrl;
    let filename: any = localUri.split("/").pop();
    let match = /\.(\w+)$/.exec(filename);
    let type = match ? `image/${match[1]}` : `image`;

    let data: any = new FormData();
    data.append("message", { uri: localUri, name: filename, type });

    dispatch(isLoadingActions(true));
    sendStoryFeedImageOrVideo(data)
      .then((response) => {
        socket.emit("storyFeed", response.data);
        setShowImage({
          selectedImage: "",
          photoUrl: "",
          saveButton: true,
        });
        dispatch(
          successAddStoryFeedActions({
            status: true,
            record: { text: false, imageOrVideo: false },
          })
        );
        router.navigate("/(tabs)/storyFeed");
      })
      .catch((error) => {
        console.log(error.response.data);
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

  return (
    <SafeAreaView>
      <ScrollView style={modalListsStyles.userProfile}>
        <View style={modalListsStyles.userDetails}>
          {actionsSlice.successAddStoryFeed.record.imageOrVideo && (
            <View style={{ marginBottom: 10 }}>
              <BoxShadowCard>
                <View style={modalListsStyles.userProfileDetailsInfo}>
                  <Formik
                    initialValues={{
                      message: "",
                    }}
                    onSubmit={sendStoryFeedImageImageData}
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
                              containerStyle={
                                modalListsStyles.userProfileAvatar
                              }
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
                                  style={
                                    modalListsStyles.userProfileAvatarDelete
                                  }
                                >
                                  <ReactNativeElementsButtonWithIcon
                                    title="Remove"
                                    iconRight
                                    iconName="trash"
                                    color="secondary"
                                    onPress={() => {
                                      setShowImage({
                                        selectedImage: "",
                                        photoUrl: "",
                                        saveButton: true,
                                      });
                                    }}
                                    disabled={showImage.photoUrl ? false : true}
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
          )}

          {actionsSlice.successAddStoryFeed.record.text && (
            <View style={{ marginBottom: 10 }}>
              <BoxShadowCard>
                <View style={modalListsStyles.userDetailsInfo}>
                  <Formik
                    initialValues={{
                      message: "",
                      displayEmoji: false,
                    }}
                    validationSchema={updateMessageForm}
                    onSubmit={sendStoryFeedData}
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
                            <View style={{ marginBottom: 70 }}>
                              <Text>{values.message}</Text>
                            </View>

                            <View style={modalListsStyles.chatAreaButtonRow}>
                              <View style={modalListsStyles.icons}>
                                {actionsSlice.successDisplayEmoji.status ? (
                                  <TouchableOpacity>
                                    <Icon
                                      type="font-awesome"
                                      name="close"
                                      size={20}
                                      color="#555"
                                      onPress={() => {
                                        setOpen(false);
                                        dispatch(
                                          successDisplayEmojiActions({
                                            status: false,
                                            record: {},
                                          })
                                        );
                                      }}
                                    />
                                  </TouchableOpacity>
                                ) : (
                                  <TouchableOpacity
                                    onPress={() => {
                                      setOpen(true);
                                      dispatch(
                                        successDisplayEmojiActions({
                                          status: true,
                                          record: {},
                                        })
                                      );
                                    }}
                                  >
                                    <Icon
                                      type="font-awesome"
                                      name="smile-o"
                                      size={18}
                                      color="#555"
                                    />
                                  </TouchableOpacity>
                                )}

                                {open && (
                                  <View
                                    style={
                                      modalListsStyles.emojiPickerContainer
                                    }
                                  >
                                    <Picker
                                      onSelect={(emoji) => {
                                        setFieldValue(
                                          "message",
                                          values.message + emoji.native
                                        );
                                      }}
                                      onPressClose={() => setOpen(false)}
                                      theme="light" // or "dark"
                                    />
                                  </View>
                                )}
                              </View>

                              <View style={modalListsStyles.inputContainer}>
                                <GlobalTextInput
                                  name="message"
                                  id="message"
                                  placeholder="Type a message..."
                                  onBlur={handleBlur("message")}
                                  textContentType={"name"}
                                  autoCapitalize="none"
                                  value={values.message}
                                  onChangeText={handleChange("message")}
                                  autoCorrect={false}
                                  touched={touched.message}
                                  errorContent={errors.message}
                                  rounded={true}
                                />
                              </View>

                              <View style={modalListsStyles.chatAreaSend}>
                                <Icon
                                  type="font-awesome"
                                  name="send"
                                  size={18}
                                  color="#555"
                                  onPress={() => handleSubmit()}
                                />
                              </View>
                            </View>
                          </View>
                        </View>
                      </View>
                    )}
                  </Formik>
                </View>
              </BoxShadowCard>
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default StoryFeedScreen;
