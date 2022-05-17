const request = require('supertest');
const app = require('../app');
const db = require('../db/connection');
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

describe("GET /api/reviews/:review_id", () => {
    test("status code 200, responds with a single matching review", () => {
        const review_id = 3;
        return request(app)
            .get(`/api/reviews/${review_id}`)
            .expect(200)
            .then(({ body }) => {
                expect(body.review).toEqual({
                    review_id: review_id,
                    title: 'Ultimate Werewolf',
                    review_body: "We couldn't find the werewolf!",
                    designer: 'Akihisa Okui',
                    review_img_url: 'https://www.golenbock.com/wp-content/uploads/2015/01/placeholder-user.png',
                    votes: 5,
                    category: 'social deduction',
                    owner: 'bainesface',
                    created_at: new Date(1610964101251).toISOString()
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
                expect(body.msg).toBe("This page doesn't exist!");
            });
    })

    test("status code 404, responds with an error message when the path doesn't exist", () => {
        return request(app)
            .get('/api/reviews/9999')
            .expect(404)
            .then(({ body }) => {
                expect(body.msg).toEqual("This review doesn't exist!");
            });
    })

    test("status code 400, responds with an error message when the parametric endpoint isnt a number", () => {
        return request(app)
            .get('/api/reviews/notanumber')
            .expect(400)
            .then(({ body }) => {
                expect(body.msg).toBe("'notanumber' is not a valid review number!");
            });
    })
})
