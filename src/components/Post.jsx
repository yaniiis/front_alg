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
      <p className="text-gray-800 mb-3">{post.content}</p>
      {post.image_url && (
        <img
          src={post.image_url}
          alt="Post"
          className="w-full h-auto rounded-md"
        />
      )}
      {post.video_url && (
        <div className="aspect-video mt-2">
          <iframe
            src={post.video_url}
            className="w-full h-full rounded-md"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            title={`video-${post.id}`}
          ></iframe>
        </div>
      )}
    </motion.div>
  );
}
