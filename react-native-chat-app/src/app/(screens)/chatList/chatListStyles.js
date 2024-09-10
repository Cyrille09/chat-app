import { StyleSheet } from "react-native";
import { Colors } from "@/src/constants/Colors";

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    margin: 10,
  },

  flexRowWrap: {
    display: "flex",
    flexDirection: "row",
    flexWrap: "wrap",
    marginTop: 20,
  },

  leftColumn: {
    alignSelf: "flex-start",
    justifyContent: "center",
  },

  middleColumn: {
    flex: 1,
    justifyContent: "center",
    alignSelf: "center",
    alignItems: "center",
  },
  rightColumn: {
    alignSelf: "flex-end",
    justifyContent: "center",
  },

  // change password

  changePassword: {
    marginTop: 50,
    marginHorizontal: 20,
  },

  form: {
    flex: 4,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    alignItems: "center",
  },
  button: {
    marginTop: 10,
    width: "100%",
  },

  newGroupSection: {
    marginTop: 10,
  },
  newGroup: {
    // textAlign: "left",
  },
  newGroupItems: {
    backgroundColor: "#f8f8f8",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 15,
    paddingHorizontal: 20,
  },

  // Contact group info
  userInfo: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  user: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    textTransform: "capitalize",
  },
  userImage: {
    width: "auto",
    height: 45,
    borderRadius: 22.5,
    objectFit: "cover",
  },
  userName: {
    fontWeight: "500",
  },

  icons: {
    flexDirection: "row",
    gap: 20,
  },
  chatListTopIcon: {
    width: 20,
    height: 20,
    cursor: "pointer",
    color: "#555",
  },

  chatListUserInfoNoImage: {
    textAlign: "center",
    alignItems: "center",
    justifyContent: "center",
    height: 50,
    width: 50,
    backgroundColor: Colors.gray400,
    borderRadius: 25,
  },
  chatListUserInfoNoImageText: {
    color: "white",
    textTransform: "uppercase",
    fontSize: 15,
    marginTop: 10,
  },

  // Add story feed
  addStoryFeedMessage: {
    margin: 20,
    minHeight: 250,
  },
  addStoryFeedEmoji: {
    textAlign: "right",
  },
  addStoryFeedEmojiOpenAndClose: {
    cursor: "pointer",
    color: "#555",
    marginLeft: 10,
    marginTop: 5,
  },

  addStoryEmoji: {
    position: "relative",
  },
  addStoryPicker: {
    position: "absolute",
    bottom: 50,
    left: 0,
  },

  storyFeedImageDisplay: {
    margin: 20,
    minHeight: 250,
  },

  // No record
  noRecord: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    textAlign: "center",
  },
});

export default styles;
