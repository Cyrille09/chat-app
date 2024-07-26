"use client";
import Image from "next/image";
import {
  FaChevronRight,
  FaBan,
  FaBrush,
  FaRegTrashAlt,
  FaStar,
  FaBell,
  FaVolumeMute,
  FaVolumeUp,
  FaRegRegistered,
  FaEdit,
  FaPlusSquare,
  FaTrash,
  FaChevronDown,
  FaClock,
} from "react-icons/fa";

import "./contactInfo.scss";
import { BoxShadowCard } from "../cards";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  successAddGroupMembersActions,
  successBlockUserActions,
  successClearChatActions,
  successDeleteUserActions,
  successDisappearMessageActions,
  successEditGroupUserActions,
  successMakeGroupAdminActions,
  successMediaActions,
  successMuteNotificationActions,
  successRemoveUserFromGroupActions,
  successStarMessageActions,
  successUnmuteNotificationActions,
} from "@/redux-toolkit/reducers/actionsSlice";
import { RootState } from "@/redux-toolkit/store";
import { socket } from "@/components/websocket/websocket";
import { format } from "date-fns";
import { getUser } from "@/services/usersServices";
import { selectedUserRecord } from "@/redux-toolkit/reducers/usersSlice";
import { getSenderAndReceiverMessages } from "@/services/messagesServices";
import { chatMessagesRecord } from "@/redux-toolkit/reducers/chatMessageSlice";
import { UserInterfaceInfo } from "../globalTypes/GlobalTypes";
import GroupMemberPopup from "../chatList/GroupMemberPopup";
import { IoMdRemoveCircle } from "react-icons/io";
import ContactInfoActions from "./ContactInfoActions";

const ContactInfo = ({ user, userContacts }: any) => {
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
  const [showPopup, setShowPopup] = useState(false);
  const [memberId, setMemberId] = useState("");

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

  const getMediaLinksAndDocs = chatMessageSlice.chatMessages.filter(
    (message: { type: string }) =>
      ["image", "link", "document", "video"].includes(message.type)
  );

  const handleIconClick = (memberId: string) => {
    setShowPopup(!showPopup);
    setMemberId(memberId);
  };

  const handleClosePopup = () => {
    setShowPopup(false);
    setMemberId("");
    dispatch(successMakeGroupAdminActions({ status: false, record: {} }));
    dispatch(
      successRemoveUserFromGroupActions({
        status: false,
        record: {},
      })
    );
  };

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

  const getCurrentGroupMember = chatMessageSlice.chatGroupMembers.find(
    (member: { user: { _id: string } }) => member.user._id === userRecord._id
  );
  const getUpToFiveAdmin = chatMessageSlice.chatGroupMembers.filter(
    (member: any) => member.admin
  );
  return (
    <>
      {selectedUser.status ? (
        <div className="contactInfo">
          <>
            <ContactInfoActions
              userRecord={userRecord}
              userContactsDetail={userContactsDetail}
            />
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
                      {getCurrentGroupMember?.admin && (
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
                      )}
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
                                <FaChevronDown
                                  className="contactInfoGroupMemberIcon"
                                  onClick={() => {
                                    handleIconClick(member.user._id);
                                  }}
                                />
                                <span className="popup-message">
                                  {showPopup &&
                                    member.user._id === memberId && (
                                      <GroupMemberPopup
                                        member={member}
                                        user={getCurrentGroupMember}
                                        getUpToFiveAdmin={getUpToFiveAdmin}
                                        currentUser={userRecord}
                                        onClose={handleClosePopup}
                                      />
                                    )}
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
                    <FaChevronRight />
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
                  onClick={() =>
                    dispatch(
                      successDisappearMessageActions({
                        status: true,
                        record: {},
                      })
                    )
                  }
                >
                  <div>
                    <span className="eachActionLeftIcon">
                      {usersSlice.selectedUser.disappearIn ||
                      usersSlice.selectedUser.group?.disappearIn ? (
                        <FaClock />
                      ) : (
                        <IoMdRemoveCircle size={18} />
                      )}
                    </span>
                    <span>
                      {usersSlice.selectedUser.disappearIn ||
                      usersSlice.selectedUser.group?.disappearIn
                        ? "Remove disappear messages"
                        : "Disappear messages"}
                    </span>
                  </div>
                  <span className="eachActionRightIcon">
                    <FaChevronRight />
                  </span>
                </div>

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
