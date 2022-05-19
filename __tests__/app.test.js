const request = require("supertest");
const app = require("../app");
const db = require("../db/connection");
const seed = require("../db/seeds/seed.js");
const data = require("../db/data/test-data/index");

beforeEach(() => {
  return seed(data);
});

afterAll(() => {
  return db.end();
});

describe("GET /api/categories", () => {
  test("status code 200, responds with an array of category objects", () => {
    return request(app)
      .get("/api/categories")
      .expect(200)
      .then(({ body }) => {
        const { categories } = body;
        expect(categories).toBeInstanceOf(Array);
        expect(categories).toHaveLength(4);
        categories.forEach((category) => {
          expect(category).toEqual(
            expect.objectContaining({
              slug: expect.any(String),
              description: expect.any(String),
            })
          );
        });
      });
  });
});

describe("GET /api/users", () => {
  test("status code 200, responds with an array of user objects", () => {
    return request(app)
      .get("/api/users")
      .expect(200)
      .then(({ body }) => {
        const { users } = body;
        expect(users).toBeInstanceOf(Array);
        expect(users).toHaveLength(4);
        users.forEach((user) => {
          expect(user).toEqual(
            expect.objectContaining({
              username: expect.any(String),
              name: expect.any(String),
              avatar_url: expect.any(String),
            })
          );
        });
      });
  });
});

describe("GET /api/reviews/", () => {
  test("status code 200, responds with an array of review objects", () => {
    return request(app)
      .get("/api/reviews/")
      .expect(200)
      .then(({ body }) => {
        const { reviews } = body;
        expect(reviews).toBeInstanceOf(Array);
        expect(reviews).toHaveLength(13);
        expect(reviews).toBeSortedBy("created_at", { descending: true });
        reviews.forEach((review) => {
          expect(review).toEqual(
            expect.objectContaining({
              owner: expect.any(String),
              title: expect.any(String),
              review_id: expect.any(Number),
              category: expect.any(String),
              review_img_url: expect.any(String),
              created_at: expect.any(String),
              votes: expect.any(Number),
              comment_count: expect.any(Number),
            })
          );
          expect({ review }).toEqual(
            expect.not.objectContaining({ review_body: expect.anything() })
          );
        });
      });
  });
});

describe("GET /api/reviews/:review_id", () => {
  test("status code 200, responds with a single matching review", () => {
    const review_id = 3;
    return request(app)
      .get(`/api/reviews/${review_id}`)
      .expect(200)
      .then(({ body }) => {
        expect.objectContaining({
          review_id: review_id,
          title: "Ultimate Werewolf",
          review_body: "We couldn't find the werewolf!",
          designer: "Akihisa Okui",
          review_img_url:
            "https://www.golenbock.com/wp-content/uploads/2015/01/placeholder-user.png",
          votes: 5,
          category: "social deduction",
          owner: "bainesface",
          created_at: new Date(1610964101251).toISOString(),
        });
      });
  });

  test("status code 200, responds with a single matching review which now also contains the amount of comments the review has gotten", () => {
    const review_id = 3;
    return request(app)
      .get(`/api/reviews/${review_id}`)
      .expect(200)
      .then(({ body }) => {
        expect(body.review).toEqual({
          review_id: review_id,
          title: "Ultimate Werewolf",
          review_body: "We couldn't find the werewolf!",
          designer: "Akihisa Okui",
          review_img_url:
            "https://www.golenbock.com/wp-content/uploads/2015/01/placeholder-user.png",
          votes: 5,
          category: "social deduction",
          owner: "bainesface",
          created_at: new Date(1610964101251).toISOString(),
          comment_count: 3,
        });
      });
  });
});

describe("Error Handling /api/reviews/:review_id", () => {
  test("task 4: status code 404, responds with an error message when the path doesn't exist", () => {
    return request(app)
      .get("/api/reviews/9999")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toEqual("This review doesn't exist!");
      });
  });

  test("task 4: status code 400, responds with an error message when the parametric endpoint isnt a number", () => {
    return request(app)
      .get("/api/reviews/notanumber")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("'notanumber' is not a valid review number!");
      });
  });

  test("task 5: status code 404, responds with an error message when the number doesnt match a review ", () => {
    const newVote = { inc_votes: 2 };
    return request(app)
      .patch("/api/reviews/9999")
      .expect(404)
      .send(newVote)
      .then(({ body }) => {
        expect(body.msg).toBe("This review doesn't exist!");
      });
  });

  test("task 5: status code 400, responds with an error message when the id is not a number", () => {
    const newVote = { inc_votes: 2 };
    return request(app)
      .patch("/api/reviews/iamnotanumber")
      .expect(400)
      .send(newVote)
      .then(({ body }) => {
        expect(body.msg).toBe("'iamnotanumber' is not a valid review number!");
      });
  });

  test("task 5: status code 400, responds with an error message when the vote count is not a number", () => {
    const newVote = { inc_votes: "string" };
    return request(app)
      .patch("/api/reviews/3")
      .expect(400)
      .send(newVote)
      .then(({ body }) => {
        expect(body.msg).toBe("'string' is not a valid value!");
      });
  });
});

