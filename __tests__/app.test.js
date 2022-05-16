const request = require('supertest');
const app = require('../app');
const db = require ('../db/connection');
const seed = require('../db/seeds/seed.js');
const data = require('../db/data/test-data/index')

beforeEach(() => {
    return seed(data);
  });

  afterAll(() => {
    return db.end();
  });

describe("GET /api/categories", () => {
    test("status code 200, responds with an array of category objects", () => {
        return request(app)
        .get('/api/categories')
        .expect(200)
        .then(({ body }) => {
            const { categories } = body;
            expect(categories).toBeInstanceOf(Array);
            expect(categories).toHaveLength(4);
            categories.forEach((category) => {
                expect(category).toEqual(
                    expect.objectContaining({
                    slug: expect.any(String),
                    description: expect.any(String)
                }))
            })
        })
    });
})

describe("Error Handling", () => {
    test("status code 404, responds with an error message when the path doesn't exist", () => {
        return request(app)
        .get('/api/notanurl')
        .expect(404)
        .then(({ body }) => {
            expect(body.msg).toBe("This route doesn't exist!");
        });
    })
})