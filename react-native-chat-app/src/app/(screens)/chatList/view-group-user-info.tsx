import { BoxShadowCard } from "@/src/components/cards/BoxShadowCard";
import { socket } from "@/src/components/websocket/websocket";
import { ACTIONS_ERROR_MESSAGE } from "@/src/constants/globalText";
import {
  errorPopupActions,
  isLoadingActions,
  successDeleteUserPhotoActions,
  successViewGroupUserActions,
} from "@/src/redux-toolkit/reducers/actionsSlice";
import { RootState } from "@/src/redux-toolkit/store";
import { deleteUserPhoto, getUser } from "@/src/services/usersServices";
import { useEffect, useState } from "react";
import {
  View,
  SafeAreaView,
  ScrollView,
  Alert as ReactNativeAlert,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import modalListsStyles from "@/src/components/modalLists/modalListsStyles";
import { Divider, Image, Text } from "@rneui/themed";
import { Alert } from "@/src/components/alert/Alert";
import { Spinner } from "@/src/components/spinner/Spinner";

const SettingsScreen = () => {
  const actionsSlice = useSelector((state: RootState) => state.actionsSlice);
  const usersSlice = useSelector((state: RootState) => state.usersSlice);

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

  useEffect(() => {
    let isSubscribed = true;

    socket.on("updateUser", (response: { _id: string }) => {
      if (
        isSubscribed &&
        response._id === actionsSlice.successViewGroupUser.record.user._id
      )
        getCurrentUserData();
    });

    const getCurrentUserData = async () => {
      getUser(actionsSlice.successViewGroupUser.record.user._id, "")
        .then((response) => {
          if (isSubscribed) {
            dispatch(
              successViewGroupUserActions({
                ...actionsSlice.successViewGroupUser,
                "record.user": response.data,
              })
            );
          }
        })
        .catch((error) => {});
    };

    return () => {
      isSubscribed = false;
      socket.off("updateUser", (response: { _id: string }) => {
        if (
          isSubscribed &&
          response._id === actionsSlice.successViewGroupUser.record.user._id
        )
          getCurrentUserData();
      });
    };
  }, [
    usersSlice.selectedUser.user,
    dispatch,
    actionsSlice.successViewGroupUser,
  ]);

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

  const displayImage = () => {
    if (showImage.selectedImage) {
      return (
        <Image
          source={{ uri: showImage.selectedImage }}
          alt="avatar"
          containerStyle={modalListsStyles.userProfileAvatar}
        />
      );
    } else if (actionsSlice.successViewGroupUser.record?.user?.photoUrl) {
      return (
        <Image
          source={{
            uri: `${process.env.EXPO_PUBLIC_BASE_URL}/images/profile/${actionsSlice.successViewGroupUser.record?.user?.photoUrl}`,
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
                      <View style={modalListsStyles.userDetailDisplayImage}>
                        {displayImage()}
                      </View>
                      <View style={modalListsStyles.flexRowWrap}>
                        <Text>
                          {
                            actionsSlice.successViewGroupUser.record?.user
                              ?.email
                          }
                        </Text>
                      </View>
                    </View>
                  </View>
                </View>
              </View>
            </BoxShadowCard>
          </View>

          <View style={{ marginBottom: 10 }}>
            <BoxShadowCard>
              <View style={modalListsStyles.userDetailsInfo}>
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
                          {actionsSlice.successViewGroupUser.record?.user
                            ?.preferLanguage?.language || "None"}
                        </Text>
                      </>
                    </View>
                  </View>
                </View>
              </View>
            </BoxShadowCard>
          </View>

          <View style={{ marginBottom: 10 }}>
            <BoxShadowCard>
              <View style={modalListsStyles.userDetailsInfo}>
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
                          <Text h4>Name</Text>
                        </View>
                      </View>
                      <Divider style={modalListsStyles.userDetailDivider} />

                      <Text>
                        {actionsSlice.successViewGroupUser.record.user.name}
                      </Text>
                    </View>
                  </View>
                </View>
              </View>
            </BoxShadowCard>
          </View>

          <View style={{ marginBottom: 10 }}>
            <BoxShadowCard>
              <View style={modalListsStyles.userDetailsInfo}>
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
                      </View>
                      <Divider style={modalListsStyles.userDetailDivider} />
                      <Text>
                        {actionsSlice.successViewGroupUser.record.user.message}
                      </Text>
                    </View>
                  </View>
                </View>
              </View>
            </BoxShadowCard>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default SettingsScreen;
