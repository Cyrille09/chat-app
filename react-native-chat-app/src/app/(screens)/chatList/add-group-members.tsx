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
import {
  createGroup,
  getGroupMmebers,
  updateGroupMembers,
} from "@/src/services/groupsServices";
import { BoxShadowCard } from "@/src/components/cards/BoxShadowCard";
import { chatGroupMembersRecord } from "@/src/redux-toolkit/reducers/chatMessageSlice";

const AddGroupMembers = () => {
  const usersSlice = useSelector((state: RootState) => state.usersSlice);
  const actionsSlice = useSelector((state: RootState) => state.actionsSlice);
  const chatMessageSlice = useSelector(
    (state: RootState) => state.chatMessageSlice
  );

  const [users, setUsers] = useState<[]>([]);
  const dispatch = useDispatch();

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

  const addNewGroupMembersData = async (values: { groupUsers: [] }) => {
    const joinMember = values.groupUsers
      .map((member: { label: string }) => member.label)
      .join(", ")
      .replace(/,([^,]*)$/, " and$1");

    dispatch(isLoadingActions(true));
    updateGroupMembers(
      values.groupUsers,
      usersSlice.selectedUser.group._id,
      `${usersSlice.currentUser.user.name} has added ${joinMember} to the group.`
    )
      .then((response) => {
        socket.emit("addGroupMember", values.groupUsers);

        socket.emit("messageGroup", {
          groupId: usersSlice.selectedUser.group._id,
        });

        getGroupMmebersData();
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

  const getGroupMmebersData = async () => {
    const chatGroupMembers = await getGroupMmebers(
      usersSlice.selectedUser.group._id
    );
    if (chatGroupMembers?.data?.length) {
      dispatch(chatGroupMembersRecord(chatGroupMembers.data));
      router.back();
    } else {
      dispatch(chatGroupMembersRecord([]));
      router.back();
    }
  };
  return (
    <View style={styles.container}>
      <ScrollView>
        <Formik
          form
          initialValues={{
            groupUsers: [],
          }}
          onSubmit={addNewGroupMembersData}
          enableReinitialize
        >
          {({
            handleChange,
            handleBlur,
            handleSubmit,
            setFieldValue,
            touched,
            values,
            errors,
          }) => {
            const currentMembersList = chatMessageSlice.chatGroupMembers.map(
              (currentMembers: {
                user: { name: string; photoUrl: string; _id: string };
              }) => ({
                label: currentMembers.user.name,
                photoUrl: currentMembers.user.photoUrl,
                value: currentMembers.user._id,
              })
            );
            const currentMembersListAndSelectedMembers = [
              ...values.groupUsers,
              ...currentMembersList,
            ];
            const contactUsersList = users?.length
              ? users
                  .filter(
                    (user: { user: { _id: string } }) =>
                      !currentMembersListAndSelectedMembers
                        .map((data: { value: string }) => data.value)
                        .includes(user.user._id)
                  )
                  .map(
                    (contactUser: {
                      user: { name: string; _id: string; photoUrl: string };
                    }) => ({
                      value: contactUser.user._id,
                      label: contactUser.user.name,
                      photoUrl: contactUser.user.photoUrl,
                    })
                  )
              : [];

            return (
              <View style={styles.container}>
                <View>
                  {actionsSlice.errorPopup.status && (
                    <Alert
                      type="error"
                      message={actionsSlice.errorPopup.message}
                    />
                  )}
                </View>
                {/* {actionsSlice.isLoading && <LoadingData />} */}
                <View>
                  <FieldArray
                    name="groupUsers"
                    render={(arrayHelpers) => {
                      return (
                        <View>
                          <View style={{ marginBottom: 20 }}>
                            <Text h4>{usersSlice.selectedUser.group.name}</Text>
                          </View>

                          <ReactNativeSelect
                            value={null}
                            name="userId"
                            id="userId"
                            onValueChange={(
                              selected: {},
                              itemIndex: number
                            ) => {
                              if (selected && values.groupUsers.length) {
                                const dataSelected = {
                                  value: selected,
                                  label: contactUsersList[itemIndex - 1].label,
                                  photoUrl:
                                    contactUsersList[itemIndex - 1].photoUrl,
                                };
                                arrayHelpers.push(dataSelected);
                              } else if (selected) {
                                const dataSelected = {
                                  value: selected,
                                  label: contactUsersList[itemIndex - 1].label,
                                  photoUrl:
                                    contactUsersList[itemIndex - 1].photoUrl,
                                };

                                arrayHelpers.insert(1, dataSelected);
                              }
                            }}
                            items={contactUsersList}
                            label="Add members"
                            required
                          />

                          <View style={styles.newGroupSection}>
                            {values.groupUsers.map(
                              (
                                user: {
                                  label: string;
                                  value: string;
                                  photoUrl: string;
                                },
                                index: number
                              ) => {
                                return (
                                  <View key={index}>
                                    <BoxShadowCard>
                                      <View style={styles.newGroup}>
                                        <View style={styles.newGroupItems}>
                                          <View style={styles.userInfo}>
                                            <View style={styles.user}>
                                              {user.photoUrl ? (
                                                <Image
                                                  source={{
                                                    uri: `${process.env.EXPO_PUBLIC_BASE_URL}/images/profile/${user.photoUrl}`,
                                                  }}
                                                  style={{
                                                    width: 50,
                                                    height: 50,
                                                  }}
                                                  alt="avatar"
                                                />
                                              ) : (
                                                <View
                                                  style={
                                                    styles.chatListUserInfoNoImage
                                                  }
                                                >
                                                  <Text>
                                                    {user.label
                                                      .split(" ")
                                                      .map((data: string) =>
                                                        data.charAt(0)
                                                      )
                                                      .join("")}
                                                  </Text>
                                                </View>
                                              )}
                                              <Text>{user.label}</Text>
                                            </View>
                                          </View>

                                          <View>
                                            <ReactNativeElementsButton
                                              title="Remove"
                                              color="error"
                                              size="sm"
                                              onPress={() =>
                                                arrayHelpers.remove(index)
                                              }
                                            />
                                          </View>
                                        </View>
                                      </View>
                                    </BoxShadowCard>
                                  </View>
                                );
                              }
                            )}
                          </View>
                        </View>
                      );
                    }}
                  />
                </View>

                <View style={styles.flexRowWrap}>
                  <View style={styles.leftColumn}>
                    <ReactNativeElementsButton
                      title="Cancel"
                      color="primary"
                      onPress={() => router.back()}
                    />
                  </View>
                  <View style={styles.middleColumn}></View>
                  <View style={styles.rightColumn}>
                    <ReactNativeElementsButton
                      title="Update"
                      color="success"
                      onPress={() => handleSubmit()}
                      disabled={values.groupUsers.length ? false : true}
                    />
                  </View>
                </View>
              </View>
            );
          }}
        </Formik>
      </ScrollView>
    </View>
  );
};

export default AddGroupMembers;
