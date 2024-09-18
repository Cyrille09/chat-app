import { Tabs, router } from "expo-router";
import React, { useEffect, useState } from "react";
import { CheckBox, Dialog, SearchBar } from "@rneui/themed";

import { FontAwesome } from "@expo/vector-icons";
import { TabBarIcon } from "@/src/components/navigation/TabBarIcon";
import { Colors } from "@/src/constants/Colors";
import { useColorScheme } from "@/src/hooks/useColorScheme";
import tabsStyles from "@/src/app/tabsStyles";

import { View, Text, TouchableOpacity } from "react-native";
import { socket } from "@/src/components/websocket/websocket";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/src/redux-toolkit/store";
import { getUserContacts } from "@/src/services/userContactsServices";
import { userContactsRecord } from "@/src/redux-toolkit/reducers/userContactsSlice";
import { successAddNewUsersActions } from "@/src/redux-toolkit/reducers/actionsSlice";
import MessagePopup from "../(screens)/chatList/MessagePopup";
import styles from "../(screens)/chatArea/chatAreaStyles";
import { ReactNativeDialog } from "@/src/components/dialog/Dialog";

export default function TabLayout() {
  const usersSlice = useSelector((state: RootState) => state.usersSlice);
  const userContactsSlice = useSelector(
    (state: RootState) => state.userContactsSlice
  );

  const dispatch = useDispatch();
  const [userRecord, setUserRecord] = useState(usersSlice.currentUser.user);

  const colorScheme = useColorScheme();

  const [toggleDialogVisable, setToggleDialogVisable] = useState(false);

  const toggleDialog = () => {
    setToggleDialogVisable(!toggleDialogVisable);
  };

  useEffect(() => {
    let isSubscribed = true;
    // send message
    socket.on(
      "message",
      (response: {
        secondUser: { _id: string };
        currentUser: { _id: string };
      }) => {
        if (
          isSubscribed &&
          (response.currentUser._id === userRecord._id ||
            response.secondUser._id === userRecord._id)
        ) {
          userContactData();
        }
      }
    );

    // send group message
    socket.on("messageGroup", (response: { groupId: string }) => {
      if (
        isSubscribed &&
        userContactsSlice.userContacts?.find(
          (userContact: { group: { _id: string } }) =>
            userContact?.group?._id === response.groupId
        )
      ) {
        userContactData();
      }
    });
    socket.on("updateGroupMessage", (response: { groupId: string }) => {
      if (
        isSubscribed &&
        userContactsSlice.userContacts?.find(
          (userContact: { group: { _id: string } }) =>
            userContact?.group?._id === response.groupId
        )
      ) {
        userContactData();
      }
    });

    socket.on(
      "updateMessage",
      (response: { sender: string; receiver: string }) => {
        if (
          isSubscribed &&
          (response.sender === userRecord._id ||
            response.receiver === userRecord._id)
        ) {
          userContactData();
        }
      }
    );
    socket.on(
      "deleteMessage",
      (response: { sender: string; receiver: string }) => {
        if (
          isSubscribed &&
          (response.sender === userRecord._id ||
            response.receiver === userRecord._id)
        ) {
          userContactData();
        }
      }
    );

    // contact user
    socket.on("contactUser", (response: { _id: string }) => {
      if (isSubscribed && response._id === userRecord._id) {
        userContactData();
      }
    });
    socket.on("updateContactUser", (response: { _id: string }) => {
      if (isSubscribed && response._id === userRecord._id) {
        userContactData();
      }
    });
    socket.on("deleteContactUser", (response: { _id: string }) => {
      if (isSubscribed && response._id === userRecord._id) {
        userContactData();
      }
    });

    socket.on("group", (response: []) => {
      if (
        isSubscribed &&
        response
          .map((user: { value: string }) => user.value)
          .includes(userRecord._id)
      ) {
        userContactData();
      }
    });

    socket.on("exitGroup", (response: { _id: string }) => {
      if (isSubscribed && response._id === userRecord._id) {
        userContactData();
      }
    });

    socket.on("updateGroup", (response: []) => {
      if (
        isSubscribed &&
        response
          .map((user: { value: string }) => user.value)
          .includes(userRecord._id)
      ) {
        userContactData();
      }
    });

    socket.on(
      "addGroupMember",
      (response: { groupUsers: []; groupId: string }) => {
        if (
          isSubscribed &&
          (response.groupUsers
            .map((user: { value: string }) => user.value)
            .includes(userRecord._id) ||
            response.groupId === usersSlice.selectedUser?.group?._id)
        ) {
          userContactData();
        }
      }
    );

    socket.on("muteGroupMessage", (response: { _id: string }) => {
      if (isSubscribed && response._id === userRecord._id) {
        userContactData();
      }
    });

    const userContactData = async () => {
      getUserContacts("")
        .then((response) => {
          if (isSubscribed) dispatch(userContactsRecord(response.data.users));
        })
        .catch((error) => {});
    };

    return () => {
      isSubscribed = false;
      // send message
      socket.on(
        "message",
        (response: {
          currentUser: { _id: string };
          secondUser: { _id: string };
        }) => {
          if (
            isSubscribed &&
            (response.currentUser._id === userRecord._id ||
              response.secondUser._id === userRecord._id)
          ) {
            userContactData();
          }
        }
      );

      // send group message
      socket.off("messageGroup", (response: { groupId: string }) => {
        if (
          isSubscribed &&
          userContactsSlice.userContacts?.find(
            (userContact: { group: { _id: string } }) =>
              userContact?.group?._id === response.groupId
          )
        ) {
          userContactData();
        }
      });
      socket.off("updateGroupMessage", (response: { groupId: string }) => {
        if (
          isSubscribed &&
          userContactsSlice.userContacts?.find(
            (userContact: { group: { _id: string } }) =>
              userContact?.group?._id === response.groupId
          )
        ) {
          userContactData();
        }
      });

      socket.off(
        "updateMessage",
        (response: { sender: string; receiver: string }) => {
          if (
            isSubscribed &&
            (response.sender === userRecord._id ||
              response.receiver === userRecord._id)
          ) {
            userContactData();
          }
        }
      );
      socket.off(
        "deleteMessage",
        (response: { sender: string; receiver: string }) => {
          if (
            isSubscribed &&
            (response.sender === userRecord._id ||
              response.receiver === userRecord._id)
          ) {
            userContactData();
          }
        }
      );

      // contact user
      socket.off("contactUser", (response: { _id: string }) => {
        if (isSubscribed && response._id === userRecord._id) {
          userContactData();
        }
      });
      socket.off("updateContactUser", (response: { _id: string }) => {
        if (isSubscribed && response._id === userRecord._id) {
          userContactData();
        }
      });
      socket.off("deleteContactUser", (response: { _id: string }) => {
        if (isSubscribed && response._id === userRecord._id) {
          userContactData();
        }
      });

      socket.off("group", (response: []) => {
        if (
          isSubscribed &&
          response
            .map((user: { value: string }) => user.value)
            .includes(userRecord._id)
        ) {
          userContactData();
        }
      });

      socket.off("exitGroup", (response: { _id: string }) => {
        if (isSubscribed && response._id === userRecord._id) {
          userContactData();
        }
      });

      socket.off("updateGroup", (response: []) => {
        if (
          isSubscribed &&
          response
            .map((user: { value: string }) => user.value)
            .includes(userRecord._id)
        ) {
          userContactData();
        }
      });

      socket.off(
        "addGroupMember",
        (response: { groupUsers: []; groupId: string }) => {
          if (
            isSubscribed &&
            (response.groupUsers
              .map((user: { value: string }) => user.value)
              .includes(userRecord._id) ||
              response.groupId === usersSlice.selectedUser?.group?._id)
          ) {
            userContactData();
          }
        }
      );

      socket.off("muteGroupMessage", (response: { _id: string }) => {
        if (isSubscribed && response._id === userRecord._id) {
          userContactData();
        }
      });
    };
  }, [dispatch, userContactsRecord, userRecord._id, usersSlice.selectedUser]);

  const tabsHeaderRight = (props: { addContact: boolean }) => {
    return (
      <View style={tabsStyles.headerRight}>
        {props.addContact && (
          <View>
            <FontAwesome
              name="plus-square"
              size={20}
              onPress={() => {
                router.navigate("/(screens)/chatList/add-new-contact-user");
              }}
            />
          </View>
        )}
        <TouchableOpacity
          onPress={() => {
            toggleDialog();
          }}
        >
          <FontAwesome
            name="ellipsis-h"
            size={23}
            onPress={() => {
              toggleDialog();
            }}
          />
        </TouchableOpacity>

        <ReactNativeDialog
          isVisible={toggleDialogVisable}
          onBackdropPress={toggleDialog}
          items={[
            {
              name: "New group",
              url: "/(screens)/chatList/add-new-group",
            },
            {
              name: "Settings",
              url: "/(tabs)/settings",
            },
            {
              name: "Change password",
              url: "/(screens)/chatList/change-password",
            },
            {
              name: "Prefer language",
              url: "/(screens)/chatList/prefer-language",
            },
            {
              name: "Logout",
              url: "logout",
              tag: "logout",
            },
          ]}
        />
      </View>
    );
  };

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? "light"].tint,
        headerShown: false,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          headerShown: true,
          title: "Chat",
          tabBarIcon: ({ color, focused }) => {
            return (
              <TabBarIcon
                name={focused ? "chatbox" : "chatbox-outline"}
                color={color}
              />
            );
          },
          headerRight(props) {
            return tabsHeaderRight({ addContact: true });
          },
        }}
      />
      <Tabs.Screen
        name="storyFeed"
        options={{
          headerShown: true,
          title: "Story Feed",
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon
              name={focused ? "invert-mode" : "invert-mode-outline"}
              color={color}
            />
          ),
          headerRight(props) {
            return tabsHeaderRight({ addContact: false });
          },
        }}
      />

      <Tabs.Screen
        name="settings"
        options={{
          headerShown: true,
          title: "Settings",
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon
              name={focused ? "settings" : "settings-outline"}
              color={color}
            />
          ),
          headerRight(props) {
            return tabsHeaderRight({ addContact: false });
          },
        }}
      />

      <Tabs.Screen
        name="calls"
        options={{
          headerShown: true,
          title: "Calls",
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon
              name={focused ? "call" : "call-outline"}
              color={color}
            />
          ),
          headerRight(props) {
            return tabsHeaderRight({ addContact: false });
          },
        }}
      />
    </Tabs>
  );
}
