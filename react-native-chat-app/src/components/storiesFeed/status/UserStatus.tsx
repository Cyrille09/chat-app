import { useState } from "react";
import { TouchableOpacity, View } from "react-native";
import { Image, Text } from "@rneui/themed";

import statusStyles from "./statusStyles";
import { FontAwesome } from "@expo/vector-icons";
import CurrentUserStories from "./CurrentUserStories";
import StatusList from "./StatusList";
import { ReactNativeDialog } from "../../dialog/Dialog";

interface StatusItemProps {
  usersStatuses: [];
  userRecord: { _id: string; photoUrl: string };
}

export function UserStatus({ usersStatuses, userRecord }: StatusItemProps) {
  const [showDeleteStory, setShowDeleteStory] = useState(false);
  const [toggleDialogVisable, setToggleDialogVisable] = useState(false);

  const toggleDialog = () => {
    setToggleDialogVisable(!toggleDialogVisable);
  };

  const currentUserStatuses: any = usersStatuses.find(
    (currentUserStories: { user: { _id: string } }) =>
      currentUserStories.user._id === userRecord._id
  );

  return (
    <View style={statusStyles.statusMain}>
      <View style={statusStyles.statusHeader}>
        <View style={statusStyles.statusHeaderTop}>
          {userRecord.photoUrl ? (
            <Image
              source={{
                uri: `${process.env.EXPO_PUBLIC_BASE_URL}/images/profile/${userRecord.photoUrl}`,
              }}
              width={50}
              height={50}
              alt="avatar"
              containerStyle={statusStyles.profilePic}
            />
          ) : (
            <Image
              source={{
                uri: `https://via.placeholder.com/150`,
              }}
              width={50}
              height={50}
              alt="avatar"
              containerStyle={statusStyles.profilePic}
            />
          )}

          <View>
            <Text h4>My status</Text>

            {currentUserStatuses && !showDeleteStory && (
              <TouchableOpacity
                style={statusStyles.deleteStoryFeed}
                onPress={() => setShowDeleteStory(true)}
              >
                <Text style={statusStyles.deleteStoryFeedText}>
                  Delete Story Feed
                </Text>
              </TouchableOpacity>
            )}

            {currentUserStatuses && showDeleteStory && (
              <TouchableOpacity
                style={statusStyles.showStoryFeed}
                onPress={() => setShowDeleteStory(false)}
              >
                <Text style={statusStyles.showStoryFeedText}>
                  Show Story Feed
                </Text>
              </TouchableOpacity>
            )}
          </View>
        </View>

        <TouchableOpacity
          style={statusStyles.addStatus}
          onPress={() => {
            toggleDialog();
          }}
        >
          <FontAwesome
            name="plus"
            size={20}
            color={"white"}
            onPress={() => {
              toggleDialog();
            }}
          />
        </TouchableOpacity>

        <ReactNativeDialog
          isVisible={toggleDialogVisable}
          onBackdropPress={toggleDialog}
          items={[
            {
              name: "Photo & Video",
              url: "/(screens)/storyFeed/story-feed",
              tag: "storyFeedPhotoAndVideo",
            },
            {
              name: "Text",
              url: "/(screens)/storyFeed/story-feed",
              tag: "storyFeedText",
            },
          ]}
        />
      </View>
      <View>
        {showDeleteStory ? (
          <CurrentUserStories stories={currentUserStatuses?.stories} />
        ) : (
          <StatusList statuses={usersStatuses} />
        )}
      </View>
    </View>
  );
}
