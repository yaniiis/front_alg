// src/api/posts.js
export async function fetchPosts() {
  try {
    const response = await fetch('http://localhost:3001/posts'); 
    if (!response.ok) {
      throw new Error('Erreur lors du chargement des posts');
    }
    return await response.json();
  } catch (error) {
    console.error(error);
    return [];
  }
}
