export function toPublicUser(user) {
  return {
    id: user._id.toString(),
    name: user.name,
    email: user.email,
    membershipStatus: user.membershipStatus,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt
  };
}
