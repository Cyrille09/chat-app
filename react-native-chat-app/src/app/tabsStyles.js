import { StyleSheet } from "react-native";
import { Colors } from "@/src/constants/Colors";

export default StyleSheet.create({
  headerRight: {
    display: "flex",
    flexDirection: "row",
    marginRight: 15,
    gap: 30,
  },

  headerRightIcon: {
    marginRight: 15,
  },

  chatList: {
    flex: 1,
    overflow: "scroll",
    backgroundColor: Colors.white,
    paddingTop: 20,
  },

  container: {
    flex: 1,
    alignContent: "flex-start",
    justifyContent: "center",
    paddingHorizontal: 20,
    backgroundColor: "#e5ddd5",
  },

  memberSignInUp: {
    marginLeft: 20,
    textDecorationLine: "underline",
  },

  wrapper: {
    flex: 1,
  },
  spinnerTextStyle: {
    color: Colors.white,
    fontSize: 18,
  },
  header: {
    flex: 1,
    justifyContent: "flex-end",
    paddingHorizontal: 20,
    alignItems: "center",
  },
  contentHeader: {
    flex: 0.6,
    justifyContent: "flex-end",
    alignItems: "center",
  },
  logo: {
    height: "100%",
    width: "100%",
    maxWidth: 140,
    resizeMode: "contain",
    marginBottom: 25,
  },

  // form
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

  // forgot password link
  forgotPasswordContent: {
    marginTop: 25,
    width: "100%",
  },
  forgotPassword: {
    textTransform: "none",
    textAlign: "center",
    fontSize: 15,
  },

  // password reset
  passwordReset: {},
  passwordResetMessage: {
    textAlign: "center",
    marginTop: 5,
    marginBottom: 30,
  },
  flexRowWrap: {
    display: "flex",
    flexDirection: "row",
    flexWrap: "wrap",
  },

  filterGroup: {
    marginRight: 15,
  },

  chatListTop: {
    borderBottomWidth: 1,
    borderBottomColor: "#d1d5db",
    backgroundColor: "#ffffff",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    zIndex: 100,
    elevation: 8,
  },
  userInfo: {
    paddingVertical: 13,
    paddingHorizontal: 20,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#f0f2f6",
  },
  user: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    textTransform: "capitalize",
  },

  groupAdminAction: {
    flexDirection: "row",
    gap: 5,
  },
  userImage: {
    width: "auto",
    height: 45,
    borderRadius: 50,
    resizeMode: "cover",
  },
  userText: {
    fontWeight: "500",
  },
  icons: {
    flexDirection: "row",
    gap: 20,
  },
  chatListTopIcon: {
    width: 20,
    height: 20,
    color: "#555",
  },
  chatListUserInfoNoImage: {
    justifyContent: "center",
    alignItems: "center",
    height: 50,
    width: 50,
    backgroundColor: Colors.gray400,
    borderRadius: 50,
  },
  chatListUserInfoNoImageText: {
    color: Colors.white,
    textTransform: "uppercase",
    fontSize: 15,
    marginTop: 10,
  },
  searchAndAdd: {
    backgroundColor: Colors.white,
    marginTop: 10,
    marginBottom: 20,
  },
  addUser: {
    backgroundColor: Colors.gray600,
    color: Colors.white,
  },
  addUserIcon: {
    color: Colors.white,
  },
  search: {
    flexDirection: "row",
    alignItems: "center",
    gap: 20,
    paddingHorizontal: 20,
  },
  searchBar: {
    marginBottom: 10,
    marginLeft: -5,
  },
  add: {
    width: 36,
    height: 36,
    backgroundColor: "rgba(17, 25, 40, 0.5)",
    padding: 10,
    borderRadius: 10,
  },
  messageStatus: {
    marginBottom: 20,
    marginLeft: 10,
    marginRight: 5,
  },
  chatListContent: {
    flex: 1,
    overflow: "scroll",
    flexDirection: "column",
    justifyContent: "space-between",
  },
  chatListItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: Colors.gray300,
    justifyContent: "space-between",
  },
  chatListitemUserMessage: {
    flexDirection: "row",
    alignItems: "center",
    gap: 20,
  },
  chatListitemUserMessageImage: {
    width: 50,
    height: 50,
    borderRadius: 50,
    resizeMode: "cover",
  },
  chatListItemTexts: {
    flexDirection: "column",
    paddingTop: 5,
  },
  chatListItemText: {
    fontWeight: "500",
  },

  chatListItemUserNoImage: {
    justifyContent: "center",
    alignItems: "center",
    height: 50,
    width: 50,
    backgroundColor: Colors.gray400,
    borderRadius: 50,
  },
  chatListItemUserNoImageText: {
    color: Colors.white,
    textTransform: "uppercase",
    fontSize: 15,
    marginTop: 10,
  },
  chatListitemStatus: {
    flexDirection: "column",
    textAlign: "right",
    paddingTop: 5,
    fontSize: 13,
  },

  numberOfUnread: {
    color: Colors.white,
    backgroundColor: Colors.teal,
    paddingVertical: 1,
    paddingHorizontal: 5,
    borderRadius: 50,
    fontSize: 11,
  },
  chatListDate: {
    fontSize: 13,
  },
  unreadDate: {
    color: Colors.teal,
  },
  activeList: {
    backgroundColor: Colors.gray300,
  },
  chatListItemHover: {
    backgroundColor: Colors.gray200,
  },
  chatListNoContent: {
    justifyContent: "center",
    alignItems: "center",
    marginTop: 50,
  },
  chatListNoContentBtn: {
    color: "aqua",
  },
  popupMessage: {
    borderRadius: 5,
    position: "relative",
    maxWidth: 600,
    zIndex: 9999,
  },
  icon: {
    position: "absolute",
    top: 10,
    right: 10,
    fontSize: 18,
  },
  popupMenu: {
    position: "absolute",
    top: 30,
    right: 0,
    backgroundColor: Colors.white,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    width: 200,
  },
  popupMenuList: {
    listStyle: "none",
    margin: 0,
    padding: 0,
  },
  popupMenuItem: {
    paddingVertical: 10,
    paddingHorizontal: 10,
  },
  popupMenuItemHover: {
    backgroundColor: "#f0f0f0",
  },
  logout: {
    borderTopWidth: 1,
    borderTopColor: Colors.gray400,
  },
  popupStatusAction: {
    fontSize: 20,
    marginRight: 7,
  },

  popupMessage: {
    borderRadius: 5,
    position: "relative",
    maxWidth: 600,
    zIndex: 9999,
  },
  icon: {
    position: "absolute",
    top: 10,
    right: 10,
    backgroundColor: "transparent",
    borderWidth: 0,
    fontSize: 18,
  },
  popupMenu: {
    position: "absolute",
    // top: 30,
    right: 0,
    backgroundColor: "#fff",
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
    // width: 100,
  },
  popupMenuList: {
    listStyle: "none",
    margin: 0,
    padding: 0,
  },
  popupMenuItem: {
    paddingVertical: 5,
    paddingHorizontal: 10,
    cursor: "pointer",
  },
  popupMenuItemHover: {
    backgroundColor: "#f0f0f0",
  },
  logout: {
    borderTopColor: Colors.gray400,
    borderTopWidth: 1,
  },
  popupStatusAction: {
    fontSize: 20,
    marginRight: 7,
  },
  // start from here
  chatListItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: Colors.gray300,
    justifyContent: "space-between",
  },
  chatListitemUserMessage: {
    flexDirection: "row",
    alignItems: "center",
  },
  chatListItemTexts: {
    marginLeft: 10,
    maxWidth: "75%",
  },
  chatListItemText: {
    fontWeight: "500",
    fontSize: 16,
    color: Colors.gray800,
  },
  chatListItemTextP: {
    color: Colors.gray500,
    fontSize: 14,
    fontWeight: "normal",
  },
  profileImage: {
    height: 50,
    width: 50,
    borderRadius: 25,
  },
  chatListItemUserNoImage: {
    backgroundColor: Colors.gray300,
    height: 50,
    width: 50,
    borderRadius: 25,
    alignItems: "center",
    justifyContent: "center",
  },
  chatListItemUserNoImageText: {
    color: Colors.gray800,
    fontSize: 18,
    // fontWeight: "bold",
  },
  chatListitemStatus: {
    alignItems: "flex-end",
  },
  chatListDate: {
    color: Colors.gray500,
    fontSize: 12,
  },

  activeList: {
    backgroundColor: Colors.gray200,
  },
});
