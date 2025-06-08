import axios from "axios";

const backendURL = "http://localhost:3001";

export const fetchComments = async (postId) => {
  const response = await axios.get(`${backendURL}/posts/${postId}/comments`);
  return response.data;
};

export const addComment = async (postId, user_id, content) => {
  const response = await axios.post(`${backendURL}/posts/${postId}/comments`, {
    user_id,
    content,
  });
  return response.data;
};
