import { useEffect, useState } from "react";

export default function FriendsList() {
  const userId = localStorage.getItem("userId");
  const [friends, setFriends] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchFriends() {
      console.log("user id "+ userId);
      try {
        const response = await fetch(`http://localhost:3001/friends/${userId}`);
        if (!response.ok) {
          throw new Error("Erreur lors de la récupération des amis");
        }
        const data = await response.json();
        console.log("Amis reçus :", data);
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
    <div className="max-w-xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Liste d’amis</h1>
      {friends.length === 0 ? (
        <p>Aucun ami à afficher.</p>
      ) : (
        <ul className="space-y-4">
          {friends.map((friend) => (
            <li
              key={friend.id}
              className="bg-white p-4 rounded shadow flex items-center gap-4"
            >
              <img
                src={friend.avatar_url || "https://via.placeholder.com/50"}
                alt={friend.username}
                className="w-12 h-12 rounded-full"
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
  );
}
