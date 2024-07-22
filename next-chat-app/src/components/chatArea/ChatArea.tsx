"use client";
import { useEffect, useRef, useState } from "react";
import { CSSTransition } from "react-transition-group";

import {
  FaChevronRight,
  FaBan,
  FaBrush,
  FaRegTrashAlt,
  FaInfoCircle,
  FaStar,
  FaBell,
  FaRedo,
  FaSearch,
  FaPhone,
  FaPhoneAlt,
  FaVideo,
  FaMicrophone,
  FaFile,
  FaPhotoVideo,
  FaImage,
  FaSmile,
  FaMixer,
  FaRegStopCircle,
  FaRegFilePdf,
  FaFilePdf,
  FaDownload,
  FaFileWord,
  FaAngleDown,
  FaChevronDown,
} from "react-icons/fa";
import { IoMdSend } from "react-icons/io";
import { TiAttachmentOutline } from "react-icons/ti";

import "./chatArea.scss";
import Image from "next/image";
import EmojiPicker from "emoji-picker-react";
import { GlobalButton } from "../button/GlobalButton";
import { Form, Formik } from "formik";
import { Input } from "../fields/input";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/redux-toolkit/store";
import {
  EditMessage,
  SearchMessages,
  SendDocumentMessage,
  SendImageMessage,
} from "../modelLists/ModalLists";
import {
  successDisplayEmojiActions,
  successEditMessageActions,
  successSearchMessagesActions,
  successSendDocumentMessageActions,
  successSendImageMessageActions,
} from "@/redux-toolkit/reducers/actionsSlice";
import AudioRecorder from "../audioRecorder/AudioRecorder";
import {
  getSenderAndReceiverMessages,
  sendDocument,
  sendGroupDocument,
  sendGroupImage,
  sendGroupMessage,
  sendImage,
  sendMessage,
  getGroupMessages,
} from "@/services/messagesServices";
import { socket } from "@/components/websocket/websocket";
import { chatMessagesRecord } from "@/redux-toolkit/reducers/chatMessageSlice";
import styles from "../modelLists/madal-lists.module.scss";
import { addDays, addHours, addWeeks, format } from "date-fns";
import { selectedUserRecord } from "@/redux-toolkit/reducers/usersSlice";
import MessageActionsPopup from "./MessageActionsPopup";

