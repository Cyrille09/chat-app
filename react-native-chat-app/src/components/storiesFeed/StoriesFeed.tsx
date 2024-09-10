import React, { useState } from "react";
import UserStories from "./UserStories";
import "react-native-get-random-values";
import { v4 as uuidv4 } from "uuid";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/src/redux-toolkit/store";
import { View } from "react-native";
import { successStoryFeedUserStatusActions } from "@/src/redux-toolkit/reducers/actionsSlice";
import { ReactNativeElementsButton } from "../reactNativeElements/ReactNativeElements";
import storiesStyles from "./storiesStyles";

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
    <View style={storiesStyles.storiesFeed}>
      <View style={storiesStyles.storiesFeedAction}>
        <View style={storiesStyles.userNavigation}>
          <View style={{ marginRight: 15 }}>
            <ReactNativeElementsButton
              title="Previous"
              color="primary"
              size="sm"
              disabled={currentUserIndex === 0}
              onPress={handlePreviousUser}
            />
          </View>
          <View>
            <ReactNativeElementsButton
              title="Next"
              color="primary"
              size="sm"
              disabled={currentUserIndex === users.length - 1}
              onPress={handleNextUser}
            />
          </View>
        </View>

        <View>
          <ReactNativeElementsButton
            title="Close"
            color="success"
            size="sm"
            onPress={() =>
              dispatch(
                successStoryFeedUserStatusActions({ status: false, record: {} })
              )
            }
          />
        </View>
      </View>
      <UserStories
        stories={users[currentUserIndex].stories}
        onAllStoriesEnd={handleNextUser}
        key={uuidv4()}
        user={users[currentUserIndex]}
      />
    </View>
  );
};

export default StoriesFeed;
