import { StyleSheet } from "react-native";
import { Colors } from "@/src/constants/Colors";

const styles = StyleSheet.create({
  contactName: {
    fontSize: 16,
    fontWeight: "bold",
  },

  sectionHeading: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 5,
  },

  mediaCountContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
  },

  mediaImage: {
    width: "100%",
    height: 100,
    borderRadius: 10,
  },

  contactInfo: {
    flexDirection: "column",
    backgroundColor: "white",
  },
  contactInfoTop: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderBottomWidth: 1,
    borderBottomColor: Colors.gray300,
    backgroundColor: Colors.gray50,
  },
  iconInRed: {
    color: "red",
  },
  icon: {
    marginRight: 10,
  },
  chatListTopIcon: {
    cursor: "pointer",
  },

  separator: {
    height: 1,
    backgroundColor: "#ddd",
    marginBottom: 25,
  },
  contactInfoGroupMember: {
    paddingVertical: 10,
    paddingHorizontal: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderBottomWidth: 1,
    borderBottomColor: "#D1D5DB",
  },
  contactInfoGroupMemberIcon: {
    cursor: "pointer",
    zIndex: 0,
  },
  contactContent: {
    overflow: "scroll",
    flexDirection: "column",
  },
  contactHeader: {
    alignItems: "center",
    marginVertical: 10,
    padding: 20,
    flexDirection: "column",
  },
  contactHeaderH4: {
    textTransform: "capitalize",
  },
  contactHeaderP: {
    textTransform: "lowercase",
  },
  avatar: {
    width: "auto",
    height: 200,
    borderRadius: 100,
    marginBottom: 10,
  },
  noImage: {
    textAlign: "center",
    alignItems: "center",
    justifyContent: "center",
    height: 200,
    width: 200,
    backgroundColor: Colors.gray400,
    borderRadius: 100,
    marginBottom: 10,
  },
  noImageText: {
    color: "white",
    textTransform: "uppercase",
  },
  userNoImageText: {
    color: "white",
    textTransform: "uppercase",
    fontSize: 30,
  },
  contactInfoAbout: {
    textAlign: "left",
    paddingVertical: 20,
    paddingLeft: 20,
  },
  contactInfoMedia: {
    textAlign: "left",
    paddingVertical: 20,
    paddingLeft: 20,
    paddingRight: 10,
  },
  mediaHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
    cursor: "pointer",
  },
  mediaCount: {
    // fontSize: 15,
  },
  mediaItems: {
    display: "flex",
    flexDirection: "row",
    gap: 10,
    overflow: "scroll",
  },
  mediaItem: {
    position: "relative",
    width: 100,
    height: 100,
    overflow: "hidden",
    borderRadius: 8,
    borderColor: Colors.gray400,
    borderWidth: 5,
  },
  mediaItemImage: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  videoDuration: {
    position: "absolute",
    bottom: 5,
    right: 5,
    backgroundColor: "rgba(0, 0, 0, 0.6)",
    color: "white",
    paddingHorizontal: 5,
    paddingVertical: 2,
    fontSize: 12,
    borderRadius: 4,
  },
  contactInfoActions: {
    textAlign: "left",
    paddingVertical: 20,
    paddingLeft: 20,
    paddingRight: 10,
  },
  eachAction: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 30,
    cursor: "pointer",
  },
  eachActionInRed: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 30,
    cursor: "pointer",
    color: Colors.danger,
  },
  eachActionInRedText: {
    color: "#FF4D4F",
  },
  eachActionLeftIcon: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 20,
  },
  eachActionLeftIconInRed: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 20,
    color: "#FF4D4F",
  },
  mutedDate: {
    fontSize: 13,
    marginLeft: 38,
  },
  chatAreaTop: {
    display: "flex",
    paddingRight: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderBottomWidth: 1,
    borderBottomColor: "#D1D5DB",
  },
  user: {
    flexDirection: "row",
    alignItems: "center",
    gap: 20,
    marginVertical: 10,
  },
  groupAdminAction: {
    flexDirection: "row",
    gap: 5,
  },
  userImage: {
    width: "auto",
    height: 45,
    borderRadius: 22.5,
    resizeMode: "cover",
  },
  chatAreaTopTexts: {
    flexDirection: "column",
    paddingTop: 10,
  },
  chatAreaTopTextsName: {
    fontWeight: "bold",
  },
  chatAreaTopTextSpan: {
    fontWeight: "300",
    textTransform: "capitalize",
  },
  chatAreaTopLastOnline: {
    color: Colors.teal,
    fontSize: 13,
  },
  chatAreaTopLastSeen: {
    fontSize: 13,
  },
  chatAreaTopOffline: {
    fontSize: 13,
    color: Colors.danger,
  },
  chatAreaTopTextP: {
    fontSize: 14,
    fontWeight: "300",
  },
  chatListItemUserNoImage: {
    textAlign: "center",
    alignItems: "center",
    justifyContent: "center",
    height: 50,
    width: 50,
    backgroundColor: Colors.gray400,
    borderRadius: 25,
  },
  chatListItemUserNoImageText: {
    color: "white",
    textTransform: "uppercase",
    fontSize: 15,
    marginTop: 10,
  },
  groupAdmin: {
    flexDirection: "row",
    alignItems: "center",
    color: "green",
  },
  groupAdminSpan: {
    fontSize: 13,
    backgroundColor: Colors.teal,
    paddingHorizontal: 3,
    paddingVertical: 1,
    color: "white",
    borderRadius: 3,
    marginRight: 10,
  },

  profileImage: {
    width: 150,
    height: 150,
    borderRadius: 50,
    marginBottom: 10,
  },
  groupMembersText: {
    marginTop: 5,
  },
});

export default styles;
