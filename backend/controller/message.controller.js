import { Conversation } from "../models/conversation.model.js";
import { Message } from "../models/message.model.js";
import { getReceiverSocketId, io } from "../utils/socket.js";

export const sendMessage = async (req, res) => {
    try{
        const senderId = req.id;
        const receiverId = req.params.id;
        const { text } = req.body;

        if(!text){
            return res.status(400).json({
                message: "Message text is required",
                success: false
            });
        }

        let conversation = await Conversation.findOne({
            participants: { $all: [senderId, receiverId] }
        });

        if(!conversation){
            conversation = await Conversation.create({
                participants: [senderId, receiverId]
            });
        }

        const newMessage = await Message.create({
            conversationId: conversation._id,
            sender: senderId,
            text
        });

        // real-time emit
        const receiverSocketId = getReceiverSocketId(receiverId);
        if(receiverSocketId){
            io.to(receiverSocketId).emit("newMessage", newMessage);
        }

        return res.status(201).json({
            message: "Message sent",
            newMessage,
            success: true
        });

    }catch(error){
        console.log(error);
        return res.status(500).json({
            message: "Server error",
            success: false
        });
    }
}

export const getMessages = async (req, res) => {
    try{
        const userId = req.id;
        const otherUserId = req.params.id;

        const conversation = await Conversation.findOne({
            participants: { $all: [userId, otherUserId] }
        });

        if(!conversation){
            return res.status(200).json({
                messages: [],
                success: true
            });
        }

        const messages = await Message.find({
            conversationId: conversation._id
        }).sort({ createdAt: 1 });

        return res.status(200).json({
            messages,
            success: true
        });

    }catch(error){
        console.log(error);
        return res.status(500).json({
            message: "Server error",
            success: false
        });
    }
}

export const getConversations = async (req, res) => {
    try{
        const userId = req.id;

        const conversations = await Conversation.find({
            participants: userId
        }).populate({
            path: "participants",
            select: "fullname email profile.profilePhoto role"
        }).sort({ updatedAt: -1 });

        return res.status(200).json({
            conversations,
            success: true
        });

    }catch(error){
        console.log(error);
        return res.status(500).json({
            message: "Server error",
            success: false
        });
    }
}
// seen status

export const markAsSeen = async (req, res) => {
    try{
        const userId = req.id;
        const otherUserId = req.params.id;

        const conversation = await Conversation.findOne({
            participants: { $all: [userId, otherUserId] }
        });

        if(!conversation){
            return res.status(200).json({
                message: "No conversation found",
                success: true
            });
        }

        // sirf wo messages jo doosre user ne bheje the aur abhi unseen hain
        await Message.updateMany(
            { conversationId: conversation._id, sender: otherUserId, seen: false },
            { $set: { seen: true } }
        );

        const receiverSocketId = getReceiverSocketId(otherUserId);
        if(receiverSocketId){
            io.to(receiverSocketId).emit("messagesSeen", { conversationId: conversation._id, seenBy: userId });
        }

        return res.status(200).json({
            message: "Messages marked as seen",
            success: true
        });

    }catch(error){
        console.log(error);
        return res.status(500).json({
            message: "Server error",
            success: false
        });
    }
}

// deleting a message

export const deleteMessage = async (req, res) => {
    try{
        const userId = req.id;
        const { messageId } = req.params;

        const message = await Message.findById(messageId);

        if(!message){
            return res.status(404).json({
                message: "Message not found",
                success: false
            });
        }

        if(message.sender.toString() !== userId){
            return res.status(403).json({
                message: "You can only delete your own messages",
                success: false
            });
        }

        const conversation = await Conversation.findById(message.conversationId);
        const receiverId = conversation?.participants.find(
            (p) => p.toString() !== userId
        );

        await Message.findByIdAndDelete(messageId);

        if(receiverId){
            const receiverSocketId = getReceiverSocketId(receiverId.toString());
            if(receiverSocketId){
                io.to(receiverSocketId).emit("messageDeleted", messageId);
            }
        }

        return res.status(200).json({
            message: "Message deleted",
            success: true
        });

    }catch(error){
        console.log(error);
        return res.status(500).json({
            message: "Server error",
            success: false
        });
    }
}