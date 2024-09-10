import {
  errorPopupActions,
  isLoadingActions,
} from "@/src/redux-toolkit/reducers/actionsSlice";
import { RootState } from "@/src/redux-toolkit/store";
import { deleteContactUserStoryFeed } from "@/src/services/storyFeedsServices";
import React, { useState } from "react";
import { Divider, Image, Text, Icon } from "@rneui/themed";
import statusStyles from "./statusStyles";

import { View } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { socket } from "../../websocket/websocket";
import { ACTIONS_ERROR_MESSAGE } from "@/src/constants/globalText";
import { ReactNativeElementsButton } from "../../reactNativeElements/ReactNativeElements";

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
    <View style={statusStyles.statusStory}>
      {stories?.map((story: { type: string; message: string; _id: string }) => {
        const displayStoryContent = () => {
          if (story.type === "text") {
            return <Text>{story.message}</Text>;
          } else if (story.type === "image") {
            return (
              <Image
                source={{
                  uri: `${process.env.EXPO_PUBLIC_BASE_URL}/images/stories/${story.message}`,
                }}
                alt={`profile`}
                containerStyle={statusStyles.statusStoryImage}
              />
            );
          }
        };
        return (
          <View key={story._id}>
            <View style={statusStyles.deleteRow}>
              {story._id === storyId && actionsSlice.errorPopup.status && (
                <View
                // className="delete-status-story-error col-sm-12"
                >
                  {/* <View>
                    {actionsSlice.errorPopup.status && (
                      <GlobalErrorMessage
                        message={actionsSlice.errorPopup.message}
                      />
                    )}
                  </View> */}
                  {/* {actionsSlice.isLoading && <LoadingData />} */}
                </View>
              )}
              <View style={statusStyles.deleteRowLeft}>
                {displayStoryContent()}
              </View>
              <View style={statusStyles.deleteRowRight}>
                <ReactNativeElementsButton
                  title="Delete"
                  color="error"
                  size="sm"
                  onPress={() => deleteUserStoryFeedData(story._id)}
                />
              </View>
            </View>
            <View>
              <Divider />
            </View>
          </View>
        );
      })}
    </View>
  );
};

export default CurrentUserStories;
