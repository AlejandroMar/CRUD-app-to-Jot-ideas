const express = require('express');
const exphbs  = require('express-handlebars');
const mongoose = require('mongoose');

const app = express();

//set promise to native global
mongoose.Promise = global.Promise

//Connect to mongoose
mongoose.connect('mongodb://localhost:27017/vidjot-dev')
    .then(() => console.log('MongoDB Connected...'))
    .catch(err => console.log(err))

//Load Idea model
const IdeaModel = require('./models/Idea');



const port = 5000;

app.engine('handlebars', exphbs({
    defaultLayout: 'main'
}));
app.set('view engine', 'handlebars');


app.get('/', (req, res, next) => {

    const title = 'Welcome Alejandro';
    // with es6
    res.render('index', { title });
});

app.get('/about', (req, res, next) => {
    res.render('about')
});

app.get('/ideas/add', (req, res, next) => {
    res.render('ideas/add');
});





app.listen(port, () => {
    console.log(`Server started on port: ${port}`);
});
