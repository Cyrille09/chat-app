import "dotenv/config";
import express, { NextFunction, Request, Response } from "express";
import debug from "debug";
import cors from "cors";
import { json } from "body-parser";
import { connect } from "mongoose";
import { createServer } from "http";
import { Server as SocketIOServer } from "socket.io";
import mainRoutes from "./routes/mainRoutes";
import usersRoutes from "./routes/usersRoutes";
import messagesRoutes from "./routes/messagesRoutes";
import userContactsRoutes from "./routes/userContactsRoutes";
import groupsRoutes from "./routes/groupRoutes";
import storyFeedsRoutes from "./routes/storyFeedRoutes";
import { SocketIO } from "../src/socket/socket";
import { DeletestoryFeedsCronJob, DisappearCronJob } from "./cronJob/cronJob";

const logger = debug("app:log");
const PORT = parseInt(`${process.env.PORT}`, 10) || 5007;
const app = express();

// Create an HTTP server
const server = createServer(app);
const io = new SocketIOServer(server, { cors: { origin: "*" } });

const mongooseConnection = async () => {
  try {
    await connect(`${process.env.MONGO_URL}`);
    logger("MongoDB is connected");
  } catch (error) {
    logger("MongooDB connection failed");
  }
};

app.use(cors());
app.use(json());

app.use("/", mainRoutes);
app.use("/api/users", usersRoutes);
app.use("/api/messages", messagesRoutes);
app.use("/api/userContacts", userContactsRoutes);
app.use("/api/groups", groupsRoutes);
app.use("/api/storyFeeds", storyFeedsRoutes);

// Middleware to serve static files.
app.use("/images", express.static("images"));
app.use("/documents", express.static("documents"));
app.use("/audio", express.static("audio"));

DisappearCronJob.start();
DeletestoryFeedsCronJob.start();

SocketIO(io);

app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  const errorMessage = err.message || "Something went wrong!";
  return res.status(err.status || 500).json({
    name: err.name,
    status: err.status,
    message: errorMessage,
    stack: err.stack,
  });
});

server.listen(PORT, () => {
  logger(`Server listening on ${process.env.host}:${PORT}`);
  mongooseConnection();
});