const ChatArea = ({ user }: any) => {
  const actionsSlice = useSelector((state: RootState) => state.actionsSlice);
  const usersSlice = useSelector((state: RootState) => state.usersSlice);
  const chatMessageSlice = useSelector(
    (state: RootState) => state.chatMessageSlice
  );

  const dispatch = useDispatch();
  const chatListRef = useRef<HTMLDivElement>(null);
  const [showPopup, setShowPopup] = useState(false);
  const [open, setOpen] = useState(false);
  const [messageId, setMessageId] = useState("");

  // start audio
  const [isRecording, setIsRecording] = useState(false);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(
    null
  );
  const audioChunks = useRef<Blob[]>([]);
  const userRecord = user.user;
  const selectedUser = usersSlice.selectedUser;

  useEffect(() => {
    let isSubscribed = true;

    const scrollToBottom = () => {
      if (chatListRef.current) {
        chatListRef.current.scrollTop = chatListRef.current.scrollHeight;
      }
    };

    socket.on("message", (response: any) => {
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
    });

    socket.on("updateMessage", (response: any) => {
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

    socket.on("starMessage", (response: any) => {
      if (
        isSubscribed &&
        (usersSlice.selectedUser.user._id === response.sender ||
          usersSlice.selectedUser.user._id === response.receiver)
      ) {
        getSenderAndReceiverMessagesData(usersSlice.selectedUser.user);
      }
    });

    socket.on("starGroupMessage", (response: any) => {
      if (
        isSubscribed &&
        selectedUser.isGroup &&
        response.groupId === selectedUser.group._id
      ) {
        getSenderAndReceiverMessagesData("");
      }
    });

    socket.on("userStatus", (response: any) => {
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

    socket.on("messageGroup", (response: any) => {
      scrollToBottom();

      if (
        isSubscribed &&
        selectedUser.isGroup &&
        response.groupId === selectedUser.group._id
      ) {
        getSenderAndReceiverMessagesData("");
      }
    });

    socket.on("updateGroupMessage", (response: any) => {
      if (
        isSubscribed &&
        selectedUser.isGroup &&
        response.groupId === selectedUser.group._id
      ) {
        getSenderAndReceiverMessagesData("");
      }
    });

    socket.on("disappearGroupMessage", async (response: any) => {
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
    });

    socket.on("updateContactUser", async (response: any) => {
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
    });

    const getSenderAndReceiverMessagesData = async (user: any) => {
      if (selectedUser.isGroup) {
        const chatMessages: any = await getGroupMessages(
          selectedUser.group._id
        );
        if (isSubscribed) {
          if (chatMessages?.data?.length) {
            dispatch(chatMessagesRecord(chatMessages.data));
          } else {
            dispatch(chatMessagesRecord([]));
          }
        }
      } else {
        const chatMessages: any = await getSenderAndReceiverMessages(user);
        if (isSubscribed) {
          if (chatMessages?.data?.length) {
            dispatch(chatMessagesRecord(chatMessages.data));
          } else {
            dispatch(chatMessagesRecord([]));
          }
        }
      }
    };
    scrollToBottom();

    return () => {
      isSubscribed = false;
      socket.off("message", (response: any) => {
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
      });

      socket.off("updateMessage", (response: any) => {
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

      socket.off("starMessage", (response: any) => {
        if (
          isSubscribed &&
          (usersSlice.selectedUser.user._id === response.sender ||
            usersSlice.selectedUser.user._id === response.receiver)
        ) {
          getSenderAndReceiverMessagesData(usersSlice.selectedUser.user);
        }
      });

      socket.off("starGroupMessage", (response: any) => {
        if (
          isSubscribed &&
          selectedUser.isGroup &&
          response.groupId === selectedUser.group._id
        ) {
          getSenderAndReceiverMessagesData("");
        }
      });

      socket.off("userStatus", (response: any) => {
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
      socket.off("messageGroup", (response: any) => {
        scrollToBottom();

        if (
          isSubscribed &&
          selectedUser.isGroup &&
          response.groupId === selectedUser.group._id
        ) {
          getSenderAndReceiverMessagesData("");
        }
      });

      socket.off("updateGroupMessage", (response: any) => {
        if (
          isSubscribed &&
          selectedUser.isGroup &&
          response.groupId === selectedUser.group._id
        ) {
          getSenderAndReceiverMessagesData("");
        }
      });

      socket.off("disappearGroupMessage", async (response: any) => {
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
      });

      socket.off("updateContactUser", async (response: any) => {
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
      });
    };
  }, [
    dispatch,
    selectedUser.user._id,
    userRecord._id,
    usersSlice.selectedUser,
    chatListRef,
    selectedUser,
  ]);

  // start =========================
  // useEffect(() => {
  //   const disableRightClick = (e: any) => {
  //     e.preventDefault();
  //   };
  //   document.addEventListener("contextmenu", disableRightClick);

  //   return () => {
  //     document.removeEventListener("contextmenu", disableRightClick);
  //   };
  // }, []);

  useEffect(() => {
    const disableDevToolsShortcuts = (e: any) => {
      if (
        e.key === "F12" ||
        (e.ctrlKey &&
          e.shiftKey &&
          (e.key === "I" || e.key === "J" || e.key === "C")) ||
        (e.ctrlKey && e.key === "U")
      ) {
        e.preventDefault();
      }
    };

    document.addEventListener("keydown", disableDevToolsShortcuts);

    return () => {
      document.removeEventListener("keydown", disableDevToolsShortcuts);
    };
  }, []);

  useEffect(() => {
    const checkDevTools = () => {
      if (
        window.outerWidth - window.innerWidth > 200 ||
        window.outerHeight - window.innerHeight > 200
      ) {
        alert("Developer tools are open. Please close them.");
      }
    };

    const interval = setInterval(checkDevTools, 1000);

    return () => {
      clearInterval(interval);
    };
  }, []);

  // useEffect(() => {
  //   const disableSelectAndCopy = (e: any) => {
  //     e.preventDefault();
  //   };

  //   document.addEventListener("selectstart", disableSelectAndCopy);
  //   document.addEventListener("copy", disableSelectAndCopy);

  //   return () => {
  //     document.removeEventListener("selectstart", disableSelectAndCopy);
  //     document.removeEventListener("copy", disableSelectAndCopy);
  //   };
  // }, []);
  // end =========================

  useEffect(() => {
    if (isRecording) {
      startRecording();
    } else if (mediaRecorder) {
      mediaRecorder.stop();
    }
  }, [isRecording, mediaRecorder]);

  const scrollToTop = () => {
    if (chatListRef.current) {
      chatListRef.current.scrollTop = chatListRef.current.scrollHeight;
    }
  };

  const startRecording = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    const recorder = new MediaRecorder(stream);
    setMediaRecorder(recorder);

    recorder.ondataavailable = (event) => {
      audioChunks.current.push(event.data);
    };

    recorder.onstop = () => {
      const audioBlob = new Blob(audioChunks.current, { type: "audio/wav" });
      const audioUrl = URL.createObjectURL(audioBlob);
      setAudioUrl(audioUrl);
      audioChunks.current = [];
    };

    recorder.start();
  };

  const handleStartRecording = () => {
    setIsRecording(true);
  };

  const handleStopRecording = () => {
    setIsRecording(false);
  };

  const handleSendAudio = () => {
    if (audioUrl) {
      // Here you can send the audio to your server or another destination
      console.log("Audio URL:", audioUrl);
    }
  };

  // end of audio

  const endRef = useRef(null);
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

  const handleSendImage = () => {
    const data: any = new FormData();
    data.append("message", actionsSlice.successSendImageMessage.record.message);

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

      sendGroupImage(data)
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

      sendImage(data)
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
        })
        .catch((error) => {});
    }
  };

  const handleSendDocument = () => {
    const data: any = new FormData();
    data.append(
      "message",
      actionsSlice.successSendDocumentMessage.record.message
    );

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

      sendGroupDocument(data)
        .then((response) => {
          socket.emit("messageGroup", {
            groupId: selectedUser.group._id,
          });
          dispatch(
            successSendDocumentMessageActions({
              status: false,
              record: {
                selectedImage: "",
                message: "",
                saveButton: false,
              },
            })
          );
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
      sendDocument(data)
        .then((response) => {
          socket.emit("message", { ...response.data, currentUser: userRecord });
          dispatch(
            successSendDocumentMessageActions({
              status: false,
              record: {
                selectedImage: "",
                message: "",
                saveButton: false,
              },
            })
          );
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

  const setProfileImage = selectedUser.isGroup ? (
    <>
      {selectedUser.group.photoUrl ? (
        <Image
          height="50"
          width="50"
          src={`${process.env.baseUrl}/images/groups/${selectedUser.group.photoUrl}`}
          alt=""
        />
      ) : (
        <div className="chatListItemUserNoImage">
          <p>
            {selectedUser.group.name
              .split(" ")
              .map((data: string) => data.charAt(0))
              .slice(0, 2)
              .join("")}
          </p>
        </div>
      )}
    </>
  ) : (
    <>
      {selectedUser.user.photoUrl ? (
        <Image
          height="50"
          width="50"
          src={`${process.env.baseUrl}/images/profile/${selectedUser.user.photoUrl}`}
          alt=""
        />
      ) : (
        <div className="chatListItemUserNoImage">
          <p>
            {selectedUser.user.name
              .split(" ")
              .map((data: string) => data.charAt(0))
              .slice(0, 2)
              .join("")}
          </p>
        </div>
      )}
    </>
  );

  const displayStatus = () => {
    if (selectedUser.isGroup) {
      const names = chatMessageSlice.chatGroupMembers
        .map(
          (member: { user: { name: string } }) => member.user.name.split(" ")[0]
        )
        .join(", ");

      return (
        <>
          <span className="chatAreaTopTextsName">
            {selectedUser.group.name}
          </span>

          <p className="groupMembers">
            {names.length > 50 ? `${names.substring(0, 70)}...` : names}
          </p>
        </>
      );
    } else {
      return (
        <>
          <span className="chatAreaTopTextsName">{selectedUser.user.name}</span>
          {usersSlice.selectedUser.user.lastSeen.status ? (
            <p>
              <span className="chatAreaTopLastOnline">Online</span>
            </p>
          ) : (
            <p>
              <span className="chatAreaTopLastSeen">
                {usersSlice.selectedUser.user.lastSeen.date ? (
                  `Last seen: ${format(
                    usersSlice.selectedUser.user.lastSeen.date,
                    "dd-MM-yyyy HH:mm"
                  )}`
                ) : (
                  <span className="chatAreaTopOffline">offline</span>
                )}
              </span>
            </p>
          )}
        </>
      );
    }
  };

  const handleIconClick = (messageId: string) => {
    setShowPopup(!showPopup);
    setMessageId(messageId);
  };

  const handleClosePopup = () => {
    setShowPopup(false);
    setMessageId("");
  };

  return (
    <>
      {/* Search messages */}
      <CSSTransition
        in={actionsSlice.successSearchMessages.status}
        timeout={100}
        classNames="panel-animate"
        onEnter={() => document.body.classList.add("css-transition-modal-open")}
        onExited={() =>
          document.body.classList.remove("css-transition-modal-open")
        }
        unmountOnExit={true}
        mountOnEnter={true}
      >
        <SearchMessages show={actionsSlice.successSearchMessages.status} />
      </CSSTransition>

      {/* Send image message */}
      {actionsSlice.successSendImageMessage.status && (
        <SendImageMessage
          show={actionsSlice.successSendImageMessage.status}
          handleClose={() =>
            dispatch(
              successSendImageMessageActions({
                status: false,
                record: {
                  selectedImage: "",
                  message: "",
                  saveButton: false,
                },
              })
            )
          }
          footer={
            <>
              <div className={styles.flexRowWrapModalFooter}>
                <div className={styles.footerLeft}>
                  <GlobalButton
                    format="white"
                    size="sm"
                    onClick={() =>
                      dispatch(
                        successSendImageMessageActions({
                          status: false,
                          record: {
                            selectedImage: "",
                            message: "",
                            saveButton: false,
                          },
                        })
                      )
                    }
                  >
                    Cancel
                  </GlobalButton>
                </div>
                <div>
                  <GlobalButton
                    format="success"
                    size="sm"
                    onClick={() => handleSendImage()}
                  >
                    Send
                  </GlobalButton>
                </div>
              </div>
            </>
          }
        />
      )}

      {/* Send document message */}
      {actionsSlice.successSendDocumentMessage.status && (
        <SendDocumentMessage
          show={actionsSlice.successSendDocumentMessage.status}
          handleClose={() =>
            dispatch(
              successSendDocumentMessageActions({
                status: false,
                record: {
                  selectedImage: "",
                  message: "",
                  saveButton: false,
                },
              })
            )
          }
          footer={
            <>
              <div className={styles.flexRowWrapModalFooter}>
                <div className={styles.footerLeft}>
                  <GlobalButton
                    format="white"
                    size="sm"
                    onClick={() =>
                      dispatch(
                        successSendDocumentMessageActions({
                          status: false,
                          record: {
                            selectedImage: "",
                            message: "",
                            saveButton: false,
                          },
                        })
                      )
                    }
                  >
                    Cancel
                  </GlobalButton>
                </div>
                <div>
                  <GlobalButton
                    format="success"
                    size="sm"
                    onClick={() => handleSendDocument()}
                  >
                    Send
                  </GlobalButton>
                </div>
              </div>
            </>
          }
        />
      )}

      {/* edit message */}
      {actionsSlice.successEditMessage.status && (
        <EditMessage
          show={actionsSlice.successEditMessage.status}
          user={userRecord}
          handleClose={() =>
            dispatch(
              successEditMessageActions({
                status: false,
                record: {
                  message: "",
                  _id: "",
                },
              })
            )
          }
          footer={
            <>
              <div className={styles.flexRowWrapModalFooter}>
                <div className={styles.footerLeft}>
                  <GlobalButton
                    format="white"
                    size="sm"
                    onClick={() =>
                      dispatch(
                        successEditMessageActions({
                          status: false,
                          record: {
                            message: "",
                            _id: "",
                          },
                        })
                      )
                    }
                  >
                    Cancel
                  </GlobalButton>
                </div>
                <div>
                  <GlobalButton format="success" size="sm" type="submit">
                    Send
                  </GlobalButton>
                </div>
              </div>
            </>
          }
        />
      )}

      {selectedUser.status ? (
        <div className="chatArea">
          <div className="chatAreaTop">
            <div className="user">
              {setProfileImage}
              <div className="chatAreaTopTexts">{displayStatus()}</div>
            </div>
            <div className="icons">
              <FaVideo
                className="chartTopIcon"
                onClick={() => alert("Coming soon")}
              />
              <FaPhoneAlt
                className="chartTopIcon"
                onClick={() => alert("Coming soon")}
              />
              <FaSearch
                className="chartTopIcon"
                onClick={() =>
                  dispatch(
                    successSearchMessagesActions({ status: true, record: {} })
                  )
                }
              />
            </div>
          </div>

          <div className="chatAreaCenter" ref={chatListRef}>
            {chatMessageSlice.chatMessages?.map(
              (message: any, index: number) => {
                const getStarMessage = message.stars?.some(
                  (user: any) => user.user === userRecord._id
                );

                const showMessages = () => {
                  if (message.type === "image") {
                    return (
                      <div className="chatAreaCenterTexts">
                        <div className="chatAreaCenterContent">
                          <div className="chatAreaCenterOptionsIcon">
                            <span className="optionsSpan">*</span>
                            <span className="popup-message">
                              <FaChevronDown
                                className="contactInfoGroupMemberIcon optionsBtn"
                                onClick={() => {
                                  handleIconClick(message._id);
                                }}
                              />
                              {showPopup && messageId === message._id && (
                                <MessageActionsPopup
                                  currentUser={userRecord}
                                  type="image"
                                  message={message}
                                  onClose={handleClosePopup}
                                />
                              )}
                            </span>
                          </div>
                          <div className="chatAreaMessage">
                            {message.isGroup &&
                              message.sender._id !== userRecord._id && (
                                <div className="groupMemberName">
                                  <span>{message.sender.name}</span>
                                </div>
                              )}
                            <span className="messageList">
                              <Image
                                src={`${process.env.baseUrl}/images/messages/${message.message}`}
                                height="250"
                                width="250"
                                alt=""
                                className="userProfileAvatar"
                              />
                            </span>{" "}
                            <br />{" "}
                            <div className="messageTime">
                              {getStarMessage && <FaStar />}{" "}
                              {format(message.createdAt, "dd/MM/yyyy HH:mm")}
                            </div>{" "}
                          </div>
                        </div>
                      </div>
                    );
                  } else if (message.type === "document") {
                    const ext = message.message.split(".").pop();
                    const documentFormat = () => {
                      if (ext === "pdf") {
                        return (
                          <span className="messageList">
                            <span>
                              <FaFilePdf
                                size={25}
                                className="documentSavePdf"
                              />
                              <span className="documentTitle">
                                {message.message}
                              </span>
                            </span>
                          </span>
                        );
                      } else if (["docx", "doc"].includes(ext)) {
                        return (
                          <span className="messageList">
                            <span>
                              <FaFileWord
                                size={25}
                                className="documentSaveWord"
                              />
                              <span className="documentTitle">
                                {message.message}
                              </span>
                            </span>
                            {/* <span className="documentSaveDownload">
                              {" "}
                              <GlobalButton
                                format="none"
                                size="sm"
                                target="_blank"
                                href={`${process.env.baseUrl}/documents/messages/${message.message}`}
                              >
                                <FaDownload className="documentSaveDownloadIcon" />
                              </GlobalButton>
                            </span> */}
                          </span>
                        );
                      }
                    };
                    return (
                      <div className="chatAreaCenterTexts">
                        <div className="chatAreaCenterContent">
                          <div className="chatAreaCenterOptionsIcon">
                            <span className="optionsSpan">*</span>
                            <span className="popup-message">
                              <FaChevronDown
                                className="contactInfoGroupMemberIcon optionsBtn"
                                onClick={() => {
                                  handleIconClick(message._id);
                                }}
                              />
                              {showPopup && messageId === message._id && (
                                <MessageActionsPopup
                                  currentUser={userRecord}
                                  type="document"
                                  message={message}
                                  onClose={handleClosePopup}
                                />
                              )}
                            </span>
                          </div>
                          <div className="chatAreaMessage">
                            {message.isGroup &&
                              message.sender._id !== userRecord._id && (
                                <div className="groupMemberName">
                                  <span>{message.sender.name}</span>
                                </div>
                              )}
                            <span>{documentFormat()}</span> <br />{" "}
                            <div className="messageTime">
                              {getStarMessage && <FaStar />}{" "}
                              {format(message.createdAt, "dd/MM/yyyy HH:mm")}
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  } else if (message.type === "link") {
                    return (
                      <div className="chatAreaCenterTexts">
                        <div className="chatAreaCenterContent">
                          <div className="chatAreaCenterOptionsIcon">
                            <span className="optionsSpan">*</span>
                            <span className="popup-message">
                              <FaChevronDown
                                className="contactInfoGroupMemberIcon optionsBtn"
                                onClick={() => {
                                  handleIconClick(message._id);
                                }}
                              />
                              {showPopup && messageId === message._id && (
                                <MessageActionsPopup
                                  currentUser={userRecord}
                                  type="link"
                                  message={message}
                                  onClose={handleClosePopup}
                                />
                              )}
                            </span>
                          </div>
                          <div className="chatAreaMessage">
                            {message.isGroup &&
                              message.sender._id !== userRecord._id && (
                                <div className="groupMemberName">
                                  <span>{message.sender.name}</span>
                                </div>
                              )}
                            <span>
                              <span className="messageLink">
                                {message.message}
                              </span>
                            </span>{" "}
                            <br />{" "}
                            <div className="messageTime">
                              {getStarMessage && <FaStar />}{" "}
                              {format(message.createdAt, "dd/MM/yyyy HH:mm")}
                            </div>{" "}
                          </div>
                        </div>
                      </div>
                    );
                  } else if (message.type === "action") {
                    return (
                      <div className="chatAreaCenterTexts">
                        <div className="chatAreaCenterContent">
                          <div className="chatAreaMessage">
                            <span className="actionMessageList">
                              {message.message}
                            </span>{" "}
                          </div>
                        </div>
                      </div>
                    );
                  } else {
                    return (
                      <div className="chatAreaCenterTexts">
                        <div className="chatAreaCenterContent">
                          <div className="chatAreaCenterOptionsIcon">
                            <span className="optionsSpan">*</span>
                            <span className="popup-message">
                              <FaChevronDown
                                className="contactInfoGroupMemberIcon optionsBtn"
                                onClick={() => {
                                  handleIconClick(message._id);
                                }}
                              />
                              {showPopup && messageId === message._id && (
                                <MessageActionsPopup
                                  currentUser={userRecord}
                                  type="text"
                                  message={message}
                                  onClose={handleClosePopup}
                                />
                              )}
                            </span>
                          </div>

                          <div className="chatAreaMessage">
                            {message.isGroup &&
                              message.sender._id !== userRecord._id && (
                                <div className="groupMemberName">
                                  <span>{message.sender.name}</span>
                                </div>
                              )}
                            <span className="messageList">
                              {" "}
                              {message.message}
                            </span>{" "}
                            <br />{" "}
                            <div className="messageTime">
                              {getStarMessage && <FaStar />}{" "}
                              {message.editMessage && "Edited"}{" "}
                              {format(message.createdAt, "dd/MM/yyyy HH:mm")}
                            </div>{" "}
                          </div>
                        </div>
                      </div>
                    );
                  }
                };
                return (
                  <div
                    className={`${
                      message.sender._id === userRecord._id
                        ? `message ${message.type !== "action" && "own"}  ${
                            message.type === "action" && "actionMessage"
                          }`
                        : `message ${
                            message.type === "action" && "actionMessage"
                          }`
                    } `}
                    key={index}
                  >
                    <>{showMessages()}</>
                  </div>
                );
              }
            )}

            <div ref={endRef}></div>
            <div className="">
              <button className="backToTop" onClick={() => scrollToTop()}>
                <FaAngleDown />
              </button>
            </div>
          </div>

          <div
            className={`chatAreaBottom ${
              selectedUser.blockStatus && "chatAreaBottomBlock"
            }`}
          >
            <Formik
              initialValues={{ message: "" }}
              onSubmit={handleMessageSend}
            >
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
                        <FaMicrophone
                          className="chatAreaBottomIcon"
                          // onClick={handleStartRecording}
                          onClick={() => alert("coming soon")}
                        />
                      );
                    } else {
                      return (
                        <div>
                          {audioUrl && (
                            <div>
                              <audio controls src={audioUrl}></audio>
                              {/* <button onClick={handleSendAudio}>
                                Send Audio
                              </button> */}
                            </div>
                          )}
                          <FaRegStopCircle
                            className="chatAreaBottomIcon"
                            onClick={handleStopRecording}
                          />

                          <IoMdSend
                            className="chatAreaBottomSendIcon"
                            onClick={() => {
                              handleSubmit();
                            }}
                          />
                          {/* {
                        audioUrl && (
                          <div>
                            <audio controls src={audioUrl}></audio>
                            <button onClick={handleSendAudio}>Send Audio</button>
                          </div>
                        );
                      } */}
                        </div>
                      );
                    }
                  }
                };

                return (
                  <Form>
                    <div className="row">
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
                            !selectedUser.blockStatus &&
                              handleFileButtonClick();
                          }}
                        />
                        {actionsSlice.successDisplayEmoji.status ? (
                          <FaMixer
                            className="chatAreaBottomImage"
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
                    </div>
                  </Form>
                );
              }}
            </Formik>
          </div>
        </div>
      ) : (
        <div className="chatAreaWithNoDetails"></div>
      )}
    </>
  );
};

export default ChatArea;
