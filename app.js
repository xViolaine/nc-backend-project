const express = require('express');
const { getAllCategories } = require('./controllers/controller-games');

const app = express();

app.use(express.json());

app.get('/api/categories', getAllCategories);

app.all('/*', (req, res) => {
    res.status(404).send({ msg: "This route doesn't exist!" })
})

app.use((err, req, res, next) => {
    console.log(err);
    res.status(500).send('Server Error! :(');
});

module.exports = app;