import { StyleSheet, Platform, View } from "react-native";
import { Divider, Image, Text, Icon } from "@rneui/themed";

export default function CallsScreen() {
  return (
    <View>
      <Text>Coming soon</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  headerImage: {
    color: "#808080",
    bottom: -90,
    left: -35,
    position: "absolute",
  },
  titleContainer: {
    flexDirection: "row",
    gap: 8,
  },
});
