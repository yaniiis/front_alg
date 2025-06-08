  const express = require('express');
  const router = express.Router();
  const pool = require('../db');

  router.get("/:userId", async (req, res) => {
    const userId = parseInt(req.params.userId, 10);

    if (isNaN(userId)) {
      return res.status(400).json({ error: "User ID invalide" });
    }

    try {
      const query = `
        SELECT DISTINCT u.id, u.username, u.avatar_url, u.bio
        FROM users u
        JOIN friend_requests fr 
          ON ((fr.sender_id = $1 AND fr.receiver_id = u.id) 
          OR (fr.receiver_id = $1 AND fr.sender_id = u.id))
        WHERE fr.status = 'accepted';
      `;

      const { rows } = await pool.query(query, [userId]);

      return res.json(rows);
    } catch (error) {
      console.error("Erreur récupération amis :", error);
      return res.status(500).json({ error: "Erreur serveur" });
    }
  });

  module.exports = router;
