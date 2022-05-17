const categories = require('../db/data/test-data/categories');
const { selectCategories, selectReviewByID, updateReviewByID } = require('../models/models-games');

exports.getAllCategories = (req, res, next) => {
    selectCategories()
        .then((categories) => {
            res.status(200).send({ categories });
        })
        .catch(next);
};

exports.getReviewByID = (req, res, next) => {
    const { review_id } = req.params;
    if (isNaN(review_id)) {
        return next({
            status: 400,
            msg: `'${review_id}' is not a valid review number!`,
        });
    }
    selectReviewByID(review_id)
        .then((review) => {
            if (!review) {
                return Promise.reject({
                    status: 404,
                    msg: `This review doesn't exist!`,
                });
            } else {
                res.status(200).send({ review });
            }
        })
        .catch(next);
}

exports.patchReviewByID = (req, res, next) => {
    const { review_id } = req.params;
    const { inc_votes } = req.body;

    if (isNaN(review_id)) {
        return next({
            status: 400,
            msg: `'${review_id}' is not a valid review number!`,
        });
    }

    if (isNaN(inc_votes)) {
        return next({
            status: 400,
            msg: `'${inc_votes}' is not a valid value!`,
        });
    }

    updateReviewByID(review_id, inc_votes)
        .then((review) => {
        if (!review) {
            return Promise.reject({
                status: 404,
                msg: `This review doesn't exist!`,
            });
        } else {
        res.status(200).send({ review })
        }
    })
    .catch(next);
}