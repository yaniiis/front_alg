const API_URL = "http://localhost:3001/api/posts"; // adapte selon ton setup

export async function getLikesCount(postId) {
  const res = await fetch(`${API_URL}/${postId}/likes/count`);
  return await res.json();
}

export async function hasUserLiked(postId, userId) {
  const res = await fetch(`${API_URL}/${postId}/likes/${userId}`);
  return await res.json();
}

export async function likePost(postId, userId) {
  const res = await fetch(`${API_URL}/${postId}/likes`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ user_id: userId }),
  });
  return await res.json();
}

export async function unlikePost(postId, userId) {
  const res = await fetch(`${API_URL}/${postId}/likes/${userId}`, {
    method: "DELETE",
  });
  return await res.json();
}
