import express from "express";
import isLogin from "../Midlewhere/isLogin.js";
import { upload } from "../Midlewhere/multer.js";
import { editProfile, follow, getAllNotification, getCurrentUser, getPofile, isReaded, searchUser, suggestedUsers } from "../Controlers/userControlers.js";

const userRouter = express.Router();

userRouter.get("/current",isLogin,getCurrentUser);
userRouter.get("/suggested" , suggestedUsers);
userRouter.get("/getprofile/:userName",getPofile);
userRouter.post("/editprofile",isLogin,upload.single("profileImage"), editProfile);
userRouter.get("/follow/:targetUserId",isLogin, follow);
userRouter.get("/search", isLogin , searchUser);
userRouter.get("/notifications", isLogin , getAllNotification);
userRouter.post("/isReaded", isLogin , isReaded);

export default userRouter;