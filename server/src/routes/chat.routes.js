const router = require("express").Router();
const chatController = require("../controllers/chat.controllers");
const { protect } = require("../middlewares/auth-middleware");

// get one to one chat for given user IDs
router.post("/access-chat", protect, chatController.accessChat);
// get all chat for given user ID
router.get("/fetch-chats", protect, chatController.fetchChats);

router.post("/create-group", protect, chatController.createGroupChat);
router.put("/rename-group", protect, chatController.renameGroupChat);
router.put("/add-to-group", protect, chatController.addToGroupChat);
router.put("/remove-from-group", protect, chatController.removeFromGroupChat);

module.exports = router;
