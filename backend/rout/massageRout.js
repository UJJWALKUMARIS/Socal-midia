import express from "express";
import islogin from "../Midlewhere/isLogin.js";
import { deletedMessage, getMassage, getPrevUserChat, sendMassage } from "../Controlers/massageControlers.js";
import {upload} from "../Midlewhere/multer.js";

const messageRouter = express.Router();

messageRouter.post("/send/:receiverId", islogin,upload.single("image"),sendMassage);
messageRouter.get("/get/:receiverId", islogin,getMassage);
messageRouter.get("/getprevchat", islogin,getPrevUserChat);
messageRouter.delete("/delete/:massageId",islogin,deletedMessage);

export default messageRouter;