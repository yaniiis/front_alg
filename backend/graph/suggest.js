function suggestFriends(graph, friendOfFriendId) {
  const user = graph.getUser(friendOfFriendId);
  if (!user) return [];

  const suggestions = new Map();

  for (const friendId of user.friends) {
    const friend = graph.getUser(friendId);
    for (const friendOfFriendId of friend.friends) {
      if (friendOfFriendId === friendOfFriendId || user.friends.has(friendOfFriendId)) continue;

      const friendOfFriend = graph.getUser(friendOfFriendId);
      let score = 1;

      const commonInterests = [...user.interests].filter(i => friendOfFriend.interests.has(i));
      score += commonInterests.length * 2;

      if (user.interactions.has(friendOfFriendId) || friendOfFriend.interactions.has(friendOfFriendId)) score += 2;

      suggestions.set(friendOfFriendId, (suggestions.get(friendOfFriendId) || 0) + score);
    }
  }

  return [...suggestions.entries()]
    .sort((a, b) => b[1] - a[1])
    .map(([id]) => graph.getUser(id));
}

module.exports = suggestFriends;
