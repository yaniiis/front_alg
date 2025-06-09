const express = require("express");
const router = express.Router();
const userController = require("../controller/UserProfileController");

router.get("/:userId/posts", userController.getUserPosts);
router.post("/friendRequest/:userId", userController.friendRequest);
router.post("/blockUser/:userId", userController.blockUser);

router.get("/:userId", userController.getUserById);


module.exports = router;
