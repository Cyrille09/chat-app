import React from "react";
import {
  StyleSheet,
  TouchableOpacity,
  View,
  Alert as ReactNativeAlert,
} from "react-native";
import { Text } from "@rneui/themed";
import { Dialog } from "@rneui/themed";
import { Href, router } from "expo-router";
import { useDispatch, useSelector } from "react-redux";
import {
  errorPopupActions,
  hideActions,
  isLoadingActions,
  successAddStoryFeedActions,
  successLogoutActions,
  successMakeGroupAdminActions,
  successRemoveUserFromGroupActions,
  successViewGroupUserActions,
} from "@/src/redux-toolkit/reducers/actionsSlice";
import { RootState } from "@/src/redux-toolkit/store";
import { updateUserProfile } from "@/src/services/usersServices";
import { socket } from "../websocket/websocket";
import { loginSuccess } from "@/src/redux-toolkit/reducers/authSlice";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  assignGroupAdmin,
  removeUserFromGroup,
} from "@/src/services/groupsServices";
import { ACTIONS_ERROR_MESSAGE } from "@/src/constants/globalText";
import {
  addStarToMessage,
  removeStarToMessage,
} from "@/src/services/messagesServices";
import { UserRecordInterface } from "../globalTypes/GlobalTypes";

interface DialogProps {
  isVisible: boolean;
  onBackdropPress: () => void;
  items: any[];
  message?: {
    _id: any;
    message: string;
    stars: [] | undefined;
    sender: UserRecordInterface;
  };
}

