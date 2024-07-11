import {
  successChangePasswordActions,
  successCreateNewGroupMessagesActions,
  successEditUserActions,
  successLogoutActions,
} from "@/redux-toolkit/reducers/actionsSlice";
import { useEffect, useRef } from "react";
import { useDispatch } from "react-redux";

const MessagePopup = ({ onClose }: any) => {
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

  return (
    <div ref={popupRef} className="popup-menu">
      <ul>
        <li
          onClick={() => {
            handleOptionClick();
            dispatch(
              successCreateNewGroupMessagesActions({ status: true, record: {} })
            );
          }}
        >
          New group
        </li>
        <li
          onClick={() => {
            handleOptionClick();
            dispatch(successEditUserActions({ status: true, record: {} }));
          }}
        >
          Settings
        </li>
        <li
          onClick={() => {
            handleOptionClick();
            dispatch(
              successChangePasswordActions({ status: true, record: {} })
            );
          }}
        >
          Change password
        </li>
        <li
          onClick={() => {
            handleOptionClick();
            dispatch(successLogoutActions({ status: true, record: {} }));
          }}
          className="logout"
        >
          Logout
        </li>
      </ul>
    </div>
  );
};

export default MessagePopup;
