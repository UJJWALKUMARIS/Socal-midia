import uplodOnCloudnery from "../confige/cloudnery.js";
import Conversation from "../Module/ConversationModle.js";
import Massage from "../Module/massageModle.js";
import { getSocketId, io } from "../socket.js";

export const sendMassage = async (req, res) => {
    try {
        const senderId = req.userId;
        const receiverId = req.params.receiverId;
        const { message } = req.body;

        let image = null;
        if (req.file) {
            image = await uplodOnCloudnery(req.file.path);
        }

        const newMassage = await Massage.create({
            sender: senderId,
            receiver: receiverId,
            massage: message,
            image
        });

        let conversation = await Conversation.findOne({
            participants: { $all: [senderId, receiverId] }
        });

        if (!conversation) {
            conversation = await Conversation.create({
                participants: [senderId, receiverId],
                massages: [newMassage._id]
            });
        } else {
            conversation.massages.push(newMassage._id);
            await conversation.save();
        }

        // FIXED: Use reciverSocketId instead of receiverId for socket emission
        const reciverSocketId = getSocketId(receiverId);
        if (reciverSocketId) {
            io.to(reciverSocketId).emit("newMassage", newMassage);
        }

        return res.status(201).json(newMassage);

    } catch (error) {
        return res.status(500).json({
            message: "Send message error",
            error: error.message
        });
    }
};


export const getMassage = async (req, res) => {
    try {
        const senderId = req.userId;
        const receiverId = req.params.receiverId;
        const conversation = await Conversation.findOne({
            participants: { $all: [senderId, receiverId] }
        }).populate("massages");

        return res.status(200).json(conversation?.massages);

    } catch (error) {
        return res.status(500).json({ massage: `get Message error ${error}` });
    }
}

export const getPrevUserChat = async (req, res) => {
    try {
        const currentUserId = req.userId;
        const conversation = await Conversation.find({
            participants: currentUserId
        }).populate("participants").sort({ updatedAt: -1 });

        const userMap = {}
        conversation.forEach(conv => {
            conv.participants.forEach(c => {
                if (c._id.toString() !== currentUserId) {
                    userMap[c._id] = c;
                }
            });
        });

        const previousUser = Object.values(userMap);

        return res.status(200).json(previousUser);
    } catch (error) {
        return res.status(500).json({ massage: `get previous user error ${error}` });
    }
}

export const deletedMessage = async (req, res) => {
  try {
    const massageId = req.params.massageId;
    const userId = req.userId;

    // Find the message to get receiver ID
    const massage = await Massage.findById(massageId);
    
    if (!massage) {
      return res.status(404).json({ message: "Message not found" });
    }

    // Optional: Check if user is the sender before allowing delete
    if (massage.sender.toString() !== userId) {
      return res.status(403).json({ message: "Unauthorized to delete this message" });
    }

    const receiverId = massage.receiver;
    const senderId = massage.sender;

    // Delete the message
    await Massage.findByIdAndDelete(massageId);

    // Find the conversation and remove the message from it
    const conversation = await Conversation.findOne({
      participants: { $all: [senderId, receiverId] }
    });

    if (conversation) {
      // Remove the message ID from the conversation's messages array
      conversation.massages = conversation.massages.filter(
        msgId => msgId.toString() !== massageId
      );

      // Check if there are no messages left
      if (conversation.massages.length === 0) {
        // Delete the conversation
        await Conversation.findByIdAndDelete(conversation._id);

        // Notify both users that the conversation was deleted
        const receiverSocketId = getSocketId(receiverId);
        const senderSocketId = getSocketId(senderId);

        if (receiverSocketId) {
          io.to(receiverSocketId).emit("conversationDeleted", {
            conversationId: conversation._id,
            otherUserId: senderId
          });
        }

        if (senderSocketId) {
          io.to(senderSocketId).emit("conversationDeleted", {
            conversationId: conversation._id,
            otherUserId: receiverId
          });
        }

        return res.status(200).json({ 
          message: "Message and conversation deleted successfully",
          deletedMessageId: massageId,
          conversationDeleted: true
        });
      } else {
        // Save the updated conversation
        await conversation.save();

        // Notify both users about the deleted message
        const receiverSocketId = getSocketId(receiverId);
        const senderSocketId = getSocketId(senderId);

        if (receiverSocketId) {
          io.to(receiverSocketId).emit("messageDeleted", massageId);
        }

        if (senderSocketId) {
          io.to(senderSocketId).emit("messageDeleted", massageId);
        }

        return res.status(200).json({ 
          message: "Message deleted successfully",
          deletedMessageId: massageId,
          conversationDeleted: false
        });
      }
    }

    return res.status(200).json({ 
      message: "Message deleted successfully",
      deletedMessageId: massageId 
    });

  } catch (error) {
    return res.status(500).json({ 
      message: `Message delete error: ${error.message}` 
    });
  }
};