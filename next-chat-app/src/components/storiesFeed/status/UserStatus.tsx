import React, { useState } from "react";
import StatusList from "./StatusList";
import "./status.scss";
import Image from "next/image";
import StatusActionsPopup from "@/components/chatList/StatusActionsPopup";
import CurrentUserStories from "./CurrentUserStories";

interface StatusItemProps {
  usersStatuses: [];
  userRecord: any;
}

const UserStatus: React.FC<StatusItemProps> = ({
  usersStatuses,
  userRecord,
}) => {
  const [showPopup, setShowPopup] = useState(false);
  const [showDeleteStory, setShowDeleteStory] = useState(false);

  const handleIconClick = () => {
    setShowPopup(!showPopup);
  };

  const handleClosePopup = () => {
    setShowPopup(false);
  };
  const currentUserStatuses: any = usersStatuses.find(
    (currentUserStories: any) => currentUserStories.user._id === userRecord._id
  );

  return (
    <div className="status-main">
      <div className="status-header">
        <div className="status-header-top">
          {userRecord.photoUrl ? (
            <Image
              src={`${process.env.baseUrl}/images/profile/${userRecord.photoUrl}`}
              alt={`profile`}
              className="profile-pic"
              width={50}
              height={50}
            />
          ) : (
            <Image
              src={"https://via.placeholder.com/150"}
              alt={`profile`}
              width={50}
              height={50}
              className="profile-pic"
            />
          )}

          <div>
            <h5>My status</h5>
            {currentUserStatuses && !showDeleteStory && (
              <span
                className="delete-story-feed"
                onClick={() => setShowDeleteStory(true)}
              >
                Delete Story Feed
              </span>
            )}

            {currentUserStatuses && showDeleteStory && (
              <span
                className="show-story-feed"
                onClick={() => setShowDeleteStory(false)}
              >
                Show Story Feed
              </span>
            )}
          </div>
        </div>

        <div className="popup-message">
          <button
            className="add-status"
            onClick={() => {
              handleIconClick();
            }}
          >
            +
          </button>
          {showPopup && (
            <StatusActionsPopup
              onClose={handleClosePopup}
              userRecord={userRecord}
            />
          )}
        </div>
      </div>
      <div className="delete-status-story-content">
        {showDeleteStory ? (
          <CurrentUserStories stories={currentUserStatuses.stories} />
        ) : (
          <StatusList statuses={usersStatuses} />
        )}
      </div>
    </div>
  );
};

export default UserStatus;
