// backend/graph/graph.js
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
      });
    }
  }

  addFriendship(a, b) {
    this.nodes.get(a)?.friends.add(b);
    this.nodes.get(b)?.friends.add(a);
  }

  addInteraction(from, to) {
    this.nodes.get(from)?.interactions.add(to);
  }

  addInterest(id, interest) {
    this.nodes.get(id)?.interests.add(interest);
  }

  getUser(id) {
    return this.nodes.get(id);
  }

  getAllUsers() {
    return [...this.nodes.values()];
  }
}

module.exports = Graph;
