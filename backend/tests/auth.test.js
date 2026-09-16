import { afterAll, beforeAll, beforeEach, describe, expect, it } from 'vitest';
import request from 'supertest';
import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { createApp } from '../src/app.js';
import { User } from '../src/infrastructure/database/models/user.model.js';
import { hashPassword, verifyPassword } from '../src/domain/auth/password-hasher.js';
import { env } from '../src/config/env.js';
import { AUTH_COOKIE_NAME } from '../src/api/auth-cookie.js';

let mongo;
const app = createApp();

beforeAll(async () => {
  mongo = await MongoMemoryServer.create();
  await mongoose.connect(mongo.getUri());
});

beforeEach(async () => {
  await User.deleteMany({});
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongo.stop();
});

describe('authentication API', () => {
  it('signs up a user, sets an HTTP-only cookie, and returns no password', async () => {
    const response = await request(app).post('/api/v1/auth/signup').send({
      name: ' Asha Rao ', email: ' ASHA@example.com ', password: 'StrongPass123!'
    });

    expect(response.status).toBe(201);
    expect(response.body.user).toMatchObject({ name: 'Asha Rao', email: 'ASHA@example.com', membershipStatus: 'NONE' });
    expect(response.body.user).not.toHaveProperty('passwordHash');
    expect(response.headers['set-cookie'][0]).toContain(`${AUTH_COOKIE_NAME}=`);
    expect(response.headers['set-cookie'][0].toLowerCase()).toContain('httponly');

    const stored = await User.findOne({ normalizedEmail: 'asha@example.com' }).select('+passwordHash');
    expect(stored.passwordHash).not.toBe('StrongPass123!');
    expect(await verifyPassword(stored.passwordHash, 'StrongPass123!')).toBe(true);
  });

  it('rejects duplicate normalized emails, including casing differences', async () => {
    await request(app).post('/api/v1/auth/signup').send({ name: 'Asha', email: 'asha@example.com', password: 'StrongPass123!' });
    const response = await request(app).post('/api/v1/auth/signup').send({ name: 'Another Asha', email: ' ASHA@EXAMPLE.COM ', password: 'StrongPass123!' });
    expect(response.status).toBe(409);
    expect(response.body.error.code).toBe('EMAIL_ALREADY_EXISTS');
  });

  it('rejects invalid signup input', async () => {
    const response = await request(app).post('/api/v1/auth/signup').send({ name: '', email: 'not-an-email', password: 'short' });
    expect(response.status).toBe(400);
    expect(response.body.error.code).toBe('VALIDATION_ERROR');
  });

  it('logs in with valid credentials and rejects invalid credentials generically', async () => {
    await request(app).post('/api/v1/auth/signup').send({ name: 'Asha', email: 'asha@example.com', password: 'StrongPass123!' });
    const success = await request(app).post('/api/v1/auth/login').send({ email: 'ASHA@example.com', password: 'StrongPass123!' });
    expect(success.status).toBe(200);
    expect(success.body.user).not.toHaveProperty('passwordHash');

    const failure = await request(app).post('/api/v1/auth/login').send({ email: 'missing@example.com', password: 'wrong-password' });
    expect(failure.status).toBe(401);
    expect(failure.body.error.code).toBe('INVALID_CREDENTIALS');
    expect(failure.body.error.message).toBe('Invalid email or password.');
  });

  it('requires authentication for /me', async () => {
    const response = await request(app).get('/api/v1/auth/me');
    expect(response.status).toBe(401);
    expect(response.body.error.code).toBe('AUTH_REQUIRED');
  });

  it('rejects invalid and expired JWTs', async () => {
    const invalid = await request(app).get('/api/v1/auth/me').set('Cookie', `${AUTH_COOKIE_NAME}=not-a-token`);
    expect(invalid.status).toBe(401);
    expect(invalid.body.error.code).toBe('INVALID_TOKEN');

    const expiredToken = jwt.sign({ sub: new mongoose.Types.ObjectId().toString(), tokenType: 'access' }, env.JWT_SECRET, {
      algorithm: 'HS256', issuer: env.JWT_ISSUER, audience: env.JWT_AUDIENCE, expiresIn: -1
    });
    const expired = await request(app).get('/api/v1/auth/me').set('Cookie', `${AUTH_COOKIE_NAME}=${expiredToken}`);
    expect(expired.status).toBe(401);
    expect(expired.body.error.code).toBe('INVALID_TOKEN');
  });

  it('returns the current database user and rejects a nonexistent JWT user', async () => {
    const agent = request.agent(app);
    await agent.post('/api/v1/auth/signup').send({ name: 'Asha', email: 'asha@example.com', password: 'StrongPass123!' });
    const current = await agent.get('/api/v1/auth/me');
    expect(current.status).toBe(200);
    expect(current.body.user.email).toBe('asha@example.com');
    expect(current.body.user).not.toHaveProperty('passwordHash');

    const token = jwt.sign({ sub: new mongoose.Types.ObjectId().toString(), tokenType: 'access' }, env.JWT_SECRET, {
      algorithm: 'HS256', issuer: env.JWT_ISSUER, audience: env.JWT_AUDIENCE, expiresIn: '15m'
    });
    const missing = await request(app).get('/api/v1/auth/me').set('Cookie', `${AUTH_COOKIE_NAME}=${token}`);
    expect(missing.status).toBe(401);
    expect(missing.body.error.code).toBe('AUTH_REQUIRED');
  });

  it('clears the authentication cookie on logout', async () => {
    const agent = request.agent(app);
    await agent.post('/api/v1/auth/signup').send({ name: 'Asha', email: 'asha@example.com', password: 'StrongPass123!' });
    const response = await agent.post('/api/v1/auth/logout');
    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.headers['set-cookie'][0]).toContain(`${AUTH_COOKIE_NAME}=;`);
  });
});

describe('password hashing', () => {
  it('uses a one-way Argon2id hash', async () => {
    const hash = await hashPassword('StrongPass123!');
    expect(hash).toContain('$argon2id$');
    expect(hash).not.toContain('StrongPass123!');
    expect(await verifyPassword(hash, 'StrongPass123!')).toBe(true);
  });
});
