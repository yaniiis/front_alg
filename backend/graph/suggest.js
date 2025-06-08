// backend/graph/suggest.js
function suggestFriends(graph, userId, topN = 5) {
  const user = graph.getUser(userId);
  if (!user) return [];

  const suggestions = new Map();

  for (const friendId of user.friends) {
    const friend = graph.getUser(friendId);
    for (const fofId of friend.friends) {
      if (fofId === userId || user.friends.has(fofId)) continue;

      const fof = graph.getUser(fofId);
      let score = 1;

      const commonInterests = [...user.interests].filter(i => fof.interests.has(i));
      score += commonInterests.length * 2;

      if (user.interactions.has(fofId) || fof.interactions.has(userId)) score += 2;

      suggestions.set(fofId, (suggestions.get(fofId) || 0) + score);
    }
  }

  return [...suggestions.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, topN)
    .map(([id]) => graph.getUser(id));
}

module.exports = suggestFriends;
