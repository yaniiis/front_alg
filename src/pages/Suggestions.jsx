import { useEffect } from "react";
import { motion } from "framer-motion";
import Sidebar from "../components/Sidebar";

const fakeUsers = [
  {
    id: 1,
    name: "Alice Martin",
    bio: "Fullstack developer passionate about React and Node.js.",
    avatar: "https://randomuser.me/api/portraits/women/1.jpg",
  },
  {
    id: 2,
    name: "Théo Durand",
    bio: "UI/UX designer, coffee enthusiast ☕",
    avatar: "https://randomuser.me/api/portraits/men/2.jpg",
  },
  {
    id: 3,
    name: "Fatou Sagna",
    bio: "Data scientist who loves data visualization 📊",
    avatar: "https://randomuser.me/api/portraits/women/3.jpg",
  },
  {
    id: 4,
    name: "Léo Petit",
    bio: "Mobile developer in love with Flutter 💙",
    avatar: "https://randomuser.me/api/portraits/men/4.jpg",
  },
  {
    id: 5,
    name: "Camille Nguyen",
    bio: "Cybersecurity student 🔐",
    avatar: "https://randomuser.me/api/portraits/women/5.jpg",
  },
];

export default function Suggestions() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <Sidebar />
      <div className="ml-60 flex-1 p-6">
        <h1 className="text-3xl font-bold text-center mb-6">Suggested Profiles</h1>
        <div className="max-w-2xl mx-auto flex flex-col gap-6">
          {fakeUsers.map((user) => (
            <motion.div
              key={user.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="bg-white rounded-xl shadow-md p-4 flex items-center gap-4"
            >
              <img
                src={user.avatar}
                alt={user.name}
                className="w-16 h-16 rounded-full object-cover"
              />
              <div className="flex-1">
                <h3 className="font-semibold text-lg text-indigo-700">{user.name}</h3>
                <p className="text-gray-600">{user.bio}</p>
              </div>
              <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-xl text-sm">
                Follow
              </button>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
