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
// Ajouter un like avec notification

router.post("/:postId/likes", async (req, res) => {
  const { postId } = req.params;
  const { user_id } = req.body;

  try {
    // Récupérer le propriétaire du post
    const postResult = await pool.query(
      "SELECT user_id FROM posts WHERE id = $1",
      [postId]
    );

    if (postResult.rows.length === 0) {
      return res.status(404).json({ error: "Post non trouvé." });
    }

    const postOwnerId = postResult.rows[0].user_id;

    // Ajouter le like
    await pool.query(
      "INSERT INTO likes (post_id, user_id) VALUES ($1, $2) ON CONFLICT DO NOTHING",
      [postId, user_id]
    );

    // Si ce n'est pas son propre post, on crée la notification
    if (user_id !== postOwnerId) {
      // Récupérer le username de celui qui a liké
      const userResult = await pool.query(
        "SELECT username FROM users WHERE id = $1",
        [user_id]
      );

      if (userResult.rows.length > 0) {
        const username = userResult.rows[0].username;
        const content = `${username} liked your post.`;

        await pool.query(
          `INSERT INTO notifications (user_id, type, content)
           VALUES ($1, 'like', $2)`,
          [postOwnerId, content]
        );
      }
    }

    res.json({ message: "Like ajouté (et notification si applicable)." });
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
