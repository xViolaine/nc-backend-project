const { query } = require('../db/connection');
const db = require('../db/connection');

exports.selectCategories = () => {
    return db.query(`SELECT * FROM categories`).then((categories) => {
        return categories.rows;
    })
};

exports.selectReviewByID = (review_id) => {
    return db.query(`SELECT reviews.*, CAST (COUNT(comments) AS INTEGER) AS comment_count
    FROM reviews
    LEFT JOIN comments
    ON reviews.review_id = comments.review_id
    WHERE reviews.review_id = $1
    GROUP BY reviews.review_id`, [review_id]).then((review) => {
        return review.rows[0]
    })
};

exports.updateReviewByID = (review_id, votes) => {
    return db.query('UPDATE reviews SET votes = votes + $1 WHERE review_id = $2 RETURNING *', [votes, review_id]).then((review) => {
        return review.rows[0]

    })
}

exports.selectUsers = () => {
    return db.query(`SELECT * FROM users`).then((users) => {
        return users.rows;
    })
};

exports.selectReviews = () => {
    return db.query(`SELECT reviews.owner, reviews.review_id, reviews.created_at, reviews.title, reviews.category, reviews.review_img_url, reviews.votes, CAST (COUNT(comments) AS INTEGER) AS comment_count
    FROM reviews
    LEFT JOIN comments
    ON reviews.review_id = comments.review_id
    GROUP BY reviews.review_id
    ORDER BY created_at DESC`).then((reviews) => {
        return reviews.rows;
    })
}

exports.selectCommentsByID = (review_id) => {
    return db.query(`SELECT * FROM comments WHERE review_id = $1`, [review_id]).then((comments) => {
        return comments.rows
    })
}