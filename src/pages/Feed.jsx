import { useEffect, useState } from "react";
import { fetchPosts } from "../api/posts";
import Post from "../components/Post";
import Sidebar from "../components/Sidebar";

export default function Feed() {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    window.scrollTo(0, 0);
    const loadPosts = async () => {
      const data = await fetchPosts();
      setPosts(data);
    };
    loadPosts();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <Sidebar />
      <div className="ml-60 flex-1 bg-gray-100 p-6 overflow-y-auto">
        <h1 className="text-3xl font-bold text-center mb-6">Fil d’actualité</h1>
        <div className="max-w-2xl mx-auto flex flex-col gap-6">
          {posts.length > 0 ? (
            posts.map((post) => <Post key={post.id} post={post} />)
          ) : (
            <p className="text-center text-gray-500">Aucun post disponible</p>
          )}
        </div>
      </div>
    </div>
  );
}
