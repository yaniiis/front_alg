import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import Post from "../components/Post";

export default function UserProfile() {
  const { userId } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const resUser = await fetch(`http://localhost:3001/userProfile/${userId}`);
      const resPosts = await fetch(`http://localhost:3001/userProfile/${userId}/posts`);
      const userData = await resUser.json();
      const postsData = await resPosts.json();
      setUser(userData);
      setPosts(postsData);
    };

    fetchData();
  }, [userId]);

  const handleAddFriend = async () => {
    await fetch(`http://localhost:3001/friendRequest/${userId}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ sender_id: localStorage.getItem("userId") }),
    });
    alert("Demande d'ami envoyée !");
  };

  const handleBlockUser = async () => {
    const confirmed = window.confirm("Etes vous sûr de vouloir bloquer cet utilisateur ?");

    if (!confirmed) return;

    try {
      await fetch(`http://localhost:3001/userProfile/blockUser/${userId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ blocker_id: localStorage.getItem("userId") }),
      });

      alert("Utilisateur bloqué.");
      navigate("/suggestions");
    } catch (err) {
      console.error("Erreur lors du blocage :", err);
      alert("Erreur lors du blocage.");
    }
  };

  if (!user) return <p className="p-10">Chargement...</p>;

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <Sidebar />
      <div className="ml-60 p-6 max-w-3xl mx-auto">
        <div className="bg-white rounded-xl shadow-md p-6 flex items-center gap-6 mb-6">
          <img
            src={user.avatar_url || "https://via.placeholder.com/100"}
            className="w-24 h-24 rounded-full object-cover"
            alt={user.username}
          />
          <div className="flex-1">
            <h2 className="text-2xl font-bold text-indigo-700">{user.username}</h2>
            <p className="text-gray-600">{user.bio}</p>
            <div className="mt-4 flex gap-3">
              <button onClick={handleAddFriend} className="px-4 py-2 bg-green-600 text-white rounded-xl text-sm">Ajouter en ami</button>
              <button onClick={handleBlockUser} className="px-4 py-2 bg-red-500 text-white rounded-xl text-sm">Bloquer</button>
              <button className="px-4 py-2 border border-gray-400 text-gray-700 rounded-xl text-sm">Message</button>
            </div>
          </div>
        </div>

        <h3 className="text-xl font-semibold mb-4">Ses publications</h3>
        <div className="space-y-4">
          {posts.map((post) => (
            <Post key={post.id} post={post} />
          ))}
        </div>
      </div>
    </div>
  );
}
