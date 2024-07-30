"use client";
import { CSSTransition } from "react-transition-group";
import {
  BlockUser,
  ClearChat,
  DeleteContactUser,
  DisappearMessages,
  DisplayAddNewGroupMembers,
  DisplayUserStars,
  EditGroupUser,
  MakeGroupAdmin,
  MuteNotication,
  RemoveDisappearMessages,
  RemoveUserFromGroup,
  UnmuteNotication,
  UserMediaList,
  ViewGroupUser,
} from "../modelLists/ModalLists";
import { GlobalButton } from "../button/GlobalButton";
import { useDispatch, useSelector } from "react-redux";
import {
  errorPopupActions,
  hideActions,
  isLoadingActions,
} from "@/redux-toolkit/reducers/actionsSlice";
import { RootState } from "@/redux-toolkit/store";

import styles from "../modelLists/madal-lists.module.scss";
import { ACTIONS_ERROR_MESSAGE } from "@/constants/globalText";
import {
  blockUserContact,
  clearUserContactChat,
  deleteContactUser,
  disappearContactUserMessage,
  muteUserContact,
} from "@/services/userContactsServices";
import { socket } from "@/components/websocket/websocket";
import {
  assignGroupAdmin,
  exitFromGroupContact,
  muteGroupContact,
  removeUserFromGroup,
  updateGroup,
} from "@/services/groupsServices";
import { blockUserContactRecord } from "@/redux-toolkit/reducers/userContactsSlice";

