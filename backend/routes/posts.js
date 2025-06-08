const express = require("express");
const router = express.Router();
const pool = require("../db");
const multer = require("multer");
const path = require("path");
const fs = require("fs");



// 📁 Configuration du stockage avec Multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = "uploads";
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir);
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueName = Date.now() + "-" + file.originalname.replace(/\s+/g, "_");
    cb(null, uniqueName);
  }
});

const upload = multer({ storage });

// ✅ GET : Récupérer les posts avec leurs médias
router.get("/", async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT posts.*, users.username AS author, users.avatar_url,
        (
          SELECT json_agg(json_build_object('url', pm.url, 'type', pm.type))
          FROM post_media pm
          WHERE pm.post_id = posts.id
        ) AS media
      FROM posts
      JOIN users ON posts.user_id = users.id
      ORDER BY posts.created_at DESC
    `);
    res.json(result.rows);
  } catch (err) {
    console.error("Erreur dans /posts GET :", err);
    res.status(500).send("Erreur serveur");
  }
});

// ✅ POST : Créer un nouveau post
router.post("/", async (req, res) => {
  const { title, content, user_id } = req.body;
  if (!title || !content || !user_id) {
    return res.status(400).json({ error: "Champs manquants" });
  }

  try {
    const result = await pool.query(
      `INSERT INTO posts (title, content, user_id) VALUES ($1, $2, $3) RETURNING *`,
      [title, content, user_id]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error("Erreur lors de la création du post :", err);
    res.status(500).send("Erreur serveur");
  }
});

// ✅ POST : Upload de fichiers (images / vidéos)
router.post("/upload", upload.array("files"), (req, res) => {
  try {
    const files = req.files.map(file => ({
      url: `http://localhost:3001/uploads/${file.filename}`,
      type: file.mimetype.startsWith("video") ? "video" : "image",
    }));
    res.status(200).json(files);
  } catch (err) {
    console.error("Erreur lors de l'upload :", err);
    res.status(500).send("Erreur upload");
  }
});

// ✅ POST : Lier un média à un post
router.post("/media", async (req, res) => {
  const { post_id, url, type } = req.body;
  if (!post_id || !url || !type) {
    return res.status(400).json({ error: "Champs manquants pour le média" });
  }

  try {
    await pool.query(
      `INSERT INTO post_media (post_id, url, type) VALUES ($1, $2, $3)`,
      [post_id, url, type]
    );
    res.status(201).json({ message: "Média ajouté avec succès" });
  } catch (err) {
    console.error("Erreur lors de l'ajout du média :", err);
    res.status(500).send("Erreur serveur média");
  }
});


// ✅ ✅ ✅ NOUVEAU : Récupérer les commentaires d’un post
router.get("/:postId/comments", async (req, res) => {
  const { postId } = req.params;
  try {
    const result = await pool.query(
      `SELECT comments.*, users.username FROM comments
        JOIN users ON comments.user_id = users.id
        WHERE comments.post_id = $1
        ORDER BY comments.created_at ASC
        `,
      [postId]
    );
    res.json(result.rows);
  } catch (err) {
    console.error("Erreur récupération des commentaires :", err);
    res.status(500).send("Erreur serveur");
  }
});

// ✅ ✅ ✅ NOUVEAU : Ajouter un commentaire à un post
router.post("/:postId/comments", async (req, res) => {
  const { postId } = req.params;
  const { user_id, content } = req.body;

  if (!user_id || !content) {
    return res.status(400).json({ error: "user_id et content requis" });
  }

  try {
    // Ajouter le commentaire
    const result = await pool.query(
      `INSERT INTO comments (post_id, user_id, content)
       VALUES ($1, $2, $3)
       RETURNING *`,
      [postId, user_id, content]
    );

    // Récupérer le propriétaire du post
    const postResult = await pool.query(
      "SELECT user_id FROM posts WHERE id = $1",
      [postId]
    );

    if (postResult.rows.length > 0) {
      const postOwnerId = postResult.rows[0].user_id;

      // Ne pas notifier si l'auteur du commentaire est aussi le propriétaire
      if (user_id !== postOwnerId) {
        // Récupérer le username de l’auteur du commentaire
        const userResult = await pool.query(
          "SELECT username FROM users WHERE id = $1",
          [user_id]
        );

        if (userResult.rows.length > 0) {
          const username = userResult.rows[0].username;
          const notifContent = `${username} commented on your post.`;

          // Insertion de la notification
          await pool.query(
            `INSERT INTO notifications (user_id, type, content)
             VALUES ($1, 'comment', $2)`,
            [postOwnerId, notifContent]
          );
        }
      }
    }

    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error("Erreur ajout commentaire :", err);
    res.status(500).send("Erreur serveur");
  }
});


module.exports = router;

