/**
 * Socket IO
 */
export async function SocketIO(io: any) {
  io.on("connection", (socket: any) => {
    /**
     * Messages socket
     */
    socket.on("message", (ms: any) => {
      io.emit("message", ms);
    });

    socket.on("updateMessage", (ms: any) => {
      io.emit("updateMessage", ms);
    });

    socket.on("deleteMessage", (ms: any) => {
      io.emit("deleteMessage", ms);
    });

    /**
     * Contact users socket
     */
    socket.on("contactUser", (ms: any) => {
      io.emit("contactUser", ms);
    });

    socket.on("updateContactUser", (ms: any) => {
      io.emit("updateContactUser", ms);
    });

    socket.on("deleteContactUser", (ms: any) => {
      io.emit("deleteContactUser", ms);
    });

    /**
     * Users socket
     */
    socket.on("userStatus", (userId: string) => {
      io.emit("userStatus", userId);
    });

    socket.on("user", (ms: any) => {
      io.emit("user", ms);
    });

    socket.on("updateUser", (ms: any) => {
      io.emit("updateUser", ms);
    });

    socket.on("deleteUser", (ms: any) => {
      io.emit("deleteUser", ms);
    });

    /**
     * Group user socket
     */

    socket.on("group", (ms: any) => {
      io.emit("group", ms);
    });
    socket.on("updateGroup", (ms: any) => {
      io.emit("updateGroup", ms);
    });

    socket.on("deleteGroup", (ms: any) => {
      io.emit("deleteGroup", ms);
    });

    socket.on("exitGroup", (ms: any) => {
      io.emit("exitGroup", ms);
    });
    socket.on("addGroupMember", (ms: any) => {
      io.emit("addGroupMember", ms);
    });
    socket.on("messageGroup", (ms: any) => {
      io.emit("messageGroup", ms);
    });
  });
  return io;
}