describe("GET /api/reviews/:review_id/comments", () => {
  test("status code 200, responds with the comments for the corresponding review", () => {
    const review_id = 3;
    return request(app)
      .get(`/api/reviews/${review_id}/comments`)
      .expect(200)
      .then(({ body }) => {
        const { comments } = body;
        expect(!!comments.length).toEqual(true);
        comments.forEach((comment) => {
          expect(comment).toEqual(
            expect.objectContaining({
              comment_id: expect.any(Number),
              body: expect.any(String),
              review_id: expect.any(Number),
              author: expect.any(String),
              votes: expect.any(Number),
              created_at: expect.any(String),
            })
          );
        });
      });
  });

  describe("Error Handling /api/reviews/:review_id/comments", () => {
    test("task 9: status code 404, responds when the review doesn't yet exist", () => {
      return request(app)
        .get("/api/reviews/000/comments")
        .expect(404)
        .then(({ body }) => {
          expect(body.msg).toBe(
            "There are no comments because this review doesn't exist!"
          );
        });
    });
  });

  test("task 9: status code 400, something that is not a number is passed in", () => {
    return request(app)
      .get("/api/reviews/iamnotanumber/comments")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("'iamnotanumber' is not a valid review number!");
      });
  });

  test("task 9: status code 200, review exists, but has no comments ", () => {
    return request(app)
      .get("/api/reviews/1/comments")
      .expect(200)
      .then(({ body }) => {
        expect(body.comments).toEqual([]);
      });
  });
});

describe("PATCH /api/reviews/:review_id", () => {
  test("status code 200, responds with a changed vote count (increase)", () => {
    const newVote = { inc_votes: 20 };
    return request(app)
      .patch("/api/reviews/2")
      .send(newVote)
      .expect(200)
      .then(({ body }) => {
        expect(body.review).toEqual({
          review_id: 2,
          title: "Jenga",
          designer: "Leslie Scott",
          owner: "philippaclaire9",
          review_img_url:
            "https://www.golenbock.com/wp-content/uploads/2015/01/placeholder-user.png",
          review_body: "Fiddly fun for all the family",
          category: "dexterity",
          created_at: new Date(1610964101251).toISOString(),
          votes: 25,
        });
      });
  });

  test("status code 200, responds with a changed vote count (decrease)", () => {
    const newVote = { inc_votes: -20 };
    return request(app)
      .patch("/api/reviews/2")
      .send(newVote)
      .expect(200)
      .then(({ body }) => {
        expect(body.review).toEqual({
          review_id: 2,
          title: "Jenga",
          designer: "Leslie Scott",
          owner: "philippaclaire9",
          review_img_url:
            "https://www.golenbock.com/wp-content/uploads/2015/01/placeholder-user.png",
          review_body: "Fiddly fun for all the family",
          category: "dexterity",
          created_at: new Date(1610964101251).toISOString(),
          votes: -15,
        });
      });
  });
});

describe("Error Handling General", () => {
  test("task 3: status code 404, responds with an error message when the path doesn't exist", () => {
    return request(app)
      .get("/api/notanurl")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("This page doesn't exist!");
      });
  });
});

describe('"POST /api/reviews/:review_id/comments"', () => {
  test("adds a new comment and responds with it ", () => {
    const review_id = 3;
    const newComment = {
      username: "mallionaire",
      body: "I like doggos :3",
    };

    return request(app)
      .post(`/api/reviews/${review_id}/comments`)
      .expect(201)
      .send(newComment)
      .then(({ body }) => {
        expect(body.newComment).toEqual({
          author: "mallionaire",
          body: "I like doggos :3",
          comment_id: 7,
          created_at: expect.any(String),
          review_id: 3,
          votes: 0,
        });
      });
  });
});

describe("Error Handling for POST /api/reviews/:review_id/comments", () => {
  test("task 10: code 400, body does not contain both mandatory keys", () => {
    const review_id = 3;
    const newComment = {
      username: "mallionaire",
    };
    return request(app)
      .post(`/api/reviews/${review_id}/comments`)
      .expect(400)
      .send(newComment)
      .then(({ body }) => {
        expect(body.msg).toBe("Body doesn't contain mandatory keys");
      });
  });

  test("task 10: code 400, body does not contain both mandatory keys", () => {
    const review_id = 333333;
    const newComment = {
      username: "mallionaire",
      body: "I like doggos :3",
    };
    return request(app)
      .post(`/api/reviews/${review_id}/comments`)
      .expect(404)
      .send(newComment)
      .then(({ body }) => {
        expect(body.msg).toBe("You can't add a comment here because the review doesn't exist!");
      });
  });

  test("task 10: code 404, a user not in the database tries to post", () => {
    const review_id = 3;
    const newComment = {
      username: "xViolaine",
      body: "I like doggos :3",
    };
    return request(app)
      .post(`/api/reviews/${review_id}/comments`)
      .expect(404)
      .send(newComment)
      .then(({ body }) => {
        expect(body.msg).toBe("This username doesn't exist!");
      });
  });
});
