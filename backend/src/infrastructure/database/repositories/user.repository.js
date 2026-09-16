import { User } from '../models/user.model.js';

export function createUserRepository(userModel = User) {
  return {
    findByNormalizedEmail(normalizedEmail, { session, includePasswordHash = false } = {}) {
      let query = userModel.findOne({ normalizedEmail });
      if (includePasswordHash) query = query.select('+passwordHash');
      return session ? query.session(session) : query;
    },
    findById(userId, session) {
      const query = userModel.findById(userId);
      return session ? query.session(session) : query;
    },
    create(data, session) {
      if (session) return userModel.create([data], { session }).then(([user]) => user);
      return userModel.create(data);
    }
  };
}
