import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import Post from "../components/Post";

export default function UserProfile() {
  const { userId } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [posts, setPosts] = useState([]);
  const [friendRequestSent, setFriendRequestSent] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      const resUser = await fetch(`http://localhost:3001/userProfile/${userId}`);
      const resPosts = await fetch(`http://localhost:3001/userProfile/${userId}/posts`);
      const userData = await resUser.json();
      const postsData = await resPosts.json();
      setUser(userData);
      setPosts(postsData);
      
      // Vérifier si une demande d'ami a déjà été envoyée
      if (localStorage.getItem("userId")) {
        const checkRequest = await fetch(`http://localhost:3001/checkFriendRequest/${userId}?sender_id=${localStorage.getItem("userId")}`);
        const { exists } = await checkRequest.json();
        setFriendRequestSent(exists);
      }
    };

    fetchData();
  }, [userId]);

  const handleAddFriend = async () => {
    try {
      await fetch(`http://localhost:3001/friendRequest/${userId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sender_id: localStorage.getItem("userId") }),
      });
      setFriendRequestSent(true);
    } catch (error) {
      console.error("Erreur lors de l'envoi de la demande:", error);
    }
  };

  const handleBlockUser = async () => {
    const confirmed = window.confirm("Êtes-vous sûr de vouloir bloquer cet utilisateur ?");

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
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-blue-200 p-4">
      <Sidebar />
      <div className="ml-60 p-6 max-w-3xl mx-auto">
        <div className="bg-white rounded-xl shadow-md p-6 flex items-center gap-6 mb-6">
          <div className="flex-1">
            <h2 className="text-2xl font-bold text-indigo-700">{user.username}</h2>
            <p className="text-gray-600">{user.bio}</p>
            <div className="mt-4 flex gap-3">
              <button 
                onClick={handleAddFriend} 
                disabled={friendRequestSent}
                className={`px-4 py-2 rounded-xl text-sm ${
                  friendRequestSent 
                    ? "bg-gray-400 text-white cursor-not-allowed" 
                    : "bg-green-600 text-white hover:bg-green-700"
                }`}
              >
                {friendRequestSent ? "Demande envoyée" : "Ajouter en ami"}
              </button>
              <button onClick={handleBlockUser} className="px-4 py-2 bg-red-500 text-white rounded-xl text-sm hover:bg-red-600">
                Bloquer
              </button>
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