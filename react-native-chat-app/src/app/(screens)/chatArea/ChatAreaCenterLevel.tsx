import React, { Fragment, useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
} from "react-native";
import { format, parseISO, isToday, isYesterday, isThisWeek } from "date-fns";
import { RootState } from "@/src/redux-toolkit/store";
import { useDispatch, useSelector } from "react-redux";
import { Icon, Image } from "@rneui/themed";
import { Audio } from "expo-av";
import Slider from "@react-native-community/slider";

import chatAreaStyles from "./chatAreaStyles";

import { Link } from "expo-router";
import { UserRecordInterface } from "@/src/components/globalTypes/GlobalTypes";
import { ReactNativeDialog } from "@/src/components/dialog/Dialog";
import { successEditMessageActions } from "@/src/redux-toolkit/reducers/actionsSlice";

const ChatAreaCenterLevel = ({
  chatMessageSlice,
  userRecord,
}: {
  chatMessageSlice: { chatMessages: { groupedMessages: [] } };
  userRecord: UserRecordInterface;
}) => {
  const usersSlice = useSelector((state: RootState) => state.usersSlice);

  const [showPopup, setShowPopup] = useState(false);
  const [messageId, setMessageId] = useState("");

  const [sound, setSound] = useState<any>(null);
  const dispatch = useDispatch();

  // const [sound, setSound] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [duration, setDuration] = useState(0);
  const [position, setPosition] = useState(0);
  const [toggleDialogVisable, setToggleDialogVisable] = useState(false);

  const toggleDialog = () => {
    setToggleDialogVisable(!toggleDialogVisable);
  };

  const soundRef: any = useRef(null);

  //   async function playSound(soundUrl: string) {
  //     if (sound === "uuue") {
  //       console.log("Loading Sound");
  //       const { sound } = await Audio.Sound.createAsync(require(`${soundUrl}`));
  //       setSound(sound);

  //       console.log("Playing Sound");
  //       await sound.playAsync();
  //     }
  //   }

  // useEffect(() => {
  //   return sound
  //     ? () => {
  //         console.log("Unloading Sound");
  //         sound.unloadAsync();
  //       }
  //     : undefined;
  // }, [sound]);

  useEffect(() => {
    return () => {
      if (sound) {
        sound.unloadAsync();
      }
    };
  }, [sound]);

  const loadSound = async (audioUri: string) => {
    const { sound: newSound } = await Audio.Sound.createAsync(
      {
        uri: audioUri,
      },
      {
        shouldPlay: true,
      },
      onPlaybackStatusUpdate
    );
    setSound(newSound);
    soundRef.current = newSound;
  };

  const onPlaybackStatusUpdate = (status: any) => {
    if (status.isLoaded) {
      setPosition(status.positionMillis);
      setDuration(status.durationMillis);
      setIsPlaying(status.isPlaying);
    }
  };

  const handlePlayPause = async (audioUri: string) => {
    if (sound) {
      if (isPlaying) {
        await sound.pauseAsync();
      } else {
        await sound.playAsync();
      }
    } else {
      await loadSound(audioUri);
    }
  };

  const handleSliderValueChange = async (value: number) => {
    if (soundRef.current) {
      const newPosition = value * duration;
      await soundRef.current.setPositionAsync(newPosition);
    }
  };

  const formatTime = (millis: number) => {
    const minutes = Math.floor(millis / 1000 / 60);
    const seconds = Math.floor((millis / 1000) % 60);
    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  };

  const handleIconClick = (messageId: string) => {
    setShowPopup(!showPopup);
    setMessageId(messageId);
  };

  const handleClosePopup = () => {
    setShowPopup(false);
    setMessageId("");
  };

  const dateCreated = (date: string) => {
    const parsedDate = parseISO(date);
    if (isToday(parsedDate)) return "Today";
    if (isYesterday(parsedDate)) return "Yesterday";
    if (isThisWeek(parsedDate)) return format(parsedDate, "EEEE");
    return format(parsedDate, "dd/MM/yyyy");
  };

  const renderMessages = (message: any) => {
    const getStarMessage = message.stars?.some(
      (user: { user: string }) => user.user === userRecord._id
    );

    const translatedMessage = message.translatedMessage.find(
      (translatedMessage: { user: string }) =>
        translatedMessage?.user === userRecord._id
    );

    const renderMessageContent = () => {
      switch (message.type) {
        case "image":
          return (
            <View style={chatAreaStyles.chatAreaCenterTexts}>
              <TouchableWithoutFeedback
                delayLongPress={500}
                onLongPress={() => {
                  if (message.sender._id === userRecord._id) {
                    dispatch(
                      successEditMessageActions({
                        status: true,
                        record: { message: message.message, _id: message._id },
                      })
                    );
                    setMessageId(message._id);
                    toggleDialog();
                  }
                }}
              >
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
                    {message.isGroup &&
                      message.sender._id !== userRecord._id && (
                        <Text style={chatAreaStyles.groupMemberName}>
                          {message.sender.name}
                        </Text>
                      )}
                    <Image
                      style={{ height: 250, width: 250 }}
                      containerStyle={chatAreaStyles.messageImage}
                      source={{
                        uri: `${process.env.EXPO_PUBLIC_BASE_URL}/images/messages/${message.message}`,
                      }}
                    />

                    <Text style={chatAreaStyles.messageTime}>
                      {getStarMessage && <Icon name="star" size={13} />}{" "}
                      {format(message.createdAt, "HH:mm")}
                    </Text>
                  </View>
                </View>
              </TouchableWithoutFeedback>
              {message._id === messageId && (
                <ReactNativeDialog
                  isVisible={toggleDialogVisable}
                  onBackdropPress={toggleDialog}
                  message={message}
                  items={[
                    {
                      name: `${message.stars.length ? "Unstar" : "Star"}`,
                      url: "",
                      tag: "messageStar",
                    },
                  ]}
                />
              )}
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
              <TouchableWithoutFeedback
                delayLongPress={500}
                onLongPress={() => {
                  if (message.sender._id === userRecord._id) {
                    dispatch(
                      successEditMessageActions({
                        status: true,
                        record: { message: message.message, _id: message._id },
                      })
                    );
                    setMessageId(message._id);
                    toggleDialog();
                  }
                }}
              >
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
                    {message.isGroup &&
                      message.sender._id !== userRecord._id && (
                        <Text style={chatAreaStyles.groupMemberName}>
                          {message.sender.name}
                        </Text>
                      )}
                    <View style={chatAreaStyles.messageDocument}>
                      {renderDocumentIcon()}
                      <Text style={chatAreaStyles.documentTitle}>
                        {message.message}
                      </Text>
                    </View>
                    <Text style={chatAreaStyles.messageTime}>
                      {getStarMessage && <Icon name="star" size={13} />}{" "}
                      {format(message.createdAt, "HH:mm")}
                    </Text>
                  </View>
                </View>
              </TouchableWithoutFeedback>
              {message._id === messageId && (
                <ReactNativeDialog
                  isVisible={toggleDialogVisable}
                  onBackdropPress={toggleDialog}
                  message={message}
                  items={[
                    {
                      name: `${message.stars.length ? "Unstar" : "Star"}`,
                      url: "",
                      tag: "messageStar",
                    },
                  ]}
                />
              )}
            </View>
          );
        case "link":
          return (
            <View style={chatAreaStyles.chatAreaCenterTexts}>
              <TouchableWithoutFeedback
                delayLongPress={500}
                onLongPress={() => {
                  if (message.sender._id === userRecord._id) {
                    dispatch(
                      successEditMessageActions({
                        status: true,
                        record: { message: message.message, _id: message._id },
                      })
                    );
                    setMessageId(message._id);
                    toggleDialog();
                  }
                }}
              >
                <View
                  style={[
                    chatAreaStyles.chatAreaCenterContent,
                    message.sender._id === userRecord._id &&
                      chatAreaStyles.ownChatAreaCenterContent,
                  ]}
                >
                  <View style={chatAreaStyles.chatAreaMessage}>
                    {message.isGroup &&
                      message.sender._id !== userRecord._id && (
                        <Text style={chatAreaStyles.groupMemberName}>
                          {message.sender.name}
                        </Text>
                      )}
                    <Text style={chatAreaStyles.messageLink}>
                      <Link href={message.message}>{message.message}</Link>
                    </Text>
                    <Text style={chatAreaStyles.messageTime}>
                      {getStarMessage && <Icon name="star" size={13} />}{" "}
                      {format(message.createdAt, "HH:mm")}
                    </Text>
                  </View>
                </View>
              </TouchableWithoutFeedback>
              {message._id === messageId && (
                <ReactNativeDialog
                  isVisible={toggleDialogVisable}
                  onBackdropPress={toggleDialog}
                  message={message}
                  items={[
                    {
                      name: `${message.stars.length ? "Unstar" : "Star"}`,
                      url: "",
                      tag: "messageStar",
                    },
                  ]}
                />
              )}
            </View>
          );
        case "audio":
          return (
            <View style={chatAreaStyles.chatAreaCenterTexts}>
              <TouchableWithoutFeedback
                delayLongPress={500}
                onLongPress={() => {
                  if (message.sender._id === userRecord._id) {
                    dispatch(
                      successEditMessageActions({
                        status: true,
                        record: { message: message.message, _id: message._id },
                      })
                    );
                    setMessageId(message._id);
                    toggleDialog();
                  }
                }}
              >
                <View
                  style={[
                    chatAreaStyles.chatAreaCenterContent,
                    message.sender._id === userRecord._id &&
                      chatAreaStyles.ownChatAreaCenterContent,
                  ]}
                >
                  <View style={chatAreaStyles.chatAreaMessage}>
                    {message.isGroup &&
                      message.sender._id !== userRecord._id && (
                        <Text style={chatAreaStyles.groupMemberName}>
                          {message.sender.name}
                        </Text>
                      )}
                    {/* <Audio
                    controls
                    source={{ uri: `${process.env.EXPO_PUBLIC_BASE_URL}/audio/messages/${message.message}` }}
                    style={chatAreaStyles.audioMessage}
                  /> */}

                    <View style={chatAreaStyles.container}>
                      <TouchableOpacity
                        onPress={() =>
                          handlePlayPause(
                            `${process.env.EXPO_PUBLIC_BASE_URL}/audio/messages/${message.message}`
                          )
                        }
                        style={chatAreaStyles.playPauseButton}
                      >
                        <Text style={chatAreaStyles.playPauseText}>
                          {isPlaying ? "Pause" : "Play"}
                        </Text>
                      </TouchableOpacity>
                      <Slider
                        style={chatAreaStyles.slider}
                        minimumValue={0}
                        maximumValue={1}
                        value={position / duration}
                        onValueChange={handleSliderValueChange}
                      />
                      <View style={chatAreaStyles.timeContainer}>
                        <Text>{formatTime(position)}</Text>
                        <Text>{formatTime(duration)}</Text>
                      </View>
                    </View>

                    <Text style={chatAreaStyles.messageTime}>
                      {getStarMessage && <Icon name="star" size={13} />}{" "}
                      {format(message.createdAt, "HH:mm")}
                    </Text>
                  </View>
                </View>
              </TouchableWithoutFeedback>
              {message._id === messageId && (
                <ReactNativeDialog
                  isVisible={toggleDialogVisable}
                  onBackdropPress={toggleDialog}
                  message={message}
                  items={[
                    {
                      name: `${message.stars.length ? "Unstar" : "Star"}`,
                      url: "",
                      tag: "messageStar",
                    },
                  ]}
                />
              )}
            </View>
          );
        case "action":
          return (
            <View style={chatAreaStyles.chatAreaCenterTexts}>
              <View
                style={[
                  chatAreaStyles.chatAreaCenterContent,
                  chatAreaStyles.actionMessageChatAreaCenterContent,
                ]}
              >
                <View style={chatAreaStyles.chatAreaMessage}>
                  <Text style={chatAreaStyles.actionMessage}>
                    {message.message}
                  </Text>
                </View>
              </View>
            </View>
          );
        default:
          return (
            <View style={chatAreaStyles.chatAreaCenterTexts}>
              <TouchableWithoutFeedback
                delayLongPress={500}
                onLongPress={() => {
                  if (message.sender._id === userRecord._id) {
                    dispatch(
                      successEditMessageActions({
                        status: true,
                        record: { message: message.message, _id: message._id },
                      })
                    );
                    setMessageId(message._id);
                    toggleDialog();
                  }
                }}
              >
                <View
                  style={[
                    chatAreaStyles.chatAreaCenterContent,
                    message.sender._id === userRecord._id &&
                      chatAreaStyles.ownChatAreaCenterContent,
                  ]}
                >
                  <View style={chatAreaStyles.chatAreaMessage}>
                    {message.isGroup &&
                      message.sender._id !== userRecord._id && (
                        <Text style={chatAreaStyles.groupMemberName}>
                          {message.sender.name}
                        </Text>
                      )}
                    <Text style={chatAreaStyles.messageText}>
                      {message.message}
                    </Text>
                    <Text style={chatAreaStyles.messageTime}>
                      {getStarMessage && <Icon name="star" size={13} />}{" "}
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
              </TouchableWithoutFeedback>

              {message._id === messageId && (
                <ReactNativeDialog
                  isVisible={toggleDialogVisable}
                  onBackdropPress={toggleDialog}
                  message={message}
                  items={[
                    {
                      name: "Edit",
                      url: "/(screens)/chatList/edit-message",
                      tag: "messageEdit",
                    },
                    {
                      name: `${message.stars.length ? "Unstar" : "Star"}`,
                      url: "",
                      tag: "messageStar",
                    },
                  ]}
                />
              )}
            </View>
          );
      }
    };

    return (
      <View
        key={message._id}
        style={[
          chatAreaStyles.message,
          message.sender._id === userRecord._id && chatAreaStyles.ownMessage,
          message.type === "action" && chatAreaStyles.actionMessage,
        ]}
      >
        {renderMessageContent()}
      </View>
    );
  };

  return (
    <Fragment>
      {chatMessageSlice.chatMessages?.groupedMessages?.map(
        (groupMessage: { messages: []; date: string }, index: number) => (
          <Fragment key={index}>
            <View style={chatAreaStyles.groupedDate}>
              <Text>{dateCreated(groupMessage.date)}</Text>
            </View>
            {groupMessage?.messages?.map(renderMessages)}
          </Fragment>
        )
      )}
    </Fragment>
  );
};

export default ChatAreaCenterLevel;
