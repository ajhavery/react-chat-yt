const router = require("express").Router();
const messageController = require("../controllers/message.controllers");
const { protect } = require("../middlewares/auth-middleware");

// 1. send message to a chatId
router.post("/send-message", protect, messageController.sendMessage);
// 2. get all messages for a chat Id
router.get("/:chatId", protect, messageController.getAllMessagesForChatId);

module.exports = router;
