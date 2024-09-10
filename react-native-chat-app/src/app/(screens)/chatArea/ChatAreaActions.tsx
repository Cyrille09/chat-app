import { addDays, addHours, addWeeks } from "date-fns";
import { RootState } from "@/src/redux-toolkit/store";
import { useDispatch, useSelector } from "react-redux";
import { UserInterface } from "@/src/components/globalTypes/GlobalTypes";
import {
  sendDocument,
  sendGroupDocument,
  sendGroupImage,
  sendImage,
} from "@/src/services/messagesServices";
import { socket } from "@/src/components/websocket/websocket";
import {
  successSendDocumentMessageActions,
  successSendImageMessageActions,
} from "@/src/redux-toolkit/reducers/actionsSlice";
import {
  SendDocumentMessage,
  SendImageMessage,
} from "@/src/components/modalLists/ModalLists";
import { View } from "react-native";
import { ReactNativeElementsButton } from "@/src/components/reactNativeElements/ReactNativeElements";
import styles from "../../../components/modalLists/modalListsStyles";

const ChatAreaActions = ({ user }: { user: UserInterface }) => {
  const actionsSlice = useSelector((state: RootState) => state.actionsSlice);
  const usersSlice = useSelector((state: RootState) => state.usersSlice);

  const dispatch = useDispatch();

  const userRecord = user.user;
  const selectedUser = usersSlice.selectedUser;

  const handleSendImage = () => {
    if (!actionsSlice.successSendImageMessage.record.message) return;

    let localUri = actionsSlice.successSendImageMessage.record.message;
    let filename: any = localUri.split("/").pop();
    let match = /\.(\w+)$/.exec(filename);
    let type = match ? `image/${match[1]}` : `image`;

    let data: any = new FormData();
    data.append("message", { uri: localUri, name: filename, type });

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
    if (!actionsSlice.successSendDocumentMessage.record.message) return;

    const file = actionsSlice.successSendDocumentMessage.file;

    const fileUri = file.uri;
    const fileType = file.mimeType;
    const fileName = file.name;

    let data: any = new FormData();
    data.append("message", { uri: fileUri, type: fileType, name: fileName });

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
              <View style={styles.flexRowWrapModalFooter}>
                <View style={styles.footerLeft}>
                  <ReactNativeElementsButton
                    title="Cancel"
                    iconRight
                    iconName="image"
                    onPress={() =>
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
                  />
                </View>
                <View></View>
                <ReactNativeElementsButton
                  title="Send"
                  iconRight
                  iconName="image"
                  color="success"
                  onPress={() => handleSendImage()}
                />
              </View>
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
              <View style={styles.flexRowWrapModalFooter}>
                <View style={styles.footerLeft}>
                  <ReactNativeElementsButton
                    title="Cancel"
                    iconRight
                    iconName="image"
                    onPress={() =>
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
                  />
                </View>
                <View></View>
                <ReactNativeElementsButton
                  title="Send"
                  iconRight
                  iconName="image"
                  color="success"
                  onPress={() => handleSendDocument()}
                />
              </View>
            </>
          }
        />
      )}
    </>
  );
};

export default ChatAreaActions;
