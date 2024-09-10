import React, { useEffect, useRef } from "react";
import { View, ScrollView, TouchableOpacity } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { Icon } from "@rneui/themed";
import { RootState } from "@/src/redux-toolkit/store";
import ChatAreaCenterLevel from "./ChatAreaCenterLevel";
import styles from "./chatAreaStyles";
import ChatAreaBottomLevel from "./ChatAreaBottomLevel";
import ChatAreaActions from "./ChatAreaActions";
import { socket } from "@/src/components/websocket/websocket";
import { selectedUserRecord } from "@/src/redux-toolkit/reducers/usersSlice";
import {
  getGroupMessages,
  getSenderAndReceiverMessages,
} from "@/src/services/messagesServices";
import { chatMessagesRecord } from "@/src/redux-toolkit/reducers/chatMessageSlice";

const ChatArea = () => {
  const usersSlice = useSelector((state: RootState) => state.usersSlice);
  const userContactsSlice = useSelector(
    (state: RootState) => state.userContactsSlice
  );
  const chatMessageSlice = useSelector(
    (state: RootState) => state.chatMessageSlice
  );

  const chatListRef = useRef<ScrollView>(null);

  const userRecord = usersSlice.currentUser.user;
  const selectedUser = usersSlice.selectedUser;
  const dispatch = useDispatch();

  useEffect(() => {
    let isSubscribed = true;

    const scrollToBottom = () => {
      if (chatListRef.current) {
        chatListRef.current.scrollToEnd({ animated: true });
      }
    };

    socket.on(
      "message",
      (response: {
        secondUser: {};
        message: { receiver: string; sender: { _id: string } };
      }) => {
        scrollToBottom();
        const chatUser =
          userRecord._id === response.message.receiver
            ? response.message.sender
            : response.secondUser;

        if (
          isSubscribed &&
          (usersSlice.selectedUser.user._id === response.message.sender._id ||
            usersSlice.selectedUser.user._id === response.message.receiver)
        ) {
          getSenderAndReceiverMessagesData(chatUser);
        }
      }
    );

    socket.on("updateMessage", (response: { sender: {}; receiver: {} }) => {
      if (
        isSubscribed &&
        (usersSlice.selectedUser.user._id === response.sender ||
          usersSlice.selectedUser.user._id === response.receiver)
      ) {
        getSenderAndReceiverMessagesData(usersSlice.selectedUser.user);
      }
    });

    socket.on("starMessage", (response: { sender: {}; receiver: {} }) => {
      if (
        isSubscribed &&
        (usersSlice.selectedUser.user._id === response.sender ||
          usersSlice.selectedUser.user._id === response.receiver)
      ) {
        getSenderAndReceiverMessagesData(usersSlice.selectedUser.user);
      }
    });

    socket.on("starGroupMessage", (response: { groupId: string }) => {
      if (
        isSubscribed &&
        selectedUser.isGroup &&
        response.groupId === selectedUser.group._id
      ) {
        getSenderAndReceiverMessagesData("");
      }
    });

    socket.on("userStatus", (response) => {
      if (isSubscribed && response._id === selectedUser.user._id) {
        dispatch(
          selectedUserRecord({
            ...selectedUser,
            user: response,
            status: true,
          })
        );
      }
    });

    socket.on("messageGroup", (response: { groupId: string }) => {
      scrollToBottom();

      if (
        isSubscribed &&
        selectedUser.isGroup &&
        response.groupId === selectedUser.group._id
      ) {
        getSenderAndReceiverMessagesData("");
      }
    });

    socket.on("updateGroupMessage", (response: { groupId: string }) => {
      if (
        isSubscribed &&
        selectedUser.isGroup &&
        response.groupId === selectedUser.group._id
      ) {
        getSenderAndReceiverMessagesData("");
      }
    });

    socket.on(
      "disappearGroupMessage",
      async (response: { group: { _id: string } }) => {
        scrollToBottom();

        if (
          isSubscribed &&
          selectedUser.isGroup &&
          response.group._id === selectedUser.group._id
        ) {
          await getSenderAndReceiverMessagesData("");
          dispatch(
            selectedUserRecord({
              ...selectedUser,
              group: response.group,
            })
          );
        }
      }
    );

    socket.on(
      "updateContactUser",
      async (response: {
        updatedType: string;
        _id: string;
        receiverInfo: { user: {}; disappearIn: Date | number };
      }) => {
        scrollToBottom();

        if (
          isSubscribed &&
          response.updatedType === "disappear" &&
          (response._id === userRecord._id ||
            response.receiverInfo.user === userRecord._id)
        ) {
          await getSenderAndReceiverMessagesData(usersSlice.selectedUser.user);

          if (response._id === userRecord._id) {
            dispatch(
              selectedUserRecord({
                ...selectedUser,
                disappearIn: response.receiverInfo.disappearIn,
              })
            );
          }
        }
      }
    );

    const getSenderAndReceiverMessagesData = async (user: {}) => {
      if (selectedUser.isGroup) {
        const chatMessages = await getGroupMessages(selectedUser.group._id);
        if (isSubscribed) {
          if (chatMessages?.data?.messages.length) {
            dispatch(
              chatMessagesRecord({
                messages: chatMessages.data.messages,
                groupedMessages: chatMessages.data.groupedMessages,
              })
            );
          } else {
            dispatch(chatMessagesRecord({ messages: [], groupedMessages: [] }));
          }
        }
      } else {
        const chatMessages = await getSenderAndReceiverMessages(user);
        if (isSubscribed) {
          if (chatMessages?.data?.messages.length) {
            dispatch(
              chatMessagesRecord({
                messages: chatMessages.data.messages,
                groupedMessages: chatMessages.data.groupedMessages,
              })
            );
          } else {
            dispatch(chatMessagesRecord({ messages: [], groupedMessages: [] }));
          }
        }
      }
    };
    scrollToBottom();

    return () => {
      isSubscribed = false;
      socket.off(
        "message",
        (response: {
          secondUser: {};
          message: { receiver: string; sender: { _id: string } };
        }) => {
          scrollToBottom();
          const chatUser =
            userRecord._id === response.message.receiver
              ? response.message.sender
              : response.secondUser;

          if (
            isSubscribed &&
            (usersSlice.selectedUser.user._id === response.message.sender._id ||
              usersSlice.selectedUser.user._id === response.message.receiver)
          ) {
            getSenderAndReceiverMessagesData(chatUser);
          }
        }
      );

      socket.off("updateMessage", (response: { receiver: {}; sender: {} }) => {
        const chatUser =
          userRecord._id === response.receiver
            ? userRecord
            : usersSlice.selectedUser.user;

        if (
          isSubscribed &&
          (usersSlice.selectedUser.user._id === response.sender ||
            usersSlice.selectedUser.user._id === response.receiver)
        ) {
          getSenderAndReceiverMessagesData(chatUser);
        }
      });

      socket.off("starMessage", (response: { receiver: {}; sender: {} }) => {
        if (
          isSubscribed &&
          (usersSlice.selectedUser.user._id === response.sender ||
            usersSlice.selectedUser.user._id === response.receiver)
        ) {
          getSenderAndReceiverMessagesData(usersSlice.selectedUser.user);
        }
      });

      socket.off("starGroupMessage", (response: { groupId: string }) => {
        if (
          isSubscribed &&
          selectedUser.isGroup &&
          response.groupId === selectedUser.group._id
        ) {
          getSenderAndReceiverMessagesData("");
        }
      });

      socket.off("userStatus", (response: { _id: string }) => {
        if (isSubscribed && response._id === selectedUser.user._id) {
          dispatch(
            selectedUserRecord({
              ...selectedUser,
              user: response,
              status: true,
            })
          );
        }
      });
      socket.off("messageGroup", (response: { groupId: string }) => {
        scrollToBottom();

        if (
          isSubscribed &&
          selectedUser.isGroup &&
          response.groupId === selectedUser.group._id
        ) {
          getSenderAndReceiverMessagesData("");
        }
      });

      socket.off("updateGroupMessage", (response: { groupId: string }) => {
        if (
          isSubscribed &&
          selectedUser.isGroup &&
          response.groupId === selectedUser.group._id
        ) {
          getSenderAndReceiverMessagesData("");
        }
      });

      socket.off(
        "disappearGroupMessage",
        async (response: { group: { _id: string } }) => {
          scrollToBottom();

          if (
            isSubscribed &&
            selectedUser.isGroup &&
            response.group._id === selectedUser.group._id
          ) {
            await getSenderAndReceiverMessagesData("");
            dispatch(
              selectedUserRecord({
                ...selectedUser,
                group: response.group,
              })
            );
          }
        }
      );

      socket.off(
        "updateContactUser",
        async (response: {
          updatedType: string;
          _id: string;
          receiverInfo: { user: {}; disappearIn: Date | number };
        }) => {
          scrollToBottom();

          if (
            isSubscribed &&
            response.updatedType === "disappear" &&
            (response._id === userRecord._id ||
              response.receiverInfo.user === userRecord._id)
          ) {
            await getSenderAndReceiverMessagesData(
              usersSlice.selectedUser.user
            );

            if (response._id === userRecord._id) {
              dispatch(
                selectedUserRecord({
                  ...selectedUser,
                  disappearIn: response.receiverInfo.disappearIn,
                })
              );
            }
          }
        }
      );
    };
  }, [
    dispatch,
    selectedUser.user._id,
    userRecord._id,
    usersSlice.selectedUser,
    chatListRef,
    selectedUser,
    userRecord,
  ]);

  const scrollToBottom = () => {
    if (chatListRef.current) {
      chatListRef.current.scrollToEnd({ animated: false });
    }
  };

  return (
    <View style={styles.container}>
      <ChatAreaActions user={usersSlice.currentUser} />

      {selectedUser.status ? (
        <View style={styles.chatArea}>
          <ScrollView style={styles.chatAreaCenter} ref={chatListRef}>
            <ChatAreaCenterLevel
              chatMessageSlice={chatMessageSlice}
              userRecord={userRecord}
            />
          </ScrollView>

          <TouchableOpacity style={styles.backToTop} onPress={scrollToBottom}>
            <Icon type="font-awesome" name="angle-down" size={35} />
          </TouchableOpacity>

          <View
            style={[
              styles.chatAreaBottom,
              userContactsSlice.blockUserContact.status &&
                styles.chatAreaBottomBlock,
            ]}
          >
            <ChatAreaBottomLevel user={usersSlice.currentUser} />
          </View>
        </View>
      ) : (
        <View style={styles.chatAreaWithNoDetails} />
      )}
    </View>
  );
};

export default ChatArea;
