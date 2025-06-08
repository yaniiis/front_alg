import { BrowserRouter, Routes, Route } from "react-router-dom";
import Suggestions from "./pages/Suggestions"; 
import Login from "./pages/Login";
import Register from "./pages/Register";
import Profile from "./pages/Profile"; 
import Feed from "./pages/Feed"; 
import Messages from "./pages/Messages"; 
import FriendsList from "./pages/FriendsList";
import UserProfile from "./pages/UserProfile";


export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/profile" element={<Profile />} /> 
        <Route path="/feed" element={<Feed />} />
        <Route path="/suggestions" element={<Suggestions />} />
        <Route path="/messages" element={<Messages />} />
        <Route path="/FriendsList" element={<FriendsList />} />
        <Route path="/Suggestions/:userId" element={<Suggestions />} />
        <Route path="/UserProfile/:userId" element={<UserProfile />} />

      </Routes>
    </BrowserRouter>
  );
}
