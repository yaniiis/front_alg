import { useEffect } from "react";
import { motion } from "framer-motion";
import Sidebar from "../components/Sidebar";

const fakePosts = [
  {
    id: 1,
    author: "Alice Martin",
    content: "Une belle journée pour coder ☀️",
    image: "https://source.unsplash.com/600x300/?coding,day",
  },
  {
    id: 2,
    author: "Théo Durand",
    content: "J’ai testé React avec Tailwind. Incroyable combo ! 🔥",
    image: null,
  },
  {
    id: 3,
    author: "Fatou Sagna",
    content: "Voici ma dernière vidéo tuto React 😎",
    video: "https://www.youtube.com/embed/dGcsHMXbSOA", // exemple de vidéo
  },
  {
    id: 4,
    author: "Léo Petit",
    content: "Un peu de nature pour aujourd’hui 🌲",
    image: "https://source.unsplash.com/600x300/?forest,nature",
  },
  {
    id: 5,
    author: "Camille Nguyen",
    content: "Nouveau projet terminé ! Merci à tous 💻🎉",
    image: "https://source.unsplash.com/600x300/?success,developer",
  },
];

export default function Feed() {
  useEffect(() => {
    window.scrollTo(0, 0); // pour revenir en haut à chaque chargement
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 p-4">
    <Sidebar />
    <div className="ml-60 flex-1 bg-gray-100 p-6 overflow-y-auto">

      <h1 className="text-3xl font-bold text-center mb-6">Fil d’actualité</h1>
      <div className="max-w-2xl mx-auto flex flex-col gap-6">
        {fakePosts.map((post) => (
          <motion.div
            key={post.id}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="bg-white rounded-xl shadow-md p-4"
          >
            <h3 className="font-semibold text-lg text-indigo-700 mb-2">{post.author}</h3>
            <p className="text-gray-800 mb-3">{post.content}</p>
            {post.image && (
              <img
                src={post.image}
                alt="Post"
                className="w-full h-auto rounded-md"
              />
            )}
            {post.video && (
              <div className="aspect-video mt-2">
                <iframe
                  src={post.video}
                  className="w-full h-full rounded-md"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  title={`video-${post.id}`}
                ></iframe>
              </div>
            )}
          </motion.div>
        ))}
      </div>
      </div>
    </div>
  );
}
