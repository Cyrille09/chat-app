import React from "react";
import statusStyles from "./statusStyles";
import { useDispatch } from "react-redux";
import { format, isToday, isYesterday, parseISO } from "date-fns";
import { successStoryFeedUserStatusActions } from "@/src/redux-toolkit/reducers/actionsSlice";
import { TouchableOpacity, View } from "react-native";
import { Image, Text } from "@rneui/themed";

interface StatusItemProps {
  name: string;
  timestamp: string;
  profilePic: string;
  status: string | boolean;
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
    <TouchableOpacity
      onPress={() => {
        dispatch(
          successStoryFeedUserStatusActions({
            status: true,
            record: { status, index: index },
          })
        );
      }}
    >
      <View style={statusStyles.statusItem}>
        {profilePic ? (
          <Image
            source={{
              uri: `${process.env.EXPO_PUBLIC_BASE_URL}/images/profile/${profilePic}`,
            }}
            alt={`profile`}
            width={50}
            height={50}
            containerStyle={statusStyles.profilePic}
          />
        ) : (
          <Image
            source={{
              uri: `https://via.placeholder.com/150`,
            }}
            alt={`profile`}
            width={50}
            height={50}
            containerStyle={statusStyles.profilePic}
          />
        )}
        <View style={statusStyles.statusInfo}>
          <Text style={statusStyles.statusName}>{name}</Text>
          <Text style={statusStyles.statusTimestamp}>{dateCreated()}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default StatusItem;
