const express = require("express");
const router = express.Router();
const pool = require("../db");

// Recherche intelligente dun user par username
router.get("/search", async (req, res) => {
  const { username } = req.query;

  if (!username || username.trim() === "") {
    return res.status(400).json({ error: "Le paramètre username est requis." });
  }

  try {

    const queryText = `
      SELECT id, username, email, avatar_url, bio 
      FROM users 
      WHERE username ILIKE $1 OR username ILIKE $2 OR username ILIKE $3
      ORDER BY 
        CASE 
          WHEN username ILIKE $1 THEN 0
          WHEN username ILIKE $2 THEN 1
          ELSE 2
        END,
        username
      LIMIT 50;
    `;

    const values = [
      username,          // el mismo 
      `${username}%`,    // commence par 
      `%${username}%`,   // contient
    ];

    const result = await pool.query(queryText, values);
    res.json(result.rows);
  } catch (err) {
    console.error("Erreur lors de la recherche utilisateurs :", err);
    res.status(500).json({ error: "Erreur serveur lors de la recherche." });
  }
});

module.exports = router;
