"use client";
import Image from "next/image";
import {
  FaChevronRight,
  FaBan,
  FaBrush,
  FaRegTrashAlt,
  FaStar,
  FaBell,
  FaRedo,
  FaVolumeMute,
  FaVolumeUp,
  FaRegRegistered,
  FaEdit,
  FaPlusSquare,
  FaTrash,
  FaChevronDown,
} from "react-icons/fa";
import { CSSTransition } from "react-transition-group";

import "./contactInfo.scss";
import { BoxShadowCard } from "../cards";
import {
  BlockUser,
  ClearChat,
  DeleteContactUser,
  DisappearingMessages,
  DisplayAddNewGroupMembers,
  DisplayUserStars,
  EditGroupUser,
  MuteNotication,
  UnmuteNotication,
  UserMediaList,
} from "../modelLists/ModalLists";
import { useEffect } from "react";
import { GlobalButton } from "../button/GlobalButton";
import { useDispatch, useSelector } from "react-redux";
import {
  errorPopupActions,
  hideActions,
  isLoadingActions,
  successAddGroupMembersActions,
  successBlockUserActions,
  successClearChatActions,
  successDeleteUserActions,
  successEditGroupUserActions,
  successMediaActions,
  successMuteNotificationActions,
  successStarMessageActions,
  successUnmuteNotificationActions,
} from "@/redux-toolkit/reducers/actionsSlice";
import { RootState } from "@/redux-toolkit/store";

import styles from "../modelLists/madal-lists.module.scss";
import { ACTIONS_ERROR_MESSAGE } from "@/constants/globalText";
import {
  blockUserContact,
  clearUserContactChat,
  deleteContactUser,
  muteUserContact,
} from "@/services/userContactsServices";
import { socket } from "@/components/websocket/websocket";
import { format } from "date-fns";
import { getUser } from "@/services/usersServices";
import { selectedUserRecord } from "@/redux-toolkit/reducers/usersSlice";
import { getSenderAndReceiverMessages } from "@/services/messagesServices";
import { chatMessagesRecord } from "@/redux-toolkit/reducers/chatMessageSlice";
import {
  exitFromGroupContact,
  muteGroupContact,
} from "@/services/groupsServices";
import { UserInterfaceInfo } from "../globalTypes/GlobalTypes";

