const express = require('express');
const { getAllCategories, getReviewByID } = require('./controllers/controller-games');

const app = express();

app.use(express.json());

app.get('/api/categories', getAllCategories);

app.get('/api/reviews/:review_id', getReviewByID);

// app.all('/api/reviews/*', (req, res) => {
//     res.status(404).send({ msg: "This review doesn't exist!" })
// })

app.all('/*', (req, res) => {
    res.status(404).send({ msg: "This page doesn't exist!" })
})

app.use((err, req, res, next) => {
    console.log(err);
    if (err.status && err.msg) {
        res.status(err.status).send({ msg: err.msg });
      }
    res.status(500).send('Server Error! :(');
});

module.exports = app;