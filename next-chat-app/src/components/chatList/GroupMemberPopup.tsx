import {
  successMakeGroupAdminActions,
  successRemoveUserFromGroupActions,
  successViewGroupUserActions,
} from "@/redux-toolkit/reducers/actionsSlice";
import { useEffect, useRef } from "react";
import { useDispatch } from "react-redux";

const GroupMemberPopup = ({
  onClose,
  member,
  user,
  getUpToFiveAdmin,
  currentUser,
}: any) => {
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
        {user.admin && getUpToFiveAdmin.length < 5 && !member.admin && (
          <li
            onClick={() => {
              handleOptionClick();
              dispatch(
                successMakeGroupAdminActions({ status: true, record: member })
              );
            }}
          >
            Make group admin
          </li>
        )}
        {user.admin &&
          (!member.admin ||
            (member.group.creator === currentUser._id && member.admin) ||
            !member.group.creator ||
            member.user._id === currentUser._id) && (
            <li
              onClick={() => {
                handleOptionClick();
                dispatch(
                  successRemoveUserFromGroupActions({
                    status: true,
                    record: member,
                  })
                );
              }}
            >
              Remove
            </li>
          )}
        <li
          onClick={() => {
            handleOptionClick();
            dispatch(
              successViewGroupUserActions({
                status: true,
                record: member,
              })
            );
          }}
        >
          View group user
        </li>
      </ul>
    </div>
  );
};

export default GroupMemberPopup;
