const express = require('express');
const router = express.Router();
const pool = require('../db'); // pool Pg, à adapter selon ton projet

// Récupérer tous les messages d'un utilisateur (userId dans params)
router.get('/:userId', async (req, res) => {
  const userId = parseInt(req.params.userId, 10);

  try {
    const result = await pool.query(`
      SELECT 
        m.id,
        m.content,
        m.sent_at,
        sender.id AS sender_id,
        sender.username AS sender_username,
        receiver.id AS receiver_id,
        receiver.username AS receiver_username
      FROM messages m
      JOIN users sender ON m.sender_id = sender.id
      JOIN users receiver ON m.receiver_id = receiver.id
      WHERE m.sender_id = $1 OR m.receiver_id = $1
      ORDER BY m.sent_at ASC
    `, [userId]);

    res.json(result.rows);

  } catch (err) {
    console.error('Erreur récupération des messages:', err);
    res.status(500).json({ error: 'Erreur serveur lors de la récupération des messages' });
  }
});

module.exports = router;
