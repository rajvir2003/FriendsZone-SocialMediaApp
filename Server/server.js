import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import helmet from "helmet";
import morgan from "morgan";
import { connectDB } from "./config/db.js";
import authRouter from "./routes/auth.route.js";
import userRouter from "./routes/user.route.js";
import postRouter from "./routes/post.route.js";
import commentRouter from "./routes/comment.route.js";
import chatRouter from "./routes/chat.route.js";
import messageRouter from "./routes/message.route.js";
import notificationRouter from "./routes/notification.route.js";
import http from "http";
import initializeSocket from "./socket.js";

const app = express();
const port = 8000;
dotenv.config();

connectDB();

// create HTTP server
const server = http.createServer(app);
initializeSocket(server); // initialize socket.io

// middlewares
app.use(express.json());
app.use(cors());
app.use(helmet());
app.use(morgan("common"));
app.use("/uploads", express.static("uploads"));

// api endpoints
app.use("/api/auth", authRouter);
app.use("/api/users", userRouter);
app.use("/api/posts", postRouter);
app.use("/api/comments", commentRouter);
app.use("/api/chats", chatRouter);
app.use("/api/messages", messageRouter);
app.use("/api/notifications", notificationRouter);

server.listen(port, () => {
  console.log(`Listening on port ${port}...`);
});