const db = require("../db");

exports.getUserInfo = async (req, res) => {
  const userId = parseInt(req.params.userId);
  try {
    const result = await db.query(
      "SELECT id, username, email, bio, avatar_url FROM users WHERE id = $1",
      [userId]
    );
    if (result.rows.length === 0) return res.status(404).json({ message: "User not found" });
    res.json(result.rows[0]);
  } catch (err) {
    console.error("Erreur lors de la récupération :", err);
    res.status(500).json({ message: "Erreur serveur" });
  }
};

exports.putUserInfo = async (req, res) => {
  console.log("req.body:", req.body);
  const userId = parseInt(req.params.userId);
  const { username, email, bio } = req.body;

  try {
    await db.query(
      "UPDATE users SET username = $1, email = $2, bio = $3 WHERE id = $4",
      [username, email, bio, userId]
    );
    res.status(200).json({ message: "Profil mis à jour." });
  } catch (err) {
    console.error("Erreur de mise à jour :", err);
    res.status(500).json({ message: "Erreur lors de la mise à jour." });
  }
};