const ContactInfoActions = ({ userRecord, userContactsDetail }: any) => {
  const actionsSlice = useSelector((state: RootState) => state.actionsSlice);
  const usersSlice = useSelector((state: RootState) => state.usersSlice);
  const userContactsSlice = useSelector(
    (state: RootState) => state.userContactsSlice
  );
  const chatMessageSlice = useSelector(
    (state: RootState) => state.chatMessageSlice
  );

  const dispatch = useDispatch();
  const selectedUser = usersSlice.selectedUser;
  const deleteContactUserDetail = async () => {
    dispatch(isLoadingActions(true));

    if (selectedUser.isGroup) {
      exitFromGroupContact(
        selectedUser._id,
        selectedUser.group._id,
        `${userRecord.name} left the group.`
      )
        .then((response) => {
          socket.emit("exitGroup", {
            ...userRecord,
            groupId: usersSlice.selectedUser.group._id,
          });

          socket.emit("messageGroup", {
            groupId: usersSlice.selectedUser.group._id,
          });

          dispatch(hideActions());
        })
        .catch((error) => {
          dispatch(isLoadingActions(false));
          dispatch(
            errorPopupActions({
              status: true,
              message: ACTIONS_ERROR_MESSAGE,
              display: "",
            })
          );
        });
    } else {
      deleteContactUser(selectedUser._id)
        .then((response) => {
          socket.emit("deleteContactUser", userRecord);

          dispatch(hideActions());
        })
        .catch((error) => {
          dispatch(isLoadingActions(false));
          dispatch(
            errorPopupActions({
              status: true,
              message: ACTIONS_ERROR_MESSAGE,
              display: "",
            })
          );
        });
    }
  };

  const clearUserContactChatDetail = async () => {
    dispatch(isLoadingActions(true));
    clearUserContactChat(selectedUser.user)
      .then((response) => {
        const receiverInfo = response?.data.receiver;

        socket.emit("updateContactUser", {
          ...userRecord,
          receiverInfo,
          updatedType: "clearChat",
        });
        dispatch(hideActions());
      })
      .catch((error) => {
        dispatch(isLoadingActions(false));
        dispatch(
          errorPopupActions({
            status: true,
            message: ACTIONS_ERROR_MESSAGE,
            display: "",
          })
        );
      });
  };

  const blockUserContactDetail = async () => {
    dispatch(isLoadingActions(true));
    blockUserContact(
      selectedUser.user,
      !userContactsSlice.blockUserContact.status
    )
      .then((response) => {
        const receiverInfo = response?.data?.users.find(
          (user: { user: string }) =>
            user.user === usersSlice.selectedUser.user._id
        );

        socket.emit("updateContactUser", {
          ...userRecord,
          receiverInfo,
          updatedType: "block",
        });

        dispatch(
          blockUserContactRecord({
            ...userContactsSlice.blockUserContact,
            status: !userContactsSlice.blockUserContact.status,
          })
        );

        dispatch(hideActions());
      })
      .catch((error) => {
        dispatch(isLoadingActions(false));
        dispatch(
          errorPopupActions({
            status: true,
            message: ACTIONS_ERROR_MESSAGE,
            display: "",
          })
        );
      });
  };

  const muteUserContactDetail = async () => {
    dispatch(isLoadingActions(true));
    if (selectedUser.isGroup) {
      muteGroupContact(usersSlice.selectedUser._id, new Date())
        .then((response) => {
          socket.emit("muteGroupMessage", {
            ...userRecord,
            groupId: usersSlice.selectedUser.group._id,
            muteDate: new Date(),
          });
          dispatch(hideActions());
        })
        .catch((error) => {
          dispatch(isLoadingActions(false));
          dispatch(
            errorPopupActions({
              status: true,
              message: ACTIONS_ERROR_MESSAGE,
              display: "",
            })
          );
        });
    } else {
      muteUserContact(usersSlice.selectedUser.user, new Date())
        .then((response) => {
          const receiverInfo = response?.data?.users.find(
            (user: { user: string }) =>
              user.user === usersSlice.selectedUser.user._id
          );
          socket.emit("updateContactUser", {
            ...userRecord,
            receiverInfo,
            updatedType: "mute",
          });
          dispatch(hideActions());
        })
        .catch((error) => {
          dispatch(isLoadingActions(false));
          dispatch(
            errorPopupActions({
              status: true,
              message: ACTIONS_ERROR_MESSAGE,
              display: "",
            })
          );
        });
    }
  };

  const assignGroupAdminData = async () => {
    dispatch(isLoadingActions(true));

    assignGroupAdmin(
      selectedUser.group._id,
      actionsSlice.successMakeGroupAdmin?.record?.user?._id,
      `${userRecord.name} has assigned ${actionsSlice.successMakeGroupAdmin?.record?.user?.name} as a group admin.`
    )
      .then((response) => {
        socket.emit("updateGroupMember", selectedUser.group);
        socket.emit("messageGroup", {
          groupId: selectedUser.group._id,
        });

        dispatch(hideActions());
      })
      .catch((error) => {
        dispatch(isLoadingActions(false));
        dispatch(
          errorPopupActions({
            status: true,
            message: ACTIONS_ERROR_MESSAGE,
            display: "",
          })
        );
      });
  };

  const removeUserFromGroupData = async () => {
    dispatch(isLoadingActions(true));

    removeUserFromGroup(
      selectedUser.group._id,
      actionsSlice.successRemoveUserFromGroup?.record?.user?._id,
      `${userRecord.name} has removed ${actionsSlice.successRemoveUserFromGroup?.record?.user?.name} from the group.`
    )
      .then((response) => {
        socket.emit("removeUserFromGroup", {
          group: selectedUser.group,
          user: actionsSlice.successRemoveUserFromGroup?.record?.user,
        });
        socket.emit("messageGroup", {
          groupId: selectedUser.group._id,
        });

        dispatch(hideActions());
      })
      .catch((error) => {
        dispatch(isLoadingActions(false));
        dispatch(
          errorPopupActions({
            status: true,
            message: ACTIONS_ERROR_MESSAGE,
            display: "",
          })
        );
      });
  };

  const disappearMessageDetail = async () => {
    dispatch(isLoadingActions(true));

    if (usersSlice.selectedUser.isGroup) {
      updateGroup(
        {
          disappearIn: "",
          message: `${userRecord.name} has removed the disappear message.`,
        },
        usersSlice.selectedUser.group._id
      )
        .then((response) => {
          dispatch(hideActions());

          socket.emit("disappearGroupMessage", {
            group: response.data,
          });
        })
        .catch((error) => {
          dispatch(isLoadingActions(false));
          dispatch(
            errorPopupActions({
              status: true,
              message: ACTIONS_ERROR_MESSAGE,
              display: "",
            })
          );
        });
    } else {
      disappearContactUserMessage(
        usersSlice.selectedUser.user,
        "",
        `${userRecord.name} has removed the disappear message.`
      )
        .then((response) => {
          dispatch(hideActions());
          const receiverInfo = response?.data?.users.find(
            (user: { user: string }) =>
              user.user === usersSlice.selectedUser.user._id
          );
          socket.emit("updateContactUser", {
            ...userRecord,
            receiverInfo,
            updatedType: "disappear",
          });
        })
        .catch((error) => {
          dispatch(isLoadingActions(false));
          dispatch(
            errorPopupActions({
              status: true,
              message: ACTIONS_ERROR_MESSAGE,
              display: "",
            })
          );
        });
    }
  };

  return (
    <>
      {/* starred */}
      <CSSTransition
        in={actionsSlice.successStarMessage.status}
        timeout={100}
        classNames="panel-animate"
        onEnter={() => document.body.classList.add("css-transition-modal-open")}
        onExited={() =>
          document.body.classList.remove("css-transition-modal-open")
        }
        unmountOnExit={true}
        mountOnEnter={true}
      >
        <DisplayUserStars
          show={actionsSlice.successStarMessage.status}
          user={userRecord}
        />
      </CSSTransition>

      {/* Media */}
      <CSSTransition
        in={actionsSlice.successMedia.status}
        timeout={100}
        classNames="panel-animate"
        onEnter={() => document.body.classList.add("css-transition-modal-open")}
        onExited={() =>
          document.body.classList.remove("css-transition-modal-open")
        }
        unmountOnExit={true}
        mountOnEnter={true}
      >
        <UserMediaList
          show={actionsSlice.successMedia.status}
          user={userRecord}
        />
      </CSSTransition>

      {/* Edit user */}
      <CSSTransition
        in={actionsSlice.successEditGroupUser.status}
        timeout={100}
        classNames="panel-animate"
        onEnter={() => document.body.classList.add("css-transition-modal-open")}
        onExited={() =>
          document.body.classList.remove("css-transition-modal-open")
        }
        unmountOnExit={true}
        mountOnEnter={true}
      >
        <EditGroupUser
          show={actionsSlice.successEditGroupUser.status}
          user={userRecord}
        />
      </CSSTransition>

      {/* Add new group members */}
      <CSSTransition
        in={actionsSlice.successAddGroupMembers.status}
        timeout={100}
        classNames="panel-animate"
        onEnter={() => document.body.classList.add("css-transition-modal-open")}
        onExited={() =>
          document.body.classList.remove("css-transition-modal-open")
        }
        unmountOnExit={true}
        mountOnEnter={true}
      >
        <DisplayAddNewGroupMembers
          show={actionsSlice.successAddGroupMembers.status}
          users={userContactsDetail}
          groupMembers={chatMessageSlice.chatGroupMembers}
          user={userRecord}
        />
      </CSSTransition>

      {/* View group user */}
      <CSSTransition
        in={actionsSlice.successViewGroupUser.status}
        timeout={100}
        classNames="panel-animate"
        onEnter={() => document.body.classList.add("css-transition-modal-open")}
        onExited={() =>
          document.body.classList.remove("css-transition-modal-open")
        }
        unmountOnExit={true}
        mountOnEnter={true}
      >
        <ViewGroupUser show={actionsSlice.successViewGroupUser.status} />
      </CSSTransition>

      {/* Mute notification */}
      {actionsSlice.successMuteNotification.status && (
        <MuteNotication
          show={actionsSlice.successMuteNotification.status}
          handleClose={() => dispatch(hideActions())}
          user={userRecord}
          footer={
            <>
              <div className={styles.flexRowWrapModalFooter}>
                <div className={styles.footerLeft}>
                  <GlobalButton
                    format="white"
                    size="sm"
                    onClick={() => dispatch(hideActions())}
                  >
                    Cancel
                  </GlobalButton>
                </div>
                <div>
                  <GlobalButton format="success" type="submit" size="sm">
                    Submit
                  </GlobalButton>
                </div>
              </div>
            </>
          }
        />
      )}

      {/* Unmute notification */}
      {actionsSlice.successUnmuteNotification.status && (
        <UnmuteNotication
          show={actionsSlice.successUnmuteNotification.status}
          handleClose={() => dispatch(hideActions())}
          footer={
            <>
              <div className={styles.flexRowWrapModalFooter}>
                <div className={styles.footerLeft}>
                  <GlobalButton
                    format="white"
                    size="sm"
                    onClick={() => dispatch(hideActions())}
                  >
                    No
                  </GlobalButton>
                </div>
                <div>
                  <GlobalButton
                    format="success"
                    size="sm"
                    onClick={() => muteUserContactDetail()}
                  >
                    Yes
                  </GlobalButton>
                </div>
              </div>
            </>
          }
        />
      )}

      {/* Disappear messages */}
      {actionsSlice.successDisappearMessage.status &&
        ((usersSlice.selectedUser.isGroup &&
          !usersSlice.selectedUser?.group?.disappearIn) ||
          (!usersSlice.selectedUser.isGroup &&
            !usersSlice.selectedUser.disappearIn)) && (
          <DisappearMessages
            show={actionsSlice.successDisappearMessage.status}
            handleClose={() => dispatch(hideActions())}
            user={userRecord}
            footer={
              <>
                <div className={styles.flexRowWrapModalFooter}>
                  <div className={styles.footerLeft}>
                    <GlobalButton
                      format="white"
                      size="sm"
                      onClick={() => dispatch(hideActions())}
                    >
                      Cancel
                    </GlobalButton>
                  </div>
                  <div>
                    <GlobalButton format="success" type="submit" size="sm">
                      Submit
                    </GlobalButton>
                  </div>
                </div>
              </>
            }
          />
        )}

      {/* remove disappear messages */}
      {actionsSlice.successDisappearMessage.status &&
        (usersSlice.selectedUser?.group?.disappearIn ||
          usersSlice.selectedUser.disappearIn) && (
          <RemoveDisappearMessages
            show={actionsSlice.successDisappearMessage.status}
            handleClose={() => dispatch(hideActions())}
            user={userRecord}
            footer={
              <>
                <div className={styles.flexRowWrapModalFooter}>
                  <div className={styles.footerLeft}>
                    <GlobalButton
                      format="white"
                      size="sm"
                      onClick={() => dispatch(hideActions())}
                    >
                      No
                    </GlobalButton>
                  </div>
                  <div>
                    <GlobalButton
                      format="success"
                      size="sm"
                      onClick={() => disappearMessageDetail()}
                    >
                      Yes
                    </GlobalButton>
                  </div>
                </div>
              </>
            }
          />
        )}

      {/* Block user */}
      {actionsSlice.successBlockUser.status && (
        <BlockUser
          show={actionsSlice.successBlockUser.status}
          handleClose={() => dispatch(hideActions())}
          footer={
            <>
              <div className={styles.flexRowWrapModalFooter}>
                <div className={styles.footerLeft}>
                  <GlobalButton
                    format="white"
                    size="sm"
                    onClick={() => dispatch(hideActions())}
                  >
                    No
                  </GlobalButton>
                </div>
                <div>
                  <GlobalButton
                    format="success"
                    size="sm"
                    onClick={() => blockUserContactDetail()}
                  >
                    Yes
                  </GlobalButton>
                </div>
              </div>
            </>
          }
        />
      )}

      {/* Clear chat */}
      {actionsSlice.successClearChat.status && (
        <ClearChat
          show={actionsSlice.successClearChat.status}
          handleClose={() => dispatch(hideActions())}
          footer={
            <>
              <div className={styles.flexRowWrapModalFooter}>
                <div className={styles.footerLeft}>
                  <GlobalButton
                    format="white"
                    size="sm"
                    onClick={() => dispatch(hideActions())}
                  >
                    No
                  </GlobalButton>
                </div>
                <div>
                  <GlobalButton
                    format="success"
                    size="sm"
                    onClick={() => clearUserContactChatDetail()}
                  >
                    Yes
                  </GlobalButton>
                </div>
              </div>
            </>
          }
        />
      )}

      {/* Delete contact user */}
      {actionsSlice.successDeleteUser.status && (
        <DeleteContactUser
          show={actionsSlice.successDeleteUser.status}
          handleClose={() => dispatch(hideActions())}
          footer={
            <>
              <div className={styles.flexRowWrapModalFooter}>
                <div className={styles.footerLeft}>
                  <GlobalButton
                    format="white"
                    size="sm"
                    onClick={() => dispatch(hideActions())}
                  >
                    No
                  </GlobalButton>
                </div>
                <div>
                  <GlobalButton
                    format="success"
                    size="sm"
                    onClick={() => deleteContactUserDetail()}
                  >
                    Yes
                  </GlobalButton>
                </div>
              </div>
            </>
          }
        />
      )}

      {/* Remove group admin */}
      {actionsSlice.successRemoveUserFromGroup.status && (
        <RemoveUserFromGroup
          show={actionsSlice.successRemoveUserFromGroup.status}
          handleClose={() => dispatch(hideActions())}
          footer={
            <>
              <div className={styles.flexRowWrapModalFooter}>
                <div className={styles.footerLeft}>
                  <GlobalButton
                    format="white"
                    size="sm"
                    onClick={() => dispatch(hideActions())}
                  >
                    No
                  </GlobalButton>
                </div>
                <div>
                  <GlobalButton
                    format="success"
                    size="sm"
                    onClick={() => removeUserFromGroupData()}
                  >
                    Yes
                  </GlobalButton>
                </div>
              </div>
            </>
          }
        />
      )}

      {/* Make group admin */}
      {actionsSlice.successMakeGroupAdmin.status && (
        <MakeGroupAdmin
          show={actionsSlice.successMakeGroupAdmin.status}
          handleClose={() => dispatch(hideActions())}
          footer={
            <>
              <div className={styles.flexRowWrapModalFooter}>
                <div className={styles.footerLeft}>
                  <GlobalButton
                    format="white"
                    size="sm"
                    onClick={() => dispatch(hideActions())}
                  >
                    No
                  </GlobalButton>
                </div>
                <div>
                  <GlobalButton
                    format="success"
                    size="sm"
                    onClick={() => assignGroupAdminData()}
                  >
                    Yes
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

export default ContactInfoActions;
