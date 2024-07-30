import { Fragment, useState } from "react";
import { FaChevronDown, FaFilePdf, FaFileWord, FaStar } from "react-icons/fa";
import Image from "next/image";
import MessageActionsPopup from "./MessageActionsPopup";
import { parseISO, format, isToday, isYesterday, isThisWeek } from "date-fns";

const ChatAreaCenterLevel = ({ chatMessageSlice, userRecord }: any) => {
  const [showPopup, setShowPopup] = useState(false);
  const [messageId, setMessageId] = useState("");

  const handleIconClick = (messageId: string) => {
    setShowPopup(!showPopup);
    setMessageId(messageId);
  };

  const handleClosePopup = () => {
    setShowPopup(false);
    setMessageId("");
  };

  return (
    <>
      {chatMessageSlice.chatMessages?.groupedMessages?.map(
        (groupMessage: any, index: number) => {
          const dateCreated = () => {
            const date = parseISO(groupMessage.date);
            if (isToday(date)) {
              return `Today`;
            } else if (isYesterday(date)) {
              return `Yesterday`;
            } else if (isThisWeek(date)) {
              return `${format(date, "EEEE")}`;
            } else {
              return `${format(date, "dd/MM/yyyy")}`;
            }
          };

          return (
            <Fragment key={index}>
              <div className="groupedDate">
                <span> {dateCreated()}</span>
              </div>

              {groupMessage?.messages?.map((message: any, index: number) => {
                const getStarMessage = message.stars?.some(
                  (user: any) => user.user === userRecord._id
                );

                const translatedMessage = message.translatedMessage.find(
                  (translatedMessage: any) =>
                    translatedMessage?.user === userRecord._id
                );

                const showMessages = () => {
                  if (message.type === "image") {
                    return (
                      <div className="chatAreaCenterTexts">
                        <div className="chatAreaCenterContent">
                          <div className="chatAreaCenterOptionsIcon">
                            <span className="optionsSpan">*</span>
                            <span className="popup-message">
                              <FaChevronDown
                                className="contactInfoGroupMemberIcon optionsBtn"
                                onClick={() => {
                                  handleIconClick(message._id);
                                }}
                              />
                              {showPopup && messageId === message._id && (
                                <MessageActionsPopup
                                  currentUser={userRecord}
                                  type="image"
                                  message={message}
                                  onClose={handleClosePopup}
                                />
                              )}
                            </span>
                          </div>
                          <div className="chatAreaMessage">
                            {message.isGroup &&
                              message.sender._id !== userRecord._id && (
                                <div className="groupMemberName">
                                  <span>{message.sender.name}</span>
                                </div>
                              )}
                            <span className="messageList">
                              <Image
                                src={`${process.env.baseUrl}/images/messages/${message.message}`}
                                height="250"
                                width="250"
                                alt=""
                                className="userProfileAvatar"
                              />
                            </span>{" "}
                            <br />{" "}
                            <div className="messageTime">
                              {getStarMessage && <FaStar />}{" "}
                              {format(message.createdAt, "HH:mm")}
                            </div>{" "}
                          </div>
                        </div>
                      </div>
                    );
                  } else if (message.type === "document") {
                    const ext = message.message.split(".").pop();
                    const documentFormat = () => {
                      if (ext === "pdf") {
                        return (
                          <span className="messageList">
                            <span>
                              <FaFilePdf
                                size={25}
                                className="documentSavePdf"
                              />
                              <span className="documentTitle">
                                {message.message}
                              </span>
                            </span>
                          </span>
                        );
                      } else if (["docx", "doc"].includes(ext)) {
                        return (
                          <span className="messageList">
                            <span>
                              <FaFileWord
                                size={25}
                                className="documentSaveWord"
                              />
                              <span className="documentTitle">
                                {message.message}
                              </span>
                            </span>
                            {/* <span className="documentSaveDownload">
                              {" "}
                              <GlobalButton
                                format="none"
                                size="sm"
                                target="_blank"
                                href={`${process.env.baseUrl}/documents/messages/${message.message}`}
                              >
                                <FaDownload className="documentSaveDownloadIcon" />
                              </GlobalButton>
                            </span> */}
                          </span>
                        );
                      }
                    };
                    return (
                      <div className="chatAreaCenterTexts">
                        <div className="chatAreaCenterContent">
                          <div className="chatAreaCenterOptionsIcon">
                            <span className="optionsSpan">*</span>
                            <span className="popup-message">
                              <FaChevronDown
                                className="contactInfoGroupMemberIcon optionsBtn"
                                onClick={() => {
                                  handleIconClick(message._id);
                                }}
                              />
                              {showPopup && messageId === message._id && (
                                <MessageActionsPopup
                                  currentUser={userRecord}
                                  type="document"
                                  message={message}
                                  onClose={handleClosePopup}
                                />
                              )}
                            </span>
                          </div>
                          <div className="chatAreaMessage">
                            {message.isGroup &&
                              message.sender._id !== userRecord._id && (
                                <div className="groupMemberName">
                                  <span>{message.sender.name}</span>
                                </div>
                              )}
                            <span>{documentFormat()}</span> <br />{" "}
                            <div className="messageTime">
                              {getStarMessage && <FaStar />}{" "}
                              {format(message.createdAt, "HH:mm")}
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  } else if (message.type === "link") {
                    return (
                      <div className="chatAreaCenterTexts">
                        <div className="chatAreaCenterContent">
                          <div className="chatAreaCenterOptionsIcon">
                            <span className="optionsSpan">*</span>
                            <span className="popup-message">
                              <FaChevronDown
                                className="contactInfoGroupMemberIcon optionsBtn"
                                onClick={() => {
                                  handleIconClick(message._id);
                                }}
                              />
                              {showPopup && messageId === message._id && (
                                <MessageActionsPopup
                                  currentUser={userRecord}
                                  type="link"
                                  message={message}
                                  onClose={handleClosePopup}
                                />
                              )}
                            </span>
                          </div>
                          <div className="chatAreaMessage">
                            {message.isGroup &&
                              message.sender._id !== userRecord._id && (
                                <div className="groupMemberName">
                                  <span>{message.sender.name}</span>
                                </div>
                              )}
                            <span>
                              <span className="messageLink">
                                {message.message}
                              </span>
                            </span>{" "}
                            <br />{" "}
                            <div className="messageTime">
                              {getStarMessage && <FaStar />}{" "}
                              {format(message.createdAt, "HH:mm")}
                            </div>{" "}
                          </div>
                        </div>
                      </div>
                    );
                  } else if (message.type === "action") {
                    return (
                      <div className="chatAreaCenterTexts">
                        <div className="chatAreaCenterContent">
                          <div className="chatAreaMessage">
                            <span className="actionMessageList">
                              {message.message}
                            </span>{" "}
                          </div>
                        </div>
                      </div>
                    );
                  } else if (message.type === "audio") {
                    return (
                      <div className="chatAreaCenterTexts">
                        <div className="chatAreaCenterContent">
                          <div className="chatAreaCenterOptionsIcon">
                            <span className="optionsSpan">*</span>
                            <span className="popup-message">
                              <FaChevronDown
                                className="contactInfoGroupMemberIcon optionsBtn"
                                onClick={() => {
                                  handleIconClick(message._id);
                                }}
                              />
                              {showPopup && messageId === message._id && (
                                <MessageActionsPopup
                                  currentUser={userRecord}
                                  type="audio"
                                  message={message}
                                  onClose={handleClosePopup}
                                />
                              )}
                            </span>
                          </div>
                          <div className="chatAreaMessage">
                            {message.isGroup &&
                              message.sender._id !== userRecord._id && (
                                <div className="groupMemberName">
                                  <span>{message.sender.name}</span>
                                </div>
                              )}
                            <span>
                              <span className="messageLink">
                                <audio
                                  controls
                                  src={`${process.env.baseUrl}/audio/messages/${message.message}`}
                                ></audio>
                              </span>
                            </span>{" "}
                            <br />{" "}
                            <div className="messageTime">
                              {getStarMessage && <FaStar />}{" "}
                              {format(message.createdAt, "HH:mm")}
                            </div>{" "}
                          </div>
                        </div>
                      </div>
                    );
                  } else {
                    return (
                      <div className="chatAreaCenterTexts">
                        <div className="chatAreaCenterContent">
                          <div className="chatAreaCenterOptionsIcon">
                            <span className="optionsSpan">*</span>
                            <span className="popup-message">
                              <FaChevronDown
                                className="contactInfoGroupMemberIcon optionsBtn"
                                onClick={() => {
                                  handleIconClick(message._id);
                                }}
                              />
                              {showPopup && messageId === message._id && (
                                <MessageActionsPopup
                                  currentUser={userRecord}
                                  type="text"
                                  message={message}
                                  onClose={handleClosePopup}
                                />
                              )}
                            </span>
                          </div>

                          <div className="chatAreaMessage">
                            {message.isGroup &&
                              message.sender._id !== userRecord._id && (
                                <div className="groupMemberName">
                                  <span>{message.sender.name}</span>
                                </div>
                              )}
                            <span className="messageList">
                              {" "}
                              {message.message}
                            </span>{" "}
                            <br />{" "}
                            <div className="messageTime">
                              {getStarMessage && <FaStar />}{" "}
                              {message.editMessage && "Edited"}{" "}
                              {format(message.createdAt, "HH:mm")}
                            </div>{" "}
                          </div>
                        </div>

                        {/* translate message */}
                        {translatedMessage && (
                          <div
                            className="chatAreaCenterContent"
                            style={{ background: "#e7eaf3" }}
                          >
                            <div className="chatAreaCenterOptionsIcon">
                              <span className="optionsSpan">*</span>
                            </div>

                            <div className="chatAreaMessage">
                              <span className="messageList">
                                {translatedMessage.message}
                              </span>{" "}
                              <br />{" "}
                              <div className="messageTime">
                                {`${translatedMessage?.preferLanguage?.language} version`}
                              </div>{" "}
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  }
                };

                return (
                  <div
                    className={`${
                      message.sender._id === userRecord._id
                        ? `message ${message.type !== "action" && "own"}  ${
                            message.type === "action" && "actionMessage"
                          }`
                        : `message ${
                            message.type === "action" && "actionMessage"
                          }`
                    } `}
                    key={index}
                  >
                    <>{showMessages()}</>
                  </div>
                );
              })}
            </Fragment>
          );
        }
      )}
    </>
  );
};

export default ChatAreaCenterLevel;
