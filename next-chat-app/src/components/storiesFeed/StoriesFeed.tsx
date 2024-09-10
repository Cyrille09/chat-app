// src/components/StoriesFeed.js
import React, { useState } from "react";
import UserStories from "./UserStories";
import { v4 as uuidv4 } from "uuid";
import "./stories.scss";
import { GlobalButton } from "../button/GlobalButton";
import { successStoryFeedUserStatusActions } from "@/redux-toolkit/reducers/actionsSlice";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/redux-toolkit/store";

const StoriesFeed = ({ users }: { users: any[] }) => {
  const actionsSlice = useSelector((state: RootState) => state.actionsSlice);

  const [currentUserIndex, setCurrentUserIndex] = useState(
    actionsSlice.successStoryFeedUserStatus.record.index || 0
  );
  const dispatch = useDispatch();

  const handleNextUser = () => {
    if (currentUserIndex < users.length - 1) {
      setCurrentUserIndex(currentUserIndex + 1);
    }
  };

  const handlePreviousUser = () => {
    if (currentUserIndex > 0) {
      setCurrentUserIndex(currentUserIndex - 1);
    }
  };

  return (
    <div className="stories-feed">
      <div className="stories-feed-action">
        <div className="user-navigation">
          <div style={{ marginRight: 15 }}>
            <GlobalButton
              onClick={handlePreviousUser}
              disabled={currentUserIndex === 0}
              format="secondary"
              size="xs"
            >
              Previous
            </GlobalButton>
          </div>
          <div>
            <GlobalButton
              onClick={handleNextUser}
              disabled={currentUserIndex === users.length - 1}
              format="teal"
              size="xs"
            >
              Next
            </GlobalButton>
          </div>
        </div>

        <div>
          <GlobalButton
            onClick={() =>
              dispatch(
                successStoryFeedUserStatusActions({ status: false, record: {} })
              )
            }
            size="xs"
          >
            Close
          </GlobalButton>
        </div>
      </div>
      <UserStories
        stories={users[currentUserIndex].stories}
        onAllStoriesEnd={handleNextUser}
        key={uuidv4()}
        user={users[currentUserIndex]}
      />
    </div>
  );
};

export default StoriesFeed;
