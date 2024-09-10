import { RootState } from "@/src/redux-toolkit/store";
import {
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  Alert as ReactNativeAlert,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { Icon, Image } from "@rneui/themed";
import {
  errorPopupActions,
  hideActions,
  isLoadingActions,
  successBlockUserActions,
  successClearChatActions,
  successDeleteUserActions,
  successDisappearMessageActions,
  successMediaActions,
  successMuteNotificationActions,
  successStarMessageActions,
  successUnmuteNotificationActions,
} from "@/src/redux-toolkit/reducers/actionsSlice";
import { BoxShadowCard } from "@/src/components/cards/BoxShadowCard";
import { useEffect, useState } from "react";
import { format } from "date-fns";
import styles from "./userSelected";
import { Divider } from "@rneui/base";
import { socket } from "@/src/components/websocket/websocket";
import { selectedUserRecord } from "@/src/redux-toolkit/reducers/usersSlice";
import { UserInterfaceInfo } from "@/src/components/globalTypes/GlobalTypes";
import { getUser } from "@/src/services/usersServices";
import { getSenderAndReceiverMessages } from "@/src/services/messagesServices";
import { chatMessagesRecord } from "@/src/redux-toolkit/reducers/chatMessageSlice";
import { router } from "expo-router";
import { ReactNativeDialog } from "@/src/components/dialog/Dialog";
import {
  exitFromGroupContact,
  muteGroupContact,
  updateGroup,
} from "@/src/services/groupsServices";
import { ACTIONS_ERROR_MESSAGE } from "@/src/constants/globalText";
import {
  blockUserContact,
  clearUserContactChat,
  deleteContactUser,
  disappearContactUserMessage,
  muteUserContact,
} from "@/src/services/userContactsServices";
import { blockUserContactRecord } from "@/src/redux-toolkit/reducers/userContactsSlice";

const UserSelectedInfo = () => {
  const actionsSlice = useSelector((state: RootState) => state.actionsSlice);
  const usersSlice = useSelector((state: RootState) => state.usersSlice);
  const chatMessageSlice = useSelector(
    (state: RootState) => state.chatMessageSlice
  );
  const userContactsSlice = useSelector(
    (state: RootState) => state.userContactsSlice
  );
  const selectedUser = usersSlice.selectedUser;
  const userRecord = usersSlice.currentUser.user;

  const [memberId, setMemberId] = useState("");
  const dispatch = useDispatch();

  const [visible5, setVisible] = useState(false);

  const toggleDialog = () => {
    setVisible(!visible5);
  };

  useEffect(() => {
    let isSubscribed = true;

    // user
    socket.on("updateUser", (response: { _id: string }) => {
      if (isSubscribed && response._id === selectedUser.user._id) {
        getUserData();
      }
    });

    // contact user
    socket.on("updateContactUser", (response: any) => {
      if (
        isSubscribed &&
        response._id === userRecord._id &&
        response.updatedType === "mute"
      ) {
        dispatch(
          selectedUserRecord({
            ...selectedUser,
            muteDate: response.receiverInfo.muteDate,
          })
        );
      }

      if (
        isSubscribed &&
        response._id === userRecord._id &&
        response.updatedType === "block"
      ) {
        dispatch(
          selectedUserRecord({
            ...selectedUser,
            blockStatus: response.receiverInfo.blockStatus,
          })
        );
      }

      if (
        isSubscribed &&
        response._id === userRecord._id &&
        response.updatedType === "clearChat"
      ) {
        getSenderAndReceiverMessagesData(response.receiverInfo);
      }
    });

    socket.on("deleteContactUser", (response: { _id: string }) => {
      if (isSubscribed && response._id === userRecord._id) {
        dispatch(
          selectedUserRecord({
            ...UserInterfaceInfo,
          })
        );
      }
    });

    socket.on("exitGroup", (response: { _id: string }) => {
      if (isSubscribed && response._id === userRecord._id) {
        dispatch(
          selectedUserRecord({
            ...UserInterfaceInfo,
          })
        );
      }
    });

    const getUserData = async () => {
      getUser(selectedUser.user._id, "")
        .then((response) => {
          if (isSubscribed) {
            dispatch(
              selectedUserRecord({
                ...selectedUser,
                user: response.data,
                status: true,
              })
            );
          }
        })
        .catch((error) => {});
    };

    const getSenderAndReceiverMessagesData = (user: {}) => {
      getSenderAndReceiverMessages(user)
        .then((response) => {
          if (response?.data?.length)
            dispatch(
              chatMessagesRecord({
                messages: response.data.messages,
                groupedMessages: response.data.groupedMessages,
              })
            );
          else
            dispatch(chatMessagesRecord({ messages: [], groupedMessages: [] }));
        })
        .catch((error) => {});
    };

    return () => {
      isSubscribed = false;

      // user
      socket.off("updateUser", (response: { _id: string }) => {
        if (isSubscribed && response._id === selectedUser.user._id)
          getUserData();
      });

      // contact user
      socket.off("updateContactUser", (response: any) => {
        if (
          isSubscribed &&
          response._id === userRecord._id &&
          response.updatedType === "mute"
        ) {
          dispatch(
            selectedUserRecord({
              ...selectedUser,
              muteDate: response.receiverInfo.muteDate,
            })
          );
        }

        if (
          isSubscribed &&
          response._id === userRecord._id &&
          response.updatedType === "block"
        ) {
          dispatch(
            selectedUserRecord({
              ...selectedUser,
              blockStatus: response.receiverInfo.blockStatus,
            })
          );
        }

        if (
          isSubscribed &&
          response._id === userRecord._id &&
          response.updatedType === "clearChat"
        ) {
          getSenderAndReceiverMessagesData(response.receiverInfo);
        }
      });

      socket.off("deleteContactUser", (response: { _id: string }) => {
        if (isSubscribed && response._id === userRecord._id) {
          dispatch(
            selectedUserRecord({
              ...UserInterfaceInfo,
            })
          );
        }
      });
      socket.off("exitGroup", (response: { _id: string }) => {
        if (isSubscribed && response._id === userRecord._id) {
          dispatch(
            selectedUserRecord({
              ...UserInterfaceInfo,
            })
          );
        }
      });
    };
  }, [
    dispatch,
    selectedUser,
    selectedUser.user._id,
    userRecord,
    usersSlice.selectedUser.user,
  ]);

  const getMediaLinksAndDocs = chatMessageSlice.chatMessages?.messages?.filter(
    (message: { type: string }) =>
      ["image", "link", "document", "video"].includes(message.type)
  );

  const handleIconClick = (memberId: string) => {
    setMemberId(memberId);
    toggleDialog();
  };

  const getMedia = chatMessageSlice.chatMessages?.messages
    .map((data) => data)
    .reverse()
    .filter((message: { type: string }) =>
      ["image", "video"].includes(message.type)
    )
    .slice(0, 3);

  let muteDate = false;

  if (usersSlice.selectedUser.muteDate) {
    muteDate =
      format(
        new Date(usersSlice.selectedUser.muteDate),
        "yyyy-MM-dd HH:mm:ss"
      ) > format(new Date(), "yyyy-MM-dd HH:mm:ss");
  }

  const setProfileImage = usersSlice.selectedUser.isGroup ? (
    usersSlice.selectedUser.group.photoUrl ? (
      <Image
        style={styles.profileImage}
        source={{
          uri: `${process.env.EXPO_PUBLIC_BASE_URL}/images/groups/${usersSlice.selectedUser.group.photoUrl}`,
        }}
      />
    ) : (
      <View style={styles.noImage}>
        <Text style={styles.userNoImageText}>
          {usersSlice.selectedUser.group.name
            .split(" ")
            .map((data) => data.charAt(0))
            .slice(0, 2)
            .join("")}
        </Text>
      </View>
    )
  ) : usersSlice.selectedUser.user.photoUrl ? (
    <Image
      style={styles.profileImage}
      source={{
        uri: `${process.env.EXPO_PUBLIC_BASE_URL}/images/profile/${usersSlice.selectedUser.user.photoUrl}`,
      }}
    />
  ) : (
    <View style={styles.noImage}>
      <Text style={styles.userNoImageText}>
        {usersSlice.selectedUser.user.name
          .split(" ")
          .map((data) => data.charAt(0))
          .slice(0, 2)
          .join("")}
      </Text>
    </View>
  );

  const getCurrentGroupMember: any = chatMessageSlice.chatGroupMembers.find(
    (member: { user: { _id: string } }) =>
      member.user._id === usersSlice.currentUser.user._id
  );

  const getUpToFiveAdmin = chatMessageSlice.chatGroupMembers.filter(
    (member: { admin: boolean }) => member.admin
  );

  const starredMessages = chatMessageSlice.chatMessages.messages?.filter(
    (startMessage: { stars: [] }) =>
      startMessage.stars?.find(
        (star: { user: {} }) => star.user === usersSlice.currentUser.user._id
      )
  );

  const iconSize = 15;

  const blockUserContactData = () => {
    if (
      userContactsSlice.blockUserContact.status &&
      userContactsSlice.blockUserContact.user ===
        usersSlice.currentUser.user._id
    ) {
      return (
        <View style={styles.eachActionLeftIconInRed}>
          <Icon
            type="font-awesome"
            name="registered"
            color="red"
            style={styles.icon}
          />
          <Text style={styles.iconInRed}>Unblock user</Text>
        </View>
      );
    } else if (userContactsSlice.blockUserContact.status) {
      return (
        <View style={styles.eachActionLeftIconInRed}>
          <Icon
            type="font-awesome"
            name="registered"
            color="red"
            style={styles.icon}
            size={iconSize}
          />
          <Text style={styles.iconInRed}>Blocked</Text>
        </View>
      );
    } else {
      return (
        <View style={styles.eachActionLeftIconInRed}>
          <Icon
            type="font-awesome"
            name="ban"
            color="red"
            style={styles.icon}
            size={iconSize}
          />
          <Text style={styles.iconInRed}>Block user</Text>
        </View>
      );
    }
  };

  const muteUserContactDetail = async () => {
    dispatch(isLoadingActions(true));
    if (selectedUser.isGroup) {
      muteGroupContact(usersSlice.selectedUser._id, new Date())
        .then((response) => {
          socket.emit("muteGroupMessage", {
            ...userRecord,
            groupId: usersSlice.selectedUser.group._id,
            muteDate: new Date(),
          });
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
    } else {
      muteUserContact(usersSlice.selectedUser.user, new Date())
        .then((response) => {
          const receiverInfo = response?.data?.users.find(
            (user: { user: string }) =>
              user.user === usersSlice.selectedUser.user._id
          );
          socket.emit("updateContactUser", {
            ...userRecord,
            receiverInfo,
            updatedType: "mute",
          });
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
    }
  };

  const disappearMessageDetail = async () => {
    dispatch(isLoadingActions(true));

    if (usersSlice.selectedUser.isGroup) {
      updateGroup(
        {
          disappearIn: "",
          message: `${userRecord.name} has removed the disappear message.`,
        },
        usersSlice.selectedUser.group._id
      )
        .then((response) => {
          dispatch(hideActions());

          socket.emit("disappearGroupMessage", {
            group: response.data,
          });
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
        "",
        `${userRecord.name} has removed the disappear message.`
      )
        .then((response) => {
          dispatch(hideActions());
          const receiverInfo = response?.data?.users.find(
            (user: { user: string }) =>
              user.user === usersSlice.selectedUser.user._id
          );
          socket.emit("updateContactUser", {
            ...userRecord,
            receiverInfo,
            updatedType: "disappear",
          });
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

  const deleteContactUserDetail = async () => {
    dispatch(isLoadingActions(true));

    if (selectedUser.isGroup) {
      exitFromGroupContact(
        selectedUser._id,
        selectedUser.group._id,
        `${userRecord.name} left the group.`
      )
        .then((response) => {
          socket.emit("exitGroup", {
            ...userRecord,
            groupId: usersSlice.selectedUser.group._id,
          });

          socket.emit("messageGroup", {
            groupId: usersSlice.selectedUser.group._id,
          });

          dispatch(hideActions());
          router.navigate("/(tabs)/");
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
      deleteContactUser(selectedUser._id)
        .then((response) => {
          socket.emit("deleteContactUser", userRecord);

          dispatch(hideActions());
          router.navigate("/(tabs)/");
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

  const clearUserContactChatDetail = async () => {
    dispatch(isLoadingActions(true));
    clearUserContactChat(selectedUser.user)
      .then((response) => {
        const receiverInfo = response?.data.receiver;

        socket.emit("updateContactUser", {
          ...userRecord,
          receiverInfo,
          updatedType: "clearChat",
        });
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

  const blockUserContactDetail = async () => {
    dispatch(isLoadingActions(true));
    blockUserContact(
      selectedUser.user,
      !userContactsSlice.blockUserContact.status
    )
      .then((response) => {
        const receiverInfo = response?.data?.users.find(
          (user: { user: string }) =>
            user.user === usersSlice.selectedUser.user._id
        );

        socket.emit("updateContactUser", {
          ...userRecord,
          receiverInfo,
          updatedType: "block",
        });

        dispatch(
          blockUserContactRecord({
            ...userContactsSlice.blockUserContact,
            status: !userContactsSlice.blockUserContact.status,
          })
        );

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

  return (
    <View>
      <>
        {/* Unmute notification */}
        {actionsSlice.successUnmuteNotification.status &&
          ReactNativeAlert.alert(
            `Unmute ${
              usersSlice.selectedUser.isGroup
                ? `${usersSlice.selectedUser.group.name} group`
                : `${usersSlice.selectedUser.user.name}`
            }`,
            `Do you want to unmute ${
              usersSlice.selectedUser.isGroup
                ? `${usersSlice.selectedUser.group.name} group`
                : usersSlice.selectedUser.user.name
            }?`,
            [
              {
                text: "Cancel",

                onPress: () => {
                  dispatch(
                    successUnmuteNotificationActions({
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
                  muteUserContactDetail();
                },
              },
            ]
          )}

        {/* Remove disappear message */}
        {actionsSlice.successDisappearMessage.status &&
          ReactNativeAlert.alert(
            `Remove Disappear ${
              usersSlice.selectedUser.isGroup
                ? `${usersSlice.selectedUser.group.name} Group`
                : "User"
            } Mesaage`,
            `Do you want to remove Disappear message?`,
            [
              {
                text: "Cancel",

                onPress: () => {
                  dispatch(
                    successDisappearMessageActions({
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
                  disappearMessageDetail();
                },
              },
            ]
          )}

        {/* Delete contact user */}
        {actionsSlice.successDeleteUser.status &&
          ReactNativeAlert.alert(
            `${
              usersSlice.selectedUser.isGroup
                ? "Exit Group"
                : "Delete Contact User"
            }`,
            `${
              usersSlice.selectedUser.isGroup
                ? `Do you want to exit from ${usersSlice.selectedUser.group.name} group?`
                : ` Do you want to delete ${usersSlice.selectedUser.user.name} contact?`
            }`,
            [
              {
                text: "Cancel",

                onPress: () => {
                  dispatch(
                    successDeleteUserActions({ status: false, record: {} })
                  );
                },

                style: "cancel",
              },
              {
                text: "Yes",
                onPress: () => {
                  deleteContactUserDetail();
                },
              },
            ]
          )}

        {/* Clear chat */}
        {actionsSlice.successClearChat.status &&
          ReactNativeAlert.alert(
            `Clear Chat`,
            ` Do you want to clear ${usersSlice.selectedUser.user.name}?`,
            [
              {
                text: "Cancel",

                onPress: () => {
                  dispatch(
                    successClearChatActions({
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
                  clearUserContactChatDetail();
                },
              },
            ]
          )}

        {/* Block user */}
        {actionsSlice.successBlockUser.status &&
          ReactNativeAlert.alert(
            `${
              userContactsSlice.blockUserContact.status ? "Unblock" : "Block"
            } Contact User`,
            `  Do you want to ${
              userContactsSlice.blockUserContact.status ? "unblock" : "block"
            } ${usersSlice.selectedUser.user.name} contact?`,
            [
              {
                text: "Cancel",

                onPress: () => {
                  dispatch(
                    successBlockUserActions({
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
                  blockUserContactDetail();
                },
              },
            ]
          )}
      </>
      <ScrollView>
        {usersSlice.selectedUser.status ? (
          <View style={styles.contactInfo}>
            <View style={styles.contactContent}>
              <BoxShadowCard>
                <View style={styles.contactHeader}>
                  {setProfileImage}
                  <View>
                    <Text style={styles.contactName}>
                      {usersSlice.selectedUser.isGroup
                        ? usersSlice.selectedUser.group.name
                        : usersSlice.selectedUser.user.name}
                    </Text>
                  </View>
                  <View>
                    <Text style={styles.groupMembersText}>
                      {usersSlice.selectedUser.isGroup ? (
                        `Group: ${chatMessageSlice.chatGroupMembers.length} members`
                      ) : (
                        <Text>{usersSlice.selectedUser.user.email}</Text>
                      )}
                    </Text>
                  </View>
                </View>
              </BoxShadowCard>

              <BoxShadowCard>
                {usersSlice.selectedUser.isGroup ? (
                  <View style={styles.contactInfoAbout}>
                    <Text style={styles.sectionHeading}>Group description</Text>
                    <Text>
                      {usersSlice.selectedUser.group.description || "-"}
                    </Text>
                  </View>
                ) : (
                  <View style={styles.contactInfoAbout}>
                    <Text style={styles.sectionHeading}>About</Text>
                    <Text>{usersSlice.selectedUser.user.message}</Text>
                  </View>
                )}
              </BoxShadowCard>

              {usersSlice.selectedUser.isGroup && (
                <BoxShadowCard>
                  <View style={styles.contactInfoAbout}>
                    <View style={styles.contactInfoGroupMember}>
                      <View>
                        <Text>{`${chatMessageSlice.chatGroupMembers.length} group members`}</Text>
                      </View>
                      {getCurrentGroupMember?.admin && (
                        <Icon
                          type="font-awesome"
                          name="plus-square"
                          size={iconSize}
                          containerStyle={styles.contactInfoGroupMemberIcon}
                          onPress={() =>
                            router.navigate(
                              "/(screens)/chatList/add-group-members"
                            )
                          }
                        />
                      )}
                    </View>
                    {chatMessageSlice.chatGroupMembers.map(
                      (
                        member: {
                          user: {
                            photoUrl: string;
                            name: string;
                            message: string;
                            _id: string;
                          };
                          admin: boolean;
                        },
                        index: number
                      ) => (
                        <View key={index}>
                          <View style={styles.chatAreaTop}>
                            <View style={styles.user}>
                              {member.user.photoUrl ? (
                                <Image
                                  style={{ height: 50, width: 50 }}
                                  source={{
                                    uri: `${process.env.EXPO_PUBLIC_BASE_URL}/images/profile/${member.user.photoUrl}`,
                                  }}
                                  containerStyle={styles.userImage}
                                />
                              ) : (
                                <View style={styles.chatListItemUserNoImage}>
                                  <Text style={styles.noImageText}>
                                    {member.user.name
                                      .split(" ")
                                      .map((data) => data.charAt(0))
                                      .slice(0, 2)
                                      .join("")}
                                  </Text>
                                </View>
                              )}
                              <View style={styles.chatAreaTopTexts}>
                                <Text style={styles.chatAreaTopTextsName}>
                                  {member.user.name}
                                </Text>
                                <Text style={styles.chatAreaTopLastSeen}>
                                  {member.user.message}
                                </Text>
                              </View>
                            </View>

                            <View style={styles.groupAdminAction}>
                              <View>
                                <Text style={styles.groupAdmin}>
                                  {member.admin && <Text>Group admin</Text>}
                                </Text>
                              </View>
                              <View>
                                <Icon
                                  type="font-awesome"
                                  name="chevron-down"
                                  size={iconSize}
                                  containerStyle={
                                    styles.contactInfoGroupMemberIcon
                                  }
                                  onPress={() => {
                                    handleIconClick(member.user._id);
                                  }}
                                />

                                {member.user._id === memberId && (
                                  <ReactNativeDialog
                                    isVisible={visible5}
                                    onBackdropPress={toggleDialog}
                                    items={[
                                      {
                                        name: "Make group admin",
                                        url: "/(screens)/chatList/add-new-group",
                                        tag: "makeGroupAdmin",
                                        record: member,
                                      },
                                      {
                                        name: "Remove",
                                        url: "/(tabs)/settings",
                                        tag: "removeUserFromGroup",
                                        record: member,
                                      },
                                      {
                                        name: "View group user",
                                        url: "/(screens)/chatList/view-group-user-info",
                                        record: member,
                                        tag: "viewGroupUser",
                                      },
                                    ]}
                                  />
                                )}
                              </View>
                            </View>
                          </View>
                        </View>
                      )
                    )}
                  </View>
                </BoxShadowCard>
              )}

              <BoxShadowCard>
                <View style={styles.contactInfoMedia}>
                  <TouchableOpacity
                    style={styles.mediaHeader}
                    onPress={() =>
                      // dispatch(
                      //   successMediaActions({
                      //     status: true,
                      //     record: getMediaLinksAndDocs,
                      //   })
                      // )
                      router.navigate("/(screens)/chatList/media-links-docs")
                    }
                  >
                    <Text>Media, links and docs</Text>
                    <View style={styles.mediaCountContainer}>
                      <Text>{getMediaLinksAndDocs.length}</Text>
                      <Icon
                        type="font-awesome"
                        name="chevron-right"
                        size={iconSize}
                      />
                    </View>
                  </TouchableOpacity>
                  <View style={styles.mediaItems}>
                    {getMedia.map(
                      (message: { _id: string; message: string }) => (
                        <View key={message._id} style={styles.mediaItem}>
                          <Image
                            style={styles.mediaImage}
                            source={{
                              uri: `${process.env.EXPO_PUBLIC_BASE_URL}/images/messages/${message.message}`,
                            }}
                          />
                        </View>
                      )
                    )}
                  </View>
                </View>
              </BoxShadowCard>

              <BoxShadowCard>
                <View style={styles.contactInfoActions}>
                  <TouchableOpacity
                    style={styles.eachAction}
                    onPress={() =>
                      // dispatch(
                      //   successStarMessageActions({ status: true, record: {} })
                      // )
                      router.navigate("/chatList/star-messages")
                    }
                  >
                    <View style={styles.eachActionLeftIcon}>
                      <Icon
                        type="font-awesome"
                        name="star"
                        size={iconSize}
                        style={styles.icon}
                      />
                      <Text>Starred messages</Text>
                    </View>
                    <View style={styles.mediaCountContainer}>
                      {starredMessages.length && (
                        <Text>{starredMessages.length}</Text>
                      )}
                      <Icon
                        type="font-awesome"
                        name="chevron-right"
                        size={iconSize}
                      />
                    </View>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.eachAction}
                    onPress={() => {
                      if (muteDate) {
                        dispatch(
                          successUnmuteNotificationActions({
                            status: true,
                            record: {},
                          })
                        );
                      } else {
                        router.navigate(
                          "/(screens)/chatList/mute-notification"
                        );
                      }
                    }}
                  >
                    <View style={styles.eachActionLeftIcon}>
                      <Icon
                        type="font-awesome"
                        name="bell"
                        size={iconSize}
                        style={styles.icon}
                      />
                      {muteDate ? (
                        <>
                          <Text>
                            Muted {"\n"}
                            <Text style={styles.mutedDate}>
                              Until:{" "}
                              {format(
                                new Date(usersSlice.selectedUser.muteDate),
                                "dd-MM-yyyy HH:mm"
                              )}
                            </Text>
                          </Text>
                        </>
                      ) : (
                        <Text>Mute notification</Text>
                      )}
                    </View>
                    {muteDate ? (
                      <Icon
                        type="ionicons"
                        name="volume-off"
                        size={iconSize}
                        style={styles.icon}
                      />
                    ) : (
                      <Icon
                        type="font-awesome"
                        name="volume-up"
                        size={iconSize}
                      />
                    )}
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.eachAction}
                    onPress={() => {
                      if (usersSlice.selectedUser.group?.disappearIn) {
                        dispatch(
                          successDisappearMessageActions({
                            status: true,
                            record: {},
                          })
                        );
                      } else {
                        router.navigate(
                          "/(screens)/chatList/disappear-messages"
                        );
                      }
                    }}
                  >
                    <View style={styles.eachActionLeftIcon}>
                      {usersSlice.selectedUser.disappearIn ||
                      usersSlice.selectedUser.group?.disappearIn ? (
                        <Icon
                          type="font-awesome"
                          name="clock-o"
                          style={styles.icon}
                          size={iconSize}
                        />
                      ) : (
                        <Icon
                          type="font-awesome"
                          name="check-circle-o"
                          style={styles.icon}
                          size={iconSize}
                        />
                      )}
                      <Text>
                        {usersSlice.selectedUser.disappearIn ||
                        usersSlice.selectedUser.group?.disappearIn
                          ? "Remove disappear messages"
                          : "Disappear messages"}
                      </Text>
                    </View>
                    <Icon
                      type="font-awesome"
                      name="chevron-right"
                      size={iconSize}
                    />
                  </TouchableOpacity>

                  <Divider style={styles.separator} />

                  {!usersSlice.selectedUser.isGroup && (
                    <>
                      <TouchableOpacity
                        style={styles.eachActionInRed}
                        onPress={() => {
                          if (
                            (userContactsSlice.blockUserContact.status &&
                              userContactsSlice.blockUserContact.userBlock !==
                                usersSlice.currentUser.user._id) ||
                            !userContactsSlice.blockUserContact.status
                          ) {
                            dispatch(
                              successBlockUserActions({
                                status: true,
                                record: {},
                              })
                            );
                          }
                        }}
                      >
                        {blockUserContactData()}
                      </TouchableOpacity>

                      <TouchableOpacity
                        style={styles.eachActionInRed}
                        onPress={() =>
                          dispatch(
                            successClearChatActions({
                              status: true,
                              record: {},
                            })
                          )
                        }
                      >
                        <View style={styles.eachActionLeftIconInRed}>
                          <Icon
                            type="font-awesome"
                            name="remove"
                            color="red"
                            style={styles.icon}
                            size={iconSize}
                          />
                          <Text style={styles.iconInRed}>Clear chat</Text>
                        </View>
                      </TouchableOpacity>
                    </>
                  )}

                  <TouchableOpacity
                    style={styles.eachActionInRed}
                    onPress={() =>
                      dispatch(
                        successDeleteUserActions({ status: true, record: {} })
                      )
                    }
                  >
                    {usersSlice.selectedUser.isGroup ? (
                      <View style={styles.eachActionLeftIconInRed}>
                        <Icon
                          type="font-awesome"
                          name="trash"
                          color="red"
                          style={styles.icon}
                          size={iconSize}
                        />
                        <Text style={styles.iconInRed}>Exit group</Text>
                      </View>
                    ) : (
                      <View style={styles.eachActionLeftIconInRed}>
                        <Icon
                          type="font-awesome"
                          name="trash-o"
                          color="red"
                          size={iconSize}
                          style={styles.icon}
                        />
                        <Text style={styles.iconInRed}>Delete user</Text>
                      </View>
                    )}
                  </TouchableOpacity>
                </View>
              </BoxShadowCard>
            </View>
          </View>
        ) : null}
      </ScrollView>
    </View>
  );
};

export default UserSelectedInfo;
