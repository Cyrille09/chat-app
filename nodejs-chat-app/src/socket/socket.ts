import { Server, Socket } from "socket.io";

/**
 * Socket IO
 */

// Generic type for payload
interface SocketEventPayloads {
  message: unknown;
  updateMessage: unknown;
  deleteMessage: unknown;
  starMessage: unknown;
  contactUser: unknown;
  updateContactUser: unknown;
  deleteContactUser: unknown;
  userStatus: string;
  user: unknown;
  updateUser: unknown;
  deleteUser: unknown;
  group: unknown;
  updateGroup: unknown;
  deleteGroup: unknown;
  exitGroup: unknown;
  addGroupMember: unknown;
  messageGroup: unknown;
  updateGroupMember: unknown;
  removeUserFromGroup: unknown;
  disappearGroupMessage: unknown;
  muteGroupMessage: unknown;
  starGroupMessage: unknown;
  updateGroupMessage: unknown;
  storyFeed: unknown;
}

type EventPayload<T extends keyof SocketEventPayloads> = SocketEventPayloads[T];

export async function SocketIO(io: Server) {
  io.on("connection", (socket: Socket) => {
    /**
     * Messages socket
     */
    socket.on("message", (ms: EventPayload<"message">) => {
      io.emit("message", ms);
    });

    socket.on("updateMessage", (ms: EventPayload<"updateMessage">) => {
      io.emit("updateMessage", ms);
    });

    socket.on("deleteMessage", (ms: EventPayload<"deleteMessage">) => {
      io.emit("deleteMessage", ms);
    });

    socket.on("starMessage", (ms: EventPayload<"starMessage">) => {
      io.emit("starMessage", ms);
    });

    /**
     * Contact users socket
     */
    socket.on("contactUser", (ms: EventPayload<"contactUser">) => {
      io.emit("contactUser", ms);
    });

    socket.on("updateContactUser", (ms: EventPayload<"updateContactUser">) => {
      io.emit("updateContactUser", ms);
    });

    socket.on("deleteContactUser", (ms: EventPayload<"deleteContactUser">) => {
      io.emit("deleteContactUser", ms);
    });

    /**
     * Users socket
     */
    socket.on("userStatus", (userId: EventPayload<"userStatus">) => {
      io.emit("userStatus", userId);
    });

    socket.on("user", (ms: EventPayload<"user">) => {
      io.emit("user", ms);
    });

    socket.on("updateUser", (ms: EventPayload<"updateUser">) => {
      io.emit("updateUser", ms);
    });

    socket.on("deleteUser", (ms: EventPayload<"deleteUser">) => {
      io.emit("deleteUser", ms);
    });

    /**
     * Group user socket
     */

    socket.on("group", (ms: EventPayload<"group">) => {
      io.emit("group", ms);
    });
    socket.on("updateGroup", (ms: EventPayload<"updateGroup">) => {
      io.emit("updateGroup", ms);
    });

    socket.on("deleteGroup", (ms: EventPayload<"deleteGroup">) => {
      io.emit("deleteGroup", ms);
    });

    socket.on("exitGroup", (ms: EventPayload<"exitGroup">) => {
      io.emit("exitGroup", ms);
    });
    socket.on("addGroupMember", (ms: EventPayload<"addGroupMember">) => {
      io.emit("addGroupMember", ms);
    });
    socket.on("messageGroup", (ms: EventPayload<"messageGroup">) => {
      io.emit("messageGroup", ms);
    });
    socket.on("updateGroupMember", (ms: EventPayload<"updateGroupMember">) => {
      io.emit("updateGroupMember", ms);
    });
    socket.on(
      "removeUserFromGroup",
      (ms: EventPayload<"removeUserFromGroup">) => {
        io.emit("removeUserFromGroup", ms);
      }
    );

    socket.on(
      "disappearGroupMessage",
      (ms: EventPayload<"disappearGroupMessage">) => {
        io.emit("disappearGroupMessage", ms);
      }
    );
    socket.on("muteGroupMessage", (ms: EventPayload<"muteGroupMessage">) => {
      io.emit("muteGroupMessage", ms);
    });
    socket.on("starGroupMessage", (ms: EventPayload<"starGroupMessage">) => {
      io.emit("starGroupMessage", ms);
    });
    socket.on(
      "updateGroupMessage",
      (ms: EventPayload<"updateGroupMessage">) => {
        io.emit("updateGroupMessage", ms);
      }
    );

    // create story feed
    socket.on("storyFeed", (ms: EventPayload<"storyFeed">) => {
      io.emit("storyFeed", ms);
    });

    // audio n=and video call
    socket.on("join-call", (roomId) => {
      socket.join(roomId);
      socket.broadcast.to(roomId).emit("user-joined", socket.id);
    });

    socket.on("signal", (data) => {
      io.to(data.to).emit("signal", data);
    });

    socket.on("disconnect", () => {
      io.emit("user-left", socket.id);
    });
  });
  return io;
}
