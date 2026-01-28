import express from "express";
import dotenv from "dotenv";
import connectDB from "./confige/DB.js";
import cookieParser from "cookie-parser";
import cors from "cors";
import authRouter from "./rout/authRout.js";
import userRouter from "./rout/userRout.js";
import storyRouter from "./rout/storyRout.js";
import postRouter from "./rout/postRout.js";
import loopRouter from "./rout/loopRout.js";
import messageRouter from "./rout/massageRout.js";
import { app, server } from "./socket.js";

dotenv.config();

app.use(express.json());
app.use(cookieParser());

app.use(cors({
  origin: "http://localhost:5173",
  credentials: true
}));

app.use("/api/auth", authRouter);
app.use("/api/user", userRouter);
app.use("/api/story", storyRouter);
app.use("/api/post", postRouter);
app.use("/api/loop", loopRouter);
app.use("/api/massage", messageRouter);

const port = process.env.PORT || 3000;

server.listen(port, () => {
  connectDB();
  console.log(`Server running on port ${port}`);
});