const ContactInfo = ({ user, userContacts }: any) => {
  const actionsSlice = useSelector((state: RootState) => state.actionsSlice);
  const usersSlice = useSelector((state: RootState) => state.usersSlice);
  const chatMessageSlice = useSelector(
    (state: RootState) => state.chatMessageSlice
  );
  const userContactsSlice = useSelector(
    (state: RootState) => state.userContactsSlice
  );
  const userContactsDetail: any = userContactsSlice.userContacts.length
    ? userContactsSlice
    : userContacts;

  const dispatch = useDispatch();
  const selectedUser = usersSlice.selectedUser;
  const userRecord = user.user;

  useEffect(() => {
    let isSubscribed = true;

    // user
    socket.on("updateUser", (response: any) => {
      if (isSubscribed && response._id === selectedUser.user._id) {
        getUserData();
      }
    });

    // message
    socket.on("message", (response: any) => {
      if (
        isSubscribed &&
        ["image", "video", "document", "link"].includes(
          response.message.type
        ) &&
        response.secondUser._id === usersSlice.selectedUser.user._id
      ) {
        getSenderAndReceiverMessagesData(response.secondUser);
      }
    });

    // contact user
    socket.on("updateContactUser", (response: any) => {
      if (
        isSubscribed &&
        response._id === userRecord._id &&
        response.updatedType === "mute"
      ) {
        dispatch(
          selectedUserRecord({
            ...selectedUser,
            muteDate: response.receiverInfo.muteDate,
          })
        );
      }

      if (
        isSubscribed &&
        response._id === userRecord._id &&
        response.updatedType === "block"
      ) {
        dispatch(
          selectedUserRecord({
            ...selectedUser,
            blockStatus: response.receiverInfo.blockStatus,
          })
        );
      }

      if (
        isSubscribed &&
        response._id === userRecord._id &&
        response.updatedType === "clearChat"
      ) {
        getSenderAndReceiverMessagesData(response.receiverInfo);
      }
    });

    socket.on("deleteContactUser", (response: any) => {
      if (isSubscribed && response._id === userRecord._id) {
        dispatch(
          selectedUserRecord({
            ...UserInterfaceInfo,
          })
        );
      }
    });

    socket.on("exitGroup", (response: any) => {
      if (isSubscribed && response._id === userRecord._id) {
        dispatch(
          selectedUserRecord({
            ...UserInterfaceInfo,
          })
        );
      }
    });

    const getUserData = async () => {
      getUser(selectedUser.user._id, "")
        .then((response) => {
          if (isSubscribed) {
            dispatch(
              selectedUserRecord({
                ...selectedUser,
                user: response.data,
                status: true,
              })
            );
          }
        })
        .catch((error) => {});
    };

    const getSenderAndReceiverMessagesData = (user: any) => {
      getSenderAndReceiverMessages(user)
        .then((response) => {
          if (response?.data?.length)
            dispatch(chatMessagesRecord(response.data));
          else dispatch(chatMessagesRecord([]));
        })
        .catch((error) => {});
    };

    return () => {
      isSubscribed = false;

      // user
      socket.off("updateUser", (response: any) => {
        if (isSubscribed && response._id === selectedUser.user._id)
          getUserData();
      });

      // message
      socket.off("message", (response: any) => {
        if (
          isSubscribed &&
          ["image", "video", "document", "link"].includes(
            response.message.type
          ) &&
          response.secondUser._id === usersSlice.selectedUser.user._id
        ) {
          getSenderAndReceiverMessagesData(usersSlice.selectedUser.user);
        }
      });

      // contact user
      socket.off("updateContactUser", (response: any) => {
        if (
          isSubscribed &&
          response._id === userRecord._id &&
          response.updatedType === "mute"
        ) {
          dispatch(
            selectedUserRecord({
              ...selectedUser,
              muteDate: response.receiverInfo.muteDate,
            })
          );
        }

        if (
          isSubscribed &&
          response._id === userRecord._id &&
          response.updatedType === "block"
        ) {
          dispatch(
            selectedUserRecord({
              ...selectedUser,
              blockStatus: response.receiverInfo.blockStatus,
            })
          );
        }

        if (
          isSubscribed &&
          response._id === userRecord._id &&
          response.updatedType === "clearChat"
        ) {
          getSenderAndReceiverMessagesData(response.receiverInfo);
        }
      });

      socket.off("deleteContactUser", (response: any) => {
        if (isSubscribed && response._id === userRecord._id) {
          dispatch(
            selectedUserRecord({
              ...UserInterfaceInfo,
            })
          );
        }
      });
      socket.off("exitGroup", (response: any) => {
        if (isSubscribed && response._id === userRecord._id) {
          dispatch(
            selectedUserRecord({
              ...UserInterfaceInfo,
            })
          );
        }
      });
    };
  }, [
    dispatch,
    selectedUser,
    selectedUser.user._id,
    userRecord,
    usersSlice.selectedUser.user,
  ]);

  const deleteContactUserDetail = async () => {
    dispatch(isLoadingActions(true));

    if (selectedUser.isGroup) {
      exitFromGroupContact(selectedUser._id, selectedUser.group._id)
        .then((response) => {
          socket.emit("exitGroup", userRecord);

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
    blockUserContact(selectedUser.user, !selectedUser.blockStatus)
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

  const getMediaLinksAndDocs = chatMessageSlice.chatMessages.filter(
    (message: { type: string }) =>
      ["image", "link", "document", "video"].includes(message.type)
  );

  const getMedia = chatMessageSlice.chatMessages
    .map((data: any) => data)
    .reverse()
    .filter((message: { type: string }) =>
      ["image", "video"].includes(message.type)
    )
    .slice(0, 3);

  let muteDate = false;

  if (selectedUser.muteDate) {
    muteDate =
      format(new Date(selectedUser.muteDate), "yyyy-MM-dd HH:mm:ss") >
      format(new Date(), "yyyy-MM-dd HH:mm:ss");
  }

  const setProfileImage = selectedUser.isGroup ? (
    <>
      {selectedUser.group.photoUrl ? (
        <Image
          width={150}
          height={150}
          src={`${process.env.baseUrl}/images/groups/${selectedUser.group.photoUrl}`}
          alt="Avatar"
          className="avatar"
        />
      ) : (
        <div className="noImage">
          <p>
            {selectedUser.group.name
              .split(" ")
              .map((data: string) => data.charAt(0))
              .slice(0, 4)
              .join("")}
          </p>
        </div>
      )}
    </>
  ) : (
    <>
      {selectedUser.user.photoUrl ? (
        <Image
          width={150}
          height={150}
          src={`${process.env.baseUrl}/images/profile/${selectedUser.user.photoUrl}`}
          alt="Avatar"
          className="avatar"
        />
      ) : (
        <div className="noImage">
          <p>
            {selectedUser.user.name
              .split(" ")
              .map((data: string) => data.charAt(0))
              .slice(0, 4)
              .join("")}
          </p>
        </div>
      )}
    </>
  );

  return (
    <>
      {selectedUser.status ? (
        <div className="contactInfo">
          <>
            {/* starred */}
            <CSSTransition
              in={actionsSlice.successStarMessage.status}
              timeout={100}
              classNames="panel-animate"
              onEnter={() =>
                document.body.classList.add("css-transition-modal-open")
              }
              onExited={() =>
                document.body.classList.remove("css-transition-modal-open")
              }
              unmountOnExit={true}
              mountOnEnter={true}
            >
              <DisplayUserStars show={actionsSlice.successStarMessage.status} />
            </CSSTransition>

            {/* Media */}
            <CSSTransition
              in={actionsSlice.successMedia.status}
              timeout={100}
              classNames="panel-animate"
              onEnter={() =>
                document.body.classList.add("css-transition-modal-open")
              }
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
              onEnter={() =>
                document.body.classList.add("css-transition-modal-open")
              }
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
              onEnter={() =>
                document.body.classList.add("css-transition-modal-open")
              }
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
              />
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

            {/* Disappearing messages */}
            {actionsSlice.successDisappearingMessage.status && (
              <DisappearingMessages
                show={actionsSlice.successDisappearingMessage.status}
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
          </>
          <div className="contactInfoTop">
            <h4>{selectedUser.isGroup ? "Group info" : "Contact info"}</h4>
            {selectedUser.isGroup && (
              <div>
                <FaEdit
                  className="chatListTopIcon"
                  onClick={() =>
                    dispatch(
                      successEditGroupUserActions({ status: true, record: {} })
                    )
                  }
                />
              </div>
            )}
          </div>
          <div className="contactContent">
            <BoxShadowCard>
              <div>
                <div className="container contactHeader">
                  {setProfileImage}
                  <div>
                    <h4>
                      {selectedUser.isGroup
                        ? selectedUser.group.name
                        : selectedUser.user.name}
                    </h4>
                  </div>
                  <div>
                    <span className="contactInGrouMembers">
                      {selectedUser.isGroup ? (
                        <span>{`Group: ${chatMessageSlice.chatGroupMembers.length} members`}</span>
                      ) : (
                        <p>{selectedUser.user.email}</p>
                      )}
                    </span>
                  </div>
                </div>
              </div>
            </BoxShadowCard>
            <BoxShadowCard>
              {selectedUser.isGroup ? (
                <div className="container contactInfoAbout">
                  <h4>Group description</h4>
                  <p>{selectedUser.group.description || "-"}</p>
                </div>
              ) : (
                <div className="container contactInfoAbout">
                  <h4>About</h4>
                  <p>{selectedUser.user.message}</p>
                </div>
              )}
            </BoxShadowCard>

            {selectedUser.isGroup && (
              <BoxShadowCard>
                <div className="container contactInfoAbout">
                  <div className="contactInfoGroupMember">
                    <div>
                      <span>{`${chatMessageSlice.chatGroupMembers.length} group members`}</span>
                    </div>
                    <div>
                      <span>
                        <FaPlusSquare
                          className="contactInfoGroupMemberIcon"
                          size={20}
                          onClick={() =>
                            dispatch(
                              successAddGroupMembersActions({
                                status: true,
                                record: {},
                              })
                            )
                          }
                        />
                      </span>
                    </div>
                  </div>

                  <div>
                    {chatMessageSlice.chatGroupMembers.map(
                      (member: any, index: number) => {
                        return (
                          <div key={index}>
                            <div className="chatAreaTop">
                              <div className="user">
                                <>
                                  {member.user.photoUrl ? (
                                    <Image
                                      height="50"
                                      width="50"
                                      src={`${process.env.baseUrl}/images/profile/${member.user.photoUrl}`}
                                      alt=""
                                    />
                                  ) : (
                                    <div className="chatListItemUserNoImage">
                                      <p>
                                        {member.user.name
                                          .split(" ")
                                          .map((data: string) => data.charAt(0))
                                          .slice(0, 2)
                                          .join("")}
                                      </p>
                                    </div>
                                  )}
                                </>
                                <div className="chatAreaTopTexts">
                                  {" "}
                                  <>
                                    <span className="chatAreaTopTextsName">
                                      {member.user.name}
                                    </span>
                                    <p>
                                      <span className="chatAreaTopLastSeen">
                                        {member.user.message}
                                      </span>
                                    </p>
                                  </>
                                </div>
                              </div>
                              <div className="">
                                <span className="groupAdmin">
                                  {member.admin && <span>Group admin</span>}
                                </span>
                                <span>
                                  {" "}
                                  <FaChevronDown
                                    className="contactInfoGroupMemberIcon"
                                    onClick={() => alert("coming soon")}
                                  />
                                </span>
                              </div>
                            </div>
                          </div>
                        );
                      }
                    )}
                  </div>
                </div>
              </BoxShadowCard>
            )}

            <BoxShadowCard>
              <div className="container contactInfoMedia">
                <div
                  className="mediaHeader"
                  onClick={() =>
                    dispatch(
                      successMediaActions({
                        status: true,
                        record: getMediaLinksAndDocs,
                      })
                    )
                  }
                >
                  <span>Media, links and docs</span>
                  <span className="mediaCount">
                    {getMediaLinksAndDocs.length} <FaChevronRight />
                  </span>
                </div>
                <div className="mediaItems">
                  {getMedia.map((message: { _id: string; message: string }) => {
                    return (
                      <div key={message._id}>
                        <div className="mediaItem">
                          <Image
                            height="100"
                            width="100"
                            src={`${process.env.baseUrl}/images/messages/${message.message}`}
                            alt="Media"
                          />
                        </div>
                      </div>
                    );
                  })}
                  {/* 
                  <div className="mediaItem">
                    <Image src={avatar} alt="Media 3" />
                    <span className="videoDuration">1:00</span>
                  </div> */}
                </div>
              </div>
            </BoxShadowCard>
            <BoxShadowCard>
              <div className="container contactInfoActions">
                <div
                  className="eachAction"
                  onClick={() =>
                    dispatch(
                      successStarMessageActions({ status: true, record: {} })
                    )
                  }
                >
                  <div>
                    <span className="eachActionLeftIcon">
                      <FaStar />
                    </span>
                    <span>Starred messages</span>
                  </div>
                  <span>
                    {"..."} <FaChevronRight />
                  </span>
                </div>

                <div
                  className="eachAction"
                  onClick={() => {
                    if (muteDate) {
                      dispatch(
                        successUnmuteNotificationActions({
                          status: true,
                          record: {},
                        })
                      );
                    } else {
                      dispatch(
                        successMuteNotificationActions({
                          status: true,
                          record: {},
                        })
                      );
                    }
                  }}
                >
                  <div>
                    <span className="eachActionLeftIcon">
                      <FaBell />
                    </span>
                    {muteDate ? (
                      <span>
                        Muted <br />{" "}
                        <span className="mutedDate">
                          Untill:{" "}
                          {format(
                            new Date(selectedUser.muteDate),
                            "dd-MM-yyyy HH:mm"
                          )}
                        </span>
                      </span>
                    ) : (
                      <span>Mute notifiation</span>
                    )}
                  </div>
                  <span className="eachActionRightIcon">
                    {muteDate ? <FaVolumeMute /> : <FaVolumeUp />}
                  </span>
                </div>
                <div
                  className="eachAction"
                  // onClick={() =>
                  //   dispatch(
                  //     successDisappearingMessageActions({
                  //       status: true,
                  //       record: {},
                  //     })
                  //   )
                  // }
                  onClick={() => alert("Coming soon")}
                >
                  <div>
                    <span className="eachActionLeftIcon">
                      <FaRedo />
                    </span>
                    <span>Disappearing messages</span>
                  </div>
                  <span className="eachActionRightIcon">
                    <FaChevronRight />
                  </span>
                </div>

                {/*  */}
                <hr />
                {!selectedUser.isGroup && (
                  <>
                    <div
                      className="eachActionInRed"
                      onClick={() =>
                        dispatch(
                          successBlockUserActions({ status: true, record: {} })
                        )
                      }
                    >
                      {selectedUser.blockStatus ? (
                        <div>
                          <span className="eachActionLeftIconInRed">
                            <FaRegRegistered />
                          </span>
                          <span>Unblock user</span>
                        </div>
                      ) : (
                        <div>
                          <span className="eachActionLeftIconInRed">
                            <FaBan />
                          </span>
                          <span>Block user</span>
                        </div>
                      )}
                    </div>
                    <div
                      className="eachActionInRed"
                      onClick={() =>
                        dispatch(
                          successClearChatActions({ status: true, record: {} })
                        )
                      }
                    >
                      <div>
                        <span className="eachActionLeftIconInRed">
                          <FaBrush />
                        </span>
                        <span>Clear chat</span>
                      </div>
                    </div>
                  </>
                )}
                <div
                  className="eachActionInRed"
                  onClick={() =>
                    dispatch(
                      successDeleteUserActions({ status: true, record: {} })
                    )
                  }
                >
                  {selectedUser.isGroup ? (
                    <div>
                      <span className="eachActionLeftIconInRed">
                        <FaTrash />
                      </span>
                      <span>Exit group</span>
                    </div>
                  ) : (
                    <div>
                      <span className="eachActionLeftIconInRed">
                        <FaRegTrashAlt />
                      </span>
                      <span>Delete user</span>
                    </div>
                  )}
                </div>
              </div>
            </BoxShadowCard>
          </div>
        </div>
      ) : (
        <></>
      )}
    </>
  );
};

export default ContactInfo;
