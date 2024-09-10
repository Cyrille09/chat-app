import { View, Image } from "react-native";

// style components

export function Loading() {
  return (
    <View>
      <Image
        source={require("@/assets/chat-images/icons/loading.gif")}
        style={{ width: 70, height: 80, resizeMode: "contain" }}
      ></Image>
    </View>
  );
}
