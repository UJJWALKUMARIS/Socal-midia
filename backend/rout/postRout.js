import express from "express";
import islogin from "../Midlewhere/isLogin.js";
import { upload } from "../Midlewhere/multer.js";
import { comments, deleteComment,  deletePost,  getAllPost, like, saved, uplodPost } from "../Controlers/postControlers.js";
import Post from "../Module/postModle.js";


const postRouter = express.Router();

postRouter.post("/upload", islogin,upload.single("midia"),uplodPost);
postRouter.get("/getall",islogin, getAllPost);
postRouter.get("/likes/:postId",islogin , like);
postRouter.get("/saved/:postId",islogin , saved);
postRouter.post("/comments/:postId",islogin, comments);
postRouter.delete("/delete/:conmetId",islogin,deleteComment);
postRouter.delete("/delete/:postId",islogin, deletePost);
postRouter.get("/debug/:postId", async (req, res) => {
    const post = await Post.findByIdAndDelete(req.params.postId);
    res.json(post);
});



export default postRouter;