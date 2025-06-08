import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import Sidebar from "../components/Sidebar";

export default function Suggestions() {
  const userId = parseInt(localStorage.getItem("userId"));
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    if (!userId) return;

    async function fetchSuggestions() {
      try {
        const response = await fetch(`http://localhost:3001/suggestions/${userId}`);
        if (!response.ok) throw new Error("Erreur lors du chargement des suggestions");

        const data = await response.json();
        setSuggestions(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("Erreur de fetch :", error);
        setSuggestions([]);
      } finally {
        setLoading(false);
      }
    }

    fetchSuggestions();
  }, [userId]);

  const handleAddFriend = async (receiverId) => {
    try {
      const response = await fetch(`http://localhost:3001/friend-request`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sender_id: userId, receiver_id: receiverId }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        alert("Erreur : " + errorData.message);
        return;
      }

      alert("Demande d'ami envoyée !");
    } catch (err) {
      console.error("Erreur lors de la demande d'ami :", err);
      alert("Erreur lors de l'envoi de la demande.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <Sidebar />
      <div className="ml-60 flex-1 p-6">
        <h1 className="text-3xl font-bold text-center mb-6">Profils suggérés</h1>
        {loading ? (
          <p className="text-center text-gray-600">Chargement en cours...</p>
        ) : suggestions.length === 0 ? (
          <p className="text-center text-gray-600">Aucune suggestion pour le moment.</p>
        ) : (
          <div className="max-w-2xl mx-auto flex flex-col gap-6">
            {suggestions.map((user) => (
              <motion.div
                key={user.id}
                onClick={() => navigate(`/userProfile/${user.id}`)}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className="bg-white rounded-xl shadow-md p-4 flex items-center gap-4 cursor-pointer hover:bg-gray-100"
              >
                <img
                  src={user.avatar_url || "https://via.placeholder.com/64"}
                  alt={user.username}
                  className="w-16 h-16 rounded-full object-cover"
                />
                <div className="flex-1">
                  <h3 className="font-semibold text-lg text-indigo-700">{user.username}</h3>
                  <p className="text-gray-600">{user.bio || "No bio available."}</p>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleAddFriend(user.id);
                  }}
                  className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-xl text-sm"
                >
                  Ajouter
                </button>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
