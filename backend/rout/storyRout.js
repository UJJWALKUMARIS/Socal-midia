import express from "express";
import  islogin  from "../Midlewhere/isLogin.js";
import { upload } from "../Midlewhere/multer.js";
import User from "../Module/userModle.js";
import Story from "../Module/soryModle.js"
import { deleteStory, getStoryByUserName, uplodStory, viewsStory } from "../Controlers/storyControlers.js";


const storyRouter = express.Router();

storyRouter.post("/upload", islogin,upload.single("midia"),uplodStory);
storyRouter.get("/getstroybyusername/:userName",islogin,getStoryByUserName);
storyRouter.get("/view/:storyId",islogin , viewsStory); 
storyRouter.get("/getall",islogin , async (req, res) => {
    try {
        const currentUser = await User.findById(req.userId).populate("following");
        const followingUserIds = currentUser.following;


        const story = await Story.find({
            author: { $in: followingUserIds }
        }).populate("author", "name userName profilePic")
          .sort({ createdAt: -1 });


          res.status(200).json({ story });

          
    } catch (error) {
        return res.status(500).json({ message: `Get All Following Story error: ${error}` });
    }
});
storyRouter.delete("/delete/:storyId",islogin,deleteStory )



export default storyRouter;