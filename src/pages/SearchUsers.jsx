import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Sidebar from "../components/Sidebar";

export default function SearchUsers() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  async function handleSearch(e) {
    e.preventDefault();
    if (!query.trim()) {
      setResults([]);
      setError(null);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const res = await fetch(`http://localhost:3001/users/search?username=${encodeURIComponent(query)}`);
      if (!res.ok) throw new Error("Erreur réseau");
      const data = await res.json();
      setResults(data);
    } catch (err) {
      setError("La recherche a échoué, veuillez réessayer.");
      console.error("Search failed", err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-blue-200 p-4">
      <Sidebar />
      <div className="ml-60 flex flex-col items-center">
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.4 }}
          className="bg-white shadow-xl rounded-2xl p-8 w-full max-w-2xl mt-10"
        >
          <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">Search Users</h2>

          <form onSubmit={handleSearch} className="flex gap-4 mb-6">
            <input
              type="text"
              placeholder="Search by username..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="flex-1 p-3 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              type="submit"
              className="px-6 py-3 bg-indigo-600 text-white rounded hover:bg-indigo-700 transition"
            >
              Search
            </button>
          </form>

          {loading && <p className="text-center text-gray-600">Loading...</p>}

          {error && (
            <p className="text-center text-red-600 font-semibold mb-4">{error}</p>
          )}

          {!loading && !error && (
            <ul className="space-y-4">
              {results.length === 0 ? (
                <p className="text-center text-gray-500">No users found.</p>
              ) : (
                results.map((user) => (
                  <li
                    key={user.id}
                    className="border p-4 rounded shadow-sm bg-gray-50 hover:bg-gray-100 transition"
                  >
                    <div className="flex items-center gap-4">
                      <img
                        src={user.avatar_url || "/default-avatar.png"}
                        alt={user.username}
                        className="w-12 h-12 rounded-full object-cover"
                      />
                      <div>
                        <p className="font-semibold text-gray-800">@{user.username}</p>
                        {user.bio && (
                          <p className="text-gray-600 text-sm">{user.bio}</p>
                        )}
                      </div>
                    </div>
                  </li>
                ))
              )}
            </ul>
          )}
        </motion.div>
      </div>
    </div>
  );
}
