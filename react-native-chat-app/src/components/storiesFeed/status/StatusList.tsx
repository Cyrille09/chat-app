import React from "react";
import StatusItem from "./StatusItem";
import statusStyles from "./statusStyles";
import { View } from "react-native";

interface Status {
  id: number;
  name: string;
  timestamp: string;
  profilePic: string;
}

interface StatusListProps {
  statuses: Status[];
}

const StatusList: React.FC<StatusListProps> = ({ statuses }) => {
  return (
    <View style={statusStyles.statusList}>
      {statuses.map((status: any, index: number) => (
        <StatusItem
          key={status.user._id}
          name={status.user.name}
          timestamp={status.stories[status.stories.length - 1].createdAt}
          profilePic={status.user.photoUrl}
          status={status}
          index={index}
        />
      ))}
    </View>
  );
};

export default StatusList;
