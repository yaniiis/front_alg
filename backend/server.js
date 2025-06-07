const express = require("express");
const cors = require("cors");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use("/uploads", express.static("uploads")); // accès aux fichiers uploadés

// Routes
const postsRouter = require("./routes/posts");
const messagesRouter = require("./routes/messages");
const friendsRouter = require("./routes/friends");
const suggestionsRouter = require("./routes/suggestions");
const likesRoutes = require("./routes/likes");


// ⚠️ Pas besoin de commentsRoutes séparé si c’est déjà géré dans /routes/posts.js
app.use("/posts", postsRouter);
app.use("/messages", messagesRouter);
app.use("/friends", friendsRouter);
app.use("/suggestions", suggestionsRouter);
app.use("/api/posts", likesRoutes);

// Lancement du serveur
const PORT = 3001;
app.listen(PORT, () => {
  console.log(`✅ Backend server running at http://localhost:${PORT}`);
});
