import mongoose from "mongoose";

// ✅ NEW: sub-schema for a single reaction
// Each entry = one user reacted with one emoji
const reactionSchema = new mongoose.Schema(
  {
    emoji: {
      type: String,
      required: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { _id: false } // no separate _id needed on each reaction sub-doc
);

const messageSchema = new mongoose.Schema(
  {
    senderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    receiverId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    text: {
      type: String,
      trim: true,
      maxlength: 2000,
    },
    image: {
      type: String,
    },

    // Feature 2: read receipts
    isRead: {
      type: Boolean,
      default: false,
    },

    // ✅ NEW Feature 3: emoji reactions
    // Array of { emoji, userId } — one entry per user per message
    // Toggle logic (add/remove/replace) handled in controller
    reactions: {
      type: [reactionSchema],
      default: [],
    },
  },
  { timestamps: true }
);

// Index for read receipt queries (Feature 2)
messageSchema.index({ senderId: 1, receiverId: 1, isRead: 1 });

const Message = mongoose.model("Message", messageSchema);
export default Message;