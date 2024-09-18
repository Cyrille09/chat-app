import { Alert } from "@/src/components/alert/Alert";
import { RootState } from "@/src/redux-toolkit/store";
import { ScrollView, View } from "react-native";
import { useSelector } from "react-redux";
import styles from "./chatListStyles";
import StarChatAreaCenterLevel from "../chatArea/StarChatAreaCenterLevel";

const AddNewGroup = () => {
  const usersSlice = useSelector((state: RootState) => state.usersSlice);
  const actionsSlice = useSelector((state: RootState) => state.actionsSlice);
  const chatMessageSlice = useSelector(
    (state: RootState) => state.chatMessageSlice
  );

  return (
    <View style={styles.container}>
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
              <StarChatAreaCenterLevel
                chatMessageSlice={chatMessageSlice}
                userRecord={usersSlice.currentUser.user}
              />
            </ScrollView>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

export default AddNewGroup;
