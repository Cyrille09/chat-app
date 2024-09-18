import { useEffect, useState } from "react";

import {
  SafeAreaView,
  Text,
  ScrollView,
  View,
  TouchableOpacity,
} from "react-native";

import {
  getBlockUserContacts,
  getRequestUserContact,
  getUserContacts,
} from "@/src/services/userContactsServices";
import { Formik } from "formik";
import tabsStyles from "@/src/app/tabsStyles";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/src/redux-toolkit/store";
import { ReactNativeElementsButton } from "@/src/components/reactNativeElements/ReactNativeElements";
import { successAddNewUsersActions } from "@/src/redux-toolkit/reducers/actionsSlice";
import { format, isThisWeek, isToday, isYesterday, parseISO } from "date-fns";
import { Icon, Image, SearchBar } from "@rneui/themed";
import {
  blockUserContactRecord,
  userContactStoryFeedsRecord,
} from "@/src/redux-toolkit/reducers/userContactsSlice";
import { router } from "expo-router";
import {
  getGroupMessages,
  getSenderAndReceiverMessages,
} from "@/src/services/messagesServices";
import { getGroupMmebers } from "@/src/services/groupsServices";
import {
  chatGroupMembersRecord,
  chatMessagesRecord,
} from "@/src/redux-toolkit/reducers/chatMessageSlice";
import { selectedUserRecord } from "@/src/redux-toolkit/reducers/usersSlice";
import { socket } from "@/src/components/websocket/websocket";
import { UserInterfaceInfo } from "@/src/components/globalTypes/GlobalTypes";
import { getUserProfile } from "@/src/services/usersServices";
import { getContactUserStoryFeeds } from "@/src/services/storyFeedsServices";
import ChatListActions from "@/src/components/chatList/ChatListActions";

