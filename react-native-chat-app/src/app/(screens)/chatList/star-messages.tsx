import { Alert } from "@/src/components/alert/Alert";
import { ReactNativeElementsButton } from "@/src/components/reactNativeElements/ReactNativeElements";
import { socket } from "@/src/components/websocket/websocket";
import { ACTIONS_ERROR_MESSAGE } from "@/src/constants/globalText";
import {
  errorPopupActions,
  isLoadingActions,
} from "@/src/redux-toolkit/reducers/actionsSlice";
import { RootState } from "@/src/redux-toolkit/store";
import { getUserContacts } from "@/src/services/userContactsServices";
import { Image, Text } from "@rneui/themed";

import { router } from "expo-router";
import { FieldArray, Formik } from "formik";
import { useEffect, useState } from "react";
import { ScrollView, View } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import styles from "./chatListStyles";
import { ReactNativeSelect } from "@/src/components/select/Select";
import { GlobalTextInput } from "@/src/components/globalTextInput/GlobalTextInput";
import { createGroup } from "@/src/services/groupsServices";
import { BoxShadowCard } from "@/src/components/cards/BoxShadowCard";
import StarChatAreaCenterLevel from "../chatArea/StarChatAreaCenterLevel";

const AddNewGroup = () => {
  const usersSlice = useSelector((state: RootState) => state.usersSlice);
  const actionsSlice = useSelector((state: RootState) => state.actionsSlice);
  const [users, setUsers] = useState<[]>([]);
  const dispatch = useDispatch();
  const chatMessageSlice = useSelector(
    (state: RootState) => state.chatMessageSlice
  );

  const createNewGroupData = async (values: {
    name: string;
    groupUsers: [];
  }) => {
    dispatch(isLoadingActions(true));
    createGroup(values.name, values.groupUsers)
      .then((response) => {
        dispatch(isLoadingActions(false));
        const groupMembers = [
          ...values.groupUsers,
          {
            value: usersSlice.currentUser.user._id,
            label: usersSlice.currentUser.user,
            admin: true,
            photoUrl: usersSlice.currentUser.user.photoUrl,
          },
        ];
        socket.emit("group", groupMembers);
        router.back();
      })
      .catch((error) => {
        dispatch(isLoadingActions(false));
        dispatch(
          errorPopupActions({
            status: true,
            message: ACTIONS_ERROR_MESSAGE,
            display: "",
          })
        );
      });
  };

  useEffect(() => {
    let isSubscribed = true;

    const getUserContactsData = () => {
      getUserContacts("")
        .then((response) => {
          if (isSubscribed) {
            setUsers(response.data.users);
          }
        })
        .catch((error) => {});
    };

    getUserContactsData();

    return () => {
      isSubscribed = false;
    };
  }, []);
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
