const { query } = require("../db/connection");
const db = require("../db/connection");

exports.selectCategories = () => {
    return db.query(`SELECT * FROM categories`).then((categories) => {
        return categories.rows;
    });
};

exports.selectReviewByID = (review_id) => {
    return db
        .query(
            `SELECT reviews.*, CAST (COUNT(comments) AS INTEGER) AS comment_count
    FROM reviews
    LEFT JOIN comments
    ON reviews.review_id = comments.review_id
    WHERE reviews.review_id = $1
    GROUP BY reviews.review_id`,
            [review_id]
        )
        .then((review) => {
            return review.rows[0];
        });
};

exports.updateReviewByID = (review_id, votes) => {
    return db
        .query(
            "UPDATE reviews SET votes = votes + $1 WHERE review_id = $2 RETURNING *",
            [votes, review_id]
        )
        .then((review) => {
            return review.rows[0];
        });
};

exports.selectUsers = () => {
    return db.query(`SELECT * FROM users`).then((users) => {
        return users.rows;
    });
};

exports.selectReviews = (sort_by = "created_at", order = "desc", category) => {
    let queryValues = [];
    const validSortBy = ["created_at", "owner", "category", "review_id", "votes", "comment_count"];
    let queryString = `SELECT reviews.owner, reviews.review_id, reviews.created_at, reviews.title, reviews.category, reviews.review_img_url, reviews.votes, reviews.review_body, CAST (COUNT(comments) AS INTEGER) AS comment_count
    FROM reviews
    LEFT JOIN comments
    ON reviews.review_id = comments.review_id`
    if (category) {
        queryValues.push(category)
        queryString += ` WHERE category = $${queryValues.length}`;
    }
    queryString += ` GROUP BY reviews.review_id`;
    if (validSortBy.includes(sort_by)) {
        if ((order === "asc")) {
            queryString += ` ORDER BY ${sort_by} ASC`;
        } else if ((order === "desc")) {
            queryString += ` ORDER BY ${sort_by} DESC`;
        } else {
            return Promise.reject({
                status: 400,
                msg: "Bad Request",
            });
        }
    } else {
        return Promise.reject({
            status: 400,
            msg: "Bad Request"
        })
    }
    return db.query(queryString, queryValues).then((reviews) => {
        return reviews.rows;
    });
};

exports.selectCommentsByID = (review_id) => {
    return db
        .query(`SELECT * FROM comments WHERE review_id = $1 ORDER BY created_at DESC`, [review_id])
        .then((comments) => {
            return comments.rows;
        });
};

exports.addComment = (newComment, review_id) => {
    const { username, body } = newComment;
    return db.query(`INSERT INTO comments (author, body, review_id) VALUES ($1, $2, $3) RETURNING *`, [username, body, review_id]).then(({ rows }) => rows[0]);
};

exports.removeCommentByID = (comment_id) => {
    return db.query(`DELETE FROM comments WHERE comment_id = $1`, [comment_id]).then((comment) => {
        return comment.rows[0]
    })
}

exports.selectCommentByID = (comment_id) => {
        return db.query(`SELECT * FROM comments WHERE comment_id = $1`, [comment_id]).then((comment) => {
            console.log(comment.rows)
            return comment.rows[0]
        })
}
