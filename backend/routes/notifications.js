const express = require("express");
const router = express.Router();
const db = require("../db"); // Assure-toi que ce fichier gère bien la connexion PostgreSQL

// 🔹 GET /notifications/:userId - récupérer les notifications d'un utilisateur
router.get("/:userId", async (req, res) => {
  const userId = req.params.userId;

  try {
    const result = await db.query(
      "SELECT * FROM notifications WHERE user_id = $1 ORDER BY created_at DESC",
      [userId]
    );
    res.json(result.rows);
  } catch (error) {
    console.error("Erreur lors de la récupération des notifications :", error);
    res.status(500).json({ message: "Erreur serveur" });
  }
});

// 🔹 POST /notifications - créer une notification
router.post("/", async (req, res) => {
  const { user_id, type, content } = req.body;

  if (!user_id || !type || !content) {
    return res.status(400).json({ message: "Champs manquants" });
  }

  try {
    const result = await db.query(
      "INSERT INTO notifications (user_id, type, content, created_at) VALUES ($1, $2, $3, NOW()) RETURNING *",
      [user_id, type, content]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error("Erreur lors de la création de la notification :", error);
    res.status(500).json({ message: "Erreur serveur" });
  }
});

// Dans routes/notifications.js
router.patch("/:id/read", async (req, res) => {
  const { id } = req.params;
  try {
    await db.query("UPDATE notifications SET is_read = TRUE WHERE id = $1", [id]);
    res.sendStatus(200);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Erreur serveur" });
  }
});


// Simulation rapide pour accepter/refuser une demande
router.post("/friends/accept", (req, res) => {
  const { notificationId } = req.body;
  console.log(`Demande d’ami ${notificationId} acceptée`);
  res.sendStatus(200);
});

router.post("/friends/decline", (req, res) => {
  const { notificationId } = req.body;
  console.log(`Demande d’ami ${notificationId} refusée`);
  res.sendStatus(200);
});

router.patch("/:id/read", async (req, res) => {
  const { id } = req.params;
  try {
    await db.query("UPDATE notifications SET is_read = TRUE WHERE id = $1", [id]);
    res.sendStatus(200);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erreur serveur lors de la mise à jour" });
  }
});


router.patch("/:id/friend_request", async (req, res) => {
  const { id } = req.params;
  const { status } = req.body; // 'accepted' ou 'declined'

  if (!['accepted', 'declined'].includes(status)) {
    return res.status(400).json({ message: "Statut invalide" });
  }

  try {
    await db.query(
      "UPDATE notifications SET friend_request_status = $1 WHERE id = $2",
      [status, id]
    );
    res.sendStatus(200);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erreur serveur" });
  }
});



module.exports = router;