export function ReactNativeDialog({
  isVisible,
  onBackdropPress,
  items,
  message,
}: DialogProps) {
  const usersSlice = useSelector((state: RootState) => state.usersSlice);
  const actionsSlice = useSelector((state: RootState) => state.actionsSlice);
  const dispatch = useDispatch();
  const selectedUser = usersSlice.selectedUser;

  const logoutUserData = async () => {
    const lastSeen = {
      status: false,
      date: new Date(),
    };
    isLoadingActions(true);

    const response = await updateUserProfile({ lastSeen });

    if (response.data) {
      socket.emit("userStatus", response.data);
      dispatch(hideActions());
      await AsyncStorage.clear();
      dispatch(loginSuccess({ token: "" }));
      isLoadingActions(false);
      router.navigate("/sign-in");
    } else {
      dispatch(isLoadingActions(false));
    }
  };

  const assignGroupAdminData = async () => {
    assignGroupAdmin(
      usersSlice.selectedUser.group._id,
      actionsSlice.successMakeGroupAdmin?.record?.user?._id,
      `${usersSlice.currentUser.user.name} has assigned ${actionsSlice.successMakeGroupAdmin?.record?.user?.name} as a group admin.`
    )
      .then((response) => {
        socket.emit("updateGroupMember", usersSlice.selectedUser.group);
        socket.emit("messageGroup", {
          groupId: selectedUser.group._id,
        });

        dispatch(hideActions());
      })
      .catch((error) => {
        dispatch(
          errorPopupActions({
            status: true,
            message: ACTIONS_ERROR_MESSAGE,
            display: "",
          })
        );
      });
  };

  const removeUserFromGroupData = async () => {
    removeUserFromGroup(
      usersSlice.selectedUser.group._id,
      actionsSlice.successRemoveUserFromGroup?.record?.user?._id,
      `${usersSlice.currentUser.user.name} has removed ${actionsSlice.successRemoveUserFromGroup?.record?.user?.name} from the group.`
    )
      .then((response) => {
        socket.emit("removeUserFromGroup", {
          group: usersSlice.selectedUser.group,
          user: actionsSlice.successRemoveUserFromGroup?.record?.user,
        });
        socket.emit("messageGroup", {
          groupId: selectedUser.group._id,
        });

        dispatch(hideActions());
      })
      .catch((error) => {
        dispatch(
          errorPopupActions({
            status: true,
            message: ACTIONS_ERROR_MESSAGE,
            display: "",
          })
        );
      });
  };

  const getStarMessage = message?.stars?.some(
    (user: { user: string }) => user.user === usersSlice.currentUser.user._id
  );

  // console.log(message);

  const addOrRemoveStarToMessageData = () => {
    if (getStarMessage) {
      removeStarToMessage(message?._id)
        .then((response) => {
          if (usersSlice.selectedUser.isGroup) {
            socket.emit("starGroupMessage", {
              groupId: usersSlice.selectedUser.group._id,
            });
          } else {
            socket.emit("starMessage", { ...response.data });
          }
        })
        .catch((error) => {});
    } else {
      addStarToMessage(message?._id)
        .then((response) => {
          if (usersSlice.selectedUser.isGroup) {
            socket.emit("starGroupMessage", {
              groupId: usersSlice.selectedUser.group._id,
            });
          } else {
            socket.emit("starMessage", { ...response.data });
          }
        })
        .catch((error) => {});
    }
  };
  return (
    <>
      {/* Logout user */}
      {actionsSlice.successLogout.status &&
        ReactNativeAlert.alert("Logout", "Do you want to logout?", [
          {
            text: "Cancel",
            onPress: () => {
              dispatch(
                successLogoutActions({
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
                successLogoutActions({
                  status: false,
                  record: {},
                })
              );
              logoutUserData();
            },
          },
        ])}

      {/* Remove user from group */}
      {actionsSlice.successRemoveUserFromGroup.status &&
        ReactNativeAlert.alert(
          "Remove User From Group",
          `Do you want to remove ${actionsSlice.successRemoveUserFromGroup.record.user.name} from group?`,
          [
            {
              text: "Cancel",
              onPress: () => {
                dispatch(
                  successRemoveUserFromGroupActions({
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
                removeUserFromGroupData();
              },
            },
          ]
        )}

      {/* Make group admin */}
      {actionsSlice.successMakeGroupAdmin.status &&
        ReactNativeAlert.alert(
          "Group Admin",
          `Do you want to add ${actionsSlice.successMakeGroupAdmin?.record?.user?.name} as ${actionsSlice.successMakeGroupAdmin?.record?.group?.name} admin?`,
          [
            {
              text: "Cancel",
              onPress: () => {
                dispatch(
                  successMakeGroupAdminActions({
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
                assignGroupAdminData();
              },
            },
          ]
        )}

      <Dialog isVisible={isVisible} onBackdropPress={onBackdropPress}>
        {items.map(
          (
            item: {
              name: string;
              url: Href<string | object>;
              record?: {};
              tag?: string;
            },
            index: number
          ) => (
            <View key={index} style={styles.itemList}>
              <TouchableOpacity
                onPress={() => {
                  switch (item.tag) {
                    case "logout":
                      dispatch(
                        successLogoutActions({
                          status: true,
                          record: {},
                        })
                      );
                      break;

                    case "makeGroupAdmin":
                      dispatch(
                        successMakeGroupAdminActions({
                          status: true,
                          record: item.record,
                        })
                      );
                      break;

                    case "removeUserFromGroup":
                      dispatch(
                        successRemoveUserFromGroupActions({
                          status: true,
                          record: item.record,
                        })
                      );
                      break;

                    case "viewGroupUser":
                      dispatch(
                        successViewGroupUserActions({
                          status: true,
                          record: item.record,
                        })
                      );
                      router.navigate(item.url);
                      break;

                    case "storyFeedPhotoAndVideo":
                      dispatch(
                        successAddStoryFeedActions({
                          status: true,
                          record: { text: false, imageOrVideo: true },
                        })
                      );
                      router.navigate(item.url);
                      break;

                    case "storyFeedText":
                      dispatch(
                        successAddStoryFeedActions({
                          status: true,
                          record: { text: true, imageOrVideo: false },
                        })
                      );
                      router.navigate(item.url);
                      break;

                    case "messageStar":
                      addOrRemoveStarToMessageData();
                      break;

                    default:
                      router.navigate(item.url);
                      break;
                  }

                  onBackdropPress();
                }}
              >
                <Text>{item.name}</Text>
              </TouchableOpacity>
            </View>
          )
        )}
      </Dialog>
    </>
  );
}

const styles = StyleSheet.create({
  itemList: {
    marginBottom: 20,
  },
  picker: {
    borderWidth: 1,
  },
  field: {
    marginBottom: 24,
  },
  lastChild: {
    marginBottom: 0,
  },
  label: {
    display: "flex", // 'flex' is used instead of 'block' in React Native
    marginBottom: 5,
  },
  error: {
    display: "flex", // 'flex' is used instead of 'block' in React Native
    width: "100%",
    marginTop: 4, // 0.25rem in CSS is equivalent to 4 in React Native (assuming 1rem = 16px)
    fontSize: 14, // 0.875em in CSS is approximately 14px
    color: "red", // Replace `$danger` with the actual color value
  },
});
