const request = require('supertest');
const app = require('../server');

describe('Servidor', () => {
  it('responde 404 en una ruta que no existe', async () => {
    const res = await request(app).get('/api/ruta-inexistente');
    expect(res.status).toBe(404);
  });
});