// server.js
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Routes
const postsRouter = require("./routes/posts");
app.use("/posts", postsRouter);

const messagesRouter = require("./routes/messages");
app.use("/messages", messagesRouter);

const friendsRouter = require("./routes/friends");
app.use("/friends", friendsRouter);

const suggestionsRouter = require("./routes/suggestions");
app.use("/suggestions", suggestionsRouter);

// Démarrage serveur
app.listen(3001, () => {
  console.log("Serveur backend démarré sur http://localhost:3001");
});


