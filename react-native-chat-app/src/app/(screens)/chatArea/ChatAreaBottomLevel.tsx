import { addDays, addHours, addWeeks } from "date-fns";
import { Form, Formik } from "formik";
import { useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import * as ImagePicker from "expo-image-picker";
import { UserInterface } from "@/src/components/globalTypes/GlobalTypes";
import { RootState } from "@/src/redux-toolkit/store";
import { Picker } from "emoji-mart-native";

import {
  successDisplayEmojiActions,
  successSendDocumentMessageActions,
  successSendImageMessageActions,
} from "@/src/redux-toolkit/reducers/actionsSlice";
import {
  sendAudio,
  sendDocument,
  sendGroupAudio,
  sendGroupDocument,
  sendGroupImage,
  sendGroupMessage,
  sendImage,
  sendMessage,
} from "@/src/services/messagesServices";
import { socket } from "@/src/components/websocket/websocket";
import { TouchableOpacity, View, Text } from "react-native";
import styles from "./chatAreaStyles";
import { Icon } from "@rneui/base";
import { GlobalTextInput } from "@/src/components/globalTextInput/GlobalTextInput";
import * as DocumentPicker from "expo-document-picker";
import { Audio } from "expo-av";
import * as FileSystem from "expo-file-system";

const ChatAreaBottomLevel = ({ user }: { user: UserInterface }) => {
  const actionsSlice = useSelector((state: RootState) => state.actionsSlice);
  const usersSlice = useSelector((state: RootState) => state.usersSlice);

  const dispatch = useDispatch();
  const [open, setOpen] = useState(false);
  const userRecord = user.user;
  const selectedUser = usersSlice.selectedUser;
  // const [isRecording, setIsRecording] = useState(null);
  const [audioBlob, setAudioBlob] = useState(null);
  const mediaRecorderRef: any = useRef(null);
  const [showAudioInfo, setShowAudioInfo] = useState(false);

  const [isRecording, setIsRecording] = useState<Audio.Recording | null | any>(
    null
  );
  const [recordedURI, setRecordedURI] = useState<string | null>(null);
  const AudioText: any = Audio;

  const recordingOptions: any = {
    android: {
      extension: ".m4a",
      outputFormat: AudioText.RECORDING_OPTION_ANDROID_OUTPUT_FORMAT_MPEG_4,
      audioEncoder: AudioText.RECORDING_OPTION_ANDROID_AUDIO_ENCODER_AAC,
      sampleRate: 44100,
      numberOfChannels: 2,
      bitRate: 128000,
    },
    ios: {
      extension: ".m4a",
      audioQuality: AudioText.RECORDING_OPTION_IOS_AUDIO_QUALITY_HIGH,
      sampleRate: 44100,
      numberOfChannels: 2,
      bitRate: 128000,
      linearPCMBitDepth: 16,
      linearPCMIsBigEndian: false,
      linearPCMIsFloat: false,
    },
  };

  const startRecordingAAA = async () => {
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream);
      mediaRecorderRef.current.start();

      let chunks: any = [];
      mediaRecorderRef.current.ondataavailable = (e: any) => {
        chunks.push(e.data);
      };

      mediaRecorderRef.current.onstop = () => {
        const blob: any = new Blob(chunks, { type: "audio/wav" });
        setAudioBlob(blob);
        chunks = [];
      };

      setIsRecording(true);
      setShowAudioInfo(true);
    }
  };

  const startRecording = async () => {
    try {
      await Audio.requestPermissionsAsync();

      const recording = new Audio.Recording();
      await recording
        .prepareToRecordAsync
        // Audio.RECORDING_OPTIONS_PRESET_HIGH_QUALITY
        ();
      await recording.startAsync();

      setIsRecording(recording);
      setShowAudioInfo(true);
    } catch (error) {}
  };

  const stopRecordingAAA = () => {
    if (
      mediaRecorderRef.current &&
      mediaRecorderRef.current.state !== "inactive"
    ) {
      mediaRecorderRef.current.stop();
    }

    setIsRecording(false);
  };

  const stopRecording = async () => {
    if (isRecording) {
      await isRecording.stopAndUnloadAsync();
      const uri = isRecording.getURI();
      setRecordedURI(uri);
      setIsRecording(null);
    }
  };

  const deleteRecording = () => {
    setShowAudioInfo(false);
    setRecordedURI(null);
    setIsRecording(null);

    mediaRecorderRef.current = null;
  };

  const handleMessageSend = (
    values: { message: string },
    { resetForm }: any
  ) => {
    dispatch(
      successDisplayEmojiActions({
        status: false,
        record: {},
      })
    );
    setOpen(false);

    if (selectedUser.isGroup) {
      let disappearStatus: {
        disappear: string | undefined;
        disappearTime: Date | undefined;
      } = {
        disappear: undefined,
        disappearTime: undefined,
      };
      if (selectedUser.group?.disappearIn) {
        disappearStatus.disappear = "yes";

        if (selectedUser.group.disappearIn === "6 hours") {
          disappearStatus.disappearTime = addHours(new Date(), 6);
        }

        if (selectedUser.group.disappearIn === "1 day") {
          disappearStatus.disappearTime = addDays(new Date(), 1);
        }

        if (selectedUser.group.disappearIn === "1 week") {
          disappearStatus.disappearTime = addWeeks(new Date(), 1);
        }
      }
      sendGroupMessage(
        {
          message: values.message,
          disappear: disappearStatus.disappear,
          disappearTime: disappearStatus.disappearTime,
        },
        selectedUser.group._id
      )
        .then((response) => {
          socket.emit("messageGroup", {
            groupId: selectedUser.group._id,
          });
        })
        .catch((error) => {});
    } else {
      let disappearStatus: {
        disappear: string | undefined;
        disappearTime: Date | undefined;
      } = {
        disappear: undefined,
        disappearTime: undefined,
      };

      if (selectedUser.disappearIn) {
        disappearStatus.disappear = "yes";

        if (selectedUser.disappearIn === "6 hours") {
          disappearStatus.disappearTime = addHours(new Date(), 6);
        }

        if (selectedUser.disappearIn === "1 day") {
          disappearStatus.disappearTime = addDays(new Date(), 1);
        }

        if (selectedUser.disappearIn === "1 week") {
          disappearStatus.disappearTime = addWeeks(new Date(), 1);
        }
      }

      sendMessage(
        {
          message: values.message,
          disappear: disappearStatus.disappear,
          disappearTime: disappearStatus.disappearTime,
        },
        usersSlice.selectedUser.user
      )
        .then((response) => {
          socket.emit("message", { ...response.data, currentUser: userRecord });
        })
        .catch((error) => {});
    }

    resetForm();
  };

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      dispatch(
        successSendImageMessageActions({
          status: true,
          record: {
            selectedImage: result.assets[0].uri,
            message: result.assets[0].uri,
            saveButton: true,
          },
        })
      );
    } else {
      dispatch(
        successSendImageMessageActions({
          status: false,
          record: {
            selectedImage: "",
            message: "",
            saveButton: false,
          },
        })
      );
    }
  };

  const pickDocument = async () => {
    let result = await DocumentPicker.getDocumentAsync({
      type: [
        "application/pdf",
        "application/msword",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      ], // MIME types for PDF and Word documents
      copyToCacheDirectory: true,
    });

    if (!result.canceled) {
      dispatch(
        successSendDocumentMessageActions({
          status: true,
          file: result.assets[0],
          record: {
            selectedImage: result.assets[0].uri,
            message: result.assets[0].uri,
            saveButton: true,
          },
        })
      );
    } else {
      dispatch(
        successSendDocumentMessageActions({
          status: false,
          file: null,
          record: {
            selectedImage: "",
            message: "",
            saveButton: false,
          },
        })
      );
    }
  };

  const handleMessageSendAudio = () => {
    console.log("recordedURI", recordedURI);
    if (!recordedURI) return;

    const data: any = new FormData();
    data.append("message", {
      uri: recordedURI,
      name: "recording.wav",
      type: "audio/wav",
    });

    // const data: any = new FormData();
    // data.append("message", audioBlob, "recording.wav");

    if (selectedUser.isGroup) {
      if (selectedUser.group?.disappearIn) {
        data.append("disappear", "yes");

        if (selectedUser.group.disappearIn === "6 hours") {
          data.append("disappearTime", addHours(new Date(), 6));
        }

        if (selectedUser.group.disappearIn === "1 day") {
          data.append("disappearTime", addDays(new Date(), 1));
        }

        if (selectedUser.group.disappearIn === "1 week") {
          data.append("disappearTime", addWeeks(new Date(), 1));
        }
      }

      data.append("isGroup", true);
      data.append("groupId", selectedUser.group._id);

      sendGroupAudio(data)
        .then((response) => {
          socket.emit("messageGroup", {
            groupId: selectedUser.group._id,
          });
          dispatch(
            successSendImageMessageActions({
              status: false,
              record: {
                selectedImage: "",
                message: "",
                saveButton: false,
              },
            })
          );
          setShowAudioInfo(false);
          mediaRecorderRef.current = null;
          setAudioBlob(null);
          setIsRecording(false);
          setRecordedURI(null);
        })
        .catch((error) => {});
    } else {
      data.append("receiver", JSON.stringify(selectedUser.user));

      if (selectedUser.disappearIn) {
        data.append("disappear", "yes");

        if (selectedUser.disappearIn === "6 hours") {
          data.append("disappearTime", addHours(new Date(), 6));
        }

        if (selectedUser.disappearIn === "1 day") {
          data.append("disappearTime", addDays(new Date(), 1));
        }

        if (selectedUser.disappearIn === "1 week") {
          data.append("disappearTime", addWeeks(new Date(), 1));
        }
      }

      sendAudio(data)
        .then((response) => {
          socket.emit("message", { ...response.data, currentUser: userRecord });
          dispatch(
            successSendImageMessageActions({
              status: false,
              record: {
                selectedImage: "",
                message: "",
                saveButton: false,
              },
            })
          );
          setShowAudioInfo(false);
          mediaRecorderRef.current = null;
          setAudioBlob(null);
          setIsRecording(false);
          setRecordedURI(null);
        })
        .catch((error) => {});
    }
  };

  // const sendAudio = async () => {
  //   if (recordedURI) {
  //     const formData = new FormData();
  //     formData.append('file', {
  //       uri: recordedURI,
  //       name: 'recording.m4a',
  //       type: 'audio/m4a',
  //     });

  //     try {
  //       const response = await fetch('http://your-server-url/upload', {
  //         method: 'POST',
  //         body: formData,
  //         headers: {
  //           'Content-Type': 'multipart/form-data',
  //         },
  //       });

  //       const result = await response.json();
  //       console.log('Audio sent successfully:', result);
  //     } catch (err) {
  //       console.error('Error sending audio:', err);
  //     }
  //   }
  // };

  return (
    <>
      <Formik initialValues={{ message: "" }} onSubmit={handleMessageSend}>
        {({
          handleBlur,
          handleChange,
          setFieldValue,
          handleSubmit,
          touched,
          errors,
          values,
        }) => {
          const sendAndAudio = () => {
            if (values.message) {
              return (
                // <IoMdSend
                //   className="chatAreaBottomSendIcon"
                //   onClick={() => {
                //     handleSubmit();
                //   }}
                // />
                <Icon
                  type="font-awesome"
                  name="send"
                  size={18}
                  color="#555"
                  onPress={() => handleSubmit()}
                />
              );
            } else {
              if (!isRecording) {
                return (
                  <>
                    <Icon
                      type="font-awesome"
                      name="microphone"
                      size={18}
                      color="#555"
                      onPress={startRecording}
                    />
                  </>
                );
              }
            }
          };
          return (
            <View style={styles.formContainer}>
              {!showAudioInfo ? (
                <View style={styles.chatAreaButtonRow}>
                  <View style={styles.icons}>
                    <TouchableOpacity>
                      <Icon
                        type="font-awesome"
                        name="image"
                        size={18}
                        color="#555"
                        onPress={pickImage}
                      />
                    </TouchableOpacity>

                    <TouchableOpacity>
                      <Icon
                        type="font-awesome"
                        name="paperclip"
                        size={18}
                        color="#555"
                        onPress={pickDocument}
                      />
                    </TouchableOpacity>

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
                          if (!selectedUser.blockStatus) {
                            setOpen(true);
                            dispatch(
                              successDisplayEmojiActions({
                                status: true,
                                record: {},
                              })
                            );
                          }
                        }}
                      >
                        {/* <FaSmile style={styles.chatAreaBottomImage} /> */}
                        <Icon
                          type="font-awesome"
                          name="smile-o"
                          size={18}
                          color="#555"
                        />
                      </TouchableOpacity>
                    )}

                    {open && (
                      <View style={styles.emojiPickerContainer}>
                        <Picker
                          onSelect={(emoji) => {
                            if (!selectedUser.blockStatus) {
                              setFieldValue(
                                "message",
                                values.message + emoji.native
                              );
                            }
                          }}
                          onPressClose={() => setOpen(false)}
                          theme="light" // or "dark"
                        />
                      </View>
                    )}
                  </View>

                  <View style={styles.inputContainer}>
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

                  <View style={styles.chatAreaSend}>
                    {!selectedUser.blockStatus && sendAndAudio()}
                  </View>
                </View>
              ) : (
                <View>
                  {isRecording && (
                    <View style={styles.chatAreaButtonRowRecording}>
                      <View style={styles.deleteRecording}>
                        <Icon
                          type="font-awesome"
                          name="trash"
                          size={18}
                          color="#555"
                          onPress={deleteRecording}
                        />
                      </View>
                      <View style={styles.playorShowRecording}>
                        <Text>Recording...</Text>
                      </View>
                      <View style={styles.sendOrStopRecording}>
                        <Icon
                          type="font-awesome"
                          name="pause"
                          size={18}
                          color="#555"
                          onPress={stopRecording}
                        />
                      </View>
                    </View>
                  )}

                  {recordedURI && (
                    <View style={styles.chatAreaButtonRowRecording}>
                      <View>
                        <Icon
                          type="font-awesome"
                          name="trash"
                          size={18}
                          color="#555"
                          onPress={deleteRecording}
                        />
                      </View>

                      <View style={styles.playorShowRecording}>
                        {/* <Audio
                            controls
                            source={{ uri: URL.createObjectURL(audioBlob) }}
                          /> */}
                        <Text>working fine</Text>
                      </View>
                      <View style={styles.sendOrStopRecording}>
                        <Icon
                          type="font-awesome"
                          name="send"
                          size={18}
                          color="#555"
                          onPress={handleMessageSendAudio}
                        />
                      </View>
                    </View>
                  )}
                </View>
              )}
            </View>
          );
        }}
      </Formik>
    </>
  );
};

export default ChatAreaBottomLevel;
