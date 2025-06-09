class Graph {
  constructor() {
    this.nodes = new Map();
  }

  addUser(user) {
    if (!this.nodes.has(user.id)) {
      this.nodes.set(user.id, {
        ...user, // On ajoute également l'objet user dans la map pour pouvoir accéder à ses champs 
        friends: new Set(),// ses amis
        interests: new Set(),// ses interet 
        interactions: new Set(),// les identifiants des user avec qui user a eut une interaction
      });
    }
  }

  addFriendship(user1, user2) {
    this.nodes.get(user1)?.friends.add(user2);
    this.nodes.get(user2)?.friends.add(user1);
  }

  addInteraction(user1, user2) {
    this.nodes.get(user1)?.interactions.add(user2);
  }

  addInterest(userId, interest) {
    this.nodes.get(userId)?.interests.add(interest);
  }

  getUser(userId  ) {
    return this.nodes.get(userId);
  }

  getAllUsers() {
    return [...this.nodes.values()];
  }
}

module.exports = Graph;
