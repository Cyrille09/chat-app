"use client";
import React from "react";
import "./status.scss";
import { successStoryFeedUserStatusActions } from "@/redux-toolkit/reducers/actionsSlice";
import { useDispatch } from "react-redux";
import Image from "next/image";
import { format, isToday, isYesterday, parseISO } from "date-fns";

interface StatusItemProps {
  name: string;
  timestamp: string;
  profilePic: string;
  status: any;
  index: number;
}

const StatusItem: React.FC<StatusItemProps> = ({
  name,
  timestamp,
  profilePic,
  status,
  index,
}) => {
  const dispatch = useDispatch();

  const dateCreated = () => {
    const date = parseISO(timestamp);
    if (isToday(date)) {
      return `Today at ${format(date, "HH:mm")}`;
    } else if (isYesterday(date)) {
      return `Yesterday at ${format(date, "HH:mm")}`;
    } else {
      return `${format(date, "EEEE")} at ${format(date, "HH:mm")}`;
    }
  };

  return (
    <div
      className="status-item"
      onClick={() => {
        dispatch(
          successStoryFeedUserStatusActions({
            status: true,
            record: { status, index: index },
          })
        );
      }}
    >
      {profilePic ? (
        <Image
          src={`${process.env.baseUrl}/images/profile/${profilePic}`}
          alt={`profile`}
          className="profile-pic"
          width={50}
          height={50}
        />
      ) : (
        <img
          src={"https://via.placeholder.com/150"}
          alt={`profile`}
          width={50}
          height={50}
          className="profile-pic"
        />
      )}
      <div className="status-info">
        <span className="status-name">{name}</span>
        <span className="status-timestamp">{dateCreated()}</span>
      </div>
    </div>
  );
};

export default StatusItem;
