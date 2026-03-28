import Message from "../models/message.model.js";
import User from "../models/user.model.js";
import cloudinary from "../lib/cloudinary.js";
import { getReceiverSocketId, io } from "../lib/socket.js";

export const getAllContacts = async (req, res) => {
  try {
    const loggedInUser = req.user._id;
    const filteredUsers = await User.find({
      _id: { $ne: loggedInUser },
    }).select("-password");
    res.status(200).json(filteredUsers);
  } catch (error) {
    console.error("[getAllContacts]", error);
    res.status(500).json({ message: "Internal Server error" });
  }
};

export const getMessagesByUserId = async (req, res) => {
  try {
    const myId = req.user._id;
    const { id: userToChatId } = req.params;
    const messages = await Message.find({
      $or: [
        { senderId: myId, receiverId: userToChatId },
        { senderId: userToChatId, receiverId: myId },
      ],
    }).sort({ createdAt: 1 });

    res.status(200).json(messages);
  } catch (error) {
    console.error("[getMessagesByUserId]", error);
    res.status(500).json({ message: "Internal Server error" });
  }
};

export const sendMessage = async (req, res) => {
  try {
    const { text, image } = req.body;
    const { id: receiverId } = req.params;
    const senderId = req.user._id;

    if (!text && !image) {
      return res.status(400).json({ message: "Text or image is required." });
    }
    if (senderId.equals(receiverId)) {
      return res
        .status(400)
        .json({ message: "Cannot send messages to yourself." });
    }
    const receiverExists = await User.exists({ _id: receiverId });
    if (!receiverExists) {
      return res.status(404).json({ message: "Receiver not found." });
    }

    let imageUrl;
    if (image) {
      const uploadResponse = await cloudinary.uploader.upload(image);
      imageUrl = uploadResponse.secure_url;
    }

    const newMessage = new Message({
      senderId,
      receiverId,
      text,
      image: imageUrl,
    });
    await newMessage.save();

    const receiverSocketId = getReceiverSocketId(receiverId.toString());
    if (receiverSocketId) {
      io.to(receiverSocketId).emit("newMessage", newMessage.toObject());
    }

    res.status(201).json(newMessage);
  } catch (error) {
    console.error("[sendMessage]", error);
    res.status(500).json({ message: "Internal Server error" });
  }
};

export const markMessagesAsRead = async (req, res) => {
  try {
    const myId = req.user._id;
    const { senderId } = req.params;

    await Message.updateMany(
      { senderId, receiverId: myId, isRead: false },
      { $set: { isRead: true } },
    );

    const updatedMessages = await Message.find(
      { senderId, receiverId: myId, isRead: true },
      { _id: 1 },
    );

    const updatedIds = updatedMessages.map((m) => m._id.toString());

    const senderSocketId = getReceiverSocketId(senderId.toString());
    if (senderSocketId) {
      io.to(senderSocketId).emit("messagesRead", {
        readBy: myId.toString(),
        messageIds: updatedIds,
      });
    }

    res.status(200).json({ success: true, updatedCount: updatedIds.length });
  } catch (error) {
    console.error("[markMessagesAsRead]", error);
    res.status(500).json({ message: "Internal Server error" });
  }
};

export const reactToMessage = async (req, res) => {
  try {
    const { id: messageId } = req.params;
    const { emoji } = req.body;
    const userId = req.user._id;

    if (!emoji) {
      return res.status(400).json({ message: "Emoji is required." });
    }

    const message = await Message.findById(messageId);
    if (!message) {
      return res.status(404).json({ message: "Message not found." });
    }

    const isSender = message.senderId.toString() === userId.toString();
    const isReceiver = message.receiverId.toString() === userId.toString();
    if (!isSender && !isReceiver) {
      return res
        .status(403)
        .json({ message: "Not allowed to react to this message." });
    }

    const existingIndex = message.reactions.findIndex(
      (r) => r.userId.toString() === userId.toString(),
    );

    if (existingIndex !== -1) {
      if (message.reactions[existingIndex].emoji === emoji) {
        message.reactions.splice(existingIndex, 1);
      } else {
        message.reactions[existingIndex].emoji = emoji;
      }
    } else {
      message.reactions.push({ emoji, userId });
    }

    await message.save();

    const updatedReactions = message.reactions.map((r) => ({
      emoji: r.emoji,
      userId: r.userId.toString(),
    }));

    const payload = {
      messageId: messageId.toString(),
      reactions: updatedReactions,
    };

    const otherUserId = isSender
      ? message.receiverId.toString()
      : message.senderId.toString();

    const otherSocketId = getReceiverSocketId(otherUserId);
    if (otherSocketId) io.to(otherSocketId).emit("messageReaction", payload);

    const mySocketId = getReceiverSocketId(userId.toString());
    if (mySocketId) io.to(mySocketId).emit("messageReaction", payload);

    res.status(200).json(message);
  } catch (error) {
    console.error("[reactToMessage]", error);
    res.status(500).json({ message: "Internal Server error" });
  }
};

export const getChatPartners = async (req, res) => {
  try {
    const loggedInUser = req.user._id;
    const messages = await Message.find({
      $or: [{ senderId: loggedInUser }, { receiverId: loggedInUser }],
    });

    const chatPartnersId = [
      ...new Set(
        messages.map((msg) =>
          msg.senderId.toString() === loggedInUser.toString()
            ? msg.receiverId.toString()
            : msg.senderId.toString(),
        ),
      ),
    ];

    const chatPartners = await User.find({
      _id: { $in: chatPartnersId },
    }).select("-password");

    res.status(200).json(chatPartners);
  } catch (error) {
    console.error("[getChatPartners]", error);
    res.status(500).json({ message: "Internal Server error" });
  }
};
