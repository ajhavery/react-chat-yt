/*********************************
 * Message model will contain 3 things:
 * 1. sender: name or id of the sender
 * 2. content:  content of the message
 * 3. chatId: reference of the chat it belongs to
 */

const mongoose = require("mongoose");

const messageModel = mongoose.Schema(
  {
    sender: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    content: { type: String, trim: true },
    chat: { type: mongoose.Schema.Types.ObjectId, ref: "Chat" },
  },
  { timestamps: true }
);

const Message = mongoose.model("Message", messageModel);

module.exports = Message;
