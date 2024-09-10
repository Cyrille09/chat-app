import {
  successDisplayEmojiActions,
  successSendDocumentMessageActions,
  successSendImageMessageActions,
} from "@/redux-toolkit/reducers/actionsSlice";
import { RootState } from "@/redux-toolkit/store";
import {
  sendAudio,
  sendGroupAudio,
  sendGroupMessage,
  sendMessage,
} from "@/services/messagesServices";
import { addDays, addHours, addWeeks } from "date-fns";
import { Form, Formik } from "formik";
import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { socket } from "../websocket/websocket";
import { IoMdSend } from "react-icons/io";
import {
  FaImage,
  FaMicrophone,
  FaPauseCircle,
  FaSmile,
  FaTrash,
} from "react-icons/fa";
import { IoCloseSharp } from "react-icons/io5";

import { TiAttachmentOutline } from "react-icons/ti";
import EmojiPicker from "emoji-picker-react";
import { Input } from "../fields/input";
import { UserInterface } from "../globalTypes/GlobalTypes";

const ChatAreaBottomLevel = ({ user }: { user: UserInterface }) => {
  const actionsSlice = useSelector((state: RootState) => state.actionsSlice);
  const usersSlice = useSelector((state: RootState) => state.usersSlice);

  const dispatch = useDispatch();
  const [open, setOpen] = useState(false);
  const userRecord = user.user;
  const selectedUser = usersSlice.selectedUser;
  const [isRecording, setIsRecording] = useState(false);
  const [audioBlob, setAudioBlob] = useState(null);
  const mediaRecorderRef: any = useRef<HTMLInputElement>(null);
  const [showAudioInfo, setShowAudioInfo] = useState(false);

  const startRecording = async () => {
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

  const stopRecording = () => {
    if (
      mediaRecorderRef.current &&
      mediaRecorderRef.current.state !== "inactive"
    ) {
      mediaRecorderRef.current.stop();
    }

    setIsRecording(false);
  };

  const deleteRecording = () => {
    setIsRecording(false);
    setShowAudioInfo(false);
    setAudioBlob(null);
    mediaRecorderRef.current = null;
  };

  const photoInputRef: any = useRef(null);
  const fileInputRef: any = useRef(null);

  const handleMessageSend = (values: any, { resetForm }: any) => {
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

  const handleKeyDown = (event: any) => {
    if (event.key === "Enter") {
      event.preventDefault();
      event.target.form.dispatchEvent(
        new Event("submit", { cancelable: true, bubbles: true })
      );
    }
  };

  const handleMessageSendAudio = () => {
    const data: any = new FormData();
    data.append("message", audioBlob, "recording.wav");

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
        })
        .catch((error) => {});
    }
  };

  const handleButtonClick = () => {
    photoInputRef.current.click();
  };

  const handleFileButtonClick = () => {
    fileInputRef.current.click();
  };

  const handleChangePicture = (e: any) => {
    const file = e.target.files[0];

    if (file) {
      const reader = new FileReader();

      reader.onloadend = () => {
        dispatch(
          successSendImageMessageActions({
            status: true,
            record: {
              selectedImage: reader.result,
              message: file,
              saveButton: false,
            },
          })
        );
      };
      reader.readAsDataURL(file);
    }
  };

  const handleChangeFile = (e: any) => {
    const file = e.target.files[0];

    if (file) {
      const reader = new FileReader();

      reader.onloadend = () => {
        dispatch(
          successSendDocumentMessageActions({
            status: true,
            record: {
              selectedImage: reader.result,
              message: file,
              saveButton: false,
            },
          })
        );
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <>
      <Formik initialValues={{ message: "" }} onSubmit={handleMessageSend}>
        {({
          handleBlur,
          handleChange,
          setFieldValue,
          handleSubmit,
          errors,
          values,
        }) => {
          const sendAndAudio = () => {
            if (values.message) {
              return (
                <IoMdSend
                  className="chatAreaBottomSendIcon"
                  onClick={() => {
                    handleSubmit();
                  }}
                />
              );
            } else {
              if (!isRecording) {
                return (
                  <>
                    <FaMicrophone
                      className="chatAreaBottomIcon"
                      onClick={startRecording}
                    />
                  </>
                );
              }
            }
          };

          return (
            <Form>
              <div className="row">
                {!showAudioInfo ? (
                  <>
                    <div className="col-sm-2 icons">
                      <input
                        ref={photoInputRef}
                        type="file"
                        id="message"
                        name="message"
                        placeholder="message image"
                        accept=".jpg, .png, .jpeg"
                        required
                        onBlur={handleBlur("message")}
                        autoCapitalize="none"
                        onChange={handleChangePicture}
                        multiple={true}
                      />
                      <FaImage
                        className={`chatAreaBottomImage`}
                        onClick={() => {
                          !selectedUser.blockStatus && handleButtonClick();
                        }}
                      />

                      <input
                        ref={fileInputRef}
                        type="file"
                        id="message"
                        name="message"
                        placeholder="message file"
                        accept="application/pdf, .docx, .doc"
                        required
                        onBlur={handleBlur("message")}
                        autoCapitalize="none"
                        onChange={handleChangeFile}
                        multiple={true}
                      />
                      <TiAttachmentOutline
                        className="chatAreaBottomImage"
                        onClick={() => {
                          !selectedUser.blockStatus && handleFileButtonClick();
                        }}
                      />
                      {actionsSlice.successDisplayEmoji.status ? (
                        <IoCloseSharp
                          size={26}
                          className="chatAreaBottomImageClose"
                          onClick={() => {
                            // setOpen((prev) => !prev);
                            setOpen(false);
                            dispatch(
                              successDisplayEmojiActions({
                                status: false,
                                record: {},
                              })
                            );
                          }}
                        />
                      ) : (
                        <FaSmile
                          className="chatAreaBottomImage"
                          onClick={() => {
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
                        />
                      )}
                      <div className="emoji">
                        <div className="picker">
                          <EmojiPicker
                            open={open}
                            onEmojiClick={(value) => {
                              if (!selectedUser.blockStatus) {
                                setFieldValue(
                                  "message",
                                  values.message + value.emoji
                                );
                              }
                            }}
                          />
                        </div>
                      </div>
                    </div>
                    <div className="col-sm-9">
                      <div>
                        <Input
                          placeholder="Type a message..."
                          name="message"
                          required
                          id="message"
                          onBlur={handleBlur("message")}
                          autoCapitalize="none"
                          onChange={handleChange("message")}
                          error={errors.message}
                          onKeyDown={handleKeyDown}
                          disabled={selectedUser.blockStatus ? true : false}
                        />
                      </div>
                    </div>
                    <div className="col-sm-1 chatAreaSend">
                      <div>{!selectedUser.blockStatus && sendAndAudio()}</div>
                    </div>
                  </>
                ) : (
                  <div className="icons">
                    {isRecording && (
                      <div className="recordingAudio">
                        <FaTrash
                          className="audioIcon"
                          onClick={deleteRecording}
                        />
                        <span>Recording...</span>

                        <FaPauseCircle
                          className="recordingAudioPause"
                          onClick={stopRecording}
                        />
                      </div>
                    )}

                    {audioBlob && (
                      <div className="recordedAudio">
                        <FaTrash
                          className="audioIcon"
                          onClick={deleteRecording}
                        />

                        <span>
                          <audio
                            controls
                            src={URL.createObjectURL(audioBlob)}
                          ></audio>
                        </span>

                        <IoMdSend
                          className="chatAreaBottomSendIcon"
                          onClick={handleMessageSendAudio}
                        />
                      </div>
                    )}
                  </div>
                )}
              </div>
            </Form>
          );
        }}
      </Formik>
    </>
  );
};

export default ChatAreaBottomLevel;
