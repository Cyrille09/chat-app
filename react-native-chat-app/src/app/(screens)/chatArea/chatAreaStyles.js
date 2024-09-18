import { StyleSheet } from "react-native";
import { Colors } from "@/src/constants/Colors";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#e5ddd5",
  },

  chatAreaContent: {
    flexGrow: 1,
    justifyContent: "flex-end",
  },
  backToTopButton: {
    alignItems: "center",
    justifyContent: "center",
    padding: 10,
  },
  formContainer: {},
  chatAreaWithNoDetails: {
    borderLeftWidth: 1,
    borderRightWidth: 1,
    borderColor: Colors.gray300,
    height: "100%",
    display: "flex",
    flexDirection: "column",
  },
  chatArea: {
    flex: 2,
    borderLeftWidth: 1,
    borderRightWidth: 1,
    borderColor: Colors.gray300,
    height: "100%",
    display: "flex",
    flexDirection: "column",
    // width: "50%",
  },
  chatAreaTop: {
    paddingHorizontal: 20,
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderBottomWidth: 1,
    borderColor: Colors.gray300,
    backgroundColor: Colors.gray50,
  },
  userInfo: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 10,
  },

  user: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },

  chatAreaTopUser: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },

  noImageText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#fff",
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

  userImage: {
    width: "auto",
    height: 45,
    borderRadius: 50,
    resizeMode: "cover",
  },
  chatAreaTopTexts: {
    display: "flex",
    flexDirection: "column",
    paddingTop: 3,
  },
  chatAreaTopTextsName: {
    fontWeight: "500",
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
  userNoImage: {
    textAlign: "center",
    alignItems: "center",
    justifyContent: "center",
    height: 50,
    width: 50,
    backgroundColor: Colors.gray400,
    borderRadius: 50,
  },
  userNoImageText: {
    color: "white",
    textTransform: "uppercase",
    fontSize: 15,
    marginTop: 10,
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

  chatAreaButtonRowRecording: {
    display: "flex",
    flexDirection: "row",
    flexWrap: "wrap",
    marginHorizontal: 20,
    marginBottom: 20,
  },

  chatAreaNavigatorIcons: {
    display: "flex",
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 18,
  },

  chatAreaNavigatorIcon: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },

  deleteRecording: {
    alignSelf: "flex-start",
    justifyContent: "center",
  },

  playorShowRecording: {
    flex: 1,
    justifyContent: "center",
    alignSelf: "center",
    alignItems: "center",
  },

  sendOrStopRecording: {
    alignSelf: "flex-end",
    justifyContent: "center",
  },

  chartTopIcon: {
    width: 20,
    height: 20,
    marginLeft: 5,
    color: "#555",
  },
  groupedDate: {
    alignSelf: "center",
    maxWidth: "50%",
    textAlign: "center",
    backgroundColor: Colors.white,
    paddingHorizontal: 10,
    borderRadius: 5,
    marginBottom: 20,
    padding: 5,
  },
  groupedDateText: {
    color: Colors.gray800,
    fontSize: 13,
  },
  chatAreaCenter: {
    padding: 20,
    flex: 1,
    overflow: "scroll",
    display: "flex",
    flexDirection: "column",
    gap: 20,
  },
  message: {
    maxWidth: "70%",
    display: "flex",
    flexDirection: "row",
    marginBottom: 20,
  },

  starMessage: {
    maxWidth: "100%",
    display: "flex",
    flexDirection: "row",
    marginBottom: 20,
  },

  ownMessage: {
    alignSelf: "flex-end",
  },

  actionMessage: {
    alignSelf: "center",
    maxWidth: "90%",

    textAlign: "center",
    color: "#666",
    fontStyle: "italic",
  },
  documentSavePdf: {
    color: "#E23002",
  },
  optionsBtn: {
    height: 20,
    width: 20,
    backgroundColor: "transparent",
    color: Colors.gray800,
    display: "none",
  },
  optionsSpan: {
    marginTop: 20,
    color: "transparent",
    backgroundColor: "transparent",
  },
  optionsSpanHover: {
    marginTop: -20,
  },
  messageList: {
    paddingRight: 30,
  },
  messageTime: {
    textAlign: "right",
    fontSize: 12,
    color: "#999",
  },
  messageStar: {
    fontSize: 13,
    color: Colors.black,
  },
  chatAreaCenterTexts: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    gap: 5,
  },
  messageImage: {
    width: "100%",
    height: "auto",
    borderRadius: 10,
    resizeMode: "cover",
  },
  chatAreaCenterContent: {
    paddingVertical: 5,
    paddingHorizontal: 20,
    backgroundColor: Colors.white,
    borderRadius: 10,
  },
  ownChatAreaCenterContent: {
    backgroundColor: Colors.messageOwner,
  },

  actionMessageChatAreaCenterContent: {
    backgroundColor: Colors.white,
  },
  messageDocument: {
    flexDirection: "row",
    gap: 5,
  },

  messageText: {
    fontSize: 16,
  },

  userProfileAvatar: {
    marginBottom: 5,
    marginTop: 15,
  },
  chatAreaMessage: {
    // marginTop: 20,
  },
  messageHover: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
  },
  groupMemberName: {
    fontSize: 15,
    color: Colors.gray500,
  },
  messageLink: {
    color: Colors.blueChat,
  },
  documentSaveWord: {
    color: "#CC99FF",
  },
  documentTitle: {
    marginHorizontal: 5,
  },
  documentSaveDownload: {
    backgroundColor: Colors.gray500,
    padding: 5,
    borderRadius: 50,
    color: "white",
  },
  documentSaveDownloadIcon: {
    textAlign: "center",
    cursor: "pointer",
    paddingRight: 3,
  },
  chatAreaBottom: {
    backgroundColor: Colors.gray50,
    textAlign: "center",
    paddingHorizontal: 10,
    paddingTop: 20,
  },
  chatAreaBottomIcons: {
    marginTop: 10,
  },

  audioMessage: {
    width: 200,
    height: 40,
  },
  recordingAudioText: {
    marginHorizontal: 20,
  },
  recordedAudio: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  recordedAudioText: {
    marginHorizontal: 30,
  },
  chatAreaBottomImage: {
    width: 20,
    height: 20,
    cursor: "pointer",
    color: "#555",
    marginLeft: 10,
  },
  chatAreaBottomImageClose: {
    cursor: "pointer",
    color: "#555",
    marginLeft: 10,
  },
  chatAreaBottomIcon: {
    width: 20,
    height: 20,
    cursor: "pointer",
    color: "#555",
  },
  recordingAudioPause: {
    width: 20,
    height: 20,
    cursor: "pointer",
    color: "red",
  },
  audioIcon: {
    cursor: "pointer",
  },
  chatInput: {
    borderColor: "transparent",
    outlineColor: "transparent",
    padding: 12,
    borderRadius: 10,
    fontSize: 16,
  },
  chatInputDisabled: {
    cursor: "not-allowed",
  },
  emojiPicker: {
    position: "relative",
  },
  emojiPickerContainer: {
    position: "absolute",
    bottom: 95,
    left: 0,
  },
  chatAreaSend: {
    marginTop: 20,
  },
  chatAreaBottomSendIcon: {
    fontSize: 28,
    cursor: "pointer",
  },
  chatAreaBottomBlock: {
    backgroundColor: Colors.gray400,
    color: "darkgray",
    cursor: "not-allowed",
    pointerEvents: "none",
    opacity: 0.4,
  },
  backToTop: {
    bottom: 110,
    right: 5,
    marginLeft: "90%",
    height: 35,
    width: 35,
    fontSize: 20,
    backgroundColor: Colors.gray500,
    borderRadius: 50,
    cursor: "pointer",
    position: "absolute",
    left: 0,
    right: 0,
    // zIndex: 1,
  },

  wavesurferContainer: {
    marginVertical: "1rem",
  },
  wavesurferControls: {
    display: "flex",
    flexDirection: "row",
    marginTop: "1.5rem",
  },
  wavesurferButton: {
    fontSize: "1.5rem",
    color: "white",
    marginHorizontal: "0.5rem",
  },
  wavesurferButtonSecondary: {
    backgroundColor: "#F90",
    backgroundImage: "linear-gradient(210deg, #F90, rgb(227, 180, 114))",
    borderRadius: "2rem",
    padding: "0.8rem",
  },
  wavesurferButtonTertiary: {
    backgroundColor: "#191B28",
    boxShadow: "inset 11px 11px 22px #0A0B10, inset -11px -11px 22px #282B40",
  },

  playPauseButton: {
    marginRight: 10,
  },
  playPauseText: {
    fontSize: 16,
  },
  slider: {
    flex: 1,
  },
  timeContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: 60,
    marginLeft: 10,
  },
});

export default styles;
