const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const { Pool } = require("pg");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Connexion PostgreSQL
const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

// Route de login
app.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const result = await pool.query(
      "SELECT * FROM users WHERE email = $1 AND password = $2",
      [email, password]
    );

    if (result.rows.length > 0) {
      res.status(200).json({ message: "Connexion réussie" });
    } else {
      res.status(401).json({ message: "Identifiants incorrects" });
    }
  } catch (error) {
    console.error("Erreur lors de la requête:", error);
    res.status(500).json({ message: "Erreur serveur" });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Backend démarré sur http://localhost:${PORT}`);
});
