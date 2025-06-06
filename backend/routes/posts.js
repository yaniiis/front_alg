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

module.exports = router;
