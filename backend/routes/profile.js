const express = require("express");
const router = express.Router();
const UserProfileController = require("../controller/userController");

router.get("/:userId", UserProfileController.getUserInfo);
router.put("/:userId/update", UserProfileController.putUserInfo);

module.exports = router;