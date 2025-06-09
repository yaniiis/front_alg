import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";

export default function FriendsList() {
  const userId = localStorage.getItem("userId");
  const [friends, setFriends] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchFriends() {
      try {
        const response = await fetch(`http://localhost:3001/friends/${userId}`);
        if (!response.ok) {
          throw new Error("Erreur lors de la récupération des amis");
        }
        const data = await response.json();
        setFriends(Array.isArray(data) ? data : []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchFriends();
  }, [userId]);

  if (loading) return <p>Chargement...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="min-h-screen bg-gray-100 flex">
      <Sidebar />

      <div className="ml-60 max-w-xl mx-auto p-6 w-full">
        <h1 className="text-2xl font-bold mb-4">Liste d’amis</h1>
        {friends.length === 0 ? (
          <p>Aucun ami à afficher.</p>
        ) : (
          <ul className="space-y-4">
            {friends.map((friend) => (
              <li
                key={friend.id}
                onClick={() => navigate(`/userProfile/${friend.id}`)}
                className="cursor-pointer bg-white p-4 rounded shadow flex items-center gap-4 hover:bg-gray-100 transition"
              >
                <img
                  src={friend.avatar_url || "https://via.placeholder.com/50"}
                  alt={friend.username}
                  className="w-12 h-12 rounded-full object-cover"
                />
                <div>
                  <p className="font-semibold">{friend.username}</p>
                  <p className="text-sm text-gray-600">{friend.bio}</p>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
