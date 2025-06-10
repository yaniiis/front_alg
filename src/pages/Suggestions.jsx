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
        if (!response.ok) throw new Error("Error loading suggestions");

        const data = await response.json();
        setSuggestions(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("Fetch error:", error);
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
        alert("Error: " + errorData.message);
        return;
      }

      alert("Friend request sent!");
    } catch (err) {
      console.error("Error sending friend request:", err);
      alert("Error sending request.");
    }
  };

  return (
        <div className="min-h-screen bg-gradient-to-br from-gray-100 to-blue-200 p-4">

      <Sidebar />
      <div className="ml-60 flex-1 p-6">
        <h1 className="text-3xl font-bold text-center mb-6">Suggested Profiles</h1>
        {loading ? (
          <p className="text-center text-gray-600">Loading...</p>
        ) : suggestions.length === 0 ? (
          <p className="text-center text-gray-600">No suggestions at the moment.</p>
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

                <div className="flex-1">
                  <h3 className="font-semibold text-lg text-indigo-700">{user.username}</h3>
                  <p className="text-gray-600">{user.bio || "No bio available."}</p>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
