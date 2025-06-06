const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");

const app = express();

// Middleware
app.use(cors());
app.use(express.json()); // suffisant, pas besoin de bodyParser
app.use("/uploads", express.static("uploads")); // accès aux fichiers uploadés

// Routes
const postsRouter = require("./routes/posts");
const messagesRouter = require("./routes/messages");
const friendsRouter = require("./routes/friends");
const suggestionsRouter = require("./routes/suggestions");

app.use("/posts", postsRouter);
app.use("/messages", messagesRouter);
app.use("/friends", friendsRouter);
app.use("/suggestions", suggestionsRouter);

// Lancement du serveur (une seule fois !)
const PORT = 3001;
app.listen(PORT, () => {
  console.log(`✅ Backend server running at http://localhost:${PORT}`);
});
