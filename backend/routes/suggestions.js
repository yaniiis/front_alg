const express = require("express");
const db = require("../db");
const suggestFriends = require("../graph/suggest");
const Graph = require("../graph/graph");

const router = express.Router();

router.get("/:userId", async (req, res) => {
  const userId = parseInt(req.params.userId);
  const graph = new Graph();

  const users = await db.query("SELECT * FROM users");
  users.rows.forEach(u => graph.addUser(u));

  const friends = await db.query("SELECT * FROM friend_requests WHERE status = 'accepted'");
  friends.rows.forEach(f => graph.addFriendship(f.sender_id, f.receiver_id));

  const messages = await db.query("SELECT sender_id, receiver_id FROM messages");
  messages.rows.forEach(m => graph.addInteraction(m.sender_id, m.receiver_id));

  const interests = await db.query("SELECT user_id, interest FROM user_interests");
  interests.rows.forEach(i => graph.addInterest(i.user_id, i.interest));

  const suggestions = suggestFriends(graph, userId);

  res.json(suggestions);
});

module.exports = router;
