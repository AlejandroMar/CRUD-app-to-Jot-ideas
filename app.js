const express = require('express');
const exphbs = require('express-handlebars');
const mongoose = require('mongoose');
const methodOverride = require('method-override');
const flash = require('connect-flash');
const session = require('express-session');
const passport = require('passport');

//Load routes
const indexRouter = require('./routes/indexRouter');
const aboutRouter = require('./routes/aboutRouter');
const ideasRouter = require('./routes/ideasRouter');
const usersRouter = require('./routes/usersRouter');

//passport config
require('./config/passport')(passport);

const app = express();
const port = 5000;


//set promise to native global
mongoose.Promise = global.Promise

//Connect to mongoose
mongoose.connect('mongodb://localhost:27017/vidjot-dev')
    .then(() => console.log('MongoDB Connected...'))
    .catch(err => console.log(err));


app.engine('handlebars', exphbs({
    defaultLayout: 'main'
}));
app.set('view engine', 'handlebars');


// parse application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: false }));
// parse application/json
app.use(express.json());

// override with POST having ?_method=DELETE
app.use(methodOverride('_method'));

//express session middleware
app.use(session({
    secret: 'secret',
    resave: false,
    saveUninitialized: true
  }));
//mount flash
app.use(flash());

//Global variables
app.use((req, res, next) => {
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error');
    next();
});



app.use('/', indexRouter);
app.use('/about', aboutRouter);
app.use('/ideas', ideasRouter);
app.use('/users', usersRouter);


app.listen(port, () => {
    console.log(`Server started on port: ${port}`);
});
