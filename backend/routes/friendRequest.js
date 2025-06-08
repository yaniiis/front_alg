const express = require("express");
const router = express.Router();
const userController = require("../controller/UserProfileController");

router.post("/:userId", userController.friendRequest);

module.exports = router;
