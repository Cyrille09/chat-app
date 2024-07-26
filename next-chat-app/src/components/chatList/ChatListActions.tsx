"use client";
import { GlobalButton } from "../button/GlobalButton";
import { CSSTransition } from "react-transition-group";
import {
  hideActions,
  isLoadingActions,
} from "@/redux-toolkit/reducers/actionsSlice";
import Cookies from "js-cookie";
import {
  AddNewContactUser,
  ChangePassword,
  DisplayCreateNewGroup,
  DisplaySelectChats,
  DisplayStarredMessages,
  DisplayStoryStatus,
  EditUser,
  LogoutUser,
  PreferLanguage,
  UserSettings,
} from "../modelLists/ModalLists";

import styles from "../modelLists/madal-lists.module.scss";

import "./chatList.scss";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/redux-toolkit/store";
import { UserInterface } from "../globalTypes/GlobalTypes";
import { useRouter } from "next/navigation";
import { updateUserProfile } from "@/services/usersServices";
import { socket } from "../websocket/websocket";
import { LOCAL_STORAGE_USER_TOKEN } from "@/constants/defaultValues";
import { signInPage } from "@/constants/routePath";

const ChatListActions = ({
  user,
  requestUserContactRecord,
  userRecord,
  userContactsRecord,
}: {
  user: UserInterface;
  requestUserContactRecord: any;
  userRecord: any;
  userContactsRecord: any;
}) => {
  const actionsSlice = useSelector((state: RootState) => state.actionsSlice);

  const dispatch = useDispatch();
  const router = useRouter();
  const currentUser = user.user;

  const logoutUserData = () => {
    const lastSeen = {
      status: false,
      date: new Date(),
    };
    dispatch(isLoadingActions(true));
    updateUserProfile({ lastSeen })
      .then((response) => {
        dispatch(hideActions());
        socket.emit("userStatus", response.data);
        Cookies.remove(LOCAL_STORAGE_USER_TOKEN);
        router.push(signInPage);
      })
      .catch((error) => {
        dispatch(isLoadingActions(false));
      });
  };
  return (
    <>
      {/* Display story status */}
      <CSSTransition
        in={actionsSlice.successStoryStatus.status}
        timeout={100}
        classNames="panel-animate"
        onEnter={() => document.body.classList.add("css-transition-modal-open")}
        onExited={() =>
          document.body.classList.remove("css-transition-modal-open")
        }
        unmountOnExit={true}
        mountOnEnter={true}
      >
        <DisplayStoryStatus show={actionsSlice.successStoryStatus.status} />
      </CSSTransition>

      {/* Create new group */}
      <CSSTransition
        in={actionsSlice.successCreateNewGroup.status}
        timeout={100}
        classNames="panel-animate"
        onEnter={() => document.body.classList.add("css-transition-modal-open")}
        onExited={() =>
          document.body.classList.remove("css-transition-modal-open")
        }
        unmountOnExit={true}
        mountOnEnter={true}
      >
        <DisplayCreateNewGroup
          show={actionsSlice.successCreateNewGroup.status}
          users={userContactsRecord}
          currentUser={currentUser}
        />
      </CSSTransition>

      {/* Starred messages */}
      <CSSTransition
        in={actionsSlice.successStarMessages.status}
        timeout={100}
        classNames="panel-animate"
        onEnter={() => document.body.classList.add("css-transition-modal-open")}
        onExited={() =>
          document.body.classList.remove("css-transition-modal-open")
        }
        unmountOnExit={true}
        mountOnEnter={true}
      >
        <DisplayStarredMessages
          show={actionsSlice.successStarMessages.status}
          user={userRecord}
        />
      </CSSTransition>

      {/* Selected chats */}
      <CSSTransition
        in={actionsSlice.successSelectChats.status}
        timeout={100}
        classNames="panel-animate"
        onEnter={() => document.body.classList.add("css-transition-modal-open")}
        onExited={() =>
          document.body.classList.remove("css-transition-modal-open")
        }
        unmountOnExit={true}
        mountOnEnter={true}
      >
        <DisplaySelectChats show={actionsSlice.successSelectChats.status} />
      </CSSTransition>

      {/* Edit user */}
      <CSSTransition
        in={actionsSlice.successEditUser.status}
        timeout={100}
        classNames="panel-animate"
        onEnter={() => document.body.classList.add("css-transition-modal-open")}
        onExited={() =>
          document.body.classList.remove("css-transition-modal-open")
        }
        unmountOnExit={true}
        mountOnEnter={true}
      >
        <EditUser
          show={actionsSlice.successEditUser.status}
          user={userRecord}
        />
      </CSSTransition>

      {/* Add contact user */}
      {actionsSlice.successAddNewUsers.status && (
        <AddNewContactUser
          show={actionsSlice.successAddNewUsers.status}
          handleClose={() => dispatch(hideActions())}
          users={requestUserContactRecord}
          currentUser={userRecord}
          footer={
            <>
              <div className={styles.flexRowWrapModalFooter}>
                <div className={styles.footerLeft}>
                  <GlobalButton
                    format="white"
                    size="sm"
                    onClick={() => dispatch(hideActions())}
                  >
                    Cancel
                  </GlobalButton>
                </div>
                <div>
                  <GlobalButton format="success" type="submit" size="sm">
                    Submit
                  </GlobalButton>
                </div>
              </div>
            </>
          }
        />
      )}

      {/* Change password */}
      {actionsSlice.successChangePassword.status && (
        <ChangePassword
          show={actionsSlice.successChangePassword.status}
          handleClose={() => dispatch(hideActions())}
          footer={
            <>
              <div className={styles.flexRowWrapModalFooter}>
                <div className={styles.footerLeft}>
                  <GlobalButton
                    format="white"
                    size="sm"
                    onClick={() => dispatch(hideActions())}
                  >
                    Cancel
                  </GlobalButton>
                </div>
                <div>
                  <GlobalButton format="success" type="submit" size="sm">
                    Submit
                  </GlobalButton>
                </div>
              </div>
            </>
          }
        />
      )}

      {/* User settings */}
      {actionsSlice.successUserSettings.status && (
        <UserSettings
          show={actionsSlice.successUserSettings.status}
          handleClose={() => dispatch(hideActions())}
          footer={
            <>
              <div className={styles.flexRowWrapModalFooter}>
                <div className={styles.footerLeft}>
                  <GlobalButton
                    format="white"
                    size="sm"
                    onClick={() => dispatch(hideActions())}
                  >
                    Cancel
                  </GlobalButton>
                </div>
                <div>
                  <GlobalButton format="success" type="submit" size="sm">
                    Submit
                  </GlobalButton>
                </div>
              </div>
            </>
          }
        />
      )}

      {/* Logout user */}
      {actionsSlice.successLogout.status && (
        <LogoutUser
          show={actionsSlice.successLogout.status}
          handleClose={() => dispatch(hideActions())}
          footer={
            <>
              <div className={styles.flexRowWrapModalFooter}>
                <div className={styles.footerLeft}>
                  <GlobalButton
                    format="white"
                    size="sm"
                    onClick={() => dispatch(hideActions())}
                  >
                    No
                  </GlobalButton>
                </div>
                <div>
                  <GlobalButton
                    format="success"
                    size="sm"
                    onClick={() => logoutUserData()}
                  >
                    Yes
                  </GlobalButton>
                </div>
              </div>
            </>
          }
        />
      )}

      {/* Prefer language */}
      {actionsSlice.successPreferLanguage.status && (
        <PreferLanguage
          show={actionsSlice.successPreferLanguage.status}
          handleClose={() => dispatch(hideActions())}
          user={userRecord}
          footer={
            <>
              <div className={styles.flexRowWrapModalFooter}>
                <div className={styles.footerLeft}>
                  <GlobalButton
                    format="white"
                    size="sm"
                    onClick={() => dispatch(hideActions())}
                  >
                    Cancel
                  </GlobalButton>
                </div>
                <div>
                  <GlobalButton format="success" type="submit" size="sm">
                    Submit
                  </GlobalButton>
                </div>
              </div>
            </>
          }
        />
      )}
    </>
  );
};

export default ChatListActions;
