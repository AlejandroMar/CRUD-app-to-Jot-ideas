const express = require('express');
const exphbs = require('express-handlebars');
const mongoose = require('mongoose');
const methodOverride = require('method-override');

const app = express();
const port = 5000;

app.engine('handlebars', exphbs({
    defaultLayout: 'main'
}));
app.set('view engine', 'handlebars');


// parse application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: false }));
// parse application/json
app.use(express.json());

// override with POST having ?_method=DELETE
app.use(methodOverride('_method'))


//set promise to native global
mongoose.Promise = global.Promise

//Connect to mongoose
mongoose.connect('mongodb://localhost:27017/vidjot-dev')
    .then(() => console.log('MongoDB Connected...'))
    .catch(err => console.log(err));

//Load Idea model

const indexRouter = require('./routes/indexRouter');
const aboutRouter = require('./routes/aboutRouter');
const ideasRouter = require('./routes/ideasRouter');

app.use('/', indexRouter);
app.use('/about', aboutRouter);
app.use('/ideas', ideasRouter);






app.listen(port, () => {
    console.log(`Server started on port: ${port}`);
});
