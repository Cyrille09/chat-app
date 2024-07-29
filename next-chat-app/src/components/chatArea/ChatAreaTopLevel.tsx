// import { successSearchMessagesActions } from "@/redux-toolkit/reducers/actionsSlice";
import { format } from "date-fns";
// import { FaPhoneAlt, FaSearch, FaVideo } from "react-icons/fa";
import { useDispatch } from "react-redux";
import Image from "next/image";

const ChatAreaTopLevel = ({
  selectedUser,
  chatMessageSlice,
  usersSlice,
}: any) => {
  const dispatch = useDispatch();
  const displayStatus = () => {
    if (selectedUser.isGroup) {
      const names = chatMessageSlice.chatGroupMembers
        .map(
          (member: { user: { name: string } }) => member.user.name.split(" ")[0]
        )
        .join(", ");

      return (
        <>
          <span className="chatAreaTopTextsName">
            {selectedUser.group.name}
          </span>

          <p className="groupMembers">
            {names.length > 50 ? `${names.substring(0, 70)}...` : names}
          </p>
        </>
      );
    } else {
      return (
        <>
          <span className="chatAreaTopTextsName">{selectedUser.user.name}</span>
          {usersSlice.selectedUser.user.lastSeen.status ? (
            <p>
              <span className="chatAreaTopLastOnline">Online</span>
            </p>
          ) : (
            <p>
              <span className="chatAreaTopLastSeen">
                {usersSlice.selectedUser.user.lastSeen.date ? (
                  `Last seen: ${format(
                    usersSlice.selectedUser.user.lastSeen.date,
                    "dd-MM-yyyy HH:mm"
                  )}`
                ) : (
                  <span className="chatAreaTopOffline">offline</span>
                )}
              </span>
            </p>
          )}
        </>
      );
    }
  };

  const setProfileImage = selectedUser.isGroup ? (
    <>
      {selectedUser.group.photoUrl ? (
        <Image
          height="50"
          width="50"
          src={`${process.env.baseUrl}/images/groups/${selectedUser.group.photoUrl}`}
          alt=""
        />
      ) : (
        <div className="chatListItemUserNoImage">
          <p>
            {selectedUser.group.name
              .split(" ")
              .map((data: string) => data.charAt(0))
              .slice(0, 2)
              .join("")}
          </p>
        </div>
      )}
    </>
  ) : (
    <>
      {selectedUser.user.photoUrl ? (
        <Image
          height="50"
          width="50"
          src={`${process.env.baseUrl}/images/profile/${selectedUser.user.photoUrl}`}
          alt=""
        />
      ) : (
        <div className="chatListItemUserNoImage">
          <p>
            {selectedUser.user.name
              .split(" ")
              .map((data: string) => data.charAt(0))
              .slice(0, 2)
              .join("")}
          </p>
        </div>
      )}
    </>
  );
  return (
    <>
      <div className="user">
        {setProfileImage}
        <div className="chatAreaTopTexts">{displayStatus()}</div>
      </div>
      {/* Audio call, video call and search  message will be ready soon*/}

      {/* <div className="icons">
        <FaVideo
          className="chartTopIcon"
          onClick={() => alert("Coming soon")}
        />
        <FaPhoneAlt
          className="chartTopIcon"
          onClick={() => alert("Coming soon")}
        />
        <FaSearch
          className="chartTopIcon"
          onClick={() =>
            dispatch(successSearchMessagesActions({ status: true, record: {} }))
          }
        />
      </div> */}
    </>
  );
};

export default ChatAreaTopLevel;
