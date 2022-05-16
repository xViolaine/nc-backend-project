const categories = require('../db/data/test-data/categories');
const { selectCategories } = require('../models/models-games');

exports.getAllCategories = (req, res, next) => {
    selectCategories()
    .then((categories) => {
        res.status(200).send({ categories });
    })
    .catch(next);
};