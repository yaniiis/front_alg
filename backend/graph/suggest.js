function suggestFriends(graph, userId) {
  const user = graph.getUser(userId);
  if (!user) return [];

  const suggestions = new Map();

  for (const friendId of user.friends) {
    const friend = graph.getUser(friendId);
    for (const friendOfFriendId of friend.friends) {
      if (friendOfFriendId === userId || user.friends.has(friendOfFriendId) || user.blocked.has(friendOfFriendId)) continue;

      const fof = graph.getUser(friendOfFriendId);
      let score = 1;

      const commonInterests = [...user.interests].filter(i => fof.interests.has(i));
      score += commonInterests.length;

      if (user.interactions.has(friendOfFriendId) || fof.interactions.has(userId)) score += 2;

      suggestions.set(friendOfFriendId, (suggestions.get(friendOfFriendId) || 0) + score);
    }
  }

  return [...suggestions.entries()]
    .sort((a, b) => b[1] - a[1])// on peut utiliser slice pour ne proposer qu'un nombre limité de profils
    .map(([id]) => graph.getUser(id));
}

module.exports = suggestFriends;