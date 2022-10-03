/*********************************
 * Chat model will contain:
 * 1. chat name: Name of chat initiator
 * 2. isGroupChat: true/false
 * 3. users
 * 4. latestMessage
 * 5. groupAdmin
 */

const mongoose = require("mongoose");

const chatModel = mongoose.Schema(
  {
    chatName: { type: String, required: true, trim: true },
    isGroupChat: { type: Boolean, default: false },
    users: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    latestMessage: { type: mongoose.Schema.Types.ObjectId, ref: "Message" },
    groupAdmin: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

chatModel.index({ createdAt: 1 });
chatModel.index({ updatedAt: 1 });

const Chat = mongoose.model("Chat", chatModel);

module.exports = Chat;
