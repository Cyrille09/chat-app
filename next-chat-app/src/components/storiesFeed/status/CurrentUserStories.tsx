"use client";
import React, { useState } from "react";
import "./status.scss";
import { GlobalButton } from "@/components/button/GlobalButton";
import { deleteContactUserStoryFeed } from "@/services/storyFeedsServices";
import { GlobalErrorMessage } from "@/components/errorAndSuccessMessage";
import { LoadingData } from "@/components/loading/LoadingData";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/redux-toolkit/store";
import {
  errorPopupActions,
  isLoadingActions,
} from "@/redux-toolkit/reducers/actionsSlice";
import { ACTIONS_ERROR_MESSAGE } from "@/constants/globalText";
import { socket } from "@/components/websocket/websocket";

interface CurrentUserStoriesProps {
  stories: [];
}

const CurrentUserStories: React.FC<CurrentUserStoriesProps> = ({ stories }) => {
  const actionsSlice = useSelector((state: RootState) => state.actionsSlice);
  const [storyId, setStoryID] = useState("");
  const dispatch = useDispatch();

  const deleteUserStoryFeedData = (id: string) => {
    dispatch(isLoadingActions(true));
    deleteContactUserStoryFeed(id)
      .then((response) => {
        dispatch(isLoadingActions(false));
        socket.emit("storyFeed", response.data);
      })
      .catch((error) => {
        setStoryID(id);
        dispatch(isLoadingActions(false));
        dispatch(
          errorPopupActions({
            status: true,
            message: ACTIONS_ERROR_MESSAGE,
            display: "",
          })
        );
      });
  };

  return (
    <div className="status-story">
      {stories.map((story: any) => {
        const displayStoryContent = () => {
          if (story.type === "text") {
            return <p>{story.message}</p>;
          } else if (story.type === "image") {
            return (
              <img
                src={`${process.env.baseUrl}/images/stories/${story.message}`}
                alt={`profile`}
                className="status-story-image"
                width="200"
                height="auto"
              />
            );
          }
        };
        return (
          <div key={story._id}>
            <div className="row">
              {story._id === storyId && actionsSlice.errorPopup.status && (
                <div className="delete-status-story-error col-sm-12">
                  <div>
                    {actionsSlice.errorPopup.status && (
                      <GlobalErrorMessage
                        message={actionsSlice.errorPopup.message}
                      />
                    )}
                  </div>
                  {actionsSlice.isLoading && <LoadingData />}
                </div>
              )}
              <div className="col-sm-6">{displayStoryContent()}</div>
              <div className="col-sm-6 status-story-delete">
                <GlobalButton
                  format="danger"
                  size="xs"
                  onClick={() => deleteUserStoryFeedData(story._id)}
                >
                  Delete
                </GlobalButton>
              </div>
              <div>
                <hr />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default CurrentUserStories;
