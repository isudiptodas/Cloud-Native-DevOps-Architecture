import app from '../index.js';
import request from 'supertest';

describe("auth /POST", () => {

    it('should create a new user if not present', async () => {
        const res = await request(app)
        .post('/api/register')
        .send({
            name: "testing",
            email: "test@gmail.com",
            password: "test123@"
        });

        expect(res.status).toBe(200);
    });

    it('should login a user if present', async () => {
        const res = await request(app)
        .post('/api/login')
        .send({
            email: "test@gmail.com",
            password: "test123@"
        });

        expect(res.status).toBe(200);
        expect(res.body).toHaveProperty("token");
    });
});