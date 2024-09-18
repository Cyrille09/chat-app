"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import { Formik } from "formik";
import { format, isThisWeek, isToday, isYesterday, parseISO } from "date-fns";
import { SearchWithOptions } from "../fields/search";
import { BsSearch } from "react-icons/bs";
import { GlobalButton } from "../button/GlobalButton";
import {
  FaCamera,
  FaDigitalOcean,
  FaEdit,
  FaEllipsisV,
  FaFile,
  FaMicrophone,
  FaMinus,
  FaPlus,
  FaVolumeMute,
} from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/redux-toolkit/store";
import {
  successAddNewUsersActions,
  successEditUserActions,
  successStoryStatusActions,
} from "@/redux-toolkit/reducers/actionsSlice";

import { useRouter } from "next/navigation";
import { selectedUserRecord } from "@/redux-toolkit/reducers/usersSlice";
import {
  getGroupMessages,
  getSenderAndReceiverMessages,
} from "@/services/messagesServices";
import {
  chatGroupMembersRecord,
  chatMessagesRecord,
} from "@/redux-toolkit/reducers/chatMessageSlice";
import { socket } from "@/components/websocket/websocket";
import { getUserProfile } from "@/services/usersServices";
import {
  getBlockUserContacts,
  getRequestUserContact,
  getUserContacts,
} from "@/services/userContactsServices";
import MessagePopup from "./MessagePopup";
import { getGroupMmebers } from "@/services/groupsServices";
import {
  UserInterface,
  UserInterfaceInfo,
  UserRecordInterface,
} from "../globalTypes/GlobalTypes";
import ChatListActions from "./ChatListActions";
import "./chatList.scss";
import { getContactUserStoryFeeds } from "@/services/storyFeedsServices";
import {
  blockUserContactRecord,
  userContactStoryFeedsRecord,
} from "@/redux-toolkit/reducers/userContactsSlice";

