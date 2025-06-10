const express = require("express");
const router = express.Router();
const userController = require("../controller/UserProfileController");

router.get("/:userId/posts", userController.getUserPosts);
router.post("/friendRequest/:userId", userController.friendRequest);
router.post("/blockUser/:userId", userController.blockUser);
router.get("/:userId", userController.getUserById);

router.get("/checkFriendRequest/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    const senderId = req.query.sender_id;

    if (!senderId) {
        
      return res.status(400).json({ error: "sender_id est requis" });
    }

    // Vérification dans la base de données
    const [requests] = await db.query(
      `SELECT * FROM friend_requests 
       WHERE sender_id = ? AND receiver_id = ? AND status = 'pending'`,
      [senderId, userId]
    );

    res.json({ exists: requests.length > 0 });
  } catch (err) {
    console.error("Erreur lors de la vérification:", err);
    res.status(500).json({ error: "Erreur serveur" });
  }
});

module.exports = router;
