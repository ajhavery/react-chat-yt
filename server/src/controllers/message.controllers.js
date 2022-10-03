const asyncHandler = require("express-async-handler");
const tokenUtils = require("../../utils/token-utils");
const Chat = require("../models/chat.models");
const Message = require("../models/message.models");
const User = require("../models/user.models");

// 1. send message to a chatId
const sendMessage = asyncHandler(async (req, res) => {
  const { content, chatId } = req.body;

  if (!content || !chatId) {
    console.log("Invalid data received");
    return res.sendStatus(400);
  }

  var newMessage = {
    sender: req.user._id,
    content: content,
    chat: chatId,
  };

  try {
    var message = await Message.create(newMessage);
    // populate sender and message
    // as we are populating an instance of mongoose, we add execPopulate
    message = await message.populate("sender", "name avatar");
    message = await message.populate("chat");
    // populate users inside the chatId
    message = await User.populate(message, {
      path: "chat.users",
      select: "name avatar email",
    });

    // update latestMessage field in Chat model
    await Chat.findByIdAndUpdate(chatId, { latestMessage: message });

    res.json(message);
  } catch (error) {
    res.status(400);
    throw new Error(error.message);
  }
});

// 2. get all messages for a chat Id
const getAllMessagesForChatId = asyncHandler(async (req, res) => {
  try {
    const messages = await Message.find({ chat: req.params.chatId })
      .populate("sender", "name avatar email")
      .populate("chat");

    res.json(messages);
  } catch (error) {
    res.status(400);
    throw new Error(error.message);
  }
});

const userController = { sendMessage, getAllMessagesForChatId };

module.exports = userController;
