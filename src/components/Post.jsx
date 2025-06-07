import { useEffect, useState } from "react";
import { fetchComments, addComment } from "../api/comments";
import { motion } from "framer-motion";

export default function Post({ post }) {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");

  useEffect(() => {
    loadComments();
  }, []);

  const loadComments = async () => {
    try {
      const data = await fetchComments(post.id);
      setComments(data);
    } catch (err) {
      console.error("Erreur de chargement des commentaires :", err);
    }
  };

  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    const user_id = 10; // Remplacez par l'ID réel de l'utilisateur connecté

    try {
      await addComment(post.id, user_id, newComment);
      setNewComment("");
      loadComments();
    } catch (err) {
      console.error("Erreur d'ajout du commentaire :", err);
    }
  };

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

      <h2 className="text-xl font-bold text-gray-900 mb-2">{post.title}</h2>
      <p className="text-gray-800 mb-3">{post.content}</p>

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

      {/* 🔽 Section Commentaires */}
      <div className="mt-6">
        <h4 className="font-semibold mb-2 text-gray-800">Commentaires</h4>

        <form onSubmit={handleAddComment} className="flex flex-col gap-2 mb-4">
          <input
            type="text"
            placeholder="Ajouter un commentaire..."
            className="w-full p-2 border border-gray-300 rounded"
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
          />
          <button
            type="submit"
            className="self-end bg-blue-600 text-white px-4 py-1 rounded hover:bg-blue-700 transition"
          >
            Envoyer
          </button>
        </form>

        <ul className="space-y-2">
          {comments.map((comment) => (
            <li key={comment.id} className="text-gray-700 border-t pt-2">
              <strong>{comment.username}</strong> : {comment.content}
            </li>
          ))}
        </ul>
      </div>
    </motion.div>
  );
}
