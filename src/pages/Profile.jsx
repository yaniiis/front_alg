import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Sidebar from "../components/Sidebar";

export default function Profile() {
  const [isEditing, setIsEditing] = useState(false);
  const [user, setUser] = useState(null);
  const userId = localStorage.getItem("userId");

  useEffect(() => {
    window.scrollTo(0, 0);
    fetch(`http://localhost:3001/profile/${userId}`)
      .then((res) => res.json())
      .then((data) => setUser(data))
      .catch((err) => {
        console.error("Erreur lors du chargement du profil :", err);
      });
  }, [userId]);

  const handleChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`http://localhost:3001/profile/${userId}/update`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(user),
      });
      if (!res.ok) throw new Error("Erreur lors de la sauvegarde");
      setIsEditing(false);
    } catch (err) {
      console.error(err);
    }
  };

  if (!user) {
    return (
      <div className="ml-60 p-6 text-center text-gray-600">Chargement du profil...</div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-blue-200 p-4">
      <Sidebar />
      <div className="ml-60 flex justify-center items-center">
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.4 }}
          className="bg-white shadow-xl rounded-2xl p-8 w-full max-w-lg mt-10"
        >
          <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
            User Profile
          </h2>
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <InputField label="Username" name="username" value={user.username} onChange={handleChange} isEditing={isEditing} />
            <InputField label="Email" name="email" value={user.email} onChange={handleChange} isEditing={isEditing} />
            <InputField label="Bio" name="bio" value={user.bio || ""} onChange={handleChange} isEditing={isEditing} />

            <div className="flex justify-end gap-2 mt-4">
              {isEditing ? (
                <>
                  <button
                    type="button"
                    onClick={() => setIsEditing(false)}
                    className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400 transition"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
                  >
                    Save
                  </button>
                </>
              ) : (
                <button
                  type="button"
                  onClick={() => setIsEditing(true)}
                  className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 transition"
                >
                  Edit
                </button>
              )}
            </div>
          </form>
        </motion.div>
      </div>
    </div>
  );
}

function InputField({ label, name, value, onChange, isEditing }) {
  return (
    <div>
      <label className="block text-gray-600 mb-1">{label}</label>
      <input
        type="text"
        name={name}
        value={value}
        onChange={onChange}
        disabled={!isEditing}
        className={`w-full p-3 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 ${
          isEditing ? "bg-white" : "bg-gray-100 cursor-not-allowed"
        }`}
      />
    </div>
  );
}
