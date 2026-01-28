import User from "../Module/userModle.js";
import Story from "../Module/soryModle.js";
import uplodOnCloudnery from "../confige/cloudnery.js";

export const uplodStory = async (req, res) => {
    try {
        const user = await User.findById(req.userId);
        if (user.story) {
            await Story.findByIdAndDelete(user.story);
            user.story = null;
        }
        const { caption } = req.body;
        const { midiaType } = req.body;
        let midia;
        if (req.file) {
            midia = await uplodOnCloudnery(req.file.path);
        } else {
            return res.status(401).json({ message: "Please upload a file" });
        }
        const story = await Story.create({
            caption,
            author: req.userId
            , midiaType,
             midia
        });

        user.story = story._id;
        await user.save();
        const populateStory = await Story.findById(story._id).populate("author", "name userName profilePic").populate("views", "name userName profilePic");
        return res.status(200).json(populateStory);
    } catch (error) {
        return res.status(500).json({ message: `Upload Story error: ${error}` });
    }
};

export const viewsStory = async (req, res) => {
    try {
        const user = await User.findById(req.userId);
        if (!user) {
            return res.status(401).json({ message: "Unauthorized. Please login." });
        }

        const storyId = req.params.storyId;
        const story = await Story.findById(storyId);

        if (!story) {
            return res.status(404).json({ message: "Story not found" });
        }

        // Check if user hasn't viewed yet
        const hasViewed = story.views.some(id => id.toString() === req.userId.toString());

        if (!hasViewed) {
            story.views.push(req.userId);
            await story.save();
        }

        // Populate on the existing story object instead of a new query
        await story.populate("author", "name userName profilePic");
        await story.populate("views", "name userName profilePic");

        return res.status(200).json(story);
    } catch (error) {
        return res.status(500).json({ message: `View Story error: ${error.message}` });
    }
};

export const getStoryByUserName = async (req, res) => {
    try {
        const userName = req.params.userName;
        const user = await User.findOne({ userName });
        if (!user) {
            return res.status(400).json({ message: "User not found" });
        }

        const story = await Story.find({ author: user._id })
            .sort({ createdAt: -1 })
            .populate("author views");

        if (!story) {
            return res.status(404).json({ message: "No story found" });
        }

        return res.status(200).json(story);
    } catch (error) {
        return res.status(500).json({ message: `Get Story error: ${error}` });
    }
};

export const getAllFolowingStory = async (req, res) => {
    try {
        const user = await User.findById(req.userId);
        const folowingIds = user.following;
        const storyes = await Story.find({}).populate("author views");
        const folowingstoryes = storyes.filter(story => folowingIds.includes(story.author._id));
        return res.status(200).json(folowingstoryes);
    } catch (error) {
        return res.status(500).json({ message: `Get All Following Story error: ${error}` });
    }
};

export const deleteStory = async (req, res) => {
    try {
        const storyId = req.params.storyId;
        const story = await Story.findById(storyId);

        if (!story) {
            return res.status(404).json({ message: "Story not found" });
        }

        if (story.author.toString() !== req.userId) {
            return res.status(401).json({ message: "Unauthorized. You can only delete your own story." });
        }

        await Story.findByIdAndDelete(storyId);

        return res.status(200).json({ message: "Story deleted successfully" });
    } catch (error) {
        return res.status(500).json({ message: `Delete Story error: ${error}` });
    }
};