export default function HomeScreen() {
  const usersSlice = useSelector((state: RootState) => state.usersSlice);
  const userContactsSlice = useSelector(
    (state: RootState) => state.userContactsSlice
  );

  const [chatListTag, setChatListTag] = useState<string>("all");
  const dispatch = useDispatch();
  const [userRecord, setUserRecord] = useState(usersSlice.currentUser.user);

  const [userContactsRecord, setUserContactsRecord] = useState<[]>(
    userContactsSlice.userContacts
  );

  const [requestUserContactRecord, setRequestUserContactRecord] = useState<[]>(
    []
  );

  const currentUser = usersSlice.currentUser.user;

  useEffect(() => {
    let isSubscribed = true;

    // user
    socket.on("user", (response: any) => {
      if (isSubscribed && response._id === userRecord._id) getCurrentUserData();
    });
    socket.on("updateUser", (response: any) => {
      if (isSubscribed && response._id === userRecord._id) getCurrentUserData();
      if (
        userContactsRecord?.find(
          (user: { user: { _id: string } }) => user.user._id === response._id
        )
      ) {
        getContactUserData();
        getRequestUserContactData();
      }
    });

    const getCurrentUserData = async () => {
      getUserProfile()
        .then((response) => {
          if (isSubscribed) {
            setUserRecord(response.data.user);
          }
        })
        .catch((error) => {});
    };

    // contact user
    socket.on("contactUser", (response: any) => {
      if (isSubscribed && response._id === userRecord._id) {
        getContactUserData();
        getRequestUserContactData();
      }
    });
    socket.on("updateContactUser", (response: any) => {
      // to be reviewd
      if (isSubscribed && response._id === userRecord._id) {
        getContactUserData();
        getRequestUserContactData();
      }
    });
    socket.on("deleteContactUser", (response: any) => {
      if (isSubscribed && response._id === userRecord._id) {
        getContactUserData();
        getRequestUserContactData();
      }
    });

    socket.on("group", (response: any) => {
      if (
        isSubscribed &&
        response
          .map((user: { value: string }) => user.value)
          .includes(userRecord._id)
      ) {
        getContactUserData();
        getRequestUserContactData();
      }
    });

    socket.on("exitGroup", (response: any) => {
      if (isSubscribed && response._id === userRecord._id) {
        getContactUserData();
        getRequestUserContactData();
      } else if (response.groupId === usersSlice.selectedUser?.group?._id) {
        getGroupMmebersData();
      }
    });

    socket.on("updateGroup", (response: any) => {
      if (
        isSubscribed &&
        response
          .map((user: { value: string }) => user.value)
          .includes(userRecord._id)
      ) {
        getContactUserData();
        getRequestUserContactData();
      }
    });

    socket.on("addGroupMember", (response: any) => {
      if (
        isSubscribed &&
        (response?.groupUsers
          .map((user: { value: string }) => user.value)
          .includes(userRecord._id) ||
          response.groupId === usersSlice.selectedUser?.group?._id)
      ) {
        getContactUserData();
        getRequestUserContactData();
      }
    });

    socket.on("updateGroupMember", (response: any) => {
      if (
        isSubscribed &&
        response._id === usersSlice.selectedUser?.group?._id
      ) {
        getGroupMmebersData();
      }
    });

    socket.on("muteGroupMessage", (response: any) => {
      if (
        isSubscribed &&
        response._id === userRecord._id &&
        response.groupId === usersSlice.selectedUser?.group?._id
      ) {
        getContactUserData();
        dispatch(
          selectedUserRecord({
            ...usersSlice.selectedUser,
            muteDate: response.muteDate,
          })
        );
      }
    });

    socket.on("removeUserFromGroup", (response: any) => {
      if (
        isSubscribed &&
        response.group._id === usersSlice.selectedUser?.group?._id &&
        response.user._id !== userRecord._id
      ) {
        getGroupMmebersData();
      }

      if (
        isSubscribed &&
        response.group._id === usersSlice.selectedUser?.group?._id &&
        response.user._id === userRecord._id
      ) {
        dispatch(
          selectedUserRecord({
            ...UserInterfaceInfo,
          })
        );
        getContactUserData();
        getRequestUserContactData();
      }
    });

    // send message
    socket.on("message", (response: any) => {
      if (
        isSubscribed &&
        (response.currentUser._id === userRecord._id ||
          response.secondUser._id === userRecord._id)
      ) {
        getContactUserData();
      }
    });

    // send group message
    socket.on("messageGroup", (response: any) => {
      if (
        isSubscribed &&
        userContactsRecord?.find(
          (userContact: { group: { _id: string } }) =>
            userContact?.group?._id === response.groupId
        )
      ) {
        getContactUserData();
      }
    });

    socket.on("updateMessage", (response: any) => {
      if (
        isSubscribed &&
        (response.sender === userRecord._id ||
          response.receiver === userRecord._id)
      ) {
        getContactUserData();
      }
    });
    socket.on("deleteMessage", (response: any) => {
      if (
        isSubscribed &&
        (response.sender === userRecord._id ||
          response.receiver === userRecord._id)
      ) {
        getContactUserData();
      }
    });

    socket.on("storyFeed", (response: any) => {
      if (
        isSubscribed &&
        (response.user._id === currentUser._id ||
          userContactsSlice.userContacts.find(
            (contactUser: { user: { _id: string } }) =>
              contactUser.user._id === response.user._id
          ))
      ) {
        getContactUserStoryFeedsData();
      }
    });

    const getContactUserData = async () => {
      getUserContacts("")
        .then((response) => {
          if (isSubscribed) {
            setUserContactsRecord(response.data.users);
          }
        })
        .catch((error) => {});
    };

    const getRequestUserContactData = async () => {
      getRequestUserContact("")
        .then((response) => {
          if (isSubscribed) {
            setRequestUserContactRecord(response.data);
          }
        })
        .catch((error) => {});
    };

    const getGroupMmebersData = async () => {
      const chatGroupMembers = await getGroupMmebers(
        usersSlice.selectedUser?.group?._id
      );

      if (chatGroupMembers?.data?.length) {
        dispatch(chatGroupMembersRecord(chatGroupMembers.data));
      } else {
        dispatch(chatGroupMembersRecord([]));
      }
    };

    const getContactUserStoryFeedsData = async () => {
      getContactUserStoryFeeds()
        .then((response) => {
          if (isSubscribed)
            dispatch(userContactStoryFeedsRecord(response.data));
        })
        .catch((error) => {});
    };

    getContactUserData();

    return () => {
      isSubscribed = false;

      socket.off("removeUserFromGroup", (response: any) => {
        if (
          isSubscribed &&
          response.group._id === usersSlice.selectedUser?.group?._id &&
          response.user._id !== userRecord._id
        ) {
          getGroupMmebersData();
        }

        if (
          isSubscribed &&
          response.group._id === usersSlice.selectedUser?.group?._id &&
          response.user._id === userRecord._id
        ) {
          dispatch(
            selectedUserRecord({
              ...UserInterfaceInfo,
            })
          );
          getContactUserData();
          getRequestUserContactData();
        }
      });
      // user
      socket.off("user", (response: any) => {
        if (isSubscribed && response._id === userRecord._id)
          getCurrentUserData();
      });
      socket.off("updateUser", (response: any) => {
        if (isSubscribed && response._id === userRecord._id)
          getCurrentUserData();
        if (
          userContactsRecord?.find(
            (user: { user: { _id: string } }) => user.user._id === response._id
          )
        ) {
          getContactUserData();
          getRequestUserContactData();
        }
      });

      // contact user
      socket.off("contactUser", (response: any) => {
        if (isSubscribed && response._id === userRecord._id) {
          getContactUserData();
          getRequestUserContactData();
        }
      });
      socket.off("updateContactUser", (response: any) => {
        // to be reviewd
        if (isSubscribed && response._id === userRecord._id) {
          getContactUserData();
          getRequestUserContactData();
        }
      });
      socket.off("deleteContactUser", (response: any) => {
        if (isSubscribed && response._id === userRecord._id) {
          getContactUserData();
          getRequestUserContactData();
        }
      });

      // send message
      socket.off("message", (response: any) => {
        if (
          isSubscribed &&
          (response.currentUser._id === userRecord._id ||
            response.secondUser._id === userRecord._id)
        ) {
          getContactUserData();
        }
      });
      socket.off("updateMessage", (response: any) => {
        if (
          isSubscribed &&
          (response.sender === userRecord._id ||
            response.receiver === userRecord._id)
        ) {
          getContactUserData();
        }
      });
      socket.off("deleteMessage", (response: any) => {
        if (
          isSubscribed &&
          (response.sender === userRecord._id ||
            response.receiver === userRecord._id)
        ) {
          getContactUserData();
        }
      });
      socket.off("group", (response: any) => {
        if (
          isSubscribed &&
          response
            .map((user: { value: string }) => user.value)
            .includes(userRecord._id)
        ) {
          getContactUserData();
          getRequestUserContactData();
        }
      });

      socket.off("exitGroup", (response: any) => {
        if (isSubscribed && response._id === userRecord._id) {
          getContactUserData();
          getRequestUserContactData();
        } else if (response.groupId === usersSlice.selectedUser?.group?._id) {
          getGroupMmebersData();
        }
      });
      socket.off("updateGroup", (response: any) => {
        if (
          isSubscribed &&
          response
            .map((user: { value: string }) => user.value)
            .includes(userRecord._id)
        ) {
          getContactUserData();
          getRequestUserContactData();
        }
      });
      socket.off("addGroupMember", (response: any) => {
        if (
          isSubscribed &&
          (response?.groupUsers
            .map((user: { value: string }) => user.value)
            .includes(userRecord._id) ||
            response.groupId === usersSlice.selectedUser?.group?._id)
        ) {
          getContactUserData();
          getRequestUserContactData();
        }
      });

      socket.off("updateGroupMember", (response: any) => {
        if (
          isSubscribed &&
          response._id === usersSlice.selectedUser?.group?._id
        ) {
          getGroupMmebersData();
        }
      });

      socket.off("storyFeed", (response: any) => {
        if (
          isSubscribed &&
          (response.user._id === currentUser._id ||
            userContactsSlice.userContacts.find(
              (contactUser: { user: { _id: string } }) =>
                contactUser.user._id === response.user._id
            ))
        ) {
          getContactUserStoryFeedsData();
        }
      });
    };
  }, [currentUser._id, dispatch, userRecord._id, usersSlice.selectedUser]);

  const TagButton = ({
    name,
    tagActive,
    onClick,
  }: {
    name: string;
    tagActive: any;
    onClick: any;
  }) => {
    return (
      <ReactNativeElementsButton
        title={name}
        onPress={onClick}
        color={tagActive ? "success" : "primary"}
        borderRadius={50}
      />
    );
  };

  const handleSelect = async (chat: any) => {
    let chatMessages: any = null;

    if (chat.isGroup) {
      chatMessages = await getGroupMessages(chat.group._id);
      const chatGroupMembers = await getGroupMmebers(chat.group._id);

      if (chatGroupMembers?.data?.length) {
        dispatch(chatGroupMembersRecord(chatGroupMembers.data));
      } else {
        dispatch(chatGroupMembersRecord([]));
      }
    } else {
      chatMessages = await getSenderAndReceiverMessages(chat.user);
      const blockUserContact = await getBlockUserContacts(chat.user._id);
      if (blockUserContact.data) {
        dispatch(
          blockUserContactRecord({ ...blockUserContact.data, status: true })
        );
      } else {
        dispatch(
          blockUserContactRecord({ user: "", blockUser: "", status: false })
        );
      }
    }

    if (chatMessages?.data?.messages.length)
      dispatch(
        chatMessagesRecord({
          messages: chatMessages.data.messages,
          groupedMessages: chatMessages.data.groupedMessages,
        })
      );
    else dispatch(chatMessagesRecord({ messages: [], groupedMessages: [] }));

    dispatch(
      selectedUserRecord({
        ...UserInterfaceInfo,
      })
    );

    dispatch(selectedUserRecord({ ...chat, status: true }));
    socket.emit("contactUser", usersSlice.currentUser.user);
    router.navigate("/(screens)/chatArea/chat-area");
    // router.navigate("/screens/userSelected/user-selected-info");
  };

  const userContactsWithLatestChatList: any = userContactsSlice.userContacts;

  return (
    <>
      <ChatListActions
        user={usersSlice.currentUser}
        requestUserContactRecord={requestUserContactRecord}
        userRecord={userRecord}
        // userContactsRecord={userContactsRecord}
      />
      <SafeAreaView style={tabsStyles.chatList}>
        <ScrollView>
          <Formik initialValues={{ name: "" }} onSubmit={() => {}}>
            {({ values, setFieldValue }) => {
              const showUserContactsWithLatestChatList: any =
                userContactsWithLatestChatList
                  ?.filter(
                    (user: {
                      messageUnreadCount: number;
                      isGroup: boolean;
                      user: { name: string };
                      group: { name: string };
                    }) => {
                      const search = values.name
                        ? ((user.isGroup && user.group.name) || user.user.name)
                            .toLowerCase()
                            .includes(values.name.toLowerCase())
                        : user;

                      let filterByUnreadAndGroups: any = user;

                      if (chatListTag === "unread") {
                        filterByUnreadAndGroups =
                          user.messageUnreadCount > 0 && user;
                      }

                      if (chatListTag === "groups") {
                        filterByUnreadAndGroups = user.isGroup;
                      }

                      return search && filterByUnreadAndGroups;
                    }
                  )
                  ?.sort((a: any, b: any) => {
                    const dateA = new Date(a?.updatedAt || 0).getTime();
                    const dateB = new Date(b?.updatedAt || 0).getTime();
                    return dateB - dateA;
                  })
                  ?.map((chat: any) => {
                    let muteDate = false;

                    if (chat.muteDate) {
                      muteDate =
                        format(new Date(chat.muteDate), "yyyy-MM-dd HH:mm:ss") >
                        format(new Date(), "yyyy-MM-dd HH:mm:ss");
                    }

                    const findClearChat =
                      chat?.latestMessage?.deleteMessage?.find(
                        (user: any) => user.user === chat.user._id
                      );

                    const latestMessageTimeDateCreated = (createdAt: any) => {
                      const date = parseISO(createdAt);
                      if (isToday(date)) {
                        return `Today`;
                      } else if (isYesterday(date)) {
                        return `Yesterday`;
                      } else if (isThisWeek(date)) {
                        return `${format(date, "EEEE")}`;
                      } else {
                        return `${format(date, "dd/MM/yyyy")}`;
                      }
                    };

                    const latestMessageTime =
                      chat.latestMessage && !findClearChat
                        ? latestMessageTimeDateCreated(
                            chat.latestMessage.createdAt
                          )
                        : "";

                    const groupLatestMessageTime = chat.group?.latestMessage
                      ? latestMessageTimeDateCreated(
                          chat.group.latestMessage.createdAt
                        )
                      : "";

                    const muteNotification = muteDate ? (
                      <Icon
                        type="ionicons"
                        name="volume-off"
                        size={18}
                        color="#555"
                      />
                    ) : null;

                    let latestMessage =
                      chat.user.message.length > 30
                        ? `${chat.user.message.substring(0, 30)}...`
                        : chat.user.message;

                    if (chat.isGroup) {
                      latestMessage = "";
                    }

                    if (chat.latestMessage && !findClearChat && !chat.isGroup) {
                      if (chat.latestMessage.type === "image") {
                        latestMessage = (
                          <Text>
                            <Icon type="font-awesome" name="camera" size={16} />{" "}
                            Photo
                          </Text>
                        );
                      } else if (chat.latestMessage.type === "document") {
                        latestMessage = (
                          <Text>
                            <Icon type="font-awesome" name="file" size={16} />{" "}
                            File
                          </Text>
                        );
                      } else if (chat.latestMessage.type === "audio") {
                        latestMessage = (
                          <Text>
                            <Icon
                              type="font-awesome"
                              name="microphone"
                              size={16}
                            />{" "}
                            Audio
                          </Text>
                        );
                      } else {
                        latestMessage =
                          chat.latestMessage.message.length > 20
                            ? `${chat.latestMessage.message.substring(
                                0,
                                20
                              )}...`
                            : chat.latestMessage.message;
                      }
                    }
                    if (chat?.group?.latestMessage && chat.isGroup) {
                      if (chat.group.latestMessage.type === "image") {
                        latestMessage = (
                          <Text>
                            <Icon type="font-awesome" name="camera" size={16} />{" "}
                            Photo
                          </Text>
                        );
                      } else if (chat.group.latestMessage.type === "document") {
                        latestMessage = (
                          <Text>
                            <Icon type="font-awesome" name="file" size={16} />{" "}
                            File
                          </Text>
                        );
                      } else if (chat.group.latestMessage.type === "audio") {
                        latestMessage = (
                          <Text>
                            <Icon
                              type="font-awesome"
                              name="microphone"
                              size={16}
                            />{" "}
                            Audio
                          </Text>
                        );
                      } else {
                        latestMessage = chat.group.latestMessage.message;
                      }
                    }

                    let groupUserSender = "";

                    if (chat?.group?.latestMessage?.sender && chat.isGroup) {
                      groupUserSender =
                        chat?.group?.latestMessage?.sender._id ===
                        usersSlice.currentUser.user._id
                          ? `You:`
                          : `${
                              chat?.group?.latestMessage?.sender.name.split(
                                " "
                              )[0]
                            }:`;

                      if (chat.group.latestMessage.type === "text") {
                        const groupSenderAndMessage = `${groupUserSender}  ${latestMessage}`;

                        latestMessage =
                          groupSenderAndMessage.length > 20
                            ? `${groupSenderAndMessage.substring(0, 20)}...`
                            : groupSenderAndMessage;
                      }
                    }

                    const setProfileImage = chat.isGroup ? (
                      chat.group.photoUrl ? (
                        <Image
                          containerStyle={tabsStyles.profileImage}
                          source={{
                            uri: `${process.env.EXPO_PUBLIC_BASE_URL}/images/groups/${chat.group.photoUrl}`,
                          }}
                          alt="image"
                        />
                      ) : (
                        <View style={tabsStyles.chatListItemUserNoImage}>
                          <Text style={tabsStyles.chatListItemUserNoImageText}>
                            {chat.group.name
                              .split(" ")
                              .map((data: any) => data.charAt(0))
                              .slice(0, 2)
                              .join("")}
                          </Text>
                        </View>
                      )
                    ) : chat.user.photoUrl ? (
                      <Image
                        containerStyle={tabsStyles.profileImage}
                        source={{
                          uri: `${process.env.EXPO_PUBLIC_BASE_URL}/images/profile/${chat.user.photoUrl}`,
                        }}
                        alt="image"
                      />
                    ) : (
                      <View style={tabsStyles.chatListItemUserNoImage}>
                        <Text style={tabsStyles.chatListItemUserNoImageText}>
                          {chat.user?.name
                            .split(" ")
                            .map((data: any) => data.charAt(0))
                            .slice(0, 2)
                            .join("")}
                        </Text>
                      </View>
                    );

                    return (
                      <TouchableOpacity
                        style={[
                          tabsStyles.chatListItem,
                          usersSlice.selectedUser._id === chat._id &&
                            tabsStyles.activeList,
                        ]}
                        key={chat._id}
                        onPress={() => handleSelect(chat)}
                      >
                        <View style={tabsStyles.chatListitemUserMessage}>
                          {setProfileImage}

                          <View style={tabsStyles.chatListItemTexts}>
                            <Text style={tabsStyles.chatListItemText}>
                              {chat.isGroup ? chat.group.name : chat.user.name}
                              {"\n"}
                              {chat.isGroup ? (
                                <Text style={tabsStyles.chatListItemTextP}>
                                  {chat.group?.latestMessage?.type ===
                                  "text" ? (
                                    latestMessage
                                  ) : (
                                    <Text>
                                      {groupUserSender} {latestMessage}
                                    </Text>
                                  )}
                                </Text>
                              ) : (
                                <Text style={tabsStyles.chatListItemTextP}>
                                  {latestMessage}
                                </Text>
                              )}
                            </Text>
                          </View>
                        </View>
                        <View style={tabsStyles.chatListitemStatus}>
                          <Text>
                            <Text
                              style={[
                                tabsStyles.chatListDate,
                                chat.messageUnreadCount > 0 &&
                                  tabsStyles.unreadDate,
                              ]}
                            >
                              {chat.isGroup
                                ? groupLatestMessageTime
                                : latestMessageTime}
                            </Text>
                            {"\n"}
                            <Text>
                              <View style={tabsStyles.groupAdminAction}>
                                <View>{muteNotification}</View>
                                <View>
                                  {chat.messageUnreadCount > 0 && (
                                    <View>
                                      <Text style={tabsStyles.numberOfUnread}>
                                        {chat.messageUnreadCount > 99
                                          ? "99+"
                                          : chat.messageUnreadCount}
                                      </Text>
                                    </View>
                                  )}
                                </View>
                              </View>
                            </Text>
                          </Text>
                        </View>
                      </TouchableOpacity>
                    );
                  });

              const chatListNoContent = () => {
                if (chatListTag === "all") {
                  return (
                    <>
                      <Text>No user contact</Text>
                      <ReactNativeElementsButton
                        title="Add user contact"
                        color="success"
                        size="sm"
                        onPress={() =>
                          dispatch(
                            successAddNewUsersActions({
                              status: true,
                              record: {},
                            })
                          )
                        }
                      />
                    </>
                  );
                }
                if (chatListTag === "unread") {
                  return (
                    <>
                      <Text>No unread chats</Text>

                      <ReactNativeElementsButton
                        title="View all chats"
                        color="success"
                        size="sm"
                        onPress={() => setChatListTag("all")}
                      />
                    </>
                  );
                }
                if (chatListTag === "groups") {
                  return (
                    <>
                      <Text>No groups chats</Text>
                      <ReactNativeElementsButton
                        title="View all chats"
                        color="success"
                        size="sm"
                        onPress={() => setChatListTag("all")}
                      />
                    </>
                  );
                }
              };

              return (
                <>
                  <View>
                    <View style={tabsStyles.chatListTop}>
                      <View style={tabsStyles.messageStatus}>
                        <View style={tabsStyles.searchBar}>
                          <SearchBar
                            placeholder="Search"
                            onChangeText={(value) =>
                              setFieldValue("name", value)
                            }
                            value={values.name}
                            containerStyle={{
                              backgroundColor: "transparent",
                              borderColor: "transparent",
                            }}
                            inputContainerStyle={{
                              backgroundColor: "#d1d5db",
                            }}
                            inputStyle={{ color: "black" }}
                          />
                        </View>
                        <View style={tabsStyles.flexRowWrap}>
                          <View style={tabsStyles.filterGroup}>
                            <TagButton
                              name="All"
                              tagActive={chatListTag === "all" ? true : false}
                              onClick={() => {
                                setChatListTag("all");
                              }}
                            />
                          </View>
                          <View style={tabsStyles.filterGroup}>
                            <TagButton
                              name="Unread"
                              tagActive={
                                chatListTag === "unread" ? true : false
                              }
                              onClick={() => {
                                setChatListTag("unread");
                              }}
                            />
                          </View>
                          <View>
                            <TagButton
                              name="Groups"
                              tagActive={
                                chatListTag === "groups" ? true : false
                              }
                              onClick={() => {
                                setChatListTag("groups");
                              }}
                            />
                          </View>
                        </View>
                      </View>
                    </View>
                    <View>
                      <View style={tabsStyles.chatListContent}>
                        {showUserContactsWithLatestChatList?.length ? (
                          showUserContactsWithLatestChatList
                        ) : (
                          <View style={tabsStyles.chatListNoContent}>
                            {chatListNoContent()}
                          </View>
                        )}
                      </View>
                    </View>
                  </View>
                </>
              );
            }}
          </Formik>
        </ScrollView>
      </SafeAreaView>
    </>
  );
}
