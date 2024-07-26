"use client";
import { CSSTransition } from "react-transition-group";
import { GlobalButton } from "../button/GlobalButton";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/redux-toolkit/store";

import {
  EditMessage,
  SearchMessages,
  SendDocumentMessage,
  SendImageMessage,
} from "../modelLists/ModalLists";
import {
  successEditMessageActions,
  successSendDocumentMessageActions,
  successSendImageMessageActions,
} from "@/redux-toolkit/reducers/actionsSlice";
import {
  sendDocument,
  sendGroupDocument,
  sendGroupImage,
  sendImage,
} from "@/services/messagesServices";
import { socket } from "@/components/websocket/websocket";
import styles from "../modelLists/madal-lists.module.scss";
import { addDays, addHours, addWeeks } from "date-fns";
import { UserInterface } from "../globalTypes/GlobalTypes";

import "./chatArea.scss";

const ChatAreaActions = ({ user }: { user: UserInterface }) => {
  const actionsSlice = useSelector((state: RootState) => state.actionsSlice);
  const usersSlice = useSelector((state: RootState) => state.usersSlice);

  const dispatch = useDispatch();

  const userRecord = user.user;
  const selectedUser = usersSlice.selectedUser;

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
    </>
  );
};

export default ChatAreaActions;
