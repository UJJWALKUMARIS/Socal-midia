import express from "express";
import islogin from "../Midlewhere/isLogin.js";
import { upload } from "../Midlewhere/multer.js";
import { comments, deleteComment, deleteLoop, getAllLoop, like, uplodLoop } from "../Controlers/loopControlers.js";


const loopRouter = express.Router();

loopRouter.post("/upload", islogin,upload.single("midia"),uplodLoop);
loopRouter.get("/getall",islogin, getAllLoop);
loopRouter.get("/likes/:loopId",islogin , like);
loopRouter.post("/comments/:loopId",islogin, comments);
loopRouter.delete("/delete/:conmetId",islogin,deleteComment);
loopRouter.delete("/delete/:loopId",islogin, deleteLoop);

export default loopRouter;