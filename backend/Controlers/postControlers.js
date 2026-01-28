import User from "../Module/userModle.js";
import Post from "../Module/postModle.js";
import uplodOnCloudnery from "../confige/cloudnery.js";
import { getSocketId, io } from "../socket.js";
import Notification from "../Module/notificationModle.js";


export const uplodPost = async (req, res) => {
    try {
        const { caption, midiaType } = req.body;
        if (!req.file) return res.status(400).json({ message: "midia is required" });
        const midia = await uplodOnCloudnery(req.file.path);
        const post = await Post.create({ caption, midia, midiaType, author: req.userId });
        const user = await User.findById(req.userId);
        user.posts.push(post._id);
        await user.save();
        const populatePost = await Post.findById(post._id).populate([
            { path: "author", select: "name userName profilePic" }
        ]);
        return res.status(201).json(populatePost);
    } catch (error) {
        return res.status(500).json({ message: `Upload Post error ${error}` });
    }
};

export const getAllPost = async (req, res) => {
    try {
        const post = await Post.find({}).populate("author", "name userName profilePic").populate("comments.user", "name userName profilePic");
        return res.status(200).json(post);
    } catch (error) {
        return res.status(500).json({ message: `Get all post error ${error}` });
    }
};

export const like = async (req, res) => {
    try {
        const postId = req.params.postId;
        const post = await Post.findById(postId);
        if (!post) return res.status(400).json({ message: 'Post not found or already deleted' });
        const alreadyLike = post.likes.includes(req.userId);
        if (alreadyLike) {
            post.likes = post.likes.filter(id => id.toString() !== req.userId.toString());
        } else {
            post.likes.push(req.userId);
            if (post.author._id != req.userId) {
                const notification = await Notification.create({
                    sender: req.userId,
                    reciver: post.author._id,
                    type: "like",
                    message: "liked your post",
                    post: post._id
                });
            const populatedNotification = await Notification.findById(notification._id).populate("sender reciver post");
            const reciverSocketId = getSocketId(post.author._id);
            if (reciverSocketId) {
                io.to(reciverSocketId).emit("newNotification", populatedNotification);
            }
            }
        }

        await post.save();
        await post.populate("author", "name userName profilePic");
        io.emit("likePost", { 
            postId:post._id,
            likes:post.likes
        });
        return res.status(200).json(post);
    } catch (error) {
        return res.status(500).json({ message: `Like error: ${error}` });
    }
};

export const comments = async (req, res) => {
    try {
        const { message } = req.body;
        const { postId } = req.params;

        const post = await Post.findById(postId);
        if (!post)
            return res.status(400).json({ message: "Post not found or already deleted" });

        // ✅ Push new comment
        post.comments.push({ user: req.userId, text: message });

        if (post.author._id != req.userId) {
            const notification = await Notification.create({
                sender: req.userId,
                reciver: post.author._id,
                type: "comment",
                message: "commented on your post",
                post: post._id
            });
            const populatedNotification = await Notification.findById(notification._id).populate("sender reciver post");
            const reciverSocketId = getSocketId(post.author._id);
            if (reciverSocketId) {
                io.to(reciverSocketId).emit("newNotification", populatedNotification);
            }
        }
        await post.save();

        // ✅ Populate user info for comments
        await post.populate([
            { path: "author", select: "name userName profilePic" },
            { path: "comments.user", select: "name userName profilePic" },
        ]);

        io.emit("commentPost", { 
            postId:post._id,
            comments:post.comments,
        });

        return res.status(200).json(post);
    } catch (error) {
        console.error("Comment error:", error);
        return res.status(500).json({ message: `Comment error: ${error.message}` });
    }
};


export const saved = async (req, res) => {
    try {
        const postId = req.params.postId;
        const user = await User.findById(req.userId);

        const alreadySaved = user.saved.includes(postId);

        if (alreadySaved) {
            user.saved = user.saved.filter(id => id.toString() !== postId.toString());
        } else {
            user.saved.push(postId);
        }

        await user.save();

        // Fetch all saved posts with populated author and comments
        const savedPosts = await Post.find({ _id: { $in: user.saved } })
            .populate("author", "name userName profilePic")
            .populate("comments.user", "name userName profilePic");

        return res.status(200).json(savedPosts);
    } catch (error) {
        return res.status(500).json({ message: `Saved post error: ${error}` });
    }
};

export const deleteComment = async (req, res) => {
    try {
        const { postId, commentId } = req.params;

        const post = await Post.findById(postId);
        if (!post) {
            return res.status(404).json({ message: "Post not found" });
        }

        // Find the comment index
        const commentIndex = post.comments.findIndex(comment => comment._id.toString() === commentId);
        if (commentIndex === -1) {
            return res.status(404).json({ message: "Comment not found" });
        }

        // Check if the user is the author of the comment
        if (post.comments[commentIndex].user.toString() !== req.userId) {
            return res.status(403).json({ message: "You are not authorized to delete this comment" });
        }

        // Remove the comment
        post.comments.splice(commentIndex, 1);
        await post.save();

        // Populate the post with author and comments.user details
        await post.populate([
            { path: "author", select: "name userName profilePic" },
            { path: "comments.user", select: "name userName profile" },
            { path: "comments.replies.user", select: "name userName profilePic" }
        ]);

        return res.status(200).json(post);
    } catch (error) {
        console.error("Delete comment error:", error);
        return res.status(500).json({ message: `Delete comment error: ${error.message}` });
    }
};

export const deletePost = async (req, res) => {
    try {
        const { postId } = req.params;

        // Validate ObjectId
        if (!postId.match(/^[0-9a-fA-F]{24}$/)) {
            return res.status(400).json({
                success: false,
                message: "Invalid post ID format",
            });
        }

        const post = await Post.findByIdAndDelete(postId);

        return res.status(200).json({
            success: true,
            message: "Post deleted successfully",
        });

    } catch (error) {
        console.error("Delete post error:", error);
        return res.status(500).json({
            success: false,
            message: `Server error while deleting post${error}`,
        });
    }
};