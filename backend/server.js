const express = require("express");
const cors = require("cors");

const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.json());
app.use("/uploads", express.static("uploads")); // accès aux fichiers uploadés


// Routes
const postsRouter = require("./routes/posts");
const messagesRouter = require("./routes/messages");
const friendsRouter = require("./routes/friends");
const suggestionsRouter = require("./routes/suggestions");
const likesRoutes = require("./routes/likes");


const userProfileRouter = require("./routes/userProfile");
app.use("/userProfile", userProfileRouter);

const loginRouter = require("./routes/login");
app.use("/login", loginRouter);

const registerRoute = require("./routes/register");
app.use("/register", registerRoute);

const friend_requestsRouter = require("./routes/friendRequest");
app.use("/friendRequest", friend_requestsRouter); 


const profileRouter = require("./routes/profile");
app.use("/profile", profileRouter); 


app.listen(3001, () => {
  console.log("Serveur backend démarré sur http://localhost:3001");
});

