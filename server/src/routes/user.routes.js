const router = require("express").Router();
const multer = require("multer");
const upload = multer({ dest: "uploads/" });
const userController = require("../controllers/user.controllers");
const { protect } = require("../middlewares/auth-middleware");

router.post("/register", userController.register);
router.post("/login", userController.login);
router.post(
  "upload-avatar",
  upload.single("avatar"),
  userController.uploadAvatar
);

router.get("/get-all-users", protect, userController.getAllUsers);

module.exports = router;
