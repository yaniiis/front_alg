const express = require('express');
const router = express.Router();
const pool = require('../db'); // pool Pg, à adapter selon ton projet

// tous les msg 
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


// nv msg 
router.post("/", async (req, res) => {
  const { sender_id, receiver_id, content } = req.body;

  if (!sender_id || !receiver_id || !content) {
    return res.status(400).json({ error: "Champs manquants" });
  }

  try {

    const result = await pool.query(
      `INSERT INTO messages (sender_id, receiver_id, content)
       VALUES ($1, $2, $3)
       RETURNING *`,
      [sender_id, receiver_id, content]
    );


    const userResult = await pool.query(
      "SELECT username FROM users WHERE id = $1",
      [sender_id]
    );

    if (userResult.rows.length > 0) {
      const username = userResult.rows[0].username;
      const notifContent = `${username} sent you a message.`;


      await pool.query(
        `INSERT INTO notifications (user_id, type, content)
         VALUES ($1, 'message', $2)`,
        [receiver_id, notifContent]
      );
    }

    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error("Erreur insertion message:", err);
    res.status(500).json({ error: "Erreur serveur" });
  }
});



module.exports = router;
