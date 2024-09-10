import React, { Fragment, useEffect, useState } from "react";
import { View, Text } from "react-native";
import { format, parseISO, isToday, isYesterday, isThisWeek } from "date-fns";
import { RootState } from "@/src/redux-toolkit/store";
import { useSelector } from "react-redux";
import { Icon, Image } from "@rneui/themed";
import { Audio } from "expo-av";

// import MessageActionsPopup from './MessageActionsPopup'; // You need to adapt this component to React Native as well
import chatAreaStyles from "./chatAreaStyles";

import { Link } from "expo-router";
import { UserRecordInterface } from "@/src/components/globalTypes/GlobalTypes";

const StarChatAreaCenterLevel = ({
  chatMessageSlice,
  userRecord,
}: {
  chatMessageSlice: { chatMessages: { messages: [] } };
  userRecord: UserRecordInterface;
}) => {
  const usersSlice = useSelector((state: RootState) => state.usersSlice);

  const [showPopup, setShowPopup] = useState(false);
  const [messageId, setMessageId] = useState("");

  const [sound, setSound] = useState<any>();

  //   async function playSound(soundUrl: string) {
  //     if (sound === "uuue") {
  //       console.log("Loading Sound");
  //       const { sound } = await Audio.Sound.createAsync(require(`${soundUrl}`));
  //       setSound(sound);

  //       console.log("Playing Sound");
  //       await sound.playAsync();
  //     }
  //   }

  useEffect(() => {
    return sound
      ? () => {
          console.log("Unloading Sound");
          sound.unloadAsync();
        }
      : undefined;
  }, [sound]);

  const handleIconClick = (messageId: string) => {
    setShowPopup(!showPopup);
    setMessageId(messageId);
  };

  const handleClosePopup = () => {
    setShowPopup(false);
    setMessageId("");
  };

  const renderMessages = (message: any) => {
    const getStarMessage = message.stars?.some(
      (user: { user: string }) => user.user === userRecord._id
    );

    const translatedMessage = message.translatedMessage.find(
      (translatedMessage: { user: string }) =>
        translatedMessage?.user === userRecord._id
    );

    const dateCreated = (date: string) => {
      const parsedDate = parseISO(date);
      if (isToday(parsedDate)) return "Today";
      if (isYesterday(parsedDate)) return "Yesterday";
      if (isThisWeek(parsedDate)) return format(parsedDate, "EEEE");
      return format(parsedDate, "dd/MM/yyyy");
    };

    const renderMessageContent = () => {
      switch (message.type) {
        case "image":
          return (
            <View style={chatAreaStyles.chatAreaCenterTexts}>
              <View
                style={[
                  chatAreaStyles.chatAreaCenterContent,
                  message.sender._id === userRecord._id &&
                    chatAreaStyles.ownChatAreaCenterContent,
                  message.type === "action" &&
                    chatAreaStyles.actionMessageChatAreaCenterContent,
                ]}
              >
                <View style={chatAreaStyles.chatAreaMessage}>
                  <View style={chatAreaStyles.userInfo}>
                    <View style={chatAreaStyles.user}>
                      {message.sender.photoUrl ? (
                        <Image
                          style={{ height: 50, width: 50 }}
                          source={{
                            uri: `${process.env.EXPO_PUBLIC_BASE_URL}/images/profile/${message.sender.photoUrl}`,
                          }}
                          containerStyle={chatAreaStyles.userImage}
                        />
                      ) : (
                        <View style={chatAreaStyles.chatListItemUserNoImage}>
                          <Text style={chatAreaStyles.noImageText}>
                            {message.sender.name
                              .split(" ")
                              .map((data: any) => data.charAt(0))
                              .slice(0, 2)
                              .join("")}
                          </Text>
                        </View>
                      )}
                      <View>
                        <Text style={chatAreaStyles.groupMemberName}>
                          {message.sender.name.split(" ")[0]}
                        </Text>
                      </View>
                    </View>
                    <View>
                      <Text>{dateCreated(message.createdAt)}</Text>
                    </View>
                  </View>
                  <Image
                    style={{ height: 250, width: 250 }}
                    containerStyle={chatAreaStyles.messageImage}
                    source={{
                      uri: `${process.env.EXPO_PUBLIC_BASE_URL}/images/messages/${message.message}`,
                    }}
                  />

                  <Text style={chatAreaStyles.messageTime}>
                    {format(message.createdAt, "HH:mm")}
                  </Text>
                </View>
              </View>
            </View>
          );
        case "document":
          const ext = message.message.split(".").pop();
          const renderDocumentIcon = () => {
            if (ext === "pdf") {
              return (
                <Icon
                  type="font-awesome"
                  name="file-pdf-o"
                  size={25}
                  color={"#e23002"}
                />
              );
            } else if (["docx", "doc"].includes(ext)) {
              return (
                <Icon
                  type="font-awesome"
                  name="file-word-o"
                  size={25}
                  containerStyle={chatAreaStyles.documentSaveWord}
                  color={"#CC99FF"}
                />
              );
            }
          };
          return (
            <View style={chatAreaStyles.chatAreaCenterTexts}>
              <View
                style={[
                  [
                    chatAreaStyles.chatAreaCenterContent,
                    message.sender._id === userRecord._id &&
                      chatAreaStyles.ownChatAreaCenterContent,
                  ],
                ]}
              >
                <View style={chatAreaStyles.chatAreaMessage}>
                  <View style={chatAreaStyles.userInfo}>
                    <View style={chatAreaStyles.user}>
                      {message.sender.photoUrl ? (
                        <Image
                          style={{ height: 50, width: 50 }}
                          source={{
                            uri: `${process.env.EXPO_PUBLIC_BASE_URL}/images/profile/${message.sender.photoUrl}`,
                          }}
                          containerStyle={chatAreaStyles.userImage}
                        />
                      ) : (
                        <View style={chatAreaStyles.chatListItemUserNoImage}>
                          <Text style={chatAreaStyles.noImageText}>
                            {message.sender.name
                              .split(" ")
                              .map((data: any) => data.charAt(0))
                              .slice(0, 2)
                              .join("")}
                          </Text>
                        </View>
                      )}
                      <View>
                        <Text style={chatAreaStyles.groupMemberName}>
                          {message.sender.name.split(" ")[0]}
                        </Text>
                      </View>
                    </View>
                    <View>
                      <Text>{dateCreated(message.createdAt)}</Text>
                    </View>
                  </View>

                  <View style={chatAreaStyles.messageDocument}>
                    {renderDocumentIcon()}
                    <Text style={chatAreaStyles.documentTitle}>
                      {message.message}
                    </Text>
                  </View>
                  <Text style={chatAreaStyles.messageTime}>
                    {format(message.createdAt, "HH:mm")}
                  </Text>
                </View>
              </View>
            </View>
          );
        case "link":
          return (
            <View style={chatAreaStyles.chatAreaCenterTexts}>
              <View
                style={[
                  chatAreaStyles.chatAreaCenterContent,
                  message.sender._id === userRecord._id &&
                    chatAreaStyles.ownChatAreaCenterContent,
                ]}
              >
                <View style={chatAreaStyles.chatAreaMessage}>
                  <View style={chatAreaStyles.userInfo}>
                    <View style={chatAreaStyles.user}>
                      {message.sender.photoUrl ? (
                        <Image
                          style={{ height: 50, width: 50 }}
                          source={{
                            uri: `${process.env.EXPO_PUBLIC_BASE_URL}/images/profile/${message.sender.photoUrl}`,
                          }}
                          containerStyle={chatAreaStyles.userImage}
                        />
                      ) : (
                        <View style={chatAreaStyles.chatListItemUserNoImage}>
                          <Text style={chatAreaStyles.noImageText}>
                            {message.sender.name
                              .split(" ")
                              .map((data: any) => data.charAt(0))
                              .slice(0, 2)
                              .join("")}
                          </Text>
                        </View>
                      )}
                      <View>
                        <Text style={chatAreaStyles.groupMemberName}>
                          {message.sender.name.split(" ")[0]}
                        </Text>
                      </View>
                    </View>
                    <View>
                      <Text>{dateCreated(message.createdAt)}</Text>
                    </View>
                  </View>
                  <Text style={chatAreaStyles.messageLink}>
                    <Link href={message.message}>{message.message}</Link>
                  </Text>
                  <Text style={chatAreaStyles.messageTime}>
                    {format(message.createdAt, "HH:mm")}
                  </Text>
                </View>
              </View>
            </View>
          );
        case "audio":
          return (
            <View style={chatAreaStyles.chatAreaCenterTexts}>
              <View
                style={[
                  chatAreaStyles.chatAreaCenterContent,
                  message.sender._id === userRecord._id &&
                    chatAreaStyles.ownChatAreaCenterContent,
                ]}
              >
                <View style={chatAreaStyles.chatAreaMessage}>
                  <View style={chatAreaStyles.userInfo}>
                    <View style={chatAreaStyles.user}>
                      {message.sender.photoUrl ? (
                        <Image
                          style={{ height: 50, width: 50 }}
                          source={{
                            uri: `${process.env.EXPO_PUBLIC_BASE_URL}/images/profile/${message.sender.photoUrl}`,
                          }}
                          containerStyle={chatAreaStyles.userImage}
                        />
                      ) : (
                        <View style={chatAreaStyles.chatListItemUserNoImage}>
                          <Text style={chatAreaStyles.noImageText}>
                            {message.sender.name
                              .split(" ")
                              .map((data: any) => data.charAt(0))
                              .slice(0, 2)
                              .join("")}
                          </Text>
                        </View>
                      )}
                      <View>
                        <Text style={chatAreaStyles.groupMemberName}>
                          {message.sender.name.split(" ")[0]}
                        </Text>
                      </View>
                    </View>
                    <View>
                      <Text>{dateCreated(message.createdAt)}</Text>
                    </View>
                  </View>
                  {/* <Audio
                    controls
                    source={{ uri: `${process.env.EXPO_PUBLIC_BASE_URL}/audio/messages/${message.message}` }}
                    style={chatAreaStyles.audioMessage}
                  /> */}
                  <Text style={chatAreaStyles.messageTime}>
                    {format(message.createdAt, "HH:mm")}
                  </Text>
                </View>
              </View>
            </View>
          );
        default:
          return (
            <View style={chatAreaStyles.chatAreaCenterTexts}>
              <View
                style={[
                  chatAreaStyles.chatAreaCenterContent,
                  message.sender._id === userRecord._id &&
                    chatAreaStyles.ownChatAreaCenterContent,
                ]}
              >
                <View style={chatAreaStyles.chatAreaMessage}>
                  <View style={chatAreaStyles.userInfo}>
                    <View style={chatAreaStyles.user}>
                      {message.sender.photoUrl ? (
                        <Image
                          style={{ height: 50, width: 50 }}
                          source={{
                            uri: `${process.env.EXPO_PUBLIC_BASE_URL}/images/profile/${message.sender.photoUrl}`,
                          }}
                          containerStyle={chatAreaStyles.userImage}
                        />
                      ) : (
                        <View style={chatAreaStyles.chatListItemUserNoImage}>
                          <Text style={chatAreaStyles.noImageText}>
                            {message.sender.name
                              .split(" ")
                              .map((data: any) => data.charAt(0))
                              .slice(0, 2)
                              .join("")}
                          </Text>
                        </View>
                      )}
                      <View>
                        <Text style={chatAreaStyles.groupMemberName}>
                          {message.sender.name.split(" ")[0]}
                        </Text>
                      </View>
                    </View>
                    <View>
                      <Text>{dateCreated(message.createdAt)}</Text>
                    </View>
                  </View>

                  <Text style={chatAreaStyles.messageText}>
                    {message.message}
                  </Text>
                  <Text style={chatAreaStyles.messageTime}>
                    {message.editMessage && "Edited"}{" "}
                    {format(message.createdAt, "HH:mm")}
                  </Text>
                </View>
                {translatedMessage && (
                  <View
                    style={[
                      chatAreaStyles.chatAreaCenterContent,
                      { backgroundColor: "#e7eaf3" },
                    ]}
                  >
                    <Text style={chatAreaStyles.messageText}>
                      {translatedMessage.message}
                    </Text>
                    <Text style={chatAreaStyles.messageTime}>
                      {`${translatedMessage?.preferLanguage?.language} version`}
                    </Text>
                  </View>
                )}
              </View>
            </View>
          );
      }
    };

    return (
      <View
        key={message._id}
        style={[
          chatAreaStyles.starMessage,
          message.type === "action" && chatAreaStyles.actionMessage,
        ]}
      >
        {renderMessageContent()}
      </View>
    );
  };

  const starredMessages = chatMessageSlice.chatMessages.messages?.filter(
    (startMessage: { stars: [] }) =>
      startMessage.stars?.find(
        (star: { user: {} }) => star.user === usersSlice.currentUser.user._id
      )
  );

  return <Fragment>{starredMessages?.map(renderMessages)}</Fragment>;
};

export default StarChatAreaCenterLevel;
