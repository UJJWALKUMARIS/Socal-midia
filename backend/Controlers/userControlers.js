import Notification from "../Module/notificationModle.js";
import User from "../Module/userModle.js";
import uplodOnCloudnery from "../confige/cloudnery.js";
import { io , getSocketId } from "../socket.js";

export const getCurrentUser = async (req, res) => {
  try {
    const userId = req.userId; 

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized: No user ID provided" });
    }

    const user = await User.findById(userId).populate("story");
    
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.status(200).json(user);
  } catch (error) {
    return res.status(500).json({ message: `Server error, try again later.${error}` });
  }
};


export const suggestedUsers = async (req, res) => {
  try {

    const users = await User.find({ _id: { $ne: req.userId } })
      .select("-password -resetOtp -expireOtp");

    return res.status(200).json(users);
  } catch (error) {
    console.error("Suggested Users Error:", error);
    return res.status(500).json({ message: "Server error fetching users" });
  }
};

export const editProfile = async (req, res) => {
  try {
    const { name, bio, profacation } = req.body;
    const user = await User.findById(req.userId); // ✅ Fixed here

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    let profilePic = user.profilePic; // keep old image if not updated
    if (req.file) {
      const uploadResult = await uplodOnCloudnery(req.file.path);
      profilePic = uploadResult; // ✅ use cloudinary URL
    }

    user.name = name;
    user.bio = bio;
    user.profacation = profacation;
    user.profilePic = profilePic;

    await user.save();

    return res.status(200).json(user);
  } catch (error) {
    console.error("edit profile error:", error);
    return res.status(500).json({ message: `edit profile error: ${error.message}` });
  }
};

export const getPofile = async (req,res) =>{
  try {
    const userName = req.params.userName;
    const user = await User.findOne({userName});

    if (!user){
      return res.status(400).json({messsage:"User not found"})
    }

    return res.status(200).json(user);
  } catch (error) {
    return res.status(500).json({ message: `get profile error:- ${error}` });
  }
}


export const follow = async (req, res) => {
  try {
    const currentUserId = req.userId;
    const targetUserId = req.params.targetUserId;

    if (!targetUserId) {
      return res.status(400).json({ message: "Target User not found" });
    }

    if (currentUserId === targetUserId) {
      return res.status(400).json({ message: "You can't follow yourself" });
    }

    const currentUser = await User.findById(currentUserId);
    const targetUser = await User.findById(targetUserId);

    if (!currentUser || !targetUser) {
      return res.status(404).json({ message: "User not found" });
    }

    const isFollowing = currentUser.following.includes(targetUserId);

    if (isFollowing) {
      // Unfollow logic
      currentUser.following = currentUser.following.filter(
        id => id.toString() !== targetUserId
      );
      targetUser.flowers = targetUser.flowers.filter(
        id => id.toString() !== currentUserId
      );

      await currentUser.save();
      await targetUser.save();

      // Real-time notification to target user
      const targetSocketId = getSocketId(targetUserId);
      if (targetSocketId) {
        io.to(targetSocketId).emit('followerUpdate', {
          type: 'unfollow',
          userId: currentUserId,
          userName: currentUser.name || currentUser.username,
          userAvatar: currentUser.avatar,
          followerCount: targetUser.flowers.length
        });
      }

      return res
        .status(200)
        .json({ following: false, message: "You have unfollowed successfully" });
    } else {
      // Follow logic
      currentUser.following.push(targetUserId);
      targetUser.flowers.push(currentUserId);

      if (currentUser !== targetUserId) {
        const notification = await Notification.create({
          sender: currentUserId,
          reciver: targetUserId,
          type: "follow",
          message: "started following you",
        });
        const populatedNotification = await Notification.findById(notification._id).populate("sender reciver");
        const reciverSocketId = getSocketId(targetUserId);
        if (reciverSocketId) {
          io.to(reciverSocketId).emit("newNotification", populatedNotification);
        } else {
          console.log("reciver socket ID not found");
        }
      } else {
        console.log("You can't follow yourself")
      }

      await currentUser.save();
      await targetUser.save();

      // Real-time notification to target user
      const targetSocketId = getSocketId(targetUserId);
      if (targetSocketId) {
        io.to(targetSocketId).emit('followerUpdate', {
          type: 'follow',
          userId: currentUserId,
          userName: currentUser.name || currentUser.username,
          userAvatar: currentUser.avatar,
          followerCount: targetUser.flowers.length
        });
      }

      return res
        .status(200)
        .json({ following: true, message: "You have followed successfully" });
    }
  } catch (error) {
    console.error("Follow error:", error);
    return res.status(500).json({ message: `Follow error: ${error.message}` });
  }
};

export const searchUser = async (req, res) => {
  try {
    const { keyWord } = req.query;
    const currentUserId = req.userId;

    // ❌ Empty search protection
    if (!keyWord) {
      return res.status(200).json({ users: [] });
    }

    const users = await User.find({
      _id: { $ne: currentUserId }, // exclude self
      $or: [
        { userName: { $regex: keyWord, $options: "i" } },
        { name: { $regex: keyWord, $options: "i" } }
      ]
    })
      .select("-password -email")
      .limit(10) // ✅ limit results
      .lean();   // ✅ faster response

    return res.status(200).json({ users });

  } catch (error) {
    console.error("Search user error:", error);
    return res.status(500).json({
      message: "Something went wrong while searching users"
    });
  }
};

export const getAllNotification = async (req, res) => {
  try {
    const userId = req.userId;
    const notifications = await Notification.find({ reciver: userId })
      .populate("sender reciver post loop")
      .sort({ createdAt: -1 });

    return res.status(200).json(notifications);
  } catch (error) {
    console.error("Error fetching notifications:", error);
    return res.status(500).json({ message: `Error fetching notifications${error.message}` });
  }
};

export const isReaded = async (req, res) => {
  try {
    const { notificationId } = req.body;

    if(Array.isArray(notificationId)){
      await Notification.updateMany(
        { _id: { $in: notificationId }, reciver: req.userId },
        { $set: { isRead: true } }
      );
    }
    else{
      await Notification.findOneAndUpdate(
        {_id: {$in: notificationId}, reciver: req.userId},
        {$set: {isRead: true}}
      )
    }

    return res.status(200).json({message:"Notification marked as read"});
  } catch (error) {
    console.error("Error updating notification:", error);
    return res.status(500).json({ message: `Error updating notification${error.message}` });
  }
};