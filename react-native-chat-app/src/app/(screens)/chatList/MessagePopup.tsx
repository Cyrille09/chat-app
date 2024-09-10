import React, { useEffect, useRef } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Pressable,
} from "react-native";
import { useDispatch } from "react-redux";
import {
  successChangePasswordActions,
  successCreateNewGroupMessagesActions,
  successEditUserActions,
  successLogoutActions,
  successPreferLanguageActions,
} from "@/src/redux-toolkit/reducers/actionsSlice";
import { UserRecordInterface } from "@/src/components/globalTypes/GlobalTypes";

const MessagePopup = ({
  onClose,
  userRecord,
}: {
  onClose: () => void;
  userRecord: UserRecordInterface;
}) => {
  const popupRef: any = useRef(null);
  const dispatch = useDispatch();

  useEffect(() => {
    const handleClickOutside = (event: any) => {
      if (popupRef.current && !popupRef.current.contains(event.target)) {
        onClose();
      }
    };

    // Add a press listener to detect outside presses
    // const listener = Pressable.addPressListener({
    //   onPress: handleClickOutside,
    // });

    return () => {
      // Remove the listener when the component unmounts
      // listener.remove();
    };
  }, [onClose]);

  const handleOptionClick = () => {
    onClose();
  };

  return (
    <View ref={popupRef} style={styles.popupMenu}>
      <TouchableOpacity
        style={styles.menuItem}
        onPress={() => {
          handleOptionClick();
          dispatch(
            successCreateNewGroupMessagesActions({ status: true, record: {} })
          );
        }}
      >
        <Text style={styles.menuText}>New group</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.menuItem}
        onPress={() => {
          handleOptionClick();
          dispatch(successEditUserActions({ status: true, record: {} }));
        }}
      >
        <Text style={styles.menuText}>Settings</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.menuItem}
        onPress={() => {
          handleOptionClick();
          dispatch(successChangePasswordActions({ status: true, record: {} }));
        }}
      >
        <Text style={styles.menuText}>Change password</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.menuItem}
        onPress={() => {
          handleOptionClick();
          dispatch(
            successPreferLanguageActions({ status: true, record: userRecord })
          );
        }}
      >
        <Text style={styles.menuText}>Prefer language</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.menuItem, styles.logout]}
        onPress={() => {
          handleOptionClick();
          dispatch(successLogoutActions({ status: true, record: {} }));
        }}
      >
        <Text style={[styles.menuText, styles.logoutText]}>Logout</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  popupMenu: {
    position: "absolute",
    top: 50,
    right: 10,
    backgroundColor: "#fff",
    borderRadius: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
    padding: 10,
  },
  menuItem: {
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  menuText: {
    fontSize: 16,
  },
  logout: {
    marginTop: 10,
    backgroundColor: "#f00",
    borderRadius: 8,
  },
  logoutText: {
    color: "#fff",
    textAlign: "center",
  },
});

export default MessagePopup;
