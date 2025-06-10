const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json()); // ✅ Un seul middleware pour parser les requêtes JSON
app.use("/uploads", express.static("uploads")); 

// Routes
const notificationsRoutes = require("./routes/notifications");
app.use("/notifications", notificationsRoutes);

const userRouter = require("./routes/users");
app.use("/users", userRouter);

const likesRoutes = require("./routes/likes");
app.use("/api/posts", likesRoutes);

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

const profileRouter = require("./routes/profile");
app.use("/profile", profileRouter); 

app.listen(3001, () => {
  console.log("Serveur backend démarré sur http://localhost:3001");
});
