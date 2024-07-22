"use client";
import {
  successEditMessageActions,
  successEditUserActions,
} from "@/redux-toolkit/reducers/actionsSlice";
import {
  addStarToMessage,
  removeStarToMessage,
} from "@/services/messagesServices";
import Link from "next/link";
import { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { socket } from "../websocket/websocket";
import { RootState } from "@/redux-toolkit/store";

const MessageActionsPopup = ({ onClose, currentUser, type, message }: any) => {
  const usersSlice = useSelector((state: RootState) => state.usersSlice);

  const popupRef: any = useRef();
  const dispatch = useDispatch();

  useEffect(() => {
    const handleClickOutside = (event: any) => {
      if (popupRef.current && !popupRef.current.contains(event.target)) {
        onClose();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [onClose]);

  const handleOptionClick = () => {
    onClose();
  };

  const handleDownload = () => {
    const link = document.createElement("a");
    link.href = `${process.env.baseUrl}/images/messages/${message.message}`;
    link.download = "imageName.jpg";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const getStarMessage = message.stars?.some(
    (user: any) => user.user === currentUser._id
  );

  const addoRremoveStarToMessageData = () => {
    if (getStarMessage) {
      removeStarToMessage(message._id)
        .then((response) => {
          if (usersSlice.selectedUser.isGroup) {
            socket.emit("starGroupMessage", {
              groupId: usersSlice.selectedUser.group._id,
            });
          } else {
            socket.emit("starMessage", { ...response.data });
          }
        })
        .catch((error) => {});
    } else {
      addStarToMessage(message._id)
        .then((response) => {
          if (usersSlice.selectedUser.isGroup) {
            socket.emit("starGroupMessage", {
              groupId: usersSlice.selectedUser.group._id,
            });
          } else {
            socket.emit("starMessage", { ...response.data });
          }
        })
        .catch((error) => {});
    }
  };

  return (
    <div ref={popupRef} className="popup-menu">
      <ul>
        {type === "text" && currentUser._id === message.sender._id && (
          <li
            onClick={() => {
              handleOptionClick();
              dispatch(
                successEditMessageActions({
                  status: true,
                  record: { message: message.message, _id: message._id },
                })
              );
            }}
          >
            Edit
          </li>
        )}
        <li
          onClick={() => {
            handleOptionClick();
            addoRremoveStarToMessageData();
          }}
        >
          {getStarMessage ? "Unstar" : "Star"}
        </li>
        {type === "image" && (
          <li
            onClick={() => {
              handleOptionClick();
            }}
          >
            {/* <GlobalButton
              format="none"
              
              onClick={handleDownload}
              type="button"
            >
              Download
            </GlobalButton> */}
            <Link
              href={`${process.env.baseUrl}/images/messages/${message.message}`}
              target="_blank"
              style={{ textDecoration: "none" }}
            >
              <span>Download</span>
            </Link>
          </li>
        )}
        {type === "link" && (
          <li
            onClick={() => {
              handleOptionClick();
            }}
          >
            <Link
              href={message}
              target="_blank"
              style={{ textDecoration: "none" }}
            >
              <span>Open link</span>
            </Link>
          </li>
        )}
        {type === "document" && (
          <li
            onClick={() => {
              handleOptionClick();
            }}
          >
            <Link
              href={`${process.env.baseUrl}/documents/messages/${message.message}`}
              target="_blank"
              style={{ textDecoration: "none" }}
            >
              <span> Open document</span>
            </Link>
          </li>
        )}
      </ul>
    </div>
  );
};

export default MessageActionsPopup;
