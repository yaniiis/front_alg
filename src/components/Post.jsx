// src/components/Post.jsx
import { motion } from 'framer-motion';

export default function Post({ post }) {
  return (
    <motion.div
      key={post.id}
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="bg-white rounded-xl shadow-md p-4"
    >
      <div className="flex items-center gap-3 mb-2">
        {post.avatar_url && (
          <img
            src={post.avatar_url}
            alt={post.author}
            className="w-10 h-10 rounded-full"
          />
        )}
        <h3 className="font-semibold text-lg text-indigo-700">{post.author}</h3>
      </div>

      {/* ✅ Titre du post */}
      <h2 className="text-xl font-bold text-gray-900 mb-2">{post.title}</h2>

      <p className="text-gray-800 mb-3">{post.content}</p>

      {/* Médias */}
      {Array.isArray(post.media) && post.media.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
          {post.media.map((file, index) => {
            const isImage = file.type === "image";
            const isVideo = file.type === "video";

            return (
              <div key={index} className="w-full">
                {isImage && (
                  <img
                    src={file.url}
                    alt={`media-${index}`}
                    className="rounded-md w-full"
                    onError={() => console.error("Erreur de chargement d'image :", file.url)}
                  />
                )}
                {isVideo && (
                  <video
                    controls
                    src={file.url}
                    className="rounded-md w-full max-h-64"
                  />
                )}
              </div>
            );
          })}
        </div>
      )}
    </motion.div>
  );
}
