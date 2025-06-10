const db = require("../db");

exports.getUserById = async (req, res) => {
  const userId = parseInt(req.params.userId);
  try {
    const { rows } = await db.query("SELECT id, username, bio, avatar_url FROM users WHERE id = $1", [userId]);
    if (rows.length === 0) return res.status(404).json({ error: "Utilisateur non trouvé" });
    res.json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erreur serveur" });
  }
};

exports.getUserPosts = async (req, res) => {
  const userId = parseInt(req.params.userId);
  try {
    const { rows } = await db.query("SELECT id, content, created_at FROM posts WHERE user_id = $1 ORDER BY created_at DESC", [userId]);
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erreur serveur" });
  }

};

exports.friendRequest = async (req, res) => {
  const sender_id = parseInt(req.body.sender_id); 
  const targetUserId = parseInt(req.params.userId);
  console.log("sender id : " + sender_id + "   +   receiver_id : " + targetUserId);

  if (!sender_id || !targetUserId || sender_id === targetUserId) {
    return res.status(400).json({ message: "Bad request." });
  }

  try {
    const doesRelationExist = await db.query(
      `SELECT * FROM friend_requests
       WHERE sender_id = $1 AND receiver_id = $2`,
      [sender_id, targetUserId]
    );

    if (doesRelationExist.rows.length > 0) {
      return res.status(400).json({ message: "Demande déjà existante." });
    }

    const reciprocalFriendRequest = await db.query(
      `SELECT * FROM friend_requests
       WHERE sender_id = $2 AND receiver_id = $1 AND status='pending' `,
      [sender_id, targetUserId]
    );

    if (reciprocalFriendRequest.rows.length > 0) {
      await db.query(
        `INSERT INTO friend_requests (sender_id, receiver_id, status)
         VALUES ($1, $2, 'accepted')`,
        [sender_id, targetUserId]
      );

      await db.query(
        `UPDATE friend_requests SET status='accepted' 
         WHERE sender_id = $2 AND receiver_id = $1`,
        [sender_id, targetUserId]
      );

      return res.status(201).json({ message: "" });
    }

    await db.query(
      `INSERT INTO friend_requests (sender_id, receiver_id, status)
       VALUES ($1, $2, 'pending')`,
      [sender_id, targetUserId]
    );

    const userResult = await db.query(
      `SELECT username FROM users WHERE id = $1`,
      [sender_id]
    );

    const username = userResult.rows[0]?.username || "Quelqu’un";
    const content = `${username} vous a envoyé une demande d’ami.`;

    await db.query(
      `INSERT INTO notifications (user_id, type, content)
       VALUES ($1, 'friend_request', $2)`,
      [targetUserId, content]
    );

    res.status(201).json({ message: "" });

  } catch (err) {
    console.error("Erreur lors de la demande d’ami :", err);
    res.status(500).json({ message: "Erreur serveur." });
  }
};


exports.blockUser = async (req, res) => {
  const blockerId = parseInt(req.body.blocker_id);
  const blockedId = parseInt(req.params.userId);

  if (!blockerId || !blockedId || blockerId === blockedId) {
    return res.status(400).json({ message: "Bad request" });
  }

  try {
    await db.query(
      `DELETE FROM friend_requests 
       WHERE (sender_id = $1 AND receiver_id = $2) 
          OR (sender_id = $2 AND receiver_id = $1)`,
      [blockerId, blockedId]
    );

    const alreadyBlocked = await db.query(
      `SELECT * FROM blocked_users WHERE blocker_id = $1 AND blocked_id = $2`,
      [blockerId, blockedId]
    );

    if (alreadyBlocked.rows.length > 0) {
      return res.status(400).json({ message: "user already blocked ." });
    }

    await db.query(
      `INSERT INTO blocked_users (blocker_id, blocked_id)
       VALUES ($1, $2)`,
      [blockerId, blockedId]
    );

    res.status(201).json({ message: "Utilisateur bloqué." });

  } catch (err) {
    console.error("Erreur lors du blocage :", err);
    res.status(500).json({ message: "Erreur serveur." });
  }
};



exports.friendRequest = async (req, res) => {
  try {
    const { userId } = req.params;
    const { sender_id } = req.body;

    if (!sender_id) {
      return res.status(400).json({ error: "sender_id est requis" });
    }

    // Vérifier d'abord si une demande existe déjà
    const existingRequests = await db.query(
      `SELECT * FROM friend_requests 
       WHERE sender_id = $1 AND receiver_id = $2 AND status = 'pending'`,
      [sender_id, userId]
    );

    if (existingRequests.rows.length > 0) {
      return res.status(400).json({ error: "Une demande est déjà en attente" });
    }

    // Créer la nouvelle demande
    await db.query(
      `INSERT INTO friend_requests (sender_id, receiver_id, status) 
       VALUES ($1, $2, 'pending')`,
      [sender_id, userId]
    );

    res.json({ success: true, message: "Demande d'ami envoyée" });
  } catch (err) {
    console.error("Erreur lors de l'envoi de la demande:", err);
    res.status(500).json({ error: "Erreur serveur" });
  }
};