const ChatList = ({
  user,
  userContacts,
  requestUserContact,
}: {
  user: UserInterface;
  userContacts: [];
  requestUserContact: [];
}) => {
  const actionsSlice = useSelector((state: RootState) => state.actionsSlice);
  const userContactsSlice = useSelector(
    (state: RootState) => state.userContactsSlice
  );
  const userContactsDetail: any = userContactsSlice.userContacts.length
    ? userContactsSlice
    : userContacts;
  const usersSlice = useSelector((state: RootState) => state.usersSlice);

  const [userRecord, setUserRecord] = useState(user.user);
  const [userContactsRecord, setUserContactsRecord] =
    useState<[]>(userContactsDetail);
  const [requestUserContactRecord, setRequestUserContactRecord] =
    useState<[]>(requestUserContact);

  const dispatch = useDispatch();
  const currentUser = user.user;

  useEffect(() => {
    let isSubscribed = true;

    //

    // user
    socket.on("user", (response: UserRecordInterface) => {
      if (isSubscribed && response._id === userRecord._id) getCurrentUserData();
    });
    socket.on("updateUser", (response: UserRecordInterface) => {
      if (isSubscribed && response._id === userRecord._id) getCurrentUserData();
      if (
        userContactsRecord?.find(
          (user: { user: { _id: string } }) => user.user._id === response._id
        )
      ) {
        getContactUserData();
        getRequestUserContactData();
      }
    });

    const getCurrentUserData = async () => {
      getUserProfile()
        .then((response) => {
          if (isSubscribed) {
            setUserRecord(response.data.user);
          }
        })
        .catch((error) => {});
    };

    // contact user
    socket.on("contactUser", (response: UserRecordInterface) => {
      if (isSubscribed && response._id === userRecord._id) {
        getContactUserData();
        getRequestUserContactData();
      }
    });

    socket.on("updateContactUser", (response: any) => {
      // to be reviewd
      if (isSubscribed && response._id === userRecord._id) {
        getContactUserData();
        getRequestUserContactData();
      }
    });
    socket.on("deleteContactUser", (response: UserRecordInterface) => {
      if (isSubscribed && response._id === userRecord._id) {
        getContactUserData();
        getRequestUserContactData();
      }
    });

    socket.on("group", (response: any) => {
      if (
        isSubscribed &&
        response
          .map((user: { value: string }) => user.value)
          .includes(userRecord._id)
      ) {
        getContactUserData();
        getRequestUserContactData();
      }
    });

    socket.on("exitGroup", (response: any) => {
      if (isSubscribed && response._id === userRecord._id) {
        getContactUserData();
        getRequestUserContactData();
      } else if (response.groupId === usersSlice.selectedUser?.group?._id) {
        getGroupMmebersData();
      }
    });

    socket.on("updateGroup", (response: any) => {
      if (
        isSubscribed &&
        response
          .map((user: { value: string }) => user.value)
          .includes(userRecord._id)
      ) {
        getContactUserData();
        getRequestUserContactData();
      }
    });

    socket.on("addGroupMember", (response: any) => {
      if (
        isSubscribed &&
        (response?.groupUsers
          .map((user: { value: string }) => user.value)
          .includes(userRecord._id) ||
          response.groupId === usersSlice.selectedUser?.group?._id)
      ) {
        getContactUserData();
        getRequestUserContactData();
      }
    });

    socket.on("updateGroupMember", (response: any) => {
      if (
        isSubscribed &&
        response._id === usersSlice.selectedUser?.group?._id
      ) {
        getGroupMmebersData();
      }
    });

    socket.on("muteGroupMessage", (response: any) => {
      if (
        isSubscribed &&
        response._id === userRecord._id &&
        response.groupId === usersSlice.selectedUser?.group?._id
      ) {
        getContactUserData();
        dispatch(
          selectedUserRecord({
            ...usersSlice.selectedUser,
            muteDate: response.muteDate,
          })
        );
      }
    });

    socket.on("removeUserFromGroup", (response: UserInterface) => {
      if (
        isSubscribed &&
        response.group._id === usersSlice.selectedUser?.group?._id &&
        response.user._id !== userRecord._id
      ) {
        getGroupMmebersData();
      }

      if (
        isSubscribed &&
        response.group._id === usersSlice.selectedUser?.group?._id &&
        response.user._id === userRecord._id
      ) {
        dispatch(
          selectedUserRecord({
            ...UserInterfaceInfo,
          })
        );
        getContactUserData();
        getRequestUserContactData();
      }
    });

    // send message
    socket.on("message", (response: any) => {
      if (
        isSubscribed &&
        (response.currentUser._id === userRecord._id ||
          response.secondUser._id === userRecord._id)
      ) {
        getContactUserData();
      }
    });

    // send group message
    socket.on("messageGroup", (response: any) => {
      if (
        isSubscribed &&
        userContactsRecord?.find(
          (userContact: { group: { _id: string } }) =>
            userContact?.group?._id === response.groupId
        )
      ) {
        getContactUserData();
      }
    });

    socket.on("updateMessage", (response: any) => {
      if (
        isSubscribed &&
        (response.sender === userRecord._id ||
          response.receiver === userRecord._id)
      ) {
        getContactUserData();
      }
    });
    socket.on("deleteMessage", (response: any) => {
      if (
        isSubscribed &&
        (response.sender === userRecord._id ||
          response.receiver === userRecord._id)
      ) {
        getContactUserData();
      }
    });

    socket.on("storyFeed", (response: any) => {
      if (
        isSubscribed &&
        (response.user._id === currentUser._id ||
          userContactsSlice.userContacts.find(
            (contactUser: { user: { _id: string } }) =>
              contactUser.user._id === response.user._id
          ))
      ) {
        getContactUserStoryFeedsData();
      }
    });

    const getContactUserData = async () => {
      getUserContacts("")
        .then((response) => {
          if (isSubscribed) {
            setUserContactsRecord(response.data.users);
          }
        })
        .catch((error) => {});
    };

    const getRequestUserContactData = async () => {
      getRequestUserContact("")
        .then((response) => {
          if (isSubscribed) {
            setRequestUserContactRecord(response.data);
          }
        })
        .catch((error) => {});
    };

    const getGroupMmebersData = async () => {
      const chatGroupMembers = await getGroupMmebers(
        usersSlice.selectedUser?.group?._id
      );

      if (chatGroupMembers?.data?.length) {
        dispatch(chatGroupMembersRecord(chatGroupMembers.data));
      } else {
        dispatch(chatGroupMembersRecord([]));
      }
    };

    const getContactUserStoryFeedsData = async () => {
      getContactUserStoryFeeds()
        .then((response) => {
          if (isSubscribed)
            dispatch(userContactStoryFeedsRecord(response.data));
        })
        .catch((error) => {});
    };

    return () => {
      isSubscribed = false;

      socket.off("removeUserFromGroup", (response: UserInterface) => {
        if (
          isSubscribed &&
          response.group._id === usersSlice.selectedUser?.group?._id &&
          response.user._id !== userRecord._id
        ) {
          getGroupMmebersData();
        }

        if (
          isSubscribed &&
          response.group._id === usersSlice.selectedUser?.group?._id &&
          response.user._id === userRecord._id
        ) {
          dispatch(
            selectedUserRecord({
              ...UserInterfaceInfo,
            })
          );
          getContactUserData();
          getRequestUserContactData();
        }
      });
      // user
      socket.off("user", (response: UserRecordInterface) => {
        if (isSubscribed && response._id === userRecord._id)
          getCurrentUserData();
      });
      socket.off("updateUser", (response: UserRecordInterface) => {
        if (isSubscribed && response._id === userRecord._id)
          getCurrentUserData();
        if (
          userContactsRecord?.find(
            (user: { user: { _id: string } }) => user.user._id === response._id
          )
        ) {
          getContactUserData();
          getRequestUserContactData();
        }
      });

      // contact user
      socket.off("contactUser", (response: UserRecordInterface) => {
        if (isSubscribed && response._id === userRecord._id) {
          getContactUserData();
          getRequestUserContactData();
        }
      });
      socket.off("updateContactUser", (response: UserRecordInterface) => {
        // to be reviewd
        if (isSubscribed && response._id === userRecord._id) {
          getContactUserData();
          getRequestUserContactData();
        }
      });
      socket.off("deleteContactUser", (response: UserRecordInterface) => {
        if (isSubscribed && response._id === userRecord._id) {
          getContactUserData();
          getRequestUserContactData();
        }
      });

      // send message
      socket.off("message", (response: any) => {
        if (
          isSubscribed &&
          (response.currentUser._id === userRecord._id ||
            response.secondUser._id === userRecord._id)
        ) {
          getContactUserData();
        }
      });
      socket.off("updateMessage", (response: any) => {
        if (
          isSubscribed &&
          (response.sender === userRecord._id ||
            response.receiver === userRecord._id)
        ) {
          getContactUserData();
        }
      });
      socket.off("deleteMessage", (response: any) => {
        if (
          isSubscribed &&
          (response.sender === userRecord._id ||
            response.receiver === userRecord._id)
        ) {
          getContactUserData();
        }
      });
      socket.off("group", (response: any) => {
        if (
          isSubscribed &&
          response
            .map((user: { value: string }) => user.value)
            .includes(userRecord._id)
        ) {
          getContactUserData();
          getRequestUserContactData();
        }
      });

      socket.off("exitGroup", (response: any) => {
        if (isSubscribed && response._id === userRecord._id) {
          getContactUserData();
          getRequestUserContactData();
        } else if (response.groupId === usersSlice.selectedUser?.group?._id) {
          getGroupMmebersData();
        }
      });
      socket.off("updateGroup", (response: any) => {
        if (
          isSubscribed &&
          response
            .map((user: { value: string }) => user.value)
            .includes(userRecord._id)
        ) {
          getContactUserData();
          getRequestUserContactData();
        }
      });
      socket.off("addGroupMember", (response: any) => {
        if (
          isSubscribed &&
          (response?.groupUsers
            .map((user: { value: string }) => user.value)
            .includes(userRecord._id) ||
            response.groupId === usersSlice.selectedUser?.group?._id)
        ) {
          getContactUserData();
          getRequestUserContactData();
        }
      });

      socket.off("updateGroupMember", (response: UserRecordInterface) => {
        if (
          isSubscribed &&
          response._id === usersSlice.selectedUser?.group?._id
        ) {
          getGroupMmebersData();
        }
      });

      socket.off("storyFeed", (response: UserInterface) => {
        if (
          isSubscribed &&
          (response.user._id === currentUser._id ||
            userContactsSlice.userContacts.find(
              (contactUser: { user: { _id: string } }) =>
                contactUser.user._id === response.user._id
            ))
        ) {
          getContactUserStoryFeedsData();
        }
      });
    };
  }, [
    currentUser._id,
    dispatch,
    userContactsRecord,
    userContactsSlice.userContacts,
    userRecord._id,
    usersSlice.selectedUser,
  ]);

  const [chatListTag, setChatListTag] = useState<string>("all");

  const TagButton = ({
    name,
    tagActive,
    onClick,
  }: {
    name: string;
    tagActive: boolean;
    onClick: () => void;
  }) => {
    return (
      <GlobalButton
        format="success"
        borderRadius="fifty"
        size="db"
        tag={`${tagActive ? "active-tag" : "main-tag"}`}
        onClick={onClick}
      >
        {name}
      </GlobalButton>
    );
  };

  const userContactsList =
    userContactsRecord?.map((user: UserInterface) => ({
      name: (user.isGroup && user.group.name) || user.user.name,
      blockStatus: user.blockStatus,
      _id: user._id,
    })) || [];

  const userContactsWithLatestChatList: any[] = userContactsRecord || [];

  const handleSelect = async (chat: UserInterface) => {
    let chatMessages = null;

    if (chat.isGroup) {
      chatMessages = await getGroupMessages(chat.group._id);
      const chatGroupMembers = await getGroupMmebers(chat.group._id);

      if (chatGroupMembers?.data?.length) {
        dispatch(chatGroupMembersRecord(chatGroupMembers.data));
      } else {
        dispatch(chatGroupMembersRecord([]));
      }
    } else {
      chatMessages = await getSenderAndReceiverMessages(chat.user);
      const blockUserContact = await getBlockUserContacts(chat.user._id);
      if (blockUserContact.data) {
        dispatch(
          blockUserContactRecord({ ...blockUserContact.data, status: true })
        );
      } else {
        dispatch(
          blockUserContactRecord({ user: "", blockUser: "", status: false })
        );
      }
    }

    if (chatMessages?.data?.messages.length)
      dispatch(
        chatMessagesRecord({
          messages: chatMessages.data.messages,
          groupedMessages: chatMessages.data.groupedMessages,
        })
      );
    else dispatch(chatMessagesRecord({ messages: [], groupedMessages: [] }));

    dispatch(
      selectedUserRecord({
        ...UserInterfaceInfo,
      })
    );

    dispatch(selectedUserRecord({ ...chat, status: true }));
    socket.emit("contactUser", currentUser);
  };

  const [showPopup, setShowPopup] = useState(false);

  const handleIconClick = () => {
    setShowPopup(!showPopup);
  };

  const handleClosePopup = () => {
    setShowPopup(false);
  };

  return (
    <>
      <ChatListActions
        user={user}
        requestUserContactRecord={requestUserContactRecord}
        userRecord={userRecord}
        userContactsRecord={userContactsRecord}
      />
      <div className="chatList">
        <Formik initialValues={{ name: "" }} onSubmit={() => {}}>
          {({ values, setFieldValue }) => {
            const showUserContactsWithLatestChatList =
              userContactsWithLatestChatList
                ?.filter(
                  (user: {
                    messageUnreadCount: number;
                    isGroup: boolean;
                    user: { name: string };
                    group: { name: string };
                  }) => {
                    const search = values.name
                      ? ((user.isGroup && user.group.name) || user.user.name)
                          .toLowerCase()
                          .includes(values.name.toLowerCase())
                      : user;

                    let filterByUnreadAndGroups: any = user;

                    if (chatListTag === "unread") {
                      filterByUnreadAndGroups =
                        user.messageUnreadCount > 0 && user;
                    }

                    if (chatListTag === "groups") {
                      filterByUnreadAndGroups = user.isGroup;
                    }

                    return search && filterByUnreadAndGroups;
                  }
                )
                ?.sort((a: { updatedAt: Date }, b: { updatedAt: Date }) => {
                  const dateA = new Date(a?.updatedAt || 0).getTime();
                  const dateB = new Date(b?.updatedAt || 0).getTime();
                  return dateB - dateA;
                })
                ?.map((chat: any) => {
                  let muteDate = false;

                  if (chat.muteDate) {
                    muteDate =
                      format(new Date(chat.muteDate), "yyyy-MM-dd HH:mm:ss") >
                      format(new Date(), "yyyy-MM-dd HH:mm:ss");
                  }

                  const findClearChat =
                    chat?.latestMessage?.deleteMessage?.find(
                      (user: any) => user.user === chat.user._id
                    );

                  const latestMessageTimeDateCreated = (createdAt: string) => {
                    const date = parseISO(createdAt);
                    if (isToday(date)) {
                      return `Today`;
                    } else if (isYesterday(date)) {
                      return `Yesterday`;
                    } else if (isThisWeek(date)) {
                      return `${format(date, "EEEE")}`;
                    } else {
                      return `${format(date, "dd/MM/yyyy")}`;
                    }
                  };

                  const latestMessageTime =
                    chat.latestMessage && !findClearChat
                      ? latestMessageTimeDateCreated(
                          chat.latestMessage.createdAt
                        )
                      : "";

                  const groupLatestMessageTime = chat.group?.latestMessage
                    ? latestMessageTimeDateCreated(
                        chat.group.latestMessage.createdAt
                      )
                    : "";

                  const muteNotification = muteDate ? (
                    <FaVolumeMute className="chatListitemStatusIcon" />
                  ) : (
                    ""
                  );

                  let latestMessage =
                    chat.user.message.length > 30
                      ? `${chat.user.message.substring(0, 30)}...`
                      : chat.user.message;

                  if (chat.isGroup) {
                    latestMessage = "";
                  }

                  if (chat.latestMessage && !findClearChat && !chat.isGroup) {
                    if (chat.latestMessage.type === "image") {
                      latestMessage = (
                        <>
                          <FaCamera /> <span>Photo</span>
                        </>
                      );
                    } else if (chat.latestMessage.type === "document") {
                      latestMessage = (
                        <>
                          <FaFile /> <span>File</span>
                        </>
                      );
                    } else if (chat.latestMessage.type === "audio") {
                      latestMessage = (
                        <>
                          <FaMicrophone /> <span>Audio</span>
                        </>
                      );
                    } else {
                      latestMessage =
                        chat.latestMessage.message.length > 20
                          ? `${chat.latestMessage.message.substring(0, 20)}...`
                          : chat.latestMessage.message;
                    }
                  }
                  if (chat?.group?.latestMessage && chat.isGroup) {
                    if (chat.group.latestMessage.type === "image") {
                      latestMessage = (
                        <>
                          <FaCamera /> <span>Photo</span>
                        </>
                      );
                    } else if (chat.group.latestMessage.type === "document") {
                      latestMessage = (
                        <>
                          <FaFile /> <span>File</span>
                        </>
                      );
                    } else if (chat.group.latestMessage.type === "audio") {
                      latestMessage = (
                        <>
                          <FaMicrophone /> <span>Audio</span>
                        </>
                      );
                    } else {
                      latestMessage = chat.group.latestMessage.message;
                    }
                  }

                  let groupUserSender = "";

                  if (chat?.group?.latestMessage?.sender && chat.isGroup) {
                    groupUserSender =
                      chat?.group?.latestMessage?.sender._id === userRecord._id
                        ? `You:`
                        : `${
                            chat?.group?.latestMessage?.sender.name.split(
                              " "
                            )[0]
                          }:`;

                    if (chat.group.latestMessage.type === "text") {
                      const groupSenderAndMessage = `${groupUserSender}  ${latestMessage}`;

                      latestMessage =
                        groupSenderAndMessage.length > 20
                          ? `${groupSenderAndMessage.substring(0, 20)}...`
                          : groupSenderAndMessage;
                    }
                  }

                  const setProfileImage = chat.isGroup ? (
                    <>
                      {" "}
                      {chat.group.photoUrl ? (
                        <Image
                          height="50"
                          width="50"
                          src={`${process.env.baseUrl}/images/groups/${chat.group.photoUrl}`}
                          alt=""
                        />
                      ) : (
                        <div className="chatListItemUserNoImage">
                          <p>
                            {chat.group.name
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
                      {" "}
                      {chat.user.photoUrl ? (
                        <Image
                          height="50"
                          width="50"
                          src={`${process.env.baseUrl}/images/profile/${chat.user.photoUrl}`}
                          alt=""
                        />
                      ) : (
                        <div className="chatListItemUserNoImage">
                          <p>
                            {chat.user?.name
                              .split(" ")
                              .map((data: string) => data.charAt(0))
                              .slice(0, 2)
                              .join("")}
                          </p>
                        </div>
                      )}
                    </>
                  );

                  return (
                    <div
                      className={`${
                        usersSlice.selectedUser._id === chat._id
                          ? "chatListItem activeList"
                          : "chatListItem"
                      }`}
                      key={chat._id}
                      onClick={() => handleSelect(chat)}
                    >
                      <div className="chatListitemUserMessage">
                        {setProfileImage}
                        <div className="chatListItemTexts">
                          <span>
                            {chat.isGroup ? chat.group.name : chat.user.name}
                            <br />
                            {chat.isGroup ? (
                              <p>
                                {chat.group?.latestMessage?.type === "text" ? (
                                  latestMessage
                                ) : (
                                  <>
                                    {groupUserSender} {latestMessage}
                                  </>
                                )}
                              </p>
                            ) : (
                              <p>{latestMessage}</p>
                            )}
                          </span>
                        </div>
                      </div>
                      <div className="chatListitemStatus">
                        <span>
                          <span
                            className={`chatListDate ${
                              chat.messageUnreadCount > 0 && "unreadDate"
                            }`}
                          >
                            {chat.isGroup
                              ? groupLatestMessageTime
                              : latestMessageTime}
                          </span>{" "}
                          <br />
                          <p>
                            {muteNotification}{" "}
                            {chat.messageUnreadCount > 0 && (
                              <span className="numberOfUnread">
                                {chat.messageUnreadCount > 99
                                  ? "99+"
                                  : chat.messageUnreadCount}
                              </span>
                            )}
                          </p>
                        </span>
                      </div>
                    </div>
                  );
                });

            const chatListNoContent = () => {
              if (chatListTag === "all") {
                return (
                  <>
                    <p>No user contact</p>
                    <GlobalButton
                      format="info"
                      size="xs"
                      onClick={() =>
                        dispatch(
                          successAddNewUsersActions({
                            status: true,
                            record: {},
                          })
                        )
                      }
                    >
                      Add user contact
                    </GlobalButton>
                  </>
                );
              }
              if (chatListTag === "unread") {
                return (
                  <>
                    <p>No unread chats</p>
                    <GlobalButton
                      format="success"
                      size="xs"
                      onClick={() => setChatListTag("all")}
                    >
                      View all chats
                    </GlobalButton>
                  </>
                );
              }
              if (chatListTag === "groups") {
                return (
                  <>
                    <p>No groups chats</p>
                    <GlobalButton
                      format="success"
                      size="xs"
                      onClick={() => setChatListTag("all")}
                    >
                      View all chats
                    </GlobalButton>
                  </>
                );
              }
            };

            return (
              <>
                <div
                  className={`chatListTop ${
                    actionsSlice.successStoryStatus.status &&
                    "chatListTopDisableTTT"
                  }`}
                >
                  <div className="userInfo">
                    <div className="user">
                      {userRecord.photoUrl ? (
                        <Image
                          height="50"
                          width="50"
                          src={`${process.env.baseUrl}/images/profile/${userRecord.photoUrl}`}
                          alt=""
                          className="chatListTopImage"
                        />
                      ) : (
                        <div className="chatListUserInfoNoImage">
                          <p>
                            {userRecord.name
                              .split(" ")
                              .map((data: string) => data.charAt(0))
                              .slice(0, 2)
                              .join("")}
                          </p>
                        </div>
                      )}
                      <span>{userRecord.name.split(" ")[0]}</span>
                    </div>
                    <div className="icons">
                      <FaDigitalOcean
                        className="chatListTopIcon"
                        onClick={() =>
                          dispatch(
                            successStoryStatusActions({
                              status: true,
                              record: {},
                            })
                          )
                        }
                      />
                      <FaEdit
                        className="chatListTopIcon"
                        onClick={() =>
                          dispatch(
                            successEditUserActions({ status: true, record: {} })
                          )
                        }
                      />

                      <div className="popup-message">
                        <FaEllipsisV
                          className="chatListTopIcon"
                          onClick={() => {
                            handleIconClick();
                          }}
                        />
                        {showPopup && (
                          <MessagePopup
                            onClose={handleClosePopup}
                            userRecord={userRecord}
                          />
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="searchAndAdd">
                    <div className="search">
                      <div className="searchBar">
                        <SearchWithOptions
                          id="searchClient"
                          placeholder="Search"
                          options={userContactsList}
                          labelKey="name"
                          leftIcon={<BsSearch />}
                          clearButton
                          minLength={1}
                          onChange={(selected: any) => {
                            setFieldValue(
                              "name",
                              selected && selected[0] && selected[0].name
                            );
                          }}
                        />
                      </div>

                      <GlobalButton
                        className="addUser"
                        onClick={() =>
                          dispatch(
                            successAddNewUsersActions({
                              status: true,
                              record: {},
                            })
                          )
                        }
                      >
                        {actionsSlice.successAddNewUsers.status ? (
                          <FaMinus className="addUserIcon" />
                        ) : (
                          <FaPlus className="addUserIcon" />
                        )}
                      </GlobalButton>
                    </div>

                    <div className="messageStatus">
                      <div className="categories-tags">
                        <TagButton
                          name="All"
                          tagActive={chatListTag === "all" ? true : false}
                          onClick={() => {
                            setChatListTag("all");
                          }}
                        />
                        <TagButton
                          name="Unread"
                          tagActive={chatListTag === "unread" ? true : false}
                          onClick={() => {
                            setChatListTag("unread");
                          }}
                        />
                        <TagButton
                          name="Groups"
                          tagActive={chatListTag === "groups" ? true : false}
                          onClick={() => {
                            setChatListTag("groups");
                          }}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="chatListContent">
                  {showUserContactsWithLatestChatList?.length ? (
                    showUserContactsWithLatestChatList
                  ) : (
                    <div className="chatListNoContent">
                      {chatListNoContent()}
                    </div>
                  )}
                </div>
              </>
            );
          }}
        </Formik>
      </div>
    </>
  );
};

export default ChatList;
