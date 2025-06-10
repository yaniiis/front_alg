const API_BASE_URL = "http://localhost:3001";

export async function fetchPosts() {
  try {
    const response = await fetch(`${API_BASE_URL}/posts`);
    if (!response.ok) {
      throw new Error('Erreur lors du chargement des posts');
    }
    return await response.json();
  } catch (error) {
    console.error(error);
    return [];
  }
}

export async function createPost(postData) {
  const response = await fetch(`${API_BASE_URL}/posts`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(postData),
  });

  if (!response.ok) {
    throw new Error("Erreur lors de la création du post");
  }

  return await response.json();
}


export async function uploadFiles(files) {
  const formData = new FormData();
  files.forEach((file) => formData.append("files", file));

  const res = await fetch("http://localhost:3001/posts/upload", {
    method: "POST",
    body: formData,
  });

  if (!res.ok) throw new Error("Upload failed");

  return await res.json();
}

export async function addPostMedia(mediaArray, postId) {
  for (const media of mediaArray) {
    await fetch("http://localhost:3001/posts/media", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        post_id: postId,
        url: media.url,
        type: media.type,
      }),
    });
  }
}
