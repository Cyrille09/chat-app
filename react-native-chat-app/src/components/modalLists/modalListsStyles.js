import { StyleSheet } from "react-native";
import { Colors } from "@/src/constants/Colors";

const styles = StyleSheet.create({
  userProfile: {
    margin: 20,
  },
  userDetails: {
    textAlign: "left",
  },
  userProfileAvatar: {
    width: 150,
    height: 150,
    borderRadius: 20,
    marginBottom: 20,
    maxWidth: 150,
    maxHeight: "auto",
    marginBottom: 5,
    resizeMode: "contain",
  },
  flexRowWrap: {
    display: "flex",
    flexDirection: "row",
    flexWrap: "wrap",
  },

  userProfileAvatarSave: {
    alignSelf: "flex-start",
    justifyContent: "center",
  },

  userProfileAvatarAdd: {
    flex: 1,
    justifyContent: "center",
    alignSelf: "center",
    alignItems: "center",
  },
  userProfileAvatarDelete: {
    alignSelf: "flex-end",
    justifyContent: "center",
  },

  userDetailsInfoUpBtn: {
    textAlign: "right",
    marginTop: -2,
    alignSelf: "flex-end",
  },

  userProfileDetailsInfo: {
    textAlign: "left",
    paddingVertical: 15,
    paddingHorizontal: 25,
  },
  userDetailDivider: {
    marginBottom: 20,
    marginTop: 10,
  },

  userDetailsAvatar: {
    alignItems: "center",
  },
  userDetailDisplayImage: {
    marginBottom: 20,
    minHeight: 100,
  },

  // to be reviewed
  userProfileImageUpload: {
    input: {
      display: "none",
    },
    span: {
      paddingLeft: 5,
    },
    hr: {
      marginVertical: 40,
    },
  },

  modal: {
    margin: 0,
    marginHorizontal: 30,
    marginBottom: 30,
    marginLeft: 20,
  },
  footer: {
    marginTop: 30,
  },
  panelFooter: {
    backgroundColor: "#f8f8f8",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 15,
    paddingHorizontal: 25,
  },
  locatonAndAreaIcon: {
    fontSize: 8,
    color: "#132144",
    width: 20,
  },
  serialNumber: {
    marginRight: 10,
    width: "45%",
  },
  deviceOption: {
    width: "45%",
  },

  flexRow: {
    flexDirection: "row",
  },
  emailExistError: {
    paddingLeft: 45,
    display: "block",
    width: "100%",
    fontSize: 14,
    color: Colors.danger,
  },
  comercialRules: {
    margin: 90,
  },
  addEmail: {
    alignSelf: "flex-end",
    marginTop: 4,
    width: "30%",
  },
  generatedPasswordLink: {
    overflow: "hidden",
    whiteSpace: "nowrap",
    textOverflow: "ellipsis",
  },
  footerLeft: {
    marginRight: 15,
  },
  flexRowWrapModalFooter: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  footerAssignDevice: {
    marginTop: 6,
  },
  rightAligned: {
    flexDirection: "row",
    justifyContent: "flex-end",
  },
  leftSide: {
    flex: 1,
  },
  rightSide: {
    flex: "none",
    width: "auto",
  },
  tooltipIconHide: {
    display: "none",
    opacity: 0,
  },
  tooltipIconLeftSpace: {
    marginRight: 10,
    marginTop: 5,
    width: "5%",
    flex: 1,
  },
  errorMessage: {
    display: "block",
    width: "100%",
    marginTop: 4,
    fontSize: 14,
    color: Colors.danger,
  },
  tooltipIconHover: {
    display: "block",
    backgroundColor: "#132144",
    borderRadius: 8,
    color: "#fff",
    lineHeight: 1.5,
    textAlign: "center",
    fontSize: 12,
    paddingVertical: 4,
    paddingHorizontal: 8,
    maxWidth: 200,
    width: 200,
    wordWrap: "break-word",
    textTransform: "none",
    fontWeight: "400",
    position: "absolute",
    bottom: "175%",
    opacity: 1,
    marginLeft: -100,
    left: "50%",
    transition: "opacity 0.2s",
  },
  tooltipIconHoverBefore: {
    position: "absolute",
    content: '""',
    borderColor: "transparent",
    borderStyle: "solid",
    bottom: -6,
    borderWidth: 6,
    borderTopColor: "#132144",
    marginLeft: -4,
  },

  userDetails_h4: {
    color: "#6c757d",
    paddingTop: 5,
  },

  userDetailsInfo: {
    textAlign: "left",
    paddingVertical: 20,
    paddingHorizontal: 25,
  },

  sendImageMessage: {
    textAlign: "center",
    marginVertical: 50,
  },
  sendImageMessageAvatar: {
    maxWidth: 250,
    maxHeight: "auto",
  },
  sendDocumentMessage: {
    textAlign: "center",
    marginVertical: 50,
  },
  sendDocumentMessage_p: {
    marginTop: 20,
  },
  modalMediaItems: {
    flexDirection: "row",
    textAlign: "center",
    flexWrap: "wrap",
    gap: 10,
  },
  modalMediaItem: {
    position: "relative",
    width: 100,
    height: 100,
    borderRadius: 8,
    borderColor: Colors.gray400,
    borderWidth: 5,
  },
  modalMediaItem_img: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
  },
  chatAreaCenter: {
    marginBottom: 20,
    flex: 1,
    flexDirection: "column",
    gap: 20,
  },
  message: {
    flexDirection: "row",
    gap: 20,
    overflow: "scroll",
  },
  message_own: {
    chatAreaCenterTexts: {
      chatAreaCenterContent: {
        backgroundColor: Colors.messageOwner,
      },
    },
  },
  message_receiver: {
    chatAreaCenterTexts: {
      chatAreaCenterContent: {
        backgroundColor: Colors.gray50,
      },
    },
  },
  documentSavePdf: {
    color: "#e23002",
  },
  messageList: {
    paddingRight: 30,
  },
  messageTime: {
    textAlign: "right",
    fontSize: 14,
    color: "#999",
  },
  message_img: {
    width: 30,
    height: 30,
    borderRadius: 50,
    objectFit: "cover",
  },
  chatAreaCenterTexts: {
    flex: 1,
    flexDirection: "column",
    gap: 5,
  },
  chatAreaCenterTexts_img: {
    width: "100%",
    height: "auto",
    borderRadius: 10,
    objectFit: "cover",
  },
  chatAreaCenterContent: {
    paddingVertical: 5,
    paddingHorizontal: 20,
    backgroundColor: "#fff",
    borderRadius: 10,
  },
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
  user_img: {
    width: "auto",
    height: 35,
    borderRadius: 50,
    objectFit: "cover",
  },
  user_span: {
    fontWeight: "500",
  },
  chatListUserInfoNoImage: {
    textAlign: "center",
    alignItems: "center",
    height: 35,
    width: 35,
    backgroundColor: Colors.gray400,
    borderRadius: 50,
  },
  chatListUserInfoNoImage_p: {
    color: "#fff",
    textTransform: "uppercase",
    fontSize: 14,
    marginTop: 6,
  },
  userInfoTop: {
    marginBottom: 15,
  },
  userInfoLinkTop: {
    marginBottom: 5,
  },

  messageLink: {
    color: Colors.blueChat,
    textAlign: "left",
  },
  documentSaveWord: {
    color: "#cc99ff",
  },
  documentTitle: {
    marginHorizontal: 10,
    marginLeft: 5,
  },
  documentTitle_a: {
    color: "#555",
    textDecorationLine: "none",
  },
  documentTitle_a_hover: {
    color: Colors.blueChat,
  },
  documentSaveDownload: {
    backgroundColor: Colors.gray500,
    padding: 5,
    borderRadius: 50,
    color: "#fff",
  },
  documentSaveDownloadIcon: {
    textAlign: "center",
    cursor: "pointer",
    paddingRight: 3,
  },
  newGroupSection: {
    marginTop: 30,
  },
  newGroup: {
    textAlign: "left",
  },
  newGroupItems: {
    backgroundColor: "#f8f8f8",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 15,
    paddingHorizontal: 20,
  },
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
  chatAreaButtonRow: {
    display: "flex",
    flexDirection: "row",
    marginHorizontal: 10,
  },

  icons: {
    display: "flex",
    flexDirection: "row",
    gap: 15,
    marginTop: 20,
  },
  inputContainer: {
    flex: 1,
    marginHorizontal: 10,
  },
  chatAreaSend: {
    marginTop: 20,
  },
  emojiPicker: {
    position: "relative",
  },
  emojiPickerContainer: {
    position: "absolute",
    bottom: 95,
    left: 0,
  },
  noRecord: {
    flexDirection: "row",
    alignItems: "center",
    textAlign: "center",
    alignContent: "center",
    justifyContent: "center",
  },
});

export default styles;
