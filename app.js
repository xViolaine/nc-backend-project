const express = require('express');
const { getAllCategories, getReviewByID, patchReviewByID, getAllUsers, getAllReviews, getCommentsByID, createComment, deleteCommentByID
} = require('./controllers/controller-games');
const endpoints = require('./endpoints.json')
const cors = require('cors');

const app = express();
app.use(cors());

app.use(express.json());

app.get('/api', (req, res, next) => {
    res.send(endpoints)
})

app.get('/api/categories', getAllCategories);
app.get('/api/users', getAllUsers);

app.get('/api/reviews', getAllReviews);


app.get('/api/reviews/:review_id', getReviewByID);
app.get('/api/reviews/:review_id/comments', getCommentsByID);

app.post('/api/reviews/:review_id/comments', createComment);

app.patch('/api/reviews/:review_id', patchReviewByID);

app.delete('/api/comments/:comment_id', deleteCommentByID);

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