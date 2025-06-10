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
          throw new Error("Error fetching friends");
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

  if (loading) return <p>Loading...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
  <div className="min-h-screen bg-gradient-to-br from-gray-100 to-blue-200 p-4">
    <Sidebar />
    <div
      className="ml-60 flex justify-center"
      style={{ paddingTop: "1rem" }}
    >
      <div className="max-w-xl w-full p-6">
        <h1 className="text-2xl font-bold mb-4 text-center">Friends List</h1>
        {loading ? (
          <p className="text-center">Loading...</p>
        ) : error ? (
          <p className="text-red-500 text-center">{error}</p>
        ) : friends.length === 0 ? (
          <p className="text-center">No friends to display.</p>
        ) : (
          <ul className="space-y-4">
            {friends.map((friend) => (
          <li
            key={friend.id}
            onClick={() => navigate(`/userProfile/${friend.id}`)}
            className="cursor-pointer bg-white p-4 rounded-xl shadow hover:bg-blue-100 transition flex items-center gap-4"
          >
            <div>
              <p className="font-semibold text-blue-800">{friend.username}</p>
              <p className="text-sm text-gray-600">{friend.bio}</p>
            </div>
          </li>

            ))}
          </ul>
        )}
      </div>
    </div>
  </div>
);


}
