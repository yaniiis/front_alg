const express = require("express");
const router = express.Router();
const pool = require("../db");

router.post("/", async (req, res) => {
  const { username, email, password } = req.body;

  try {
    const existing = await pool.query("SELECT * FROM users WHERE email = $1", [email]);
    if (existing.rows.length > 0) {
      return res.status(400).json({ message: "Email déjà utilisé." });
    }

    const result = await pool.query(
      `INSERT INTO users (username, email, password, avatar_url, bio)
       VALUES ($1, $2, $3, $4, $5) RETURNING *`,
      [username, email, password, "", ""]
    );

    res.status(201).json({ message: "Inscription réussie", user: result.rows[0] });
  } catch (error) {
    console.error("Erreur d'inscription :", error);
    res.status(500).json({ message: "Erreur serveur." });
  }
});

module.exports = router;
