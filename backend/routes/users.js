import express from "express";
import { pool } from "../db.js";

const router = express.Router();

router.get("/", async (req, res) => {
  const result = await pool.query("SELECT id, name, email FROM users");
  res.json(result.rows);
});

router.post("/register", async (req, res) => {
  const { name, email, password } = req.body;
  const result = await pool.query(
    "INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING *",
    [name, email, password]
  );
  res.status(201).json(result.rows[0]);
});

export default router;
