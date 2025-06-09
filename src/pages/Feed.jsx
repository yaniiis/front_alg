import { useEffect, useState } from "react";
import { fetchPosts, createPost, uploadFiles, addPostMedia } from "../api/posts";
import Post from "../components/Post";
import Sidebar from "../components/Sidebar";

export default function Feed() {
  const [posts, setPosts] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [files, setFiles] = useState([]);
  const [preview, setPreview] = useState([]);

  useEffect(() => {
    window.scrollTo(0, 0);
    loadPosts();
  }, []);

  const loadPosts = async () => {
    const data = await fetchPosts();
    console.log("Posts récupérés :", data);
    setPosts(data);
  };

  const handleToggleForm = () => {
    setShowForm(!showForm);
  };

  const handleFileChange = (e) => {
    const fileList = Array.from(e.target.files);
    setFiles(fileList);

    // Generate preview
    const previewList = fileList.map(file => ({
      url: URL.createObjectURL(file),
      type: file.type.startsWith("video") ? "video" : "image"
    }));
    setPreview(previewList);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Replace with actual user_id
      const user_id = localStorage.getItem("userId");

      const newPost = await createPost({ title, content, user_id });

      if (files.length > 0) {
        const uploaded = await uploadFiles(files);
        await addPostMedia(uploaded, newPost.id);
      }

      setTitle("");
      setContent("");
      setFiles([]);
      setPreview([]);
      setShowForm(false);
      await loadPosts();
    } catch (error) {
      alert("Error while creating the post");
      console.error(error);
    }
  };

return (
  <div className="min-h-screen bg-gradient-to-br from-gray-100 to-blue-200">
    <Sidebar />
    <div className="ml-60 flex-1 p-6 overflow-y-auto min-h-screen bg-transparent">
      <h1 className="text-3xl font-bold text-center mb-6">News Feed</h1>

      <div className="flex justify-center mb-6">
          <button
            onClick={handleToggleForm}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
          >
            {showForm ? "Cancel" : "Create a Post"}
          </button>
        </div>

        {showForm && (
          <form
            onSubmit={handleSubmit}
            className="max-w-2xl mx-auto bg-white p-6 rounded shadow mb-8"
          >
            <input
              type="text"
              placeholder="Title"
              className="w-full p-2 mb-4 border border-gray-300 rounded"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
            <textarea
              placeholder="Content"
              className="w-full p-2 mb-4 border border-gray-300 rounded"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              required
            ></textarea>
            <input
              type="file"
              multiple
              accept="image/*,video/*"
              onChange={handleFileChange}
              className="mb-4"
            />
            <div className="flex flex-wrap gap-4 mb-4">
              {preview.map((media, index) =>
                media.type === "image" ? (
                  <img
                    key={index}
                    src={media.url}
                    alt="preview"
                    className="w-32 h-32 object-cover rounded"
                  />
                ) : (
                  <video key={index} src={media.url} controls className="w-32 h-32 rounded" />
                )
              )}
            </div>
            <button
              type="submit"
              className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition"
            >
              Post
            </button>
          </form>
        )}

        <div className="max-w-2xl mx-auto flex flex-col gap-6">
          {posts.length > 0 ? (
            posts.map((post) => <Post key={post.id} post={post} />)
          ) : (
            <p className="text-center text-gray-500">No posts available</p>
          )}
        </div>
      </div>
    </div>
  );
}
