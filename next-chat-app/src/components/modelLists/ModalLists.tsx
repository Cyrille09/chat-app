import { useDispatch, useSelector } from "react-redux";
import { Panel } from "../panel/Panel";
import {
  errorPopupActions,
  hideActions,
  isLoadingActions,
  successDeleteGroupUserPhotoActions,
  successDeleteUserPhotoActions,
} from "@/redux-toolkit/reducers/actionsSlice";
import { Tab, Tabs } from "react-bootstrap";
import Image from "next/image";
import { MdDelete } from "react-icons/md";
import { GlobalModal } from "../modal/Modal";
import styles from "./madal-lists.module.scss";
import { FieldArray, Form, Formik } from "formik";
import { LoadingData } from "../loading/LoadingData";
import { RootState } from "@/redux-toolkit/store";
import { GlobalErrorMessage } from "../errorAndSuccessMessage";
import { ReactSelect } from "../fields/select";
import {
  addContactForm,
  changeUserProfilePasswordForm,
  updateMessageForm,
  updateNameForm,
} from "../formValidation/formValidation";
import { ACTIONS_ERROR_MESSAGE } from "@/constants/globalText";
import {
  createUserContacts,
  muteUserContact,
} from "@/services/userContactsServices";
import {
  format,
  addHours,
  addMonths,
  addYears,
  addWeeks,
  addDays,
} from "date-fns";
import { BoxShadowCard } from "../cards";
import { Col, Row } from "react-bootstrap";
import { GlobalButton } from "../button/GlobalButton";
import {
  FaCheck,
  FaDownload,
  FaEdit,
  FaFile,
  FaFilePdf,
  FaFileWord,
  FaImage,
} from "react-icons/fa";
import { useContext, useRef, useState } from "react";
import { Input } from "../fields/input";
import userImagePlaceholder from "../../assets/images/placeholder.png";
import {
  changeUserProfilePassword,
  deleteUserPhoto,
  updateUserProfile,
  updateUserProfileImage,
} from "@/services/usersServices";
import { socket } from "../websocket/websocket";
import Link from "next/link";
import { Toggle } from "../fields/toggle";
import { SearchWithOptions } from "../fields/search";
import {
  createGroup,
  deleteGroupPhoto,
  getGroupMmebers,
  updateGroup,
  updateGroupMembers,
  updateGroupProfileImage,
} from "@/services/groupsServices";
import { current } from "@reduxjs/toolkit";
import { selectedUserRecord } from "@/redux-toolkit/reducers/usersSlice";
import { chatGroupMembersRecord } from "@/redux-toolkit/reducers/chatMessageSlice";

export const DisplayUserStars = ({ show }: { show: boolean }) => {
  const dispatch = useDispatch();
  return (
    <Panel
      show={show}
      handleClose={() => {
        dispatch(hideActions());
      }}
      title="Starred messages"
      width="50%"
      maxWidth="25%"
    >
      <p>Coming soon..</p>
    </Panel>
  );
};

