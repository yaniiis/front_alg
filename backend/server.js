// server.js
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(express.json());


// Routes
const postsRouter = require("./routes/posts");
app.use("/posts", postsRouter);

const messagesRouter = require("./routes/messages");
app.use("/messages", messagesRouter);

const friendsRouter = require("./routes/friends");
app.use("/friends", friendsRouter);

const suggestionsRouter = require("./routes/suggestions");
app.use("/suggestions", suggestionsRouter);

const userProfileRouter = require("./routes/userProfile");
app.use("/userProfile", userProfileRouter);

const loginRouter = require("./routes/login");
app.use("/login", loginRouter);

const registerRoute = require("./routes/register");
app.use("/register", registerRoute);

const friend_requestsRouter = require("./routes/friendRequest");
app.use("/friendRequest", friend_requestsRouter); 

// Démarrage serveur
app.listen(3001, () => {
  console.log("Serveur backend démarré sur http://localhost:3001");
});


