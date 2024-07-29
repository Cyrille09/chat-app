import { successAddStoryFeedActions } from "@/redux-toolkit/reducers/actionsSlice";
import { useEffect, useRef } from "react";
import { FaEdit, FaPhotoVideo } from "react-icons/fa";
import { useDispatch } from "react-redux";

const StatusActionsPopup = ({ onClose, userRecord }: any) => {
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
              successAddStoryFeedActions({
                status: true,
                record: { text: false, imageOrVideo: true },
              })
            );
          }}
        >
          <span className="popupStatusAction">
            <FaPhotoVideo />
          </span>{" "}
          Photo & video
        </li>
        <li
          onClick={() => {
            handleOptionClick();
            dispatch(
              successAddStoryFeedActions({
                status: true,
                record: { text: true, imageOrVideo: false },
              })
            );
          }}
        >
          <span className="popupStatusAction">
            <FaEdit />
          </span>{" "}
          Text
        </li>
      </ul>
    </div>
  );
};

export default StatusActionsPopup;
