import StoriesFeed from "@/src/components/storiesFeed/StoriesFeed";
import { UserStatus } from "@/src/components/storiesFeed/status/UserStatus";
import { userContactStoryFeedsRecord } from "@/src/redux-toolkit/reducers/userContactsSlice";
import { RootState } from "@/src/redux-toolkit/store";
import { getContactUserStoryFeeds } from "@/src/services/storyFeedsServices";
import { useEffect } from "react";
import { View, Text, ScrollView } from "react-native";
import { useDispatch, useSelector } from "react-redux";

export default function StoryFeedScreen() {
  const actionsSlice = useSelector((state: RootState) => state.actionsSlice);
  const usersSlice = useSelector((state: RootState) => state.usersSlice);
  const userContactsSlice = useSelector(
    (state: RootState) => state.userContactsSlice
  );
  const dispatch = useDispatch();

  useEffect(() => {
    let isSubscribed = true;
    const getContactUserStoryFeedsData = async () => {
      getContactUserStoryFeeds()
        .then((response) => {
          if (isSubscribed)
            dispatch(userContactStoryFeedsRecord(response.data));
        })
        .catch((error) => {});
    };

    getContactUserStoryFeedsData();

    return () => {
      isSubscribed = false;
    };
  }, []);

  return (
    <View>
      <ScrollView>
        {actionsSlice.successStoryFeedUserStatus.status ? (
          <View
            style={{
              alignContent: "center",
              alignItems: "center",
              alignSelf: "center",
            }}
          >
            {userContactsSlice.userContactStoryFeeds.length > 0 ? (
              <StoriesFeed users={userContactsSlice.userContactStoryFeeds} />
            ) : (
              <Text>Loading stories...</Text>
            )}
          </View>
        ) : (
          <View>
            <UserStatus
              usersStatuses={userContactsSlice.userContactStoryFeeds}
              userRecord={usersSlice.currentUser.user}
            />
          </View>
        )}
      </ScrollView>
    </View>
  );
}
