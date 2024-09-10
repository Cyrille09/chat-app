import { StyleSheet } from "react-native";
import { Colors } from "@/src/constants/Colors";

const styles = StyleSheet.create({
  statusItem: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
    cursor: "pointer",
  },
  profilePic: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 10,
  },
  statusInfo: {
    display: "flex",
    flexDirection: "column",
  },
  statusName: {
    fontWeight: "bold",
  },
  statusTimestamp: {
    color: "gray",
    fontSize: 13,
  },
  statusList: {
    marginVertical: 20,
  },
  statusMain: {
    padding: 20,
  },
  statusHeader: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: Colors.gray50,
  },
  statusHeaderTop: {
    flexDirection: "row",
  },

  deleteRow: {
    display: "flex",
    flexDirection: "row",
    marginVertical: 10,
  },

  deleteRowLeft: {
    flex: 2,
    paddingTop: 5,
  },

  deleteRowRight: {},

  statusHeaderTitle: {
    marginTop: 15,
  },
  addStatus: {
    backgroundColor: "#25d366",
    color: "white",
    borderRadius: 17.5,
    width: 35,
    height: 35,
    fontSize: 24,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
  },
  addStatusHover: {
    backgroundColor: "#128c7e",
  },
  deleteStoryFeed: {
    cursor: "pointer",
    fontSize: 13,
    backgroundColor: Colors.red,
    color: Colors.white,
    paddingVertical: 3,
    paddingHorizontal: 5,
    borderRadius: 5,
  },
  deleteStoryFeedText: {
    color: Colors.white,
  },
  showStoryFeedText: {
    color: Colors.white,
  },
  showStoryFeed: {
    cursor: "pointer",
    fontSize: 13,
    backgroundColor: Colors.success,
    color: Colors.white,
    paddingVertical: 3,
    paddingHorizontal: 5,
    borderRadius: 5,
  },

  statusStory: {
    marginTop: 20,
  },
  statusStoryImage: {
    width: 100,
    height: 100,
    maxWidth: 200,
    maxHeight: 200,
  },
  deleteStatusStoryError: {
    marginBottom: 20,
  },
});

export default styles;
