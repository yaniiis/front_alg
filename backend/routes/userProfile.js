const express = require("express");
const router = express.Router();
const userController = require("../controller/UserProfileController");

router.get("/:userId", userController.getUserById);
router.get("/:userId/posts", userController.getUserPosts);
router.get("/:userId/friendRequest", userController.friendRequest);

module.exports = router;
