import { hideActions } from "@/src/redux-toolkit/reducers/actionsSlice";
import { UserInterface } from "../globalTypes/GlobalTypes";
import { AddNewContactUser } from "../modalLists/ModalLists";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/src/redux-toolkit/store";
import { View } from "react-native";
import { ReactNativeElementsButton } from "../reactNativeElements/ReactNativeElements";

const ChatListActions = ({
  user,
  requestUserContactRecord,
  userRecord,
}: {
  user: UserInterface;
  requestUserContactRecord: [];
  userRecord: {};
}) => {
  const actionsSlice = useSelector((state: RootState) => state.actionsSlice);

  const dispatch = useDispatch();

  return (
    <>
      {/* Add contact user */}
      {actionsSlice.successAddNewUsers.status && (
        <AddNewContactUser
          show={actionsSlice.successAddNewUsers.status}
          handleClose={() => dispatch(hideActions())}
          users={requestUserContactRecord}
          currentUser={userRecord}
          footer={
            <>
              <View
              //   style={styles.flexRowWrapModalFooter}
              >
                <View
                // style={styles.footerLeft}
                >
                  <ReactNativeElementsButton
                    title="Cancel"
                    iconRight
                    iconName="image"
                    color="success"
                    onPress={() => dispatch(hideActions())}
                    //   type="submit"
                  />
                </View>
                <View>
                  <ReactNativeElementsButton
                    title="Submit"
                    iconRight
                    iconName="image"
                    color="success"
                    //   onPress={() => handleSendImage()}
                    //   type="submit"
                  />
                </View>
              </View>
            </>
          }
        />
      )}
    </>
  );
};

export default ChatListActions;
View;
