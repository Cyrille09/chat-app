import { StyleSheet } from "react-native";

export default StyleSheet.create({
  headerRight: {
    display: "flex",
    flexDirection: "row",
    marginRight: 15,
  },
  centeredView: {
    position: "fixed",
    backgroundColor: "white",
    marginHorizontal: 10,
    marginVertical: 80,
    overflow: "scroll",
  },

  modalRow: {
    display: "flex",
    flexDirection: "row",
    margin: 20,
    gap: 20,
  },
  modalTitle: {
    flex: 1,
    marginTop: 5,
  },
  modalTitleText: {
    fontSize: 18,
  },
  modalClose: {
    alignSelf: "flex-end",
  },
});
