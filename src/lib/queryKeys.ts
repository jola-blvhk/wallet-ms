const QUERYKEYS = {
  // Query keys for fetching data
  getWalletBalance: (balanceId: string) => ["get-wallet-balance", balanceId],
  // getUserById: (id: string) => ["user", id],
  // getAllPosts: () => ["posts"],
  // getPostById: (id: string) => ["post", id],
  // getCommentsByPostId: (postId: string) => ["comments", postId],

  // Mutation keys for creating, updating, and deleting data
  // createUser: () => ["createUser"],
  // updateUser: (id: string) => ["updateUser", id],
  // deleteUser: (id: string) => ["deleteUser", id],
};

export default QUERYKEYS;
