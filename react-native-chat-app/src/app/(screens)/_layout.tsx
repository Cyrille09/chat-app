import { Icon, Image } from "@rneui/themed";
import { Stack, router } from "expo-router";
import { View, Text, Platform, TouchableOpacity } from "react-native";
import { format } from "date-fns";

import styles from "../(screens)/chatArea/chatAreaStyles";
import { useSelector } from "react-redux";
import { RootState } from "@/src/redux-toolkit/store";

export default function UserLayout() {
  const usersSlice = useSelector((state: RootState) => state.usersSlice);
  const chatMessageSlice = useSelector(
    (state: RootState) => state.chatMessageSlice
  );
  const displayStatus = () => {
    if (usersSlice.selectedUser.isGroup) {
      const names = chatMessageSlice.chatGroupMembers
        .map(
          (member: { user: { name: string } }) => member.user.name.split(" ")[0]
        )
        .join(", ");

      return (
        <View>
          <Text style={styles.chatAreaTopTextsName}>
            {usersSlice.selectedUser.group.name}
          </Text>
          <Text>
            {names.length > 20 ? `${names.substring(0, 20)}...` : names}
          </Text>
        </View>
      );
    } else {
      return (
        <View>
          <Text style={styles.chatAreaTopTextsName}>
            {usersSlice.selectedUser.user.name}
          </Text>
          {usersSlice.selectedUser.user.lastSeen.status ? (
            <Text style={styles.chatAreaTopLastOnline}>Online</Text>
          ) : (
            <Text style={styles.chatAreaTopLastSeen}>
              {usersSlice.selectedUser.user.lastSeen.date ? (
                `Last seen: ${format(
                  usersSlice.selectedUser.user.lastSeen.date,
                  "dd-MM-yyyy HH:mm"
                )}`
              ) : (
                <Text style={styles.chatAreaTopOffline}>offline</Text>
              )}
            </Text>
          )}
        </View>
      );
    }
  };

  return (
    <Stack screenOptions={{}}>
      <Stack.Screen
        name="chatArea/chat-area"
        options={{
          headerTitleAlign: "center",
          headerShown: true,
          title: "",

          headerLeft: () => (
            <View style={styles.chatAreaNavigatorIcons}>
              <TouchableOpacity
                onPress={() => router.back()}
                style={styles.chatAreaNavigatorIcon}
              >
                <View>
                  <Icon
                    type="font-awesome"
                    name={
                      Platform.OS === "android" ? "arrow-left" : "chevron-left"
                    }
                    size={20}
                    onPress={() => router.back()}
                  />
                </View>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() =>
                  router.navigate("/(screens)/userSelected/user-selected-info")
                }
              >
                <View style={styles.chatAreaTopUser}>
                  {usersSlice.selectedUser.user.photoUrl ? (
                    <Image
                      style={{ height: 50, width: 50 }}
                      source={{
                        uri: `${process.env.EXPO_PUBLIC_BASE_URL}/images/profile/${usersSlice.selectedUser.user.photoUrl}`,
                      }}
                      containerStyle={styles.userImage}
                    />
                  ) : (
                    <View style={styles.chatListItemUserNoImage}>
                      <Text style={styles.noImageText}>
                        {usersSlice.selectedUser.user.name
                          .split(" ")
                          .map((data) => data.charAt(0))
                          .slice(0, 2)
                          .join("")}
                      </Text>
                    </View>
                  )}
                  <View style={styles.chatAreaTopTexts}>
                    <Text style={styles.chatAreaTopLastSeen}>
                      {displayStatus()}
                    </Text>
                  </View>
                </View>
              </TouchableOpacity>
            </View>
          ),

          headerRight: () => (
            <View style={styles.chatAreaNavigatorIcons}>
              <View>
                <Icon
                  type="font-awesome"
                  name="phone"
                  size={20}
                  onPress={() => alert("phone call is coming soon")}
                />
              </View>
              <View>
                <Icon
                  type="font-awesome"
                  name="video-camera"
                  size={20}
                  onPress={() => alert("video call is coming soon")}
                />
              </View>
            </View>
          ),
        }}
      />
      <Stack.Screen
        name="userSelected/user-selected-info"
        options={{
          headerTitleAlign: "center",
          headerShown: true,
          title: `${
            usersSlice.selectedUser.isGroup ? "Group info" : "Contact info"
          }`,

          headerLeft: () => (
            <View style={styles.chatAreaButtonRow}>
              <View>
                <Icon
                  type="font-awesome"
                  name={
                    Platform.OS === "android" ? "arrow-left" : "chevron-left"
                  }
                  size={20}
                  onPress={() => router.back()}
                />
              </View>
            </View>
          ),

          headerRight: () => (
            <>
              {usersSlice.selectedUser.isGroup && (
                <View style={styles.chatAreaButtonRow}>
                  <View>
                    <Icon
                      type="font-awesome"
                      name="edit"
                      size={20}
                      onPress={() =>
                        router.navigate("/chatList/edit-group-info")
                      }
                    />
                  </View>
                </View>
              )}
            </>
          ),
        }}
      />

      <Stack.Screen
        name="chatList/add-new-contact-user"
        options={{
          headerTitleAlign: "center",
          headerShown: true,
          title: "Add Contact User",

          headerLeft: () => (
            <View style={styles.chatAreaButtonRow}>
              <View>
                <Icon
                  type="font-awesome"
                  name={
                    Platform.OS === "android" ? "arrow-left" : "chevron-left"
                  }
                  size={20}
                  onPress={() => router.back()}
                />
              </View>
            </View>
          ),
        }}
      />

      <Stack.Screen
        name="chatList/prefer-language"
        options={{
          headerTitleAlign: "center",
          headerShown: true,
          title: "Prefer Language",

          headerLeft: () => (
            <View style={styles.chatAreaButtonRow}>
              <View>
                <Icon
                  type="font-awesome"
                  name={
                    Platform.OS === "android" ? "arrow-left" : "chevron-left"
                  }
                  size={20}
                  onPress={() => router.back()}
                />
              </View>
            </View>
          ),
        }}
      />

      <Stack.Screen
        name="chatList/add-new-group"
        options={{
          headerTitleAlign: "center",
          headerShown: true,
          title: "Add New Group",

          headerLeft: () => (
            <View style={styles.chatAreaButtonRow}>
              <View>
                <Icon
                  type="font-awesome"
                  name={
                    Platform.OS === "android" ? "arrow-left" : "chevron-left"
                  }
                  size={20}
                  onPress={() => router.back()}
                />
              </View>
            </View>
          ),
        }}
      />

      <Stack.Screen
        name="chatList/change-password"
        options={{
          headerTitleAlign: "center",
          headerShown: true,
          title: "Change Password",

          headerLeft: () => (
            <View style={styles.chatAreaButtonRow}>
              <View>
                <Icon
                  type="font-awesome"
                  name={
                    Platform.OS === "android" ? "arrow-left" : "chevron-left"
                  }
                  size={20}
                  onPress={() => router.back()}
                />
              </View>
            </View>
          ),
        }}
      />

      <Stack.Screen
        name="chatList/edit-group-info"
        options={{
          headerTitleAlign: "center",
          headerShown: true,
          title: "Edit Group Info",

          headerLeft: () => (
            <View style={styles.chatAreaButtonRow}>
              <View>
                <Icon
                  type="font-awesome"
                  name={
                    Platform.OS === "android" ? "arrow-left" : "chevron-left"
                  }
                  size={20}
                  onPress={() => router.back()}
                />
              </View>
            </View>
          ),
        }}
      />

      <Stack.Screen
        name="chatList/add-group-members"
        options={{
          headerTitleAlign: "center",
          headerShown: true,
          title: "Add Group Members",

          headerLeft: () => (
            <View style={styles.chatAreaButtonRow}>
              <View>
                <Icon
                  type="font-awesome"
                  name={
                    Platform.OS === "android" ? "arrow-left" : "chevron-left"
                  }
                  size={20}
                  onPress={() => router.back()}
                />
              </View>
            </View>
          ),
        }}
      />

      <Stack.Screen
        name="chatList/view-group-user-info"
        options={{
          headerTitleAlign: "center",
          headerShown: true,
          title: "Group User Info",

          headerLeft: () => (
            <View style={styles.chatAreaButtonRow}>
              <View>
                <Icon
                  type="font-awesome"
                  name={
                    Platform.OS === "android" ? "arrow-left" : "chevron-left"
                  }
                  size={20}
                  onPress={() => router.back()}
                />
              </View>
            </View>
          ),
        }}
      />

      <Stack.Screen
        name="chatList/disappear-messages"
        options={{
          headerTitleAlign: "center",
          headerShown: true,
          title: `Disappear ${
            usersSlice.selectedUser.isGroup
              ? `${usersSlice.selectedUser.group.name} Group`
              : "User"
          } Mesaage`,

          headerLeft: () => (
            <View style={styles.chatAreaButtonRow}>
              <View>
                <Icon
                  type="font-awesome"
                  name={
                    Platform.OS === "android" ? "arrow-left" : "chevron-left"
                  }
                  size={20}
                  onPress={() => router.back()}
                />
              </View>
            </View>
          ),
        }}
      />
      <Stack.Screen
        name="chatList/mute-notification"
        options={{
          headerTitleAlign: "center",
          headerShown: true,
          title: `Mute ${
            usersSlice.selectedUser.isGroup ? "Group" : "User"
          } Notification`,

          headerLeft: () => (
            <View style={styles.chatAreaButtonRow}>
              <View>
                <Icon
                  type="font-awesome"
                  name={
                    Platform.OS === "android" ? "arrow-left" : "chevron-left"
                  }
                  size={20}
                  onPress={() => router.back()}
                />
              </View>
            </View>
          ),
        }}
      />
      <Stack.Screen
        name="chatList/star-messages"
        options={{
          headerTitleAlign: "center",
          headerShown: true,
          title: "Star Messages",

          headerLeft: () => (
            <View style={styles.chatAreaButtonRow}>
              <View>
                <Icon
                  type="font-awesome"
                  name={
                    Platform.OS === "android" ? "arrow-left" : "chevron-left"
                  }
                  size={20}
                  onPress={() => router.back()}
                />
              </View>
            </View>
          ),
        }}
      />
      <Stack.Screen
        name="chatList/media-links-docs"
        options={{
          headerTitleAlign: "center",
          headerShown: true,
          title: "Media",

          headerLeft: () => (
            <View style={styles.chatAreaButtonRow}>
              <View>
                <Icon
                  type="font-awesome"
                  name={
                    Platform.OS === "android" ? "arrow-left" : "chevron-left"
                  }
                  size={20}
                  onPress={() => router.back()}
                />
              </View>
            </View>
          ),
        }}
      />

      <Stack.Screen
        name="storyFeed/story-feed"
        options={{
          headerShown: true,
          title: "Story Feed",

          headerRight: () => (
            <View style={styles.chatAreaButtonRow}>
              <View>
                <Icon
                  type="font-awesome"
                  name="close"
                  size={25}
                  onPress={() => router.navigate("/(tabs)/storyFeed")}
                />
              </View>
            </View>
          ),
        }}
      />
      <Stack.Screen
        name="chatList/edit-message"
        options={{
          headerTitleAlign: "center",
          headerShown: true,
          title: "Edit Message",

          headerLeft: () => (
            <View style={styles.chatAreaButtonRow}>
              <View>
                <Icon
                  type="font-awesome"
                  name={
                    Platform.OS === "android" ? "arrow-left" : "chevron-left"
                  }
                  size={20}
                  onPress={() => router.back()}
                />
              </View>
            </View>
          ),
        }}
      />
    </Stack>
  );
}
