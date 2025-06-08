const express = require("express");
const router = express.Router();
const pool = require("../db");

// Obtenir le nombre de likes pour un post
router.get("/:postId/likes/count", async (req, res) => {
  const { postId } = req.params;
  try {
    const result = await pool.query(
      "SELECT COUNT(*) FROM likes WHERE post_id = $1",
      [postId]
    );
    res.json({ total: parseInt(result.rows[0].count, 10) });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erreur lors du comptage des likes." });
  }
});

// Vérifier si un utilisateur a liké un post
router.get("/:postId/likes/:userId", async (req, res) => {
  const { postId, userId } = req.params;
  try {
    const result = await pool.query(
      "SELECT * FROM likes WHERE post_id = $1 AND user_id = $2",
      [postId, userId]
    );
    res.json({ liked: result.rowCount > 0 });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erreur lors de la vérification du like." });
  }
});

// Ajouter un like
router.post("/:postId/likes", async (req, res) => {
  const { postId } = req.params;
  const { user_id } = req.body;

  try {
    await pool.query(
      "INSERT INTO likes (post_id, user_id) VALUES ($1, $2) ON CONFLICT DO NOTHING",
      [postId, user_id]
    );
    res.json({ message: "Like ajouté." });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erreur lors de l'ajout du like." });
  }
});

// Supprimer un like
router.delete("/:postId/likes/:userId", async (req, res) => {
  const { postId, userId } = req.params;
  try {
    await pool.query(
      "DELETE FROM likes WHERE post_id = $1 AND user_id = $2",
      [postId, userId]
    );
    res.json({ message: "Like retiré." });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erreur lors de la suppression du like." });
  }
});

module.exports = router;
