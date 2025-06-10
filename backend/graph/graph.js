class Graph {
  constructor() {
    this.nodes = new Map();
  }

  addUser(user) {
    if (!this.nodes.has(user.id)) {
      this.nodes.set(user.id, {
        ...user, 
        friends: new Set(), 
        interests: new Set(), 
        interactions: new Set(), 
        blocked: new Set(), 
      });
    }
  }

  addFriendship(user1, user2) {
    if (this.nodes.has(user1) && this.nodes.has(user2)) {
      this.nodes.get(user1).friends.add(user2);
      this.nodes.get(user2).friends.add(user1);
    }
  }

  addInteraction(user1, user2) {
    if (this.nodes.has(user1)) {
      this.nodes.get(user1).interactions.add(user2);
    }
  }

  addInterest(userId, interest) {
    if (this.nodes.has(userId)) {
      this.nodes.get(userId).interests.add(interest);
    }
  }

  addBlocked(userId, blockedId) {
    if (this.nodes.has(userId)) {
      this.nodes.get(userId).blocked.add(blockedId);
    }
  }

  getUser(userId) {
    return this.nodes.get(userId);
  }

  getAllUsers() {
    return [...this.nodes.values()];
  }
}

module.exports = Graph;
