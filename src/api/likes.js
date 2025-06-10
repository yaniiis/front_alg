const API_URL = "http://localhost:3001/api/posts"; 

export async function getLikesCount(postId) {
  const res = await fetch(`${API_URL}/${postId}/likes/count`);
  return await res.json();
}

export async function hasUserLiked(postId, userId) {
  const res = await fetch(`${API_URL}/${postId}/likes/${userId}`);
  return await res.json();
}

export async function likePost(postId, userId) {
  console.log("Envoi like à l'API:", postId, userId);
  try {
    const res = await fetch(`${API_URL}/${postId}/likes`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ user_id: userId }),
    });
    console.log("Réponse brute:", res);
    const json = await res.json();
    console.log("Réponse JSON:", json);
    return json;
  } catch (error) {
    console.error("Erreur fetch likePost:", error);
  }
}


export async function unlikePost(postId, userId) {
  const res = await fetch(`${API_URL}/${postId}/likes/${userId}`, {
    method: "DELETE",
  });
  return await res.json();
}
