"use client";
import { useEffect, useRef, useState } from "react";
import { FaAngleDown } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/redux-toolkit/store";
import {
  getSenderAndReceiverMessages,
  getGroupMessages,
} from "@/services/messagesServices";
import { socket } from "@/components/websocket/websocket";
import { chatMessagesRecord } from "@/redux-toolkit/reducers/chatMessageSlice";
import { selectedUserRecord } from "@/redux-toolkit/reducers/usersSlice";
import ChatAreaActions from "./ChatAreaActions";
import ChatAreaTopLevel from "./ChatAreaTopLevel";
import ChatAreaCenterLevel from "./ChatAreaCenterLevel";
import ChatAreaBottomLevel from "./ChatAreaBottomLevel";
import "./chatArea.scss";

const ChatArea = ({ user }: any) => {
  const usersSlice = useSelector((state: RootState) => state.usersSlice);
  const chatMessageSlice = useSelector(
    (state: RootState) => state.chatMessageSlice
  );

  const dispatch = useDispatch();
  const chatListRef = useRef<HTMLDivElement>(null);

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
      if (
        isSubscribed &&
        (usersSlice.selectedUser.user._id === response.sender ||
          usersSlice.selectedUser.user._id === response.receiver)
      ) {
        getSenderAndReceiverMessagesData(usersSlice.selectedUser.user);
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

  // useEffect(() => {
  //   const disableDevToolsShortcuts = (e: any) => {
  //     if (
  //       e.key === "F12" ||
  //       (e.ctrlKey &&
  //         e.shiftKey &&
  //         (e.key === "I" || e.key === "J" || e.key === "C")) ||
  //       (e.ctrlKey && e.key === "U")
  //     ) {
  //       e.preventDefault();
  //     }
  //   };

  //   document.addEventListener("keydown", disableDevToolsShortcuts);

  //   return () => {
  //     document.removeEventListener("keydown", disableDevToolsShortcuts);
  //   };
  // }, []);

  // useEffect(() => {
  //   const checkDevTools = () => {
  //     if (
  //       window.outerWidth - window.innerWidth > 200 ||
  //       window.outerHeight - window.innerHeight > 200
  //     ) {
  //       alert("Developer tools are open. Please close them.");
  //     }
  //   };

  //   const interval = setInterval(checkDevTools, 1000);

  //   return () => {
  //     clearInterval(interval);
  //   };
  // }, []);

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

  const scrollToTop = () => {
    if (chatListRef.current) {
      chatListRef.current.scrollTop = chatListRef.current.scrollHeight;
    }
  };

  const endRef = useRef(null);

  return (
    <>
      <ChatAreaActions user={user} />

      {selectedUser.status ? (
        <div className="chatArea">
          <div className="chatAreaTop">
            <ChatAreaTopLevel
              selectedUser={selectedUser}
              chatMessageSlice={chatMessageSlice}
              usersSlice={usersSlice}
            />
          </div>

          <div className="chatAreaCenter" ref={chatListRef}>
            <>
              <ChatAreaCenterLevel
                chatMessageSlice={chatMessageSlice}
                userRecord={userRecord}
              />

              <div ref={endRef}></div>
              <div className="">
                <button className="backToTop" onClick={() => scrollToTop()}>
                  <FaAngleDown />
                </button>
              </div>
            </>
          </div>

          <div
            className={`chatAreaBottom ${
              selectedUser.blockStatus && "chatAreaBottomBlock"
            } `}
          >
            <>
              <ChatAreaBottomLevel user={user} />
            </>
          </div>
        </div>
      ) : (
        <div className="chatAreaWithNoDetails"></div>
      )}
    </>
  );
};

export default ChatArea;