export const UserMediaList = ({ show, user }: { show: boolean; user: any }) => {
  const actionsSlice = useSelector((state: RootState) => state.actionsSlice);
  const dispatch = useDispatch();

  const getMedia = actionsSlice.successMedia.record.filter(
    (message: { type: string }) => ["image", "video"].includes(message.type)
  );
  const getLinks = actionsSlice.successMedia.record.filter(
    (message: { type: string }) => message.type === "link"
  );
  const getDocs = actionsSlice.successMedia.record.filter(
    (message: { type: string }) => message.type === "document"
  );

  return (
    <Panel
      show={show}
      handleClose={() => {
        dispatch(hideActions());
      }}
      title=""
      width="50%"
      maxWidth="25%"
    >
      <div>
        <Tabs
          defaultActiveKey={"media"}
          id="fill-tab-example"
          className="nav-segment my-3"
          fill
        >
          <Tab eventKey="media" title="Media">
            <div className={`${styles.modalMediaItems}`}>
              {getMedia.map((message: { _id: string; message: string }) => {
                return (
                  <div key={message._id}>
                    <div className={styles.modalMediaItem}>
                      <Image
                        height="100"
                        width="100"
                        src={`${process.env.baseUrl}/images/messages/${message.message}`}
                        alt="Media"
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </Tab>
          <Tab eventKey="docs" title="Docs">
            {getDocs.map(
              (message: {
                _id: string;
                message: string;
                createdAt: string;
                sender: {
                  _id: string;
                  name: string;
                  photoUrl: string;
                };
                receiver: {
                  _id: string;
                  name: string;
                  photoUrl: string;
                };
              }) => {
                const documentFormat = () => {
                  const ext: any = message.message.split(".").pop();
                  if (ext === "pdf") {
                    return (
                      <span className={styles.messageList}>
                        <span>
                          <FaFilePdf
                            size={25}
                            className={styles.documentSavePdf}
                          />
                          <span className={styles.documentTitle}>
                            {message.message}
                          </span>
                        </span>
                      </span>
                    );
                  } else if (["docx", "doc"].includes(ext)) {
                    return (
                      <span className={styles.messageList}>
                        <span>
                          <FaFileWord
                            size={25}
                            className={styles.documentSaveWord}
                          />
                          <span className={styles.documentTitle}>
                            {message.message}
                          </span>
                        </span>
                      </span>
                    );
                  }
                };

                return (
                  <div key={message._id} className="">
                    <div className={styles.chatAreaCenter}>
                      <div
                        className={
                          message.sender._id === user?._id
                            ? `${styles.message} ${styles.own}`
                            : `${styles.message} ${styles.receiver}`
                        }
                        key={message._id}
                      >
                        <div className={styles.chatAreaCenterTexts}>
                          <div className={styles.chatAreaCenterContent}>
                            <div
                              className={`${styles.userInfo} ${styles.userInfoTop}`}
                            >
                              <div className={styles.user}>
                                {message.sender.photoUrl ? (
                                  <Image
                                    height="35"
                                    width="35"
                                    src={`${process.env.baseUrl}/images/profile/${message.sender.photoUrl}`}
                                    alt=""
                                    className={styles.chatListTopImage}
                                  />
                                ) : (
                                  <div
                                    className={styles.chatListUserInfoNoImage}
                                  >
                                    <p>
                                      {message.sender.name
                                        .split(" ")
                                        .map((data: string) => data.charAt(0))
                                        .slice(0, 2)
                                        .join("")}
                                    </p>
                                  </div>
                                )}
                                <span>{message.sender.name.split(" ")[0]}</span>
                              </div>
                              <div className={styles.messageTime}>
                                {format(message.createdAt, "dd/MM/yyyy")}
                              </div>
                            </div>

                            <div className={styles.chatAreaMessage}>
                              <span>{documentFormat()}</span> <br />{" "}
                              <div className={styles.messageTime}>
                                {" "}
                                {format(message.createdAt, "HH:mm")}
                              </div>{" "}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              }
            )}
          </Tab>
          <Tab eventKey="links" title="Links">
            {getLinks.map(
              (message: {
                _id: string;
                message: string;
                createdAt: string;
                sender: {
                  _id: string;
                  name: string;
                  photoUrl: string;
                };
                receiver: {
                  _id: string;
                  name: string;
                  photoUrl: string;
                };
              }) => {
                return (
                  <div key={message._id} className="">
                    <div className={styles.chatAreaCenter}>
                      <div
                        className={
                          message.sender._id === user?._id
                            ? `${styles.message} ${styles.own}`
                            : `${styles.message} ${styles.receiver}`
                        }
                        key={message._id}
                      >
                        <div className={styles.chatAreaCenterTexts}>
                          <div className={styles.chatAreaCenterContent}>
                            <div
                              className={`${styles.userInfo} ${styles.userInfoLinkTop}`}
                            >
                              <div className={styles.user}>
                                {message.sender.photoUrl ? (
                                  <Image
                                    height="35"
                                    width="35"
                                    src={`${process.env.baseUrl}/images/profile/${message.sender.photoUrl}`}
                                    alt=""
                                    className={styles.chatListTopImage}
                                  />
                                ) : (
                                  <div
                                    className={styles.chatListUserInfoNoImage}
                                  >
                                    <p>
                                      {message.sender.name
                                        .split(" ")
                                        .map((data: string) => data.charAt(0))
                                        .slice(0, 2)
                                        .join("")}
                                    </p>
                                  </div>
                                )}
                                <span>{message.sender.name.split(" ")[0]}</span>
                              </div>
                              <div className={styles.messageTime}>
                                {format(message.createdAt, "dd/MM/yyyy")}
                              </div>
                            </div>

                            <div className={styles.chatAreaMessage}>
                              <span>
                                <Link href={message.message} target="_blank">
                                  <span className={styles.messageLink}>
                                    {message.message}
                                  </span>
                                </Link>
                              </span>{" "}
                              <br />{" "}
                              <div className={styles.messageTime}>
                                {" "}
                                {format(message.createdAt, "HH:mm")}
                              </div>{" "}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              }
            )}
          </Tab>
        </Tabs>
      </div>
    </Panel>
  );
};

export const MuteNotication = ({ footer, show, user, handleClose }: any) => {
  const actionsSlice = useSelector((state: RootState) => state.actionsSlice);
  const usersSlice = useSelector((state: RootState) => state.usersSlice);
  const dispatch = useDispatch();

  const muteUserContactDetail = async (values: { muteDate: Date }) => {
    dispatch(isLoadingActions(true));
    muteUserContact(usersSlice.selectedUser.user, values.muteDate)
      .then((response) => {
        dispatch(hideActions());
        const receiverInfo = response?.data?.users.find(
          (user: { user: string }) =>
            user.user === usersSlice.selectedUser.user._id
        );
        socket.emit("updateContactUser", {
          ...user,
          receiverInfo,
          updatedType: "mute",
        });
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

  const muteLists: any = [
    {
      label: "6 Hours",
      value: addHours(new Date(), 6),
    },
    {
      label: "12 Hours",
      value: addHours(new Date(), 12),
    },
    {
      label: "1 Day",
      value: addDays(new Date(), 1),
    },
    {
      label: "1 Week",
      value: addWeeks(new Date(), 1),
    },
    {
      label: "1 Month",
      value: addMonths(new Date(), 1),
    },
    {
      label: "6 Month",
      value: addMonths(new Date(), 6),
    },
    {
      label: "1 Year",
      value: addYears(new Date(), 1),
    },
  ];

  return (
    <GlobalModal
      title={`Mute ${
        usersSlice.selectedUser.isGroup ? "Group" : "User"
      } Notification`}
      show={show}
      handleClose={handleClose}
      footer={footer}
    >
      <div className={styles.modal}>
        <Formik
          form
          initialValues={{
            muteDate: addHours(new Date(), 6),
          }}
          onSubmit={muteUserContactDetail}
          enableReinitialize
        >
          {({ handleChange, handleBlur, setFieldValue, values, errors }) => (
            <Form>
              <div>
                <div>
                  {actionsSlice.errorPopup.status && (
                    <GlobalErrorMessage
                      message={actionsSlice.errorPopup.message}
                    />
                  )}
                </div>
                {actionsSlice.isLoading && <LoadingData />}
                <div>
                  <div>
                    <ReactSelect
                      label="Mute List"
                      id="muteDate"
                      required
                      name="muteDate"
                      options={muteLists}
                      onChange={(selected: any) =>
                        selected &&
                        selected.value &&
                        setFieldValue(`muteDate`, selected.value)
                      }
                      defaultValue={muteLists[0]}
                    />
                  </div>
                </div>

                {footer && <div className={styles.footer}>{footer}</div>}
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </GlobalModal>
  );
};

export const UnmuteNotication = ({ footer, show, user, handleClose }: any) => {
  const actionsSlice = useSelector((state: RootState) => state.actionsSlice);
  const usersSlice = useSelector((state: RootState) => state.usersSlice);

  return (
    <GlobalModal
      title={`Unmute ${
        usersSlice.selectedUser.isGroup
          ? `${usersSlice.selectedUser.group.name} group`
          : `${usersSlice.selectedUser.user.name}`
      }`}
      show={show}
      handleClose={handleClose}
      footer={footer}
    >
      <div className={styles.modal}>
        <p>
          Do you want to unmute{" "}
          {usersSlice.selectedUser.isGroup
            ? `${usersSlice.selectedUser.group.name} group`
            : `${usersSlice.selectedUser.user.name}`}
          ?
        </p>
        <div>
          {actionsSlice.errorPopup.status && (
            <GlobalErrorMessage message={actionsSlice.errorPopup.message} />
          )}
        </div>
        {actionsSlice.isLoading && <LoadingData />}

        {footer && <div className={styles.footer}>{footer}</div>}
      </div>
    </GlobalModal>
  );
};

export const DisappearingMessages = ({
  footer,
  show,
  user,
  handleClose,
}: any) => {
  const actionsSlice = useSelector((state: RootState) => state.actionsSlice);
  const usersSlice = useSelector((state: RootState) => state.usersSlice);

  return (
    <GlobalModal
      title={`Disappearing ${usersSlice.selectedUser.user.name} Message`}
      show={show}
      handleClose={handleClose}
      footer={footer}
    >
      <div className={styles.modal}>
        <p>Do you want to Disappear message?</p>
        <div>
          {actionsSlice.errorPopup.status && (
            <GlobalErrorMessage message={actionsSlice.errorPopup.message} />
          )}
        </div>
        {actionsSlice.isLoading && <LoadingData />}

        {footer && <div className={styles.footer}>{footer}</div>}
      </div>
    </GlobalModal>
  );
};

export const BlockUser = ({ footer, show, user, handleClose }: any) => {
  const actionsSlice = useSelector((state: RootState) => state.actionsSlice);
  const usersSlice = useSelector((state: RootState) => state.usersSlice);

  return (
    <GlobalModal
      title={`${
        usersSlice.selectedUser.blockStatus ? "Unblock" : "Block"
      } Contact User`}
      show={show}
      handleClose={handleClose}
      footer={footer}
    >
      <div className={styles.modal}>
        <p>
          Do you want to{" "}
          {usersSlice.selectedUser.blockStatus ? "unblock" : "block"}{" "}
          {usersSlice.selectedUser.user.name} contact?
        </p>
        <div>
          {actionsSlice.errorPopup.status && (
            <GlobalErrorMessage message={actionsSlice.errorPopup.message} />
          )}
        </div>
        {actionsSlice.isLoading && <LoadingData />}

        {footer && <div className={styles.footer}>{footer}</div>}
      </div>
    </GlobalModal>
  );
};

export const ClearChat = ({ footer, show, user, handleClose }: any) => {
  const actionsSlice = useSelector((state: RootState) => state.actionsSlice);
  const usersSlice = useSelector((state: RootState) => state.usersSlice);

  return (
    <GlobalModal
      title={`Clear Chat`}
      show={show}
      handleClose={handleClose}
      footer={footer}
    >
      <div className={styles.modal}>
        Do you want to clear {usersSlice.selectedUser.user.name} chat?
        <div>
          {actionsSlice.errorPopup.status && (
            <GlobalErrorMessage message={actionsSlice.errorPopup.message} />
          )}
        </div>
        {actionsSlice.isLoading && <LoadingData />}
        {footer && <div className={styles.footer}>{footer}</div>}
      </div>
    </GlobalModal>
  );
};

export const DeleteContactUser = ({ footer, show, user, handleClose }: any) => {
  const actionsSlice = useSelector((state: RootState) => state.actionsSlice);
  const usersSlice = useSelector((state: RootState) => state.usersSlice);

  return (
    <GlobalModal
      title={`${
        usersSlice.selectedUser.isGroup ? "Exist Group" : "Delete Contact User"
      }`}
      show={show}
      handleClose={handleClose}
      footer={footer}
    >
      <div className={styles.modal}>
        {usersSlice.selectedUser.isGroup ? (
          <p>
            Do you want to exist from {usersSlice.selectedUser.group.name}{" "}
            group?
          </p>
        ) : (
          <p>
            Do you want to delete {usersSlice.selectedUser.user.name} contact?
          </p>
        )}
        <div>
          {actionsSlice.errorPopup.status && (
            <GlobalErrorMessage message={actionsSlice.errorPopup.message} />
          )}
        </div>
        {actionsSlice.isLoading && <LoadingData />}

        {footer && <div className={styles.footer}>{footer}</div>}
      </div>
    </GlobalModal>
  );
};

export const SearchMessages = ({ show }: { show: boolean }) => {
  const dispatch = useDispatch();
  return (
    <Panel
      show={show}
      handleClose={() => {
        dispatch(hideActions());
      }}
      title="Search messages"
      width="50%"
      maxWidth="25%"
    >
      <p>Coming soon..</p>
    </Panel>
  );
};

export const DisplayStoryStatus = ({ show }: { show: boolean }) => {
  const dispatch = useDispatch();
  return (
    <Panel
      show={show}
      handleClose={() => {
        dispatch(hideActions());
      }}
      title="Story Status"
      width="50%"
      maxWidth="25%"
    >
      <p>Coming soon..</p>
    </Panel>
  );
};

export const DisplayStarredMessages = ({ show }: { show: boolean }) => {
  const dispatch = useDispatch();
  return (
    <Panel
      show={show}
      handleClose={() => {
        dispatch(hideActions());
      }}
      title="Starred messages"
      width="50%"
      maxWidth="25%"
    >
      <p>Coming soon..</p>
    </Panel>
  );
};

export const DisplaySelectChats = ({ show }: { show: boolean }) => {
  const dispatch = useDispatch();
  return (
    <Panel
      show={show}
      handleClose={() => {
        dispatch(hideActions());
      }}
      title="Select chats"
      width="50%"
      maxWidth="25%"
    >
      <p>Content here..</p>
    </Panel>
  );
};
export const DisplayCreateNewGroup = ({
  footer,
  show,
  users,
  currentUser,
  handleClose,
}: any) => {
  const actionsSlice = useSelector((state: RootState) => state.actionsSlice);

  const dispatch = useDispatch();

  const createNewGroupData = async (values: {
    name: string;
    groupUsers: [];
  }) => {
    dispatch(isLoadingActions(true));
    createGroup(values.name, values.groupUsers)
      .then((response) => {
        const groupMembers = [
          ...values.groupUsers,
          {
            value: currentUser._id,
            label: currentUser.name,
            admin: true,
            photoUrl: currentUser.photoUrl,
          },
        ];
        socket.emit("group", groupMembers);
        dispatch(hideActions());
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

  return (
    <>
      <Formik
        form
        initialValues={{
          userId: "",
          name: "",
          groupUsers: [],
        }}
        onSubmit={createNewGroupData}
        enableReinitialize
      >
        {({ handleChange, handleBlur, setFieldValue, values, errors }) => {
          const currentUserListAndSelectedMembers = [
            ...values.groupUsers,
            {
              value: currentUser._id,
              label: currentUser.name,
              photoUrl: currentUser.photoUrl,
            },
          ];

          const contactUsersList = users?.length
            ? users
                .filter(
                  (user: { user: { _id: string } }) =>
                    !currentUserListAndSelectedMembers
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
            <Form>
              <div>
                <Panel
                  show={show}
                  handleClose={() => {
                    dispatch(hideActions());
                  }}
                  title="Create Group"
                  width="50%"
                  maxWidth="25%"
                  footer={
                    <div className={styles.panelFooter}>
                      <div>
                        <GlobalButton
                          format="white"
                          size="sm"
                          onClick={() => {
                            hideActions();
                          }}
                        >
                          Close
                        </GlobalButton>
                      </div>
                      <div>
                        <GlobalButton
                          type="submit"
                          format="success"
                          size="sm"
                          disabled={
                            values.name && values.groupUsers.length
                              ? false
                              : true
                          }
                        >
                          Add New Group
                        </GlobalButton>
                      </div>
                    </div>
                  }
                >
                  <div>
                    {actionsSlice.errorPopup.status && (
                      <GlobalErrorMessage
                        message={actionsSlice.errorPopup.message}
                      />
                    )}
                  </div>
                  {actionsSlice.isLoading && <LoadingData />}

                  <FieldArray
                    name="groupUsers"
                    render={(arrayHelpers) => {
                      return (
                        <div>
                          <div style={{ marginBottom: 20 }}>
                            <Input
                              placeholder="Group name"
                              name="name"
                              required
                              id="name"
                              label="Group name"
                              onBlur={handleBlur("name")}
                              autoCapitalize="none"
                              onChange={handleChange("name")}
                              error={errors.name}
                            />
                          </div>
                          <div>
                            <ReactSelect
                              label="Group members"
                              id="userId"
                              name="userId"
                              options={contactUsersList}
                              onChange={(selected: any) => {
                                if (
                                  selected.value &&
                                  values.groupUsers.length
                                ) {
                                  arrayHelpers.push(selected);
                                } else if (selected.value) {
                                  arrayHelpers.insert(1, selected);
                                }
                              }}
                              value={null}
                            />
                          </div>

                          <div className={styles.newGroupSection}>
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
                                  <div key={index}>
                                    <BoxShadowCard>
                                      <div className={styles.newGroup}>
                                        <div className={styles.newGroupItems}>
                                          <div className={styles.userInfo}>
                                            <div className={styles.user}>
                                              {user.photoUrl ? (
                                                <Image
                                                  height="50"
                                                  width="50"
                                                  src={`${process.env.baseUrl}/images/profile/${user.photoUrl}`}
                                                  alt=""
                                                  className={
                                                    styles.chatListTopImage
                                                  }
                                                />
                                              ) : (
                                                <div
                                                  className={
                                                    styles.chatListUserInfoNoImage
                                                  }
                                                >
                                                  <p>
                                                    {user.label
                                                      .split(" ")
                                                      .map((data: string) =>
                                                        data.charAt(0)
                                                      )
                                                      .join("")}
                                                  </p>
                                                </div>
                                              )}
                                              <span>{user.label}</span>
                                            </div>
                                          </div>

                                          <div>
                                            <GlobalButton
                                              size="xs"
                                              format="danger"
                                              onClick={() =>
                                                arrayHelpers.remove(index)
                                              }
                                            >
                                              Remove
                                            </GlobalButton>
                                          </div>
                                        </div>
                                      </div>
                                    </BoxShadowCard>
                                  </div>
                                );
                              }
                            )}
                          </div>
                        </div>
                      );
                    }}
                  />
                </Panel>
              </div>
            </Form>
          );
        }}
      </Formik>
    </>
  );
};

export const DisplayAddNewGroupMembers = ({
  footer,
  show,
  users,
  groupMembers,
  handleClose,
}: any) => {
  const actionsSlice = useSelector((state: RootState) => state.actionsSlice);
  const usersSlice = useSelector((state: RootState) => state.usersSlice);
  const dispatch = useDispatch();

  const addNewGroupMembersData = async (values: { groupUsers: [] }) => {
    dispatch(isLoadingActions(true));
    updateGroupMembers(values.groupUsers, usersSlice.selectedUser.group._id)
      .then((response) => {
        socket.emit("addGroupMember", values.groupUsers);
        dispatch(hideActions());
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
    } else {
      dispatch(chatGroupMembersRecord([]));
    }
  };

  return (
    <>
      <Formik
        form
        initialValues={{
          groupUsers: [],
        }}
        onSubmit={addNewGroupMembersData}
        enableReinitialize
      >
        {({ handleChange, handleBlur, setFieldValue, values, errors }) => {
          const currentMembersList = groupMembers.map(
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
            <Form>
              <div>
                <Panel
                  show={show}
                  handleClose={() => {
                    dispatch(hideActions());
                  }}
                  title="Add New Group Members"
                  width="50%"
                  maxWidth="25%"
                  footer={
                    <div className={styles.panelFooter}>
                      <div>
                        <GlobalButton
                          format="white"
                          size="sm"
                          onClick={() => {
                            hideActions();
                          }}
                        >
                          Close
                        </GlobalButton>
                      </div>
                      <div>
                        <GlobalButton
                          type="submit"
                          format="success"
                          size="sm"
                          disabled={values.groupUsers.length ? false : true}
                        >
                          Update Group Members
                        </GlobalButton>
                      </div>
                    </div>
                  }
                >
                  <div>
                    {actionsSlice.errorPopup.status && (
                      <GlobalErrorMessage
                        message={actionsSlice.errorPopup.message}
                      />
                    )}
                  </div>
                  {actionsSlice.isLoading && <LoadingData />}

                  <FieldArray
                    name="groupUsers"
                    render={(arrayHelpers) => {
                      return (
                        <div>
                          <div style={{ marginBottom: 20 }}>
                            <p>
                              <span style={{ fontWeight: "bold" }}>Group:</span>{" "}
                              {usersSlice.selectedUser.group.name}
                            </p>
                          </div>
                          <div>
                            <ReactSelect
                              label="Add members"
                              id="userId"
                              name="userId"
                              options={contactUsersList}
                              onChange={(selected: any) => {
                                if (
                                  selected.value &&
                                  values.groupUsers.length
                                ) {
                                  arrayHelpers.push(selected);
                                } else if (selected.value) {
                                  arrayHelpers.insert(1, selected);
                                }
                              }}
                              value={null}
                            />
                          </div>

                          <div className={styles.newGroupSection}>
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
                                  <div key={index}>
                                    <BoxShadowCard>
                                      <div className={styles.newGroup}>
                                        <div className={styles.newGroupItems}>
                                          <div className={styles.userInfo}>
                                            <div className={styles.user}>
                                              {user.photoUrl ? (
                                                <Image
                                                  height="50"
                                                  width="50"
                                                  src={`${process.env.baseUrl}/images/profile/${user.photoUrl}`}
                                                  alt=""
                                                  className={
                                                    styles.chatListTopImage
                                                  }
                                                />
                                              ) : (
                                                <div
                                                  className={
                                                    styles.chatListUserInfoNoImage
                                                  }
                                                >
                                                  <p>
                                                    {user.label
                                                      .split(" ")
                                                      .map((data: string) =>
                                                        data.charAt(0)
                                                      )
                                                      .join("")}
                                                  </p>
                                                </div>
                                              )}
                                              <span>{user.label}</span>
                                            </div>
                                          </div>

                                          <div>
                                            <GlobalButton
                                              size="xs"
                                              format="danger"
                                              onClick={() =>
                                                arrayHelpers.remove(index)
                                              }
                                            >
                                              Remove
                                            </GlobalButton>
                                          </div>
                                        </div>
                                      </div>
                                    </BoxShadowCard>
                                  </div>
                                );
                              }
                            )}
                          </div>
                        </div>
                      );
                    }}
                  />
                </Panel>
              </div>
            </Form>
          );
        }}
      </Formik>
    </>
  );
};

export const AddNewContactUser = ({
  footer,
  show,
  users,
  currentUser,
  handleClose,
}: any) => {
  const actionsSlice = useSelector((state: RootState) => state.actionsSlice);
  const dispatch = useDispatch();

  const createUserContactsDetail = async (values: { userId: string }) => {
    dispatch(isLoadingActions(true));
    createUserContacts(values.userId)
      .then((response) => {
        socket.emit("contactUser", currentUser);
        dispatch(hideActions());
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

  const usersList = users?.map((user: { name: string; _id: string }) => ({
    label: user.name,
    value: user._id,
  }));

  return (
    <GlobalModal
      title={`Add Contact User`}
      show={show}
      handleClose={handleClose}
      footer={footer}
    >
      <div className={styles.modal}>
        <Formik
          form
          initialValues={{
            userId: "",
          }}
          validationSchema={addContactForm}
          onSubmit={createUserContactsDetail}
          enableReinitialize
        >
          {({ handleChange, handleBlur, setFieldValue, values, errors }) => (
            <Form>
              <div>
                <div>
                  {actionsSlice.errorPopup.status && (
                    <GlobalErrorMessage
                      message={actionsSlice.errorPopup.message}
                    />
                  )}
                </div>
                {actionsSlice.isLoading && <LoadingData />}
                <div>
                  <div>
                    <ReactSelect
                      label="Users"
                      id="userId"
                      required
                      name="userId"
                      options={usersList}
                      onChange={(selected: any) =>
                        selected &&
                        selected.value &&
                        setFieldValue(`userId`, selected.value)
                      }
                    />
                  </div>
                </div>

                {footer && <div className={styles.footer}>{footer}</div>}
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </GlobalModal>
  );
};

export const DeleteUserPhoto = ({ footer, show, user, handleClose }: any) => {
  const actionsSlice = useSelector((state: RootState) => state.actionsSlice);
  const usersSlice = useSelector((state: RootState) => state.usersSlice);

  return (
    <GlobalModal
      title={`Delete Photo`}
      show={show}
      handleClose={handleClose}
      footer={footer}
    >
      <div className={styles.modal}>
        <p>Do you want to delete your photo?</p>
        <div>
          {actionsSlice.errorPopup.status && (
            <GlobalErrorMessage message={actionsSlice.errorPopup.message} />
          )}
        </div>
        {actionsSlice.isLoading && <LoadingData />}

        {footer && <div className={styles.footer}>{footer}</div>}
      </div>
    </GlobalModal>
  );
};

export const DeleteGroupPhoto = ({ footer, show, user, handleClose }: any) => {
  const actionsSlice = useSelector((state: RootState) => state.actionsSlice);
  const usersSlice = useSelector((state: RootState) => state.usersSlice);

  return (
    <GlobalModal
      title={`Delete Group Photo`}
      show={show}
      handleClose={handleClose}
      footer={footer}
    >
      <div className={styles.modal}>
        <p>
          Do you want to delete {usersSlice.selectedUser.group.name} group
          photo?
        </p>
        <div>
          {actionsSlice.errorPopup.status && (
            <GlobalErrorMessage message={actionsSlice.errorPopup.message} />
          )}
        </div>
        {actionsSlice.isLoading && <LoadingData />}

        {footer && <div className={styles.footer}>{footer}</div>}
      </div>
    </GlobalModal>
  );
};

export const EditUser = ({ footer, show, user, handleClose }: any) => {
  const actionsSlice = useSelector((state: RootState) => state.actionsSlice);
  const dispatch = useDispatch();
  const [editName, setEditName] = useState(false);
  const [editMessage, setEditMessage] = useState(false);
  const fileInputRef: any = useRef(null);
  const [showImage, setShowImage] = useState<{
    selectedImage: any;
    photoUrl: string;
    saveButton: boolean;
  }>({
    selectedImage: "",
    photoUrl: "",
    saveButton: true,
  });

  const [userDetail, setuserDetail] = useState<{
    name: string;
    message: string;
    photoUrl: string;
  }>(user);

  const updateUserProfileData = async (values: {
    name?: string;
    message?: string;
  }) => {
    dispatch(isLoadingActions(true));
    updateUserProfile(values)
      .then((response) => {
        dispatch(isLoadingActions(false));
        setEditMessage(false);
        setEditName(false);
        socket.emit("updateUser", response.data);
        setuserDetail(response.data);
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

  const handleChangePicture = (e: any) => {
    const file = e.target.files[0];

    if (file) {
      const reader = new FileReader();

      reader.onloadend = () => {
        setShowImage({
          ...showImage,
          selectedImage: reader.result,
          photoUrl: file,
          saveButton: false,
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleButtonClick = () => {
    fileInputRef.current.click();
  };

  const updateUserProfileImageData = () => {
    let data = new FormData();
    data.append("photoUrl", showImage.photoUrl);
    dispatch(isLoadingActions(true));
    updateUserProfileImage(data)
      .then((response) => {
        socket.emit("updateUser", response.data);
        setShowImage({
          selectedImage: "",
          photoUrl: "",
          saveButton: true,
        });
        dispatch(isLoadingActions(false));
        setuserDetail(response.data);
      })
      .catch((error) => {
        dispatch(
          errorPopupActions({ status: true, message: ACTIONS_ERROR_MESSAGE })
        );
        dispatch(isLoadingActions(false));
      });
  };

  const deleteUserProfileImageData = () => {
    dispatch(isLoadingActions(true));
    deleteUserPhoto()
      .then((response) => {
        socket.emit("updateUser", response.data);
        dispatch(isLoadingActions(false));
        dispatch(successDeleteUserPhotoActions({ status: false, record: {} }));
        setShowImage({
          selectedImage: "",
          photoUrl: "",
          saveButton: true,
        });
        setuserDetail(response.data);
      })
      .catch((error) => {
        dispatch(
          errorPopupActions({ status: true, message: ACTIONS_ERROR_MESSAGE })
        );
        dispatch(isLoadingActions(false));
      });
  };

  return (
    <Panel
      show={show}
      handleClose={() => {
        dispatch(hideActions());
      }}
      title="Edit user"
      width="50%"
      maxWidth="25%"
    >
      <div className="container">
        <>
          {actionsSlice.successDeleteUserPhoto.status && (
            <DeleteUserPhoto
              show={actionsSlice.successDeleteUserPhoto.status}
              handleClose={() =>
                dispatch(
                  successDeleteUserPhotoActions({ status: false, record: {} })
                )
              }
              footer={
                <>
                  <div className={styles.flexRowWrapModalFooter}>
                    <div className={styles.footerLeft}>
                      <GlobalButton
                        format="white"
                        size="sm"
                        onClick={() =>
                          dispatch(
                            successDeleteUserPhotoActions({
                              status: false,
                              record: {},
                            })
                          )
                        }
                      >
                        Cancel
                      </GlobalButton>
                    </div>
                    <div>
                      <GlobalButton
                        format="success"
                        size="sm"
                        onClick={() => deleteUserProfileImageData()}
                      >
                        Submit
                      </GlobalButton>
                    </div>
                  </div>
                </>
              }
            />
          )}
        </>
        <div className={`${styles.userDetails}`}>
          <div style={{ marginBottom: 20 }}>
            <BoxShadowCard>
              <div className={styles.userProfileDetailsInfo}>
                <Formik
                  form
                  initialValues={{
                    photoUrl: "",
                  }}
                  //   validationSchema={resetPasswordform}
                  onSubmit={updateUserProfileImageData}
                  enableReinitialize
                >
                  {({
                    handleChange,
                    handleBlur,
                    setFieldValue,
                    handleSubmit,
                    values,
                    errors,
                  }) => {
                    const displayImage = () => {
                      if (showImage.selectedImage) {
                        return (
                          <Image
                            src={showImage.selectedImage}
                            height="250"
                            width="250"
                            style={{ height: "auto" }}
                            alt="test"
                            className={styles.userProfileAvatar}
                          />
                        );
                      } else if (userDetail.photoUrl) {
                        return (
                          <Image
                            src={`${process.env.baseUrl}/images/profile/${userDetail.photoUrl}`}
                            height="250"
                            width="250"
                            alt=""
                            className={styles.userProfileAvatar}
                          />
                        );
                      } else {
                        return (
                          <Image
                            width="250"
                            height="250"
                            style={{ height: "auto" }}
                            src={userImagePlaceholder}
                            alt=""
                            className={styles.userProfileAvatar}
                          />
                        );
                      }
                    };
                    return (
                      <Form>
                        <div>
                          <div>
                            {actionsSlice.errorPopup.status && (
                              <GlobalErrorMessage
                                message={actionsSlice.errorPopup.message}
                              />
                            )}
                          </div>
                          {actionsSlice.isLoading && <LoadingData />}
                          <div className="row">
                            <div className="col-sm-12">
                              <h4>Profile picture</h4>
                            </div>
                            <hr />
                            <div
                              className={`${styles.userDetailsAvatar} ${styles.userProfileImageUpload}`}
                            >
                              <div className="col-sm-12">{displayImage()}</div>
                              <Row>
                                <Col xs={4}>
                                  <GlobalButton
                                    onClick={() => handleSubmit()}
                                    format="info"
                                    size="sm"
                                    disabled={showImage.saveButton}
                                  >
                                    Save
                                    <span>
                                      <FaEdit className="button-icon" />
                                    </span>
                                  </GlobalButton>
                                </Col>

                                <Col xs={4}>
                                  <input
                                    ref={fileInputRef}
                                    type="file"
                                    id="photoUrl"
                                    name="photoUrl"
                                    placeholder="user profile"
                                    accept=".jpg, .png, .jpeg"
                                    required
                                    onBlur={handleBlur("photoUrl")}
                                    autoCapitalize="none"
                                    onChange={handleChangePicture}
                                    multiple={true}
                                  />
                                  <GlobalButton
                                    size="sm"
                                    format="success"
                                    onClick={handleButtonClick}
                                  >
                                    Add
                                    <span>
                                      <FaImage className="button-icon" />
                                    </span>
                                  </GlobalButton>
                                </Col>

                                <Col xs={4}>
                                  <GlobalButton
                                    onClick={() =>
                                      dispatch(
                                        successDeleteUserPhotoActions({
                                          status: true,
                                          record: {},
                                        })
                                      )
                                    }
                                    format="danger"
                                    size="sm"
                                    disabled={user.photoUrl ? false : true}
                                  >
                                    Delete
                                    <span>
                                      <MdDelete className="button-icon" />
                                    </span>
                                  </GlobalButton>
                                </Col>
                              </Row>
                            </div>
                          </div>

                          {footer && (
                            <div className={styles.footer}>{footer}</div>
                          )}
                        </div>
                      </Form>
                    );
                  }}
                </Formik>
              </div>
            </BoxShadowCard>
          </div>
          <div style={{ marginBottom: 20 }}>
            <BoxShadowCard>
              <div className={styles.userDetailsInfo}>
                <Formik
                  form
                  initialValues={{
                    name: userDetail.name,
                  }}
                  validationSchema={updateNameForm}
                  onSubmit={updateUserProfileData}
                  enableReinitialize
                >
                  {({
                    handleChange,
                    handleBlur,
                    setFieldValue,
                    handleSubmit,
                    values,
                    errors,
                  }) => (
                    <Form>
                      <div>
                        <div>
                          {actionsSlice.errorPopup.status && (
                            <GlobalErrorMessage
                              message={actionsSlice.errorPopup.message}
                            />
                          )}
                        </div>
                        {actionsSlice.isLoading && <LoadingData />}
                        <div>
                          <div className="row">
                            <div className="col-sm-12">
                              <Row>
                                <Col xs={10}>
                                  <h4>Your name</h4>
                                </Col>
                                <Col
                                  xs={2}
                                  className={styles.userDetailsInfoUpBtn}
                                >
                                  <GlobalButton format="none">
                                    {(!editName && (
                                      <FaEdit
                                        onClick={() => setEditName(true)}
                                      />
                                    )) || (
                                      <FaCheck
                                        onClick={() => {
                                          handleSubmit();
                                        }}
                                      />
                                    )}
                                  </GlobalButton>
                                </Col>
                              </Row>
                            </div>
                            <hr />
                            {!editName && (
                              <>
                                <p>{userDetail.name}</p>
                              </>
                            )}

                            {editName && (
                              <>
                                <Input
                                  placeholder="Name"
                                  name="name"
                                  required
                                  id="name"
                                  onBlur={handleBlur("name")}
                                  autoCapitalize="none"
                                  onChange={handleChange("name")}
                                  error={errors.name}
                                />
                              </>
                            )}
                          </div>
                        </div>

                        {footer && (
                          <div className={styles.footer}>{footer}</div>
                        )}
                      </div>
                    </Form>
                  )}
                </Formik>
              </div>
            </BoxShadowCard>
          </div>
          <div style={{ marginBottom: 20 }}>
            <BoxShadowCard>
              <div className={styles.userDetailsInfo}>
                <Formik
                  form
                  initialValues={{
                    message: userDetail.message,
                  }}
                  validationSchema={updateMessageForm}
                  onSubmit={updateUserProfileData}
                  enableReinitialize
                >
                  {({
                    handleChange,
                    handleBlur,
                    setFieldValue,
                    handleSubmit,
                    values,
                    errors,
                  }) => (
                    <Form>
                      <div>
                        <div>
                          {actionsSlice.errorPopup.status && (
                            <GlobalErrorMessage
                              message={actionsSlice.errorPopup.message}
                            />
                          )}
                        </div>
                        {actionsSlice.isLoading && <LoadingData />}
                        <div>
                          <div className="row">
                            <div className="col-sm-12">
                              <Row>
                                <Col xs={10}>
                                  <h4>About</h4>
                                </Col>
                                <Col
                                  xs={2}
                                  className={styles.userDetailsInfoUpBtn}
                                >
                                  <GlobalButton format="none">
                                    {(!editMessage && (
                                      <FaEdit
                                        onClick={() => setEditMessage(true)}
                                      />
                                    )) || (
                                      <FaCheck
                                        onClick={() => {
                                          handleSubmit();
                                        }}
                                      />
                                    )}
                                  </GlobalButton>
                                </Col>
                              </Row>
                            </div>
                            <hr />
                            {!editMessage && (
                              <>
                                <p>{userDetail.message}</p>
                              </>
                            )}

                            {editMessage && (
                              <>
                                <Input
                                  placeholder="Message"
                                  name="message"
                                  required
                                  id="message"
                                  onBlur={handleBlur("message")}
                                  autoCapitalize="none"
                                  onChange={handleChange("message")}
                                  error={errors.message}
                                />
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                    </Form>
                  )}
                </Formik>
              </div>
            </BoxShadowCard>
          </div>
        </div>
      </div>
    </Panel>
  );
};

export const EditGroupUser = ({ footer, show, user, handleClose }: any) => {
  const actionsSlice = useSelector((state: RootState) => state.actionsSlice);
  const usersSlice = useSelector((state: RootState) => state.usersSlice);
  const chatMessageSlice = useSelector(
    (state: RootState) => state.chatMessageSlice
  );
  const groupRecord = usersSlice.selectedUser.group;

  const groupMembersList = chatMessageSlice.chatGroupMembers.map(
    (member: {
      user: {
        name: string;
        _id: string;
      };
    }) => ({
      label: member.user.name,
      value: member.user._id,
    })
  );

  const dispatch = useDispatch();
  const [editName, setEditName] = useState(false);
  const [editDescription, setEditDescription] = useState(false);
  const fileInputRef: any = useRef(null);
  const [showImage, setShowImage] = useState<{
    selectedImage: any;
    photoUrl: string;
    saveButton: boolean;
  }>({
    selectedImage: "",
    photoUrl: "",
    saveButton: true,
  });

  const updateGroupUserProfileData = async (values: {
    name?: string;
    description?: string;
  }) => {
    dispatch(isLoadingActions(true));
    updateGroup(values, groupRecord._id)
      .then((response) => {
        dispatch(isLoadingActions(false));
        setEditDescription(false);
        setEditName(false);
        socket.emit("updateGroup", groupMembersList);
        dispatch(
          selectedUserRecord({
            ...usersSlice.selectedUser,
            group: response.data,
            status: true,
          })
        );
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

  const handleChangePicture = (e: any) => {
    const file = e.target.files[0];

    if (file) {
      const reader = new FileReader();

      reader.onloadend = () => {
        setShowImage({
          ...showImage,
          selectedImage: reader.result,
          photoUrl: file,
          saveButton: false,
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleButtonClick = () => {
    fileInputRef.current.click();
  };

  const updateGroupProfileImageData = () => {
    let data = new FormData();
    data.append("photoUrl", showImage.photoUrl);
    dispatch(isLoadingActions(true));
    updateGroupProfileImage(data, groupRecord._id)
      .then((response) => {
        socket.emit("updateGroup", groupMembersList);
        setShowImage({
          ...showImage,
          saveButton: true,
        });
        dispatch(isLoadingActions(false));

        dispatch(
          selectedUserRecord({
            ...usersSlice.selectedUser,
            group: response.data,
            status: true,
          })
        );
      })
      .catch((error) => {
        dispatch(
          errorPopupActions({ status: true, message: ACTIONS_ERROR_MESSAGE })
        );
        dispatch(isLoadingActions(false));
      });
  };

  const deleteGroupProfileImageData = () => {
    dispatch(isLoadingActions(true));
    deleteGroupPhoto(groupRecord._id)
      .then((response) => {
        socket.emit("updateGroup", groupMembersList);
        dispatch(isLoadingActions(false));
        dispatch(
          successDeleteGroupUserPhotoActions({ status: false, record: {} })
        );
        dispatch(
          selectedUserRecord({
            ...usersSlice.selectedUser,
            group: response.data,
            status: true,
          })
        );
      })
      .catch((error) => {
        dispatch(
          errorPopupActions({ status: true, message: ACTIONS_ERROR_MESSAGE })
        );
        dispatch(isLoadingActions(false));
      });
  };

  return (
    <Panel
      show={show}
      handleClose={() => {
        dispatch(hideActions());
      }}
      title="Edit group"
      width="50%"
      maxWidth="25%"
    >
      <div className="container">
        <>
          {actionsSlice.successDeleteGroupUserPhoto.status && (
            <DeleteGroupPhoto
              show={actionsSlice.successDeleteGroupUserPhoto.status}
              handleClose={() =>
                dispatch(
                  successDeleteGroupUserPhotoActions({
                    status: false,
                    record: {},
                  })
                )
              }
              footer={
                <>
                  <div className={styles.flexRowWrapModalFooter}>
                    <div className={styles.footerLeft}>
                      <GlobalButton
                        format="white"
                        size="sm"
                        onClick={() =>
                          dispatch(
                            successDeleteGroupUserPhotoActions({
                              status: false,
                              record: {},
                            })
                          )
                        }
                      >
                        No
                      </GlobalButton>
                    </div>
                    <div>
                      <GlobalButton
                        format="success"
                        size="sm"
                        onClick={() => deleteGroupProfileImageData()}
                      >
                        Yes
                      </GlobalButton>
                    </div>
                  </div>
                </>
              }
            />
          )}
        </>
        <div className={`${styles.userDetails}`}>
          <div style={{ marginBottom: 20 }}>
            <BoxShadowCard>
              <div className={styles.userProfileDetailsInfo}>
                <Formik
                  form
                  initialValues={{
                    photoUrl: "",
                  }}
                  onSubmit={updateGroupProfileImageData}
                  enableReinitialize
                >
                  {({
                    handleChange,
                    handleBlur,
                    setFieldValue,
                    handleSubmit,
                    values,
                    errors,
                  }) => {
                    const displayImage = () => {
                      if (showImage.selectedImage) {
                        return (
                          <Image
                            src={showImage.selectedImage}
                            height="250"
                            width="250"
                            style={{ height: "auto" }}
                            alt="test"
                            className={styles.userProfileAvatar}
                          />
                        );
                      } else if (groupRecord.photoUrl) {
                        return (
                          <Image
                            src={`${process.env.baseUrl}/images/groups/${groupRecord.photoUrl}`}
                            height="250"
                            width="250"
                            alt=""
                            className={styles.userProfileAvatar}
                          />
                        );
                      } else {
                        return (
                          <Image
                            width="250"
                            height="250"
                            style={{ height: "auto" }}
                            src={userImagePlaceholder}
                            alt=""
                            className={styles.userProfileAvatar}
                          />
                        );
                      }
                    };
                    return (
                      <Form>
                        <div>
                          <div>
                            {actionsSlice.errorPopup.status && (
                              <GlobalErrorMessage
                                message={actionsSlice.errorPopup.message}
                              />
                            )}
                          </div>
                          {actionsSlice.isLoading && <LoadingData />}
                          <div className="row">
                            <div className="col-sm-12">
                              <h4>Group profile picture</h4>
                            </div>
                            <hr />
                            <div
                              className={`${styles.userDetailsAvatar} ${styles.userProfileImageUpload}`}
                            >
                              <div className="col-sm-12">{displayImage()}</div>
                              <Row>
                                <Col xs={4}>
                                  <GlobalButton
                                    onClick={() => handleSubmit()}
                                    format="info"
                                    size="sm"
                                    disabled={showImage.saveButton}
                                  >
                                    Save
                                    <span>
                                      <FaEdit className="button-icon" />
                                    </span>
                                  </GlobalButton>
                                </Col>

                                <Col xs={4}>
                                  <input
                                    ref={fileInputRef}
                                    type="file"
                                    id="photoUrl"
                                    name="photoUrl"
                                    placeholder="user profile"
                                    accept=".jpg, .png, .jpeg"
                                    required
                                    onBlur={handleBlur("photoUrl")}
                                    autoCapitalize="none"
                                    onChange={handleChangePicture}
                                    multiple={true}
                                  />
                                  <GlobalButton
                                    size="sm"
                                    format="success"
                                    onClick={handleButtonClick}
                                  >
                                    Add
                                    <span>
                                      <FaImage className="button-icon" />
                                    </span>
                                  </GlobalButton>
                                </Col>

                                <Col xs={4}>
                                  <GlobalButton
                                    onClick={() =>
                                      dispatch(
                                        successDeleteGroupUserPhotoActions({
                                          status: true,
                                          record: {},
                                        })
                                      )
                                    }
                                    format="danger"
                                    size="sm"
                                    disabled={
                                      groupRecord.photoUrl ? false : true
                                    }
                                  >
                                    Delete
                                    <span>
                                      <MdDelete className="button-icon" />
                                    </span>
                                  </GlobalButton>
                                </Col>
                              </Row>
                            </div>
                          </div>

                          {footer && (
                            <div className={styles.footer}>{footer}</div>
                          )}
                        </div>
                      </Form>
                    );
                  }}
                </Formik>
              </div>
            </BoxShadowCard>
          </div>
          <div style={{ marginBottom: 20 }}>
            <BoxShadowCard>
              <div className={styles.userDetailsInfo}>
                <Formik
                  form
                  initialValues={{
                    name: groupRecord.name,
                  }}
                  validationSchema={updateNameForm}
                  onSubmit={updateGroupUserProfileData}
                  enableReinitialize
                >
                  {({
                    handleChange,
                    handleBlur,
                    setFieldValue,
                    handleSubmit,
                    values,
                    errors,
                  }) => (
                    <Form>
                      <div>
                        <div>
                          {actionsSlice.errorPopup.status && (
                            <GlobalErrorMessage
                              message={actionsSlice.errorPopup.message}
                            />
                          )}
                        </div>
                        {actionsSlice.isLoading && <LoadingData />}
                        <div>
                          <div className="row">
                            <div className="col-sm-12">
                              <Row>
                                <Col xs={10}>
                                  <h4>Group name</h4>
                                </Col>
                                <Col
                                  xs={2}
                                  className={styles.userDetailsInfoUpBtn}
                                >
                                  <GlobalButton format="none">
                                    {(!editName && (
                                      <FaEdit
                                        onClick={() => setEditName(true)}
                                      />
                                    )) || (
                                      <FaCheck
                                        onClick={() => {
                                          handleSubmit();
                                        }}
                                      />
                                    )}
                                  </GlobalButton>
                                </Col>
                              </Row>
                            </div>
                            <hr />
                            {!editName && (
                              <>
                                <p>{groupRecord.name}</p>
                              </>
                            )}

                            {editName && (
                              <>
                                <Input
                                  placeholder="Name"
                                  name="name"
                                  required
                                  id="name"
                                  onBlur={handleBlur("name")}
                                  autoCapitalize="none"
                                  onChange={handleChange("name")}
                                  error={errors.name}
                                />
                              </>
                            )}
                          </div>
                        </div>

                        {footer && (
                          <div className={styles.footer}>{footer}</div>
                        )}
                      </div>
                    </Form>
                  )}
                </Formik>
              </div>
            </BoxShadowCard>
          </div>
          <div style={{ marginBottom: 20 }}>
            <BoxShadowCard>
              <div className={styles.userDetailsInfo}>
                <Formik
                  form
                  initialValues={{
                    description: groupRecord.description,
                  }}
                  onSubmit={updateGroupUserProfileData}
                  enableReinitialize
                >
                  {({
                    handleChange,
                    handleBlur,
                    setFieldValue,
                    handleSubmit,
                    values,
                    errors,
                  }) => (
                    <Form>
                      <div>
                        <div>
                          {actionsSlice.errorPopup.status && (
                            <GlobalErrorMessage
                              message={actionsSlice.errorPopup.message}
                            />
                          )}
                        </div>
                        {actionsSlice.isLoading && <LoadingData />}
                        <div>
                          <div className="row">
                            <div className="col-sm-12">
                              <Row>
                                <Col xs={10}>
                                  <h4>Group description</h4>
                                </Col>
                                <Col
                                  xs={2}
                                  className={styles.userDetailsInfoUpBtn}
                                >
                                  <GlobalButton format="none">
                                    {(!editDescription && (
                                      <FaEdit
                                        onClick={() => setEditDescription(true)}
                                      />
                                    )) || (
                                      <FaCheck
                                        onClick={() => {
                                          handleSubmit();
                                        }}
                                      />
                                    )}
                                  </GlobalButton>
                                </Col>
                              </Row>
                            </div>
                            <hr />
                            {!editDescription && (
                              <>
                                <p>{groupRecord.description || "-"}</p>
                              </>
                            )}

                            {editDescription && (
                              <>
                                <Input
                                  placeholder="Description"
                                  name="description"
                                  required
                                  id="description"
                                  onBlur={handleBlur("description")}
                                  autoCapitalize="none"
                                  onChange={handleChange("description")}
                                  error={errors.description}
                                />
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                    </Form>
                  )}
                </Formik>
              </div>
            </BoxShadowCard>
          </div>
        </div>
      </div>
    </Panel>
  );
};

export const LogoutUser = ({ footer, show, user, handleClose }: any) => {
  const actionsSlice = useSelector((state: RootState) => state.actionsSlice);

  return (
    <GlobalModal
      title={`Logout`}
      show={show}
      handleClose={handleClose}
      footer={footer}
    >
      <div className={styles.modal}>
        <p>Do you want to logout?</p>
        <div>
          {actionsSlice.errorPopup.status && (
            <GlobalErrorMessage message={actionsSlice.errorPopup.message} />
          )}
        </div>
        {actionsSlice.isLoading && <LoadingData />}

        {footer && <div className={styles.footer}>{footer}</div>}
      </div>
    </GlobalModal>
  );
};

export const UserSettings = ({ footer, show, user, handleClose }: any) => {
  // const actionsSlice = useSelector((state: RootState) => state.actionsSlice);

  return (
    <GlobalModal
      title={`User settings`}
      show={show}
      handleClose={handleClose}
      footer={footer}
    >
      <div className={styles.modal}>
        <p>Do you want to generate a password reset link for</p>
        {/* <div>
                {actionsSlice.actionsErrorMessage && <GlobalErrorMessage message={actionsSlice.actionsErrorMessage} />}
              </div> */}
        {/* {actionsSlice.actionsIsLoading && <LoadingData />} */}

        {footer && <div className={styles.footer}>{footer}</div>}
      </div>
    </GlobalModal>
  );
};

export const ChangePassword = ({ footer, show, user, handleClose }: any) => {
  const actionsSlice = useSelector((state: RootState) => state.actionsSlice);
  const dispatch = useDispatch();

  const ChangePasswordData = (values: {
    oldPassword: string;
    password: string;
  }) => {
    dispatch(isLoadingActions(true));
    changeUserProfilePassword(values.oldPassword, values.password)
      .then((response) => {
        dispatch(hideActions());
      })
      .catch((error) => {
        dispatch(isLoadingActions(false));
        dispatch(
          errorPopupActions({
            status: true,
            message: ` Your current password is incorrect, or ${ACTIONS_ERROR_MESSAGE.toLowerCase()}`,
            display: "",
          })
        );
      });
  };

  return (
    <GlobalModal
      title={`Change password`}
      show={show}
      handleClose={handleClose}
      footer={footer}
    >
      <div className={styles.modal}>
        <Formik
          form
          initialValues={{
            password: "",
            oldPassword: "",
            isEnabled: false,
          }}
          validationSchema={changeUserProfilePasswordForm}
          onSubmit={ChangePasswordData}
          enableReinitialize
        >
          {({ handleChange, handleBlur, setFieldValue, values, errors }) => (
            <Form>
              <div>
                <div>
                  {actionsSlice.errorPopup.status && (
                    <GlobalErrorMessage
                      message={actionsSlice.errorPopup.message}
                    />
                  )}
                </div>
                {actionsSlice.isLoading && <LoadingData />}
                <div>
                  <div style={{ marginTop: 20, marginBottom: 20 }}>
                    <Input
                      type={values.isEnabled ? "text" : "password"}
                      placeholder="Current Password"
                      name="oldPassword"
                      required
                      id="oldPassword"
                      label="Current Password"
                      onBlur={handleBlur("oldPassword")}
                      autoCapitalize="none"
                      onChange={handleChange("oldPassword")}
                      error={errors.oldPassword}
                    />
                  </div>
                  <div style={{ marginBottom: 20 }}>
                    <Input
                      type={values.isEnabled ? "text" : "password"}
                      placeholder="New Password"
                      name="password"
                      required
                      id="password"
                      label="New Password"
                      onBlur={handleBlur("password")}
                      autoCapitalize="none"
                      onChange={handleChange("password")}
                      error={errors.password}
                    />
                  </div>
                  <div>
                    <Toggle
                      type="checkbox"
                      name="isEnabled"
                      id="isEnabled"
                      label={
                        values.isEnabled ? "Hide Password" : "Show Password"
                      }
                      rightLabel
                      onChange={(value: any) => {
                        const targetValue =
                          value.target && value.target.value === "true"
                            ? false
                            : true;
                        setFieldValue(`isEnabled`, targetValue);
                      }}
                    />
                  </div>
                </div>

                {footer && <div className={styles.footer}>{footer}</div>}
              </div>
            </Form>
          )}
        </Formik>
      </div>{" "}
    </GlobalModal>
  );
};

export const SendImageMessage = ({ footer, show, handleClose }: any) => {
  const actionsSlice = useSelector((state: RootState) => state.actionsSlice);

  return (
    <GlobalModal
      title={`Send Image Message`}
      show={show}
      handleClose={handleClose}
      footer={footer}
      size="lg"
    >
      <div className={styles.modal}>
        <div>
          <div>
            {actionsSlice.errorPopup.status && (
              <GlobalErrorMessage message={actionsSlice.errorPopup.message} />
            )}
          </div>
          {actionsSlice.isLoading && <LoadingData />}
          <div className={styles.sendImageMessage}>
            <Image
              src={actionsSlice.successSendImageMessage.record.selectedImage}
              height="250"
              width="250"
              style={{ height: "auto" }}
              alt="test"
              className={styles.sendImageMessageAvatar}
            />
          </div>

          {footer && <div className={styles.footer}>{footer}</div>}
        </div>
      </div>
    </GlobalModal>
  );
};

export const SendDocumentMessage = ({ footer, show, handleClose }: any) => {
  const actionsSlice = useSelector((state: RootState) => state.actionsSlice);

  return (
    <GlobalModal
      title={`Send Document Message`}
      show={show}
      handleClose={handleClose}
      footer={footer}
      size="lg"
    >
      <div className={styles.modal}>
        <div>
          <div>
            {actionsSlice.errorPopup.status && (
              <GlobalErrorMessage message={actionsSlice.errorPopup.message} />
            )}
          </div>
          {actionsSlice.isLoading && <LoadingData />}
          <div className={styles.sendDocumentMessage}>
            <FaFile size={300} />
            <p>
              {actionsSlice.successSendDocumentMessage.record.message?.name}
            </p>
          </div>

          {footer && <div className={styles.footer}>{footer}</div>}
        </div>
      </div>
    </GlobalModal>
  );
};

{
  /* <div className={styles.modal}>
        <Formik
          form
          initialValues={{
            password: "",
            password_confirm: "",
            isEnabled: false,
          }}
          //   validationSchema={resetPasswordform}
          onSubmit={generateToken}
          enableReinitialize
        >
          {({ handleChange, handleBlur, setFieldValue, values, errors }) => (
            <Form>
              <div>
                <div>
                  {actionsSlice.errorPopup.status && (
                    <GlobalErrorMessage
                      message={actionsSlice.errorPopup.message}
                    />
                  )}
                </div>
                {actionsSlice.isLoading && <LoadingData />}
                <div>
                  <p>dddhh</p>
                </div>

                {footer && <div className={styles.footer}>{footer}</div>}
              </div>
            </Form>
          )}
        </Formik>
      </div> */
}
