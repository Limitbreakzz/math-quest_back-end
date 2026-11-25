const { describe, it, before, after } = require('node:test');
const assert = require('node:assert/strict');
const http = require('http');
const jwt = require('jsonwebtoken');
const { createApp } = require('../src/app');
const env = require('../src/utils/env');

let server;
let baseUrl;

before(async () => {
  const app = createApp();
  server = http.createServer(app);
  await new Promise((resolve) => server.listen(0, '127.0.0.1', resolve));
  const { port } = server.address();
  baseUrl = `http://127.0.0.1:${port}/api`;
});

after(async () => {
  await new Promise((resolve) => server.close(resolve));
});

const request = async (path, options = {}) => {
  const res = await fetch(`${baseUrl}${path}`, {
    ...options,
    headers: { 'Content-Type': 'application/json', ...(options.headers || {}) },
  });
  const body = await res.json();
  return { status: res.status, headers: res.headers, body };
};

describe('MathQuest Backend API & Plain-JS Validation', () => {
  it('GET /health returns 200 success response with X-Request-Id', async () => {
    const res = await request('/health');
    assert.equal(res.status, 200);
    assert.equal(res.body.status, 'success');
    assert.ok(res.headers.get('x-request-id'));
  });

  it('Unknown route returns 404 error', async () => {
    const res = await request('/does-not-exist');
    assert.equal(res.status, 404);
    assert.equal(res.body.status, 'error');
  });

  it('Protected route without token returns 401', async () => {
    const res = await request('/profiles/me');
    assert.equal(res.status, 401);
    assert.equal(res.body.status, 'error');
  });

  it('Protected route with invalid JWT returns 401', async () => {
    const res = await request('/profiles/me', {
      headers: { Authorization: 'Bearer not-a-valid-jwt' },
    });
    assert.equal(res.status, 401);
    assert.equal(res.body.status, 'error');
  });

  it('Protected route with expired JWT returns 401', async () => {
    const expiredToken = jwt.sign({ sub: '00000000-0000-0000-0000-000000000001' }, env.jwtSecret, {
      expiresIn: -10,
    });
    const res = await request('/profiles/me', {
      headers: { Authorization: `Bearer ${expiredToken}` },
    });
    assert.equal(res.status, 401);
    assert.equal(res.body.status, 'error');
  });

  it('Auth validation rejects invalid email, short username, and invalid demo role with 400', async () => {
    const badLogin = await request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email: 'not-an-email' }),
    });
    assert.equal(badLogin.status, 400);
    assert.equal(badLogin.body.status, 'error');

    const badRegister = await request('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ email: 'test@example.com', username: 'a', displayName: 'Test' }),
    });
    assert.equal(badRegister.status, 400);
    assert.equal(badRegister.body.status, 'error');

    const badDemo = await request('/auth/demo', {
      method: 'POST',
      body: JSON.stringify({ role: 'SUPERADMIN' }),
    });
    assert.equal(badDemo.status, 400);
    assert.equal(badDemo.body.status, 'error');
  });

  it('Multiplayer validation rejects missing fields and out-of-range numbers with 400', async () => {
    const emptyFields = await request('/multiplayer/rooms', {
      method: 'POST',
      body: JSON.stringify({ userId: '', displayName: '' }),
    });
    assert.equal(emptyFields.status, 400);
    assert.equal(emptyFields.body.status, 'error');

    const badQuestionCount = await request('/multiplayer/rooms', {
      method: 'POST',
      body: JSON.stringify({ userId: 'u1', displayName: 'Player 1', questionCount: 99 }),
    });
    assert.equal(badQuestionCount.status, 400);
    assert.equal(badQuestionCount.body.status, 'error');

    const badDifficulty = await request('/multiplayer/rooms', {
      method: 'POST',
      body: JSON.stringify({ userId: 'u1', displayName: 'Player 1', difficulty: 'IMPOSSIBLE' }),
    });
    assert.equal(badDifficulty.status, 400);
    assert.equal(badDifficulty.body.status, 'error');
  });

  it('Multiplayer room lifecycle returns success on create/join and error on full/missing room', async () => {
    const created = await request('/multiplayer/rooms', {
      method: 'POST',
      body: JSON.stringify({ userId: 'u1', displayName: 'Player 1' }),
    });
    assert.equal(created.status, 200);
    assert.equal(created.body.status, 'success');
    const code = created.body.data.roomCode;

    const joined = await request(`/multiplayer/rooms/${code}/join`, {
      method: 'POST',
      body: JSON.stringify({ userId: 'u2', displayName: 'Player 2' }),
    });
    assert.equal(joined.status, 200);
    assert.equal(joined.body.status, 'success');

    const full = await request(`/multiplayer/rooms/${code}/join`, {
      method: 'POST',
      body: JSON.stringify({ userId: 'u3', displayName: 'Player 3' }),
    });
    assert.equal(full.status, 500);
    assert.equal(full.body.status, 'error');
    assert.equal(full.body.message, 'Internal server error');

    const missing = await request('/multiplayer/rooms/ZZZZZZ');
    assert.equal(missing.status, 500);
    assert.equal(missing.body.status, 'error');
    assert.equal(missing.body.message, 'Internal server error');
  });

  it('Kahoot live quiz room lifecycle creates 6-digit PIN, joins players, and validates inputs', async () => {
    const badCreate = await request('/kahoot/rooms', {
      method: 'POST',
      body: JSON.stringify({ hostUserId: '', hostName: '' }),
    });
    assert.equal(badCreate.status, 400);
    assert.equal(badCreate.body.status, 'error');

    const created = await request('/kahoot/rooms', {
      method: 'POST',
      body: JSON.stringify({ hostUserId: 'host1', hostName: 'Teacher', questionCount: 5, timePerQuestion: 20 }),
    });
    assert.equal(created.status, 200);
    assert.equal(created.body.status, 'success');
    assert.match(created.body.data.pin, /^\d{6}$/);

    const joined = await request(`/kahoot/rooms/${created.body.data.pin}/join`, {
      method: 'POST',
      body: JSON.stringify({ playerId: 'p2', displayName: 'Student 1' }),
    });
    assert.equal(joined.status, 200);
    assert.equal(joined.body.data.players.length, 2);
  });
});
