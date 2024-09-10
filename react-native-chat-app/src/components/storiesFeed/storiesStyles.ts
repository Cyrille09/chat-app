import { StyleSheet } from "react-native";
import { Colors } from "@/src/constants/Colors";

const styles = StyleSheet.create({
  container: {
    width: "100%",
    flexDirection: "column",
    justifyContent: "flex-start",
  },

  storyList: {
    textAlign: "center",
  },
  storiesFeed: {
    padding: 20,
    position: "relative",
    maxWidth: 400,
    marginHorizontal: "auto",
  },
  storiesFeedAction: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  userStories: {
    position: "relative",
  },
  storyImageVideo: {
    width: "100%",
    aspectRatio: 16 / 9,
    resizeMode: "cover",
  },
  storyViewText: {
    padding: 20,
    marginHorizontal: 20,
    backgroundColor: "#eee",
    borderRadius: 10,
    alignItems: "center",
  },
  storyText: {
    minHeight: 300,
  },
  navigation: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 10,
  },
  userNavigation: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 10,
  },
  userStoryContainer: {
    display: "flex",
    flexDirection: "row",
    flexWrap: "nowrap",
    gap: 5,
    marginHorizontal: 20,
    marginVertical: 5,
  },
  userStoryList: {
    paddingVertical: 10,
  },
  storyHeader: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: Colors.gray50,
  },
  storyHeaderTop: {
    flexDirection: "row",
  },
  userStoryName: {
    // textAlign: "left",
  },
  userStoryPic: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 10,
  },
  userStoryTimestamp: {
    fontSize: 13,
  },
  button: {
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    color: "white",
    borderWidth: 0,
    padding: 10,
    cursor: "pointer",
  },
  buttonDisabled: {
    opacity: 0.5,
    cursor: "auto",
  },
  storyParagraph: {
    padding: 20,
    backgroundColor: "#eee",
    borderRadius: 10,
  },
  progressBar: {
    width: "100%",
    height: 5,
    backgroundColor: Colors.gray500,
  },
  progress: {
    height: "100%",
    backgroundColor: Colors.gray500,
  },
  activeProgress: {
    height: "100%",
    backgroundColor: Colors.success,
  },
});

export default styles;
