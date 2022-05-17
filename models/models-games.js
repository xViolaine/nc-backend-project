const { query } = require('../db/connection');
const db = require('../db/connection');

exports.selectCategories = () => {
    return db.query(`SELECT * FROM categories`).then((categories) => {
        return categories.rows;
    })
};

exports.selectReviewByID = (review_id) => {
    return db.query(`SELECT * FROM reviews WHERE review_id = $1`, [review_id]).then((review) => {
        return review.rows[0]
    })
};

exports.updateReviewByID = (review_id, votes) => {
    return db.query('UPDATE reviews SET votes = votes + $1 WHERE review_id = $2 RETURNING *', [votes, review_id]).then((review) => {
            return review.rows[0]

        })
}