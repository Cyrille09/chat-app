import { Alert } from "@/src/components/alert/Alert";
import { RootState } from "@/src/redux-toolkit/store";
import { ScrollView, View } from "react-native";
import { useSelector } from "react-redux";
import styles from "./chatListStyles";
import MediaLinksDocsAreaCenterLevel from "../chatArea/MediaLinksDocsAreaCenterLevel";
import { useState } from "react";
import { ReactNativeElementsButton } from "@/src/components/reactNativeElements/ReactNativeElements";

const MediaLinksDocs = () => {
  const usersSlice = useSelector((state: RootState) => state.usersSlice);
  const actionsSlice = useSelector((state: RootState) => state.actionsSlice);
  const [messageType, setMessageType] = useState("image"); //document, link
  const chatMessageSlice = useSelector(
    (state: RootState) => state.chatMessageSlice
  );

  return (
    <View style={styles.container}>
      <View style={styles.mediaWrap}>
        <View style={styles.flexRowWrap}>
          <View style={styles.leftColumn}>
            <ReactNativeElementsButton
              title="Media"
              color={messageType === "image" ? "success" : "primary"}
              onPress={() => setMessageType("image")}
            />
          </View>
          <View style={styles.middleColumn}>
            <ReactNativeElementsButton
              title="Docs"
              color={messageType === "document" ? "success" : "primary"}
              onPress={() => setMessageType("document")}
            />
          </View>
          <View style={styles.rightColumn}>
            <ReactNativeElementsButton
              title="Links"
              color={messageType === "link" ? "success" : "primary"}
              onPress={() => setMessageType("link")}
            />
          </View>
        </View>
      </View>
      <ScrollView>
        <View style={styles.container}>
          <View>
            {actionsSlice.errorPopup.status && (
              <Alert type="error" message={actionsSlice.errorPopup.message} />
            )}
          </View>
          {/* {actionsSlice.isLoading && <LoadingData />} */}
          <View>
            <ScrollView
            // style={styles.chatAreaCenter}
            // ref={chatListRef}
            // contentContainerStyle={styles.chatAreaContent}
            >
              <MediaLinksDocsAreaCenterLevel
                chatMessageSlice={chatMessageSlice}
                userRecord={usersSlice.currentUser.user}
                messageType={messageType}
              />
            </ScrollView>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

export default MediaLinksDocs;
